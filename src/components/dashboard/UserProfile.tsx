import type { User } from '../../types'
import { formatCurrency } from '../../utils/formatters'

interface UserProfileProps {
  user: User
  monthlyIncome: number
}

export default function UserProfile({ user, monthlyIncome }: UserProfileProps) {
  return (
    <div className="profile-bg h-full rounded-[20px] overflow-hidden relative border border-white/5">
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      <div
        className="absolute bottom-0 left-0 right-0 h-32 backdrop-blur-md"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)',
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/60 to-transparent" />

      <div className="flex items-center justify-between absolute bottom-0 left-0 right-0 p-5 z-10">
        <div>
          <p className="text-sm font-bold text-white tracking-[-0.4px] leading-tight">
            {user.name}
          </p>
          <p className="text-[10px] text-zinc-100 text-start font-mono">
            {user.role}
          </p>
        </div>

        <div className="inline-flex items-center px-4 py-1.75 rounded-full bg-white/15 border border-white/20 text-[10px] font-bold text-white tracking-[-0.2px]">
          {formatCurrency(monthlyIncome)}
        </div>
      </div>
    </div>
  )
}