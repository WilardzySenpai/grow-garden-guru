import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Leaf, ArrowLeft, User, Trash2, Bell, TriangleAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { maskEmail } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { sendBrowserNotification } from '@/lib/browserNotifications';

interface AlertItem {
    item_id: string;
    display_name: string;
    type: string | null;
}

const Profile = () => {
    const [displayName, setDisplayName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { user, signOut, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [allItems, setAllItems] = useState<AlertItem[]>([]);
    const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
    const [alertsLoading, setAlertsLoading] = useState(false);

    // Browser notification permission state
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    // Redirect if not logged in or if guest
    useEffect(() => {
        if (!authLoading && (!user || ('isGuest' in user))) {
            navigate('/auth');
        }
    }, [user, authLoading, navigate]);

    // Load user profile, all items, and stock alert preferences
    useEffect(() => {
        const loadData = async () => {
            if (user && !('isGuest' in user)) {
                setAlertsLoading(true);

                // Load profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('display_name, avatar_url')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (profile) {
                    setDisplayName(profile.display_name || '');
                    setAvatarUrl(profile.avatar_url || '');
                }

                // Load items for notifications (only Crate, Seed, and gear types)
                const { data: items, error: itemsError } = await supabase
                    .from('items')
                    .select('item_id, display_name, type')
                    .in('type', ['crate', 'seed', 'gear']);

                if (itemsError) {
                    toast({
                        title: "Error",
                        description: "Could not fetch the item list for notifications.",
                        variant: "destructive",
                    });
                }

                const eggs: AlertItem[] = [
                    { item_id: 'common_egg', display_name: 'Common Egg', type: 'Egg' },
                    { item_id: 'mythical_egg', display_name: 'Mythical Egg', type: 'Egg' },
                    { item_id: 'bug_egg', display_name: 'Bug Egg', type: 'Egg' },
                    { item_id: 'common_summer_egg', display_name: 'Common Summer Egg', type: 'Egg' },
                    { item_id: 'rare_summer_egg', display_name: 'Rare Summer Egg', type: 'Egg' },
                    { item_id: 'paradise_egg', display_name: 'Paradise Egg', type: 'Egg' },
                    { item_id: 'anti_bee_egg', display_name: 'Anti Bee Egg', type: 'Egg' },
                    { item_id: 'bee_egg', display_name: 'Bee Egg', type: 'Egg' },
                ];

                const combinedItems = [...(items || []), ...eggs];
                const uniqueItems = Array.from(new Map(combinedItems.map(item => [item.item_id, item])).values());
                setAllItems(uniqueItems);


                // Load stock alerts
                const { data: alerts } = await supabase
                    .from('user_stock_alerts')
                    .select('item_id')
                    .eq('user_id', user.id);

                if (alerts) {
                    setSelectedAlerts(new Set(alerts.map(a => a.item_id)));
                }

                setAlertsLoading(false);
            }
        };

        loadData();
    }, [user]);

    const handleUpdateProfile = async () => {
        if (!user || ('isGuest' in user)) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    user_id: user.id,
                    display_name: displayName,
                    avatar_url: avatarUrl,
                });

            if (error) throw error;
            toast({
                title: "Profile Updated",
                description: "Your profile has been successfully updated.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: (error as Error).message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAlertSelectionChange = (itemId: string, checked: boolean) => {
        setSelectedAlerts(prev => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(itemId);
            } else {
                newSet.delete(itemId);
            }
            return newSet;
        });
    };

    const handleSaveChanges = async () => {
        if (!user || ('isGuest' in user)) return;

        setAlertsLoading(true);
        try {
            // First, delete all existing alerts for the user
            const { error: deleteError } = await supabase
                .from('user_stock_alerts')
                .delete()
                .eq('user_id', user.id);

            if (deleteError) throw deleteError;

            // Then, insert the new set of alerts
            const newAlerts = Array.from(selectedAlerts).map(itemId => ({
                user_id: user.id,
                item_id: itemId,
            }));

            if (newAlerts.length > 0) {
                const { error: insertError } = await supabase
                    .from('user_stock_alerts')
                    .insert(newAlerts);

                if (insertError) throw insertError;
            }

            toast({
                title: "Preferences Saved",
                description: "Your stock alert preferences have been updated.",
            });

        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to save preferences: ${(error as Error).message}`,
                variant: "destructive",
            });
        } finally {
            setAlertsLoading(false);
        }
    };

    const handleEnableNotifications = async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            toast({
                title: 'Unsupported',
                description: 'Your browser does not support notifications.',
                variant: 'destructive',
            });
            return;
        }
        try {
            let perm: NotificationPermission = Notification.permission;
            if (perm === 'default') {
                perm = await Notification.requestPermission();
            }
            setNotificationPermission(perm);
            if (perm === 'granted') {
                toast({
                    title: 'Notifications enabled',
                    description: 'You will receive stock alerts when the tab is in the background.',
                });
            } else {
                toast({
                    title: 'Permission not granted',
                    description: 'You can enable notifications in your browser settings.',
                    variant: 'destructive',
                });
            }
        } catch (e) {
            toast({
                title: 'Error',
                description: 'Could not request notification permission.',
                variant: 'destructive',
            });
        }
    };

    const handleTestNotification = () => {
        if (notificationPermission !== 'granted') {
            toast({
                title: 'Permission required',
                description: 'Enable notifications first.',
                variant: 'destructive',
            });
            return;
        }
        try {
            sendBrowserNotification('Stock alerts enabled', {
                body: 'You will be notified when your saved items restock.',
                icon: '/favicon.ico',
                url: '/market',
                tag: 'stock-alert-test',
            });
        } catch (e) {
            // no-op
        }
    };

    const handleDeleteAccount = async () => {
        if (!user || ('isGuest' in user)) return;

        setDeleteLoading(true);
        try {
            await supabase.from('profiles').delete().eq('user_id', user.id);
            const { error } = await supabase.auth.admin.deleteUser(user.id);
            if (error) throw error;
            toast({
                title: "Account Deleted",
                description: "Your account has been permanently deleted.",
            });
            await signOut();
            navigate('/');
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to delete account: ${(error as Error).message}`,
                variant: "destructive",
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-4">
                <p>Loading profile...</p>
            </div>
        );
    }

    if (!user || ('isGuest' in user)) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <Link to="/app" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to App
                    </Link>
                    <div className="flex items-center justify-center gap-3">
                        <Leaf className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
                    </div>
                    <p className="text-muted-foreground">Manage your profile information and account</p>
                </div>

                {/* Profile Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile Information
                        </CardTitle>
                        <CardDescription>
                            Update your display name and avatar
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={avatarUrl} alt="Profile" />
                                <AvatarFallback className="text-lg">
                                    {displayName ? displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Label htmlFor="avatar-url">Avatar URL</Label>
                                <Input id="avatar-url" type="url" placeholder="https://example.com/avatar.jpg" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="display-name">Display Name</Label>
                            <Input id="display-name" type="text" placeholder="Enter your display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={maskEmail(user.email || '')} disabled className="bg-muted" />
                            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                        </div>
                        <Button onClick={handleUpdateProfile} disabled={loading} className="w-full">
                            {loading ? "Updating..." : "Update Profile"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Browser Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Browser Notifications
                        </CardTitle>
                        <CardDescription>
                            Enable system notifications for stock alerts while this site is open in a tab.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="text-sm text-muted-foreground">
                            Status: <span className="font-medium text-foreground capitalize">{notificationPermission}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Button onClick={handleEnableNotifications} disabled={notificationPermission === 'granted'}>
                                {notificationPermission === 'granted' ? 'Enabled' : 'Enable notifications'}
                            </Button>
                            <Button variant="secondary" onClick={handleTestNotification} disabled={notificationPermission !== 'granted'}>
                                Send test notification
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Note: We only send browser notifications when the tab is hidden to avoid duplicate toasts.
                        </p>
                    </CardContent>
                </Card>

                {/* Stock Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Stock Notifications
                        </CardTitle>
                        <CardDescription>
                            Select items to be notified about when they are back in stock.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {alertsLoading ? (
                            <p>Loading items...</p>
                        ) : (
                            <>
                                <Alert variant="destructive" className="mb-4">
                                    <TriangleAlert className="h-4 w-4" />
                                    <AlertTitle>Under Development</AlertTitle>
                                    <AlertDescription>
                                        This feature is still a work in progress and may not work as expected.
                                        We appreciate your patience as we continue to improve it.
                                    </AlertDescription>
                                </Alert>
                                <ScrollArea className="h-72 w-full rounded-md border">
                                    <Accordion type="multiple" className="w-full">
                                        {Object.entries(
                                            allItems.reduce((acc, item) => {
                                                const type = item.type || 'Other';
                                                if (!acc[type]) {
                                                    acc[type] = [];
                                                }
                                                acc[type].push(item);
                                                return acc;
                                            }, {} as Record<string, AlertItem[]>)
                                        )
                                        .sort(([typeA], [typeB]) => typeA.localeCompare(typeB))
                                        .map(([type, items]) => (
                                            <AccordionItem value={type} key={type}>
                                                <AccordionTrigger className="px-4 py-2 text-sm font-medium capitalize">
                                                    {type.replace(/_/g, ' ')}
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-4 p-4 border-t">
                                                        {items
                                                            .sort((a, b) => a.display_name.localeCompare(b.display_name))
                                                            .map((item) => (
                                                            <div key={item.item_id} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={item.item_id}
                                                                    checked={selectedAlerts.has(item.item_id)}
                                                                    onCheckedChange={(checked) => handleAlertSelectionChange(item.item_id, !!checked)}
                                                                />
                                                                <label htmlFor={item.item_id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                    {item.display_name}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </ScrollArea>
                                <Button onClick={handleSaveChanges} disabled={alertsLoading} className="w-full mt-4">
                                    {alertsLoading ? "Saving..." : "Save Preferences"}
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <Trash2 className="h-5 w-5" />
                            Danger Zone
                        </CardTitle>
                        <CardDescription>
                            Permanently delete your account and all associated data
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full">Delete Account</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove all your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        disabled={deleteLoading}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        {deleteLoading ? "Deleting..." : "Yes, delete my account"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;