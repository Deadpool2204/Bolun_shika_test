import type { QuizAttempt, QuizQuestion } from '../types'
import { apiRequest } from './apiClient'

export function submitQuiz(answers: Record<string, number>): Promise<QuizAttempt> {
  return apiRequest<QuizAttempt>('/api/quiz/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  })
}

export function getQuizQuestions(topic: string, difficulty: string): Promise<QuizQuestion[]> {
  return apiRequest<QuizQuestion[]>(`/api/quiz/questions?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}`)
}
