$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    invoiceTypeId = "SALES_INVOICE"
    partyIdFrom = "00000000-0000-0000-0000-000000000001"
    partyIdTo = "123e4567-e89b-12d3-a456-426614174000"
    invoiceDate = "2025-11-28"
    dueDate = "2025-12-28"
    statusId = "INVOICE_IN_PROCESS"
    currencyUomId = "USD"
    totalAmount = @{
        amount = 100.00
        currency = "USD"
    }
    lines = @(
        @{
            description = "Test Item"
            quantity = 1
            unitPrice = 100.00
            productId = "00000000-0000-0000-0000-000000000002"
            amount = @{
                amount = 100.00
                currency = "USD"
            }
        }
    )
} | ConvertTo-Json -Depth 5

Write-Host "Sending Payload:"
Write-Host $body

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/v1/invoices" -Method Post -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "Success! Invoice Created:"
    Write-Host ($response | ConvertTo-Json -Depth 5)
} catch {
    Write-Host "Error:"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body:"
        Write-Host $responseBody
    }
}
