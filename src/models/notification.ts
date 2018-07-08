// interface for Notification
export interface Notification {
    notificationId: string;
    type: string;
    heading: string;
    body: string;
    iconUrl: string;
    isRead: Boolean;
}