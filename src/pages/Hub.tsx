import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { Leaf, BarChart3, User, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { LogOut, Shield } from 'lucide-react';

const Hub = () => {
    const { user, signOut, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || 'isGuest' in user) {
        // Redirect to auth page if not logged in or is a guest
        window.location.href = '/auth';
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
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
                            <ThemeToggle />
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
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto p-4 mt-10">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-foreground">
                        Welcome back, {user.user_metadata?.full_name || user.email}!
                    </h2>
                    <p className="text-xl text-muted-foreground mt-2">
                        Ready to get back to your garden?
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-6 w-6 text-primary" />
                                Dashboard
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Head to the main dashboard to view the market, encyclopedia, and more.
                            </p>
                            <Link to="/app">
                                <Button className="w-full">
                                    Go to Dashboard
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-6 w-6 text-primary" />
                                Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                View and edit your profile information.
                            </p>
                            <Link to="/profile">
                                <Button className="w-full">
                                    Go to Profile
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8 text-center">
                    <h3 className="text-lg mb-4">Need Help?</h3>
                    <div className="flex justify-center gap-4">
                        <Link to="/faq" className="text-primary hover:underline">FAQ</Link>
                        <span>•</span>
                        <Link to="/bug-report" className="text-primary hover:underline">Report Bug</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Hub;
