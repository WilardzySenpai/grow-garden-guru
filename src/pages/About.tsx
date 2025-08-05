import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from 'react-day-picker';

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
            {/* About Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="space-y-4 text-center">
                        <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                            About Grow A Garden Guru
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            This project is designed to provide comprehensive game intelligence for Grow A Garden.
                        </p>
                    </div>
                    <div className="prose prose-lg mx-auto text-muted-foreground">
                        <p>
                            Our mission is to provide players with the tools and data they need to succeed. We offer a variety of features, including real-time market tracking, an extensive encyclopedia of in-game items, and powerful calculators to optimize your farming strategy.
                        </p>
                        <p>
                            This tool was built by a passionate fan of the game, with the goal of creating a helpful resource for the community. We are always looking for feedback and suggestions to improve the site.
                        </p>
                    </div>
                </div>
            </section>

            // add button to return to Home
            <div className="flex justify-center mb-8">
                <Button asChild size="lg" className="shadow-md">
                    <Link to="/">
                        <Leaf className="h-5 w-5 mr-2" />
                        Return to Home
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default About;
