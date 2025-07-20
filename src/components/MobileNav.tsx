import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

interface MobileNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    navItems: { value: string; label: string; icon: React.ReactNode }[];
}

export const MobileNav = ({ activeTab, setActiveTab, navItems }: MobileNavProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="w-full mb-8">
                    <Menu className="h-4 w-4 mr-2" />
                    Menu
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background">
                <div className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                        <Button
                            key={item.value}
                            variant={activeTab === item.value ? 'secondary' : 'ghost'}
                            onClick={() => {
                                setActiveTab(item.value);
                                setIsOpen(false);
                            }}
                            className="justify-start"
                        >
                            {item.icon}
                            {item.label}
                        </Button>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
};
