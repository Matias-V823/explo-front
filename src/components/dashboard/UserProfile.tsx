import type { User } from '../../types'

interface UserProfileProps {
  user: User
}

export default function UserProfile({ user }: UserProfileProps) {

  const role = user.role === 'AGENTE' ? 'AGENTE INMOBILIARIO' : user.role

  return (
    <div className="profile-bg h-full rounded-[20px] overflow-hidden relative border border-white/5">
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      <div
        className="absolute bottom-0 left-0 right-0 h-20 backdrop-blur-md"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)',
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/60 to-transparent" />

      <div className="flex items-center justify-between absolute bottom-0 left-0 right-0 p-5 z-10">
        <div>
          <p className="text-md font-bold text-white tracking-[-0.4px] leading-tight">
            {user.name}
          </p>
          <p className="text-xs text-zinc-100 text-start font-mono">
            {role}
          </p>
        </div>
      </div>
    </div>
  )
}