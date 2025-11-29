/**
 * API URL utility functions
 * Handles different environments (Docker, local development, production)
 */

/**
 * Get the API URL for server-side requests (Server Components, API Routes)
 * Uses internal Docker service name when available, falls back to public URL
 */
export function getServerApiUrl(): string {
    // In Docker, use internal service name for server-side requests
    // This works because Next.js server runs in the same Docker network
    if (process.env.API_INTERNAL_URL) {
        return process.env.API_INTERNAL_URL;
    }
    
    // Fallback to public URL
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
}

/**
 * Get the API URL for client-side requests (browser)
 * Always uses public URL (localhost or production domain)
 */
export function getClientApiUrl(): string {
    // Client-side always uses public URL
    if (typeof window !== 'undefined') {
        return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
    }
    
    // If called from server (shouldn't happen), use server URL
    return getServerApiUrl();
}

/**
 * Get the appropriate API URL based on context
 * Automatically detects server vs client
 */
export function getApiUrl(): string {
    const isServer = typeof window === 'undefined';
    return isServer ? getServerApiUrl() : getClientApiUrl();
}

/**
 * Test if the billing service is reachable
 * Returns true if the service responds, false otherwise
 */
export async function testBillingServiceConnection(): Promise<boolean> {
    try {
        const apiUrl = getClientApiUrl();
        const response = await fetch(`${apiUrl}/actuator/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000), // 5 second timeout
        });
        return response.ok;
    } catch (error) {
        console.error('Billing service health check failed:', error);
        return false;
    }
}

/**
 * Get a user-friendly error message for API connection failures
 */
export function getConnectionErrorMessage(): string {
    const apiUrl = getClientApiUrl();
    return `Unable to connect to billing service at ${apiUrl}.\n\nPlease ensure:\n1. Docker containers are running: docker compose ps\n2. Billing service is healthy: docker compose logs billing-service\n3. Service is accessible: curl ${apiUrl}/actuator/health`;
}
