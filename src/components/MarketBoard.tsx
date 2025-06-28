
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface MarketItem {
  item_id: string;
  display_name: string;
  icon: string;
  quantity: number;
  Date_Start: string;
  Date_End: string;
  start_date_unix: number;
  end_date_unix: number;
}

interface MarketData {
  seed_stock: MarketItem[];
  gear_stock: MarketItem[];
  egg_stock: MarketItem[];
  cosmetic_stock: MarketItem[];
  eventshop_stock: MarketItem[];
  notification: any[];
}

interface MarketBoardProps {
  onStatusChange: (status: 'connecting' | 'connected' | 'disconnected') => void;
  onNotifications: (notifications: any[]) => void;
}

export const MarketBoard = ({ onStatusChange, onNotifications }: MarketBoardProps) => {
  const [marketData, setMarketData] = useState<MarketData>({
    seed_stock: [],
    gear_stock: [],
    egg_stock: [],
    cosmetic_stock: [],
    eventshop_stock: [],
    notification: []
  });
  
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Load initial data from API
    loadInitialData();
    
    // Connect to WebSocket for real-time updates
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const loadInitialData = async () => {
    try {
      const response = await fetch('https://api.joshlei.com/v2/growagarden/stock');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMarketData(data);
      onNotifications(data.notification || []);
    } catch (error) {
      console.error('Failed to load initial market data:', error);
      toast({
        title: "Error Loading Market Data",
        description: "Failed to fetch initial market data. Trying WebSocket connection...",
        variant: "destructive"
      });
    }
  };

  const connectWebSocket = () => {
    onStatusChange('connecting');
    
    // Note: You'll need to replace 'YOUR_DISCORD_ID' with actual Discord user ID
    const userId = 'YOUR_DISCORD_ID'; // This should be configurable
    const wsUrl = `wss://websocket.joshlei.com/growagarden?user_id=${encodeURIComponent(userId)}`;
    
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      console.log('WebSocket connection established.');
      setIsConnected(true);
      onStatusChange('connected');
      
      toast({
        title: "Market Board Connected",
        description: "Live market data is now streaming.",
      });
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        setMarketData(data);
        onNotifications(data.notification || []);
        
        // Show toast for significant market changes
        if (data.seed_stock?.length > 0 || data.gear_stock?.length > 0) {
          toast({
            title: "Market Updated",
            description: "New items available in the market!",
          });
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      onStatusChange('disconnected');
      toast({
        title: "Connection Error",
        description: "WebSocket connection failed. Retrying...",
        variant: "destructive"
      });
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket connection closed.');
      setIsConnected(false);
      onStatusChange('disconnected');
      
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (!isConnected) {
          connectWebSocket();
        }
      }, 5000);
    };
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
                {renderMarketSection(marketData.seed_stock, 'Seeds')}
              </TabsContent>
              <TabsContent value="gear">
                {renderMarketSection(marketData.gear_stock, 'Gear')}
              </TabsContent>
              <TabsContent value="eggs">
                {renderMarketSection(marketData.egg_stock, 'Eggs')}
              </TabsContent>
              <TabsContent value="cosmetics">
                {renderMarketSection(marketData.cosmetic_stock, 'Cosmetics')}
              </TabsContent>
              <TabsContent value="event">
                {renderMarketSection(marketData.eventshop_stock, 'Event Shop')}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
