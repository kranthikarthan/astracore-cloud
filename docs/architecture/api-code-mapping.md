# API to Code Mapping - Billing Service

This document maps the external **OpenAPI Specification** to the internal **Code Components** (Service, Domain, Persistence).

## 1. Invoice Management

| OpenAPI Operation | HTTP Method | Endpoint | Application Service (UseCase) | Domain Model | JPA Entity | Repository |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **createInvoice** | `POST` | `/api/v1/invoices` | `CreateInvoiceUseCase.execute(cmd)` | `com.astracore.domain.billing.Invoice` | `InvoiceEntity` | `InvoiceRepository.save()` |
| **getInvoice** | `GET` | `/api/v1/invoices/{id}` | `GetInvoiceUseCase.execute(id)` | `com.astracore.domain.billing.Invoice` | `InvoiceEntity` | `InvoiceRepository.findById()` |
| **listInvoices** | `GET` | `/api/v1/invoices` | `ListInvoicesUseCase.execute(page, size)` | `List<Invoice>` | `InvoiceEntity` | `InvoiceRepository.findAll(Pageable)` |
| **updateInvoice** | `PUT` | `/api/v1/invoices/{id}` | `UpdateInvoiceUseCase.execute(cmd)` | `com.astracore.domain.billing.Invoice` | `InvoiceEntity` | `InvoiceRepository.save()` |
| **approveInvoice** | `POST` | `/api/v1/invoices/{id}/approve` | `ApproveInvoiceUseCase.execute(id)` | `com.astracore.domain.billing.Invoice` | `InvoiceEntity` | `InvoiceRepository.save()` |
| **createOrder** | `POST` | `/api/v1/orders` | `CreateOrderUseCase.execute(cmd)` | `com.astracore.domain.order.SalesOrder` | `SalesOrderEntity` | `SalesOrderRepository.save()` |
| **receivePayment** | `POST` | `/api/v1/payments` | `ReceivePaymentUseCase.execute(cmd)` | `com.astracore.domain.billing.Payment` | `PaymentEntity` | `PaymentRepository.save()` |

## 2. Data Transformation Flow

### Inbound (Request)
1.  **API Layer**: Receives `InvoiceCreateDTO` (JSON).
2.  **Controller**: Maps DTO to `CreateInvoiceCommand` (POJO).
3.  **Service Layer**:
    *   Validates Command.
    *   Instantiates `Invoice` (Domain Model).
    *   Executes Business Logic (Calculations, Rules).
    *   Maps `Invoice` (Domain) to `InvoiceEntity` (Persistence).
4.  **Repository**: Saves `InvoiceEntity` to Database.

### Outbound (Response)
1.  **Repository**: Returns `InvoiceEntity`.
2.  **Service Layer**:
    *   Maps `InvoiceEntity` to `Invoice` (Domain Model).
    *   Returns `Invoice` (Domain Model).
3.  **Controller**: Maps `Invoice` (Domain) to `InvoiceDTO` (JSON).
4.  **API Layer**: Returns JSON response.

## 3. Component Locations

*   **OpenAPI Spec**: [billing-service-api.yaml](file:///c:/git/clone/astracore-cloud/docs/api-specs/billing-service-api.yaml)
*   **Domain Model**: [Invoice.java](file:///c:/git/clone/astracore-cloud/libs/domain-models/src/main/java/com/astracore/domain/billing/Invoice.java)
*   **JPA Entity**: [InvoiceEntity.java](file:///c:/git/clone/astracore-cloud/services/billing-service/src/main/java/com/astracore/billing/infrastructure/persistence/entity/InvoiceEntity.java)
*   **Repository**: [InvoiceRepository.java](file:///c:/git/clone/astracore-cloud/services/billing-service/src/main/java/com/astracore/billing/infrastructure/persistence/repository/InvoiceRepository.java)
