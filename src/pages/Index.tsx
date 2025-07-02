
import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
// Path to the music file in public
const MUSIC_SRC = '/Music/Morning Mood.mp3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { MarketBoard } from '@/components/MarketBoard';
import { WeatherStatus } from '@/components/WeatherStatus';
import { ItemEncyclopedia } from '@/components/ItemEncyclopedia';
import { FruitCalculator } from '@/components/FruitCalculator';
import { SystemMonitor } from '@/components/SystemMonitor';
import { NotificationFeed } from '@/components/NotificationFeed';
import { Leaf, BarChart3, BookOpen, Calculator, Settings, Bell, Dna } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  const [activeTab, setActiveTab] = useState('market');
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [notifications, setNotifications] = useState<any[]>([]);

  // Music player state
  const [musicDialogOpen, setMusicDialogOpen] = useState(true);
  const [autoPlayMusic, setAutoPlayMusic] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [audioSettings, setAudioSettings] = useState({ volume: 0.7, playbackRate: 1 });
  const audioRef = useRef<HTMLAudioElement>(null);
  // Play music if user accepted, even if player is closed
  useEffect(() => {
    if (audioRef.current) {
      if (autoPlayMusic) {
        // Always try to play if user accepted
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        audioRef.current.pause();
      }
    }
    // eslint-disable-next-line
  }, [autoPlayMusic, musicDialogOpen]);

  // Keep music playing even if player is hidden, unless user said no
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioSettings.volume;
      audioRef.current.playbackRate = audioSettings.playbackRate;
    }
  }, [audioSettings]);

  useEffect(() => {
    toast({
      title: "Welcome to Grow A Garden Guru!",
      description: "Your comprehensive tool for tracking game data and optimizing gameplay.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Music Consent Dialog */}
      <Dialog open={musicDialogOpen}>
        <DialogContent aria-describedby="music-dialog-desc">
          <DialogHeader>
            <DialogTitle>Play background music?</DialogTitle>
          </DialogHeader>
          <div id="music-dialog-desc" className="py-2">Would you like to play relaxing background music while you use the app?</div>
          <DialogFooter className="flex gap-2 justify-end">
            <DialogClose asChild>
              <Button
                variant="secondary"
                onClick={() => {
                  setMusicDialogOpen(false);
                  setAutoPlayMusic(false);
                }}
              >
                No, thanks
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={() => {
                  setMusicDialogOpen(false);
                  setAutoPlayMusic(true);
                }}
              >
                Yes, play music
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modern, adjustable, non-intrusive Audio Player */}
      {/* Always-mounted audio element for background music */}
      <audio
        ref={audioRef}
        src={MUSIC_SRC}
        autoPlay={autoPlayMusic}
        loop
        style={{ display: 'none' }}
      >
        Your browser does not support the audio element.
      </audio>

      {/* Floating music player button and panel */}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col items-end"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="group relative"
          tabIndex={0}
          style={{ pointerEvents: 'auto' }}
        >
          {/* Floating button to toggle player */}
          <button
            aria-label="Toggle music player"
            className="bg-primary text-primary-foreground rounded-full shadow-lg p-3 flex items-center justify-center transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50"
            style={{ pointerEvents: 'auto' }}
            onClick={() => {
              setShowPlayer((prev) => !prev);
            }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          </button>
          {/* Player panel, shown on toggle */}
          {showPlayer && (
            <div className="absolute bottom-14 right-0 w-72 bg-card/95 rounded-xl shadow-2xl p-4 flex flex-col gap-2 border border-border animate-fade-in z-50" style={{ pointerEvents: 'auto' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-foreground">Background Music</span>
                <button
                  aria-label="Close player"
                  className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
                  onClick={() => setShowPlayer(false)}
                  style={{ pointerEvents: 'auto' }}
                  tabIndex={0}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              {/* Modern Audio Controls */}
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-16">Volume</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={audioSettings.volume}
                    onChange={e => setAudioSettings(s => ({ ...s, volume: Number(e.target.value) }))}
                    className="w-full accent-primary h-2 rounded-lg appearance-none bg-muted focus:outline-none"
                  />
                  <span className="text-xs w-8 text-right">{Math.round(audioSettings.volume * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-16">Speed</span>
                  <input
                    type="range"
                    min={0.5}
                    max={2}
                    step={0.05}
                    value={audioSettings.playbackRate}
                    onChange={e => setAudioSettings(s => ({ ...s, playbackRate: Number(e.target.value) }))}
                    className="w-full accent-primary h-2 rounded-lg appearance-none bg-muted focus:outline-none"
                  />
                  <span className="text-xs w-8 text-right">{audioSettings.playbackRate.toFixed(2)}x</span>
                </div>
                <div className="flex gap-2 justify-end mt-1">
                  <button
                    className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs shadow hover:bg-primary/80 transition"
                    onClick={() => {
                      if (audioRef.current) audioRef.current.currentTime = 0;
                      if (audioRef.current) audioRef.current.play();
                    }}
                  >Restart</button>
                  <button
                    className="px-3 py-1 rounded bg-muted text-foreground text-xs shadow hover:bg-muted/80 transition"
                    onClick={() => {
                      if (audioRef.current) audioRef.current.pause();
                    }}
                  >Pause</button>
                  <button
                    className="px-3 py-1 rounded bg-muted text-foreground text-xs shadow hover:bg-muted/80 transition"
                    onClick={() => {
                      if (audioRef.current) audioRef.current.play();
                      setShowPlayer(true);
                    }}
                  >Play</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Grow A Garden Guru</h1>
                <p className="text-sm text-muted-foreground">Comprehensive Game Intelligence Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
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
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="market" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Market Board
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
