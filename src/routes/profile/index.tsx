import React from 'react'
import type { ReactNode } from 'react'
import { useState, useTransition } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Drawer } from 'vaul'
import { signOut } from '@/context/session'
import { getUser, ensureSession } from '@/server/actions/session'
import { updateProfile } from '@/server/actions/profile'
import { Button } from '@/components/ui/button'
import {
  MapPin, Globe, Twitter, Github, Linkedin,
  Users, UserCheck, BadgeCheck, CalendarDays,
  LogOut, Link as LinkIcon, Pencil, X,
} from 'lucide-react'



export const Route = createFileRoute('/profile/')({
  beforeLoad: async ({ location }) => {
    await ensureSession({ data: { redirect: location.href } })
  },
  loader: async () => {
    const user = await getUser()
    return user
  },
  component: Profile,
})

/* ─── unchanged helpers ──────────────────────────────────────────── */

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-1.5 py-5 px-4 relative group cursor-default">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-px bg-white/10" />
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-1"
        style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
        {icon}
      </div>
      <span className="text-3xl font-black text-white tracking-tight leading-none">
        {value.toLocaleString()}
      </span>
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-[0.15em]">
        {label}
      </span>
    </div>
  )
}

function SocialLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200"
      style={{ background: 'rgba(255,255,255,0.04)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(249,115,22,0.12)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)' }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
          style={{ background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}>
          {icon}
        </div>
        <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
          {label}
        </span>
      </div>
      <svg className="w-4 h-4 text-slate-600 group-hover:text-orange-400 transition-colors"
        fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  )
}

function InfoBadge({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-slate-300"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <span style={{ color: '#f97316' }}>{icon}</span>
      <span>{text}</span>
    </div>
  )
}

/* ─── NEW: EditProfileDrawer ─────────────────────────────────────── */

type UserData = Awaited<ReturnType<typeof getUser>>

/* Shared input/label styles */
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#64748b',
  marginBottom: '6px',
}
const inputBase: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '10px',
  padding: '10px 12px',
  color: '#e2e8f0',
  fontSize: '14px',
  fontWeight: 500,
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
}

function Field({
  label, prefix, textarea = false,
  ...props
}: {
  label: string
  prefix?: string
  textarea?: boolean
} & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>) {
  const focusOn = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(249,115,22,0.6)'
  }
  const focusOff = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'
  }
  const style = { ...inputBase, paddingLeft: prefix ? '30px' : '12px' }

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        {prefix && (
          <span style={{
            position: 'absolute', left: '11px', top: textarea ? '11px' : '50%',
            transform: textarea ? 'none' : 'translateY(-50%)',
            color: '#475569', fontSize: '13px', fontWeight: 600, pointerEvents: 'none',
          }}>
            {prefix}
          </span>
        )}
        {textarea ? (
          <textarea
            rows={3}
            style={{ ...style, resize: 'vertical', paddingLeft: '12px' }}
            onFocus={focusOn} onBlur={focusOff}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            style={style}
            onFocus={focusOn} onBlur={focusOff}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
    </div>
  )
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-4 rounded-full flex-shrink-0"
        style={{ background: 'linear-gradient(180deg,#f97316,#ea580c)' }} />
      <span style={{
        fontSize: '11px', fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '0.16em', color: '#64748b',
      }}>
        {children}
      </span>
    </div>
  )
}

function EditProfileDrawer({ user }: { user: UserData }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState({
    username: user.username ?? '',
    bio: user.bio ?? '',
    phone: user.phone ?? '',
    location: user.location ?? '',
    website: user.website ?? '',
    gender: user.gender ?? '',
    dateOfBirth: user.dateOfBirth ?? '',
    twitterHandle: user.twitterHandle ?? '',
    githubHandle: user.githubHandle ?? '',
    linkedinHandle: user.linkedinHandle ?? '',
  })

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))

  const toNull = (s: string) => s.trim() === '' ? null : s.trim()

  function handleSubmit() {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      try {
        await updateProfile({
          data: {
            username: toNull(form.username),
            bio: toNull(form.bio),
            phone: toNull(form.phone),
            location: toNull(form.location),
            website: toNull(form.website),
            gender: (toNull(form.gender) as 'male' | 'female' | 'other' | null),
            dateOfBirth: toNull(form.dateOfBirth),
            twitterHandle: toNull(form.twitterHandle),
            githubHandle: toNull(form.githubHandle),
            linkedinHandle: toNull(form.linkedinHandle),
          },
        })
        setSaved(true)
        await router.invalidate()
        setTimeout(() => setOpen(false), 700)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
      }
    })
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground>
      {/* ── Trigger ── */}
      <Drawer.Trigger asChild>
        <button className="edit-profile-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl">
          <Pencil size={13} />
          <span>Edit</span>
        </button>
      </Drawer.Trigger>

      <Drawer.Portal>
        {/* ── Backdrop ── */}
        <Drawer.Overlay
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
        />

        {/* ── Panel ── */}
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-50 flex flex-col outline-none"
          style={{
            maxHeight: '92dvh',
            background: '#080d18',
            border: '1px solid rgba(255,255,255,0.09)',
            borderBottom: 'none',
            borderRadius: '28px 28px 0 0',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {/* Drag handle */}
          <Drawer.Handle
            style={{
              width: 40, height: 4, borderRadius: 99,
              background: 'rgba(255,255,255,0.15)',
              margin: '12px auto 0',
              flexShrink: 0,
            }}
          />

          {/* Sticky header */}
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
              <Drawer.Title className="text-white font-black text-lg leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Edit Profile
              </Drawer.Title>
              <p style={{ fontSize: '12px', color: '#475569', fontWeight: 500, marginTop: 2 }}>
                Update your optional info
              </p>
            </div>
            <Drawer.Close asChild>
              <button
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = '#64748b' }}
              >
                <X size={15} />
              </button>
            </Drawer.Close>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 px-5 py-5 space-y-6">

            {/* ── Basic Info ── */}
            <section>
              <SectionHeading>Basic Info</SectionHeading>
              <div className="space-y-3">
                <Field
                  label="Username"
                  prefix="@"
                  type="text"
                  placeholder="your_handle"
                  value={form.username}
                  onChange={set('username')}
                  maxLength={50}
                />
                <Field
                  label="Bio"
                  textarea
                  placeholder="Tell people a bit about yourself…"
                  value={form.bio}
                  onChange={set('bio')}
                  maxLength={500}
                />
                <Field
                  label="Phone"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={form.phone}
                  onChange={set('phone')}
                  maxLength={20}
                />

                {/* Gender */}
                <div>
                  <label style={labelStyle}>Gender</label>
                  <select
                    value={form.gender}
                    onChange={set('gender')}
                    style={{
                      ...inputBase,
                      paddingLeft: '12px',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      cursor: 'pointer',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.6)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)' }}
                  >
                    <option value="" style={{ background: '#0d1420' }}>— Not specified —</option>
                    <option value="male" style={{ background: '#0d1420' }}>Male</option>
                    <option value="female" style={{ background: '#0d1420' }}>Female</option>
                    <option value="non_binary" style={{ background: '#0d1420' }}>Non-binary</option>
                    <option value="prefer_not_to_say" style={{ background: '#0d1420' }}>Prefer not to say</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label style={labelStyle}>Date of Birth</label>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={set('dateOfBirth')}
                    style={{
                      ...inputBase,
                      colorScheme: 'dark',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.6)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)' }}
                  />
                </div>
              </div>
            </section>

            {/* ── Location & Web ── */}
            <section>
              <SectionHeading>Location &amp; Web</SectionHeading>
              <div className="space-y-3">
                <Field
                  label="Location"
                  type="text"
                  placeholder="City, Country"
                  value={form.location}
                  onChange={set('location')}
                  maxLength={100}
                />
                <Field
                  label="Website"
                  type="url"
                  placeholder="https://yoursite.com"
                  value={form.website}
                  onChange={set('website')}
                />
              </div>
            </section>

            {/* ── Social Links ── */}
            <section>
              <SectionHeading>Social Links</SectionHeading>
              <div className="space-y-3">
                <Field
                  label="Twitter / X"
                  prefix="@"
                  type="text"
                  placeholder="handle"
                  value={form.twitterHandle}
                  onChange={set('twitterHandle')}
                  maxLength={50}
                />
                <Field
                  label="GitHub"
                  prefix="/"
                  type="text"
                  placeholder="username"
                  value={form.githubHandle}
                  onChange={set('githubHandle')}
                  maxLength={50}
                />
                <Field
                  label="LinkedIn"
                  prefix="in/"
                  type="text"
                  placeholder="profile-name"
                  value={form.linkedinHandle}
                  onChange={set('linkedinHandle')}
                  maxLength={50}
                />
              </div>
            </section>

            {/* Bottom breathing room */}
            <div style={{ height: 8 }} />
          </div>

          {/* Sticky footer */}
          <div className="flex-shrink-0 px-5 py-4 space-y-2.5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>

            {/* Error / success feedback */}
            {error && (
              <div className="px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
                {error}
              </div>
            )}
            {saved && (
              <div className="px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', color: '#86efac' }}>
                ✓ Profile saved!
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isPending}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '14px',
                border: 'none',
                background: isPending
                  ? 'rgba(249,115,22,0.4)'
                  : 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 800,
                fontFamily: 'inherit',
                cursor: isPending ? 'not-allowed' : 'pointer',
                boxShadow: isPending ? 'none' : '0 4px 20px rgba(249,115,22,0.35)',
                transition: 'all 0.2s',
                letterSpacing: '0.02em',
              }}
            >
              {isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

/* ─── main Profile component ─────────────────────────────────────── */

function Profile() {
  const user = Route.useLoaderData()
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');

        .profile-root {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(249,115,22,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 80%, rgba(30,40,64,0.8) 0%, transparent 70%),
            #080d18;
          font-family: 'DM Sans', sans-serif;
          color: white;
        }
        .noise-overlay {
          position: fixed; inset: 0; pointer-events: none; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px; z-index: 0;
        }
        .glass-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .banner-gradient {
          background: linear-gradient(135deg, #0d1420 0%, #1e2840 30%, #c2410c 60%, #f97316 80%, #fed7aa 100%);
        }
        .avatar-ring {
          box-shadow: 0 0 0 4px #080d18, 0 0 0 6px rgba(249,115,22,0.5), 0 20px 60px rgba(0,0,0,0.6);
        }
        .tag-badge {
          background: linear-gradient(135deg, rgba(249,115,22,0.2), rgba(249,115,22,0.08));
          border: 1px solid rgba(249,115,22,0.35);
          color: #fb923c; font-size: 11px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 3px 10px; border-radius: 999px;
        }
        .sign-out-btn {
          background: rgba(255,255,255,0.06) !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          color: #cbd5e1 !important; font-weight: 600 !important;
          font-size: 13px !important; border-radius: 12px !important;
          transition: all 0.2s !important;
        }
        .sign-out-btn:hover {
          background: rgba(239,68,68,0.15) !important;
          border-color: rgba(239,68,68,0.35) !important;
          color: #fca5a5 !important;
        }

        /* ── NEW ── */
        .edit-profile-btn {
          background: rgba(249,115,22,0.12);
          border: 1px solid rgba(249,115,22,0.3);
          color: #fb923c;
          font-size: 13px; font-weight: 700;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .edit-profile-btn:hover {
          background: rgba(249,115,22,0.22);
          border-color: rgba(249,115,22,0.55);
          color: #fdba74;
        }

        .info-grid-item {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 12px 14px;
        }
        .info-grid-label {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: #475569; margin-bottom: 4px;
        }
        .info-grid-value { font-size: 14px; font-weight: 700; color: #e2e8f0; }
      `}</style>

      <div className="profile-root">
        <div className="noise-overlay" />

        <div className="relative z-10 max-w-xl mx-auto px-4 py-10 pb-20">

          {/* ── MAIN CARD ── */}
          <div className="glass-card rounded-3xl overflow-hidden mb-4">

            {/* Banner */}
            <div className="banner-gradient h-36 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `repeating-linear-gradient(-55deg, transparent, transparent 18px, rgba(255,255,255,0.08) 18px, rgba(255,255,255,0.08) 19px)`,
              }} />
              <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-30"
                style={{ background: 'radial-gradient(circle, #f97316, transparent 70%)' }} />
            </div>

            <div className="px-6 pb-7">
              {/* Avatar row — Edit button added here */}
              <div className="flex items-end justify-between -mt-12 mb-5">
                <div className="relative">
                  <img src={user.picture} alt={user.name}
                    className="w-24 h-24 rounded-2xl object-cover avatar-ring" />
                  {user.isVerified && (
                    <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 2px 8px rgba(249,115,22,0.5)' }}>
                      <BadgeCheck size={15} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-3">
                  {/* ── Edit Profile drawer trigger ── */}
                  <EditProfileDrawer user={user} />

                  <Button variant="outline" size="sm"
                    onClick={async () => await signOut({ redirect: true })}
                    className="sign-out-btn gap-2">
                    <LogOut size={14} />
                    Sign Out
                  </Button>
                </div>
              </div>

              {/* Name block */}
              <div className="mb-4">
                <div className="flex items-center gap-2.5 flex-wrap mb-1">
                  <h1 className="text-3xl font-black text-white leading-tight">
                    {user.name}
                  </h1>
                  {user.isVerified && <span className="tag-badge">Verified</span>}
                </div>
                {user.username
                  ? <p className="text-base font-semibold" style={{ color: '#f97316' }}>@{user.username}</p>
                  : <p className="text-sm font-medium text-slate-600 italic">No username set</p>
                }
              </div>

              {/* Bio */}
              {user.bio ? (
                <div className="mb-5 p-4 rounded-2xl relative"
                  style={{ background: 'rgba(249,115,22,0.07)', borderLeft: '3px solid rgba(249,115,22,0.6)' }}>
                  <p className="text-sm font-medium text-slate-200 leading-relaxed">{user.bio}</p>
                </div>
              ) : (
                <p className="text-sm font-medium text-slate-600 italic mb-5">No bio yet.</p>
              )}

              {/* Info badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {user.location && <InfoBadge icon={<MapPin size={13} />} text={user.location} />}
                {user.website && <InfoBadge icon={<Globe size={13} />} text={user.website.replace(/^https?:\/\//, '')} />}
                <InfoBadge icon={<CalendarDays size={13} />} text={`Joined ${formatDate(user.createdAt)}`} />
              </div>

              {/* Stats bar */}
              <div className="rounded-2xl overflow-hidden flex"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <StatCard label="Followers" value={user.followersCount} icon={<Users size={17} />} />
                <StatCard label="Following" value={user.followingCount} icon={<UserCheck size={17} />} />
              </div>
            </div>
          </div>

          {/* ── SOCIAL LINKS CARD ── */}
          {(user.twitterHandle || user.githubHandle || user.linkedinHandle || user.website) && (
            <div className="glass-card rounded-3xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #f97316, #ea580c)' }} />
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.18em]">Social Links</h2>
              </div>
              <div className="flex flex-col gap-2">
                {user.twitterHandle && <SocialLink href={`https://twitter.com/${user.twitterHandle}`} icon={<Twitter size={15} />} label={`@${user.twitterHandle}`} />}
                {user.githubHandle && <SocialLink href={`https://github.com/${user.githubHandle}`} icon={<Github size={15} />} label={`/${user.githubHandle}`} />}
                {user.linkedinHandle && <SocialLink href={`https://linkedin.com/in/${user.linkedinHandle}`} icon={<Linkedin size={15} />} label={`/in/${user.linkedinHandle}`} />}
                {user.website && <SocialLink href={user.website} icon={<LinkIcon size={15} />} label={user.website.replace(/^https?:\/\//, '')} />}
              </div>
            </div>
          )}

          {/* ── ACCOUNT INFO CARD ── */}
          <div className="glass-card rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #f97316, #ea580c)' }} />
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.18em]">Account Info</h2>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="info-grid-item">
                <p className="info-grid-label">Role</p>
                <p className="info-grid-value capitalize">{user.role ?? 'user'}</p>
              </div>
              <div className="info-grid-item">
                <p className="info-grid-label">Status</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{
                    background: user.isActive ? '#4ade80' : '#f87171',
                    boxShadow: user.isActive ? '0 0 6px #4ade80' : '0 0 6px #f87171',
                  }} />
                  <p className="info-grid-value" style={{ color: user.isActive ? '#4ade80' : '#f87171' }}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
              <div className="info-grid-item col-span-2">
                <p className="info-grid-label">User ID</p>
                <p className="text-xs font-bold text-slate-400 font-mono break-all tracking-wide">{user.userId}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}