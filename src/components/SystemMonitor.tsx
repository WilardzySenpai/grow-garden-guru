
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SystemMonitorProps {
    wsStatus: 'connecting' | 'connected' | 'disconnected';
}

export const SystemMonitor = ({ wsStatus }: SystemMonitorProps) => {
    const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
    const [lastApiCheck, setLastApiCheck] = useState<Date | null>(null);

    useEffect(() => {
        const checkApiHealth = async () => {
            try {
                setApiStatus('checking');
                // const response = await fetch('https://api.joshlei.com/v2/growagarden/info/', {
                //     headers: {
                //         'Jstudio-key': 'jstudio'
                //     }
                // });
                const response = await fetch('https://api.joshlei.com/v2/growagarden/calculate');
                if (response.ok) {
                    setApiStatus('online');
                    setLastApiCheck(new Date());
                } else {
                    setApiStatus('offline');
                }
            } catch (error) {
                console.error('API health check failed:', error);
                setApiStatus('offline');
            }
        };

        // Initial check
        checkApiHealth();

        // Check API health every 2 minutes
        const interval = setInterval(checkApiHealth, 120000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected':
            case 'online': return 'default';
            case 'connecting':
            case 'checking': return 'secondary';
            case 'disconnected':
            case 'offline': return 'destructive';
            default: return 'secondary';
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Connection Status */}
            <Card>
                <CardHeader>
                    <CardTitle>⚙️ System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span>API Connection</span>
                        <Badge variant={getStatusColor(apiStatus)}>
                            {apiStatus === 'checking' ? 'Checking...' : apiStatus.charAt(0).toUpperCase() + apiStatus.slice(1)}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span>Data Source</span>
                        <Badge variant="default">REST API</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <span>Last Health Check</span>
                        <span className="text-sm text-muted-foreground">
                            {lastApiCheck ? lastApiCheck.toLocaleTimeString() : 'Never'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span>WebSocket (Disabled)</span>
                        <Badge variant="secondary">Offline</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* API Endpoints */}
            <Card>
                <CardHeader>
                    <CardTitle>🔗 API Endpoints</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Market Data</span>
                            <Badge variant={getStatusColor(apiStatus)} className="text-xs">
                                {apiStatus === 'online' ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                            /v2/growagarden/stock
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Weather Data</span>
                            <Badge variant={getStatusColor(apiStatus)} className="text-xs">
                                {apiStatus === 'online' ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                            /v2/growagarden/weather
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Info Endpoint</span>
                            <Badge variant={getStatusColor(apiStatus)} className="text-xs">
                                {apiStatus === 'online' ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                            /v2/growagarden/info
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* API Health */}
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>🏥 API Health Monitor</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {apiStatus === 'online' ? '✓' : '✗'}
                            </div>
                            <div className="text-sm text-muted-foreground">API Reachable</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                REST
                            </div>
                            <div className="text-sm text-muted-foreground">Connection Type</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                30s
                            </div>
                            <div className="text-sm text-muted-foreground">Refresh Rate</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {apiStatus === 'online' ? 'Stable' : 'Issues'}
                            </div>
                            <div className="text-sm text-muted-foreground">Status</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
