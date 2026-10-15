import { useEffect, useState } from 'react'
import { FadeIn, SplitText } from '../components/Reveal'
import { profile } from '../content/profile'
import { useLang } from '../i18n/LanguageProvider'
import { ui } from '../i18n/strings'
import { getGitHubStats, getGitHubStatsDirect, type GitHubStats } from '../lib/api'

/** Shown when the backend is not reachable, so the section never looks broken */
const SAMPLE: GitHubStats = {
  username: profile.githubUsername,
  profileUrl: `https://github.com/${profile.githubUsername}`,
  publicRepos: 0,
  followers: 0,
  totalStars: 0,
  languages: [
    { name: 'TypeScript', repos: 2, percent: 50 },
    { name: 'JavaScript', repos: 1, percent: 25 },
    { name: 'Java', repos: 1, percent: 25 },
  ],
  recentRepos: [
    { name: 'Portfolio', description: 'This website: React, Three.js and Spring Boot', language: 'TypeScript', stars: 0, url: 'https://github.com/TriLN91/Portfolio', pushedAt: '2026-10-15T00:00:00Z' },
    { name: 'GymManagement_UI', description: 'FitFlex AI: AI fitness coaching & gym platform', language: 'TypeScript', stars: 0, url: 'https://github.com/TriLN91/GymManagement_UI', pushedAt: '2026-10-01T00:00:00Z' },
  ],
}

const LANG_COLORS = ['rgb(var(--accent))', 'rgb(var(--signal))', 'rgb(var(--ok))', 'rgb(var(--ink))', 'rgb(var(--muted))', 'rgb(var(--line))']

export function GitHubActivity() {
  const { t, lang } = useLang()
  const [stats, setStats] = useState<GitHubStats>(SAMPLE)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const ctrl = new AbortController()
    // Backend first (cached, no rate limit); then GitHub directly; else keep the sample
    getGitHubStats(ctrl.signal)
      .catch(() => getGitHubStatsDirect(profile.githubUsername, ctrl.signal))
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
  ].filter((tile) => tile.value > 0) // a "0" tile reads as a weakness; hide it

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
            <div className="flex flex-wrap gap-x-10 gap-y-4">
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
