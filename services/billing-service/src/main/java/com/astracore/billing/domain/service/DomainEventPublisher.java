package com.astracore.billing.domain.service;

import com.astracore.shared.domain.DomainEvent;

import java.util.List;

public interface DomainEventPublisher {

    void publish(List<DomainEvent> events);
}
