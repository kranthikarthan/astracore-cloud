package com.astracore.gl.infrastructure.persistence.repository;

import com.astracore.gl.infrastructure.persistence.entity.TransactionEntryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TransactionEntryRepository extends JpaRepository<TransactionEntryEntity, UUID> {
}
