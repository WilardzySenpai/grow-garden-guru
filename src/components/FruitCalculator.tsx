import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Slider } from './ui/slider';

const staticCropData = [
    { item_id: "easter_egg", display_name: "Easteregg" }, { item_id: "moonflower", display_name: "Moonflower" }, { item_id: "starfruit", display_name: "Starfruit" }, { item_id: "pepper", display_name: "Pepper" }, { item_id: "grape", display_name: "Grape" }, { item_id: "nightshade", display_name: "Nightshade" }, { item_id: "mint", display_name: "Mint" }, { item_id: "glowshroom", display_name: "Glowshroom" }, { item_id: "blood_banana", display_name: "Bloodbanana" }, { item_id: "beanstalk", display_name: "Beanstalk" }, { item_id: "coconut", display_name: "Coconut" }, { item_id: "candy_blossom", display_name: "Candyblossom" }, { item_id: "carrot", display_name: "Carrot" }, { item_id: "strawberry", display_name: "Strawberry" }, { item_id: "blueberry", display_name: "Blueberry" }, { item_id: "orange_tulip", display_name: "Orangetulip" }, { item_id: "tomato", display_name: "Tomato" }, { item_id: "daffodil", display_name: "Daffodil" }, { item_id: "watermelon", display_name: "Watermelon" }, { item_id: "pumpkin", display_name: "Pumpkin" }, { item_id: "mushroom", display_name: "Mushroom" }, { item_id: "bamboo", display_name: "Bamboo" }, { item_id: "apple", display_name: "Apple" }, { item_id: "corn", display_name: "Corn" }, { item_id: "cactus", display_name: "Cactus" }, { item_id: "cranberry", display_name: "Cranberry" }, { item_id: "moon_melon", display_name: "Moonmelon" }, { item_id: "durian", display_name: "Durian" }, { item_id: "peach", display_name: "Peach" }, { item_id: "cacao", display_name: "Cacao" }, { item_id: "moonglow", display_name: "Moonglow" }, { item_id: "dragon_fruit", display_name: "Dragonfruit" }, { item_id: "mango", display_name: "Mango" }, { item_id: "moon_blossom", display_name: "Moonblossom" }, { item_id: "raspberry", display_name: "Raspberry" }, { item_id: "eggplant", display_name: "Eggplant" }, { item_id: "papaya", display_name: "Papaya" }, { item_id: "celestiberry", display_name: "Celestiberry" }, { item_id: "moon_mango", display_name: "Moonmango" }, { item_id: "passionfruit", display_name: "Passionfruit" }, { item_id: "soul_fruit", display_name: "Soulfruit" }, { item_id: "chocolate_carrot", display_name: "Chocolatecarrot" }, { item_id: "red_lollipop", display_name: "Redlolipop" }, { item_id: "candy_sunflower", display_name: "Candysunflower" }, { item_id: "lotus", display_name: "Lotus" }, { item_id: "pineapple", display_name: "Pineapple" }, { item_id: "hive_fruit", display_name: "Hive" }, { item_id: "lilac", display_name: "Lilac" }, { item_id: "rose", display_name: "Rose" }, { item_id: "foxglove", display_name: "Foxglove" }, { item_id: "purple_dahlia", display_name: "Purpledahlia" }, { item_id: "sunflower", display_name: "Sunflower" }, { item_id: "pink_lily", display_name: "Pinklily" }, { item_id: "nectarine", display_name: "Nectarine" }, { item_id: "honeysuckle", display_name: "Honeysuckle" }, { item_id: "lavender", display_name: "Lavender" }, { item_id: "venus_fly_trap", display_name: "Venusflytrap" }, { item_id: "nectarshade", display_name: "Nectarshade" }, { item_id: "manuka_flower", display_name: "Manuka" }, { item_id: "ember_lily", display_name: "Emberlily" }, { item_id: "dandelion", display_name: "Dandelion" }, { item_id: "lumira", display_name: "Lumira" }, { item_id: "cocovine", display_name: "Cocovine" }, { item_id: "succulent", display_name: "Succulent" }, { item_id: "bee_balm", display_name: "Beebalm" }, { item_id: "nectar_thorn", display_name: "Nectarthorn" }, { item_id: "violet_corn", display_name: "Violetcorn" }, { item_id: "bendboo", display_name: "Bendboo" }, { item_id: "crocus", display_name: "Crocus" }, { item_id: "sugar_apple", display_name: "Sugarapple" }, { item_id: "cursed_fruit", display_name: "Cursedfruit" }, { item_id: "suncoil", display_name: "Suncoil" }, { item_id: "dragon_pepper", display_name: "Dragonpepper" }, { item_id: "cauliflower", display_name: "Cauliflower" }, { item_id: "avocado", display_name: "Avocado" }, { item_id: "kiwi", display_name: "Kiwi" }, { item_id: "green_apple", display_name: "Greenapple" }, { item_id: "banana", display_name: "Banana" }, { item_id: "prickly_pear", display_name: "Pricklypear" }, { item_id: "feijoa", display_name: "Feijoa" }, { item_id: "loquat", display_name: "Loquat" }, { item_id: "wild_carrot", display_name: "Wildcarrot" }, { item_id: "pear", display_name: "Pear" }, { item_id: "cantaloupe", display_name: "Cantaloupe" }, { item_id: "parasol_flower", display_name: "Parasolflower" }, { item_id: "rosy_delight", display_name: "Rosydelight" }, { item_id: "elephant_ears", display_name: "Elephantears" }, { item_id: "bell_pepper", display_name: "Bellpepper" }, { item_id: "aloe_vera", display_name: "Aloevera" }, { item_id: "peace_lily", display_name: "Peacelily" }, { item_id: "traveler's_fruit", display_name: "Travelersfruit" }, { item_id: "delphinium", display_name: "Delphinium" }, { item_id: "lily_of_the_valley", display_name: "Lilyofthevalley" }, { item_id: "guanabana", display_name: "Guanabana" }, { item_id: "pitcher_plant", display_name: "Pitcherplant" }, { item_id: "rafflesia", display_name: "Rafflesia" }, { item_id: "firework_flower", display_name: "Fireworkflower" }, { item_id: "liberty_lily", display_name: "Libertylily" }, { item_id: "bone_blossom", display_name: "Boneblossom" }, { item_id: "horned_dinoshroom", display_name: "Horneddinoshroom" }, { item_id: "firefly_fern", display_name: "Fireflyfern" }, { item_id: "stonebite", display_name: "Stonebite" }, { item_id: "boneboo", display_name: "Boneboo" }, { item_id: "paradise_petal", display_name: "Paradisepetal" }, { item_id: "burning_bud", display_name: "Burningbud" }, { item_id: "fossilight", display_name: "Fossilight" }, { item_id: "amber_spine", display_name: "Amberspine" }, { item_id: "grand_volcania", display_name: "Grandvolcania" }, { item_id: "lingonberry", display_name: "Lingonberry" }, { item_id: "giant_pinecone", display_name: "Giantpinecone" }, { item_id: "horsetail", display_name: "Horsetail" }, { item_id: "monoblooma", display_name: "Monoblooma" }, { item_id: "spiked_mango", display_name: "Spikedmango" }, { item_id: "taro_flower", display_name: "Taroflower" }, { item_id: "serenity", display_name: "Serenity" }, { item_id: "zenflare", display_name: "Zenflare" }, { item_id: "zenrocks", display_name: "Zenrocks" }, { item_id: "hinomai", display_name: "Hinomai" }, { item_id: "maple_apple", display_name: "Mapleapple" }, { item_id: "soft_sunshine", display_name: "Softsunshine" }, { item_id: "elderstrawberry", display_name: "Elderstrawberry" }, { item_id: "tranquilbloom", display_name: "Tranquilbloom" }, { item_id: "luckybamboo", display_name: "Luckybamboo" }, { item_id: "dezen", display_name: "Dezen" }, { item_id: "sakurabush", display_name: "Sakurabush" }, { item_id: "enkaku", display_name: "Enkaku" }, { item_id: "fruitball", display_name: "Fruitball" }, { item_id: "twistedtangle", display_name: "Twistedtangle" }, { item_id: "veinpetal", display_name: "Veinpetal" }, { item_id: "grandtomato", display_name: "Grandtomato" }, { item_id: "sugarglaze", display_name: "Sugarglaze" }, { item_id: "artichoke", display_name: "Artichoke" }, { item_id: "tallasparagus", display_name: "Tallasparagus" }, { item_id: "jalapeno", display_name: "Jalapeno" }, { item_id: "crownmelon", display_name: "Crownmelon" }, { item_id: "tacofern", display_name: "Tacofern" },

    // Cooking Update
    { item_id: "rhubarb", display_name: "Rhubarb" }, { item_id: "spring_onion", display_name: "Spring Onion" }, { item_id: "pricklefruit", display_name: "Pricklefruit" }, { item_id: "bitter_melon", display_name: "Bitter Melon" }, { item_id: "badlands_pepper", display_name: "Bandlans Pepper" }, { item_id: "butternut_squash", display_name: "Butternut Squash" }, { item_id: "king_cabbage", display_name: "King Cabbage" }, { item_id: "onion", display_name: "Onion" },

    // Beanstalk Update
    { item_id: "mandrake", display_name: "Mandrake" }, { item_id: "mangosteen", display_name: "Mangosteen" }, { item_id: "golden_egg", display_name: "Golden Egg" }, { item_id: "poseidon_plant", display_name: "Poseidon Plant" }, { item_id: "gleamroot", display_name: "Gleamroot" }, { item_id: "canary_melon", display_name: "Canary Melon" }, { item_id: "duskpuff", display_name: "Duskpuff" }, { item_id: "amberheart", display_name: "Amberheart" }, { item_id: "princess_thorn", display_name: "Princess Thorn" }, { item_id: "romanesco", display_name: "Romanesco" }, { item_id: "flare_daisy", display_name: "Flare Daisy" },

    // Beanstalk Update 2
    { item_id: "flaremelon", display_name: "Flaremelon" }, { item_id: "crown_of_thorns", display_name: "Crownofthorn" }, { item_id: "calla_lily", display_name: "Callalily" }, { item_id: "glowpod", display_name: "Glowpod" }, { item_id: "willowberry", display_name: "Willowberry" }, { item_id: "cyclamen", display_name: "Cyclamen" }

].map(crop => ({
    ...crop,
    image: `/Crops/${crop.item_id.replace(/ /g, '_')}.png`
}));

const plantBaseValue: { [key: string]: number } = {
    'easter_egg': 2.85, 'moonflower': 1.9, 'starfruit': 2.85, 'pepper': 4.75, 'grape': 2.85,
    'nightshade': 0.48, 'mint': 0.95, 'glowshroom': 0.7, 'blood_banana': 1.42, 'beanstalk': 9.5,
    'coconut': 13.31, 'candy_blossom': 2.85, 'carrot': 0.24, 'strawberry': 0.29, 'blueberry': 0.17,
    'orange_tulip': 0.0499, 'tomato': 0.44, 'daffodil': 0.16, 'watermelon': 7.3, 'pumpkin': 6.9,
    'mushroom': 25.9, 'bamboo': 3.8, 'apple': 2.85, 'corn': 1.9, 'cactus': 6.65, 'cranberry': 0.95,
    'moon_melon': 7.6, 'durian': 7.6, 'peach': 1.9, 'cacao': 7.6, 'moonglow': 6.65,
    'dragon_fruit': 11.38, 'mango': 14.28, 'moon_blossom': 2.85, 'raspberry': 0.71, 'eggplant': 4.75,
    'papaya': 2.86, 'celestiberry': 1.9, 'moon_mango': 14.25, 'passionfruit': 2.867,
    'soul_fruit': 23.75, 'chocolate_carrot': 0.2616, 'red_lollipop': 3.7988, 'candy_sunflower': 1.428,
    'lotus': 18.99, 'pineapple': 2.85, 'hive_fruit': 7.59, 'lilac': 2.846, 'rose': 0.95, 'foxglove': 1.9,
    'purple_dahlia': 11.4, 'sunflower': 15.65, 'pink_lily': 5.699, 'nectarine': 2.807, 'honeysuckle': 11.4,
    'lavender': 0.25, 'venus_fly_trap': 9.5, 'nectarshade': 0.75, 'manuka_flower': 0.289, 'ember_lily': 11.4,
    'dandelion': 3.79, 'lumira': 5.69, 'cocovine': 13.3, 'succulent': 4.75, 'bee_balm': 0.94,
    'nectar_thorn': 5.76, 'violet_corn': 2.85, 'bendboo': 17.09, 'crocus': 0.285, 'sugar_apple': 8.55,
    'cursed_fruit': 22.9, 'suncoil': 9.5, 'dragon_pepper': 5.69, 'cauliflower': 4.74, 'avocado': 3.32,
    'kiwi': 4.75, 'green_apple': 2.85, 'banana': 1.42, 'prickly_pear': 6.65, 'feijoa': 9.5, 'loquat': 6.17,
    'wild_carrot': 0.286, 'pear': 2.85, 'cantaloupe': 5.22, 'parasol_flower': 5.7,
    'rosy_delight': 9.5, 'elephant_ears': 17.1, 'bell_pepper': 7.61,
    'aloe_vera': 5.22, 'peace_lily': 0.5, 'traveler\'s_fruit': 11.4, 'delphinium': 0.285,
    'lily_of_the_valley': 5.69, 'guanabana': 3.8, 'pitcher_plant': 11.4, 'rafflesia': 7.6,
    'firework_flower': 19, 'liberty_lily': 6.176, 'bone_blossom': 2.85,
    'horned_dinoshroom': 4.94, 'firefly_fern': 4.77, 'stonebite': 0.94,
    'boneboo': 14.5, 'paradise_petal': 2.85, 'burning_bud': 11.4, 'fossilight': 3.79,
    'amber_spine': 5.7, 'grand_volcania': 6.65, 'lingonberry': 0.485,
    'giant_pinecone': 5.14, 'horsetail': 2.85, 'monoblooma': 0.477, 'spiked_mango': 14.25,
    'taro_flower': 6.64, 'serenity': 0.24, 'zenflare': 1.34, 'zenrocks': 17.1, 'hinomai': 9.5,
    'maple_apple': 2.85, 'soft_sunshine': 1.9, 'elderstrawberry': 5.37,
    'tranquilbloom': 3.79, 'luckybamboo': 4.75, 'dezen': 1.9, 'sakurabush': 1.42,
    'enkaku': 4.75, 'fruitball': 5.72, 'twistedtangle': 2.85, 'veinpetal': 7.8, 'grandtomato': 1.00, 'sugarglaze': 1.00, 'artichoke': 1.00, 'tallasparagus': 6.5, 'jalapeno': 3.81, 'crownmelon': 4.28, 'tacofern': 8.96,

    // Cooking Update
    'rhubarb': 1.90, 'spring_onion': 1.42, 'pricklefruit': 7.5, 'bitter_melon': 2.85, 'badlands_pepper': 3.33, 'butternut_squash': 4.5, 'king_cabbage': 7.5, 'onion': 1.42,

    // Beanstalk Update
    'mandrake': 2.85, 'mangosteen': 1.42, 'golden_egg': 7.6, 'poseidon_plant' :2.85, 'gleamroot' :2.375, 'canary_melon': 7.60, 'duskpuff': 2.85, 'amberheart': 3.80, 'princess_thorn':11.40, 'romanesco': 7.60, 'flare_daisy': 1.43,

    // Beanstalk Update 2
    'flaremelon': 3.56, 'crown_of_thorns': 0.763, 'callal_ily': 7.04, 'glowpod': 2.80, 'willowberry': 3.80, 'cyclamen': 8.56

};

const plantCalculationData: { [key: string]: { tier1Value: number; tier2Multiplier: number } } = {
    'easter_egg': { tier1Value: 2256, tier2Multiplier: 277.825 }, 'moonflower': { tier1Value: 8574, tier2Multiplier: 2381 }, 'starfruit': { tier1Value: 13538, tier2Multiplier: 1666.6 }, 'pepper': { tier1Value: 7220, tier2Multiplier: 320 }, 'grape': { tier1Value: 7085, tier2Multiplier: 872 }, 'nightshade': { tier1Value: 3159, tier2Multiplier: 13850 }, 'mint': { tier1Value: 4738, tier2Multiplier: 5230 }, 'glowshroom': { tier1Value: 271, tier2Multiplier: 532.5 }, 'blood_banana': { tier1Value: 5415, tier2Multiplier: 2670 }, 'beanstalk': { tier1Value: 25270, tier2Multiplier: 280 }, 'coconut': { tier1Value: 361, tier2Multiplier: 2.04 }, 'candy_blossom': { tier1Value: 90250, tier2Multiplier: 11111.11111 }, 'carrot': { tier1Value: 18, tier2Multiplier: 275 }, 'strawberry': { tier1Value: 14, tier2Multiplier: 165 }, 'blueberry': { tier1Value: 18, tier2Multiplier: 500 }, 'orange_tulip': { tier1Value: 767, tier2Multiplier: 300000 }, 'tomato': { tier1Value: 27, tier2Multiplier: 120 }, 'daffodil': { tier1Value: 903, tier2Multiplier: 25000 }, 'watermelon': { tier1Value: 2708, tier2Multiplier: 61.25 }, 'pumpkin': { tier1Value: 3069, tier2Multiplier: 64 }, 'mushroom': { tier1Value: 136278, tier2Multiplier: 241.6 }, 'bamboo': { tier1Value: 3610, tier2Multiplier: 250 }, 'apple': { tier1Value: 248, tier2Multiplier: 30.53 }, 'corn': { tier1Value: 36, tier2Multiplier: 10 }, 'cactus': { tier1Value: 3069, tier2Multiplier: 69.4 }, 'cranberry': { tier1Value: 1805, tier2Multiplier: 2000 }, 'moon_melon': { tier1Value: 16245, tier2Multiplier: 281.2 }, 'durian': { tier1Value: 6317, tier2Multiplier: 109.37 }, 'peach': { tier1Value: 271, tier2Multiplier: 75 }, 'cacao': { tier1Value: 10830, tier2Multiplier: 187.5 }, 'moonglow': { tier1Value: 18050, tier2Multiplier: 408.45 }, 'dragon_fruit': { tier1Value: 4287, tier2Multiplier: 32.99 }, 'mango': { tier1Value: 5866, tier2Multiplier: 28.89 }, 'moon_blossom': { tier1Value: 60166, tier2Multiplier: 7407.4 }, 'raspberry': { tier1Value: 90, tier2Multiplier: 177.5 }, 'eggplant': { tier1Value: 6769, tier2Multiplier: 300 }, 'papaya': { tier1Value: 903, tier2Multiplier: 111.11 }, 'celestiberry': { tier1Value: 9025, tier2Multiplier: 2500 }, 'moon_mango': { tier1Value: 45125, tier2Multiplier: 222.22 }, 'passionfruit': { tier1Value: 3204, tier2Multiplier: 395 }, 'soul_fruit': { tier1Value: 6994, tier2Multiplier: 12.4 }, 'chocolate_carrot': { tier1Value: 9928, tier2Multiplier: 145096 }, 'red_lollipop': { tier1Value: 45125, tier2Multiplier: 3125 }, 'candy_sunflower': { tier1Value: 72200, tier2Multiplier: 35413 }, 'lotus': { tier1Value: 15343, tier2Multiplier: 42.5 }, 'pineapple': { tier1Value: 1805, tier2Multiplier: 222.5 }, 'hive_fruit': { tier1Value: 55955, tier2Multiplier: 969 }, 'lilac': { tier1Value: 31588, tier2Multiplier: 3899 }, 'rose': { tier1Value: 4513, tier2Multiplier: 5000 }, 'foxglove': { tier1Value: 18050, tier2Multiplier: 5000 }, 'purple_dahlia': { tier1Value: 67688, tier2Multiplier: 522 }, 'sunflower': { tier1Value: 144000, tier2Multiplier: 587.78 }, 'pink_lily': { tier1Value: 58663, tier2Multiplier: 1806.5 }, 'nectarine': { tier1Value: 35000, tier2Multiplier: 4440 }, 'lavender': { tier1Value: 22563, tier2Multiplier: 361008 }, 'honeysuckle': { tier1Value: 90250, tier2Multiplier: 694.3 }, 'venus_fly_trap': { tier1Value: 76712, tier2Multiplier: 850 }, 'nectarshade': { tier1Value: 45125, tier2Multiplier: 78500 }, 'manuka_flower': { tier1Value: 22563, tier2Multiplier: 270000 }, 'ember_lily': { tier1Value: 50138, tier2Multiplier: 385.6 }, 'dandelion': { tier1Value: 45125, tier2Multiplier: 3130 }, 'lumira': { tier1Value: 76713, tier2Multiplier: 2362.5 }, 'crocus': { tier1Value: 27075, tier2Multiplier: 333333 }, 'suncoil': { tier1Value: 72200, tier2Multiplier: 800 }, 'bee_balm': { tier1Value: 16245, tier2Multiplier: 18033.333 }, 'nectar_thorn': { tier1Value: 30083, tier2Multiplier: 906.36 }, 'violet_corn': { tier1Value: 45125, tier2Multiplier: 5555.555 }, 'bendboo': { tier1Value: 138988, tier2Multiplier: 478.5 }, 'succulent': { tier1Value: 22563, tier2Multiplier: 1000 }, 'sugar_apple': { tier1Value: 43320, tier2Multiplier: 592.6 }, 'cursed_fruit': { tier1Value: 15000, tier2Multiplier: 28.6 }, 'cocovine': { tier1Value: 60166, tier2Multiplier: 340 }, 'dragon_pepper': { tier1Value: 80000, tier2Multiplier: 2470 }, 'cauliflower': { tier1Value: 36, tier2Multiplier: 1.6 }, 'avocado': { tier1Value: 80, tier2Multiplier: 7.24 }, 'green_apple': { tier1Value: 271, tier2Multiplier: 33.36 }, 'kiwi': { tier1Value: 2482, tier2Multiplier: 110 }, 'banana': { tier1Value: 1805, tier2Multiplier: 893.3 }, 'prickly_pear': { tier1Value: 6319, tier2Multiplier: 142.9 }, 'feijoa': { tier1Value: 11733, tier2Multiplier: 130 }, 'loquat': { tier1Value: 7220, tier2Multiplier: 189.65 }, 'wild_carrot': { tier1Value: 22563, tier2Multiplier: 275000 }, 'pear': { tier1Value: 18050, tier2Multiplier: 2217.5 }, 'cantaloupe': { tier1Value: 30685, tier2Multiplier: 1124 }, 'parasol_flower': { tier1Value: 180500, tier2Multiplier: 5555.555 }, 'rosy_delight': { tier1Value: 62273, tier2Multiplier: 690 }, 'elephant_ears': { tier1Value: 69492, tier2Multiplier: 237.6 }, 'bell_pepper': { tier1Value: 4964, tier2Multiplier: 85.6 }, 'aloe_vera': { tier1Value: 56858, tier2Multiplier: 2085.25 }, 'peacelily': { tier1Value: 16666, tier2Multiplier: 66666 }, 'traveler\'s_fruit': { tier1Value: 48085, tier2Multiplier: 369.77777 }, 'delphinium': { tier1Value: 21660, tier2Multiplier: 266666 }, 'lily_of_the_valley': { tier1Value: 44331, tier2Multiplier: 1365 }, 'guanabana': { tier1Value: 63626, tier2Multiplier: 4406.23 }, 'pitcher_plant': { tier1Value: 28800, tier2Multiplier: 222.222 }, 'rafflesia': { tier1Value: 3159, tier2Multiplier: 54.65 }, 'liberty_lily': { tier1Value: 27075, tier2Multiplier: 710 }, 'firework_flower': { tier1Value: 136278, tier2Multiplier: 377.5 }, 'bone_blossom': { tier1Value: 180500, tier2Multiplier: 22222.22222 }, 'horned_dinoshroom': { tier1Value: 67218, tier2Multiplier: 2760 }, 'firefly_fern': { tier1Value: 64980, tier2Multiplier: 2880 }, 'stonebite': { tier1Value: 31545, tier2Multiplier: 35175 }, 'boneboo': { tier1Value: 131967, tier2Multiplier: 627.5 }, 'paradise_petal': { tier1Value: 22563, tier2Multiplier: 3305 }, 'burning_bud': { tier1Value: 63175, tier2Multiplier: 486 }, 'fossilight': { tier1Value: 79420, tier2Multiplier: 5505 }, 'horsetail': { tier1Value: 27075, tier2Multiplier: 3333.33333 }, 'giant_pinecone': { tier1Value: 64980, tier2Multiplier: 2875 }, 'lingonberry': { tier1Value: 31588, tier2Multiplier: 139000 }, 'grand_volcania': { tier1Value: 63676, tier2Multiplier: 1440 }, 'amber_spine': { tier1Value: 49638, tier2Multiplier: 1527.5 }, 'monoblooma': { tier1Value: 19855, tier2Multiplier: 88250 }, 'serenity': { tier1Value: 31588, tier2Multiplier: 560000 }, 'soft_sunshine': { tier1Value: 40613, tier2Multiplier: 11250 }, 'taro_flower': { tier1Value: 108300, tier2Multiplier: 2451 }, 'spiked_mango': { tier1Value: 60919, tier2Multiplier: 300 }, 'zenrocks': { tier1Value: 135375, tier2Multiplier: 462.78 }, 'hinomai': { tier1Value: 72200, tier2Multiplier: 800 }, 'maple_apple': { tier1Value: 51521, tier2Multiplier: 6343 }, 'zenflare': { tier1Value: 22563, tier2Multiplier: 12771 }, 'sakurabush': { tier1Value: 25789, tier2Multiplier: 12650 }, 'dezen': { tier1Value: 26398, tier2Multiplier: 7325 }, 'enkaku': { tier1Value: 55955, tier2Multiplier: 2475 }, 'elderstrawberry': { tier1Value: 81225, tier2Multiplier: 2811 }, 'tranquilbloom': { tier1Value: 84223, tier2Multiplier: 5841 }, 'luckybamboo': { tier1Value: 18050, tier2Multiplier: 2600 }, 'fruitball': { tier1Value: 31588, tier2Multiplier: 972 }, 'twistedtangle': { tier1Value: 18050, tier2Multiplier: 2222 }, 'veinpetal': { tier1Value: 45125, tier2Multiplier: 741 }, 'grandtomato': { tier1Value: 1, tier2Multiplier: 1375 }, 'sugarglaze': { tier1Value: 30000, tier2Multiplier: 2785 }, 'artichoke': { tier1Value: 56719, tier2Multiplier: 13365 }, 'tallasparagus': { tier1Value: 65952, tier2Multiplier: 1561 }, 'jalapeno': { tier1Value: 27075, tier2Multiplier: 1871 }, 'crownmelon': { tier1Value: 45125, tier2Multiplier: 2471 }, 'tacofern': { tier1Value: 74252, tier2Multiplier: 926 },

    // Cooking Update
    'rhubarb': { tier1Value: 13538, tier2Multiplier: 3762 }, 'spring_onion': { tier1Value: 27075, tier2Multiplier: 13370 }, 'pricklefruit': { tier1Value: 70312, tier2Multiplier: 1250 }, 'bitter_melon': { tier1Value: 50960, tier2Multiplier: 6274 }, 'badlands_pepper': { tier1Value: 40613, tier2Multiplier: 3671 }, 'butternut_squash': { tier1Value: 28309, tier2Multiplier: 1398 }, 'king_cabbage': { tier1Value: 83250, tier2Multiplier: 1480 }, 'onion': { tier1Value: 9025, tier2Multiplier: 4474 },

    // Beanstalk Update
    'mandrake': { tier1Value: 45125, tier2Multiplier: 5567 }, 'mangosteen': { tier1Value: 45125, tier2Multiplier: 22300 }, 'golden_egg': { tier1Value: 225625, tier2Multiplier: 3910 }, 'poseidon_plant': { tier1Value: 59163, tier2Multiplier: 7300 }, 'gleamroot': { tier1Value: 67688, tier2Multiplier: 12000 }, 'canary_melon': { tier1Value: 58663, tier2Multiplier: 1016 }, 'duskpuff': { tier1Value: 31588, tier2Multiplier: 3888.888 }, 'amberheart': { tier1Value: 157938, tier2Multiplier: 10920 }, 'princess_thorn': { tier1Value: 100278, tier2Multiplier: 771 }, 'romanesco': { tier1Value: 149815, tier2Multiplier: 2591 }, 'flare_daisy': { tier1Value: 22563, tier2Multiplier: 11085 },

    // Beanstalk Update 2
    'flaremelon': { tier1Value: 45125, tier2Multiplier: 3545.56 }, 'crown_of_thorns': { tier1Value: 22563, tier2Multiplier: 38682 }, 'calla_lily': { tier1Value: 61078, tier2Multiplier: 1232 }, 'glowpod': { tier1Value: 27075, tier2Multiplier: 3435 }, 'willowberry': { tier1Value: 66334, tier2Multiplier: 4596 }, 'cyclamen': { tier1Value: 85738, tier2Multiplier: 1172 }
};

interface EnvironmentalMutationData {
    label: string;
    multiplier: number;
}

export const FruitCalculator = () => {
    // Initialize activeTab from URL hash or default to 'calculator'
    const getInitialTab = () => {
        const hash = window.location.hash.replace('#', '');
        const validTabs = ['calculator', 'reverse'];
        return validTabs.includes(hash) ? hash : 'calculator';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);
    const [cropName, setCropName] = useState('');
    const [mass, setMass] = useState('');
    const [variantMutation, setVariantMutation] = useState('');
    const [weatherMutation, setWeatherMutation] = useState('');
    const [regularMutations, setRegularMutations] = useState<{ [key: string]: boolean }>({});
    const [calculationResult, setCalculationResult] = useState<{
        totalPrice: number;
        breakdown: { basePrice: number; mass: number; variant: string; mutations: string[]; };
    } | null>(null);
    const [friendCount, setFriendCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [targetValue, setTargetValue] = useState('');
    const [reverseCalcResult, setReverseCalcResult] = useState('');
    
    const IMAGEKIT_URL = "https://ik.imagekit.io/hachiki/crops";

    // Handle tab changes - update both state and URL hash
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        window.location.hash = tab;
    };

    // Listen for hash changes (browser back/forward)
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            const validTabs = ['calculator', 'reverse'];
            if (validTabs.includes(hash)) {
                setActiveTab(hash);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const filteredCrops = useMemo(() => {
        return staticCropData.filter(crop =>
            crop.display_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const growthMutations = [
        { value: 'Ripe', label: '🍎 Ripe (x1)', multiplier: 1 },
        { value: 'Gold', label: '🪙 Gold (x20)', multiplier: 20 },
        { value: 'Rainbow', label: '🌈 Rainbow (x50)', multiplier: 50 }
    ];

    const environmentalMutationData: { [key: string]: EnvironmentalMutationData } = {
        wet: { label: '💧 Wet', multiplier: 2 },
        chilled: { label: '❄️ Chilled', multiplier: 2 },
        drenched: { label: '🌧️ Drenched', multiplier: 5 },
        frozen: { label: '🧊 Frozen', multiplier: 10 },
        windstruck: { label: '🌬️ Windstruck', multiplier: 2 },
        twisted: { label: '🌪️ Twisted', multiplier: 5 },
        tempestous: { label: '⛈️ Tempestous', multiplier: 12 },
        bloodlit: { label: '🩸 Bloodlit', multiplier: 4 },
        moonlit: { label: '🌕 Moonlit', multiplier: 2 },
        choc: { label: '🍫 Choc', multiplier: 2 },
        aurora: { label: '🌌 Aurora', multiplier: 90 },
        shocked: { label: '⚡ Shocked', multiplier: 100 },
        celestial: { label: '🌠 Celestial', multiplier: 120 },
        pollinated: { label: '🐝 Pollinated', multiplier: 3 },
        burnt: { label: '🔥 Burnt', multiplier: 4 },
        verdant: { label: '🌿 Verdant', multiplier: 4 },
        cloudtouched: { label: '☁️ Cloudtouched', multiplier: 5 },
        honeyglazed: { label: '🍯 HoneyGlazed', multiplier: 5 },
        plasma: { label: '🧪 Plasma', multiplier: 5 },
        heavenly: { label: '😇 Heavenly', multiplier: 5 },
        fried: { label: '🍳 Fried', multiplier: 8 },
        cooked: { label: '🍲 Cooked', multiplier: 10 },
        zombified: { label: '🧟 Zombified', multiplier: 25 },
        molten: { label: '🌋 Molten', multiplier: 25 },
        sundried: { label: '☀️ Sundried', multiplier: 85 },
        paradisal: { label: '🏝️ Paradisal', multiplier: 100 },
        alienlike: { label: '👽 Alienlike', multiplier: 100 },
        galactic: { label: '🪐 Galactic', multiplier: 120 },
        disco: { label: '🪩 Disco', multiplier: 125 },
        voidtouched: { label: '🌑 Voidtouched', multiplier: 135 },
        dawnbound: { label: '🌅 Dawnbound', multiplier: 150 },
        sandy: { label: '🏖️ Sandy', multiplier: 3 },
        clay: { label: '🧱 Clay', multiplier: 5 },
        ceramic: { label: '🏺 Ceramic', multiplier: 30 },
        amber: { label: '🟠 Amber', multiplier: 10 },
        oldamber: { label: '🔶 OldAmber', multiplier: 20 },
        ancientamber: { label: '🟤 AncientAmber', multiplier: 50 },
        friendbound: { label: '🤝 Friendbound', multiplier: 70 },
        infected: { label: '🧫 Infected', multiplier: 75 },
        tranquil: { label: '🧘 Tranquil', multiplier: 20 },
        chakra: { label: '🌀 Chakra', multiplier: 15 },
        toxic: { label: '☣️ Toxic', multiplier: 12 },
        radioactive: { label: '☢️ Radioactive', multiplier: 80 },
        foxfire: { label: '🦊 Foxfire', multiplier: 90 },
        stataic: { label: '⚛️ Stataic', multiplier: 8 },
        jackpot: { label: '🎰 Jackpot', multiplier: 15 },
        corrupted: { label: '🦠 Corrupted', multiplier: 20 },
        harmonisedfoxfire: { label: '🦊 Harmonised Foxfire', multiplier: 190 },
        touchdown: { label: '🏈 Touchdown', multiplier: 105 },
        blitzshock: { label: '⚡ Blitzshock', multiplier: 50 },
        subzero: { label: '❄️ Subzero', multiplier: 40 },
        harmonisedchakra: { label: '🌀 Harmonised Chakra', multiplier: 35 },
        sliced: { label: '🔪 Sliced', multiplier: 50 },
        sauced: { label: '🍜 Sauced', multiplier: 3 },
        pasta: { label: '🍝 Pasta', multiplier: 3 },
        meatballed: { label: '🍖 Meatballed', multiplier: 3 },
        acidic: { label: '🧪 Acidic', multiplier: 15 },
        spaghetti: { label: '🍝 Spaghetti', multiplier: 12 },
        aromatic: { label: '🌿 Aromatic', multiplier: 15 },
        oil: { label: '🛢️ Oil', multiplier: 15 },
        boil: { label: '💧 Boil', multiplier: 15 },
        junkshock: { label: '⚡ Junkshock', multiplier: 45 },
        bloom: { label: '🌸 Bloom', multiplier: 8 },
        eclipse: { label: '🌒 Eclipse', multiplier: 25 },
        fortune: { label: '🍀 Fortune', multiplier: 50 },
        lightcycle: { label: '🔄 Lightcycle', multiplier: 50 },
        cyclonic: { label: '🌀 Cyclonic', multiplier: 50 },
        brainrot: { label: '🧠 Brainrot', multiplier: 100 },
        rot: { label: '🍂 Rot', multiplier: 8 },
        warped: { label: '🪐 Warped', multiplier: 75 },
        gnomed: { label: '🧙 Gnomed', multiplier: 15 },
        beanbound: { label: '🌱 Beanbound', multiplier: 100 },
        gloom: { label: '🌑 Gloom', multiplier: 30 },
        maelstrom: { label: '🌪️ Maelstrom', multiplier: 100 },
    };

    const conflictGroups: { [key: string]: string[] } = {
        burnt: ["cooked","fried","ceramic"],
        cooked: ["burnt","ceramic"],
        fried: ["cooked","ceramic"],
        gold: ["rainbow","silver"],
        rainbow: ["gold","silver"],
        silver: ["gold","rainbow"],
        amber: ["ancientamber","oldamber"],
        ancientamber: ["amber","oldamber"],
        oldamber: ["amber","ancientamber"],
        clay: ["ceramic", "sandy"],
        ceramic: ["clay","fried","burnt","cooked"],
        sandy: ["clay","wet","drenched"],
        paradisal: ["sundried","verdant"],
        sundried: ["paradisal","verdant"],
        verdant: ["sundried","paradisal"],
        twisted: ["windstruck","tempestous","cylonic","maelstrom"],
        windstruck: ["tempestous","twisted","cyclonic"],
        tempestous: ["windstruck","twisted","cyclonic","maelstrom"],
        cylonic: ["twisted","windstruck","tempestous","maelstrom"],
        maelstrom: ["twisted","tempestous","cyclonic"],
        chakra: ["harmonisedchakra"],
        harmonisedchakra: ["chakra"],
        foxfire: ["harmonisedfoxfire"],
        harmonisedfoxfire: ["foxfire"],
        sauce: ["spaghetti"],
        meatball: ["spaghetti"],
        pasta: ["spaghetti"],
        spaghetti: ["pasta","meatball","sauce"],
        gloom: ["rot","bloom"],
        bloom: ["rot","gloom"],
        rot: ["gloom","bloom"]
    };

    const handleMutationChange = (mutation: string) => {
        const newMutations = { ...regularMutations };
        const currentlyActive = newMutations[mutation];

        // Toggle the mutation
        newMutations[mutation] = !currentlyActive;

        // Special logic for specific mutations
        if (newMutations[mutation]) { // If mutation is being enabled
            switch (mutation) {
                case 'cooked':
                    newMutations['burnt'] = false;
                    break;
                case 'ceramic':
                    newMutations['clay'] = false;
                    break;
                case 'frozen':
                    newMutations['wet'] = false;
                    newMutations['drenched'] = false;
                    newMutations['chilled'] = false;
                    break;
                case 'clay':
                    newMutations['sandy'] = false;
                    newMutations['wet'] = false;
                    break;
                case 'tempestuous':
                    newMutations['windstruck'] = false;
                    newMutations['twisted'] = false;
                    break;
                case 'foxfire':
                    newMutations['harmonisedfoxfire'] = false;
                    break;
                case 'chakra':
                    newMutations['harmonisedchakra'] = false;
                    break;
                case 'sauce':
                case 'meatball':
                case 'pasta':
                case 'spaghetti':
                    newMutations['sauce'] = true;
                    newMutations['meatball'] = true;
                    newMutations['pasta'] = true;
                    newMutations['spaghetti'] = true;
                    break;
                default:
                    break;
            }

            if ((mutation === 'verdant' && newMutations['sundried']) || (mutation === 'sundried' && newMutations['verdant'])) {
                newMutations['paradisal'] = true;
                newMutations['verdant'] = false;
                newMutations['sundried'] = false;
                toast({
                    title: "Mutation Combination!",
                    description: "Verdant and Sundried have combined to create the Paradisal mutation!",
                });
            }

            if (mutation === 'paradisal' && !newMutations['paradisal']) {
                // If paradisal is being deselected, do nothing to verdant/sundried
            } else if (newMutations['paradisal']) {
                if (mutation === 'verdant') {
                    newMutations['sundried'] = false;
                } else if (mutation === 'sundried') {
                    newMutations['verdant'] = false;
                }
            }


            const conflicts = conflictGroups[mutation];
            if (conflicts) {
                conflicts.forEach(conflict => {
                    if (newMutations[conflict]) {
                        // This case should ideally not be reached if UI is disabled correctly
                        newMutations[mutation] = false;
                    }
                });
            }
        }

        setRegularMutations(newMutations);
    };

    const isMutationDisabled = (mutation: string) => {
        const conflicts = conflictGroups[mutation] || [];
        if (conflicts.some(conflict => regularMutations[conflict])) {
            return true;
        }

        if (regularMutations.paradisal) {
            if (mutation === 'sundried' && regularMutations.verdant) {
                return true;
            }
            if (mutation === 'verdant' && regularMutations.sundried) {
                return true;
            }
        }

        return false;
    }

    const handleCropSelect = (item_id: string) => {
        setCropName(item_id);

        const baseWeight = plantBaseValue[item_id];
        if (typeof baseWeight === 'number') {
            setMass(baseWeight.toString());
        }
    };

    const calculatePrice = () => {
        if (!cropName || !mass) {
            toast({ title: "Missing Information", description: "Please select a crop and enter weight.", variant: "destructive" });
            return;
        }
        const massNum = parseFloat(mass);
        if (isNaN(massNum) || massNum <= 0) {
            toast({ title: "Invalid Weight", description: "Weight must be a positive number.", variant: "destructive" });
            return;
        }

        const calculateBaseValue = (cropId: string, mass: number) => {
            const specifics = plantCalculationData[cropId];
            const threshold = plantBaseValue[cropId];

            if (!specifics || typeof threshold !== 'number') {
                return mass ** 2; // Fallback
            }

            return mass <= threshold
                ? specifics.tier1Value
                : specifics.tier2Multiplier * (mass ** 2);
        };

        const baseValue = calculateBaseValue(cropName, massNum);

        let growthMultiplier = 1;
        if (variantMutation) {
            growthMultiplier = growthMutations.find(m => m.value === variantMutation)?.multiplier ?? 1;
        }

        let otherModifiersSum = 0;
        let otherModifiersCount = 0;
        let mutationListForDisplay = [];
        const activeMutations = [
            weatherMutation,
            ...Object.keys(regularMutations).filter(key => regularMutations[key])
        ].filter(Boolean);

        activeMutations.forEach(key => {
            const data = environmentalMutationData[key];
            if (data) {
                otherModifiersSum += data.multiplier;
                otherModifiersCount++;
                mutationListForDisplay.push(data.label);
            }
        });

        const otherModifiersFlawedMultiplier = (otherModifiersCount > 0)
            ? (otherModifiersSum - otherModifiersCount + 1)
            : 1;

        const friendMultipliers = [1.0, 1.1, 1.2, 1.3, 1.4, 1.5];
        const friendMultiplier = friendMultipliers[friendCount];
        const plantAmount = 1;

        const totalPrice = Math.ceil(
            baseValue *
            growthMultiplier *
            otherModifiersFlawedMultiplier *
            friendMultiplier *
            plantAmount
        );

        setCalculationResult({
            totalPrice,
            breakdown: {
                basePrice: baseValue,
                mass: massNum,
                variant: growthMutations.find(m => m.value === variantMutation)?.label || 'None',
                mutations: mutationListForDisplay
            }
        });

        toast({
            title: "Calculation Complete",
            description: `Total price: ${totalPrice.toLocaleString()} Sheckles`,
        });
    };

    // REVERSE CALCULATION LOGIC
    const calculateWeightFromValue = () => {
        if (!cropName || !targetValue) {
            toast({ title: "Missing Information", description: "Please select a crop and enter a target price.", variant: "destructive" });
            return;
        }

        // Sanitize input by removing commas and convert to number
        const targetPriceNum = parseFloat(targetValue.replace(/,/g, ''));
        if (isNaN(targetPriceNum) || targetPriceNum <= 0) {
            toast({ title: "Invalid Price", description: "Please enter a valid, positive target price.", variant: "destructive" });
            return;
        }

        // Step 1: Calculate the total multiplier using the same flawed logic
        const friendMultipliers = [1.0, 1.1, 1.2, 1.3, 1.4, 1.5];
        const friendMultiplier = friendMultipliers[friendCount];

        let growthMultiplier = 1;
        if (variantMutation) {
            growthMultiplier = growthMutations.find(m => m.value === variantMutation)?.multiplier ?? 1;
        }

        let otherModifiersSum = 0;
        let otherModifiersCount = 0;
        const activeMutations = [weatherMutation, ...Object.keys(regularMutations).filter(key => regularMutations[key])].filter(Boolean);
        activeMutations.forEach(key => {
            const data = environmentalMutationData[key];
            if (data) {
                otherModifiersSum += data.multiplier;
                otherModifiersCount++;
            }
        });
        const otherModifiersFlawedMultiplier = (otherModifiersCount > 0) ? (otherModifiersSum - otherModifiersCount + 1) : 1;

        const plantAmount = 1; // Assuming 1 for reverse calculation

        const totalMultiplier = friendMultiplier * growthMultiplier * otherModifiersFlawedMultiplier * plantAmount;

        if (totalMultiplier === 0) {
            toast({ title: "Calculation Error", description: "Total multiplier is zero, cannot estimate weight.", variant: "destructive" });
            return;
        }

        // Step 2: Isolate the RequiredBaseValue
        const requiredBaseValue = targetPriceNum / totalMultiplier;

        // Step 3: Isolate the Weight from the RequiredBaseValue
        const cropCalcData = plantCalculationData[cropName];
        if (!cropCalcData) {
            setReverseCalcResult('No calculation data for this crop.');
            return;
        }
        const plantUniqueMultiplier = cropCalcData.tier2Multiplier;

        if (plantUniqueMultiplier === 0) {
            setReverseCalcResult('Cannot estimate for fixed-price crops.');
            return;
        }

        const estimatedWeightSquared = requiredBaseValue / plantUniqueMultiplier;
        if (estimatedWeightSquared < 0) {
            setReverseCalcResult('Target value is too low for these modifiers.');
            return;
        }
        const estimatedWeight = Math.sqrt(estimatedWeightSquared);

        // Step 4: Handle the Two-Tier System
        const weightThreshold = plantBaseValue[cropName];
        if (typeof weightThreshold !== 'number') {
            setReverseCalcResult('No weight threshold found for this crop.');
            return;
        }

        if (estimatedWeight <= weightThreshold) {
            // The price corresponds to the fixed Tier 1 value, so the weight is indeterminate.
            setReverseCalcResult(`≤ ${weightThreshold.toFixed(3)} kg`);
        } else {
            // The price corresponds to the Tier 2 formula, our estimate is valid.
            setReverseCalcResult(`≈ ${estimatedWeight.toFixed(3)} kg`);
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-1 mx-auto w-full px-2 sm:px-4 md:px-8">
            <Card>
                <CardHeader>
                    <CardTitle>🍉 Fruit Price Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <Label>Crop Type</Label>
                        <Input
                            type="text"
                            placeholder="Search for a crop..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="mb-2"
                        />
                        <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto border rounded-lg p-2">
                            {filteredCrops.map((crop) => (
                                <Button
                                    key={crop.item_id}
                                    variant={cropName === crop.item_id ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleCropSelect(crop.item_id)}
                                    className="justify-start h-auto p-2 flex items-center gap-2"
                                >
                                    <img 
                                        src={`${IMAGEKIT_URL}/${crop.item_id}.png`}
                                        alt={crop.display_name} 
                                        className="w-5 h-5 object-cover" 
                                        onError={(e) => e.currentTarget.src = `${IMAGEKIT_URL}/place_holder_crop.png`} 
                                    />
                                    <span className="text-xs">{crop.display_name}</span>
                                </Button>
                            ))}
                        </div>
                        {cropName && (
                            <Badge variant="secondary">
                                Selected: {staticCropData.find(c => c.item_id === cropName)?.display_name}
                            </Badge>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Weight (kg)</Label>
                        <Input
                            type="number"
                            value={mass}
                            onChange={(e) => setMass(e.target.value)}
                            placeholder="Enter weight in kilograms"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <Separator />

                    {/* Variant Mutations (Single-select) */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Variant Mutation (Choose One)</Label>
                        <div className="flex flex-wrap gap-2">
                            <Button variant={variantMutation === '' ? 'default' : 'outline'} size="sm" onClick={() => setVariantMutation('')}>None</Button>
                            {growthMutations.map((mutation) => (
                                <Button
                                    key={mutation.value}
                                    variant={variantMutation === mutation.value ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setVariantMutation(mutation.value)}
                                    disabled={mutation.value === 'Ripe' && cropName !== 'sugarapple'}
                                >
                                    {mutation.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Weather Mutations (Single-select) */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Weather Mutation (Choose One)</Label>
                        <div className="flex flex-wrap gap-2">
                            <Button variant={weatherMutation === '' ? 'default' : 'outline'} size="sm" onClick={() => setWeatherMutation('')}>None</Button>
                            {Object.entries(environmentalMutationData).filter(([_, data]) => ["wet", "chilled", "drenched", "frozen"].includes(_)).map(([key, data]) => (
                                <Button key={key} variant={weatherMutation === key ? 'default' : 'outline'} size="sm" onClick={() => setWeatherMutation(key)}>{data.label} (x{data.multiplier})</Button>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Regular Mutations (Multi-select) */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Mutations (Multiple Allowed)</Label>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(environmentalMutationData).filter(([key, _]) => !["wet", "chilled", "drenched", "frozen"].includes(key)).map(([key, data]) => (
                                <Button
                                    key={key}
                                    variant={regularMutations[key] ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleMutationChange(key)}
                                    disabled={isMutationDisabled(key)}
                                >
                                    {data.label} (x{data.multiplier})
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Friend Multiplier */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-base font-semibold">🥰 Friend Bonus</Label>
                            <Badge variant="secondary">{friendCount} {friendCount === 1 ? 'Friend' : 'Friends'} (+{friendCount * 10}%)</Badge>
                        </div>

                        <Slider
                            value={[friendCount]}
                            onValueChange={(value) => setFriendCount(value[0])}
                            min={0}
                            max={5}
                            step={1}
                        />
                    </div>

                    <Button
                        onClick={calculatePrice}
                        className="w-full"
                        disabled={!cropName || !mass}>
                        Calculate Price
                    </Button>
                </CardContent>
            </Card>
            {/* Calculation Results */}
            <Card>
                <CardHeader><CardTitle>Calculation Results</CardTitle></CardHeader>
                <CardContent>
                    {calculationResult ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">{calculationResult.totalPrice.toLocaleString()}</div>
                                <div className="text-muted-foreground">Sheckles</div>
                            </div>
                            <Separator />
                            <div className="space-y-4">
                                <h3 className="font-semibold">Calculation Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Crop:</span>
                                        <span className="font-medium">{staticCropData.find(c => c.item_id === cropName)?.display_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Weight:</span>
                                        <span className="font-medium">{calculationResult.breakdown.mass} kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Calculated Base Value:</span>
                                        <span className="font-medium">{calculationResult.breakdown.basePrice.toLocaleString()}</span>
                                    </div>
                                    {calculationResult.breakdown.variant && (
                                        <div className="flex justify-between">
                                            <span>Variant:</span>
                                            <span className="font-medium">{calculationResult.breakdown.variant}</span>
                                        </div>
                                    )}
                                    {calculationResult.breakdown.mutations.length > 0 && (
                                        <div className="flex justify-between">
                                            <span>Mutations:</span>
                                            <span className="font-medium text-right">{calculationResult.breakdown.mutations.join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                                <Separator />
                                <div className="space-y-2 text-xs text-muted-foreground">
                                    <div className="font-semibold text-sm text-primary">Formula Used:</div>
                                    <div className="bg-muted rounded p-2">
                                        <span className="font-mono">CEILING [ Base Value * Variant * (1 + Sum of Mods - Count of Mods) * Friends * Amount ]</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Select a crop and enter weight to calculate the price.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Reverse Calculator */}
            <Card>
                <CardHeader>
                    <CardTitle>⚖️ Weight Estimator (Reverse Calculator)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Target Price</Label>
                        <Input
                            type="text" // Use text to allow commas
                            value={targetValue}
                            onChange={(e) => setTargetValue(e.target.value)}
                            placeholder="e.g., 1,000,000"
                        />
                        <p className="text-xs text-muted-foreground">
                            Enter a target price to estimate the required weight. Uses the same crop and modifiers selected above.
                        </p>
                    </div>
                    <Button
                        onClick={calculateWeightFromValue}
                        className="w-full"
                        disabled={!cropName || !targetValue}
                    >
                        Estimate Weight
                    </Button>
                    {reverseCalcResult && (
                        <div className="text-center pt-4">
                            <div className="text-lg font-bold text-primary">
                                {reverseCalcResult}
                            </div>
                            <div className="text-muted-foreground">Estimated Required Weight</div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Calculation Explanation */}
            <Card>
                <CardHeader>
                    <CardTitle>How is this calculated?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold">Fruit Value Calculation</h3>
                        <p className="text-sm text-muted-foreground">
                            The total price of a fruit is determined by a formula that takes into account its base value, any variant mutations, other applied mutations, and a friend bonus.
                        </p>
                        <div className="bg-muted rounded p-2 mt-2">
                            <span className="font-mono text-xs">CEILING [ Base Value * Variant * (1 + Sum of Mods - Count of Mods) * Friends * Amount ]</span>
                        </div>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li><strong>Base Value:</strong> Each fruit has a base value that is calculated based on its weight. This value is not linear and has two tiers.</li>
                            <li><strong>Variant:</strong> Special variants like 'Gold' or 'Rainbow' apply a significant multiplier to the base value.</li>
                            <li><strong>Mutations:</strong> Each mutation has its own multiplier. The formula uses a unique calculation where the sum of all mutation multipliers has the number of mutations subtracted from it before being applied.</li>
                            <li><strong>Friend Bonus:</strong> You get a bonus for each friend who is nearby, up to a maximum.</li>
                            <li><strong>Amount:</strong> The number of fruits being sold.</li>
                        </ul>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="font-semibold">Weight Estimator (Reverse Calculator)</h3>
                        <p className="text-sm text-muted-foreground">
                            The weight estimator works by reversing the calculation. It takes your desired final price and works backward to determine the necessary weight to achieve it.
                        </p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            <li>It first calculates the total multiplier from all selected variants, mutations, and bonuses.</li>
                            <li>Then, it determines the required 'Base Value' by dividing the target price by this total multiplier.</li>
                            <li>Finally, it reverses the base value calculation to find the corresponding weight. Since the base value has two tiers, the result might be an exact weight or a value less than or equal to the threshold of the first tier.</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};