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
import { ProfileSkeleton } from './ProfileSkeleton.tsx'





export const Route = createFileRoute('/profile/')({
  beforeLoad: async ({ location }) => {
    await ensureSession({ data: { redirect: location.href } })
  },
  loader: async () => {
    const user = await getUser()
    return user
  },
  component: Profile,
  pendingComponent: ProfileSkeleton,
  pendingMinMs: 10000, // once shown, keep it for at least 500ms
})

/* ─── helpers ──────────────────────────────────────────────────────── */

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-1.5 py-5 px-4 relative cursor-default">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-px bg-white/10" />
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-1 bg-orange-500/15 text-orange-500">
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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 bg-white/[0.04] hover:bg-orange-500/[0.12]"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 bg-white/[0.07] text-slate-400">
          {icon}
        </div>
        <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
          {label}
        </span>
      </div>
      <svg
        className="w-4 h-4 text-slate-600 group-hover:text-orange-400 transition-colors"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  )
}

function InfoBadge({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-slate-300 bg-white/[0.06] border border-white/[0.08]">
      <span className="text-orange-500">{icon}</span>
      <span>{text}</span>
    </div>
  )
}

/* ─── EditProfileDrawer ─────────────────────────────────────────────── */

type UserData = Awaited<ReturnType<typeof getUser>>

const inputCls =
  'w-full bg-white/5 border border-white/[0.09] rounded-[10px] py-[10px] px-3 text-slate-200 text-sm font-medium outline-none transition-colors duration-200 focus:border-orange-500/60 font-[inherit]'

const labelCls =
  'block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-[6px]'

function Field({
  label,
  prefix,
  textarea = false,
  ...props
}: {
  label: string
  prefix?: string
  textarea?: boolean
} & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="relative">
        {prefix && (
          <span
            className={`absolute left-[11px] text-slate-600 text-[13px] font-semibold pointer-events-none ${textarea ? 'top-[11px]' : 'top-1/2 -translate-y-1/2'
              }`}
          >
            {prefix}
          </span>
        )}
        {textarea ? (
          <textarea
            rows={3}
            className={`${inputCls} resize-y`}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            className={`${inputCls} ${prefix ? 'pl-[30px]' : ''}`}
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
      <div className="w-1 h-4 rounded-full flex-shrink-0 bg-gradient-to-b from-orange-500 to-orange-600" />
      <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
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

  const set =
    (field: keyof typeof form) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }))

  const toNull = (s: string) => (s.trim() === '' ? null : s.trim())

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
            gender: toNull(form.gender) as 'male' | 'female' | 'other' | null,
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
      {/* Trigger */}
      <Drawer.Trigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/[0.12] border border-orange-500/30 text-orange-400 text-[13px] font-bold cursor-pointer transition-all duration-200 font-[inherit] hover:bg-orange-500/[0.22] hover:border-orange-500/55 hover:text-orange-300">
          <Pencil size={13} />
          <span>Edit</span>
        </button>
      </Drawer.Trigger>

      <Drawer.Portal>
        {/* Backdrop */}
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-[6px]" />

        {/* Panel */}
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col outline-none max-h-[92dvh] bg-[#080d18] border border-white/[0.09] border-b-0 rounded-[28px_28px_0_0] font-[DM_Sans,sans-serif]">

          {/* Drag handle */}
          <Drawer.Handle className="w-10 h-1 rounded-full bg-white/15 mx-auto mt-3 flex-shrink-0" />

          {/* Sticky header */}
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0 border-b border-white/[0.07]">
            <div>
              <Drawer.Title className="text-white font-black text-lg leading-tight font-[Playfair_Display,serif]">
                Edit Profile
              </Drawer.Title>
              <p className="text-[12px] text-slate-600 font-medium mt-0.5">
                Update your optional info
              </p>
            </div>
            <Drawer.Close asChild>
              <button className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors bg-white/[0.06] text-slate-500 hover:bg-white/[0.12] hover:text-slate-200">
                <X size={15} />
              </button>
            </Drawer.Close>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 px-5 py-5 space-y-6">

            {/* Basic Info */}
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
                  <label className={labelCls}>Gender</label>
                  {/* background-image for the SVG arrow can't be expressed cleanly in a Tailwind class */}
                  <select
                    value={form.gender}
                    onChange={set('gender')}
                    className={`${inputCls} appearance-none pr-8 cursor-pointer`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                    }}
                  >
                    <option value="" className="bg-[#0d1420]">— Not specified —</option>
                    <option value="male" className="bg-[#0d1420]">Male</option>
                    <option value="female" className="bg-[#0d1420]">Female</option>
                    <option value="other" className="bg-[#0d1420]">Other</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className={labelCls}>Date of Birth</label>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={set('dateOfBirth')}
                    className={`${inputCls} [color-scheme:dark]`}
                  />
                </div>
              </div>
            </section>

            {/* Location & Web */}
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

            {/* Social Links */}
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

            <div className="h-2" />
          </div>

          {/* Sticky footer */}
          <div className="flex-shrink-0 px-5 py-4 space-y-2.5 border-t border-white/[0.07]">
            {error && (
              <div className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500/[0.12] border border-red-500/25 text-red-300">
                {error}
              </div>
            )}
            {saved && (
              <div className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-green-400/10 border border-green-400/25 text-green-300">
                ✓ Profile saved!
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isPending}
              className={`w-full py-[13px] rounded-[14px] border-none text-white text-[15px] font-extrabold font-[inherit] tracking-[0.02em] transition-all duration-200 ${isPending
                ? 'bg-orange-500/40 cursor-not-allowed'
                : 'bg-gradient-to-br from-orange-500 to-orange-600 cursor-pointer shadow-[0_4px_20px_rgba(249,115,22,0.35)]'
                }`}
            >
              {isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

/* ─── main Profile component ─────────────────────────────────────────── */

function Profile() {
  const user = Route.useLoaderData()

  return (
    <div className="min-h-screen font-[DM_Sans,sans-serif] text-white bg-[#080d18] [background:radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(249,115,22,0.12)_0%,transparent_60%),radial-gradient(ellipse_60%_50%_at_80%_80%,rgba(30,40,64,0.8)_0%,transparent_70%),#080d18]">

      {/* Noise overlay — data URL background-image kept as inline style (not expressible in Tailwind) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[length:200px_200px] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto px-4 py-10 pb-20">

        {/* MAIN CARD */}
        <div className="bg-white/[0.04] border border-white/[0.09] backdrop-blur-xl rounded-3xl overflow-hidden mb-4">

          {/* Banner */}
          <div className="h-36 relative overflow-hidden bg-[linear-gradient(135deg,#0d1420_0%,#1e2840_30%,#c2410c_60%,#f97316_80%,#fed7aa_100%)]">
            <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(-55deg,transparent,transparent_18px,rgba(255,255,255,0.08)_18px,rgba(255,255,255,0.08)_19px)]" />
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-30 bg-[radial-gradient(circle,#f97316,transparent_70%)]" />
          </div>

          <div className="px-6 pb-7">
            {/* Avatar row */}
            <div className="flex items-end justify-between -mt-12 mb-5">
              <div className="relative">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-24 h-24 rounded-2xl object-cover [box-shadow:0_0_0_4px_#080d18,0_0_0_6px_rgba(249,115,22,0.5),0_20px_60px_rgba(0,0,0,0.6)]"
                />
                {user.isVerified && (
                  <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 shadow-[0_2px_8px_rgba(249,115,22,0.5)]">
                    <BadgeCheck size={15} className="text-white" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-3">
                <EditProfileDrawer user={user} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => await signOut({ redirect: true })}
                  className="gap-2 bg-white/[0.06]! border-white/[0.12]! text-slate-300! font-semibold! text-[13px]! rounded-xl! hover:bg-red-500/[0.15]! hover:border-red-500/35! hover:text-red-300!"
                >
                  <LogOut size={14} />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Name block */}
            <div className="mb-4">
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h1 className="text-3xl font-black text-white leading-tight font-[Playfair_Display,serif]">
                  {user.name}
                </h1>
                {user.isVerified && (
                  <span className="bg-[linear-gradient(135deg,rgba(249,115,22,0.2),rgba(249,115,22,0.08))] border border-orange-500/35 text-orange-400 text-[11px] font-bold tracking-[0.08em] uppercase px-[10px] py-[3px] rounded-full">
                    Verified
                  </span>
                )}
              </div>
              {user.username ? (
                <p className="text-base font-semibold text-orange-500">@{user.username}</p>
              ) : (
                <p className="text-sm font-medium text-slate-600 italic">No username set</p>
              )}
            </div>

            {/* Bio */}
            {user.bio ? (
              <div className="mb-5 p-4 rounded-2xl bg-orange-500/[0.07] border-l-[3px] border-orange-500/60">
                <p className="text-sm font-medium text-slate-200 leading-relaxed">{user.bio}</p>
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-600 italic mb-5">No bio yet.</p>
            )}

            {/* Info badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {user.location && <InfoBadge icon={<MapPin size={13} />} text={user.location} />}
              {user.website && (
                <InfoBadge icon={<Globe size={13} />} text={user.website.replace(/^https?:\/\//, '')} />
              )}
              <InfoBadge icon={<CalendarDays size={13} />} text={`Joined ${formatDate(user.createdAt)}`} />
            </div>

            {/* Stats bar */}
            <div className="rounded-2xl overflow-hidden flex bg-white/[0.04] border border-white/[0.08]">
              <StatCard label="Followers" value={user.followersCount} icon={<Users size={17} />} />
              <StatCard label="Following" value={user.followingCount} icon={<UserCheck size={17} />} />
            </div>
          </div>
        </div>

        {/* SOCIAL LINKS CARD */}
        {(user.twitterHandle || user.githubHandle || user.linkedinHandle || user.website) && (
          <div className="bg-white/[0.04] border border-white/[0.09] backdrop-blur-xl rounded-3xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 rounded-full bg-gradient-to-b from-orange-500 to-orange-600" />
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.18em]">Social Links</h2>
            </div>
            <div className="flex flex-col gap-2">
              {user.twitterHandle && (
                <SocialLink href={`https://twitter.com/${user.twitterHandle}`} icon={<Twitter size={15} />} label={`@${user.twitterHandle}`} />
              )}
              {user.githubHandle && (
                <SocialLink href={`https://github.com/${user.githubHandle}`} icon={<Github size={15} />} label={`/${user.githubHandle}`} />
              )}
              {user.linkedinHandle && (
                <SocialLink href={`https://linkedin.com/in/${user.linkedinHandle}`} icon={<Linkedin size={15} />} label={`/in/${user.linkedinHandle}`} />
              )}
              {user.website && (
                <SocialLink href={user.website} icon={<LinkIcon size={15} />} label={user.website.replace(/^https?:\/\//, '')} />
              )}
            </div>
          </div>
        )}

        {/* ACCOUNT INFO CARD */}
        <div className="bg-white/[0.04] border border-white/[0.09] backdrop-blur-xl rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-orange-500 to-orange-600" />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.18em]">Account Info</h2>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-[14px] p-3 px-[14px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-600 mb-1">Role</p>
              <p className="text-sm font-bold text-slate-200 capitalize">{user.role ?? 'user'}</p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-[14px] p-3 px-[14px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-600 mb-1">Status</p>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${user.isActive
                    ? 'bg-green-400 shadow-[0_0_6px_#4ade80]'
                    : 'bg-red-400 shadow-[0_0_6px_#f87171]'
                    }`}
                />
                <p className={`text-sm font-bold ${user.isActive ? 'text-green-400' : 'text-red-400'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-[14px] p-3 px-[14px] col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-600 mb-1">User ID</p>
              <p className="text-xs font-bold text-slate-400 font-mono break-all tracking-wide">{user.userId}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
