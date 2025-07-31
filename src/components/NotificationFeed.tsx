
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Notification {
    id: string;
    type: 'info' | 'warning' | 'success' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
}

interface NotificationFeedProps {
    notifications: any[];
}

export const NotificationFeed = ({ notifications: wsNotifications }: NotificationFeedProps) => {
    const [notifications, setNotifications] = useState<Notification[]>(wsNotifications.map((wsNotif, index) => ({
        id: `ws-${Date.now()}-${index}`,
        type: 'info' as const,
        title: wsNotif.title || 'Game Update',
        message: wsNotif.message || JSON.stringify(wsNotif),
        timestamp: new Date(wsNotif.timestamp * 1000 || Date.now()),
        read: false
    })));

    useEffect(() => {
        const newNotifications = wsNotifications.map((wsNotif, index) => ({
            id: `ws-${Date.now()}-${index}`,
            type: 'info' as const,
            title: wsNotif.title || 'Game Update',
            message: wsNotif.message || JSON.stringify(wsNotif),
            timestamp: new Date(wsNotif.timestamp * 1000 || Date.now()),
            read: false
        }));

        setNotifications(newNotifications);

        if (newNotifications.length > 0) {
            const lastNotification = newNotifications[0];
            if (lastNotification.title !== 'System Connected') {
                toast({
                    title: lastNotification.title,
                    description: lastNotification.message,
                });
            }
        }
    }, [wsNotifications]);

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
        );
    };

    const clearNotification = (id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
        toast({
            title: "Notification cleared",
            description: "The notification has been removed.",
        });
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
        const unreadCount = notifications.filter(n => !n.read).length;
        if (unreadCount > 0) {
            toast({
                title: "All notifications marked as read",
                description: `${unreadCount} notifications marked as read.`,
            });
        }
    };

    const getNotificationBadgeVariant = (type: string) => {
        switch (type) {
            case 'success': return 'default';
            case 'warning': return 'secondary';
            case 'error': return 'destructive';
            case 'info': return 'outline';
            default: return 'secondary';
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            case 'info': return 'ℹ️';
            default: return '📢';
        }
    };

    const formatTimestamp = (timestamp: Date) => {
        const now = new Date();
        const diff = now.getTime() - timestamp.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        🔔 Live Notification Feed
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-2">
                                {unreadCount} unread
                            </Badge>
                        )}
                    </CardTitle>
                    {unreadCount > 0 && (
                        <Button variant="outline" size="sm" onClick={markAllAsRead}>
                            Mark all as read
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {notifications.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                        <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No notifications yet</p>
                        <p className="text-sm">You'll see real-time game updates here</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 rounded-lg border transition-all duration-200 ${notification.read
                                        ? 'bg-muted/20 border-border'
                                        : 'bg-accent/30 border-primary/20 shadow-sm'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                                            <h4 className="font-medium">{notification.title}</h4>
                                            <Badge variant={getNotificationBadgeVariant(notification.type)} className="text-xs">
                                                {notification.type}
                                            </Badge>
                                            {!notification.read && (
                                                <div className="w-2 h-2 bg-primary rounded-full" />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">
                                                {formatTimestamp(notification.timestamp)}
                                            </span>
                                            <div className="flex gap-2">
                                                {!notification.read && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-xs"
                                                    >
                                                        Mark as read
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => clearNotification(notification.id)}
                                                    className="text-xs text-destructive hover:text-destructive"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
