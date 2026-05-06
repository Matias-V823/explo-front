import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { getNotificationSocket, disconnectNotificationSocket } from '../api/notificationSocket';
import { apiFetch } from '../api/client';
import type { Notification } from '../types/notification';

export function useNotificationService() {
  const { token, isAuthenticated } = useAuthStore();
  const { setNotifications, addNotification, markAsRead, markAllAsRead } = useNotificationStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      disconnectNotificationSocket();
      return;
    }

    apiFetch('/notifications')
      .then((res) => res.json())
      .then((data: Notification[]) => setNotifications(data))
      .catch(console.error);

    const socket = getNotificationSocket(token);
    socketRef.current = socket;

    socket.on('notification', (data: Notification) => {
      addNotification(data);
    });

    socket.on('notifications:readAck', ({ id }: { id: string }) => {
      markAsRead(id);
    });

    socket.on('notifications:allReadAck', () => {
      markAllAsRead();
    });

    socket.on('error', (err: { message: string }) => {
      console.error('[WS] Error de autenticación:', err.message);
    });

    socket.on('connect_error', (err) => {
      console.error('[WS] Error de conexión:', err.message);
    });

    return () => {
      socket.off('notification');
      socket.off('notifications:readAck');
      socket.off('notifications:allReadAck');
      socket.off('error');
      socket.off('connect_error');
    };
  }, [isAuthenticated, token]);

  const handleMarkAsRead = (notificationId: string) => {
    socketRef.current?.emit('notifications:markRead', {
      notificationId,
      id: notificationId,
    });
  };

  const handleMarkAllAsRead = () => {
    socketRef.current?.emit('notifications:markAllRead');
  };

  return { handleMarkAsRead, handleMarkAllAsRead };
}
