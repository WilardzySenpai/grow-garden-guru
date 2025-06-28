
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SystemMonitorProps {
  wsStatus: 'connecting' | 'connected' | 'disconnected';
}

export const SystemMonitor = ({ wsStatus }: SystemMonitorProps) => {
  const [rateLimits, setRateLimits] = useState({
    remainingIp: 10000,
    remainingGlobal: 100000,
    limitIp: 10000,
    limitGlobal: 100000
  });

  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [lastApiCall, setLastApiCall] = useState<Date | null>(null);

  // Monitor API calls and update rate limits
  useEffect(() => {
    const checkRateLimits = async () => {
      try {
        const response = await fetch('https://api.joshlei.com/v2/growagarden/stock', {
          method: 'HEAD' // Use HEAD to check headers without downloading content
        });
        
        // Update rate limits from headers
        const remainingGlobal = response.headers.get('Ratelimit-Remaining-Global');
        const remainingIp = response.headers.get('Ratelimit-Remaining-Ip');
        const limitGlobal = response.headers.get('Request-Limit-Global');
        const limitIp = response.headers.get('Request-Limit-Ip');
        const retryAfterHeader = response.headers.get('Retry-After');
        
        if (remainingGlobal || remainingIp) {
          setRateLimits({
            remainingIp: remainingIp ? parseInt(remainingIp) : rateLimits.remainingIp,
            remainingGlobal: remainingGlobal ? parseInt(remainingGlobal) : rateLimits.remainingGlobal,
            limitIp: limitIp ? parseInt(limitIp) : 10000,
            limitGlobal: limitGlobal ? parseInt(limitGlobal) : 100000
          });
        }
        
        if (retryAfterHeader) {
          setRetryAfter(parseInt(retryAfterHeader));
        }
        
        setLastApiCall(new Date());
        
        if (response.status === 429) {
          console.warn('Rate limit exceeded');
        }
      } catch (error) {
        console.error('Failed to check rate limits:', error);
      }
    };

    // Check rate limits every 30 seconds
    const interval = setInterval(checkRateLimits, 30000);
    checkRateLimits(); // Initial check

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    
    if (retryAfter && retryAfter > 0) {
      countdownInterval = setInterval(() => {
        setRetryAfter(prev => prev ? Math.max(0, prev - 1) : 0);
      }, 1000);
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [retryAfter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'default';
      case 'connecting': return 'secondary';
      case 'disconnected': return 'destructive';
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
            <span>WebSocket Connection</span>
            <Badge variant={getStatusColor(wsStatus)}>
              {wsStatus.charAt(0).toUpperCase() + wsStatus.slice(1)}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>API Status</span>
            <Badge variant="default">Operational</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Last API Check</span>
            <span className="text-sm text-muted-foreground">
              {lastApiCall ? lastApiCall.toLocaleTimeString() : 'Never'}
            </span>
          </div>

          {retryAfter && retryAfter > 0 && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="text-sm font-medium text-destructive">
                Rate Limited
              </div>
              <div className="text-sm text-muted-foreground">
                Retry in {retryAfter} seconds
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rate Limits */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Rate Limits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>IP Rate Limit</span>
              <span>{rateLimits.remainingIp.toLocaleString()}/{rateLimits.limitIp.toLocaleString()}</span>
            </div>
            <Progress value={(rateLimits.remainingIp / rateLimits.limitIp) * 100} />
            <div className="text-xs text-muted-foreground mt-1">
              Resets every 10 minutes
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Global Rate Limit</span>
              <span>{rateLimits.remainingGlobal.toLocaleString()}/{rateLimits.limitGlobal.toLocaleString()}</span>
            </div>
            <Progress value={(rateLimits.remainingGlobal / rateLimits.limitGlobal) * 100} />
            <div className="text-xs text-muted-foreground mt-1">
              Resets every hour
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
                {wsStatus === 'connected' ? '100%' : '0%'}
              </div>
              <div className="text-sm text-muted-foreground">WebSocket Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {lastApiCall ? '✓' : '✗'}
              </div>
              <div className="text-sm text-muted-foreground">API Reachable</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((rateLimits.remainingIp / rateLimits.limitIp) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">IP Quota Left</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round((rateLimits.remainingGlobal / rateLimits.limitGlobal) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Global Quota Left</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
