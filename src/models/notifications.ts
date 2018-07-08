// interface for Notifications
export interface Notifications {
    type: string;
    userId: string;
    needId: string;
    heading: string;
    body: string;
    iconUrl: string;
    isRead: Boolean;
}