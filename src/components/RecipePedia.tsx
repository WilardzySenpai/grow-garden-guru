import { useState, useEffect, useRef } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { recipes, Recipe, RecipeTier } from '@/lib/recipes';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const formatRecipeNameForURL = (name: string) => name.toLowerCase().replace(/\s+/g, '_');

const getRecipeNameFromURL = () => {
    const hash = window.location.hash.replace('#', '');
    const parts = hash.split('/');
    if (parts[0] === 'recipes' && parts.length > 1) {
        return parts[1];
    }
    return null;
};

const TierCard = ({ tier }: { tier: RecipeTier }) => (
    <Card className="mb-4">
        <CardHeader>
            <CardTitle>{tier.name}</CardTitle>
        </CardHeader>
        <CardContent>
            {tier.options.length > 0 ? (
                tier.options.map((option, index) => (
                    <div key={index} className="flex items-center mb-2">
                        {option.verified && <CheckCircle2 className="text-green-500 mr-2" />}
                        <p>
                            {option.ingredients.map(ing => `${ing.quantity}x ${ing.name}`).join(', ')}
                        </p>
                    </div>
                ))
            ) : (
                <p>To be added</p>
            )}
        </CardContent>
    </Card>
);

const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <div>
        {recipe.tiers.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
        ))}
    </div>
);

// Mobile view component
const MobileRecipePedia = ({ selectedRecipe, onRecipeChange }: { selectedRecipe: Recipe, onRecipeChange: (name: string) => void }) => {
    return (
        <div className="space-y-4">
            <Select onValueChange={onRecipeChange} value={selectedRecipe.name}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a recipe" />
                </SelectTrigger>
                <SelectContent>
                    {recipes.map((recipe) => (
                        <SelectItem key={recipe.name} value={recipe.name}>
                            <div className="flex items-center">
                                <span className="mr-2">{recipe.icon}</span>
                                {recipe.name}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            
            <div>
                <RecipeCard recipe={selectedRecipe} />
            </div>
        </div>
    );
}

// Desktop view component
const DesktopRecipePedia = ({ selectedRecipe, onRecipeChange }: { selectedRecipe: Recipe, onRecipeChange: (name: string) => void }) => {
    const tabsContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (scrollOffset: number) => {
        if (tabsContainerRef.current) {
            tabsContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
        }
    };

    return (
        <Tabs value={selectedRecipe.name} onValueChange={onRecipeChange} className="w-full">
            <div className="relative">
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full z-10"
                    onClick={() => scroll(-200)}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="overflow-hidden mx-10" ref={tabsContainerRef}>
                    <TabsList className="whitespace-nowrap">
                        {recipes.map((recipe) => (
                            <TabsTrigger key={recipe.name} value={recipe.name}>
                                <span className="mr-2">{recipe.icon}</span>
                                {recipe.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full z-10"
                    onClick={() => scroll(200)}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            {recipes.map((recipe) => (
                <TabsContent key={recipe.name} value={recipe.name} className="mt-4">
                    <RecipeCard recipe={recipe} />
                </TabsContent>
            ))}
        </Tabs>
    );
}

export const RecipePedia = () => {
    const findRecipeByFormattedName = (formattedName: string | null) => {
        if (!formattedName) return recipes[0];
        return recipes.find(r => formatRecipeNameForURL(r.name) === formattedName) || recipes[0];
    };

    const [selectedRecipe, setSelectedRecipe] = useState(() => {
        const recipeNameFromURL = getRecipeNameFromURL();
        return findRecipeByFormattedName(recipeNameFromURL);
    });

    useEffect(() => {
        const handleHashChange = () => {
            const recipeNameFromURL = getRecipeNameFromURL();
            setSelectedRecipe(findRecipeByFormattedName(recipeNameFromURL));
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleRecipeChange = (recipeName: string) => {
        const newSelectedRecipe = recipes.find(r => r.name === recipeName);
        if (newSelectedRecipe) {
            setSelectedRecipe(newSelectedRecipe);
            window.location.hash = `recipes/${formatRecipeNameForURL(recipeName)}`;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cooking Recipes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="md:hidden">
                    <MobileRecipePedia selectedRecipe={selectedRecipe} onRecipeChange={handleRecipeChange} />
                </div>
                <div className="hidden md:block">
                    <DesktopRecipePedia selectedRecipe={selectedRecipe} onRecipeChange={handleRecipeChange} />
                </div>
            </CardContent>
        </Card>
    );
};
