import type{ ReactNode } from 'react'
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
  User as UserIcon,
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
    <div className="flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 min-w-[100px]">
      <div className="text-orange-400">{icon}</div>
      <span className="text-2xl font-bold text-white">{value.toLocaleString()}</span>
      <span className="text-xs text-slate-400 uppercase tracking-widest">{label}</span>
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
      className="flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors duration-200 text-sm group"
    >
      <span className="text-slate-500 group-hover:text-orange-400 transition-colors">
        {icon}
      </span>
      {label}
    </a>
  )
}

function InfoRow({
  icon,
  text,
}: {
  icon: ReactNode
  text: string
}) {
  return (
    <div className="flex items-center gap-2 text-slate-400 text-sm">
      <span className="text-orange-400/70">{icon}</span>
      <span>{text}</span>
    </div>
  )
}

function Profile() {
  const user = Route.useLoaderData()
  const { signOut } = useSession()

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #0d1420 0%, #1e2840 50%, #0d1420 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Subtle background pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Orange glow top */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse, #f97316 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">

        {/* Header card */}
        <div
          className="rounded-3xl overflow-hidden border border-white/10 mb-4"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}
        >
          {/* Banner */}
          <div
            className="h-28 w-full relative"
            style={{
              background: 'linear-gradient(120deg, #1e2840 0%, #f97316 50%, #1e2840 100%)',
            }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(255,255,255,0.05) 10px,
                  rgba(255,255,255,0.05) 20px
                )`,
              }}
            />
          </div>

          {/* Avatar + Name */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="relative">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-20 h-20 rounded-2xl border-4 object-cover shadow-2xl"
                  style={{ borderColor: '#1e2840' }}
                />
                {user.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-0.5">
                    <BadgeCheck size={16} className="text-white" />
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={async () => await signOut({ redirect: true })}
                className="border-white/20 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl gap-2"
              >
                <LogOut size={14} />
                Sign Out
              </Button>
            </div>

            {/* Name & username */}
            <div className="mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h1
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {user.name}
                </h1>
                {user.isVerified && (
                  <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                )}
              </div>
              {user.username ? (
                <p className="text-orange-400 text-sm mt-0.5">@{user.username}</p>
              ) : (
                <p className="text-slate-600 text-sm mt-0.5 italic">No username set</p>
              )}
            </div>

            {/* Bio */}
            {user.bio ? (
              <p className="text-slate-300 text-sm leading-relaxed mb-4 border-l-2 border-orange-500/50 pl-3">
                {user.bio}
              </p>
            ) : (
              <p className="text-slate-600 text-sm italic mb-4">No bio yet.</p>
            )}

            {/* Info rows */}
            <div className="flex flex-col gap-2 mb-4">
              {user.location && (
                <InfoRow icon={<MapPin size={14} />} text={user.location} />
              )}
              {user.website && (
                <InfoRow icon={<Globe size={14} />} text={user.website} />
              )}
              <InfoRow
                icon={<CalendarDays size={14} />}
                text={`Joined ${formatDate(user.createdAt)}`}
              />
            </div>

            {/* Stats */}
            <div className="flex gap-3 flex-wrap">
              <StatCard
                label="Followers"
                value={user.followersCount}
                icon={<Users size={16} />}
              />
              <StatCard
                label="Following"
                value={user.followingCount}
                icon={<UserCheck size={16} />}
              />
            </div>
          </div>
        </div>

        {/* Social Links Card */}
        {(user.twitterHandle || user.githubHandle || user.linkedinHandle || user.website) && (
          <div
            className="rounded-3xl border border-white/10 p-5 mb-4"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}
          >
            <h2 className="text-xs text-slate-500 uppercase tracking-widest mb-4">
              Social Links
            </h2>
            <div className="flex flex-col gap-3">
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

        {/* Account Info Card */}
        <div
          className="rounded-3xl border border-white/10 p-5"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}
        >
          <h2 className="text-xs text-slate-500 uppercase tracking-widest mb-4">
            Account Info
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-2xl p-3">
              <p className="text-xs text-slate-500 mb-1">Role</p>
              <p className="text-sm text-white capitalize">{user.role ?? 'user'}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-3">
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <p className={`text-sm font-medium ${user.isActive ? 'text-green-400' : 'text-red-400'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 col-span-2">
              <p className="text-xs text-slate-500 mb-1">User ID</p>
              <p className="text-xs text-slate-400 font-mono break-all">{user.userId}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
