package com.astracore.shared.domain;

import java.time.Instant;

/**
 * Marker interface for Domain Events.
 */
public interface DomainEvent {
    Instant occurredOn();
}
