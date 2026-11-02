import { useMemo, useRef, useState } from 'react'
import { BookOpen, ChevronDown, FileText, Filter, MoreHorizontal, Plus, Search, Upload, X } from 'lucide-react'
import { Button, Card, EmptyState, PageHeading } from '../components/common'
import { resources as startingResources, topics } from '../data/demoData'
import type { LearningResource, ResourceStatus } from '../types'

const statusClass: Record<ResourceStatus, string> = { Selected: 'status-selected', Uploading: 'status-uploading', Processing: 'status-processing', Ready: 'status-ready', Failed: 'status-failed' }

export function Resources() {
  const [resources, setResources] = useState(startingResources)
  const [search, setSearch] = useState('')
  const [topic, setTopic] = useState('All topics')
  const [status, setStatus] = useState('All statuses')
  const [selected, setSelected] = useState<LearningResource | null>(null)
  const [notice, setNotice] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const filtered = useMemo(() => resources.filter((resource) => {
    return resource.title.toLowerCase().includes(search.toLowerCase()) &&
      (topic === 'All topics' || resource.subject === topic) &&
      (status === 'All statuses' || resource.status === status)
  }), [resources, search, topic, status])

  function handleFile(file?: File) {
    if (!file) return
    setNotice('')
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setNotice('Please choose a PDF file.')
      if (fileRef.current) fileRef.current.value = ''
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setNotice('This file is larger than 20 MB. Choose a smaller PDF.')
      if (fileRef.current) fileRef.current.value = ''
      return
    }
    const resource: LearningResource = { id: crypto.randomUUID(), title: file.name.replace(/\.pdf$/i, ''), subject: 'Python', uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), fileType: 'PDF', status: 'Selected', size: file.size }
    setResources((current) => [resource, ...current])
    setSelected(resource)
    setNotice(`${file.name} selected (${formatSize(file.size)}). Indexing is simulated in this demo.`)
    window.setTimeout(() => setResources((current) => current.map((item) => item.id === resource.id ? { ...item, status: 'Uploading' } : item)), 350)
    window.setTimeout(() => setResources((current) => current.map((item) => item.id === resource.id ? { ...item, status: 'Processing' } : item)), 1100)
    window.setTimeout(() => setResources((current) => current.map((item) => item.id === resource.id ? { ...item, status: 'Ready' } : item)), 2600)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <>
      <PageHeading eyebrow="YOUR STUDY LIBRARY" title="My resources" description="Keep your course notes and study materials in one place." action={<><input ref={fileRef} id="pdf-upload" type="file" accept="application/pdf,.pdf" className="visually-hidden" onChange={(event) => handleFile(event.target.files?.[0])} /><Button onClick={() => fileRef.current?.click()}><Plus size={16} /> Add PDF</Button></>} />
      {notice && <div className={`resource-notice${notice.startsWith('Please') || notice.startsWith('This file') ? ' notice-error' : ''}`} role="status"><FileText size={15} />{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15} /></button></div>}
      <Card className="resource-controls"><label className="search-field"><Search size={17} /><span className="visually-hidden">Search resources</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by document title…" /></label><label className="filter-field"><Filter size={15} /><span className="visually-hidden">Filter by topic</span><select value={topic} onChange={(event) => setTopic(event.target.value)}><option>All topics</option>{topics.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></label><label className="filter-field"><span className="visually-hidden">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Selected</option><option>Uploading</option><option>Processing</option><option>Ready</option><option>Failed</option></select><ChevronDown size={14} /></label><span className="result-count">{filtered.length} {filtered.length === 1 ? 'resource' : 'resources'}</span></Card>
      {filtered.length ? <div className="resources-layout"><div className="resource-list">{filtered.map((resource) => <button key={resource.id} className={`resource-row${selected?.id === resource.id ? ' selected' : ''}`} onClick={() => setSelected(resource)}><div className="file-icon"><FileText size={20} /></div><div className="resource-name"><strong>{resource.title}</strong><span>{resource.subject} <i>·</i> PDF <i>·</i> {resource.uploadedAt}</span></div><span className={`status-tag ${statusClass[resource.status]}`}><span />{resource.status}</span><MoreHorizontal size={18} className="resource-more" /></button>)}</div>
        <Card className="resource-preview">{selected ? <><div className="preview-toolbar"><span>RESOURCE DETAILS</span><button aria-label="Close preview" onClick={() => setSelected(null)}><X size={16} /></button></div><div className="preview-file"><div className="file-icon large"><FileText size={24} /></div><h2>{selected.title}</h2><span className={`status-tag ${statusClass[selected.status]}`}><span />{selected.status}</span></div><div className="preview-meta"><div><span>Subject</span><strong>{selected.subject}</strong></div><div><span>File type</span><strong>PDF document</strong></div><div><span>Added</span><strong>{selected.uploadedAt}</strong></div>{selected.size && <div><span>File size</span><strong>{formatSize(selected.size)}</strong></div>}</div><div className="preview-message"><BookOpen size={16} /><p>{selected.status === 'Ready' ? 'This demo document is marked ready, but it has not been uploaded or indexed by a backend.' : 'Processing status is simulated for this frontend demo. No content has been uploaded or indexed.'}</p></div></> : <div className="preview-empty"><FileText size={24} /><strong>Select a resource</strong><span>Choose a document to see its details.</span></div>}</Card></div> : <Card className="empty-card"><EmptyState title={resources.length ? 'No matching resources' : 'Your library is ready'} text={resources.length ? 'Try adjusting your search or filters.' : 'Add a PDF to keep your study materials together. Selected files stay in this temporary demo session.'} /></Card>}
      <div className="upload-hint"><Upload size={15} /><span>PDF files only · Up to 20 MB · Files are kept in temporary browser state for this demo.</span></div>
    </>
  )
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
