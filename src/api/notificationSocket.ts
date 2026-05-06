import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL as string;

let socket: Socket | null = null;

export function getNotificationSocket(token: string): Socket {
  if (socket) return socket;

  socket = io(`${API_URL}/notifications`, {
    auth: { token },
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 2000,
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectNotificationSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
