package com.astracore.billing.application.mapper;

import com.astracore.billing.application.dto.InvoiceDTO;
import com.astracore.billing.application.dto.InvoiceLineDTO;
import com.astracore.billing.application.dto.MoneyDTO;
import com.astracore.billing.infrastructure.persistence.entity.InvoiceEntity;
import com.astracore.billing.infrastructure.persistence.entity.InvoiceLineEntity;
import com.astracore.domain.billing.Invoice;
import com.astracore.domain.billing.InvoiceLine;
import com.astracore.shared.domain.Money;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.math.BigDecimal;
import java.util.Currency;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {

    // Domain <-> Entity
    @Mapping(target = "totalAmount", source = "totalAmount", qualifiedByName = "moneyToBigDecimal")
    @Mapping(target = "lines", source = "lines")
    InvoiceEntity toEntity(Invoice domain);

    @Mapping(target = "totalAmount", source = "totalAmount", qualifiedByName = "bigDecimalToMoney")
    @Mapping(target = "lines", source = "lines")
    Invoice toDomain(InvoiceEntity entity);

    // InvoiceLine Mappings
    @Mapping(target = "amount", source = "amount", qualifiedByName = "moneyToBigDecimal")
    InvoiceLineEntity toEntity(InvoiceLine domain);

    @Mapping(target = "amount", source = "amount", qualifiedByName = "bigDecimalToMoney")
    InvoiceLine toDomain(InvoiceLineEntity entity);

    // Domain <-> DTO
    @Mapping(target = "totalAmount", source = "totalAmount", qualifiedByName = "moneyToDTO")
    InvoiceDTO toDTO(Invoice domain);
    
    @Mapping(target = "totalAmount", source = "totalAmount", qualifiedByName = "dtoToMoney")
    Invoice toDomain(InvoiceDTO dto);

    // Helper Mappings
    @Named("moneyToDTO")
    default MoneyDTO moneyToDTO(Money money) {
        if (money == null) return null;
        MoneyDTO dto = new MoneyDTO();
        dto.setAmount(money.getAmount());
        dto.setCurrency(money.getCurrency().getCurrencyCode());
        return dto;
    }

    @Named("dtoToMoney")
    default Money dtoToMoney(MoneyDTO dto) {
        if (dto == null) return null;
        return new Money(dto.getAmount(), Currency.getInstance(dto.getCurrency()));
    }

    @Named("moneyToBigDecimal")
    default BigDecimal moneyToBigDecimal(Money money) {
        return money == null ? null : money.getAmount();
    }

    @Named("bigDecimalToMoney")
    default Money bigDecimalToMoney(BigDecimal amount) {
        // Default currency to USD for now if restoring from simple BigDecimal
        // In a real app, we'd store currency in the DB too
        return amount == null ? null : new Money(amount, Currency.getInstance("USD"));
    }
}
