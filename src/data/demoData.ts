import type { LearningResource, QuizAttempt, QuizQuestion, Topic } from '../types'

export const topics: Topic[] = ['Python', 'Data Structures', 'DBMS', 'Web Development']

export const resources: LearningResource[] = [
  { id: 'r1', title: 'Python Essentials — Functions & Scope', subject: 'Python', uploadedAt: 'Oct 22, 2026', fileType: 'PDF', status: 'Ready' },
  { id: 'r2', title: 'Database Systems: Normalisation', subject: 'DBMS', uploadedAt: 'Oct 19, 2026', fileType: 'PDF', status: 'Ready' },
  { id: 'r3', title: 'Data Structures — Trees', subject: 'Data Structures', uploadedAt: 'Oct 16, 2026', fileType: 'PDF', status: 'Processing' },
]

export const questions: QuizQuestion[] = [
  { id: 'py1', topic: 'Python', difficulty: 'Beginner', prompt: 'What does a Python function return if it has no return statement?', options: ['0', 'None', 'An empty string', 'It raises an error'], answer: 1, explanation: 'A function without an explicit return statement returns None.' },
  { id: 'py2', topic: 'Python', difficulty: 'Beginner', prompt: 'Which collection keeps items in insertion order and allows duplicates?', options: ['Set', 'Tuple only', 'List', 'Dictionary keys'], answer: 2, explanation: 'A list is ordered and can contain repeated values.' },
  { id: 'ds1', topic: 'Data Structures', difficulty: 'Beginner', prompt: 'Which structure follows Last In, First Out (LIFO)?', options: ['Queue', 'Stack', 'Linked list', 'Graph'], answer: 1, explanation: 'A stack removes the most recently added item first.' },
  { id: 'ds2', topic: 'Data Structures', difficulty: 'Intermediate', prompt: 'What is the average lookup time for a hash table?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 0, explanation: 'With a well-distributed hash function, lookup is O(1) on average.' },
  { id: 'db1', topic: 'DBMS', difficulty: 'Beginner', prompt: 'Which SQL clause filters rows before grouping?', options: ['HAVING', 'ORDER BY', 'WHERE', 'SELECT'], answer: 2, explanation: 'WHERE filters individual rows before GROUP BY is applied.' },
  { id: 'db2', topic: 'DBMS', difficulty: 'Intermediate', prompt: 'A foreign key primarily helps to…', options: ['Sort a table', 'Enforce a relationship between tables', 'Encrypt a column', 'Remove duplicate rows'], answer: 1, explanation: 'Foreign keys enforce referential integrity between related tables.' },
  { id: 'web1', topic: 'Web Development', difficulty: 'Beginner', prompt: 'What does CSS primarily describe?', options: ['Page structure', 'Page presentation', 'Server routes', 'Database schema'], answer: 1, explanation: 'CSS controls the visual presentation and layout of web documents.' },
  { id: 'web2', topic: 'Web Development', difficulty: 'Intermediate', prompt: 'Which HTTP method is commonly used to retrieve a resource?', options: ['POST', 'PATCH', 'GET', 'DELETE'], answer: 2, explanation: 'GET is the standard method for requesting a representation of a resource.' },
]

export const demoAttempts: QuizAttempt[] = [
  { id: 'a1', topic: 'Python', score: 4, total: 5, completedAt: 'Oct 27' },
  { id: 'a2', topic: 'DBMS', score: 3, total: 4, completedAt: 'Oct 25' },
  { id: 'a3', topic: 'Data Structures', score: 5, total: 6, completedAt: 'Oct 22' },
]

export const weeklyStudy = [
  { day: 'Mon', minutes: 25 }, { day: 'Tue', minutes: 42 }, { day: 'Wed', minutes: 35 },
  { day: 'Thu', minutes: 55 }, { day: 'Fri', minutes: 30 }, { day: 'Sat', minutes: 68 }, { day: 'Sun', minutes: 40 },
]

export const topicProgress = [
  { topic: 'Python', value: 72, color: 'violet' },
  { topic: 'Data Structures', value: 48, color: 'blue' },
  { topic: 'DBMS', value: 64, color: 'green' },
  { topic: 'Web Development', value: 31, color: 'amber' },
]
