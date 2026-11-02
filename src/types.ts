export type Topic = 'Python' | 'Data Structures' | 'DBMS' | 'Web Development'
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export interface SourceCitation {
  title: string
  page: number
  demo?: boolean
}

export interface ChatMessage {
  id: string
  role: 'student' | 'tutor'
  text: string
  createdAt: string
  sources?: SourceCitation[]
  answer?: TutorAnswer
}

export interface TutorAnswer {
  directAnswer: string
  explanation: string
  example?: string
  codeExample?: string
  keyTakeaway: string
  followUp: string
}

export type ResourceStatus = 'Selected' | 'Uploading' | 'Processing' | 'Ready' | 'Failed'

export interface LearningResource {
  id: string
  title: string
  subject: Topic
  uploadedAt: string
  fileType: 'PDF'
  status: ResourceStatus
  size?: number
}

export interface QuizQuestion {
  id: string
  topic: Topic
  difficulty: Difficulty
  prompt: string
  options: string[]
  answer: number
  explanation: string
}

export interface QuizAttempt {
  id: string
  topic: Topic
  score: number
  total: number
  completedAt: string
}

export interface UserPreferences {
  displayName: string
  language: string
  level: Difficulty
  explanationStyle: string
  audioEnabled: boolean
}
