import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Leaf, AlertTriangle } from 'lucide-react';

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex flex-col items-center justify-center px-4">
            <main className="flex flex-col items-center justify-center flex-1 w-full">
                <Card className="shadow-xl border-0 bg-card/90 max-w-md w-full animate-fade-in-up">
                    <CardHeader className="flex flex-col items-center gap-2 pb-0">
                        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-2 animate-bounce" />
                        <CardTitle className="text-5xl font-extrabold tracking-tight text-primary mb-2">404</CardTitle>
                        <CardDescription className="text-lg text-muted-foreground mb-2">Oops! The page you are looking for does not exist.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4 pt-0">
                        <p className="text-base text-muted-foreground text-center mb-2">
                            The link may be broken, or the page may have been moved.<br />
                            If you think this is a mistake, please let us know!
                        </p>
                        <Button asChild size="lg" className="mt-2">
                            <Link to="/">
                                <Leaf className="h-5 w-5 mr-2" />
                                Return to Home
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default NotFound;
