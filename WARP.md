# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Build and Test Commands

### Backend (Java / Maven multi-module)

Root project is a Maven parent POM (`pom.xml`) with two main modules: `libs` and `services`.

Use the Maven wrapper if available (`./mvnw`), or `mvn` if you prefer a system Maven installation.

**Build all Java modules and run tests** (from repo root):

```bash
mvn clean verify
```

**Build libraries only** (shared kernel, domain models, event contracts):

```bash
mvn -pl libs -am clean verify
```

**Build and test all services**:

```bash
mvn -pl services -am clean verify
```

### Billing Service (Spring Boot)

Module: `services/billing-service`.

**Run the Billing service locally** (from within the service directory):

```bash
cd services/billing-service
./mvnw spring-boot:run
```

If the Maven wrapper scripts are not present on your platform, replace `./mvnw` with `mvn`.

**Run all tests for Billing service only** (from repo root):

```bash
mvn -pl services/billing-service -am test
```

This will execute `BillingServiceIntegrationTest`, which uses Testcontainers to spin up a PostgreSQL container automatically.

**Run a single integration test class**:

```bash
mvn -pl services/billing-service -Dtest=BillingServiceIntegrationTest test
```

### Frontend (Next.js)

App lives under `frontend/` and is a standard Next.js project (`frontend/package.json`).

From `frontend/`:

```bash
cd frontend
npm run dev        # start dev server on http://localhost:3000
npm run build      # production build
npm run start      # run production build
npm run lint       # run ESLint
```

### AI Sidecar (Python, FastAPI)

The Billing service has an AI sidecar under `services/billing-service/sidecar/`.

**Install dependencies** (in a Python virtual environment):

```bash
cd services/billing-service/sidecar
pip install -r requirements.txt
```

The sidecar uses FastAPI, Uvicorn, scikit-learn, and gRPC to provide inference capabilities; check this directory for the concrete entrypoint if you need to run it directly.

### Docker Compose and Local Stack

The top-level `README.md` assumes a Docker-based local environment.

**Start the full stack via Docker Compose** (from repo root):

```bash
docker-compose up -d
```

**Billing service focused flow (from README)**:

1. Start services with rebuilds:

   ```bash
   docker-compose up -d --build
   ```

2. Seed required reference data in Postgres (parties and product) so invoice creation passes FK constraints. The README contains an example `docker exec ... psql` command that inserts two parties and one product; reuse or adapt that when running the Billing service against a Dockerized Postgres.

3. Exercise the Billing API with a sample invoice creation request:

   ```bash
   curl -v -X POST http://localhost:8081/api/v1/invoices \
     -H "Content-Type: application/json" \
     -d '{"invoiceTypeId":"SALES_INVOICE", ... }'
   ```

Refer to `README.md` for the full example payload and concrete IDs.

## High-Level Architecture and Code Structure

### Top-level layout

Key directories:

- `services/` – business microservices (currently `billing-service` is implemented here).
- `libs/` – shared JVM libraries:
  - `shared-kernel` – core DDD abstractions and value objects.
  - `domain-models` – rich domain models (billing, orders, accounting, parties, products, inventory).
  - `event-contracts` – event payload types that represent the public event contracts between services.
- `frontend/` – Next.js-based UI.
- `docs/` – architecture, API specs, and design docs.
- `infra/` – infrastructure-level configuration (e.g., monitoring).

`docs/architecture/architecture.md` and `docs/architecture/infrastructure-design.md` contain detailed system and infrastructure views (C4-style diagrams, Azure topology, CI/CD pipeline). Use them as the canonical source for platform-level design.

### Shared Kernel and Domain Libraries (`libs/`)

**`libs/shared-kernel`** defines cross-cutting DDD primitives:

- `AggregateRoot` – base type that manages a list of `DomainEvent`s raised by aggregates and exposes `pullDomainEvents()` to retrieve & clear them. This is how domain events flow from entities to the outer layers.
- `DomainEvent` – marker interface with `occurredOn()`; all domain events (including integration events) conform to this contract.
- `Money` – value object encapsulating `BigDecimal` amount and `Currency`, with proper equality semantics.

**`libs/domain-models`** contains the core ERP domain types, split into subpackages such as:

- `billing` – e.g., `Invoice`, `InvoiceLine`.
- `accounting` – e.g., `AccountingTransaction`, `GeneralLedgerAccount`, `TransactionEntry`.
- `order`, `party`, `product`, `inventory` – foundational entities for orders, parties, products, inventory items, and prices.

Example: `com.astracore.domain.billing.Invoice` extends `AggregateRoot`, holds identifiers (`invoiceId`, `partyIdFrom`, `partyIdTo`), dates, status, currency, line items, and a `Money totalAmount`. Domain behavior (such as raising invoice-issued events) should be located on these domain model classes rather than in controllers.

**`libs/event-contracts`** represents the public event contracts shared between services:

- Events like `InvoiceIssued` implement `DomainEvent` and define the payload expected on the event backbone (Kafka/Event Hubs): tenant and entity IDs, amounts, currency, key dates, and `occurredOn` timestamp.

These contracts are the source of truth for the asynchronous boundaries between services and should stay backward compatible as other services consume them.

### Billing Service Structure (`services/billing-service`)

The `billing-service` is a Spring Boot 3 application that follows a hexagonal/clean architecture style, and it is the primary reference implementation for how future services should be structured.

Key layers and responsibilities:

- **API layer (`api` package)**
  - `BillingController` exposes REST endpoints under `/api/v1/invoices`.
  - It depends only on application-level use cases and DTOs, not on JPA entities or infrastructure.
  - Current operations include:
    - `POST /api/v1/invoices` → `CreateInvoiceUseCase.execute(InvoiceDTO)`.
    - `GET /api/v1/invoices/{invoiceId}` → `GetInvoiceUseCase.execute(UUID)`.
    - `GET /api/v1/invoices` → `GetInvoiceListUseCase.execute()`.
  - Cross-origin is enabled globally on this controller (`@CrossOrigin(origins = "*")`), which is important when wiring the Next.js frontend to the API.

- **Application layer (`application` packages)**
  - Use case classes (e.g., `CreateInvoiceUseCase`, `GetInvoiceUseCase`, `GetInvoiceListUseCase`) orchestrate domain operations.
  - DTOs (e.g., `InvoiceDTO`, `InvoiceLineDTO`, `MoneyDTO`) represent the shape of inbound/outbound API payloads.
  - Mapping between DTOs and domain models is handled via MapStruct (see MapStruct dependencies configured in the `pom.xml`).

- **Domain and persistence (infrastructure) layer**
  - Domain models from `libs/domain-models` are used as the canonical in-memory representation.
  - JPA entities and repositories live under infrastructure packages (see `docs/architecture/api-code-mapping.md` for precise class locations such as `InvoiceEntity` and `InvoiceRepository`).
  - Flyway is used for database migrations; billing tests and services expect Flyway configuration to be present.

`BillingApplication` is the Spring Boot entrypoint, with JPA auditing enabled.

### API Specifications and Code Mapping

The repo keeps API contracts and their implementation mapping explicit:

- OpenAPI spec for the billing API: `docs/api-specs/billing-service-api.yaml`.
- API-to-code mapping: `docs/architecture/api-code-mapping.md`.

`api-code-mapping.md` documents, for each operation, the correspondence between:

- OpenAPI operation ID and HTTP method/path.
- Application/service use case (`CreateInvoiceUseCase`, `GetInvoiceUseCase`, etc.).
- Domain model (`com.astracore.domain.billing.Invoice`, `SalesOrder`, `Payment`, ...).
- JPA entity and repository classes (e.g., `InvoiceEntity`, `InvoiceRepository`).

When adding new endpoints, mirror this pattern: update the OpenAPI spec and extend the mapping document so the relationship between API, application service, domain model, and persistence remains clear.

### Event-Driven and AI Sidecar Patterns

The architecture is intentionally event-driven and AI-augmented, as captured in `docs/architecture/architecture.md`:

- Services publish and consume events via Kafka-compatible infrastructure (Azure Event Hubs in production). Domain events such as `InvoiceIssued` are the basis for integration events that power downstream flows like GL posting, AR reconciliation, and analytics.
- The AI sidecar pattern is used to keep ML concerns decoupled from the core Spring Boot service:
  - The `ai_sidecar` (Python/FastAPI) container handles inference for predictions and anomaly detection.
  - The billing service communicates with the sidecar over gRPC or HTTP, depending on configuration.

When implementing new AI capabilities, keep model code in sidecars (or a central AI service) and expose them through well-defined interfaces, rather than embedding ML libraries directly into the Java services.

### Testing Approach

`BillingServiceIntegrationTest` demonstrates the preferred testing style for services:

- Spring Boot integration tests with `@SpringBootTest` and `@AutoConfigureMockMvc`.
- Testcontainers for ephemeral PostgreSQL instances; Flyway migrations are executed against the containerized DB via dynamic properties.
- Tests set up required reference data directly via `JdbcTemplate` where domain repositories do not yet exist.
- HTTP-level assertions are made via MockMvc (`POST /api/v1/invoices` and JSON-path checks on the response).

Use this pattern when adding new integration tests: rely on Testcontainers-backed databases, seed only the minimum reference data needed, and exercise the REST API surface instead of repository or entity internals.
