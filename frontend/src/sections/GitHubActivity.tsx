import { useEffect, useState } from 'react'
import { FadeIn, SplitText } from '../components/Reveal'
import { profile } from '../content/profile'
import { useLang } from '../i18n/LanguageProvider'
import { ui } from '../i18n/strings'
import { getGitHubStats, type GitHubStats } from '../lib/api'

/** Shown when the backend is not reachable, so the section never looks broken */
const SAMPLE: GitHubStats = {
  username: profile.githubUsername,
  profileUrl: `https://github.com/${profile.githubUsername}`,
  publicRepos: 18,
  followers: 24,
  totalStars: 41,
  languages: [
    { name: 'Java', repos: 7, percent: 38.9 },
    { name: 'TypeScript', repos: 5, percent: 27.8 },
    { name: 'JavaScript', repos: 3, percent: 16.7 },
    { name: 'CSS', repos: 2, percent: 11.1 },
    { name: 'Python', repos: 1, percent: 5.5 },
  ],
  recentRepos: [
    { name: 'portfolio', description: 'This website: React, Three.js and Spring Boot', language: 'TypeScript', stars: 6, url: '#', pushedAt: '2026-10-12T00:00:00Z' },
    { name: 'shopdesk', description: 'Admin dashboard for small online shops', language: 'Java', stars: 14, url: '#', pushedAt: '2026-09-30T00:00:00Z' },
    { name: 'family-balance', description: 'Real-time multiplayer party game', language: 'JavaScript', stars: 11, url: '#', pushedAt: '2026-08-21T00:00:00Z' },
    { name: 'momcare', description: 'Pregnancy tracking web app (team project)', language: 'Java', stars: 5, url: '#', pushedAt: '2026-06-02T00:00:00Z' },
  ],
}

const LANG_COLORS = ['rgb(var(--accent))', 'rgb(var(--signal))', 'rgb(var(--ok))', 'rgb(var(--ink))', 'rgb(var(--muted))', 'rgb(var(--line))']

export function GitHubActivity() {
  const { t, lang } = useLang()
  const [stats, setStats] = useState<GitHubStats>(SAMPLE)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const ctrl = new AbortController()
    getGitHubStats(ctrl.signal)
      .then((s) => {
        setStats(s)
        setLive(true)
      })
      .catch(() => {
        /* keep sample data */
      })
    return () => ctrl.abort()
  }, [])

  const dateFmt = new Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const tiles = [
    { value: stats.publicRepos, label: ui.github.repos },
    { value: stats.totalStars, label: ui.github.stars },
    { value: stats.followers, label: ui.github.followers },
  ]

  return (
    <section id="github" className="bg-bg py-[clamp(72px,10vw,140px)]">
      <div className="wrap">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">{t(ui.github.eyebrow)}</span>
            <SplitText key={lang} as="h2" text={t(ui.github.title)} className="section-title block" />
          </div>
          <a href={stats.profileUrl} target="_blank" rel="noopener" className="btn">
            @{stats.username} ↗
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <FadeIn className="min-w-0 rounded-2xl border border-line bg-surface p-7">
            <div className="grid grid-cols-3 gap-4">
              {tiles.map((tile) => (
                <div key={tile.label.en}>
                  <b className="block font-display text-4xl font-bold tabular-nums">{tile.value}</b>
                  <span className="text-sm text-muted">{t(tile.label)}</span>
                </div>
              ))}
            </div>

            <h3 className="eyebrow mb-3 mt-10">{t(ui.github.languages)}</h3>
            <div className="flex h-3 overflow-hidden rounded-full bg-sunk" role="img" aria-label={stats.languages.map((l) => `${l.name} ${l.percent}%`).join(', ')}>
              {stats.languages.map((l, i) => (
                <span key={l.name} style={{ width: `${l.percent}%`, background: LANG_COLORS[i % LANG_COLORS.length] }} />
              ))}
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {stats.languages.map((l, i) => (
                <li key={l.name} className="flex items-center gap-2">
                  <i className="h-2.5 w-2.5 rounded-sm" style={{ background: LANG_COLORS[i % LANG_COLORS.length] }} />
                  {l.name}
                  <span className="ml-auto font-mono text-xs tabular-nums text-muted">{l.percent}%</span>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.1} className="min-w-0">
            <h3 className="eyebrow mb-3">{t(ui.github.recent)}</h3>
            <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
              {stats.recentRepos.map((r) => (
                <li key={r.name}>
                  <a href={r.url} target="_blank" rel="noopener" className="flex items-start gap-4 p-5 transition-colors hover:bg-sunk">
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[15px] font-medium">{r.name}</div>
                      {r.description && <p className="mt-1 truncate text-sm text-muted">{r.description}</p>}
                    </div>
                    <div className="flex-none text-right font-mono text-xs text-muted">
                      <div>{r.language ?? '—'} · ★ {r.stars}</div>
                      <div className="mt-1">{dateFmt.format(new Date(r.pushedAt))}</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
        {!live && <p className="mt-4 font-mono text-xs text-muted">{t(ui.github.sample)}</p>}
      </div>
    </section>
  )
}
