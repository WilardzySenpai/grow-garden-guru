
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { MarketBoard } from '@/components/MarketBoard';
import { WeatherStatus } from '@/components/WeatherStatus';
import { Mutationpedia } from '@/components/Mutationpedia';
import { ItemEncyclopedia } from '@/components/ItemEncyclopedia';
import { FruitCalculator } from '@/components/FruitCalculator';
import { SystemMonitor } from '@/components/SystemMonitor';
import { NotificationFeed } from '@/components/NotificationFeed';
import { Leaf, BarChart3, BookOpen, Calculator, Settings, Bell, Dna } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('market');
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    toast({
      title: "Welcome to Grow A Garden Analytics!",
      description: "Your comprehensive tool for tracking game data and optimizing gameplay.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Grow A Garden Analytics</h1>
                <p className="text-sm text-muted-foreground">Comprehensive Game Intelligence Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`status-indicator ${wsStatus === 'connected' ? 'status-online' : 'status-offline'}`}>
                <div className={`w-2 h-2 rounded-full ${wsStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'} ${wsStatus === 'connecting' ? 'pulse-glow' : ''}`} />
                {wsStatus === 'connected' ? 'Live' : wsStatus === 'connecting' ? 'Connecting...' : 'Offline'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="market" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Market Board
            </TabsTrigger>
            <TabsTrigger value="mutations" className="flex items-center gap-2">
              <Dna className="h-4 w-4" />
              Mutationpedia
            </TabsTrigger>
            <TabsTrigger value="encyclopedia" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Encyclopedia
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MarketBoard onStatusChange={setWsStatus} onNotifications={setNotifications} />
              </div>
              <div>
                <WeatherStatus />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mutations">
            <Mutationpedia />
          </TabsContent>

          <TabsContent value="encyclopedia">
            <ItemEncyclopedia />
          </TabsContent>

          <TabsContent value="calculator">
            <FruitCalculator />
          </TabsContent>

          <TabsContent value="system">
            <SystemMonitor wsStatus={wsStatus} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationFeed notifications={notifications} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
