import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, CircleHelp, RotateCcw, Send, Sparkles, XCircle } from 'lucide-react'
import { Button, Card, EmptyState, PageHeading } from '../components/common'
import { questions, topics } from '../data/demoData'
import type { Difficulty, Topic } from '../types'

export function Quiz() {
  const [topic, setTopic] = useState<Topic>('Python')
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const quizQuestions = useMemo(() => questions.filter((question) => question.topic === topic && question.difficulty === difficulty), [topic, difficulty])
  const current = quizQuestions[index]
  const score = quizQuestions.reduce((total, question) => total + (answers[question.id] === question.answer ? 1 : 0), 0)
  const missed = quizQuestions.filter((question) => answers[question.id] !== question.answer)

  function reset(nextTopic = topic, nextDifficulty = difficulty) {
    setTopic(nextTopic)
    setDifficulty(nextDifficulty)
    setIndex(0)
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <>
      <PageHeading eyebrow="PRACTICE & QUIZZES" title={submitted ? 'Your results' : 'Practice what you know'} description={submitted ? 'Review your answers and see what to explore next.' : 'A few thoughtful questions can help new ideas stick.'} />
      <div className="quiz-config"><label>Topic<select value={topic} onChange={(event) => reset(event.target.value as Topic)}>{topics.map((item) => <option key={item}>{item}</option>)}</select></label><label>Difficulty<select value={difficulty} onChange={(event) => reset(topic, event.target.value as Difficulty)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label><span className="demo-badge"><span /> Sample questions</span></div>
      {submitted ? <div className="quiz-results-layout"><Card className="result-card"><div className="result-check"><CheckCircle2 size={26} /></div><span className="card-kicker">QUIZ COMPLETE · {topic.toUpperCase()}</span><h2>{score} <small>/ {quizQuestions.length}</small></h2><p>{score === quizQuestions.length ? 'Excellent work — you got every question right.' : score >= Math.ceil(quizQuestions.length / 2) ? 'Nice work. Review the explanations to reinforce what you know.' : 'Keep practicing. Every attempt helps build understanding.'}</p><div className="result-meter"><span style={{ width: `${quizQuestions.length ? (score / quizQuestions.length) * 100 : 0}%` }} /></div><Button onClick={() => reset()}><RotateCcw size={15} /> Try again</Button></Card><Card className="answer-review"><div className="section-title"><h2>Review your answers</h2><span>{missed.length} to revisit</span></div>{quizQuestions.map((question, questionIndex) => { const correct = answers[question.id] === question.answer; return <div className="review-question" key={question.id}><div className="review-heading">{correct ? <CheckCircle2 size={16} className="correct-icon" /> : <XCircle size={16} className="incorrect-icon" />}<strong>Question {questionIndex + 1}</strong></div><p>{question.prompt}</p><div className="review-response">Your answer: <strong>{answers[question.id] === undefined ? 'Not answered' : question.options[answers[question.id]]}</strong>{!correct && <span>Correct answer: <strong>{question.options[question.answer]}</strong></span>}</div><p className="explanation">{question.explanation}</p></div> })}</Card></div> :
        <div className="quiz-layout"><Card className="quiz-card">{current ? <><div className="quiz-progress-row"><span>QUESTION {index + 1} <span className="subtle">OF {quizQuestions.length}</span></span><span>{difficulty}</span></div><div className="quiz-progress"><span style={{ width: `${((index + 1) / quizQuestions.length) * 100}%` }} /></div><h2>{current.prompt}</h2><div className="answer-options" role="radiogroup" aria-label="Answer choices">{current.options.map((option, optionIndex) => <button key={option} className={`answer-option${answers[current.id] === optionIndex ? ' picked' : ''}`} role="radio" aria-checked={answers[current.id] === optionIndex} onClick={() => setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: optionIndex }))}><span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span>{answers[current.id] === optionIndex && <CheckCircle2 size={17} />}</button>)}</div><div className="quiz-actions"><Button variant="secondary" disabled={index === 0} onClick={() => setIndex((value) => value - 1)}><ArrowLeft size={15} /> Previous</Button><span>{Object.keys(answers).length} answered</span>{index < quizQuestions.length - 1 ? <Button onClick={() => setIndex((value) => value + 1)}>Next <ArrowRight size={15} /></Button> : <Button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length !== quizQuestions.length}><Send size={14} /> Submit answers</Button>}</div></> : <EmptyState title="No questions at this level yet" text="Try another difficulty or topic to start a practice set." />}</Card><aside className="quiz-aside"><Card className="quiz-aside-card"><div className="aside-icon"><Sparkles size={17} /></div><h3>Practice, then reflect</h3><p>Choose the answer that feels right. You’ll get an explanation after submitting the quiz.</p><div className="aside-rule" /><div className="quiz-progress-copy"><span>Questions answered</span><strong>{Object.keys(answers).length} / {quizQuestions.length}</strong></div><div className="mini-progress"><span style={{ width: `${quizQuestions.length ? Object.keys(answers).length / quizQuestions.length * 100 : 0}%` }} /></div></Card><div className="quiz-demo-note"><CircleHelp size={15} /><p>Questions are a small, curated frontend demo set—not generated by an AI model.</p></div></aside></div>}
    </>
  )
}
