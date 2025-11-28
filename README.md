# 🪐 AstraCore Cloud  
### **AI-Native, Event-Driven ERP Platform for the Modern Enterprise**

AstraCore Cloud is a next-generation **AI-powered, microservices-based ERP** built for businesses that demand real-time insights, automation, and financial accuracy at scale.  
Designed with **event-driven architecture**, **hexagonal patterns**, and **cloud-native engineering**, AstraCore Cloud brings enterprise-grade ERP capabilities without the complexity of traditional systems.

---

## 🚀 **Key Features**

### **⚡ Event-Driven Financial Engine**
Real-time financial events power core flows:
- Invoice → GL Posting  
- Payment Receipt → AR Reconciliation  
- Inventory Movement → Costing/Valuation  
- Vendor Bills → AP → GL

### **🧱 Modular Microservices**
Each module runs as an independent microservice:
- Billing / Accounts Receivable (AR)  
- Payments / Receipts  
- General Ledger (GL)  
- Inventory  
- Accounts Payable (AP)  
- Procurement  
- AI Services  
- Workflow / Approvals  
- Identity & Access (Keycloak/Ory)

### **🧠 AI-Native**
AI sidecar services deliver:
- Payment prediction  
- Invoice anomaly detection  
- Auto-reconciliation  
- SKU-level forecasting  
- Credit scoring  
- Intelligent task routing  
- Document extraction (OCR + LLM)

### **🔐 Zero-Trust Security**
- OAuth2 / OIDC  
- JWT-based service calls  
- Fine-grained RBAC  
- Tenant isolation  

### **🌍 Multi-Tenant, Multi-Currency**
Each tenant is fully isolated:
- Data  
- User access  
- Chart of accounts  
- Currency + exchange rates  
- Tax rules  

### **📈 Real-Time Analytics**
- Event streams power downstream BI  
- Materialized views for reporting  
- Star-schema warehouse support  

---

## 🏗️ **Architecture Overview**

AstraCore Cloud is built with:

**Backend**
- Spring Boot 3.x  
- Hexagonal Architecture (Ports & Adapters)  
- Apache Kafka (event backbone)  
- PostgreSQL (financial-grade consistency)  
- Redis (cache)  
- Temporal/Camunda (optional workflow engine)  

**Infrastructure**
- Docker / Kubernetes  
- GitHub Actions / Azure DevOps  
- Helm charts  
- Prometheus + Grafana  
- OpenTelemetry Traces  

**AI**
- Python AI sidecars  
- PyTorch / TensorFlow / ONNX  
- Azure AI / OpenAI integration  
- Vector search for anomaly detection  

---

## 📦 **Repository Structure**

```text
astracore-cloud/
├── services/
│   ├── billing-service/
│   ├── payments-service/
│   ├── gl-service/
│   ├── inventory-service/
│   ├── ap-service/
│   ├── ar-service/
│   ├── ai-service/
│   ├── workflow-service/
│   └── auth-service/
│
├── libs/
│   ├── common-domain/
│   ├── event-contracts/
│   └── shared-kernel/
│
├── infra/
│   ├── k8s/
│   ├── helm/
│   ├── docker/
│   └── migrations/
│
├── docs/
│   ├── architecture/
│   ├── api-specs/
│   ├── domain-models/
│   └── erp-roadmap/
│
└── README.md
```

---

## 🧬 **Core Domain Events**

### **invoice.issued.v1**
```
tenantId
invoiceId
customerId
totalNet
totalTax
totalGross
issueDate
dueDate
lines[]
```

### **payment.received.v1**
```
tenantId
invoiceId
amount
currency
method
date
```

### **inventory.adjusted.v1**
```
itemId
warehouseId
delta
newOnHand
reason
```

---

## 🗄️ **Database Schema**

AstraCore Cloud uses **clean, normalized financial tables**:

### Billing / AR
- invoices  
- invoice_lines  
- payments  

### General Ledger
- journal_entries  
- journal_lines  
- accounts  

### Tenancy
- tenants  
- users  

### Inventory
- stock_levels  
- stock_movements  

Full SQL DDL provided in `/infra/migrations/erp_core.sql`.

---

## 🧪 **Testing Strategy**

### Unit Tests  
- Core domain logic  

### Integration Tests  
- Kafka event serialization  
- Database migrations  
- REST endpoints  

### End-to-End Tests  
- Invoice → GL posting  
- Payment → AR reconciliation  
- Inventory adjustments → Valuation flows  

---

## 🛠️ **Development Setup**

### **Prerequisites**
- JDK 17+  
- Docker / Docker Compose  
- PostgreSQL  
- Apache Kafka  
- Node.js (optional UI)  

### **Start full stack with Docker Compose**
```bash
docker-compose up -d
```

### **Run a single service locally**
```bash
cd services/billing-service
./mvnw spring-boot:run
```

### **Run Billing Service Full Stack**
1. **Start Services**:
    ```bash
    docker-compose up -d --build
    ```
2. **Seed Data** (Required for Foreign Keys):
    ```bash
    docker exec -i astracore-postgres psql -U astracore -d astracore_db -c "INSERT INTO party (party_id, party_type, version) VALUES ('d726f370-43f0-4f11-b851-2e05baa4d82d', 'ORGANIZATION', 0) ON CONFLICT DO NOTHING; INSERT INTO party (party_id, party_type, version) VALUES ('a1a49628-5d99-4b76-ae68-f59f929ae926', 'PERSON', 0) ON CONFLICT DO NOTHING; INSERT INTO product (product_id, product_name, product_type, version) VALUES ('38865cc4-f538-4569-a2ef-c8d89719bc3e', 'Consulting Services', 'SERVICE', 0) ON CONFLICT DO NOTHING;"
    ```
3. **Test API**:
    ```bash
    curl -v -X POST http://localhost:8081/api/v1/invoices \
      -H "Content-Type: application/json" \
      -d '{"invoiceTypeId":"SALES_INVOICE","partyIdFrom":"d726f370-43f0-4f11-b851-2e05baa4d82d","partyIdTo":"a1a49628-5d99-4b76-ae68-f59f929ae926","invoiceDate":"2025-11-28","statusId":"IN_PROCESS","currencyUomId":"USD","totalAmount":{"amount":100.00,"currency":"USD"},"lines":[{"invoiceItemSeqId":1,"productId":"38865cc4-f538-4569-a2ef-c8d89719bc3e","description":"Consulting Services","quantity":1.0,"amount":{"amount":100.00,"currency":"USD"}}]}'
    ```

---

## 🔗 **API Specifications**

All APIs use **OpenAPI 3.0**.

Specs available in:

```
/docs/api-specs/
```

Supports:
- REST  
- AsyncAPI (Kafka events)  
- gRPC (future roadmap)

---

## 🧭 **Roadmap**

### **Phase 1 — Financial Core (In Progress)**
- [x] Invoicing  
- [x] Payments  
- [x] GL Engine  
- [x] Inventory  
- [x] Tenancy  
- [x] Core events  

### **Phase 2 — Expansion**
- [ ] AP / Vendor Bills  
- [ ] Procurement workflow  
- [ ] Sales → Order → Dispatch  
- [ ] Document system  
- [ ] Workflow engine  

### **Phase 3 — AI Layer**
- [ ] AR prediction  
- [ ] Anomaly detection  
- [ ] Credit scoring  
- [ ] Auto-reconciliation  
- [ ] SKU demand forecasting  

---

## 📜 **License**

Released under the **Apache 2.0 License**.

---

## 🙌 **Contributing**

Contributions welcome — please see `/docs/CONTRIBUTING.md`.

---

## ✨ **Acknowledgements**

Inspired by modern ERP platforms, but reimagined using  
**microservices**, **event streams**, **AI**, and **cloud-native** engineering.

