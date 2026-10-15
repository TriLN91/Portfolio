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

type GhRepo = {
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  html_url: string
  pushed_at: string
  fork: boolean
}

/** Fallback when the backend is offline: GitHub's public API allows browser requests (60/hour per visitor) */
export async function getGitHubStatsDirect(username: string, signal?: AbortSignal): Promise<GitHubStats> {
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { signal }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed&type=owner`, { signal }),
  ])
  if (!userRes.ok || !reposRes.ok) throw new ApiError(userRes.status, 'GitHub API unavailable')
  const user = await userRes.json()
  const repos = ((await reposRes.json()) as GhRepo[]).filter((r) => !r.fork)

  const counts = new Map<string, number>()
  repos.forEach((r) => r.language && counts.set(r.language, (counts.get(r.language) ?? 0) + 1))
  const total = [...counts.values()].reduce((a, b) => a + b, 0)
  const languages = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 6)
    .map(([name, n]) => ({ name, repos: n, percent: Math.round((n * 1000) / total) / 10 }))

  return {
    username: user.login,
    profileUrl: user.html_url,
    publicRepos: user.public_repos,
    followers: user.followers,
    totalStars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
    languages,
    recentRepos: repos.slice(0, 4).map((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      url: r.html_url,
      pushedAt: r.pushed_at,
    })),
  }
}
