import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Leaf, ArrowLeft, User, Trash2, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useStockData } from '@/hooks/useStockData';
import { toast } from '@/hooks/use-toast';
import { maskEmail } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import type { MarketItem } from '@/types/api';

const Profile = () => {
    const [displayName, setDisplayName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const { marketData } = useStockData(user?.id ?? null);
    const [allItems, setAllItems] = useState<MarketItem[]>([]);
    const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
    const [alertsLoading, setAlertsLoading] = useState(false);

    // Redirect if not logged in or if guest
    useEffect(() => {
        if (!user || ('isGuest' in user)) {
            navigate('/auth');
        }
    }, [user, navigate]);

    // Memoize and flatten all available items from market data
    useEffect(() => {
        if (marketData) {
            const all = [
                ...marketData.seed_stock,
                ...marketData.gear_stock,
                ...marketData.egg_stock,
                ...marketData.cosmetic_stock,
                ...marketData.eventshop_stock,
                ...marketData.travelingmerchant_stock,
            ];
            // Deduplicate items based on item_id
            const uniqueItems = Array.from(new Map(all.map(item => [item.item_id, item])).values());
            setAllItems(uniqueItems);
        }
    }, [marketData]);

    // Load user profile and stock alert preferences
    useEffect(() => {
        const loadUserData = async () => {
            if (user && !('isGuest' in user)) {
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

                // Load stock alerts
                setAlertsLoading(true);
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

        loadUserData();
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
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
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

        } catch (error: any) {
            toast({
                title: "Error",
                description: `Failed to save preferences: ${error.message}`,
                variant: "destructive",
            });
        } finally {
            setAlertsLoading(false);
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
        } catch (error: any) {
            toast({
                title: "Error",
                description: `Failed to delete account: ${error.message}`,
                variant: "destructive",
            });
        } finally {
            setDeleteLoading(false);
        }
    };

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
                                <ScrollArea className="h-72 w-full rounded-md border p-4">
                                    <div className="space-y-4">
                                        {allItems.map((item) => (
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