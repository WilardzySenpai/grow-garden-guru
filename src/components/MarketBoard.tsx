import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import type { MarketItem, StockData } from '@/types/api';

interface MarketBoardProps {
    marketData?: any;
    loading: boolean;
    error: string | null;
    onRefetch: () => void;
}

export const MarketBoard = ({ marketData, loading, error, onRefetch }: MarketBoardProps) => {
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState('seeds');

    // Remove internal loading/error state since it's now passed from parent
    // Update loading state when data is received
    useEffect(() => {
        if (marketData) {
            console.log('MarketBoard: Received market data from API:', marketData);
        }
    }, [marketData]);

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
                        <div className="flex justify-center mt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onRefetch}
                                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                            >
                                Retry
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        📈 Market Board
                        <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 pulse-glow' : error ? 'bg-red-500' : 'bg-green-500 pulse-glow'}`} />
                        {loading && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onRefetch}
                                className="ml-auto"
                            >
                                Refresh
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        {isMobile ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full">
                                        <Menu className="h-4 w-4 mr-2" />
                                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-full">
                                    <DropdownMenuItem onSelect={() => setActiveTab('seeds')}>Seeds</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setActiveTab('gear')}>Gear</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setActiveTab('eggs')}>Eggs</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setActiveTab('cosmetics')}>Cosmetics</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setActiveTab('event')}>Event Shop</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setActiveTab('merchant')}>Merchant</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <TabsList className="grid w-full grid-cols-6">
                                <TabsTrigger value="seeds">Seeds</TabsTrigger>
                                <TabsTrigger value="gear">Gear</TabsTrigger>
                                <TabsTrigger value="eggs">Eggs</TabsTrigger>
                                <TabsTrigger value="cosmetics">Cosmetics</TabsTrigger>
                                <TabsTrigger value="event">Event Shop</TabsTrigger>
                                <TabsTrigger value="merchant">Merchant</TabsTrigger>
                            </TabsList>
                        )}

                        <div className="mt-6">
                            <TabsContent value="seeds">
                                {renderMarketSection(marketData?.seed_stock || [], 'Seeds')}
                            </TabsContent>
                            <TabsContent value="gear">
                                {renderMarketSection(marketData?.gear_stock || [], 'Gear')}
                            </TabsContent>
                            <TabsContent value="eggs">
                                {renderMarketSection(marketData?.egg_stock || [], 'Eggs')}
                            </TabsContent>
                            <TabsContent value="cosmetics">
                                {renderMarketSection(marketData?.cosmetic_stock || [], 'Cosmetics')}
                            </TabsContent>
                            <TabsContent value="event">
                                {renderMarketSection(marketData?.eventshop_stock || [], 'Event Shop')}
                            </TabsContent>
                            <TabsContent value="merchant">
                                {renderMarketSection(marketData?.travelingmerchant_stock || [], 'Traveling Merchant')}
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};