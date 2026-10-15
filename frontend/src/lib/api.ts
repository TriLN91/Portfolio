const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fieldErrors: Record<string, string> = {},
  ) {
    super(message)
  }
}

export interface ContactPayload {
  name: string
  email: string
  company: string
  message: string
  /** Honeypot: real visitors never fill this hidden field */
  website: string
}

export async function sendContact(payload: ContactPayload): Promise<void> {
  const res = await fetch(`${BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    let message = res.statusText
    let fieldErrors: Record<string, string> = {}
    try {
      const body = await res.json()
      message = body.message ?? message
      fieldErrors = body.errors ?? {}
    } catch {
      /* body was not JSON */
    }
    throw new ApiError(res.status, message, fieldErrors)
  }
}

export interface GitHubStats {
  username: string
  profileUrl: string
  publicRepos: number
  followers: number
  totalStars: number
  languages: { name: string; repos: number; percent: number }[]
  recentRepos: {
    name: string
    description: string | null
    language: string | null
    stars: number
    url: string
    pushedAt: string
  }[]
}

export async function getGitHubStats(signal?: AbortSignal): Promise<GitHubStats> {
  const res = await fetch(`${BASE}/api/github/stats`, { signal })
  if (!res.ok) throw new ApiError(res.status, 'GitHub stats unavailable')
  return res.json()
}
