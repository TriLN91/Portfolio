import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState, type FormEvent } from 'react'
import { SplitText } from '../components/Reveal'
import { profile } from '../content/profile'
import { useLang } from '../i18n/LanguageProvider'
import { ui } from '../i18n/strings'
import { ApiError, sendContact, type ContactPayload } from '../lib/api'

type Status = 'idle' | 'sending' | 'slow' | 'success' | 'error' | 'rate'
type Field = 'name' | 'email' | 'message'

const EMPTY: ContactPayload = { name: '', email: '', company: '', message: '', website: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Input({
  id,
  label,
  error,
  textarea,
  ...rest
}: {
  id: string
  label: string
  error?: string
  textarea?: boolean
  value: string
  onChange: (e: { target: { value: string } }) => void
  type?: string
  autoComplete?: string
}) {
  const cls = `w-full rounded-xl border bg-bg/5 px-4 py-3 text-bg placeholder:text-bg/40 outline-none transition-colors focus:border-signal ${
    error ? 'border-signal' : 'border-bg/20'
  }`
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm text-bg/70">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} rows={5} className={`${cls} resize-y`} aria-invalid={!!error} {...rest} />
      ) : (
        <input id={id} className={cls} aria-invalid={!!error} {...rest} />
      )}
      {error && <p className="mt-1.5 text-sm text-signal">{error}</p>}
    </div>
  )
}

export function Contact() {
  const { t, lang } = useLang()
  const [form, setForm] = useState<ContactPayload>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)
  const emailRef = useRef<HTMLElement>(null)

  const set = (key: keyof ContactPayload) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const next: Partial<Record<Field, string>> = {}
    if (!form.name.trim()) next.name = t(ui.contact.required)
    if (!form.email.trim()) next.email = t(ui.contact.required)
    else if (!EMAIL_RE.test(form.email.trim())) next.email = t(ui.contact.invalidEmail)
    if (!form.message.trim()) next.message = t(ui.contact.required)
    else if (form.message.trim().length < 10) next.message = t(ui.contact.tooShort)
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    // Free hosting sleeps when idle; tell the visitor if the first request is slow
    const slowTimer = setTimeout(() => setStatus((s) => (s === 'sending' ? 'slow' : s)), 4000)
    try {
      await sendContact({ ...form, name: form.name.trim(), email: form.email.trim(), message: form.message.trim() })
      setStatus('success')
      setForm(EMPTY)
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) setStatus('rate')
      else if (err instanceof ApiError && err.status === 400 && Object.keys(err.fieldErrors).length) {
        setErrors(err.fieldErrors as Partial<Record<Field, string>>)
        setStatus('idle')
      } else setStatus('error')
    } finally {
      clearTimeout(slowTimer)
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      const range = document.createRange()
      if (emailRef.current) range.selectNodeContents(emailRef.current)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }

  const busy = status === 'sending' || status === 'slow'
  const message =
    status === 'success' ? ui.contact.success : status === 'error' ? ui.contact.error : status === 'rate' ? ui.contact.rateLimited : status === 'slow' ? ui.contact.slow : null

  return (
    <section id="contact" className="bg-surface pt-[clamp(72px,10vw,140px)]">
      <div className="wrap">
        <div className="grid gap-12 rounded-[28px] bg-ink p-[clamp(24px,5vw,64px)] text-bg lg:grid-cols-[1fr_1.1fr]">
          <div className="min-w-0">
            <span className="eyebrow !text-bg/60">{t(ui.contact.eyebrow)}</span>
            <SplitText
              key={lang}
              as="h2"
              text={t(ui.contact.title)}
              className="mb-5 mt-3 block font-bold leading-[1.02] [font-size:clamp(36px,5vw,60px)]"
            />
            <p className="mb-8 max-w-[44ch] text-bg/70">{t(profile.contactText)}</p>

            <div className="mb-3 flex flex-wrap items-center gap-3 rounded-2xl bg-bg/10 p-4">
              <code ref={emailRef} className="min-w-0 flex-1 select-all break-all font-mono text-[15px]">
                {profile.email}
              </code>
              <button type="button" onClick={copy} className="rounded-lg bg-bg px-3.5 py-2 text-sm font-semibold text-ink">
                {copied ? t(ui.contact.copied) : t(ui.contact.copy)}
              </button>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2.5">
              {profile.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-between rounded-xl border border-bg/20 px-4 py-3 font-medium transition-colors hover:bg-bg/10"
                >
                  {s.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={submit} noValidate className="grid min-w-0 content-start gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="contact-name" label={t(ui.contact.name)} value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
              <Input id="contact-email" label={t(ui.contact.email)} type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
            </div>
            <Input id="contact-company" label={t(ui.contact.company)} value={form.company} onChange={set('company')} autoComplete="organization" />
            <Input id="contact-message" label={t(ui.contact.message)} textarea value={form.message} onChange={set('message')} error={errors.message} />
            {/* Honeypot field, hidden from people */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={set('website')}
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />
            <button
              type="submit"
              disabled={busy}
              className="btn justify-center border-signal bg-signal text-white hover:border-bg hover:bg-bg hover:text-ink disabled:opacity-60"
            >
              {busy ? t(ui.contact.sending) : t(ui.contact.send)}
            </button>
            <AnimatePresence mode="wait">
              {message && (
                <motion.p
                  key={status}
                  role="status"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-xl p-3.5 text-sm ${status === 'success' ? 'bg-ok/20 text-bg' : 'bg-bg/10 text-bg/80'}`}
                >
                  {t(message)}
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  )
}
