import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AudioLines, BookOpen, ChevronDown, CircleHelp, Mic, MicOff, Pause, Send, Sparkles, Volume2, X } from 'lucide-react'
import { Button, Card, PageHeading } from '../components/common'
import { topics } from '../data/demoData'
import { askTutor } from '../services/tutorService'
import type { ChatMessage, Topic } from '../types'

const suggestions = [
  'Explain recursion with a simple example.',
  'What is the difference between a stack and a queue?',
  'Explain SQL joins with sample tables.',
  'Help me understand Python dictionaries.',
]

interface RecognitionResultEvent extends Event {
  results: { length: number; [index: number]: { [index: number]: { transcript: string } } }
}
interface RecognitionLike {
  lang: string
  interimResults: boolean
  onresult: ((event: RecognitionResultEvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}
interface SpeechWindow extends Window {
  SpeechRecognition?: new () => RecognitionLike
  webkitSpeechRecognition?: new () => RecognitionLike
}

function isoTimestamp() {
  return new Date().toISOString()
}

function audioPlaybackEnabled() {
  try {
    const stored = localStorage.getItem('bolun-shika-preferences')
    return stored ? JSON.parse(stored).audioEnabled !== false : true
  } catch {
    return true
  }
}

export function Tutor() {
  const location = useLocation()
  const locationTopic = (location.state as { topic?: Topic } | null)?.topic
  const [topic, setTopic] = useState<Topic>(locationTopic ?? 'Python')
  const [level, setLevel] = useState('Beginner')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'unsupported' | 'denied'>('idle')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioEnabled] = useState(audioPlaybackEnabled)
  const [toast, setToast] = useState('')
  const recognition = useRef<RecognitionLike | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const speechBase = useRef('')

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }, [messages, loading])
  useEffect(() => () => { window.speechSynthesis?.cancel(); recognition.current?.stop() }, [])

  async function sendMessage(text = input) {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    const student: ChatMessage = { id: crypto.randomUUID(), role: 'student', text: trimmed, createdAt: isoTimestamp() }
    setMessages((current) => [...current, student])
    setInput('')
    setError('')
    setLoading(true)
    try {
      const answer = await askTutor(trimmed, topic)
      setMessages((current) => [...current, answer])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The tutor could not respond. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function startRecording() {
    const browser = window as SpeechWindow
    const SpeechRecognition = browser.SpeechRecognition ?? browser.webkitSpeechRecognition
    if (!SpeechRecognition) { setRecordingState('unsupported'); return }
    try {
      const instance = new SpeechRecognition()
      instance.lang = 'en-US'
      instance.interimResults = true
      instance.onresult = (event) => {
        const transcript = Array.from({ length: event.results.length }, (_, index) => event.results[index]?.[0]?.transcript ?? '').filter(Boolean).join(' ')
        setInput(`${speechBase.current}${speechBase.current && transcript ? ' ' : ''}${transcript}`)
      }
      instance.onerror = () => setRecordingState('denied')
      instance.onend = () => {
        setRecordingState((state) => {
          if (state !== 'recording') return state
          window.setTimeout(() => setRecordingState((current) => current === 'processing' ? 'idle' : current), 350)
          return 'processing'
        })
        recognition.current = null
      }
      recognition.current = instance
      speechBase.current = input.trimEnd()
      instance.start()
      setRecordingState('recording')
      setError('')
    } catch {
      setRecordingState('denied')
    }
  }

  function stopSpeaking() {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }

  async function retryLastMessage() {
    const lastQuestion = [...messages].reverse().find((message) => message.role === 'student')
    if (!lastQuestion || loading) return
    setError('')
    setLoading(true)
    try {
      const answer = await askTutor(lastQuestion.text, topic)
      setMessages((current) => [...current, answer])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The tutor could not respond. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function speak(text: string) {
    if (!window.speechSynthesis) { setToast('Speech playback is not supported in this browser.'); return }
    stopSpeaking()
    const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''))
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <>
      <PageHeading eyebrow="YOUR CONVERSATION SPACE" title="Learn by asking" description="Explore ideas at your pace. Your tutor will guide you one step at a time." />
      <div className="tutor-workspace">
        <Card className="tutor-card">
          <div className="tutor-toolbar">
            <label className="select-field">Topic <span><select value={topic} onChange={(event) => setTopic(event.target.value as Topic)}>{topics.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></span></label>
            <label className="select-field">Level <span><select value={level} onChange={(event) => setLevel(event.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select><ChevronDown size={14} /></span></label>
            <span className="demo-badge tutor-demo"><span /> Demo tutor</span>
          </div>
          <div className="conversation" aria-live="polite">
            {messages.length === 0 ? (
              <div className="tutor-welcome">
                <div className="tutor-orb"><Sparkles size={21} /></div>
                <h2>What would you like to understand?</h2>
                <p>Choose a question to get started, or ask anything about {topic.toLowerCase()}.</p>
                <div className="suggestion-grid">{suggestions.map((question) => <button key={question} className="suggestion" onClick={() => void sendMessage(question)}><span>{question}</span><Send size={14} /></button>)}</div>
              </div>
            ) : (
              <div className="message-list">{messages.map((message) => (
                <article key={message.id} className={`chat-message ${message.role}`}>
                  <div className="message-avatar">{message.role === 'tutor' ? <Sparkles size={15} /> : 'AS'}</div>
                  <div className="message-body">
                    <div className="message-label">{message.role === 'tutor' ? 'Bolun Shika tutor' : 'You'}<time>{message.createdAt.slice(11, 16)}</time></div>
                    <MessageContent message={message} />
                    {message.role === 'tutor' && <>
                      <div className="message-tools"><button disabled={!audioEnabled} title={audioEnabled ? 'Listen using browser speech' : 'Enable audio in Settings'} onClick={() => isSpeaking ? stopSpeaking() : speak(message.text)}>{isSpeaking ? <Pause size={14} /> : <Volume2 size={14} />}{audioEnabled ? (isSpeaking ? 'Stop audio' : 'Listen') : 'Audio off in settings'}</button><span>Browser voice preview · demo answer</span></div>
                      {message.sources?.length ? <div className="source-list"><strong>Sources</strong>{message.sources.map((source) => <span key={source.title}><BookOpen size={13} />{source.title} · p. {source.page}</span>)}</div> : <div className="source-note"><BookOpen size={13} /> No document sources — this is an illustrative demo response.</div>}
                    </>}
                  </div>
                </article>
              ))}</div>
            )}
            {loading && <div className="tutor-loading"><span className="typing-dots"><i /><i /><i /></span><span>Thinking through your question…</span></div>}
            {error && <div className="inline-error" role="alert">{error}<button onClick={() => void retryLastMessage()}>Try again</button></div>}
            <div ref={bottomRef} />
          </div>
          <div className="composer-wrap">
            {recordingState === 'unsupported' && <div className="inline-notice" role="status">Speech recognition isn’t available in this browser. You can still type your question.<button aria-label="Dismiss" onClick={() => setRecordingState('idle')}><X size={14} /></button></div>}
            {recordingState === 'denied' && <div className="inline-error" role="alert">Microphone access was denied or unavailable. Check your browser permissions and try again.<button onClick={() => setRecordingState('idle')}>Dismiss</button></div>}
            {recordingState === 'recording' && <div className="recording-label"><span className="recording-dot" /> Listening… Speak your question, then stop.</div>}
            {recordingState === 'processing' && <div className="recording-label"><AudioLines size={14} /> Preparing transcript — you can edit it before sending.</div>}
            <form className="composer" onSubmit={(event) => { event.preventDefault(); void sendMessage() }}>
              <button type="button" className={`mic-button${recordingState === 'recording' ? ' recording' : ''}`} onClick={() => recordingState === 'recording' ? recognition.current?.stop() : startRecording()} aria-label={recordingState === 'recording' ? 'Stop recording' : 'Start voice input'}>{recordingState === 'recording' ? <MicOff size={18} /> : <Mic size={18} />}</button>
              <label className="visually-hidden" htmlFor="tutor-message">Your question</label>
              <textarea id="tutor-message" rows={1} placeholder="Ask a question or describe what you're stuck on…" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendMessage() } }} />
              <Button type="submit" className="send-button" disabled={!input.trim() || loading} aria-label="Send question"><Send size={17} /></Button>
            </form>
            <div className="composer-footnote"><span><CircleHelp size={13} /> Shift + Enter for a new line</span><span>Demo answers are not verified learning advice.</span></div>
          </div>
        </Card>
        <aside className="tutor-side">
          <Card className="side-tip"><div className="tip-heading"><div className="tip-icon"><Sparkles size={17} /></div><strong>Make it your own</strong></div><p>Ask a follow-up, request another example, or tell your tutor what part feels confusing.</p><div className="tip-divider" /><button className="check-understanding" onClick={() => void sendMessage('Check my understanding with one question about what we just discussed.')}>Check my understanding <ArrowRightIcon /></button></Card>
          <Card className="privacy-card"><AudioLines size={17} /><div><strong>Voice, your way</strong><p>Voice input uses your browser’s speech recognition. Text stays available at all times.</p></div></Card>
          {toast && <div className="toast" role="status">{toast}<button onClick={() => setToast('')}><X size={14} /></button></div>}
        </aside>
      </div>
    </>
  )
}

function ArrowRightIcon() {
  return <Send size={14} />
}
