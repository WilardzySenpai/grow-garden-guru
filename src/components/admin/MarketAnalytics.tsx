import {
    ArrowLeft,
    BarChart3,
    Package,
    Clock,
    Tags,
    Layers,
    ShoppingCart,
    TrendingUp,
    AlertCircle,
    BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface CategoryBreakdown {
    Seeds: number;
    Gear: number;
    Eggs: number;
    Cosmetics: number;
    'Event Shop': number;
    'Traveling Merchant': number;
}

interface StockLevels {
    low: number;
    medium: number;
    high: number;
}

interface MarketAnalyticsProps {
    onBack: () => void;
    marketAnalytics: {
        totalItems: number;
        activeItems: number;
        expiredItems: number;
        categoryBreakdown: CategoryBreakdown;
        averageItemLife: string;
        topCategories: Array<{
            name: string;
            count: number;
        }>;
        timeToExpiration: Array<{
            name: string;
            timeLeft: number;
        }>;
        stockLevels: StockLevels;
    };
    loading: boolean;
    fetchMarketAnalytics: () => Promise<void>;
}

export const MarketAnalytics = ({
    onBack,
    marketAnalytics,
    loading,
    fetchMarketAnalytics
}: MarketAnalyticsProps) => {
    useEffect(() => {
        fetchMarketAnalytics();
    }, [fetchMarketAnalytics]);

    const getStockLevelColor = (level: string) => {
        switch (level) {
            case 'low':
                return 'text-red-500';
            case 'medium':
                return 'text-yellow-500';
            case 'high':
                return 'text-green-500';
            default:
                return 'text-muted-foreground';
        }
    };

    const formatTimeLeft = (hours: number) => {
        if (hours < 24) {
            return `${hours}h`;
        }
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        return `${days}d ${remainingHours}h`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
            <header className="border-b border-border bg-card/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                onClick={onBack}
                                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </div>
                        <Badge variant="secondary" className="flex items-center gap-2">
                            <BarChart3 className="h-3 w-3" />
                            Market Analytics
                        </Badge>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Total Items */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Items
                                </CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? "..." : marketAnalytics.totalItems}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    In market inventory
                                </p>
                            </CardContent>
                        </Card>

                        {/* Active Items */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Active Items
                                </CardTitle>
                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? "..." : marketAnalytics.activeItems}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Currently available
                                </p>
                            </CardContent>
                        </Card>

                        {/* Average Item Life */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Avg Item Life
                                </CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? "..." : marketAnalytics.averageItemLife}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Average listing duration
                                </p>
                            </CardContent>
                        </Card>

                        {/* Expired Items */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Expired Items
                                </CardTitle>
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {loading ? "..." : marketAnalytics.expiredItems}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    No longer available
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Category Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Category Breakdown</CardTitle>
                                <CardDescription>Distribution of items by category</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {loading ? (
                                        <div className="text-center text-muted-foreground">Loading...</div>
                                    ) : (
                                        Object.entries(marketAnalytics.categoryBreakdown).map(([category, count]) => (
                                            <div key={category} className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium">{category}</p>
                                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary"
                                                            style={{
                                                                width: `${(count / marketAnalytics.totalItems) * 100}%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-sm font-medium">{count}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stock Levels */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Stock Levels</CardTitle>
                                <CardDescription>Inventory status breakdown</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Low Stock</p>
                                        <span className={`text-sm font-medium ${getStockLevelColor('low')}`}>
                                            {loading ? "..." : marketAnalytics.stockLevels.low} items
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Medium Stock</p>
                                        <span className={`text-sm font-medium ${getStockLevelColor('medium')}`}>
                                            {loading ? "..." : marketAnalytics.stockLevels.medium} items
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">High Stock</p>
                                        <span className={`text-sm font-medium ${getStockLevelColor('high')}`}>
                                            {loading ? "..." : marketAnalytics.stockLevels.high} items
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Expiring Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Items Expiring Soon</CardTitle>
                            <CardDescription>Items that will be removed from the market soon</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item Name</TableHead>
                                            <TableHead className="text-right">Time Left</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={2} className="text-center">Loading...</TableCell>
                                            </TableRow>
                                        ) : (
                                            marketAnalytics.timeToExpiration.map((item) => (
                                                <TableRow key={item.name}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell className="text-right">
                                                        <span className={item.timeLeft <= 24 ? 'text-red-500' : 'text-muted-foreground'}>
                                                            {formatTimeLeft(item.timeLeft)}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Refresh Button */}
                    <div className="flex justify-end">
                        <Button
                            onClick={() => fetchMarketAnalytics()}
                            disabled={loading}
                            className="flex items-center gap-2"
                        >
                            {loading ? "Refreshing..." : "Refresh Market Data"}
                            <BarChart2 className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
