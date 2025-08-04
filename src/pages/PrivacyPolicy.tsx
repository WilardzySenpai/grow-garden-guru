import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Leaf, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const privacySections = [
    {
        title: 'Information We Collect',
        content: 'We collect information you provide directly to us, such as when you create an account, and information we get when you use our services, like your gameplay data.'
    },
    {
        title: 'How We Use Your Information',
        content: 'We use the information we collect to provide, maintain, and improve our services, including to personalize your experience.'
    },
    {
        title: 'Information Sharing',
        content: 'We do not share your personal information with companies, organizations, or individuals outside of our service except in the following cases: with your consent, for external processing, or for legal reasons.'
    },
    {
        title: 'Data Security',
        content: 'We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.'
    },
    {
        title: 'Changes to This Policy',
        content: 'We may change this Privacy Policy from time to time. We will post any privacy policy changes on this page and, if the changes are significant, we will provide a more prominent notice.'
    }
];

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex flex-col px-4">
            <main className="w-full max-w-2xl mx-auto flex flex-col items-center mt-12 mb-16">
                <Card className="w-full shadow-2xl border-0 bg-card/95 animate-fade-in-up rounded-2xl">
                    <CardHeader className="flex flex-col items-center gap-2 pb-4">
                        <ShieldCheck className="h-10 w-10 text-primary mb-2 animate-pulse" />
                        <CardTitle className="text-3xl font-extrabold tracking-tight text-primary mb-2">Privacy Policy</CardTitle>
                        <CardDescription className="text-base text-muted-foreground mb-2 text-center">
                            Your privacy is important to us. This policy explains what information we collect and how we use it.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6 pt-0">
                        {privacySections.map((section, idx) => (
                            <div key={idx} className="border-b border-border last:border-none pb-4">
                                <h3 className="font-semibold text-foreground text-xl mb-2">{section.title}</h3>
                                <p className="text-muted-foreground text-base">{section.content}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Button asChild size="lg" className="mt-10 shadow-md">
                    <a href="/">
                        <Leaf className="h-5 w-5 mr-2" />
                        Return to Home
                    </a>
                </Button>
            </main>
        </div>
    );
}
