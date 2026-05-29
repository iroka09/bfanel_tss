/**
 * ProfileSkeleton.tsx
 *
 * Requires one @keyframes block in your global CSS (app.css):
 *
 *   @keyframes shimmer {
 *     from { background-position: -600px 0; }
 *     to   { background-position:  600px 0; }
 *   }
 *
 * If using Tailwind v4 @theme, also add:
 *   @theme { --animate-shimmer: shimmer 1.8s infinite linear; }
 *   Then swap `animate-[shimmer_1.8s_infinite_linear]` → `animate-shimmer` everywhere.
 *
 * Usage in your route:
 *   import { ProfileSkeleton } from '@/components/ProfileSkeleton'
 *
 *   export const Route = createFileRoute('/profile/')({
 *     pendingComponent: ProfileSkeleton,
 *     ...
 *   })
 */

/* ─── shimmer class string (reused on every bone) ─────────────────── */
const wave = [
  // animated gradient — sweeps left to right with an orange-tinted midpoint
  'bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.10)_40%,rgba(249,115,22,0.08)_50%,rgba(255,255,255,0.10)_60%,rgba(255,255,255,0.04)_100%)]',
  // background-size wider than the element so the sweep is visible
  'bg-[length:600px_100%]',
  // uses the @keyframes shimmer defined in app.css
  'animate-[shimmer_1.8s_infinite_linear]',
].join(' ')

/* ─── primitive bone ──────────────────────────────────────────────── */
function Bone({ className = '' }: { className?: string }) {
  return (
    <div
      className={`
        rounded-xl
        bg-white/[0.06] dark:bg-white/[0.05]
        ${wave}
        ${className}
      `}
    />
  )
}

/* ─── StatCard skeleton ───────────────────────────────────────────── */
function StatCardSk() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 py-5 px-4 relative">
      {/* divider line matching real StatCard */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-px bg-white/10" />
      <Bone className="w-9 h-9 rounded-xl" />
      <Bone className="w-12 h-7 rounded-lg" />
      <Bone className="h-3 w-16 rounded-md" />
    </div>
  )
}

/* ─── SocialLink skeleton ─────────────────────────────────────────── */
function SocialLinkSk({ labelW }: { labelW: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.04]">
      <div className="flex items-center gap-3">
        <Bone className="w-8 h-8 flex-shrink-0" />
        <Bone className={`h-4 rounded-md ${labelW}`} />
      </div>
      <Bone className="w-4 h-4 flex-shrink-0 rounded-md" />
    </div>
  )
}

/* ─── AccountCell skeleton ────────────────────────────────────────── */
function AccountCellSk({ wide = false }: { wide?: boolean }) {
  return (
    <div
      className={`
        bg-white/[0.04] border border-white/[0.07] rounded-[14px] p-3 px-[14px] space-y-2
        ${wide ? 'col-span-2' : ''}
      `}
    >
      <Bone className="h-3 w-12 rounded-md" />
      <Bone className={`h-4 rounded-md ${wide ? 'w-48' : 'w-16'}`} />
    </div>
  )
}

/* ─── SectionHeading skeleton ─────────────────────────────────────── */
function SectionHeadingSk() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-4 rounded-full bg-orange-500/25" />
      <Bone className="h-3 w-24 rounded-md" />
    </div>
  )
}

/* ─── main export ─────────────────────────────────────────────────── */
export function ProfileSkeleton() {
  return (
    <div className="min-h-screen font-[DM_Sans,sans-serif] text-white bg-[#080d18] [background:radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(249,115,22,0.08)_0%,transparent_60%),#080d18]">

      {/* noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[length:200px_200px] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto px-4 py-10 pb-20 space-y-4">

        {/* ── MAIN CARD ─────────────────────────────────────────── */}
        <div className="bg-white/[0.04] border border-white/[0.09] backdrop-blur-xl rounded-3xl overflow-hidden">

          {/* Banner — shimmer over the real banner gradient colors */}
          <div
            className={`
              h-36 relative overflow-hidden
              bg-[linear-gradient(135deg,#0d1420_0%,#1e2840_30%,rgba(194,65,12,0.5)_60%,rgba(249,115,22,0.4)_80%,rgba(254,215,170,0.2)_100%)]
              ${wave}
            `}
          >
            {/* stripe texture matching real banner */}
            <div className="absolute inset-0 opacity-10 [background-image:repeating-linear-gradient(-55deg,transparent,transparent_18px,rgba(255,255,255,0.08)_18px,rgba(255,255,255,0.08)_19px)]" />
          </div>

          <div className="px-6 pb-7">

            {/* Avatar row */}
            <div className="flex items-end justify-between -mt-12 mb-5">

              {/* Avatar + verified badge */}
              <div className="relative">
                <Bone className="w-24 h-24 rounded-2xl [box-shadow:0_0_0_4px_#080d18,0_0_0_6px_rgba(249,115,22,0.2)]" />
                <Bone className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full" />
              </div>

              {/* Edit + Sign out buttons */}
              <div className="flex items-center gap-2 ml-3">
                <Bone className="w-[68px] h-8 rounded-xl" />
                <Bone className="w-[100px] h-8 rounded-xl" />
              </div>
            </div>

            {/* Name block */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Bone className="h-9 w-44 rounded-xl" />  {/* display name */}
                <Bone className="h-5 w-16 rounded-full" /> {/* Verified badge */}
              </div>
              <Bone className="h-4 w-28 rounded-lg" />     {/* @username */}
            </div>

            {/* Bio block */}
            <div className="mb-5 p-4 rounded-2xl bg-orange-500/[0.05] border-l-[3px] border-orange-500/20 space-y-[10px]">
              <Bone className="h-3.5 w-full rounded-md" />
              <Bone className="h-3.5 w-[83%] rounded-md" />
              <Bone className="h-3.5 w-[67%] rounded-md" />
            </div>

            {/* Info badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Bone className="h-8 w-28 rounded-full" />  {/* location */}
              <Bone className="h-8 w-36 rounded-full" />  {/* website */}
              <Bone className="h-8 w-32 rounded-full" />  {/* joined date */}
            </div>

            {/* Stats bar */}
            <div className="rounded-2xl overflow-hidden flex bg-white/[0.04] border border-white/[0.08]">
              <StatCardSk />
              <StatCardSk />
            </div>
          </div>
        </div>

        {/* ── SOCIAL LINKS CARD ─────────────────────────────────── */}
        <div className="bg-white/[0.04] border border-white/[0.09] backdrop-blur-xl rounded-3xl p-5">
          <SectionHeadingSk />
          <div className="flex flex-col gap-2">
            <SocialLinkSk labelW="w-28" />
            <SocialLinkSk labelW="w-36" />
            <SocialLinkSk labelW="w-24" />
          </div>
        </div>

        {/* ── ACCOUNT INFO CARD ─────────────────────────────────── */}
        <div className="bg-white/[0.04] border border-white/[0.09] backdrop-blur-xl rounded-3xl p-5">
          <SectionHeadingSk />
          <div className="grid grid-cols-2 gap-2.5">
            <AccountCellSk />           {/* Role */}
            <AccountCellSk />           {/* Status */}
            <AccountCellSk wide />      {/* User ID */}
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProfileSkeleton
