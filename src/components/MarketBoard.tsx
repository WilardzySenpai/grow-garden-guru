import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import type { MarketItem, StockData } from '@/types/api';

interface MarketBoardProps {
    onStatusChange: (status: 'connecting' | 'connected' | 'disconnected') => void;
    onNotifications: (notifications: any[]) => void;
    onWeatherData: (weatherData: any) => void;
}

export const MarketBoard = ({ onStatusChange, onNotifications, onWeatherData }: MarketBoardProps) => {
    const { user } = useAuth();
    const wsRef = useRef<WebSocket | null>(null);
    const [marketData, setMarketData] = useState<StockData>({
        seed_stock: [],
        gear_stock: [],
        egg_stock: [],
        cosmetic_stock: [],
        eventshop_stock: [],
        travelingmerchant_stock: [],
        notifications: [],
        discord_invite: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get user ID for websocket connection
    const getUserId = () => {
        if (!user) return null;
        
        // For authenticated users, use their actual user ID
        if (!('isGuest' in user)) {
            return user.id;
        }
        
        // For guest users, use the guest ID
        return user.id;
    };

    // WebSocket connection
    useEffect(() => {
        const userId = getUserId();
        if (!userId) {
            console.log('MarketBoard: No user ID available, skipping websocket connection');
            return;
        }

        console.log('MarketBoard: Connecting to websocket with user ID:', userId);
        
        const connectWebSocket = () => {
            try {
                onStatusChange('connecting');
                const ws = new WebSocket(`wss://websocket.joshlei.com/growagarden?user_id=${encodeURIComponent(userId)}`);
                wsRef.current = ws;

                ws.onopen = () => {
                    console.log('MarketBoard: WebSocket connection established');
                    onStatusChange('connected');
                    toast({
                        title: "Connected",
                        description: "Real-time market updates enabled!",
                    });
                };

                ws.onmessage = (event) => {
                    try {
                        console.log('MarketBoard: Message from websocket:', event.data);
                        const data = JSON.parse(event.data);
                        
                        // Update market data with real-time info
                        setMarketData(data);
                        onNotifications(data.notifications || []);
                        
                        // Pass weather data if available
                        if (data.weather) {
                            onWeatherData(data.weather);
                        }
                        
                        setLoading(false);
                        setError(null);
                        
                        toast({
                            title: "Live Update",
                            description: "Market and weather data refreshed!",
                        });
                    } catch (error) {
                        console.error('MarketBoard: Error parsing websocket message:', error);
                        setError('Error processing live data');
                    }
                };

                ws.onerror = (error) => {
                    console.error('MarketBoard: WebSocket error:', error);
                    onStatusChange('disconnected');
                    setError('WebSocket connection error');
                };

                ws.onclose = () => {
                    console.log('MarketBoard: WebSocket connection closed');
                    onStatusChange('disconnected');
                    
                    // Attempt to reconnect after 5 seconds
                    setTimeout(() => {
                        if (wsRef.current?.readyState === WebSocket.CLOSED) {
                            console.log('MarketBoard: Attempting to reconnect websocket...');
                            connectWebSocket();
                        }
                    }, 5000);
                };

            } catch (error) {
                console.error('MarketBoard: Failed to create websocket connection:', error);
                onStatusChange('disconnected');
                setError('Failed to connect to real-time updates');
            }
        };

        connectWebSocket();

        return () => {
            if (wsRef.current) {
                console.log('MarketBoard: Closing websocket connection');
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [user, onStatusChange, onNotifications]);

    const formatTimeRemaining = (endUnix: number) => {
        const now = Math.floor(Date.now() / 1000);
        const remaining = endUnix - now;

        if (remaining <= 0) return 'Expired';

        const days = Math.floor(remaining / (24 * 60 * 60));
        const hours = Math.floor((remaining % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((remaining % (60 * 60)) / 60);

        if (days > 0) return `${days}d ${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const renderMarketSection = (items: MarketItem[], title: string) => (
        <Card className="market-card">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    {title}
                    <Badge variant="secondary">{items.length} items</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="grid gap-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-8 h-8" />
                                    <div>
                                        <Skeleton className="h-4 w-24 mb-1" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Skeleton className="h-5 w-16 mb-1" />
                                    <Skeleton className="h-3 w-12" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                        No items available
                    </p>
                ) : (
                    <div className="grid gap-3">
                        {items.map((item, index) => (
                            <div key={`${item.item_id}-${index}`} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={item.icon}
                                        alt={item.display_name}
                                        className="w-8 h-8 object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                    <div>
                                        <h4 className="font-medium">{item.display_name}</h4>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className="mb-1">
                                        {formatTimeRemaining(item.end_date_unix)}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground">ID: {item.item_id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            📈 Market Board
                            <div className="w-2 h-2 bg-yellow-500 rounded-full pulse-glow" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <div className="grid gap-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="w-8 h-8" />
                                            <div>
                                                <Skeleton className="h-4 w-32 mb-1" />
                                                <Skeleton className="h-3 w-20" />
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Skeleton className="h-5 w-20 mb-1" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <Card className="border-red-500/50 bg-red-500/10">
                    <CardContent className="py-4">
                        <p className="text-center text-red-600 text-sm">
                            ❌ {error}
                        </p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        📈 Market Board
                        <div className="w-2 h-2 bg-green-500 rounded-full pulse-glow" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="seeds">
                        <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="seeds">Seeds</TabsTrigger>
                            <TabsTrigger value="gear">Gear</TabsTrigger>
                            <TabsTrigger value="eggs">Eggs</TabsTrigger>
                            <TabsTrigger value="cosmetics">Cosmetics</TabsTrigger>
                            <TabsTrigger value="event">Event Shop</TabsTrigger>
                            <TabsTrigger value="merchant">Merchant</TabsTrigger>
                        </TabsList>

                        <div className="mt-6">
                            <TabsContent value="seeds">
                                {renderMarketSection(marketData.seed_stock || [], 'Seeds')}
                            </TabsContent>
                            <TabsContent value="gear">
                                {renderMarketSection(marketData.gear_stock || [], 'Gear')}
                            </TabsContent>
                            <TabsContent value="eggs">
                                {renderMarketSection(marketData.egg_stock || [], 'Eggs')}
                            </TabsContent>
                            <TabsContent value="cosmetics">
                                {renderMarketSection(marketData.cosmetic_stock || [], 'Cosmetics')}
                            </TabsContent>
                            <TabsContent value="event">
                                {renderMarketSection(marketData.eventshop_stock || [], 'Event Shop')}
                            </TabsContent>
                            <TabsContent value="merchant">
                                {renderMarketSection(marketData.travelingmerchant_stock || [], 'Traveling Merchant')}
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};
