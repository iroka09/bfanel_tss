import type { ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSession } from '@/context/session'
import { getUser, ensureAuth } from '@/server/actions/session'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  Globe,
  Twitter,
  Github,
  Linkedin,
  Users,
  UserCheck,
  BadgeCheck,
  CalendarDays,
  LogOut,
  Link as LinkIcon,
} from 'lucide-react'

export const Route = createFileRoute('/profile/')({
  beforeLoad: async ({ location }) => {
    await ensureAuth({ data: { redirect: location.href } })
  },
  loader: async () => {
    const user = await getUser()
    return user
  },
  component: Profile,
})

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: ReactNode
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-1.5 py-5 px-4 relative group cursor-default">
      {/* Divider between stats */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-px bg-white/10" />
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-1"
        style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}
      >
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

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string
  icon: ReactNode
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200"
      style={{ background: 'rgba(255,255,255,0.04)' }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(249,115,22,0.12)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
          style={{ background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}
        >
          {icon}
        </div>
        <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
          {label}
        </span>
      </div>
      <svg
        className="w-4 h-4 text-slate-600 group-hover:text-orange-400 transition-colors"
        fill="none" stroke="currentColor" strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  )
}

function InfoBadge({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-slate-300"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <span style={{ color: '#f97316' }}>{icon}</span>
      <span>{text}</span>
    </div>
  )
}

function Profile() {
  const user = Route.useLoaderData()
  const { signOut } = useSession()

  return (
    <>
      {/* Page-level styles injected once */}
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
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
          z-index: 0;
        }

        .glass-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .banner-gradient {
          background: linear-gradient(
            135deg,
            #0d1420 0%,
            #1e2840 30%,
            #c2410c 60%,
            #f97316 80%,
            #fed7aa 100%
          );
        }

        .avatar-ring {
          box-shadow:
            0 0 0 4px #080d18,
            0 0 0 6px rgba(249,115,22,0.5),
            0 20px 60px rgba(0,0,0,0.6);
        }

        .tag-badge {
          background: linear-gradient(135deg, rgba(249,115,22,0.2), rgba(249,115,22,0.08));
          border: 1px solid rgba(249,115,22,0.35);
          color: #fb923c;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 999px;
        }

        .sign-out-btn {
          background: rgba(255,255,255,0.06) !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          color: #cbd5e1 !important;
          font-weight: 600 !important;
          font-size: 13px !important;
          border-radius: 12px !important;
          transition: all 0.2s !important;
        }
        .sign-out-btn:hover {
          background: rgba(239,68,68,0.15) !important;
          border-color: rgba(239,68,68,0.35) !important;
          color: #fca5a5 !important;
        }

        .stat-divider:last-child .stat-divider-line {
          display: none;
        }

        .info-grid-item {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 12px 14px;
        }
        .info-grid-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #475569;
          margin-bottom: 4px;
        }
        .info-grid-value {
          font-size: 14px;
          font-weight: 700;
          color: #e2e8f0;
        }
      `}</style>

      <div className="profile-root">
        <div className="noise-overlay" />

        <div className="relative z-10 max-w-xl mx-auto px-4 py-10 pb-20">

          {/* ── MAIN CARD ── */}
          <div className="glass-card rounded-3xl overflow-hidden mb-4">

            {/* Banner */}
            <div className="banner-gradient h-36 relative overflow-hidden">
              {/* Diagonal stripes */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    -55deg,
                    transparent,
                    transparent 18px,
                    rgba(255,255,255,0.08) 18px,
                    rgba(255,255,255,0.08) 19px
                  )`,
                }}
              />
              {/* Orb in banner */}
              <div
                className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-30"
                style={{ background: 'radial-gradient(circle, #f97316, transparent 70%)' }}
              />
            </div>

            <div className="px-6 pb-7">
              {/* Avatar row */}
              <div className="flex items-end justify-between -mt-12 mb-5">
                <div className="relative">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-24 h-24 rounded-2xl object-cover avatar-ring"
                  />
                  {user.isVerified && (
                    <div
                      className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 2px 8px rgba(249,115,22,0.5)' }}
                    >
                      <BadgeCheck size={15} className="text-white" />
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => await signOut({ redirect: true })}
                  className="sign-out-btn gap-2"
                >
                  <LogOut size={14} />
                  Sign Out
                </Button>
              </div>

              {/* Name block */}
              <div className="mb-4">
                <div className="flex items-center gap-2.5 flex-wrap mb-1">
                  <h1
                    className="text-3xl font-black text-white leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {user.name}
                  </h1>
                  {user.isVerified && <span className="tag-badge">Verified</span>}
                </div>
                {user.username ? (
                  <p className="text-base font-semibold" style={{ color: '#f97316' }}>
                    @{user.username}
                  </p>
                ) : (
                  <p className="text-sm font-medium text-slate-600 italic">No username set</p>
                )}
              </div>

              {/* Bio */}
              {user.bio ? (
                <div
                  className="mb-5 p-4 rounded-2xl relative"
                  style={{ background: 'rgba(249,115,22,0.07)', borderLeft: '3px solid rgba(249,115,22,0.6)' }}
                >
                  <p className="text-sm font-medium text-slate-200 leading-relaxed">
                    {user.bio}
                  </p>
                </div>
              ) : (
                <p className="text-sm font-medium text-slate-600 italic mb-5">No bio yet.</p>
              )}

              {/* Info badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {user.location && (
                  <InfoBadge icon={<MapPin size={13} />} text={user.location} />
                )}
                {user.website && (
                  <InfoBadge icon={<Globe size={13} />} text={user.website.replace(/^https?:\/\//, '')} />
                )}
                <InfoBadge
                  icon={<CalendarDays size={13} />}
                  text={`Joined ${formatDate(user.createdAt)}`}
                />
              </div>

              {/* Stats bar */}
              <div
                className="rounded-2xl overflow-hidden flex"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <StatCard
                  label="Followers"
                  value={user.followersCount}
                  icon={<Users size={17} />}
                />
                <StatCard
                  label="Following"
                  value={user.followingCount}
                  icon={<UserCheck size={17} />}
                />
              </div>
            </div>
          </div>

          {/* ── SOCIAL LINKS CARD ── */}
          {(user.twitterHandle || user.githubHandle || user.linkedinHandle || user.website) && (
            <div className="glass-card rounded-3xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-1 h-4 rounded-full"
                  style={{ background: 'linear-gradient(180deg, #f97316, #ea580c)' }}
                />
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.18em]">
                  Social Links
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                {user.twitterHandle && (
                  <SocialLink
                    href={`https://twitter.com/${user.twitterHandle}`}
                    icon={<Twitter size={15} />}
                    label={`@${user.twitterHandle}`}
                  />
                )}
                {user.githubHandle && (
                  <SocialLink
                    href={`https://github.com/${user.githubHandle}`}
                    icon={<Github size={15} />}
                    label={`/${user.githubHandle}`}
                  />
                )}
                {user.linkedinHandle && (
                  <SocialLink
                    href={`https://linkedin.com/in/${user.linkedinHandle}`}
                    icon={<Linkedin size={15} />}
                    label={`/in/${user.linkedinHandle}`}
                  />
                )}
                {user.website && (
                  <SocialLink
                    href={user.website}
                    icon={<LinkIcon size={15} />}
                    label={user.website.replace(/^https?:\/\//, '')}
                  />
                )}
              </div>
            </div>
          )}

          {/* ── ACCOUNT INFO CARD ── */}
          <div className="glass-card rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-1 h-4 rounded-full"
                style={{ background: 'linear-gradient(180deg, #f97316, #ea580c)' }}
              />
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.18em]">
                Account Info
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="info-grid-item">
                <p className="info-grid-label">Role</p>
                <p className="info-grid-value capitalize">{user.role ?? 'user'}</p>
              </div>
              <div className="info-grid-item">
                <p className="info-grid-label">Status</p>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: user.isActive ? '#4ade80' : '#f87171',
                      boxShadow: user.isActive ? '0 0 6px #4ade80' : '0 0 6px #f87171',
                    }}
                  />
                  <p
                    className="info-grid-value"
                    style={{ color: user.isActive ? '#4ade80' : '#f87171' }}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
              <div className="info-grid-item col-span-2">
                <p className="info-grid-label">User ID</p>
                <p className="text-xs font-bold text-slate-400 font-mono break-all tracking-wide">
                  {user.userId}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
