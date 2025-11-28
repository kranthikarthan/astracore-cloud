package com.astracore.domain.party;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
public class Person extends Party {
    private String firstName;
    private String lastName;
    private String middleName;
    private LocalDate birthDate;
    private String gender; // M, F, O
}
