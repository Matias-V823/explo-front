export type NotificationType =
  | 'task.created'
  | 'task.updated'
  | 'task.completed'
  | 'calendar.created'
  | 'calendar.reminder'
  | 'property.date.reminder';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}
