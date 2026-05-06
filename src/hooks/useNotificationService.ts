import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { useAlertStore } from '../store/alertStore';
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

    useAlertStore.getState().loadAlerts();

    const socket = getNotificationSocket(token);
    socketRef.current = socket;

    const onNotification = (data: Notification) => {
      addNotification(data);
      if (data.type.startsWith('alert.')) {
        useAlertStore.getState().loadAlerts();
      }
    };
    const onReadAck = ({ id }: { id: string }) => markAsRead(id);
    const onAllReadAck = () => markAllAsRead();
    const onError = (err: { message: string }) => console.error('[WS] Error de autenticación:', err.message);
    const onConnectError = (err: Error) => console.error('[WS] Error de conexión:', err.message);

    socket.on('notification', onNotification);
    socket.on('notifications:readAck', onReadAck);
    socket.on('notifications:allReadAck', onAllReadAck);
    socket.on('error', onError);
    socket.on('connect_error', onConnectError);

    return () => {
      socket.off('notification', onNotification);
      socket.off('notifications:readAck', onReadAck);
      socket.off('notifications:allReadAck', onAllReadAck);
      socket.off('error', onError);
      socket.off('connect_error', onConnectError);
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
