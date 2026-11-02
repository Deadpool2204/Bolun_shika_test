import type { ChatMessage, Topic, TutorAnswer } from '../types'
import { apiRequest } from './apiClient'

export async function askTutor(question: string, topic: Topic): Promise<ChatMessage> {
  if (import.meta.env.VITE_DEMO_MODE === 'false') {
    return apiRequest<ChatMessage>('/api/tutor/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, topic }),
    })
  }
  await new Promise((resolve) => window.setTimeout(resolve, 700))
  const lower = question.toLowerCase()
  let answer: TutorAnswer
  if (lower.includes('recursion')) {
    answer = {
      directAnswer: 'Recursion is when a function solves a problem by calling itself on a smaller input.',
      explanation: 'Each call makes the problem smaller. A base case tells the calls when to stop, so the function does not continue forever.',
      codeExample: 'def countdown(n):\n    if n <= 0:  # base case\n        return\n    print(n)\n    countdown(n - 1)  # smaller problem',
      keyTakeaway: 'Every recursive solution needs progress toward a base case.',
      followUp: 'Which line in this example prevents the calls from continuing forever?',
    }
  } else if (lower.includes('stack') || lower.includes('queue')) {
    answer = {
      directAnswer: 'A stack is Last In, First Out; a queue is First In, First Out.',
      explanation: 'A stack is like a pile of books: the newest one is removed first. A queue is like a line at a café: the first person in line is served first.',
      codeExample: 'stack = [\"first\", \"last\"]\nstack.pop()  # \"last\"\n\nfrom collections import deque\nqueue = deque([\"first\", \"last\"])\nqueue.popleft()  # \"first\"',
      keyTakeaway: 'Use a stack for newest-first work and a queue when arrival order matters.',
      followUp: 'Would a browser’s Back button behave more like a stack or a queue?',
    }
  } else {
    answer = {
      directAnswer: `Let’s break your ${topic.toLowerCase()} question into a smaller idea first.`,
      explanation: 'Connect the definition to one concrete case, then trace what changes at each step. That makes it easier to explain the concept in your own words.',
      example: `Try describing one small example related to “${question}” and identify what you already know.`,
      keyTakeaway: 'Work from a small example before generalizing the rule.',
      followUp: 'Which part would you like to explore with a more specific example?',
    }
  }
  const response = [answer.directAnswer, answer.explanation, answer.example, answer.codeExample, answer.keyTakeaway, answer.followUp].filter(Boolean).join('\n')
  return {
    id: crypto.randomUUID(),
    role: 'tutor',
    text: response,
    createdAt: new Date().toISOString(),
    sources: [],
    answer,
  }
}
