package com.astracore.gl;

import com.astracore.event.InvoiceIssued;
import com.astracore.gl.infrastructure.persistence.entity.AccountingTransactionEntity;
import com.astracore.gl.infrastructure.persistence.entity.TransactionEntryEntity;
import com.astracore.gl.infrastructure.persistence.repository.AccountingTransactionRepository;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
class GlPostingIntegrationTest {

    private static final String TOPIC = "invoice.issued.v1";

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    @Container
    static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.3.0"));

    @Autowired
    private AccountingTransactionRepository accountingTransactionRepository;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // Database
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.url", postgres::getJdbcUrl);
        registry.add("spring.flyway.user", postgres::getUsername);
        registry.add("spring.flyway.password", postgres::getPassword);

        // Kafka
        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
    }

    @Test
    @Transactional
    void invoiceIssuedEvent_shouldCreateBalancedGlTransaction() throws Exception {
        // Arrange: create KafkaTemplate bound to testcontainer Kafka
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, kafka.getBootstrapServers());
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        ProducerFactory<String, Object> pf = new DefaultKafkaProducerFactory<>(props);
        KafkaTemplate<String, Object> kafkaTemplate = new KafkaTemplate<>(pf);

        BigDecimal amount = new BigDecimal("150.00");
        InvoiceIssued event = new InvoiceIssued(
                "tenant-1",
                "inv-123",
                "cust-1",
                amount,
                "USD",
                LocalDate.now(),
                LocalDate.now().plusDays(30),
                Instant.now()
        );

        // Act: send event to topic
        kafkaTemplate.send(TOPIC, event.getInvoiceId(), event).get();

        // Poll for the resulting GL transaction (as Kafka consumption is async)
        Optional<AccountingTransactionEntity> maybeTx = Optional.empty();
        for (int i = 0; i < 10 && maybeTx.isEmpty(); i++) {
            Thread.sleep(500);
            List<AccountingTransactionEntity> transactions = accountingTransactionRepository.findAll();
            maybeTx = transactions.stream()
                    .filter(tx -> ("Invoice " + event.getInvoiceId()).equals(tx.getDescription()))
                    .findFirst();
        }

        assertThat(maybeTx).isPresent();

        AccountingTransactionEntity tx = maybeTx.get();
        assertThat(tx.getEntries()).hasSize(2);

        BigDecimal debitTotal = tx.getEntries().stream()
                .filter(e -> "D".equals(e.getDebitCreditFlag()))
                .map(TransactionEntryEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal creditTotal = tx.getEntries().stream()
                .filter(e -> "C".equals(e.getDebitCreditFlag()))
                .map(TransactionEntryEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        assertThat(debitTotal).isEqualByComparingTo(amount);
        assertThat(creditTotal).isEqualByComparingTo(amount);
    }
}
