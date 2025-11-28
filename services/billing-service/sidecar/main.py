from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from typing import List

app = FastAPI(title="Billing AI Sidecar")

class InvoiceData(BaseModel):
    tenant_id: str
    amount: float
    currency: str
    customer_id: str

class AnomalyResult(BaseModel):
    is_anomalous: bool
    confidence_score: float
    reason: str

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/predict/anomaly", response_model=AnomalyResult)
def predict_anomaly(invoice: InvoiceData):
    # Stub implementation: Flag high amounts as anomalous
    # In real implementation, this would load a trained model
    
    threshold = 10000.0
    
    if invoice.amount > threshold:
        return AnomalyResult(
            is_anomalous=True,
            confidence_score=0.85,
            reason=f"Amount {invoice.amount} exceeds threshold {threshold}"
        )
    
    return AnomalyResult(
        is_anomalous=False,
        confidence_score=0.95,
        reason="Normal transaction pattern"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
