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
import { useWebSocketData } from '@/hooks/useWebSocketData';
import { useWeatherData } from '@/hooks/useWeatherData';
import { useNotificationDataJandel } from '@/hooks/useNotificationDataJandel';
import { useStockAlertNotifications } from '@/hooks/useStockAlertNotifications';

import { MarketBoard } from '@/components/MarketBoard';
import { WeatherStatus } from '@/components/WeatherStatus';
import { ItemEncyclopedia } from '@/components/ItemEncyclopedia';
import { RecipePedia } from '@/components/RecipePedia';
import { FruitCalculator } from '@/components/FruitCalculator';
import { SystemMonitor } from '@/components/SystemMonitor';
import { NotificationFeed } from '@/components/NotificationFeed';
import { NotificationDiagnostic } from '@/components/NotificationDiagnostic';
import { MobileNav } from '@/components/MobileNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MaintenanceOverlay } from '@/components/MaintenanceOverlay';

import { Leaf, BarChart3, BookOpen, Calculator, Settings, Bell, User, LogOut, Shield, Menu, Activity, Utensils } from 'lucide-react';

const Index = () => {
    // Path to the music file in public
    const MUSIC_SRC = '/Music/Morning_Mood.mp3';
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState('market');
    const { user, signOut, loading } = useAuth();
    const { isInMaintenance, settings, showMaintenanceAsAdmin } = useMaintenanceMode();

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
    const { weatherData, loading: weatherLoading, error: weatherError } = useWeatherData();
    const { notifications: jandelMessages, loading: jandelLoading, error: jandelError } = useNotificationDataJandel();
    const { notifications: stockAlerts, loading: alertsLoading, error: alertsError } = useStockAlertNotifications(userId);
    const { travelingMerchantStock, wsStatus } = useWebSocketData(userId);
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
    }, [autoPlayMusic]);

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

     const handleTabChange = (newTab: string) => {
        setActiveTab(newTab);
        window.location.hash = newTab;
    };

    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        const validTabs = ['market', 'encyclopedia', 'recipes', 'calculator', 'notifications'];
        if (validTabs.includes(hash)) {
            setActiveTab(hash);
        } else {
            // Default to market tab and update hash
            setActiveTab('market');
            window.location.hash = 'market';
        }
    }, []);

    return (
        <div className="min-h-screen bg-background">
            {/* Music Consent Dialog */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="fixed bottom-4 left-4 z-50">Play Music?</Button>
                </DialogTrigger>
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
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Leaf className="h-8 w-8 text-primary" />
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-foreground">Grow A Garden Guru</h1>
                                <p className="text-xs md:text-sm text-muted-foreground">Comprehensive Game Intelligence Platform</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu */}
                            <div className="block md:hidden">
                                {/* Mobile Dropdown Menu for user controls only */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10">
                                            <Menu className="h-6 w-6" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-card border-border w-72 p-0">
                                        {/* Header Section */}
                                        <div className="bg-muted/30 px-4 py-3 border-b border-border">
                                            <h3 className="font-semibold text-base text-foreground">Account</h3>
                                        </div>

                                        {/* Controls Section */}
                                        <div className="p-4 space-y-4">
                                            {/* Theme Toggle Section */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-foreground">Theme</span>
                                                <ThemeToggle />
                                            </div>

                                            {/* Status Section */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-foreground">Status</span>
                                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${wsStatus === 'connected'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                    <div className={`w-2 h-2 rounded-full ${wsStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                                                        } ${wsStatus === 'connecting' ? 'animate-pulse' : ''}`} />
                                                    {wsStatus === 'connected' ? 'Live' : wsStatus === 'connecting' ? 'Connecting...' : 'Offline'}
                                                </div>
                                            </div>

                                            <DropdownMenuSeparator className="bg-border" />

                                            {/* User Section */}
                                            <div className="space-y-3">
                                                {!loading && (
                                                    user && !('isGuest' in user) ? (
                                                        // Authenticated User
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                                                                <Avatar className="h-10 w-10">
                                                                    <AvatarImage
                                                                        src={user.user_metadata?.avatar_url as string}
                                                                        alt="Profile"
                                                                    />
                                                                    <AvatarFallback className="text-sm font-medium">
                                                                        {(user.user_metadata?.full_name as string || user.email)?.charAt(0).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-foreground truncate">
                                                                        {user.user_metadata?.full_name as string || 'User'}
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground truncate">
                                                                        {user.email}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* User Actions */}
                                                            <div className="space-y-2">
                                                                <Link to="/profile" className="w-full">
                                                                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                                                                        <User className="h-4 w-4" />
                                                                        Profile
                                                                    </Button>
                                                                </Link>

                                                                {user.user_metadata?.provider_id === "939867069070065714" && (
                                                                    <Link to="/admin" className="w-full">
                                                                        <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                                                                            <Shield className="h-4 w-4" />
                                                                            Admin Panel
                                                                        </Button>
                                                                    </Link>
                                                                )}

                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={signOut}
                                                                    className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                                                                >
                                                                    <LogOut className="h-4 w-4" />
                                                                    Sign Out
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : user && 'isGuest' in user ? (
                                                        // Guest User
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                                                                <Avatar className="h-10 w-10">
                                                                    <AvatarImage src={user.avatar_url as string} alt="Guest" />
                                                                    <AvatarFallback className="text-sm font-medium">G</AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-foreground">Guest User</p>
                                                                    <p className="text-xs text-muted-foreground truncate">
                                                                        ID: {user.id.slice(-8)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <Link to="/auth" className="w-full">
                                                                <Button variant="default" size="sm" className="w-full">
                                                                    Sign In to Save Progress
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    ) : (
                                                        // No User
                                                        <div className="text-center space-y-3">
                                                            <p className="text-sm text-muted-foreground">Sign in to save your progress</p>
                                                            <Link to="/auth" className="w-full">
                                                                <Button variant="default" size="sm" className="w-full">
                                                                    Sign In
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            {/* User Controls */}
                            <div className="hidden md:flex items-center gap-4">
                                <ThemeToggle />
                                <div className={`status-indicator ${wsStatus === 'connected' ? 'status-online' : 'status-offline'}`}>
                                    <div className={`w-2 h-2 rounded-full ${wsStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'} ${wsStatus === 'connecting' ? 'pulse-glow' : ''}`} />
                                    {wsStatus === 'connected' ? 'Live' : wsStatus === 'connecting' ? 'Connecting...' : 'Offline'}
                                </div>
                                {!loading && (
                                    user && !('isGuest' in user) ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage
                                                                src={user.user_metadata?.avatar_url as string}
                                                                alt="Profile"
                                                            />
                                                            <AvatarFallback className="text-xs">
                                                                {(user.user_metadata?.full_name as string || user.email)?.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        {user.user_metadata?.full_name as string || user.email}
                                                    </div>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-card border-border">
                                                <Link to="/profile">
                                                    <DropdownMenuItem className="text-foreground hover:bg-accent">
                                                        <User className="h-4 w-4 mr-2" />
                                                        Profile
                                                    </DropdownMenuItem>
                                                </Link>
                                                {user.user_metadata?.provider_id === "939867069070065714" && (
                                                    <>
                                                        <DropdownMenuSeparator className="bg-border" />
                                                        <Link to="/admin">
                                                            <DropdownMenuItem className="text-foreground hover:bg-accent">
                                                                <Shield className="h-4 w-4 mr-2" />
                                                                Admin Panel
                                                            </DropdownMenuItem>
                                                        </Link>
                                                    </>
                                                )}
                                                <DropdownMenuSeparator className="bg-border" />
                                                <DropdownMenuItem
                                                    onClick={signOut}
                                                    className="text-foreground hover:bg-accent"
                                                >
                                                    <LogOut className="h-4 w-4 mr-2" />
                                                    Sign Out
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : user && 'isGuest' in user ? (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={user.avatar_url as string} alt="Guest" />
                                                <AvatarFallback className="text-xs">G</AvatarFallback>
                                            </Avatar>
                                            <span className="text-muted-foreground">
                                                Guest_{user.id.slice(-8)}
                                            </span>
                                            <Link to="/auth">
                                                <Button variant="outline" size="sm">
                                                    Sign In
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <Link to="/auth">
                                            <Button variant="outline" size="sm">
                                                Sign In
                                            </Button>
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto p-4">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p>Loading...</p>
                    </div>
                ) : (
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        {/* Main Navigation - hamburger on mobile, tabs on desktop */}
                        <div className="flex items-center justify-between gap-4 mb-8">
                            <div className="flex-grow">
                                {/* Hamburger for mobile, tabs for md+ */}
                                <div className="md:hidden">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm" className="gap-2 w-full">
                                                <Menu className="h-5 w-5 mr-2" />
                                                Menu
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" side="bottom" className="bg-card border-border w-screen max-w-none left-0 rounded-none shadow-lg">
                                            <DropdownMenuItem onClick={() => handleTabChange('market')} className="flex items-center gap-2">
                                                <BarChart3 className="h-4 w-4" /> Market Board
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleTabChange('encyclopedia')} className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4" /> Encyclopedia
                                            </DropdownMenuItem>
                                             <DropdownMenuItem onClick={() => handleTabChange('recipes')} className="flex items-center gap-2">
                                                 <Utensils className="h-4 w-4" /> Recipes
                                             </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleTabChange('calculator')} className="flex items-center gap-2">
                                                <Calculator className="h-4 w-4" /> Calculator
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleTabChange('notifications')} className="flex items-center gap-2">
                                                <Bell className="h-4 w-4" /> Notifications
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="hidden md:block">
                                    <TabsList className="grid w-full grid-cols-5">
                                        <TabsTrigger value="market" className="flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4" />
                                            Market Board
                                        </TabsTrigger>
                                        <TabsTrigger value="encyclopedia" className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4" />
                                            Encyclopedia
                                        </TabsTrigger>
                                        <TabsTrigger value="recipes" className="flex items-center gap-2">
                                            <Utensils className="h-4 w-4" />
                                            Recipes
                                        </TabsTrigger>
                                        <TabsTrigger value="calculator" className="flex items-center gap-2">
                                            <Calculator className="h-4 w-4" />
                                            Calculator
                                        </TabsTrigger>
                                        <TabsTrigger value="notifications" className="flex items-center gap-2">
                                            <Bell className="h-4 w-4" />
                                            Notifications
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                            </div>
                        </div>
                        {/* Tab Contents */}
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
                                            <WeatherStatus
                                                weatherData={weatherData}
                                                loading={weatherLoading}
                                                error={weatherError}
                                            />
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
                        <TabsContent value="recipes">
                            <div className="relative">
                                {isInMaintenance('recipes') && (
                                    <MaintenanceOverlay componentName="Recipes" className="absolute inset-0 z-10" />
                                )}
                                <div className={isInMaintenance('recipes') ? 'pointer-events-none blur-sm' : ''}>
                                    <RecipePedia />
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
                        <TabsContent value="notifications">
                            <div className="relative">
                                {isInMaintenance('notifications') && (
                                    <MaintenanceOverlay componentName="Notifications" className="absolute inset-0 z-10" />
                                )}
                                <div className={isInMaintenance('notifications') ? 'pointer-events-none blur-sm' : 'space-y-6'}>
                                    <NotificationFeed
                                        jandelMessages={jandelMessages}
                                        stockAlerts={stockAlerts}
                                        loading={jandelLoading || alertsLoading}
                                        error={jandelError || alertsError}
                                    />
                                    {/* <NotificationDiagnostic /> */}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </main>
            <footer className="container mx-auto p-4">
                <div className="relative">
                    {isInMaintenance('system') && (
                        <MaintenanceOverlay componentName="System Monitor" className="absolute inset-0 z-10" />
                    )}
                    <div className={isInMaintenance('system') ? 'pointer-events-none blur-sm' : ''}>
                        <SystemMonitor wsStatus={wsStatus} />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Index;
