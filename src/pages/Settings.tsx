import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, RotateCcw, Save, Volume2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button, Card, PageHeading } from '../components/common'
import type { UserPreferences } from '../types'

const preferenceSchema = z.object({
  displayName: z.string().trim().min(2, 'Please enter at least 2 characters.').max(40, 'Keep your name under 40 characters.'),
  language: z.string().min(1, 'Choose a language.'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  explanationStyle: z.string().min(1, 'Choose an explanation style.'),
  audioEnabled: z.boolean(),
})
type FormValues = z.infer<typeof preferenceSchema>
const defaultPreferences: UserPreferences = { displayName: 'Alex Student', language: 'English', level: 'Beginner', explanationStyle: 'Step by step', audioEnabled: true }
const storageKey = 'bolun-shika-preferences'

function loadPreferences(): { preferences: UserPreferences; error?: string } {
  try {
    const stored = localStorage.getItem(storageKey)
    if (!stored) return { preferences: defaultPreferences }
    const parsed: unknown = JSON.parse(stored)
    const result = preferenceSchema.safeParse(parsed)
    return result.success
      ? { preferences: result.data }
      : { preferences: defaultPreferences, error: 'Saved preferences were invalid, so defaults are shown.' }
  } catch {
    return { preferences: defaultPreferences, error: 'Saved preferences could not be read. Browser storage may be unavailable.' }
  }
}

export function Settings() {
  const [initialPreferences] = useState(loadPreferences)
  const [saved, setSaved] = useState(false)
  const [storageError, setStorageError] = useState(initialPreferences.error ?? '')
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormValues>({ resolver: zodResolver(preferenceSchema), defaultValues: initialPreferences.preferences })

  function save(values: FormValues) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(values))
      reset(values)
      setStorageError('')
      setSaved(true)
      window.setTimeout(() => setSaved(false), 3500)
    } catch (error) {
      setSaved(false)
      setStorageError(error instanceof Error ? `Preferences could not be saved: ${error.message}` : 'Preferences could not be saved in this browser.')
    }
  }

  function restoreDefaults() {
    reset(defaultPreferences)
    try { localStorage.removeItem(storageKey); setStorageError('') } catch (error) {
      setStorageError(error instanceof Error ? `Saved preferences could not be cleared: ${error.message}` : 'Saved preferences could not be cleared from this browser.')
    }
    setSaved(false)
  }

  return (
    <>
      <PageHeading eyebrow="MAKE IT YOURS" title="Settings" description="Choose how you’d like your learning workspace to feel." />
      <form className="settings-layout" onSubmit={handleSubmit(save)}>
        <div className="settings-main">
          <Card className="settings-card"><div className="settings-section-head"><div className="settings-avatar">AS</div><div><h2>Learning profile</h2><p>These preferences are saved only in this browser.</p></div></div><div className="form-grid"><Field label="Display name" error={errors.displayName?.message}><input {...register('displayName')} /></Field><Field label="Preferred language" error={errors.language?.message}><select {...register('language')}><option>English</option><option>Hindi</option><option>Bengali</option><option>Spanish</option></select></Field><Field label="Learning level" error={errors.level?.message}><select {...register('level')}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></Field></div></Card>
          <Card className="settings-card"><div className="settings-section-head"><div className="settings-icon"><Volume2 size={18} /></div><div><h2>Explanation preferences</h2><p>Help the demo tutor tailor its teaching style.</p></div></div><Field label="Explanation style" error={errors.explanationStyle?.message}><select {...register('explanationStyle')}><option>Step by step</option><option>Simple and concise</option><option>Examples first</option><option>More detail</option></select></Field><label className="toggle-row"><span><strong>Audio playback</strong><small>Allow the tutor to read answers aloud using browser speech.</small></span><input type="checkbox" {...register('audioEnabled')} /><span className="toggle-ui" aria-hidden="true" /></label></Card>
          <div className="settings-actions"><Button type="button" variant="ghost" onClick={restoreDefaults}><RotateCcw size={15} /> Reset to defaults</Button><Button type="submit" disabled={!isDirty && !saved}><Save size={15} /> Save preferences</Button></div>
          {saved && <div className="save-notice" role="status"><Check size={16} /> Preferences saved in this browser.</div>}
          {storageError && <div className="inline-error" role="alert">{storageError}</div>}
        </div>
        <aside className="settings-aside"><div className="settings-info"><h3>About demo settings</h3><p>These preferences are local to this browser and are not sent to an account or server.</p><div className="settings-info-line" /><p>Theme switching, password changes, and account security are not part of this demo.</p></div></aside>
      </form>
    </>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className={`form-field${error ? ' has-error' : ''}`}><span>{label}</span>{children}{error && <small role="alert">{error}</small>}</label>
}
