type RetryOptions = {
    maxRetries?: number
    delayMs?: number
    backoff?: boolean
    onRetry?: (error: Error, attempt: number) => void
}

export async function retryFetch<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const { maxRetries = 3, delayMs = 1000, backoff = true, onRetry } = options

    let lastError: Error

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn()
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error))

            if (attempt === maxRetries) {
                throw lastError
            }

            if (onRetry) {
                onRetry(lastError, attempt)
            }

            const delay = backoff ? delayMs * Math.pow(2, attempt - 1) : delayMs
            await new Promise((resolve) => setTimeout(resolve, delay))
        }
    }

    throw lastError!
}

export function isRetryableError(error: unknown): boolean {
    if (!(error instanceof Error)) return false

    const message = error.message.toLowerCase()

    // Network errors
    if (message.includes('network') || message.includes('fetch')) return true

    // Timeout errors
    if (message.includes('timeout')) return true

    // Rate limit errors
    if (message.includes('rate limit') || message.includes('429')) return true

    // Server errors (5xx)
    if (message.includes('500') || message.includes('502') || message.includes('503')) return true

    return false
}
