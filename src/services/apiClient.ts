const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(new URL(path, apiBaseUrl), init)
  } catch (error) {
    throw new ApiError(error instanceof Error ? error.message : 'Network request failed')
  }
  if (!response.ok) {
    const body = await response.text()
    throw new ApiError(body || `Request failed with status ${response.status}`, response.status)
  }
  try {
    return await response.json() as T
  } catch {
    throw new ApiError('The server returned an invalid response', response.status)
  }
}
