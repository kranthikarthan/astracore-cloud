# AstraCore Cloud - Architecture Design

## 1. Executive Summary

AstraCore Cloud is an **AI-Native, Event-Driven ERP** designed for high scalability, real-time financial accuracy, and seamless cloud-native deployment on **Microsoft Azure**. It leverages a **Microservices** architecture with a **Hexagonal** core to ensure domain logic isolation.

## 2. System Context

The system interacts with various external actors and systems:

```mermaid
C4Context
    title System Context Diagram for AstraCore Cloud

    Person(admin, "System Admin", "Manages tenants and configuration")
    Person(user, "ERP User", "Accountants, Managers, Staff")
    System_Ext(bank, "Banking System", "Processes payments and feeds statements")
    System_Ext(tax, "Tax Authority", "Real-time tax filing and validation")
    System_Ext(email, "Email Provider", "SendGrid / Azure Comm Services")

    System(erp, "AstraCore Cloud", "The AI-Native ERP Platform")

    Rel(admin, erp, "Configures")
    Rel(user, erp, "Uses", "HTTPS/WSS")
    Rel(erp, bank, "Reconciles/Pays", "API/SFTP")
    Rel(erp, tax, "Reports", "API")
    Rel(erp, email, "Sends Notifications", "SMTP/API")
```

## 3. High-Level Architecture (Container View)

The platform runs on **Azure Kubernetes Service (AKS)**.

```mermaid
C4Container
    title Container Diagram - AstraCore Cloud

    Person(user, "User", "Web/Mobile Client")

    System_Boundary(azure, "Azure Cloud Region") {
        
        Container(cdn, "Azure Front Door", "CDN/WAF", "Global entry point, load balancing, security")
        
        System_Boundary(cluster, "AKS Cluster") {
            Container(ingress, "Ingress / API Gateway", "Ocelot / Nginx", "Routing, Rate Limiting, Auth Offload")
            
            Container(auth, "Identity Service", "Keycloak / Ory", "OAuth2, OIDC, Tenant Mgmt")
            
            Container(billing, "Billing Service", "Spring Boot", "Invoicing, Tax, Discounts")
            Container(payment, "Payment Service", "Spring Boot", "Gateways, Reconciliation")
            Container(gl, "GL Service", "Spring Boot", "Double-entry Ledger")
            Container(inventory, "Inventory Service", "Spring Boot", "Stock, Valuation")
            
            Container(ai_sidecar, "AI Sidecar", "Python/FastAPI", "Inference for Anomaly/Prediction")
        }

        ContainerDb(eventhub, "Azure Event Hubs", "Kafka Protocol", "Event Backbone for Async Comms")
        ContainerDb(db, "Azure Database for PostgreSQL", "PostgreSQL 15+", "Transactional Data (Per Tenant/Schema)")
        ContainerDb(redis, "Azure Cache for Redis", "Redis", "Session, Cache, Leaderboards")
        ContainerDb(blob, "Azure Blob Storage", "Storage", "Documents, Reports, Backups")
    }

    Rel(user, cdn, "HTTPS")
    Rel(cdn, ingress, "HTTPS")
    Rel(ingress, auth, "Validates Token")
    Rel(ingress, billing, "Proxies")
    
    Rel(billing, eventhub, "Publishes Events")
    Rel(gl, eventhub, "Consumes Events")
    
    Rel(billing, db, "Persists Data")
    Rel(billing, ai_sidecar, "gRPC (Prediction)")
```

## 4. Core Design Patterns

### 4.1 Hexagonal Architecture (Ports & Adapters)
Every microservice follows this structure to isolate domain logic:
*   **Domain**: Pure Java objects, business rules. No framework dependencies.
*   **Application**: Use Cases, Orchestration.
*   **Infrastructure**: Adapters for Database (JPA), Messaging (Kafka), Web (REST Controllers).

### 4.2 Event-Driven Architecture (EDA)
*   **Choreography** over Orchestration for core flows.
*   **Event Sourcing** (optional for critical audits) / **CQRS** for complex views.
*   **Schema Registry**: Avro/Protobuf for contract evolution.

### 4.3 Multi-Tenancy
*   **Strategy**: Database-per-tenant (logical schemas) or Discriminator column (shared schema) depending on tier.
*   **Isolation**: Strict middleware checks on `Tenant-ID` header.

### 4.4 AI Integration
*   **Sidecar Pattern**: AI models run in a separate container within the same Pod (or close proximity).
*   **Shared Mesh**: For heavy models (LLMs), a centralized AI service mesh is used.
*   **Feedback Loop**: User corrections feed back into training datasets (stored in Data Lake).

## 5. Technology Stack

| Layer | Technology | Azure Service |
| :--- | :--- | :--- |
| **Frontend** | React, Next.js, Tailwind | Azure Static Web Apps |
| **API Gateway** | Spring Cloud Gateway / Ocelot | Azure API Management |
| **Compute** | Java 17+, Spring Boot 3 | Azure Kubernetes Service (AKS) |
| **AI/ML** | Python, PyTorch, ONNX | Azure Machine Learning |
| **Messaging** | Apache Kafka | Azure Event Hubs |
| **Database** | PostgreSQL | Azure Database for PostgreSQL |
| **Caching** | Redis | Azure Cache for Redis |
| **Observability** | OpenTelemetry, Prometheus | Azure Monitor / App Insights |
| **IaC** | Terraform / Bicep | Azure DevOps / GitHub Actions |

## 6. Security Architecture (Zero Trust)

*   **Identity**: Centralized IAM (Keycloak/Entra ID).
*   **mTLS**: Service-to-service communication encryption (via Istio/Linkerd or Spring Security).
*   **Secrets**: No hardcoded secrets. Use **Azure Key Vault** injected via CSI Driver.
*   **Network**: Private Endpoints for all data services. No public IP for DBs.
