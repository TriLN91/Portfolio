import type { Project, RenderKind } from '../content/types'

const bars = (n: number) =>
  Array.from({ length: n }, (_, i) => 30 + Math.round(60 * Math.abs(Math.sin(i * 1.7 + 1))))

function Dashboard() {
  return (
    <div className="ui dash">
      <aside>
        <div className="bar on" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" style={{ width: '60%' }} />
      </aside>
      <main>
        <div className="flex items-center justify-between">
          <span className="t">Revenue overview</span>
          <span className="rounded-full bg-sunk px-[0.8em] py-[0.3em] font-mono">Oct 2026</span>
        </div>
        <div className="row">
          <div className="k"><small>Revenue</small><b>₫84.2M</b></div>
          <div className="k"><small>Orders</small><b>1,284</b></div>
          <div className="k"><small>Low stock</small><b style={{ color: 'rgb(var(--signal))' }}>7</b></div>
        </div>
        <div className="k" style={{ padding: 0, minHeight: 0 }}>
          <div className="chart">
            {bars(14).map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function Tracker() {
  return (
    <div className="ui track">
      <div className="ring">
        <div>
          <small>Week</small>
          <b>24</b>
          <small>of 40</small>
        </div>
      </div>
      <div className="week">
        <span className="t">This week</span>
        <div className="k now"><i />Check-up · Thu 9:00</div>
        <div className="k"><i />Baby ≈ 30 cm, 600 g</div>
        <div className="k"><i />Log weight &amp; mood</div>
      </div>
    </div>
  )
}

function Game() {
  return (
    <div className="ui game">
      <div className="score">
        <span>Wife</span>
        <i style={{ ['--w' as string]: '62%' }} />
        <i style={{ ['--w' as string]: '58%' }} />
        <span>Husband</span>
      </div>
      <div className="q">Round 4 · Who should plan the family trip this year?</div>
      <div className="opts">
        <div>Wife decides</div>
        <div className="pick">Plan it together</div>
        <div>Husband decides</div>
        <div>Ask the kids</div>
      </div>
    </div>
  )
}

const RENDERS: Record<RenderKind, () => JSX.Element> = { dash: Dashboard, track: Tracker, game: Game }

/** A browser window showing the product: a real screenshot if provided, otherwise a rendered UI */
export function ProductRender({ project, className = '' }: { project: Project; className?: string }) {
  const Render = RENDERS[project.render]
  return (
    <div className={`overflow-hidden rounded-xl border border-line bg-surface card-shadow ${className}`} aria-hidden="true">
      <div className="flex items-center gap-1.5 border-b border-line bg-sunk px-3 py-2">
        <i className="h-2.5 w-2.5 rounded-full bg-[#ef6a5e]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#f4bf4f]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#61c454]" />
        <span className="ml-3 min-w-0 flex-1 truncate rounded-md bg-surface px-3 py-0.5 font-mono text-[11px] text-muted">
          {project.url}
        </span>
      </div>
      <div className="relative aspect-[16/10] max-w-full overflow-hidden">
        {project.image ? (
          <img src={project.image} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <Render />
        )}
      </div>
    </div>
  )
}
