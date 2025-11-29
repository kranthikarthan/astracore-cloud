package com.astracore.gl.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "gl_account")
public class GeneralLedgerAccountEntity extends BaseEntity {

    @Id
    @Column(name = "gl_account_id")
    private UUID glAccountId;

    @Column(name = "account_name", nullable = false)
    private String accountName;

    @Column(name = "account_code", nullable = false, unique = true)
    private String accountCode;

    @Column(name = "gl_account_type_id", nullable = false)
    private String glAccountTypeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_gl_account_id")
    private GeneralLedgerAccountEntity parent;
}
