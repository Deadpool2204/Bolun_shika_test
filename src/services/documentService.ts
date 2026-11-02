import type { LearningResource } from '../types'
import { apiRequest } from './apiClient'

export function uploadDocument(file: File): Promise<LearningResource> {
  const body = new FormData()
  body.append('file', file)
  return apiRequest<LearningResource>('/api/documents/upload', { method: 'POST', body })
}

export function listDocuments(): Promise<LearningResource[]> {
  return apiRequest<LearningResource[]>('/api/documents')
}
