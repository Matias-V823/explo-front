import { useState } from 'react';
import { Bell, BellOff, CheckCheck, ClipboardList, CalendarClock, Building2, X } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';
import { useNotificationService } from '../hooks/useNotificationService';
import type { Notification, NotificationType } from '../types/notification';

type TypeConfig = {
  label: string;
  borderClass: string;
  bgClass: string;
  iconClass: string;
  dotClass: string;
  labelClass: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
};

const TYPE_CONFIG: Record<NotificationType, TypeConfig> = {
  'task.created':           { label: 'Tarea creada',        borderClass: 'border-[#F2C94C]',  bgClass: 'bg-amber-50',   iconClass: 'text-amber-500',   dotClass: 'bg-amber-400',   labelClass: 'text-amber-600',   Icon: ClipboardList },
  'task.updated':           { label: 'Tarea actualizada',   borderClass: 'border-[#F2C94C]',  bgClass: 'bg-amber-50',   iconClass: 'text-amber-500',   dotClass: 'bg-amber-400',   labelClass: 'text-amber-600',   Icon: ClipboardList },
  'task.completed':         { label: 'Tarea completada',    borderClass: 'border-emerald-400', bgClass: 'bg-emerald-50', iconClass: 'text-emerald-500', dotClass: 'bg-emerald-400', labelClass: 'text-emerald-600', Icon: ClipboardList },
  'calendar.created':       { label: 'Evento de calendario', borderClass: 'border-[#5B9DD6]', bgClass: 'bg-sky-50',     iconClass: 'text-sky-500',     dotClass: 'bg-sky-400',     labelClass: 'text-sky-600',     Icon: CalendarClock },
  'calendar.reminder':      { label: 'Recordatorio',        borderClass: 'border-[#5B9DD6]',  bgClass: 'bg-sky-50',     iconClass: 'text-sky-500',     dotClass: 'bg-sky-400',     labelClass: 'text-sky-600',     Icon: CalendarClock },
  'property.date.reminder': { label: 'Propiedad',           borderClass: 'border-violet-400', bgClass: 'bg-violet-50',  iconClass: 'text-violet-500',  dotClass: 'bg-violet-400',  labelClass: 'text-violet-600',  Icon: Building2 },
};

const FALLBACK_CONFIG: TypeConfig = {
  label: 'Notificación',
  borderClass: 'border-zinc-300',
  bgClass: 'bg-zinc-50',
  iconClass: 'text-ink-3',
  dotClass: 'bg-zinc-400',
  labelClass: 'text-ink-3',
  Icon: Bell,
};

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'ahora';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(dateStr).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, removeNotification, clearNotifications } = useNotificationStore();
  const { handleMarkAsRead, handleMarkAllAsRead } = useNotificationService();

  const onMarkAllRead = () => {
    handleMarkAllAsRead();
    clearNotifications();
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notificaciones"
        title="Notificaciones"
        className={`relative z-50 w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-150 cursor-pointer ${
          open
            ? 'bg-zinc-100 border-[rgba(0,0,0,0.12)] text-ink shadow-inner'
            : 'bg-white border-[rgba(0,0,0,0.07)] text-ink-3 hover:bg-zinc-50 hover:border-[rgba(0,0,0,0.1)]'
        }`}
      >
        <Bell size={15} strokeWidth={1.8} />

        {unreadCount > 0 && (
          <span className="absolute -top-1.25 -right-1.25 min-w-4.5 h-4.5 rounded-full bg-ink text-white text-[10px] font-bold flex items-center justify-center px-1.25 leading-none border-2 border-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}

      {/* Popover */}
      <div
        className={`absolute right-0 top-[calc(100%+10px)] w-90 z-50 bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-[0_12px_40px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-200 ease-out origin-top-right overflow-hidden ${
          open
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-[0.96] -translate-y-1 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,0,0,0.06)] sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="text-[13.5px] font-semibold text-ink tracking-[-0.2px]">
              Notificaciones
            </span>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 rounded-full bg-ink text-white text-[10px] font-bold px-1.5 leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>

          {notifications.length > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-[11.5px] text-ink-3 hover:text-ink transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-zinc-50 font-medium"
            >
              <CheckCheck size={12} strokeWidth={2.2} />
              <span>Limpiar todo</span>
            </button>
          )}
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-90">
          {notifications.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="p-1.5 flex flex-col">
              {notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onRead={() => handleMarkAsRead(n.id)}
                  onRemove={() => removeNotification(n.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-11 h-11 rounded-2xl bg-zinc-50 border border-[rgba(0,0,0,0.06)] flex items-center justify-center">
        <BellOff size={18} strokeWidth={1.5} className="text-ink-3" />
      </div>
      <div className="text-center">
        <p className="text-[13px] font-semibold text-ink tracking-[-0.2px]">Todo al día</p>
        <p className="text-[12px] text-ink-3 mt-0.5">No hay notificaciones pendientes</p>
      </div>
    </div>
  );
}

const ANIM_DURATION = 180;

function NotificationItem({
  notification: n,
  onRead,
  onRemove,
}: {
  notification: Notification;
  onRead: () => void;
  onRemove: () => void;
}) {
  const [removing, setRemoving] = useState(false);
  const cfg = TYPE_CONFIG[n.type] ?? FALLBACK_CONFIG;
  const { Icon } = cfg;

  const triggerRemove = () => {
    setRemoving(true);
    setTimeout(onRemove, ANIM_DURATION);
  };

  const handleClick = () => {
    if (!n.isRead) {
      onRead();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerRemove();
  };

  return (
    /* Grid collapse: row height 1fr→0fr */
    <div
      className="grid transition-[grid-template-rows] ease-out"
      style={{
        gridTemplateRows: removing ? '0fr' : '1fr',
        transitionDuration: `${ANIM_DURATION}ms`,
      }}
    >
      <div className="overflow-hidden">
        {/* Fade + slide out */}
        <div
          className="transition-[opacity,transform] ease-out mb-0.5"
          style={{
            opacity: removing ? 0 : 1,
            transform: removing ? 'translateX(6px)' : 'translateX(0)',
            transitionDuration: `${ANIM_DURATION - 30}ms`,
          }}
        >
          <div
            onClick={handleClick}
            className={`relative flex items-start gap-3 px-3 py-2.5 rounded-xl border-l-[3px] transition-colors duration-150 ${
              n.isRead
                ? 'border-transparent cursor-default'
                : `${cfg.borderClass} bg-zinc-50/70 cursor-pointer hover:bg-zinc-100/80`
            }`}
          >
            {/* Type icon */}
            <div
              className={`mt-0.5 w-7 h-7 rounded-lg shrink-0 flex items-center justify-center ${
                n.isRead ? 'bg-zinc-100' : cfg.bgClass
              }`}
            >
              <Icon
                size={13}
                strokeWidth={1.9}
                className={n.isRead ? 'text-ink-3' : cfg.iconClass}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <p
                  className={`text-[12.5px] leading-snug line-clamp-2 ${
                    n.isRead ? 'font-normal text-ink-3' : 'font-semibold text-ink'
                  }`}
                >
                  {n.title}
                </p>
                <span className="text-[10.5px] text-ink-3 shrink-0 mt-px tabular-nums">
                  {relativeTime(n.createdAt)}
                </span>
              </div>

              <p className="text-[11.5px] text-ink-3 leading-snug truncate">{n.message}</p>

              <div className="flex items-center justify-between mt-1.5">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wide ${
                    n.isRead ? 'text-zinc-400' : cfg.labelClass
                  }`}
                >
                  {cfg.label}
                </span>

                {!n.isRead && (
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
                )}
              </div>
            </div>

            {/* Delete button */}
            <button
              onClick={handleDelete}
              title="Eliminar"
              className="mt-0.5 w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-zinc-300 hover:text-zinc-500 hover:bg-zinc-200/70 transition-colors cursor-pointer"
            >
              <X size={11} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
