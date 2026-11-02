import { apiRequest } from './apiClient'

export interface TranscriptionResult {
  text: string
}

export interface SynthesisResult {
  audioUrl: string
}

export function transcribeAudio(audio: Blob): Promise<TranscriptionResult> {
  const body = new FormData()
  body.append('audio', audio)
  return apiRequest<TranscriptionResult>('/api/voice/transcribe', { method: 'POST', body })
}

export function synthesizeSpeech(text: string): Promise<SynthesisResult> {
  return apiRequest<SynthesisResult>('/api/voice/synthesize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
}
