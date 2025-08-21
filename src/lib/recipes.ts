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

const recipes: Recipe[] = [
    {
        name: 'Corn Dog',
        icon: '🌭',
        tiers: [
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Giant Pinecone', quantity: 1 }, { name: 'Pepper', quantity: 1 }, { name: 'Corn', quantity: 1 }] },
                    { ingredients: [{ name: 'Giant Pinecone', quantity: 1 }, { name: 'Pepper', quantity: 1 }, { name: 'Corn', quantity: 1 }] }
                ]
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Giant Pinecone', quantity: 1 }, { name: 'Pepper', quantity: 2 }, { name: 'Corn', quantity: 2 }, { name: 'Beanstalk', quantity: 2 }] }
                ]
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Giant Pinecone', quantity: 1 }, { name: 'Pepper', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Beanstalk', quantity: 2 }] }
                ]
            }
        ]
    },
    {
        name: 'Spaghetti',
        icon: '🍝',
        tiers: [
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Bell Pepper', quantity: 1 }, { name: 'Cauliflower', quantity: 1 }, { name: 'Tomato', quantity: 1 }] }
                ]
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Tomato', quantity: 1 }, { name: 'Cauliflower', quantity: 1 }, { name: 'Jalapeno', quantity: 1 }, { name: 'Bone Blossom', quantity: 1 }] },
                    { ingredients: [{ name: 'Tomato', quantity: 1 }, { name: 'Cauliflower', quantity: 1 }, { name: 'Taco Fern', quantity: 1 }, { name: 'Beanstalk', quantity: 1 }] }
                ]
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Tomato', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Bone Blossom', quantity: 2 }, { name: 'Beanstalk', quantity: 2 }] }
                ]
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Tomato', quantity: 1 }, { name: 'Cauliflower', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }] }
                ]
            }
        ]
    },
    {
        name: 'Candy Apple',
        icon: '🍎',
        tiers: [
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Blueberry', quantity: 1 }] }
                ]
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Giant Pinecone', quantity: 1 }] },
                    { ingredients: [{ name: 'Sugarglaze', quantity: 2 }, { name: 'Sugar Apple', quantity: 2 }] }
                ]
            },
            {
                name: 'Transcendent',
                options: [
                    { ingredients: [{ name: 'Beanstalk', quantity: 1 }, { name: 'Ember Lily', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }, { name: 'Giant Pinecone', quantity: 1 }, { name: 'Bone Blossom', quantity: 1 }] }
                ]
            }
        ]
    },
    {
        name: 'Porridge',
        icon: '🥣',
        tiers: [
            {
                name: 'Rare',
                options: [
                    { ingredients: [{ name: 'Cauliflower', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Lingonberry', quantity: 1 }] }
                ]
            },
            {
                name: 'Recipe Swap – Legendary',
                options: [
                    { ingredients: [{ name: 'Banana', quantity: 2 }, { name: 'Apple', quantity: 1 }] }
                ]
            },
            {
                name: 'Recipe Swap – Mythical',
                options: [
                    { ingredients: [{ name: 'Sugarglaze', quantity: 2 }, { name: 'Blood Banana', quantity: 1 }] }
                ]
            },
            {
                name: 'Recipe Swap – Prismatic',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Sugar Apple', quantity: 4 }] }
                ]
            },
            {
                name: 'Recipe Swap – Transcendent',
                options: [
                    { ingredients: [{ name: 'Banana', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }] }
                ]
            }
        ]
    },
    {
        name: 'Sweet Tea',
        icon: '🫖',
        tiers: [
            {
                name: 'Rare',
                options: [
                    { ingredients: [{ name: 'Blueberry', quantity: 2 }, { name: 'Serenity', quantity: 2 }] }
                ]
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Mint', quantity: 1 }, { name: 'Pineapple', quantity: 1 }] },
                    { ingredients: [{ name: 'Soft Sunshine', quantity: 1 }, { name: 'Mango', quantity: 1 }] },
                    { ingredients: [{ name: 'Serenity', quantity: 1 }, { name: 'Mango', quantity: 1 }] }
                ]
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Serenity', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }] }
                ]
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Ember Lily', quantity: 1 }, { name: 'Mango', quantity: 1 }] },
                    { ingredients: [{ name: 'Rosy Delight', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }] }
                ]
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Burning Bud', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }] }
                ]
            },
            {
                name: 'Transcendent',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 3 }, { name: 'Burning Bud', quantity: 1 }] },
                    { ingredients: [{ name: 'Ember Lily', quantity: 1 }, { name: 'Burning Bud', quantity: 1 }, { name: 'Sugar Apple', quantity: 2 }] }
                ]
            }
        ]
    },
    {
        name: 'Smoothie',
        icon: '🥤',
        tiers: [
            {
                name: 'Uncommon',
                options: [
                    { ingredients: [{ name: 'Carrot', quantity: 1 }, { name: 'Apple', quantity: 1 }] }
                ]
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Mango', quantity: 1 }, { name: 'Peach', quantity: 1 }, { name: 'Strawberry', quantity: 1 }, { name: 'Apple', quantity: 1 }] }
                ]
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Apple', quantity: 3 }, { name: 'Peach', quantity: 1 }] },
                    { ingredients: [{ name: 'Elder Strawberry', quantity: 2 }, { name: 'Blueberry', quantity: 1 }, { name: 'Strawberry', quantity: 1 }, { name: 'Apple', quantity: 1 }] }
                ]
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Coconut', quantity: 1 }, { name: 'Elder Strawberry', quantity: 1 }] },
                    { ingredients: [{ name: 'Grape', quantity: 2 }] }
                ]
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 2 }] }
                ]
            },
            {
                name: 'Transcendent',
                options: [
                    { ingredients: [{ name: 'Bone Blossom', quantity: 3 }, { name: 'Pricklefruit', quantity: 1 }] },
                    { ingredients: [{ name: 'Bone Blossom', quantity: 4 }, { name: 'Sugar Apple', quantity: 1 }] }
                ]
            }
        ]
    },
    {
        name: 'Salad',
        icon: '🥗',
        tiers: [
            {
                name: 'Common',
                options: [
                    { ingredients: [{ name: 'Tomato', quantity: 3 }, { name: 'Bamboo', quantity: 1 }] }
                ]
            },
            {
                name: 'Uncommon',
                options: [
                    { ingredients: [{ name: 'Orange Tulip', quantity: 1 }, { name: 'Bamboo', quantity: 1 }, { name: 'Carrot', quantity: 1 }, { name: 'Tomato', quantity: 1 }] }
                ]
            },
            {
                name: 'Rare',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }] },
                    { ingredients: [{ name: 'Tomato', quantity: 2 }, { name: 'Dragon Fruit', quantity: 1 }] },
                    { ingredients: [{ name: 'Peach', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Jalapeño', quantity: 1 }] },
                    { ingredients: [{ name: 'Cauliflower', quantity: 1 }, { name: 'Bamboo', quantity: 1 }] }
                ]
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Ember Lily', quantity: 1 }, { name: 'Dragon Fruit', quantity: 1 }, { name: 'Bamboo', quantity: 1 }, { name: 'Tomato', quantity: 1 }] }
                ]
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 2 }, { name: 'Tomato', quantity: 1 }] }
                ]
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 4 }, { name: 'Tomato', quantity: 1 }] }
                ]
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Bone Blossom', quantity: 3 }, { name: 'Giant Pinecone', quantity: 1 }, { name: 'Tomato', quantity: 1 }] }
                ]
            },
            {
                name: 'Transcendent',
                options: [
                    { ingredients: [{ name: 'Bone Blossom', quantity: 4 }, { name: 'Tomato', quantity: 1 }] }
                ]
            }
        ]
    },
    {
        name: 'Sandwich',
        icon: '🥪',
        tiers: [
            {
                name: 'Uncommon',
                options: [
                    { ingredients: [{ name: 'Tomato', quantity: 1 }, { name: 'Carrot', quantity: 1 }, { name: 'Corn', quantity: 1 }] },
                    { ingredients: [{ name: 'Tomato', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Artichoke', quantity: 1 }] }
                ]
            },
            {
                name: 'Rare',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 2 }] },
                    { ingredients: [{ name: 'Tomato', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Prickly Pear', quantity: 1 }] }
                ]
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Beanstalk', quantity: 1 }] },
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Loquat', quantity: 1 }] }
                ]
            },
            {
                name: 'Recipe Swap – Legendary',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Avocado', quantity: 3 }] }
                ]
            },
            {
                name: 'Recipe Swap – Mythical',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Bell Pepper', quantity: 3 }] }
                ]
            },
            {
                name: 'Recipe Swap – Divine',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 2 }, { name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }] }
                ]
            },
            {
                name: 'Recipe Swap – Prismatic',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }] }
                ]
            }
        ]
    },
    {
        name: 'Pie',
        icon: '🥧',
        tiers: [
            {
                name: 'Rare',
                options: [
                    { ingredients: [{ name: 'Crown Melon', quantity: 1 }, { name: 'Jalapeño', quantity: 1 }] }
                ]
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Pumpkin', quantity: 1 }, { name: 'Apple', quantity: 1 }] },
                    { ingredients: [{ name: 'Coconut', quantity: 1 }, { name: 'Tomato', quantity: 1 }] },
                    { ingredients: [{ name: 'Pumpkin', quantity: 1 }, { name: 'Dragon Fruit', quantity: 1 }] }
                ]
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Pumpkin', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }] },
                    { ingredients: [{ name: 'Cactus', quantity: 1 }, { name: 'Cacao', quantity: 1 }, { name: 'Pumpkin', quantity: 1 }, { name: 'Peach', quantity: 1 }] },
                    { ingredients: [{ name: 'Pumpkin', quantity: 1 }, { name: 'Ember Lily', quantity: 1 }, { name: 'Green Apple', quantity: 1 }] }
                ]
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Ember Lily', quantity: 1 }] },
                    { ingredients: [{ name: 'Beanstalk', quantity: 1 }, { name: 'Coconut', quantity: 1 }] }
                ]
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Bone Blossom', quantity: 4 }, { name: 'Pumpkin', quantity: 1 }] },
                    { ingredients: [{ name: 'Bone Blossom', quantity: 4 }, { name: 'Coconut', quantity: 1 }] }
                ]
            },
            {
                name: 'Transcendent',
                options: [
                    { ingredients: [{ name: 'Bone Blossom', quantity: 4 }, { name: 'Pumpkin', quantity: 1 }] },
                    { ingredients: [{ name: 'Bone Blossom', quantity: 4 }, { name: 'Coconut', quantity: 1 }] }
                ]
            }
        ]
    },
    {
        name: 'Waffle',
        icon: '🧇',
        tiers: [
            {
                name: 'Rare',
                options: [
                    { ingredients: [{ name: 'Coconut', quantity: 1 }, { name: 'Strawberry', quantity: 1 }] }
                ]
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Peach', quantity: 1 }, { name: 'Coconut', quantity: 1 }, { name: 'Apple', quantity: 1 }] }
                ]
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Coconut', quantity: 1 }, { name: 'Peach', quantity: 1 }] },
                    { ingredients: [{ name: 'Coconut', quantity: 1 }, { name: 'Mango', quantity: 1 }] }
                ]
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Coconut', quantity: 1 }] }
                ]
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Sugarglaze', quantity: 1 }, { name: 'Bone Blossom', quantity: 2 }, { name: 'Coconut', quantity: 2 }, { name: 'Sugar Apple', quantity: 3 }] },
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Coconut', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }] }
                ]
            },
            {
                name: 'Recipe Swap – Transcendent',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Coconut', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }] }
                ]
            }
        ]
    },
    {
        name: 'Ice Cream',
        icon: '🍦',
        tiers: [
            {
                name: 'Uncommon',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Blueberry', quantity: 1 }, { name: 'Strawberry', quantity: 1 }] },
                    { ingredients: [{ name: 'Strawberry', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Jalapeño', quantity: 1 }] }
                ]
            },
            {
                name: 'Rare',
                options: [
                    { ingredients: [{ name: 'Watermelon', quantity: 1 }, { name: 'Corn', quantity: 1 }] },
                    { ingredients: [{ name: 'Blueberry', quantity: 1 }, { name: 'Banana', quantity: 1 }] }
                ]
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Banana', quantity: 2 }, { name: 'Watermelon', quantity: 1 }] },
                    { ingredients: [{ name: 'Mango', quantity: 1 }, { name: 'Corn', quantity: 1 }] }
                ]
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Banana', quantity: 1 }, { name: 'Pepper', quantity: 1 }] },
                    { ingredients: [{ name: 'Loquat', quantity: 1 }] },
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }] }
                ]
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Sugarglaze', quantity: 1 }] },
                    { ingredients: [{ name: 'Sugar Apple', quantity: 3 }, { name: 'Corn', quantity: 1 }] },
                    { ingredients: [{ name: 'Sugarglaze', quantity: 1 }, { name: 'Tranquil Bloom', quantity: 1 }, { name: 'Bone Blossom', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }] }
                ]
            },
            {
                name: 'Recipe Swap – Prismatic',
                options: [
                    { ingredients: [{ name: 'Sugarglaze', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }] },
                    { ingredients: [{ name: 'Banana', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }] }
                ]
            },
            {
                name: 'Recipe Swap – Transcendent',
                options: [
                    { ingredients: [{ name: 'Banana', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }] },
                    { ingredients: [{ name: 'Sugarglaze', quantity: 4 }, { name: 'Bone Blossom', quantity: 4 }] }
                ]
            }
        ]
    },
    {
        name: 'Donut',
        icon: '🍩',
        tiers: [
            {
                name: 'Uncommon',
                options: [
                    { ingredients: [{ name: 'Tomato', quantity: 1 }, { name: 'Strawberry', quantity: 1 }, { name: 'Corn', quantity: 1 }] }
                ]
            },
            {
                name: 'Rare',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Pineapple', quantity: 1 }, { name: 'Blueberry', quantity: 1 }] },
                    { ingredients: [{ name: 'Watermelon', quantity: 2 }, { name: 'Corn', quantity: 2 }] }
                ]
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Serenity', quantity: 1 }, { name: 'Corn', quantity: 1 }] },
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Mango', quantity: 1 }, { name: 'Banana', quantity: 1 }] }
                ]
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Sugarglaze', quantity: 1 }, { name: 'Sugar Apple', quantity: 2 }] },
                    { ingredients: [{ name: 'Bone Blossom', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }, { name: 'Banana', quantity: 1 }] }
                ]
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Sugarglaze', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Peach', quantity: 1 }] }
                ]
            },
            {
                name: 'Transcendent',
                options: [
                    { ingredients: [{ name: 'Bone Blossom', quantity: 4 }, { name: 'Sugarglaze', quantity: 1 }] }
                ]
            },
            {
                name: 'Recipe Swap – Mythical',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Pepper', quantity: 1 }] }
                ]
            },
            {
                name: 'Recipe Swap – Divine',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Sugar Apple', quantity: 2 }, { name: 'Peach', quantity: 1 }] }
                ]
            },
            {
                name: 'Recipe Swap – Prismatic',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 3 }, { name: 'Corn', quantity: 1 }] }
                ]
            },
            {
                name: 'Recipe Swap – Transcendent',
                options: [
                    { ingredients: [{ name: 'Bone Blossom', quantity: 3 }, { name: 'Banana', quantity: 1 }, { name: 'Beanstalk', quantity: 1 }] }
                ]
            }
        ]
    },
    {
        name: 'Pizza',
        icon: '🍕',
        tiers: [
            {
                name: 'Rare',
                options: [
                    { ingredients: [{ name: 'Strawberry', quantity: 1 }, { name: 'Pepper', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Corn', quantity: 1 }] }
                ]
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Pepper', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }] },
                    { ingredients: [{ name: 'Jalapeño', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Dragon Fruit', quantity: 1 }, { name: 'Ember Lily', quantity: 1 }] }
                ]
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Bone Blossom', quantity: 3 }, { name: 'Banana', quantity: 1 }, { name: 'Beanstalk', quantity: 1 }] },
                    { ingredients: [{ name: 'Bone Blossom', quantity: 3 }, { name: 'Banana', quantity: 1 }, { name: 'Beanstalk', quantity: 1 }] }
                ]
            },
            {
                name: 'Recipe Swap – Transcendent',
                options: [
                    { ingredients: [{ name: 'Bone Blossom', quantity: 3 }, { name: 'Banana', quantity: 1 }, { name: 'Beanstalk', quantity: 1 }] }
                ]
            }
        ]
    },
    {
        name: 'Soup',
        icon: '🍲',
        tiers: [
            {
                name: 'Very Common',
                options: [
                    { ingredients: [{ name: 'Carrot', quantity: 1 }] }
                ]
            },
            {
                name: 'Common',
                options: [
                    { ingredients: [{ name: 'Strawberry', quantity: 1 }, { name: 'Peach', quantity: 1 }, { name: 'Mango', quantity: 1 }] }
                ]
            },
            {
                name: 'Uncommon',
                options: [
                    { ingredients: [{ name: 'Coconut', quantity: 2 }] },
                    { ingredients: [{ name: 'Coconut', quantity: 1 }, { name: 'Dragon Fruit', quantity: 1 }] },
                    { ingredients: [{ name: 'Green Apple', quantity: 1 }, { name: 'Grape', quantity: 1 }] },
                    { ingredients: [{ name: 'Apple', quantity: 1 }] }
                ]
            },
            {
                name: 'Rare',
                options: [
                    { ingredients: [{ name: 'Coconut', quantity: 1 }, { name: 'Elder Strawberry', quantity: 1 }] },
                    { ingredients: [{ name: 'Grape', quantity: 1 }, { name: 'Sugar Apple', quantity: 1 }, { name: 'Dragon Fruit', quantity: 1 }] }
                ]
            }
        ]
    },
    {
        name: 'Hot Dog',
        icon: '🌭',
        tiers: [
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Pepper', quantity: 1 }, { name: 'Corn', quantity: 1 }] },
                    { ingredients: [{ name: 'Ember Lily', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Bamboo', quantity: 1 }] }
                ]
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Pepper', quantity: 2 }, { name: 'Corn', quantity: 1 }] }
                ]
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Lucky Bamboo', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }] },
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Ember Lily', quantity: 1 }, { name: 'Elder Strawberry', quantity: 2 }] },
                    { ingredients: [{ name: 'Pepper', quantity: 3 }, { name: 'Corn', quantity: 1 }] }
                ]
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Bone Blossom', quantity: 4 }] }
                ]
            },
            {
                name: 'Transcendent',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Bone Blossom', quantity: 4 }] }
                ]
            }
        ]
    },
    {
        name: 'Burger',
        icon: '🍔',
        tiers: [
            {
                name: 'Rare',
                options: [
                    { ingredients: [{ name: 'Pepper', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Mint', quantity: 1 }] },
                    { ingredients: [{ name: 'Ember Lily', quantity: 1 }, { name: 'Carrot', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Corn', quantity: 1 }] }
                ]
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Ember Lily', quantity: 1 }] },
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Beanstalk', quantity: 1 }, { name: 'Cactus', quantity: 1 }] },
                    { ingredients: [{ name: 'Tomato', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Pepper', quantity: 1 }] },
                    { ingredients: [{ name: 'Onion', quantity: 1 }, { name: 'Pear', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Bone Blossom', quantity: 1 }] },
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Pepper', quantity: 1 }, { name: 'Cactus', quantity: 1 }] },
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: '2 Bell Pepper', quantity: 1 }, { name: '2 Jalapeño', quantity: 1 }] }
                ]
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Pepper', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Bone Blossom', quantity: 1 }, { name: 'Beanstalk', quantity: 1 }] },
                    { ingredients: [{ name: 'Pepper', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Beanstalk', quantity: 2 }] },
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: '3 Bell Pepper', quantity: 1 }] }
                ]
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Tomato', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }] }
                ]
            },
            {
                name: 'Prismatic',
                options: [
                    // "To be added"
                ]
            }
        ]
    },
    {
        name: 'Sushi',
        icon: '🍣',
        tiers: [
            {
                name: 'Rare',
                options: [
                    { ingredients: [{ name: 'Bamboo', quantity: 4 }, { name: 'Corn', quantity: 1 }] },
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Apple', quantity: 1 }] },
                    { ingredients: [{ name: 'Cauliflower', quantity: 1 }, { name: 'Bamboo', quantity: 1 }] }
                ]
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Bamboo', quantity: 3 }, { name: 'Maple Apple', quantity: 1 }, { name: 'Corn', quantity: 1 }] },
                    { ingredients: [{ name: 'Bamboo', quantity: 3 }, { name: 'Hive Fruit', quantity: 1 }, { name: 'Corn', quantity: 1 }] }
                ]
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Bamboo', quantity: 2 }, { name: 'Corn', quantity: 1 }, { name: 'Bone Blossom', quantity: 2 }] },
                    { ingredients: [{ name: 'Sugar Apple', quantity: 3 }, { name: 'Bamboo', quantity: 1 }, { name: 'Corn', quantity: 1 }] }
                ]
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Bamboo', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }] },
                    { ingredients: [{ name: 'Bamboo', quantity: 1 }, { name: 'Pepper', quantity: 1 }, { name: 'Ember Lily', quantity: 1 }, { name: 'Corn', quantity: 1 }] }
                ]
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Coconut', quantity: 1 }, { name: 'Bone Blossom', quantity: 4 }] }
                ]
            }
        ]
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
                    { ingredients: [{ name: 'Banana', quantity: 2 }, { name: 'Strawberry', quantity: 2 }, { name: 'Pumpkin', quantity: 1 }] }
                ]
            },
            {
                name: 'Rare',
                options: [
                    { ingredients: [{ name: 'Corn', quantity: 2 }, { name: 'Watermelon', quantity: 2 }] },
                    { ingredients: [{ name: 'Corn', quantity: 2 }, { name: 'Banana', quantity: 2 }, { name: 'Watermelon', quantity: 1 }] },
                    { ingredients: [{ name: 'Blueberry', quantity: 1 }, { name: 'Grape', quantity: 1 }, { name: 'Apple', quantity: 1 }, { name: 'Corn', quantity: 1 }] }
                ]
            },
            {
                name: 'Legendary',
                options: [
                    { ingredients: [{ name: 'Kiwi (Crop)|Kiwi', quantity: 2 }, { name: 'Banana or Corn', quantity: 2 }] }
                ]
            },
            {
                name: 'Mythical',
                options: [
                    { ingredients: [{ name: 'Sugar Apple', quantity: 2 }, { name: 'Corn', quantity: 2 }] },
                    { ingredients: [{ name: 'Sweet Type Crops', quantity: 4 }, { name: 'Corn', quantity: 4 }] },
                    { ingredients: [{ name: 'Sakura Bush', quantity: 1 }, { name: 'Cacao', quantity: 1 }, { name: 'Corn', quantity: 1 }, { name: 'Giant Pinecone', quantity: 1 }, { name: 'Spiked Mango', quantity: 1 }] },
                    { ingredients: [{ name: 'Banana or Corn', quantity: 1 }, { name: 'Kiwi (Crop)|Kiwi', quantity: 1 }, { name: 'Bone Blossom', quantity: 3 }] }
                ]
            },
            {
                name: 'Divine',
                options: [
                    { ingredients: [{ name: 'Banana', quantity: 1 }, { name: 'Sugar Apple', quantity: 4 }] },
                    { ingredients: [{ name: 'Corn', quantity: 1 }, { name: 'Elder Strawberry', quantity: 2 }, { name: 'Sugar Apple', quantity: 2 }] }
                ]
            },
            {
                name: 'Prismatic',
                options: [
                    { ingredients: [{ name: 'Banana', quantity: 1 }, { name: 'Bone Blossom', quantity: 4 }] }
                ]
            }
        ]
    }
];
