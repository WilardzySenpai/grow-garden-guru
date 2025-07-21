
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';

import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useMaintenanceMode } from '@/hooks/useMaintenanceMode';
import { useStockData } from '@/hooks/useStockData';
import { useWeatherData } from '@/hooks/useWeatherData';

import { MarketBoard } from '@/components/MarketBoard';
import { WeatherStatus } from '@/components/WeatherStatus';
import { ItemEncyclopedia } from '@/components/ItemEncyclopedia';
import { FruitCalculator } from '@/components/FruitCalculator';
import { SystemMonitor } from '@/components/SystemMonitor';
import { NotificationFeed } from '@/components/NotificationFeed';
import { MobileNav } from '@/components/MobileNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MaintenanceOverlay } from '@/components/MaintenanceOverlay';

import { Leaf, BarChart3, BookOpen, Calculator, Settings, Bell, User, LogOut, Shield, Menu, Activity } from 'lucide-react';

const Index = () => {
    // Path to the music file in public
    const MUSIC_SRC = '/Music/Morning_Mood.mp3';
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState('market');
    const [notifications, setNotifications] = useState<any[]>([]);
    const { user, signOut, loading } = useAuth();
    const { isInMaintenance } = useMaintenanceMode();

    // Get user ID for API calls
    const getUserId = () => {
        if (!user) return null;
        
        // For authenticated users, use their actual user ID
        if (!('isGuest' in user)) {
            return user.id;
        }
        
        // For guest users, use the guest ID
        return user.id;
    };

    const userId = getUserId();

    // Use separate hooks for stock data and weather data
    const { marketData, loading: stockLoading, error: stockError, refetch } = useStockData(userId);
    const { weatherData, wsStatus } = useWeatherData(userId);

    // Update notifications from API calls or other sources
    useEffect(() => {
        if (marketData?.notifications) {
            setNotifications(marketData.notifications);
        }
    }, [marketData]);
    const [musicDialogOpen, setMusicDialogOpen] = useState(true);
    const [autoPlayMusic, setAutoPlayMusic] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const [audioSettings, setAudioSettings] = useState({ volume: 0.7, playbackRate: 1 });
    const audioRef = useRef<HTMLAudioElement>(null);
    // Play music if user accepted, even if player is closed
    useEffect(() => {
        if (audioRef.current && autoPlayMusic) {
            // Check if audio source is valid before playing
            const audio = audioRef.current;
            const canPlay = audio.canPlayType('audio/mpeg');
            
            if (canPlay && audio.src) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch((error) => {
                        console.log('Audio play failed:', error);
                        toast({
                            title: "Audio not available",
                            description: "Background music file could not be loaded",
                            variant: "destructive",
                        });
                    });
                }
            }
        } else if (audioRef.current) {
            audioRef.current.pause();
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
                <DialogContent 
                    aria-labelledby="music-dialog-title"
                    aria-describedby="music-dialog-description"
                    role="alertdialog"
                >
                    <DialogHeader>
                        <DialogTitle id="music-dialog-title">Play background music?</DialogTitle>
                    </DialogHeader>
                    <div 
                        id="music-dialog-description" 
                        className="py-2"
                    >
                        Would you like to play relaxing background music while you use the app?
                    </div>
                    <DialogFooter className="flex gap-2 justify-end">
                        <DialogClose asChild>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setMusicDialogOpen(false);
                                    setAutoPlayMusic(false);
                                }}
                                aria-label="Decline background music"
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
                                aria-label="Enable background music"
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
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
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
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
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
                <nav className="container mx-auto px-3 sm:px-6">
                    <div className="flex items-center justify-between h-14">
                        {/* Logo - Left Side */}
                        <div className="flex items-center gap-3">
                            <Link 
                                to="/" 
                                className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors"
                                aria-label="Grow A Garden Guru Home"
                            >
                                <Leaf className="h-6 w-6 text-primary" />
                            </Link>
                            {/* App Title - Only visible on desktop */}
                            <div className="hidden md:block">
                                <h1 className="text-lg font-bold text-foreground">
                                    Grow A Garden Guru
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Comprehensive Game Intelligence
                                </p>
                            </div>
                        </div>

                        {/* Actions Group - Right Side */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Live Status Indicator - Hide text on mobile */}
                            <div className="flex items-center px-2 sm:px-3 h-8 gap-1.5 bg-card/80 border border-border rounded-lg">
                                <div className={`w-2 h-2 rounded-full ${wsStatus === 'connected' ? 'bg-emerald-500' : 'bg-red-500'} ${wsStatus === 'connecting' ? 'animate-pulse' : ''}`} />
                                <span className="hidden sm:block text-sm font-medium text-foreground">
                                    {wsStatus === 'connected' ? 'Live' : wsStatus === 'connecting' ? 'Connecting...' : 'Offline'}
                                </span>
                            </div>

                            <ThemeToggle />

                            {/* Mobile Menu */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-11 md:hidden">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Menu</SheetTitle>
                                    </SheetHeader>
                                    {!loading && (
                                        <div className="flex flex-col gap-4 mt-6">
                                            {user && !('isGuest' in user) ? (
                                                <>
                                                    <div className="flex items-center gap-2 px-4 py-2">
                                                        <Avatar className="h-7 w-7">
                                                            <AvatarImage 
                                                                src={user.user_metadata?.avatar_url} 
                                                                alt="Profile" 
                                                            />
                                                            <AvatarFallback className="text-xs">
                                                                {(user.user_metadata?.full_name || user.email)?.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">
                                                            {user.user_metadata?.full_name || user.email}
                                                        </span>
                                                    </div>
                                                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent">
                                                        <User className="h-4 w-4" />
                                                        Profile
                                                    </Link>
                                                    {user.user_metadata?.provider_id === "939867069070065714" && (
                                                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent">
                                                            <Shield className="h-4 w-4" />
                                                            Admin Panel
                                                        </Link>
                                                    )}
                                                    <button
                                                        onClick={signOut}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent text-left"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Sign Out
                                                    </button>
                                                </>
                                            ) : (
                                                <Link to="/auth">
                                                    <Button variant="outline" className="w-full">
                                                        Sign In
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </SheetContent>
                            </Sheet>

                            {/* User Menu - Desktop version */}
                            {!loading && (
                                <div className="hidden md:block">
                                    {user && !('isGuest' in user) ? (
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-11 gap-2">
                                                    <Avatar className="h-7 w-7">
                                                        <AvatarImage 
                                                            src={user.user_metadata?.avatar_url} 
                                                            alt="Profile" 
                                                        />
                                                        <AvatarFallback className="text-xs">
                                                            {(user.user_metadata?.full_name || user.email)?.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="hidden sm:block">
                                                        {user.user_metadata?.full_name || user.email}
                                                    </span>
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent>
                                                <SheetHeader>
                                                    <SheetTitle>Menu</SheetTitle>
                                                </SheetHeader>
                                                <div className="flex flex-col gap-4 mt-6">
                                                    <div className="flex items-center gap-2 px-4 py-2">
                                                        <Avatar className="h-7 w-7">
                                                            <AvatarImage 
                                                                src={user.user_metadata?.avatar_url} 
                                                                alt="Profile" 
                                                            />
                                                            <AvatarFallback className="text-xs">
                                                                {(user.user_metadata?.full_name || user.email)?.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">
                                                            {user.user_metadata?.full_name || user.email}
                                                        </span>
                                                    </div>
                                                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent">
                                                        <User className="h-4 w-4" />
                                                        Profile
                                                    </Link>
                                                    {user.user_metadata?.provider_id === "939867069070065714" && (
                                                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent">
                                                            <Shield className="h-4 w-4" />
                                                            Admin Panel
                                                        </Link>
                                                    )}
                                                    <button
                                                        onClick={signOut}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent text-left"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </SheetContent>
                                        </Sheet>
                                    ) : (
                                        <Link to="/auth">
                                            <Button variant="outline">
                                                Sign In
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="container mx-auto p-4 space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    {isMobile ? (
                        <MobileNav
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            navItems={[
                                { value: 'market', label: 'Market Board', icon: <BarChart3 className="h-4 w-4 mr-2" /> },
                                { value: 'encyclopedia', label: 'Encyclopedia', icon: <BookOpen className="h-4 w-4 mr-2" /> },
                                { value: 'calculator', label: 'Calculator', icon: <Calculator className="h-4 w-4 mr-2" /> },
                                { value: 'system', label: 'System', icon: <Settings className="h-4 w-4 mr-2" /> },
                                { value: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4 mr-2" /> }
                            ]}
                        />
                    ) : (
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
                    )}

                    <TabsContent value="market" className="space-y-6">
                        <div className="relative">
                            {isInMaintenance('market') && (
                                <MaintenanceOverlay componentName="Market Board" className="absolute inset-0 z-10" />
                            )}
                            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${isInMaintenance('market') ? 'pointer-events-none blur-sm' : ''}`}>
                                <div className="lg:col-span-2">
                                    <MarketBoard 
                                        marketData={marketData}
                                        loading={stockLoading}
                                        error={stockError}
                                        onRefetch={refetch}
                                    />
                                </div>
                                <div className="relative">
                                    {isInMaintenance('weather') && (
                                        <MaintenanceOverlay componentName="Weather Status" className="absolute inset-0 z-10" />
                                    )}
                                    <div className={isInMaintenance('weather') ? 'pointer-events-none blur-sm' : ''}>
                                        <WeatherStatus weatherData={weatherData} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="encyclopedia">
                        <div className="relative">
                            {isInMaintenance('encyclopedia') && (
                                <MaintenanceOverlay componentName="Item Encyclopedia" className="absolute inset-0 z-10" />
                            )}
                            <div className={isInMaintenance('encyclopedia') ? 'pointer-events-none blur-sm' : ''}>
                                <ItemEncyclopedia />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="calculator">
                        <div className="relative">
                            {isInMaintenance('calculator') && (
                                <MaintenanceOverlay componentName="Fruit Calculator" className="absolute inset-0 z-10" />
                            )}
                            <div className={isInMaintenance('calculator') ? 'pointer-events-none blur-sm' : ''}>
                                <FruitCalculator />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="system">
                        <div className="relative">
                            {isInMaintenance('system') && (
                                <MaintenanceOverlay componentName="System Monitor" className="absolute inset-0 z-10" />
                            )}
                            <div className={isInMaintenance('system') ? 'pointer-events-none blur-sm' : ''}>
                                <SystemMonitor wsStatus={wsStatus} />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="notifications">
                        <div className="relative">
                            {isInMaintenance('notifications') && (
                                <MaintenanceOverlay componentName="Notifications" className="absolute inset-0 z-10" />
                            )}
                            <div className={isInMaintenance('notifications') ? 'pointer-events-none blur-sm' : ''}>
                                <NotificationFeed notifications={notifications} />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default Index;
