export interface Ingredient {
    name: string;
    quantity: number | string; // string for "or" cases like "x1 Corn or Banana"
    icon?: string; // Optional: for image path
}

export interface RecipeOption {
    ingredients: Ingredient[];
    verified?: boolean;
}

export interface RecipeTier {
    name: string;
    options: RecipeOption[];
}

export interface Recipe {
    name: string;
    icon: string; // Emoji or path to icon
    tiers: RecipeTier[];
}

export const recipes: Recipe[] = [
    {
        name: 'Salad',
        icon: '🥗',
        tiers: [
            {
                name: 'Normal',
                options: [
                    { ingredients: [{ name: 'Tomato', quantity: 2 }], verified: true },
                    { ingredients: [{ name: 'Strawberry', quantity: 1 }, { name: 'Bell Pepper', quantity: 1 }], verified: true },
                    { ingredients: [{ name: 'Blood Banana', quantity: 2 }, { name: 'Tomato', quantity: 2 }] },
                    { ingredients: [{ name: 'Onion', quantity: 1 }, { name: 'Pear', quantity: 1 }] },
                ],
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Tomato', quantity: 1 }, { name: 'Giant Pinecone', quantity: 1 }] },
                ],
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 3 }, { name: 'Pepper', quantity: 1 }, { name: 'Pineapple', quantity: 1 }], verified: true },
                    { ingredients: [{ name: 'Bone Blossom', quantity: 2 }, { name: 'Pineapple', quantity: 1 }, { name: 'Pepper', quantity: 1 }, { name: 'Tomato', quantity: 1 }], verified: true },
                ],
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Tomato', quantity: 1 }, { name: 'Bone Blossom', quantity: 4 }], verified: true },
                ],
            },
        ],
    },
    {
        name: 'Sandwich',
        icon: '🥪',
        tiers: [
            {
                name: 'Normal',
                options: [
                    { ingredients: [{ name: 'Tomato', quantity: 2 }, { name: 'Corn', quantity: 1 }] },
                ],
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Tomato', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Cacao', quantity: 1 }] },
                ],
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Tomato', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Elder Strawberry', quantity: 1 }] },
                ],
            },
            {
                name: 'Prismatic',
                options: [
                    // "To be added"
                ],
            },
        ],
    },
    {
        name: 'Pie',
        icon: '🥧',
        tiers: [
            {
                name: 'Normal',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Pumpkin', quantity: 1 }, { name: 'Giant Pinecone', quantity: 1 }, { name: 'Apple', quantity: 1 }, { name: 'Corn', quantity: 1 }] },
                ],
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Pumpkin', quantity: 1 }, { name: 'Moon Melon', quantity: 1 }] },
                    { ingredients: [{ name: 'Pumpkin', quantity: 1 }, { name: 'Giant Pinecone', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Apple', quantity: 1 }] },
                ],
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Apple', quantity: 1 }, { name: 'Pumpkin', quantity: 1 }] },
                ],
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Coconut', quantity: 1 }, { name: 'Beanstalk', quantity: 1 }], verified: true },
                ],
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Bone Blossom', quantity: 4 }, { name: 'Pumpkin', quantity: 1 }], verified: true },
                    { ingredients: [{ name: 'Bone Blossom', quantity: 4 }, { name: 'Coconut', quantity: 1 }], verified: true },
                ],
            },
        ],
    },
    {
        name: 'Waffle',
        icon: '🧇',
        tiers: [
            {
                name: 'Normal',
                options: [
                    { ingredients: [{ name: 'Pumpkin', quantity: 1 }, { name: 'Watermelon', quantity: 1 }] },
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Watermelon', quantity: 1 }] },
                    { ingredients: [{ name: 'Strawberry', quantity: 1 }, { name: 'Coconut', quantity: 1 }] },
                ],
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Coconut', quantity: 1 }, { name: 'Apple', quantity: 1 }, { name: 'Dragon Fruit', quantity: 1 }, { name: 'Mango', quantity: 1 }] },
                ],
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Coconut', quantity: 1 }, { name: 'Pineapple', quantity: 1 }] },
                ],
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Coconut', quantity: 1 }] },
                ],
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Coconut', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }], verified: true },
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Sugarglaze', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }] },
                ],
            },
        ],
    },
    {
        name: 'Hot Dog',
        icon: '🌭',
        tiers: [
            {
                name: 'Normal',
                options: [
                    { ingredients: [{ name: 'Pepper', quantity: 1 }, { name: 'Corn or Banana', quantity: 1 }] },
                    { ingredients: [{ name: 'Corn', quantity: 2 }, { name: 'Watermelon', quantity: 1 }] },
                    { ingredients: [{ name: 'Pink Lily', quantity: 1 }, { name: 'Elephant Ears', quantity: 1 }, { name: 'Bone Blossom', quantity: 1 }, { name: 'Violet Corn', quantity: 1 }] },
                    { ingredients: [{ name: 'Bone Blossom', quantity: 2 }, { name: 'Pepper', quantity: 1 }, { name: 'Corn', quantity: 1 }] },
                    { ingredients: [{ name: 'Bone Blossom', quantity: '1 or 2' }, { name: 'Violet Corn', quantity: 1 }] },
                ],
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Pepper', quantity: 1 }, { name: 'Corn', quantity: 1 }], verified: true },
                ],
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Bone Blossom', quantity: 4 }], verified: true },
                ],
            },
        ],
    },
    {
        name: 'Ice Cream',
        icon: '🍦',
        tiers: [
            {
                name: 'Uncommon',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Blueberry', quantity: 1 }] },
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Strawberry', quantity: 1 }] },
                ],
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Banana', quantity: 2 }] },
                ],
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Banana', quantity: 1 }] },
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Corn', quantity: 1 }] },
                ],
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Sugarglaze', quantity: 1 }] },
                    { ingredients: [{ name: 'Sugar Apple', quantity: 3 }, { name: 'Corn', quantity: 1 }], verified: true },
                    { ingredients: [{ name: 'Sugar Apple', quantity: 2 }, { name: 'Banana', quantity: 1 }, { name: 'Tranquil Bloom', quantity: 1 }, { name: 'Bone Blossom', quantity: 1 }] },
                ],
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Sugarglaze', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }] },
                    { ingredients: [{ name: 'Banana', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }], verified: true },
                ],
            },
        ],
    },
    {
        name: 'Donut',
        icon: '🍩',
        tiers: [
            {
                name: 'Normal',
                options: [
                    { ingredients: [{ name: 'Strawberry', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Apple', quantity: 1 }] },
                    { ingredients: [{ name: 'Corn', quantity: 2 }, { name: 'Watermelon', quantity: 1 }] },
                    { ingredients: [{ name: 'Corn', quantity: 2 }, { name: 'Banana', quantity: 1 }, { name: 'Pumpkin', quantity: 1 }] },
                ],
            },
            {
                name: 'Rare',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Blueberry', quantity: 1 }, { name: 'Apple', quantity: 1 }] },
                    { ingredients: [{ name: 'Watermelon', quantity: 2 }, { name: 'Corn', quantity: 2 }] },
                ],
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 2 }, { name: 'Corn', quantity: 1 }] },
                ],
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Bone Blossom', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }, { name: 'Banana', quantity: 1 }] },
                ],
            },
            {
                name: 'Prismatic',
                options: [
                    // "To be added"
                ],
            },
        ],
    },
    {
        name: 'Pizza',
        icon: '🍕',
        tiers: [
            {
                name: 'Normal',
                options: [
                    { ingredients: [{ name: 'Banana', quantity: 1 }, { name: 'Tomato', quantity: 1 }] },
                    { ingredients: [{ name: 'Ember Lily', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }] },
                    { ingredients: [{ name: 'Giant Pinecone', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Apple', quantity: 1 }, { name: 'Pepper', quantity: 1 }, { name: 'Strawberry', quantity: 1 }] },
                    { ingredients: [{ name: 'Strawberry', quantity: 1 }, { name: 'Pepper', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }] },
                ],
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Tomato', quantity: 1 }, { name: 'Banana', quantity: 1 }, { name: 'Corn', quantity: 2 }] },
                    { ingredients: [{ name: 'Corn', quantity: 2 }, { name: 'Apple', quantity: 2 }, { name: 'Pepper', quantity: 1 }] },
                    { ingredients: [{ name: 'Bell Pepper', quantity: 1 }, { name: 'Pepper', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Peach', quantity: 1 }] },
                ],
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Pepper', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Sugar Apple', quantity: 2 }], verified: true },
                ],
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Pepper', quantity: 1 }, { name: 'Banana', quantity: 1 }], verified: true },
                    { ingredients: [{ name: 'Sugar Apple', quantity: 2 }, { name: 'Corn', quantity: 1 }, { name: 'Bone Blossom', quantity: 2 }], verified: true },
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }], verified: true },
                ],
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Giant Pinecone', quantity: 1 }, { name: 'Apple', quantity: 1 }, { name: 'Pepper', quantity: 1 }, { name: 'Banana', quantity: 1 }, { name: 'Mushroom', quantity: 1 }], verified: true },
                    { ingredients: [{ name: 'Violet Corn or Corn', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }], verified: true },
                ],
            },
        ],
    },
    {
        name: 'Sushi',
        icon: '🍣',
        tiers: [
            {
                name: 'Normal',
                options: [
                    { ingredients: [{ name: 'Bamboo', quantity: 4 }, { name: 'Corn', quantity: 1 }], verified: true },
                ],
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Bamboo', quantity: 3 }, { name: 'Corn', quantity: 1 }, { name: 'Maple Apple', quantity: 1 }] },
                    { ingredients: [{ name: 'Bamboo', quantity: 3 }, { name: 'Hive Fruit', quantity: 1 }, { name: 'Corn', quantity: 1 }] },
                ],
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Bamboo', quantity: 2 }, { name: 'Corn', quantity: 1 }, { name: 'Bone Blossom', quantity: 2 }], verified: true },
                    { ingredients: [{ name: 'Sugar Apple', quantity: 3 }, { name: 'Bamboo', quantity: 1 }, { name: 'Corn', quantity: 1 }], verified: true },
                ],
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Bamboo', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }], verified: true },
                ],
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Coconut', quantity: 1 }, { name: 'Bone Blossom', quantity: 4 }] }, //TODO: pending emoji was here
                ],
            },
        ],
    },
    {
        name: 'Cake',
        icon: '🍰',
        tiers: [
            {
                name: 'Uncommon',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 2 }, { name: 'Strawberry', quantity: 2 }] },
                    { ingredients: [{ name: 'Blueberry', quantity: 2 }, { name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }] },
                    { ingredients: [{ name: 'Ember Lily', quantity: 1 }, { name: 'Peach', quantity: 2 }] },
                    { ingredients: [{ name: 'Banana', quantity: 2 }, { name: 'Strawberry', quantity: 2 }, { name: 'Pumpkin', quantity: 1 }] },
                ],
            },
            {
                name: 'Rare',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 2 }, { name: 'Watermelon', quantity: 2 }] },
                    { ingredients: [{ name: 'Corn', quantity: 2 }, { name: 'Banana', quantity: 2 }, { name: 'Watermelon', quantity: 1 }] },
                    { ingredients: [{ name: 'Blueberry', quantity: 1 }, { name: 'Grape', quantity: 1 }, { name: 'Apple', quantity: 1 }, { name: 'Corn', quantity: 1 }] },
                ],
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Kiwi (Crop)|Kiwi', quantity: 2 }, { name: 'Banana or Corn', quantity: 2 }] },
                ],
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 2 }, { name: 'Corn', quantity: 2 }] },
                    { ingredients: [{ name: 'Sweet Type Crops', quantity: 4 }, { name: 'Corn', quantity: 4 }] },
                    { ingredients: [{ name: 'Sakura Bush', quantity: 1 }, { name: 'Cacao', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Giant Pinecone', quantity: 1 }, { name: 'Spiked Mango', quantity: 1 }] },
                    { ingredients: [{ name: 'Banana or Corn', quantity: 1 }, { name: 'Kiwi (Crop)|Kiwi', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }] },
                ],
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Banana', quantity: 1 }, { name: 'Sugar Apple', quantity: 4 }] },
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Elder Strawberry', quantity: 2 }, { name: 'Sugar Apple', quantity: 2 }] },
                ],
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Banana', quantity: 1 }, { name: 'Bone Blossom', quantity: 4 }], verified: true },
                ],
            },
        ],
    },
    {
        name: 'Burger',
        icon: '🍔',
        tiers: [
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Pepper', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }] },
                ],
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Pepper', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Bone Blossom', quantity: 1 }, { name: 'Beanstalk', quantity: 1 }] },
                    { ingredients: [{ name: 'Pepper', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Beanstalk', quantity: 2 }] },
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Pepper', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }] },
                ],
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }], verified: true },
                ],
            },
            {
                name: 'Prismatic',
                options: [
                    // "To be added"
                ],
            },
        ],
    },
];
