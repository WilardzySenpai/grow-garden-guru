// Utility for sending browser notifications (Web Notifications API)
// Focused on simple, safe usage without service workers (tab must be open)
// TEMPORARILY DISABLED

export type BrowserNotificationOptions = {
    body?: string;
    icon?: string;
    url?: string; // Navigate to this URL on click
    tag?: string; // Used to replace notifications with the same tag
};

export const sendBrowserNotification = async (
    title: string,
    options: BrowserNotificationOptions = {}
) => {
    // TEMPORARILY DISABLED BROWSER NOTIFICATIONS
    /*
    if (typeof window === 'undefined' || !('Notification' in window)) {
        console.log('[Push] Notifications API not supported in this environment.');
        return;
    }

    try {
        let permission: NotificationPermission = Notification.permission;

        if (permission === 'default') {
            // Request permission on first use; browsers might require a user gesture
            permission = await Notification.requestPermission();
        }

        if (permission !== 'granted') {
            console.log('[Push] Notification permission not granted:', permission);
            return;
        }

        const notif = new Notification(title, {
            body: options.body,
            icon: options.icon || '/favicon.ico',
            tag: options.tag || 'stock-alert',
            requireInteraction: false,
        });

        notif.onclick = () => {
            try {
                window.focus();
                if (options.url) {
                    window.location.href = options.url;
                }
            } catch (err) {
                console.warn('[Push] Notification click handling failed:', err);
            } finally {
                notif.close();
            }
        };
    } catch (err) {
        console.warn('[Push] Failed to send browser notification:', err);
    }
    */
   console.log('[Push] Browser notifications are temporarily disabled');
   return;
};
