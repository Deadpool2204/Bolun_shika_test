import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, BookOpen, Brain, CheckCircle2, Clock3, Code2, Database, Flame, Play, Sparkles } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, PageHeading, SectionTitle } from '../components/common'
import { topicProgress, topics, weeklyStudy } from '../data/demoData'

const topicIcons = [Code2, Brain, Database, BookOpen]
const activity = [
  { icon: CheckCircle2, title: 'Quiz completed', detail: 'Python fundamentals · 4 of 5 correct', time: 'Yesterday', color: 'green' },
  { icon: BookOpen, title: 'Lesson continued', detail: 'Understanding SQL joins', time: 'Oct 25', color: 'violet' },
  { icon: Brain, title: 'Tutor conversation', detail: 'How does recursion work?', time: 'Oct 24', color: 'blue' },
]

export function Dashboard() {
  const navigate = useNavigate()
  const totalMinutes = weeklyStudy.reduce((sum, item) => sum + item.minutes, 0)
  return (
    <>
      <PageHeading eyebrow="TUESDAY, OCTOBER 28" title="Good morning, Alex" description="A little progress each day adds up to big results." action={<div className="streak-chip"><Flame size={16} /> 4 day streak</div>} />
      <div className="dashboard-grid">
        <Card className="continue-card">
          <div className="continue-copy"><span className="card-kicker"><span className="status-dot" /> PICK UP WHERE YOU LEFT OFF</span><h2>Functions &amp; Scope</h2><p>Python essentials <span className="bullet">·</span> Lesson 4 of 8</p><div className="progress-meta"><span>Course progress</span><strong>48%</strong></div><div className="progress-track"><span style={{ width: '48%' }} /></div><button className="button button-primary" onClick={() => navigate('/tutor')}>Continue learning <Play size={15} fill="currentColor" /></button></div>
          <div className="lesson-art" aria-hidden="true"><div className="art-page"><div /><div /><div /><div /></div><div className="art-spark"><Sparkles size={22} /></div><span className="art-label">def learn():</span></div>
        </Card>
        <Card className="week-card">
          <div className="week-heading"><div><span className="card-kicker">YOUR LEARNING THIS WEEK</span><h2>{totalMinutes} <small>min</small></h2></div><span className="week-trend"><ArrowUpRight size={15} /> This week</span></div>
          <div className="chart-wrap dashboard-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weeklyStudy} margin={{ left: -24, right: 2, top: 12, bottom: 0 }}><defs><linearGradient id="studyFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7955dc" stopOpacity={0.19} /><stop offset="95%" stopColor="#7955dc" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#efedf4" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8a899a', fontSize: 11 }} dy={8} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#9b99a7', fontSize: 10 }} /><Tooltip formatter={(value) => [`${value} min`, 'Study time']} /><Area type="monotone" dataKey="minutes" stroke="#6d45d9" strokeWidth={2.5} fill="url(#studyFill)" /></AreaChart></ResponsiveContainer></div>
        </Card>
      </div>
      <div className="section-row">
        <div className="section-main"><SectionTitle title="Start learning" link="Ask the tutor" onLink={() => navigate('/tutor')} /><div className="topic-grid">
          {topics.map((topic, index) => { const Icon = topicIcons[index]; return <button key={topic} className="topic-card" onClick={() => navigate('/tutor', { state: { topic } })}><div className={`topic-icon topic-${index}`}><Icon size={19} /></div><div><strong>{topic}</strong><span>{topicProgress[index].value}% explored</span></div><ArrowRight size={15} className="topic-arrow" /></button> })}
        </div></div>
        <Card className="revision-card"><SectionTitle title="Time for a quick review" /><p className="muted-copy">Revisit these topics to make your understanding stick.</p><button className="revision-item" onClick={() => navigate('/practice')}><span className="revision-mark amber" /><span><strong>SQL joins</strong><small>DBMS · 5 min review</small></span><ArrowRight size={15} /></button><button className="revision-item" onClick={() => navigate('/practice')}><span className="revision-mark blue" /><span><strong>Tree traversal</strong><small>Data Structures · 8 min review</small></span><ArrowRight size={15} /></button><button className="revision-action" onClick={() => navigate('/practice')}>Practice a topic <ArrowRight size={14} /></button></Card>
      </div>
      <div className="activity-section"><SectionTitle title="Recent activity" link="View progress" onLink={() => navigate('/progress')} /><Card className="activity-card">{activity.map(({ icon: Icon, title, detail, time, color }) => <div className="activity-row" key={title}><div className={`activity-icon ${color}`}><Icon size={17} /></div><div className="activity-info"><strong>{title}</strong><span>{detail}</span></div><time>{time}</time></div>)}</Card></div>
      <div className="demo-disclaimer"><Clock3 size={14} /> This is a sample learning workspace. Progress and activity shown are demonstration data.</div>
    </>
  )
}
