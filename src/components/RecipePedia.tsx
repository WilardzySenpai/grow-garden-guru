import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const recipes = [
    {
        name: 'Soup',
        emoji: '🍲',
        ingredients: 'Anything (if not a recipe for other food)',
        time: '5 minutes',
        color: 'Any',
    },
    {
        name: 'Sandwich',
        emoji: '🥪',
        ingredients: '2x Tomato, 1x Corn',
        time: '7 minutes and 6 seconds',
        color: 'Orange',
    },
    {
        name: 'Pie',
        emoji: '🥧',
        ingredients: '1x Pumpkin, 1x Apple or 1x Corn, 1x Coconut',
        time: '7 minutes 52 seconds',
        color: 'Green',
    },
    {
        name: 'Burger',
        emoji: '🍔',
        ingredients: '1x Pepper, 1x Corn, 1x Tomato',
        time: '6 minutes and 7 seconds',
        color: 'Orange',
    },
    {
        name: 'Hotdog',
        emoji: '🌭',
        ingredients: '1x Pepper, 1x Corn/Banana',
        time: '6 minutes and 46 seconds',
        color: 'Tan',
    },
    {
        name: 'Waffle',
        emoji: '🧇',
        ingredients: '1x Pumpkin, 1x Watermelon or 1x Pumpkin, 1x Sugar Apple',
        time: '6 minutes and 15 seconds',
        color: 'TBA',
    },
    {
        name: 'Salad',
        emoji: '🥗',
        ingredients: '2x Tomato',
        time: '5 minutes and 18 seconds',
        color: 'Red',
    },
    {
        name: 'Sushi',
        emoji: '🍣',
        ingredients: '4x Bamboo, 1x Corn',
        time: 'TBA',
        color: 'TBA',
    },
    {
        name: 'Ice Cream',
        emoji: '🍦',
        ingredients: '1x Blueberry/Pineapple, 1x Corn',
        time: '5 minutes and 48 seconds',
        color: 'TBA',
    },
    {
        name: 'Donut',
        emoji: '🍩',
        ingredients: '1x Corn, 1x Blueberry, 1x Strawberry or 1x Strawberry, 1x Tomato, 1x Apple',
        time: '9 minutes and 37 seconds',
        color: 'TBA',
    },
    {
        name: 'Pizza',
        emoji: '🍕',
        ingredients: '1x Corn, 1x Tomato, 1x Pepper',
        time: 'TBA',
        color: 'TBA',
    },
    {
        name: 'Cake',
        emoji: '🍰',
        ingredients: '1x Watermelon, 2x Corn',
        time: 'TBA',
        color: 'TBA',
    },
];

export const RecipePedia = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Cooking Recipes</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Food</TableHead>
                            <TableHead>Ingredients</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Color</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recipes.map((recipe) => (
                            <TableRow key={recipe.name}>
                                <TableCell>
                                    <span className="mr-2">{recipe.emoji}</span>
                                    {recipe.name}
                                </TableCell>
                                <TableCell>{recipe.ingredients}</TableCell>
                                <TableCell>{recipe.time}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{recipe.color}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
