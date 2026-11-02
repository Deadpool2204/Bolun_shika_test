import type { QuizAttempt } from '../types'
import { apiRequest } from './apiClient'

export interface LearningProgress {
  completedLessons: number
  quizAttempts: QuizAttempt[]
  studyMinutesByDay: Array<{ day: string; minutes: number }>
}

export function getLearningProgress(): Promise<LearningProgress> {
  return apiRequest<LearningProgress>('/api/progress/me')
}

export function submitTeachBack(prompt: string, response: string): Promise<{ feedback: string }> {
  return apiRequest<{ feedback: string }>('/api/tutor/teach-back', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, response }),
  })
}
