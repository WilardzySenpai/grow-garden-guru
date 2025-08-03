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
import { Badge } from '@/components/ui/badge';
import { recipes, Recipe, RecipeTier, RecipeOption } from '@/lib/recipes';
import { CheckCircle2 } from 'lucide-react';

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

export const RecipePedia = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Cooking Recipes</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={recipes[0].name} className="w-full">
                    <TabsList>
                        {recipes.map((recipe) => (
                            <TabsTrigger key={recipe.name} value={recipe.name}>
                                <span className="mr-2">{recipe.icon}</span>
                                {recipe.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {recipes.map((recipe) => (
                        <TabsContent key={recipe.name} value={recipe.name}>
                            <RecipeCard recipe={recipe} />
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
};
