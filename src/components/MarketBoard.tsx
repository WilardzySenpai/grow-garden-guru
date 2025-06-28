
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface MarketItem {
  item_id: string;
  display_name: string;
  icon?: string;
  quantity: number;
  Date_Start?: string;
  Date_End?: string;
  start_date_unix?: number;
  end_date_unix?: number;
}

interface MarketBoardProps {
  onStatusChange: (status: 'connecting' | 'connected' | 'disconnected') => void;
  onNotifications: (notifications: any[]) => void;
}

export const MarketBoard = ({ onStatusChange, onNotifications }: MarketBoardProps) => {
  const [marketData, setMarketData] = useState<{
    seeds: MarketItem[];
    gear: MarketItem[];
    eggs: MarketItem[];
    cosmetics: MarketItem[];
    event_shop: MarketItem[];
  }>({
    seeds: [],
    gear: [],
    eggs: [],
    cosmetics: [],
    event_shop: []
  });
  
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    onStatusChange('connecting');
    
    // For demo purposes, simulate WebSocket connection
    // In production, you would connect to: wss://websocket.joshlei.com/growagarden?user_id=YOUR_DISCORD_ID
    setTimeout(() => {
      setIsConnected(true);
      onStatusChange('connected');
      
      // Simulate market data
      const mockData = {
        seeds: [
          {
            item_id: 'seed_001',
            display_name: 'Premium Sunflower Seeds',
            icon: '🌻',
            quantity: 50,
            Date_Start: new Date().toISOString(),
            Date_End: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            end_date_unix: Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000)
          },
          {
            item_id: 'seed_002',
            display_name: 'Sugar Apple Seeds',
            icon: '🍎',
            quantity: 25,
            Date_Start: new Date().toISOString(),
            Date_End: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
            end_date_unix: Math.floor((Date.now() + 12 * 60 * 60 * 1000) / 1000)
          }
        ],
        gear: [
          {
            item_id: 'gear_001',
            display_name: 'Golden Watering Can',
            icon: '🥤',
            quantity: 1,
            Date_Start: new Date().toISOString(),
            Date_End: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            end_date_unix: Math.floor((Date.now() + 48 * 60 * 60 * 1000) / 1000)
          }
        ],
        eggs: [
          {
            item_id: 'egg_001',
            display_name: 'Dragonfly Egg',
            icon: '🥚',
            quantity: 3,
            Date_Start: new Date().toISOString(),
            Date_End: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            end_date_unix: Math.floor((Date.now() + 6 * 60 * 60 * 1000) / 1000)
          }
        ],
        cosmetics: [],
        event_shop: [
          {
            item_id: 'event_001',
            display_name: 'Winter Festival Badge',
            icon: '❄️',
            quantity: 1,
            Date_Start: new Date().toISOString(),
            Date_End: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            end_date_unix: Math.floor((Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000)
          }
        ]
      };
      
      setMarketData(mockData);
      
      toast({
        title: "Market Board Connected",
        description: "Live market data is now streaming.",
      });
    }, 2000);
  };

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
        {items.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No items available</p>
        ) : (
          <div className="grid gap-3">
            {items.map((item) => (
              <div key={item.item_id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg border">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="font-medium">{item.display_name}</h4>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  {item.end_date_unix && (
                    <Badge variant="outline" className="mb-1">
                      {formatTimeRemaining(item.end_date_unix)}
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground">ID: {item.item_id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 Live Market Board
            {isConnected && <div className="w-2 h-2 bg-green-500 rounded-full pulse-glow" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="seeds">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="seeds">Seeds</TabsTrigger>
              <TabsTrigger value="gear">Gear</TabsTrigger>
              <TabsTrigger value="eggs">Eggs</TabsTrigger>
              <TabsTrigger value="cosmetics">Cosmetics</TabsTrigger>
              <TabsTrigger value="event">Event Shop</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="seeds">
                {renderMarketSection(marketData.seeds, 'Seeds')}
              </TabsContent>
              <TabsContent value="gear">
                {renderMarketSection(marketData.gear, 'Gear')}
              </TabsContent>
              <TabsContent value="eggs">
                {renderMarketSection(marketData.eggs, 'Eggs')}
              </TabsContent>
              <TabsContent value="cosmetics">
                {renderMarketSection(marketData.cosmetics, 'Cosmetics')}
              </TabsContent>
              <TabsContent value="event">
                {renderMarketSection(marketData.event_shop, 'Event Shop')}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
