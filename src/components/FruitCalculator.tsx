import { useState, useMemo } from 'react';
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
    { item_id: "easteregg", display_name: "Easteregg" }, { item_id: "moonflower", display_name: "Moonflower" }, { item_id: "starfruit", display_name: "Starfruit" }, { item_id: "pepper", display_name: "Pepper" }, { item_id: "grape", display_name: "Grape" }, { item_id: "nightshade", display_name: "Nightshade" }, { item_id: "mint", display_name: "Mint" }, { item_id: "glowshroom", display_name: "Glowshroom" }, { item_id: "bloodbanana", display_name: "Bloodbanana" }, { item_id: "beanstalk", display_name: "Beanstalk" }, { item_id: "coconut", display_name: "Coconut" }, { item_id: "candyblossom", display_name: "Candyblossom" }, { item_id: "carrot", display_name: "Carrot" }, { item_id: "strawberry", display_name: "Strawberry" }, { item_id: "blueberry", display_name: "Blueberry" }, { item_id: "orangetulip", display_name: "Orangetulip" }, { item_id: "tomato", display_name: "Tomato" }, { item_id: "daffodil", display_name: "Daffodil" }, { item_id: "watermelon", display_name: "Watermelon" }, { item_id: "pumpkin", display_name: "Pumpkin" }, { item_id: "mushroom", display_name: "Mushroom" }, { item_id: "bamboo", display_name: "Bamboo" }, { item_id: "apple", display_name: "Apple" }, { item_id: "corn", display_name: "Corn" }, { item_id: "cactus", display_name: "Cactus" }, { item_id: "cranberry", display_name: "Cranberry" }, { item_id: "moonmelon", display_name: "Moonmelon" }, { item_id: "durian", display_name: "Durian" }, { item_id: "peach", display_name: "Peach" }, { item_id: "cacao", display_name: "Cacao" }, { item_id: "moonglow", display_name: "Moonglow" }, { item_id: "dragonfruit", display_name: "Dragonfruit" }, { item_id: "mango", display_name: "Mango" }, { item_id: "moonblossom", display_name: "Moonblossom" }, { item_id: "raspberry", display_name: "Raspberry" }, { item_id: "eggplant", display_name: "Eggplant" }, { item_id: "papaya", display_name: "Papaya" }, { item_id: "celestiberry", display_name: "Celestiberry" }, { item_id: "moonmango", display_name: "Moonmango" }, { item_id: "passionfruit", display_name: "Passionfruit" }, { item_id: "soulfruit", display_name: "Soulfruit" }, { item_id: "chocolatecarrot", display_name: "Chocolatecarrot" }, { item_id: "redlolipop", display_name: "Redlolipop" }, { item_id: "candysunflower", display_name: "Candysunflower" }, { item_id: "lotus", display_name: "Lotus" }, { item_id: "pineapple", display_name: "Pineapple" }, { item_id: "hive", display_name: "Hive" }, { item_id: "lilac", display_name: "Lilac" }, { item_id: "rose", display_name: "Rose" }, { item_id: "foxglove", display_name: "Foxglove" }, { item_id: "purpledahlia", display_name: "Purpledahlia" }, { item_id: "sunflower", display_name: "Sunflower" }, { item_id: "pinklily", display_name: "Pinklily" }, { item_id: "nectarine", display_name: "Nectarine" }, { item_id: "honeysuckle", display_name: "Honeysuckle" }, { item_id: "lavender", display_name: "Lavender" }, { item_id: "venusflytrap", display_name: "Venusflytrap" }, { item_id: "nectarshade", display_name: "Nectarshade" }, { item_id: "manuka", display_name: "Manuka" }, { item_id: "emberlily", display_name: "Emberlily" }, { item_id: "dandelion", display_name: "Dandelion" }, { item_id: "lumira", display_name: "Lumira" }, { item_id: "cocovine", display_name: "Cocovine" }, { item_id: "succulent", display_name: "Succulent" }, { item_id: "beebalm", display_name: "Beebalm" }, { item_id: "nectarthorn", display_name: "Nectarthorn" }, { item_id: "violetcorn", display_name: "Violetcorn" }, { item_id: "bendboo", display_name: "Bendboo" }, { item_id: "crocus", display_name: "Crocus" }, { item_id: "sugarapple", display_name: "Sugarapple" }, { item_id: "cursedfruit", display_name: "Cursedfruit" }, { item_id: "suncoil", display_name: "Suncoil" }, { item_id: "dragonpepper", display_name: "Dragonpepper" }, { item_id: "cauliflower", display_name: "Cauliflower" }, { item_id: "avocado", display_name: "Avocado" }, { item_id: "kiwi", display_name: "Kiwi" }, { item_id: "greenapple", display_name: "Greenapple" }, { item_id: "banana", display_name: "Banana" }, { item_id: "pricklypear", display_name: "Pricklypear" }, { item_id: "feijoa", display_name: "Feijoa" }, { item_id: "loquat", display_name: "Loquat" }, { item_id: "wildcarrot", display_name: "Wildcarrot" }, { item_id: "pear", display_name: "Pear" }, { item_id: "cantaloupe", display_name: "Cantaloupe" }, { item_id: "parasolflower", display_name: "Parasolflower" }, { item_id: "rosydelight", display_name: "Rosydelight" }, { item_id: "elephantears", display_name: "Elephantears" }, { item_id: "bellpepper", display_name: "Bellpepper" }, { item_id: "aloevera", display_name: "Aloevera" }, { item_id: "peacelily", display_name: "Peacelily" }, { item_id: "travelersfruit", display_name: "Travelersfruit" }, { item_id: "delphinium", display_name: "Delphinium" }, { item_id: "lilyofthevalley", display_name: "Lilyofthevalley" }, { item_id: "guanabana", display_name: "Guanabana" }, { item_id: "pitcherplant", display_name: "Pitcherplant" }, { item_id: "rafflesia", display_name: "Rafflesia" }, { item_id: "fireworkflower", display_name: "Fireworkflower" }, { item_id: "libertylily", display_name: "Libertylily" }, { item_id: "boneblossom", display_name: "Boneblossom" }, { item_id: "horneddinoshroom", display_name: "Horneddinoshroom" }, { item_id: "fireflyfern", display_name: "Fireflyfern" }, { item_id: "stonebite", display_name: "Stonebite" }, { item_id: "boneboo", display_name: "Boneboo" }, { item_id: "paradisepetal", display_name: "Paradisepetal" }, { item_id: "burningbud", display_name: "Burningbud" }, { item_id: "fossilight", display_name: "Fossilight" }, { item_id: "amberspine", display_name: "Amberspine" }, { item_id: "grandvolcania", display_name: "Grandvolcania" }, { item_id: "lingonberry", display_name: "Lingonberry" }, { item_id: "giantpinecone", display_name: "Giantpinecone" }, { item_id: "horsetail", display_name: "Horsetail" }, { item_id: "monoblooma", display_name: "Monoblooma" }, { item_id: "spikedmango", display_name: "Spikedmango" }, { item_id: "taroflower", display_name: "Taroflower" }, { item_id: "serenity", display_name: "Serenity" }, { item_id: "zenflare", display_name: "Zenflare" }, { item_id: "zenrocks", display_name: "Zenrocks" }, { item_id: "hinomai", display_name: "Hinomai" }, { item_id: "mapleapple", display_name: "Mapleapple" }, { item_id: "softsunshine", display_name: "Softsunshine" }
].map(crop => ({
    ...crop,
    image: `/Crops/${crop.item_id.replace(/ /g, '_')}.png`
}));

interface EnvironmentalMutationData {
    label: string;
    multiplier: number;
}

export const FruitCalculator = () => {
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

    const filteredCrops = useMemo(() => {
        return staticCropData.filter(crop =>
            crop.display_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const growthMutations = [
        { value: 'Ripe', label: 'Ripe (x2)', multiplier: 2 },
        { value: 'Gold', label: 'Gold (x20)', multiplier: 20 },
        { value: 'Rainbow', label: 'Rainbow (x50)', multiplier: 50 }
    ];

    const environmentalMutationData: { [key: string]: EnvironmentalMutationData } = {
        wet: { label: 'Wet', multiplier: 2 },
        chilled: { label: 'Chilled', multiplier: 2 },
        drenched: { label: 'Drenched', multiplier: 5 },
        frozen: { label: 'Frozen', multiplier: 10 },
        windstruck: { label: 'Windstruck', multiplier: 2 },
        twisted: { label: 'Twisted', multiplier: 5 },
        tempestous: { label: 'Tempestous', multiplier: 12 },
        bloodlit: { label: 'Bloodlit', multiplier: 4 },
        moonlit: { label: 'Moonlit', multiplier: 2 },
        choc: { label: 'Choc', multiplier: 2 },
        aurora: { label: 'Aurora', multiplier: 90 },
        shocked: { label: 'Shocked', multiplier: 100 },
        celestial: { label: 'Celestial', multiplier: 120 },
        pollinated: { label: 'Pollinated', multiplier: 3 },
        burnt: { label: 'Burnt', multiplier: 4 },
        verdant: { label: 'Verdant', multiplier: 4 },
        cloudtouched: { label: 'Cloudtouched', multiplier: 5 },
        honeyglazed: { label: 'HoneyGlazed', multiplier: 5 },
        plasma: { label: 'Plasma', multiplier: 5 },
        heavenly: { label: 'Heavenly', multiplier: 5 },
        fried: { label: 'Fried', multiplier: 8 },
        cooked: { label: 'Cooked', multiplier: 10 },
        zombified: { label: 'Zombified', multiplier: 25 },
        molten: { label: 'Molten', multiplier: 25 },
        sundried: { label: 'Sundried', multiplier: 85 },
        paradisal: { label: 'Paradisal', multiplier: 100 },
        alienlike: { label: 'Alienlike', multiplier: 100 },
        galactic: { label: 'Galactic', multiplier: 120 },
        disco: { label: 'Disco', multiplier: 125 },
        voidtouched: { label: 'Voidtouched', multiplier: 135 },
        dawnbound: { label: 'Dawnbound', multiplier: 150 },
        sandy: { label: 'Sandy', multiplier: 3 },
        clay: { label: 'Clay', multiplier: 5 },
        ceramic: { label: 'Ceramic', multiplier: 30 },
        amber: { label: 'Amber', multiplier: 10 },
        oldamber: { label: 'OldAmber', multiplier: 20 },
        ancientamber: { label: 'AncientAmber', multiplier: 50 },
        friendbound: { label: 'Friendbound', multiplier: 70 },
        infected: { label: 'Infected', multiplier: 75 },
        tranquil: { label: 'Tranquil', multiplier: 20 },
        chakra: { label: 'Chakra', multiplier: 8 },
        toxic: { label: 'Toxic', multiplier: 12 },
        radioactive: { label: 'Radioactive', multiplier: 80 },
        foxfire: { label: 'Foxfire', multiplier: 90 },
    };

    const conflictGroups: { [key: string]: string[] } = {
        burnt: ["cooked"],
        cooked: ["burnt"],
        gold: ["rainbow"],
        rainbow: ["gold"],
        amber: ["ancientamber", "oldamber"],
        ancientamber: ["amber", "oldamber"],
        oldamber: ["amber", "ancientamber"],
        clay: ["ceramic", "sandy", "wet"],
        ceramic: ["clay"],
        sandy: ["clay"],
        wet: ["clay"],
        frozen: ["wet", "drenched", "chilled"],
        tempestuous: ["windstruck", "twisted"],
        foxfire: ["chakra"],
        chakra: ["foxfire"]
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
        const plantBaseValue: { [key: string]: number } = {
            'easteregg': 2.85, 'moonflower': 1.9, 'starfruit': 2.85, 'pepper': 4.75, 'grape': 2.85, 'nightshade': 0.48, 'mint': 0.95, 'glowshroom': 0.7, 'bloodbanana': 1.42, 'beanstalk': 9.5, 'coconut': 13.31, 'candyblossom': 2.85, 'carrot': 0.24, 'strawberry': 0.29, 'blueberry': 0.17, 'orangetulip': 0.0499, 'tomato': 0.44, 'daffodil': 0.16, 'watermelon': 7.3, 'pumpkin': 6.9, 'mushroom': 25.9, 'bamboo': 3.8, 'apple': 2.85, 'corn': 1.9, 'cactus': 6.65, 'cranberry': 0.95, 'moonmelon': 7.6, 'durian': 7.6, 'peach': 1.9, 'cacao': 7.6, 'moonglow': 6.65, 'dragonfruit': 11.38, 'mango': 14.28, 'moonblossom': 2.85, 'raspberry': 0.71, 'eggplant': 4.75, 'papaya': 2.86, 'celestiberry': 1.9, 'moonmango': 14.25, 'passionfruit': 2.867, 'soulfruit': 23.75, 'chocolatecarrot': 0.2616, 'redlolipop': 3.7988, 'candysunflower': 1.428, 'lotus': 18.99, 'pineapple': 2.85, 'hive': 7.59, 'lilac': 2.846, 'rose': 0.95, 'foxglove': 1.9, 'purpledahlia': 11.4, 'sunflower': 15.65, 'pinklily': 5.699, 'nectarine': 2.807, 'honeysuckle': 11.4, 'lavender': 0.25, 'venusflytrap': 9.5, 'nectarshade': 0.75, 'manuka': 0.289, 'emberlily': 11.4, 'dandelion': 3.79, 'lumira': 5.69, 'cocovine': 13.3, 'succulent': 4.75, 'beebalm': 0.94, 'nectarthorn': 5.76, 'violetcorn': 2.85, 'bendboo': 17.09, 'crocus': 0.285, 'sugarapple': 8.55, 'cursedfruit': 22.9, 'suncoil': 9.5, 'dragonpepper': 5.69, 'cauliflower': 4.74, 'avocado': 3.32, 'kiwi': 4.75, 'greenapple': 2.85, 'banana': 1.42, 'pricklypear': 6.65, 'feijoa': 9.5, 'loquat': 6.17, 'wildcarrot': 0.286, 'pear': 2.85, 'cantaloupe': 5.22, 'parasolflower': 5.7, 'rosydelight': 9.5, 'elephantears': 17.1, 'bellpepper': 7.61, 'aloevera': 5.22, 'peacelily': 0.5, 'travelersfruit': 11.4, 'delphinium': 0.285, 'lilyofthevalley': 5.69, 'guanabana': 3.8, 'pitcherplant': 11.4, 'rafflesia': 7.6, 'fireworkflower': 19, 'libertylily': 6.176, 'boneblossom': 2.85, 'horneddinoshroom': 4.94, 'fireflyfern': 4.77, 'stonebite': 0.94, 'boneboo': 14.5, 'paradisepetal': 2.85, 'burningbud': 11.4, 'fossilight': 3.79, 'amberspine': 5.7, 'grandvolcania': 6.65, 'lingonberry': 0.485, 'giantpinecone': 5.14, 'horsetail': 2.85, 'monoblooma': 0.477, 'spikedmango': 14.25, 'taroflower': 6.64, 'serenity': 0.24, 'zenflare': 1.34, 'zenrocks': 17.1, 'hinomai': 9.5, 'mapleapple': 2.85, 'softsunshine': 1.9
        };
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

        const plantBaseValue: { [key: string]: number } = {
            'easteregg': 2.85, 'moonflower': 1.9, 'starfruit': 2.85, 'pepper': 4.75, 'grape': 2.85, 'nightshade': 0.48, 'mint': 0.95, 'glowshroom': 0.7, 'bloodbanana': 1.42, 'beanstalk': 9.5, 'coconut': 13.31, 'candyblossom': 2.85, 'carrot': 0.24, 'strawberry': 0.29, 'blueberry': 0.17, 'orangetulip': 0.0499, 'tomato': 0.44, 'daffodil': 0.16, 'watermelon': 7.3, 'pumpkin': 6.9, 'mushroom': 25.9, 'bamboo': 3.8, 'apple': 2.85, 'corn': 1.9, 'cactus': 6.65, 'cranberry': 0.95, 'moonmelon': 7.6, 'durian': 7.6, 'peach': 1.9, 'cacao': 7.6, 'moonglow': 6.65, 'dragonfruit': 11.38, 'mango': 14.28, 'moonblossom': 2.85, 'raspberry': 0.71, 'eggplant': 4.75, 'papaya': 2.86, 'celestiberry': 1.9, 'moonmango': 14.25, 'passionfruit': 2.867, 'soulfruit': 23.75, 'chocolatecarrot': 0.2616, 'redlolipop': 3.7988, 'candysunflower': 1.428, 'lotus': 18.99, 'pineapple': 2.85, 'hive': 7.59, 'lilac': 2.846, 'rose': 0.95, 'foxglove': 1.9, 'purpledahlia': 11.4, 'sunflower': 15.65, 'pinklily': 5.699, 'nectarine': 2.807, 'honeysuckle': 11.4, 'lavender': 0.25, 'venusflytrap': 9.5, 'nectarshade': 0.75, 'manuka': 0.289, 'emberlily': 11.4, 'dandelion': 3.79, 'lumira': 5.69, 'cocovine': 13.3, 'succulent': 4.75, 'beebalm': 0.94, 'nectarthorn': 5.76, 'violetcorn': 2.85, 'bendboo': 17.09, 'crocus': 0.285, 'sugarapple': 8.55, 'cursedfruit': 22.9, 'suncoil': 9.5, 'dragonpepper': 5.69, 'cauliflower': 4.74, 'avocado': 3.32, 'kiwi': 4.75, 'greenapple': 2.85, 'banana': 1.42, 'pricklypear': 6.65, 'feijoa': 9.5, 'loquat': 6.17, 'wildcarrot': 0.286, 'pear': 2.85, 'cantaloupe': 5.22, 'parasolflower': 5.7, 'rosydelight': 9.5, 'elephantears': 17.1, 'bellpepper': 7.61, 'aloevera': 5.22, 'peacelily': 0.5, 'travelersfruit': 11.4, 'delphinium': 0.285, 'lilyofthevalley': 5.69, 'guanabana': 3.8, 'pitcherplant': 11.4, 'rafflesia': 7.6, 'fireworkflower': 19, 'libertylily': 6.176, 'boneblossom': 2.85, 'horneddinoshroom': 4.94, 'fireflyfern': 4.77, 'stonebite': 0.94, 'boneboo': 14.5, 'paradisepetal': 2.85, 'burningbud': 11.4, 'fossilight': 3.79, 'amberspine': 5.7, 'grandvolcania': 6.65, 'lingonberry': 0.485, 'giantpinecone': 5.14, 'horsetail': 2.85, 'monoblooma': 0.477, 'spikedmango': 14.25, 'taroflower': 6.64, 'serenity': 0.24, 'zenflare': 1.34, 'zenrocks': 17.1, 'hinomai': 9.5, 'mapleapple': 2.85, 'softsunshine': 1.9
        };

        const plantCalculationData: { [key: string]: { tier1Value: number; tier2Multiplier: number } } = {
            'easteregg': { tier1Value: 2256, tier2Multiplier: 277.825 }, 'moonflower': { tier1Value: 8574, tier2Multiplier: 2381 }, 'starfruit': { tier1Value: 13538, tier2Multiplier: 1666.6 }, 'pepper': { tier1Value: 7220, tier2Multiplier: 320 }, 'grape': { tier1Value: 7085, tier2Multiplier: 872 }, 'nightshade': { tier1Value: 3159, tier2Multiplier: 13850 }, 'mint': { tier1Value: 4738, tier2Multiplier: 5230 }, 'glowshroom': { tier1Value: 271, tier2Multiplier: 532.5 }, 'bloodbanana': { tier1Value: 5415, tier2Multiplier: 2670 }, 'beanstalk': { tier1Value: 25270, tier2Multiplier: 280 }, 'coconut': { tier1Value: 361, tier2Multiplier: 2.04 }, 'candyblossom': { tier1Value: 90250, tier2Multiplier: 11111.11111 }, 'carrot': { tier1Value: 18, tier2Multiplier: 275 }, 'strawberry': { tier1Value: 14, tier2Multiplier: 165 }, 'blueberry': { tier1Value: 18, tier2Multiplier: 500 }, 'orangetulip': { tier1Value: 767, tier2Multiplier: 300000 }, 'tomato': { tier1Value: 27, tier2Multiplier: 120 }, 'daffodil': { tier1Value: 903, tier2Multiplier: 25000 }, 'watermelon': { tier1Value: 2708, tier2Multiplier: 61.25 }, 'pumpkin': { tier1Value: 3069, tier2Multiplier: 64 }, 'mushroom': { tier1Value: 136278, tier2Multiplier: 241.6 }, 'bamboo': { tier1Value: 3610, tier2Multiplier: 250 }, 'apple': { tier1Value: 248, tier2Multiplier: 30.53 }, 'corn': { tier1Value: 36, tier2Multiplier: 10 }, 'cactus': { tier1Value: 3069, tier2Multiplier: 69.4 }, 'cranberry': { tier1Value: 1805, tier2Multiplier: 2000 }, 'moonmelon': { tier1Value: 16245, tier2Multiplier: 281.2 }, 'durian': { tier1Value: 6317, tier2Multiplier: 109.37 }, 'peach': { tier1Value: 271, tier2Multiplier: 75 }, 'cacao': { tier1Value: 10830, tier2Multiplier: 187.5 }, 'moonglow': { tier1Value: 18050, tier2Multiplier: 408.45 }, 'dragonfruit': { tier1Value: 4287, tier2Multiplier: 32.99 }, 'mango': { tier1Value: 5866, tier2Multiplier: 28.89 }, 'moonblossom': { tier1Value: 60166, tier2Multiplier: 7407.4 }, 'raspberry': { tier1Value: 90, tier2Multiplier: 177.5 }, 'eggplant': { tier1Value: 6769, tier2Multiplier: 300 }, 'papaya': { tier1Value: 903, tier2Multiplier: 111.11 }, 'celestiberry': { tier1Value: 9025, tier2Multiplier: 2500 }, 'moonmango': { tier1Value: 45125, tier2Multiplier: 222.22 }, 'passionfruit': { tier1Value: 3204, tier2Multiplier: 395 }, 'soulfruit': { tier1Value: 6994, tier2Multiplier: 12.4 }, 'chocolatecarrot': { tier1Value: 9928, tier2Multiplier: 145096 }, 'redlolipop': { tier1Value: 45125, tier2Multiplier: 3125 }, 'candysunflower': { tier1Value: 72200, tier2Multiplier: 35413 }, 'lotus': { tier1Value: 15343, tier2Multiplier: 42.5 }, 'pineapple': { tier1Value: 1805, tier2Multiplier: 222.5 }, 'hive': { tier1Value: 55955, tier2Multiplier: 969 }, 'lilac': { tier1Value: 31588, tier2Multiplier: 3899 }, 'rose': { tier1Value: 4513, tier2Multiplier: 5000 }, 'foxglove': { tier1Value: 18050, tier2Multiplier: 5000 }, 'purpledahlia': { tier1Value: 67688, tier2Multiplier: 522 }, 'sunflower': { tier1Value: 144000, tier2Multiplier: 587.78 }, 'pinklily': { tier1Value: 58663, tier2Multiplier: 1806.5 }, 'nectarine': { tier1Value: 35000, tier2Multiplier: 4440 }, 'lavender': { tier1Value: 22563, tier2Multiplier: 361008 }, 'honeysuckle': { tier1Value: 90250, tier2Multiplier: 694.3 }, 'venusflytrap': { tier1Value: 76712, tier2Multiplier: 850 }, 'nectarshade': { tier1Value: 45125, tier2Multiplier: 78500 }, 'manuka': { tier1Value: 22563, tier2Multiplier: 270000 }, 'emberlily': { tier1Value: 50138, tier2Multiplier: 385.6 }, 'dandelion': { tier1Value: 45125, tier2Multiplier: 3130 }, 'lumira': { tier1Value: 76713, tier2Multiplier: 2362.5 }, 'crocus': { tier1Value: 27075, tier2Multiplier: 333333 }, 'suncoil': { tier1Value: 72200, tier2Multiplier: 800 }, 'beebalm': { tier1Value: 16245, tier2Multiplier: 18033.333 }, 'nectarthorn': { tier1Value: 30083, tier2Multiplier: 906.36 }, 'violetcorn': { tier1Value: 45125, tier2Multiplier: 5555.555 }, 'bendboo': { tier1Value: 138988, tier2Multiplier: 478.5 }, 'succulent': { tier1Value: 22563, tier2Multiplier: 1000 }, 'sugarapple': { tier1Value: 43320, tier2Multiplier: 592.6 }, 'cursedfruit': { tier1Value: 15000, tier2Multiplier: 28.6 }, 'cocovine': { tier1Value: 60166, tier2Multiplier: 340 }, 'dragonpepper': { tier1Value: 80000, tier2Multiplier: 2470 }, 'cauliflower': { tier1Value: 36, tier2Multiplier: 1.6 }, 'avocado': { tier1Value: 80, tier2Multiplier: 7.24 }, 'greenapple': { tier1Value: 271, tier2Multiplier: 33.36 }, 'kiwi': { tier1Value: 2482, tier2Multiplier: 110 }, 'banana': { tier1Value: 1805, tier2Multiplier: 893.3 }, 'pricklypear': { tier1Value: 6319, tier2Multiplier: 142.9 }, 'feijoa': { tier1Value: 11733, tier2Multiplier: 130 }, 'loquat': { tier1Value: 7220, tier2Multiplier: 189.65 }, 'wildcarrot': { tier1Value: 22563, tier2Multiplier: 275000 }, 'pear': { tier1Value: 18050, tier2Multiplier: 2217.5 }, 'cantaloupe': { tier1Value: 30685, tier2Multiplier: 1124 }, 'parasolflower': { tier1Value: 180500, tier2Multiplier: 5555.555 }, 'rosydelight': { tier1Value: 62273, tier2Multiplier: 690 }, 'elephantears': { tier1Value: 69492, tier2Multiplier: 237.6 }, 'bellpepper': { tier1Value: 4964, tier2Multiplier: 85.6 }, 'aloevera': { tier1Value: 56858, tier2Multiplier: 2085.25 }, 'peacelily': { tier1Value: 16666, tier2Multiplier: 66666 }, 'travelersfruit': { tier1Value: 48085, tier2Multiplier: 369.77777 }, 'delphinium': { tier1Value: 21660, tier2Multiplier: 266666 }, 'lilyofthevalley': { tier1Value: 44331, tier2Multiplier: 1365 }, 'guanabana': { tier1Value: 63626, tier2Multiplier: 4406.23 }, 'pitcherplant': { tier1Value: 28800, tier2Multiplier: 222.222 }, 'rafflesia': { tier1Value: 3159, tier2Multiplier: 54.65 }, 'libertylily': { tier1Value: 27075, tier2Multiplier: 710 }, 'fireworkflower': { tier1Value: 136278, tier2Multiplier: 377.5 }, 'boneblossom': { tier1Value: 180500, tier2Multiplier: 22222.22222 }, 'horneddinoshroom': { tier1Value: 67218, tier2Multiplier: 2760 }, 'fireflyfern': { tier1Value: 64980, tier2Multiplier: 2880 }, 'stonebite': { tier1Value: 31545, tier2Multiplier: 35175 }, 'boneboo': { tier1Value: 131967, tier2Multiplier: 627.5 }, 'paradisepetal': { tier1Value: 22563, tier2Multiplier: 3305 }, 'burningbud': { tier1Value: 63175, tier2Multiplier: 486 }, 'fossilight': { tier1Value: 79420, tier2Multiplier: 5505 }, 'horsetail': { tier1Value: 27075, tier2Multiplier: 3333.33333 }, 'giantpinecone': { tier1Value: 64980, tier2Multiplier: 2875 }, 'lingonberry': { tier1Value: 31588, tier2Multiplier: 139000 }, 'grandvolcania': { tier1Value: 63676, tier2Multiplier: 1440 }, 'amberspine': { tier1Value: 49638, tier2Multiplier: 1527.5 }, 'monoblooma': { tier1Value: 19855, tier2Multiplier: 88250 }, 'serenity': { tier1Value: 31588, tier2Multiplier: 560000 }, 'softsunshine': { tier1Value: 40613, tier2Multiplier: 11250 }, 'taroflower': { tier1Value: 108300, tier2Multiplier: 2451 }, 'spikedmango': { tier1Value: 60919, tier2Multiplier: 300 }, 'zenrocks': { tier1Value: 135375, tier2Multiplier: 462.78 }, 'hinomai': { tier1Value: 72200, tier2Multiplier: 800 }, 'mapleapple': { tier1Value: 51521, tier2Multiplier: 6343 }, 'zenflare': { tier1Value: 22563, tier2Multiplier: 12771 }
        };

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
                                    <img src={crop.image} alt={crop.display_name} className="w-5 h-5 object-cover" onError={(e) => e.currentTarget.src = '/Crops/place_holder_crop.png'} />
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
                                <Button key={mutation.value} variant={variantMutation === mutation.value ? 'default' : 'outline'} size="sm" onClick={() => setVariantMutation(mutation.value)}>{mutation.label}</Button>
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
                            <Label className="text-base font-semibold">Friend Bonus</Label>
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
        </div>
    );
};