export type Lang = 'en' | 'vi'

/** A piece of text in both languages */
export type L = { en: string; vi: string }

export type RenderKind = 'dash' | 'track' | 'game'

export interface Project {
  slug: string
  title: string
  year: string
  kind: L
  role: L
  status: 'live' | 'completed' | 'in-progress'
  /** Fake address shown in the browser frame of the product render */
  url: string
  summary: L
  impact: L[]
  stack: string[]
  /** Built-in rendered UI used when no screenshot is provided */
  render: RenderKind
  /** Optional real screenshot, e.g. "/shots/shopdesk.png" (put the file in /public/shots) */
  image?: string
  demo?: string
  code?: string
  caseStudy: {
    problem: L
    solution: L
    architecture: string[]
    decisions: L[]
    results: { value: string; label: L }[]
    learnings: L
  }
}

export interface ExperienceItem {
  period: string
  title: L
  org: string
  type: 'work' | 'education' | 'leadership'
  text: L
}

export interface SkillGroup {
  name: L
  note: L
  /** Skills used in shipped projects (highlighted) */
  core: string[]
  /** Skills you are comfortable with or still learning */
  more: string[]
}

export interface Profile {
  name: string
  role: L
  status: L
  lede: L
  location: L
  email: string
  /** Path to your CV in /public, or an external link */
  cv: string
  /** Optional photo in /public, e.g. "/avatar.jpg" */
  avatar?: string
  githubUsername: string
  socials: { label: string; url: string }[]
  facts: { label: L; value: L }[]
  stats: { value: string; label: L }[]
  bio: L[]
  contactText: L
}
