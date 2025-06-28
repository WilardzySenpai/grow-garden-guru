
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SystemMonitorProps {
  wsStatus: 'connecting' | 'connected' | 'disconnected';
}

export const SystemMonitor = ({ wsStatus }: SystemMonitorProps) => {
  const [rateLimits, setRateLimits] = useState({
    remainingIp: 95,
    remainingGlobal: 180,
    limitIp: 100,
    limitGlobal: 200
  });

  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  useEffect(() => {
    // Simulate rate limit updates
    const interval = setInterval(() => {
      setRateLimits(prev => ({
        ...prev,
        remainingIp: Math.max(0, prev.remainingIp - Math.random() * 2),
        remainingGlobal: Math.max(0, prev.remainingGlobal - Math.random() * 3)
      }));
    }, 5000);

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
            <span>Last Update</span>
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleTimeString()}
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
              <span>{Math.round(rateLimits.remainingIp)}/{rateLimits.limitIp}</span>
            </div>
            <Progress value={(rateLimits.remainingIp / rateLimits.limitIp) * 100} />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Global Rate Limit</span>
              <span>{Math.round(rateLimits.remainingGlobal)}/{rateLimits.limitGlobal}</span>
            </div>
            <Progress value={(rateLimits.remainingGlobal / rateLimits.limitGlobal) * 100} />
          </div>

          <div className="text-xs text-muted-foreground">
            Limits reset every hour
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
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">45ms</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">1.2K</div>
              <div className="text-sm text-muted-foreground">Requests/min</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
