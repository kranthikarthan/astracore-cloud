package com.astracore.systemtests;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = SystemTestApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@Disabled("Pending: wire billing-service and gl-service into a shared Spring context for full E2E test")
class BillingToGlE2EIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    @Container
    static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.3.0"));

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // Single DB used by both services for the test
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.url", postgres::getJdbcUrl);
        registry.add("spring.flyway.user", postgres::getUsername);
        registry.add("spring.flyway.password", postgres::getPassword);

        // Kafka
        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
    }

    @LocalServerPort
    int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void creatingInvoice_shouldResultInBalancedGlPosting() throws Exception {
        // Seed minimal reference data required by billing-service
        UUID partyIdFrom = UUID.randomUUID();
        UUID partyIdTo = UUID.randomUUID();
        UUID productId = UUID.randomUUID();

        jdbcTemplate.update("INSERT INTO party (party_id, party_type, version) VALUES (?, 'ORGANIZATION', 0)", partyIdFrom);
        jdbcTemplate.update("INSERT INTO party (party_id, party_type, version) VALUES (?, 'PERSON', 0)", partyIdTo);
        jdbcTemplate.update("INSERT INTO product (product_id, product_name, product_type, version) VALUES (?, 'Consulting', 'SERVICE', 0)", productId);

        // Build invoice payload as BillingController expects (shape compatible with InvoiceDTO)
        BigDecimal amount = new BigDecimal("200.00");

        Map<String, Object> money = new HashMap<>();
        money.put("amount", amount);
        money.put("currency", "USD");

        Map<String, Object> line = new HashMap<>();
        line.put("invoiceItemSeqId", 1);
        line.put("productId", productId.toString());
        line.put("description", "Consulting Services");
        line.put("quantity", new BigDecimal("1.0"));
        line.put("amount", money);

        Map<String, Object> invoicePayload = new HashMap<>();
        invoicePayload.put("invoiceTypeId", "SALES_INVOICE");
        invoicePayload.put("partyIdFrom", partyIdFrom.toString());
        invoicePayload.put("partyIdTo", partyIdTo.toString());
        invoicePayload.put("invoiceDate", LocalDate.now().toString());
        invoicePayload.put("currencyUomId", "USD");
        invoicePayload.put("statusId", "IN_PROCESS");
        invoicePayload.put("totalAmount", money);
        invoicePayload.put("lines", Collections.singletonList(line));

        // Call Billing REST API
        String baseUrl = "http://localhost:" + port + "/api/v1/invoices";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(objectMapper.writeValueAsString(invoicePayload), headers);

        ResponseEntity<String> response = restTemplate.postForEntity(baseUrl, request, String.class);
        assertThat(response.getStatusCode().is2xxSuccessful())
                .as("Expected 2xx from billing-service but got %s with body %s", response.getStatusCode(), response.getBody())
                .isTrue();

        // Extract invoiceId from response JSON
        Map<String, Object> body = objectMapper.readValue(response.getBody(), Map.class);
        String invoiceId = (String) body.get("invoiceId");
        assertThat(invoiceId).isNotBlank();

        // Poll GL for the corresponding transaction
        String expectedDescription = "Invoice " + invoiceId;
        String transactionId = null;
        for (int i = 0; i < 10 && transactionId == null; i++) {
            Thread.sleep(500);
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                    "SELECT transaction_id, description FROM accounting_transaction");
            Optional<Map<String, Object>> maybeRow = rows.stream()
                    .filter(r -> expectedDescription.equals(r.get("description")))
                    .findFirst();
            if (maybeRow.isPresent()) {
                transactionId = maybeRow.get().get("transaction_id").toString();
            }
        }

        assertThat(transactionId).isNotNull();

        List<Map<String, Object>> entries = jdbcTemplate.queryForList(
                "SELECT amount, debit_credit_flag FROM transaction_entry WHERE transaction_id = ?",
                java.util.UUID.fromString(transactionId));
        assertThat(entries).hasSize(2);

        BigDecimal debitTotal = entries.stream()
                .filter(e -> "D".equals(e.get("debit_credit_flag")))
                .map(e -> (BigDecimal) e.get("amount"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal creditTotal = entries.stream()
                .filter(e -> "C".equals(e.get("debit_credit_flag")))
                .map(e -> (BigDecimal) e.get("amount"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal expectedAmount = amount;
        assertThat(debitTotal).isEqualByComparingTo(expectedAmount);
        assertThat(creditTotal).isEqualByComparingTo(expectedAmount);
    }
}
