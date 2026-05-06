import { getSocket } from '../api/notificationSocket';

export function useNotificationActions() {
  const handleMarkAsRead = (notificationId: string) => {
    getSocket()?.emit('notifications:markRead', { notificationId, id: notificationId });
  };

  const handleMarkAllAsRead = () => {
    getSocket()?.emit('notifications:markAllRead');
  };

  return { handleMarkAsRead, handleMarkAllAsRead };
}
