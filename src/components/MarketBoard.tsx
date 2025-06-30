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
  const [error, setError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Generate a unique session ID for this browser session
  const sessionIdRef = useRef<string>(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  });

  useEffect(() => {
    console.log('MarketBoard: Component mounted, connecting WebSocket');
    connectWebSocket();
    
    // Cleanup function to close WebSocket when component unmounts
    return () => {
      console.log('MarketBoard: Component unmounting, closing WebSocket');
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting'); // Normal closure
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array to run only once

  const connectWebSocket = () => {
    // Clear any existing reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    // Close existing connection if it exists
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      console.log('MarketBoard: Closing existing WebSocket connection');
      wsRef.current.close(1000, 'Creating new connection');
    }

    onStatusChange('connecting');
    setError(null);
    
    // Use unique session ID instead of demo_user
    const userId = sessionIdRef.current;
    const wsUrl = `wss://websocket.joshlei.com/growagarden?user_id=${encodeURIComponent(userId)}`;
    
    console.log('MarketBoard: Connecting to WebSocket with user ID:', userId);
    
    try {
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('MarketBoard: WebSocket connection established');
        setIsConnected(true);
        onStatusChange('connected');
        reconnectAttemptsRef.current = 0;
        
        toast({
          title: "Market Board Connected",
          description: "Live market data is now streaming.",
        });
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('MarketBoard: WebSocket message received');
          
          setMarketData(data);
          onNotifications(data.notification || []);
          
          if (data.seed_stock?.length > 0 || data.gear_stock?.length > 0) {
            toast({
              title: "Market Updated",
              description: "New items available in the market!",
            });
          }
        } catch (error) {
          console.error('MarketBoard: Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('MarketBoard: WebSocket error:', error);
        setError('WebSocket connection failed');
        onStatusChange('disconnected');
      };

      wsRef.current.onclose = (event) => {
        console.log('MarketBoard: WebSocket connection closed', event.code, event.reason);
        setIsConnected(false);
        onStatusChange('disconnected');
        
        // Handle different close codes
        if (event.code === 4001) {
          setError('Another connection was established. Using single connection mode.');
          // Don't reconnect automatically for 4001 - this is expected behavior
          return;
        }
        
        // Only attempt to reconnect for unexpected closures
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          reconnectAttemptsRef.current++;
          
          setError(`Connection lost. Reconnecting in ${delay/1000}s... (Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isConnected) {
              connectWebSocket();
            }
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError('Maximum reconnection attempts reached. Please refresh the page.');
          toast({
            title: "Connection Failed",
            description: "Unable to maintain WebSocket connection. Please refresh the page.",
            variant: "destructive"
          });
        }
      };
    } catch (error) {
      console.error('MarketBoard: Failed to create WebSocket connection:', error);
      setError('Failed to create WebSocket connection');
      onStatusChange('disconnected');
    }
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
          <p className="text-muted-foreground text-center py-8">
            {error ? 'Waiting for connection...' : 'No items available'}
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

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="py-4">
            <p className="text-center text-yellow-600 text-sm">
              ⚠️ {error}
            </p>
          </CardContent>
        </Card>
      )}

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
