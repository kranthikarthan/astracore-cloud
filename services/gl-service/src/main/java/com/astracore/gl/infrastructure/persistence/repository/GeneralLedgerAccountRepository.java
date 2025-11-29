package com.astracore.gl.infrastructure.persistence.repository;

import com.astracore.gl.infrastructure.persistence.entity.GeneralLedgerAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface GeneralLedgerAccountRepository extends JpaRepository<GeneralLedgerAccountEntity, UUID> {

    Optional<GeneralLedgerAccountEntity> findByAccountCode(String accountCode);
}
