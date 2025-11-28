package com.astracore.billing;

import com.astracore.billing.application.dto.InvoiceDTO;
import com.astracore.billing.application.dto.InvoiceLineDTO;
import com.astracore.billing.application.dto.MoneyDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
public class BillingServiceIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.url", postgres::getJdbcUrl);
        registry.add("spring.flyway.user", postgres::getUsername);
        registry.add("spring.flyway.password", postgres::getPassword);
    }

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Test
    void createInvoice_shouldPersistAndReturnInvoice() throws Exception {
        // Arrange
        UUID partyIdFrom = UUID.randomUUID();
        UUID partyIdTo = UUID.randomUUID();
        UUID productId = UUID.randomUUID();

        // Insert dependencies via SQL (since we don't have Repositories for them in this service yet)
        jdbcTemplate.update("INSERT INTO party (party_id, party_type, version) VALUES (?, 'ORGANIZATION', 0)", partyIdFrom);
        jdbcTemplate.update("INSERT INTO party (party_id, party_type, version) VALUES (?, 'PERSON', 0)", partyIdTo);
        jdbcTemplate.update("INSERT INTO product (product_id, product_name, product_type, version) VALUES (?, 'Consulting', 'SERVICE', 0)", productId);

        InvoiceDTO invoiceDTO = new InvoiceDTO();
        invoiceDTO.setInvoiceTypeId("SALES_INVOICE");
        invoiceDTO.setPartyIdFrom(partyIdFrom);
        invoiceDTO.setPartyIdTo(partyIdTo);
        invoiceDTO.setInvoiceDate(LocalDate.now());
        invoiceDTO.setCurrencyUomId("USD");
        invoiceDTO.setStatusId("IN_PROCESS");

        MoneyDTO totalAmount = new MoneyDTO();
        totalAmount.setAmount(new BigDecimal("100.00"));
        totalAmount.setCurrency("USD");
        invoiceDTO.setTotalAmount(totalAmount);

        InvoiceLineDTO line = new InvoiceLineDTO();
        line.setInvoiceItemSeqId(1);
        line.setProductId(productId);
        line.setDescription("Consulting Services");
        line.setQuantity(new BigDecimal("1.0"));
        line.setAmount(totalAmount);
        
        invoiceDTO.setLines(Collections.singletonList(line));

        // Act & Assert
        mockMvc.perform(post("/api/v1/invoices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invoiceDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.invoiceId").isNotEmpty())
                .andExpect(jsonPath("$.totalAmount.amount").value(100.00));
    }
}
