import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, BarChart3, BookOpen, Calculator, Settings, Bell, ArrowRight, Star } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Home = () => {
    const features = [
        {
            icon: BarChart3,
            title: "Market Board",
            description: "Real-time market tracking and stock monitoring",
            color: "text-blue-500"
        },
        {
            icon: BookOpen,
            title: "Encyclopedia",
            description: "Complete database of crops, pets, items, and mutations",
            color: "text-green-500"
        },
        {
            icon: Calculator,
            title: "Fruit Calculator",
            description: "Calculate optimal fruit values with variants and mutations",
            color: "text-purple-500"
        },
        {
            icon: Settings,
            title: "System Monitor",
            description: "Track system performance and API status",
            color: "text-orange-500"
        },
        {
            icon: Bell,
            title: "Notifications",
            description: "Stay updated with market changes and events",
            color: "text-red-500"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Leaf className="h-8 w-8 text-primary" />
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">Grow A Garden Guru</h1>
                                <p className="text-sm text-muted-foreground">Comprehensive Game Intelligence Platform</p>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="space-y-4">
                        <Badge variant="secondary" className="mb-4">
                            <Star className="h-3 w-3 mr-1" />
                            The Ultimate Grow A Garden Tool
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                            Master Your
                            <span className="text-primary block">Garden Empire</span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Track markets, analyze data, discover mutations, and optimize your farming strategy with our comprehensive suite of tools.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/app">
                            <Button size="lg" className="text-lg px-8 py-6 group">
                                Get Started
                                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link to="/auth">
                            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold text-foreground mb-4">
                        Everything You Need to Dominate
                    </h3>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Powerful tools designed to give you the edge in Grow A Garden
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105 group">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 p-3 rounded-full bg-accent/20 w-fit">
                                    <feature.icon className={`h-8 w-8 ${feature.color} group-hover:scale-110 transition-transform`} />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-accent/20 border-t border-border">
                <div className="container mx-auto px-4 py-16 text-center">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <h3 className="text-3xl font-bold text-foreground">
                            Ready to Transform Your Gameplay?
                        </h3>
                        <p className="text-muted-foreground text-lg">
                            Join thousands of players who use Grow A Garden Guru to maximize their farming potential.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link to="/app">
                                <Button size="lg" className="text-lg px-8 py-6">
                                    Launch Dashboard
                                    <ArrowRight className="h-5 w-5 ml-2" />
                                </Button>
                            </Link>
                            <Link to="/auth">
                                <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-card/30">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Leaf className="h-5 w-5 text-primary" />
                            <span className="text-sm text-muted-foreground">
                                © 2024 Grow A Garden Guru. Built with ❤️ for the community.
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <a
                                href="/faq"
                                className="text-sm text-primary font-semibold hover:underline transition-colors px-3 py-1 rounded bg-accent/40 border border-accent/30 shadow-sm"
                                aria-label="Frequently Asked Questions"
                            >
                                FAQ
                            </a>
                            <span className="text-sm text-muted-foreground">
                                Made with everything we love about Grow A Garden
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;