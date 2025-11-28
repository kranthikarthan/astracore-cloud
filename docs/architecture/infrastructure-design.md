# Infrastructure Design - Azure Cloud Native

## 1. Resource Group Strategy
*   `rg-astracore-shared-prod`: Shared resources (ACR, DNS, Front Door).
*   `rg-astracore-app-prod`: Application resources (AKS, SQL, Event Hubs).

## 2. Network Topology (Hub & Spoke)

*   **Hub VNet**:
    *   Firewall / NVA.
    *   VPN Gateway / ExpressRoute.
    *   Bastion Host.
*   **Spoke VNet (AKS)**:
    *   `snet-aks-nodes`: Subnet for K8s nodes.
    *   `snet-privatelink`: Subnet for Private Endpoints (DB, Redis, Key Vault).
    *   `snet-app-gateway`: Subnet for App Gateway (Ingress).

## 3. Compute: Azure Kubernetes Service (AKS)

*   **Tier**: Standard.
*   **Node Pools**:
    *   `system`: Critical system pods (CoreDNS, Metrics).
    *   `user`: Business applications.
    *   `gpu` (Optional): For AI training/inference if not using external services.
*   **CNI**: Azure CNI Overlay (better IP management).
*   **Autoscaling**: Cluster Autoscaler enabled.

## 4. Data Services

### 4.1 Azure Database for PostgreSQL (Flexible Server)
*   **HA**: Zone Redundant.
*   **Backups**: Geo-redundant (7-35 days retention).
*   **Auth**: Azure AD Authentication enabled.

### 4.2 Azure Event Hubs (Kafka)
*   **Tier**: Premium (required for Kafka compatibility + VNet injection).
*   **Capture**: Enabled (to Blob Storage) for data lake ingestion.

### 4.3 Azure Cache for Redis
*   **Tier**: Premium (Persistence + Clustering support).

## 5. CI/CD Pipeline (GitHub Actions)

1.  **CI**:
    *   Checkout -> JDK Setup -> Maven Build -> Unit Tests.
    *   Docker Build -> Scan (Trivy) -> Push to **Azure Container Registry (ACR)**.
2.  **CD**:
    *   Trigger on tag/merge.
    *   Helm Upgrade -> AKS.
    *   Database Migrations (Flyway/Liquibase) via init-container or job.

## 6. Cost Optimization
*   Use **Spot Instances** for non-critical node pools (e.g., dev/test environments).
*   **Reserved Instances** for DB and Base Node Pools (1yr/3yr).
*   **Auto-shutdown** for non-prod environments.
