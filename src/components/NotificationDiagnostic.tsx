import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, AlertTriangle, Bell, Database, Wifi } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DiagnosticResult {
    name: string;
    status: 'pass' | 'fail' | 'warning';
    details: string;
    fix?: string;
}

export const NotificationDiagnostic = () => {
    const { user } = useAuth();
    const [results, setResults] = useState<DiagnosticResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [stockAlerts, setStockAlerts] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);

    const runDiagnostics = async () => {
        if (!user || 'isGuest' in user) {
            toast({
                title: "Authentication Required",
                description: "Please log in to run diagnostics.",
                variant: "destructive"
            });
            return;
        }

        setIsRunning(true);
        const diagnosticResults: DiagnosticResult[] = [];

        try {
            // 1. Check if user can access user_stock_alerts table
            try {
                const { data: alerts, error: alertsError } = await supabase
                    .from('user_stock_alerts')
                    .select('*')
                    .eq('user_id', user.id);

                if (alertsError) {
                    diagnosticResults.push({
                        name: "Stock Alerts Table Access",
                        status: "fail",
                        details: `Cannot access stock alerts: ${alertsError.message}`,
                        fix: "Check RLS policies on user_stock_alerts table"
                    });
                } else {
                    setStockAlerts(alerts || []);
                    diagnosticResults.push({
                        name: "Stock Alerts Table Access",
                        status: "pass",
                        details: `Found ${alerts?.length || 0} stock alerts configured`
                    });
                }
            } catch (err) {
                diagnosticResults.push({
                    name: "Stock Alerts Table Access",
                    status: "fail",
                    details: `Error accessing stock alerts table: ${err}`,
                    fix: "Check table exists and RLS policies are correct"
                });
            }

            // 2. Check notifications table access
            try {
                const { data: notifs, error: notifsError } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (notifsError) {
                    diagnosticResults.push({
                        name: "Notifications Table Access",
                        status: "fail",
                        details: `Cannot access notifications: ${notifsError.message}`,
                        fix: "Check RLS policies on notifications table"
                    });
                } else {
                    setNotifications(notifs || []);
                    diagnosticResults.push({
                        name: "Notifications Table Access",
                        status: "pass",
                        details: `Found ${notifs?.length || 0} recent notifications`
                    });
                }
            } catch (err) {
                diagnosticResults.push({
                    name: "Notifications Table Access",
                    status: "fail",
                    details: `Error accessing notifications table: ${err}`,
                    fix: "Check table exists and RLS policies are correct"
                });
            }

            // 3. Check if stock data is being fetched
            try {
                const response = await fetch('https://api.joshlei.com/v2/growagarden/stock', {
                    headers: {
                        'Jstudio-key': import.meta.env.VITE_JSTUDIO_KEY,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    diagnosticResults.push({
                        name: "Stock API Access",
                        status: "fail",
                        details: `Stock API returned ${response.status}: ${response.statusText}`,
                        fix: "Check API key and endpoint availability"
                    });
                } else {
                    const data = await response.json();
                    const totalItems = (data.seed_stock?.length || 0) +
                        (data.gear_stock?.length || 0) +
                        (data.egg_stock?.length || 0);

                    diagnosticResults.push({
                        name: "Stock API Access",
                        status: "pass",
                        details: `Stock API working, found ${totalItems} items total`
                    });
                }
            } catch (err) {
                diagnosticResults.push({
                    name: "Stock API Access",
                    status: "fail",
                    details: `Cannot reach stock API: ${err}`,
                    fix: "Check network connection and API key"
                });
            }

            // 4. Test notification creation
            try {
                const testNotification = {
                    user_id: user.id,
                    message: "🎉 Test notification - Stock alert system is working!",
                    item_id: "test_item",
                    icon: "test"
                };

                const { error: insertError } = await supabase
                    .from('notifications')
                    .insert(testNotification);

                if (insertError) {
                    diagnosticResults.push({
                        name: "Notification Creation Test",
                        status: "fail",
                        details: `Cannot create notifications: ${insertError.message}`,
                        fix: "Check INSERT permissions on notifications table"
                    });
                } else {
                    diagnosticResults.push({
                        name: "Notification Creation Test",
                        status: "pass",
                        details: "✅ Successfully created test notification! Stock alerts will work."
                    });

                    // Clean up the test notification after a short delay
                    setTimeout(async () => {
                        await supabase
                            .from('notifications')
                            .delete()
                            .eq('user_id', user.id)
                            .eq('item_id', 'test_item');
                    }, 3000);
                }
            } catch (err) {
                diagnosticResults.push({
                    name: "Notification Creation Test",
                    status: "fail",
                    details: `Error creating test notification: ${err}`,
                    fix: "Check database connection and permissions"
                });
            }

            // 5. Check webhook/realtime connection
            try {
                const channel = supabase
                    .channel('diagnostic-test')
                    .on('postgres_changes', {
                        event: '*',
                        schema: 'public',
                        table: 'notifications'
                    }, () => {
                        // Test handler
                    })
                    .subscribe();

                setTimeout(() => {
                    const channelState = channel.state;
                    if (channelState === 'joined') {
                        diagnosticResults.push({
                            name: "Realtime Connection",
                            status: "pass",
                            details: "Realtime connection established successfully"
                        });
                    } else {
                        diagnosticResults.push({
                            name: "Realtime Connection",
                            status: "warning",
                            details: `Realtime connection state: ${channelState}`,
                            fix: "Check network connection and Supabase realtime settings"
                        });
                    }
                    supabase.removeChannel(channel);
                    setResults([...diagnosticResults]);
                }, 2000);
            } catch (err) {
                diagnosticResults.push({
                    name: "Realtime Connection",
                    status: "fail",
                    details: `Realtime connection failed: ${err}`,
                    fix: "Check Supabase realtime configuration"
                });
            }

        } catch (error) {
            console.error('Diagnostic error:', error);
        } finally {
            setIsRunning(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pass': return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'fail': return <XCircle className="h-5 w-5 text-red-500" />;
            case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            default: return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pass': return 'border-green-500/20 bg-green-500/10';
            case 'fail': return 'border-red-500/20 bg-red-500/10';
            case 'warning': return 'border-yellow-500/20 bg-yellow-500/10';
            default: return '';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Stock Notification System Diagnostic
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-4">
                    <Button
                        onClick={runDiagnostics}
                        disabled={isRunning || !user || 'isGuest' in user}
                        className="flex items-center gap-2"
                    >
                        {isRunning ? 'Running...' : 'Run Diagnostics'}
                        <Database className="h-4 w-4" />
                    </Button>
                </div>

                {/* Current Status Overview */}
                {(stockAlerts.length > 0 || notifications.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Stock Alerts Configured</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stockAlerts.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    Items you'll be notified about
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Recent Notifications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{notifications.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    Notifications received
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Diagnostic Results */}
                {results.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-semibold">Diagnostic Results:</h3>
                        {results.map((result, index) => (
                            <div key={index} className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    {getStatusIcon(result.status)}
                                    <h4 className="font-medium">{result.name}</h4>
                                    <Badge variant={result.status === 'pass' ? 'default' : result.status === 'fail' ? 'destructive' : 'secondary'}>
                                        {result.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">{result.details}</p>
                                {result.fix && (
                                    <Alert className="mt-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription className="text-xs">
                                            <strong>Fix:</strong> {result.fix}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* How It Works Documentation */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">How Stock Notifications Work</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="space-y-2">
                            <h4 className="font-semibold">1. Stock Alert Setup</h4>
                            <p>• Go to Profile → Stock Alert Preferences</p>
                            <p>• Select items you want to be notified about</p>
                            <p>• Alerts are saved to the `user_stock_alerts` table</p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-semibold">2. Stock Monitoring</h4>
                            <p>• useStockData hook fetches stock data every few seconds</p>
                            <p>• Compares current stock levels with previous levels</p>
                            <p>• Triggers when item goes from 0 → available quantity</p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-semibold">3. Notification Delivery</h4>
                            <p>• Toast notification appears immediately</p>
                            <p>• Persistent notification saved to database</p>
                            <p>• Appears in the Live Notification Feed</p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-semibold">4. Real-time Updates</h4>
                            <p>• Supabase realtime updates the notification feed</p>
                            <p>• WebSocket connection for instant updates</p>
                            <p>• Jandel messages also appear in the feed</p>
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};