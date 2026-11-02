import { useMemo } from 'react'
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, PageHeading, SectionTitle } from '../components/common'
import { demoAttempts, topicProgress, weeklyStudy } from '../data/demoData'

const colors = ['#7150d5', '#6196dc', '#61aa86', '#d2a44a']

export function Progress() {
  const navigate = useNavigate()
  const minutes = weeklyStudy.reduce((sum, item) => sum + item.minutes, 0)
  const accuracy = useMemo(() => {
    const total = demoAttempts.reduce((sum, attempt) => sum + attempt.total, 0)
    return total ? Math.round(demoAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / total * 100) : 0
  }, [])
  const completedLessons = topicProgress.reduce((sum, item) => sum + Math.floor(item.value / 20), 0)
  return (
    <>
      <PageHeading eyebrow="YOUR LEARNING JOURNEY" title="Learning progress" description="A snapshot of your demo learning activity and the steps you’ve taken." action={<span className="period-select">Last 7 days <span>⌄</span></span>} />
      <div className="metric-grid"><Metric icon={BookOpen} label="Lessons explored" value={String(completedLessons)} detail="Across 4 learning topics" color="violet" /><Metric icon={Target} label="Quiz accuracy" value={`${accuracy}%`} detail={`${demoAttempts.length} sample attempts`} color="green" /><Metric icon={Clock3} label="Study time" value={`${Math.floor(minutes / 60)}h ${minutes % 60}m`} detail="This week · demo estimate" color="blue" /></div>
      <div className="progress-charts"><Card className="study-chart-card"><SectionTitle title="Study time this week" /><p className="chart-caption">Minutes spent learning each day · sample data</p><div className="chart-wrap progress-bar-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={weeklyStudy} margin={{ left: -18, right: 2, top: 10, bottom: 0 }}><CartesianGrid vertical={false} stroke="#efedf4" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8a899a', fontSize: 11 }} dy={8} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#9b99a7', fontSize: 10 }} /><Tooltip formatter={(value) => [`${value} min`, 'Study time']} /><Bar dataKey="minutes" fill="#7955dc" radius={[5, 5, 0, 0]} maxBarSize={32} /></BarChart></ResponsiveContainer></div></Card><Card className="accuracy-card"><SectionTitle title="Quiz accuracy by attempt" /><p className="chart-caption">Correct answers as a share of each sample quiz</p><div className="accuracy-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={demoAttempts.map((attempt) => ({ name: attempt.topic, value: Math.round(attempt.score / attempt.total * 100) }))} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={78} paddingAngle={4}>{demoAttempts.map((attempt, index) => <Cell key={attempt.id} fill={colors[index]} />)}</Pie><Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} /></PieChart></ResponsiveContainer><div className="donut-label"><strong>{accuracy}%</strong><span>overall</span></div></div><div className="chart-legend">{demoAttempts.map((attempt, index) => <span key={attempt.id}><i style={{ backgroundColor: colors[index] }} />{attempt.topic}</span>)}</div></Card></div>
      <div className="progress-bottom"><Card className="topic-progress-card"><SectionTitle title="Progress by topic" /><div className="topic-progress-list">{topicProgress.map((item, index) => <div className="topic-progress-row" key={item.topic}><div className={`topic-mini topic-${index}`}><span /></div><div className="topic-progress-main"><div><strong>{item.topic}</strong><span>{item.value}%</span></div><div className="progress-track"><span style={{ width: `${item.value}%` }} /></div></div></div>)}</div></Card><Card className="attempt-card"><SectionTitle title="Recent quiz attempts" /><div className="attempt-list">{demoAttempts.map((attempt) => <div className="attempt-row" key={attempt.id}><div className="attempt-mark"><CheckCircle2 size={16} /></div><div><strong>{attempt.topic}</strong><span>{attempt.completedAt} · {attempt.score} of {attempt.total} correct</span></div><strong className="attempt-percent">{Math.round(attempt.score / attempt.total * 100)}%</strong></div>)}</div><button className="text-link attempt-link" onClick={() => navigate('/practice')}>Practice another quiz <ArrowRight size={14} /></button></Card></div>
      <div className="demo-disclaimer"><Clock3 size={14} /> All analytics on this page are computed from bundled sample data, not a live account.</div>
    </>
  )
}

function Metric({ icon: Icon, label, value, detail, color }: { icon: typeof BookOpen; label: string; value: string; detail: string; color: string }) {
  return <Card className="metric-card"><div className={`metric-icon ${color}`}><Icon size={18} /></div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></Card>
}
