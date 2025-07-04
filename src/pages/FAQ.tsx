import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const faqs = [
  {
    question: 'What is Grow A Garden Guru?',
    answer: `Grow A Garden Guru is a comprehensive game intelligence platform designed to help players master the Grow A Garden game. It offers real-time market tracking, mutation discovery, fruit calculators, system monitoring, and more—all in a beautiful, modern interface.`
  },
  {
    question: 'How do I use the Market Board?',
    answer: `The Market Board provides real-time updates on in-game market prices, stock levels, and trends. Use it to make informed decisions about buying, selling, and trading items for maximum profit.`
  },
  {
    question: 'What is the Fruit Calculator?',
    answer: `The Fruit Calculator helps you determine the optimal value of your fruits, including variants and mutations. Enter your fruit details to get instant calculations and maximize your harvest.`
  },
  {
    question: 'How does the Mutationpedia work?',
    answer: `Mutationpedia is a complete encyclopedia of all known mutations in Grow A Garden. Browse, search, and discover new mutation combinations to enhance your gameplay.`
  },
  {
    question: 'Can I use Grow A Garden Guru as a guest?',
    answer: `Yes! You can explore most features as a guest. For a personalized experience, including saving your progress and accessing exclusive features, sign in with Discord or email.`
  },
  {
    question: 'Is my data safe?',
    answer: `Absolutely. We use Supabase for secure authentication and data storage. Your information is never shared and is protected with industry-standard security.`
  },
  {
    question: 'How do I report a bug or suggest a feature?',
    answer: `We love feedback! Use the contact form on the homepage or reach out via our Discord community. Your suggestions help us improve the platform for everyone.`
  },
  {
    question: 'Why do I see a 404 page?',
    answer: `A 404 means the page you tried to access does not exist. Use the navigation or return to the homepage to continue exploring.`
  },
  {
    question: 'Who built Grow A Garden Guru?',
    answer: `Grow A Garden Guru is built by passionate players and developers who love the Grow A Garden community. Our mission is to empower every gardener with the best tools and insights.`
  },
  {
    question: 'Is Grow A Garden Guru free to use?',
    answer: `Yes! All core features are free. We may introduce premium features in the future, but the core toolkit will always be accessible to everyone.`
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex flex-col px-4">
      <header className="w-full border-b border-border bg-card/50 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Leaf className="h-7 w-7 text-primary" />
          <span className="font-bold text-lg text-foreground">Grow A Garden Guru</span>
          <Badge variant="secondary" className="ml-3">Game Intelligence Platform</Badge>
        </div>
      </header>
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center mt-12 mb-16">
        <Card className="w-full shadow-2xl border-0 bg-card/95 animate-fade-in-up rounded-2xl">
          <CardHeader className="flex flex-col items-center gap-2 pb-0">
            <HelpCircle className="h-10 w-10 text-primary mb-2 animate-pulse" />
            <CardTitle className="text-3xl font-extrabold tracking-tight text-primary mb-2">Frequently Asked Questions</CardTitle>
            <CardDescription className="text-base text-muted-foreground mb-2 text-center">
              Everything you need to know about Grow A Garden Guru, all in one place.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-0">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-border last:border-none pb-4">
                <button
                  className="w-full flex items-center justify-between text-left focus:outline-none group py-3 px-1 hover:bg-accent/30 rounded-lg transition-colors"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                    {faq.question}
                  </span>
                  {openIndex === idx ? (
                    <ChevronUp className="h-5 w-5 text-primary" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                {openIndex === idx && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="mt-2 text-muted-foreground text-base animate-fade-in px-2"
                  >
                    {faq.answer}
                  </div>
                )}
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
