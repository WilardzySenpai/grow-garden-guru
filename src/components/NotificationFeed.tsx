
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, X, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/types/database.types';

type JandelMessage = Database['public']['Tables']['jandel_messages']['Row'];
type StockAlert = Database['public']['Tables']['notifications']['Row'];

// Unified notification structure
interface UnifiedNotification {
    id: string; // Combination of type and id
    type: 'jandel' | 'stock_alert';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    icon?: string;
    originalId: string | number;
}

interface NotificationFeedProps {
    jandelMessages: JandelMessage[];
    stockAlerts: StockAlert[];
    loading: boolean;
    error: string | null;
}

export const NotificationFeed = ({ jandelMessages, stockAlerts, loading, error }: NotificationFeedProps) => {
    const [readStatuses, setReadStatuses] = useState<Record<string, boolean>>({});

    const notifications = useMemo(() => {
        const transformedJandel = jandelMessages.map(n => ({
            id: `jandel-${n.id}`,
            originalId: n.id,
            type: 'jandel' as const,
            title: 'Jandel Message',
            message: n.message,
            timestamp: new Date(n.timestamp),
            read: readStatuses[`jandel-${n.id}`] || false,
            icon: 'megaphone'
        }));

        const transformedAlerts = stockAlerts.map(a => ({
            id: `stock-${a.id}`,
            originalId: a.id,
            type: 'stock_alert' as const,
            title: 'Stock Alert',
            message: a.message,
            timestamp: new Date(a.created_at),
            read: readStatuses[`stock-${a.id}`] || a.read,
            icon: a.icon || 'package'
        }));

        return [...transformedJandel, ...transformedAlerts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [jandelMessages, stockAlerts, readStatuses]);

    useEffect(() => {
        if (notifications.length > 0) {
            const lastNotification = notifications[0];
            // Basic toast for new Jandel messages, could be expanded
            if (lastNotification.type === 'jandel' && !lastNotification.read) {
                 // This might need more robust logic to prevent spamming toasts
            }
        }
    }, [notifications]);

    const markAsRead = (id: string) => {
        setReadStatuses(prev => ({ ...prev, [id]: true }));
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
