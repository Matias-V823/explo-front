import { apiFetch } from './client'

export async function uploadImage(file: File, folder = 'general', id?: string): Promise<string> {
  const body = new FormData()
  body.append('file', file)
  const params = new URLSearchParams({ folder })
  if (id) params.set('id', id)
  const res = await apiFetch(`/upload/image?${params}`, { method: 'POST', body })
  if (!res.ok) throw new Error('Error al subir la imagen')
  const { url } = await res.json() as { url: string }
  return url
}

export async function uploadDocument(file: File, folder = 'general'): Promise<string> {
  const body = new FormData()
  body.append('file', file)
  const res = await apiFetch(`/upload/document?folder=${folder}`, { method: 'POST', body })
  if (!res.ok) throw new Error('Error al subir el documento')
  const { url } = await res.json() as { url: string }
  return url
}
