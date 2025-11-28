$body = @{
    invoiceTypeId = "SALES_INVOICE"
    partyIdFrom = "00000000-0000-0000-0000-000000000001"
    partyIdTo = "123e4567-e89b-12d3-a456-426614174000"
    invoiceDate = "2025-11-28"
    dueDate = "2025-12-28"
    statusId = "INVOICE_IN_PROCESS"
    currencyUomId = "USD"
    totalAmount = @{
        amount = 15000.00
        currency = "USD"
    }
    lines = @(
        @{
            description = "High Value Item - Should Trigger Anomaly"
            quantity = 1
            unitPrice = 15000.00
            productId = "00000000-0000-0000-0000-000000000002"
            amount = @{
                amount = 15000.00
                currency = "USD"
            }
        }
    )
} | ConvertTo-Json -Depth 5

Write-Host "Sending High-Value Payload:"
Write-Host $body

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/invoices" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Success! Invoice Created:"
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error:"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body:"
        Write-Host $reader.ReadToEnd()
    }
}
