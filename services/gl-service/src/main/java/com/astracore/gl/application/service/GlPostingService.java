package com.astracore.gl.application.service;

import com.astracore.event.InvoiceIssued;
import com.astracore.gl.infrastructure.persistence.entity.AccountingTransactionEntity;
import com.astracore.gl.infrastructure.persistence.entity.GeneralLedgerAccountEntity;
import com.astracore.gl.infrastructure.persistence.entity.TransactionEntryEntity;
import com.astracore.gl.infrastructure.persistence.repository.AccountingTransactionRepository;
import com.astracore.gl.infrastructure.persistence.repository.GeneralLedgerAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class GlPostingService {

    private final AccountingTransactionRepository accountingTransactionRepository;
    private final GeneralLedgerAccountRepository generalLedgerAccountRepository;

    private static final String TX_TYPE_SALES_INVOICE = "SALES_INVOICE";

    @Transactional
    public void postInvoice(InvoiceIssued event) {
        if (event.getTotalAmount() == null) {
            log.warn("Skipping GL posting for invoice {} because totalAmount is null", event.getInvoiceId());
            return;
        }

        BigDecimal amount = event.getTotalAmount();

        // Resolve or create GL accounts
        GeneralLedgerAccountEntity arAccount = getOrCreateAccount(
                "AR",
                "Accounts Receivable",
                "ASSET"
        );

        GeneralLedgerAccountEntity revenueAccount = getOrCreateAccount(
                "REV",
                "Revenue",
                "REVENUE"
        );

        // Build transaction
        AccountingTransactionEntity tx = new AccountingTransactionEntity();
        tx.setTransactionId(UUID.randomUUID());
        tx.setTransactionDate(event.getIssueDate() != null ? event.getIssueDate().atStartOfDay().toInstant(java.time.ZoneOffset.UTC) : Instant.now());
        tx.setEntryDate(Instant.now());
        tx.setDescription("Invoice " + event.getInvoiceId());
        tx.setTransactionType(TX_TYPE_SALES_INVOICE);
        tx.setPosted(true);

        // Debit AR
        TransactionEntryEntity debit = new TransactionEntryEntity();
        debit.setTransactionEntryId(UUID.randomUUID());
        debit.setGlAccount(arAccount);
        debit.setAmount(amount);
        debit.setDebitCreditFlag("D");
        debit.setDescription("AR for invoice " + event.getInvoiceId());
        tx.addEntry(debit);

        // Credit Revenue
        TransactionEntryEntity credit = new TransactionEntryEntity();
        credit.setTransactionEntryId(UUID.randomUUID());
        credit.setGlAccount(revenueAccount);
        credit.setAmount(amount);
        credit.setDebitCreditFlag("C");
        credit.setDescription("Revenue for invoice " + event.getInvoiceId());
        tx.addEntry(credit);

        accountingTransactionRepository.save(tx);
        log.info("Posted GL transaction {} for invoice {} with amount {}", tx.getTransactionId(), event.getInvoiceId(), amount);
    }

    private GeneralLedgerAccountEntity getOrCreateAccount(String accountCode, String name, String typeId) {
        return generalLedgerAccountRepository.findByAccountCode(accountCode)
                .orElseGet(() -> {
                    GeneralLedgerAccountEntity entity = new GeneralLedgerAccountEntity();
                    entity.setGlAccountId(UUID.randomUUID());
                    entity.setAccountCode(accountCode);
                    entity.setAccountName(name);
                    entity.setGlAccountTypeId(typeId);
                    return generalLedgerAccountRepository.save(entity);
                });
    }
}
