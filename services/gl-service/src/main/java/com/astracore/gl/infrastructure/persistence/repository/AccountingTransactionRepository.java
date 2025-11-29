package com.astracore.gl.infrastructure.persistence.repository;

import com.astracore.gl.infrastructure.persistence.entity.AccountingTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AccountingTransactionRepository extends JpaRepository<AccountingTransactionEntity, UUID> {
}
