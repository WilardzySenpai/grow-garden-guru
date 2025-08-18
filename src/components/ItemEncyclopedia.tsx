import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu, Search, X } from 'lucide-react';
import { ItemCard } from '@/components/ItemCard';
import { ItemContextMenu } from '@/components/ItemContextMenu';
import { FullItemView } from '@/components/FullItemView';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';

import type { ItemInfo, WeatherData } from '@/types/api';
import type { PetInfo } from '@/types/pet';
import { supabase } from '@/integrations/supabase/client';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

export const ItemEncyclopedia = () => {
    const isMobile = useIsMobile();
    const { user } = useAuth();
    
    // Initialize tabs from URL hash
    const getInitialTabs = () => {
        const hash = window.location.hash.replace('#', '');
        const parts = hash.split('/');
        const mainTab = parts[0] || 'items';
        const subTab = parts[1] || 'all';
        
        const validMainTabs = ['items', 'crops', 'mutations', 'weather', 'pets'];
        const validSubTabs = ['all', 'seeds', 'gear', 'eggs', 'cosmetics', 'event', 'merchant'];
        
        return {
            mainTab: validMainTabs.includes(mainTab) ? mainTab : 'items',
            subTab: validSubTabs.includes(subTab) ? subTab : 'all'
        };
    };
    
    const { mainTab: initialMainTab, subTab: initialSubTab } = getInitialTabs();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState(initialMainTab);
    const [activeSubTab, setActiveSubTab] = useState(initialSubTab);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<ItemInfo[]>([]);
    const [weatherItems, setWeatherItems] = useState<WeatherData[]>([]);
    const [pets, setPets] = useState<PetInfo[]>([]);
    const [userCropChecklist, setUserCropChecklist] = useState<Record<string, boolean>>({});

    // Context menu and full item view states
    const [contextMenu, setContextMenu] = useState<{
        isOpen: boolean;
        position: { x: number; y: number };
        item: ItemInfo | null;
    }>({ isOpen: false, position: { x: 0, y: 0 }, item: null });
    
    const [fullItemView, setFullItemView] = useState<{
        isOpen: boolean;
        item: ItemInfo | null;
    }>({ isOpen: false, item: null });

    // For zoom modal
    const [zoomedPetImg, setZoomedPetImg] = useState<string | null>(null);
    const [zoomedPetName, setZoomedPetName] = useState<string | null>(null);
    // Admin refresh state
    const [refreshing, setRefreshing] = useState(false);
    // TODO: Replace with your actual admin check logic
    const isAdmin = Boolean(localStorage.getItem('isAdmin'));

    // Handler to clear search
    const handleClearSearch = () => setSearchTerm('');

    // Handle tab changes - update both state and URL hash
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        const subTab = tab === 'items' ? activeSubTab : 'all';
        window.location.hash = `${tab}/${subTab}`;
    };

    const handleSubTabChange = (subTab: string) => {
        setActiveSubTab(subTab);
        window.location.hash = `${activeTab}/${subTab}`;
    };

    // Listen for hash changes (browser back/forward)
    useEffect(() => {
        const handleHashChange = () => {
            const { mainTab, subTab } = getInitialTabs();
            setActiveTab(mainTab);
            setActiveSubTab(subTab);
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Handle item right-click
    const handleItemRightClick = (e: React.MouseEvent, item: ItemInfo) => {
        e.preventDefault();
        setContextMenu({
            isOpen: true,
            position: { x: e.clientX, y: e.clientY },
            item
        });
    };

    // Close context menu
    const closeContextMenu = () => {
        setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, item: null });
    };

    // Open full item view
    const openFullItemView = (item: ItemInfo) => {
        setFullItemView({ isOpen: true, item });
    };

    // Close full item view
    const closeFullItemView = () => {
        setFullItemView({ isOpen: false, item: null });
    };

    useEffect(() => {
        fetchEncyclopediaData();
        if (user && !('isGuest' in user)) {
            loadUserCropChecklist();
        }
    }, [user]);

    const loadUserCropChecklist = async () => {
        if (!user || 'isGuest' in user) return;
        
        try {
            const { data, error } = await supabase
                .from('user_crop_checklist')
                .select('crop_item_id, is_planted')
                .eq('user_id', user.id);
            
            if (error) throw error;
            
            const checklistMap: Record<string, boolean> = {};
            data?.forEach(item => {
                checklistMap[item.crop_item_id] = item.is_planted;
            });
            setUserCropChecklist(checklistMap);
        } catch (err) {
            console.error('Failed to load crop checklist:', err);
        }
    };

    const toggleCropChecklist = async (cropId: string, isPlanted: boolean) => {
        if (!user || 'isGuest' in user) return;
        
        try {
            const { error } = await supabase
                .from('user_crop_checklist')
                .upsert({
                    user_id: user.id,
                    crop_item_id: cropId,
                    is_planted: isPlanted,
                    planted_at: isPlanted ? new Date().toISOString() : null
                }, { onConflict: 'user_id,crop_item_id' });
            
            if (error) throw error;
            
            setUserCropChecklist(prev => ({
                ...prev,
                [cropId]: isPlanted
            }));
            
            toast({
                title: isPlanted ? "✅ Crop planted!" : "❌ Crop removed",
                description: `${cropId} has been ${isPlanted ? 'added to' : 'removed from'} your checklist.`
            });
        } catch (err) {
            console.error('Failed to update crop checklist:', err);
            toast({
                title: "Error",
                description: "Failed to update crop checklist.",
                variant: "destructive"
            });
        }
    };

    const fetchEncyclopediaData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Try API first
            let itemsData = [];
            let petsData = [];
            let weatherData = { weather: [] };
            let apiSuccess = true;
            try {
                const itemsResponse = await fetch('https://api.joshlei.com/v2/growagarden/info/', {
                    headers: {
                        'Jstudio-key': import.meta.env.VITE_JSTUDIO_KEY,
                        'Content-Type': 'application/json'
                    }
                });
                if (!itemsResponse.ok) throw new Error('Items API error');
                itemsData = await itemsResponse.json();

                const petsResponse = await fetch('https://api.joshlei.com/v2/growagarden/info?type=pet', {
                    headers: {
                        'Jstudio-key': import.meta.env.VITE_JSTUDIO_KEY,
                        'Content-Type': 'application/json'
                    }
                });
                if (!petsResponse.ok) throw new Error('Pets API error');
                petsData = await petsResponse.json();

                const weatherResponse = await fetch('https://api.joshlei.com/v2/growagarden/weather', {
                    headers: {
                        'Jstudio-key': import.meta.env.VITE_JSTUDIO_KEY,
                        'Content-Type': 'application/json'
                    }
                });
                if (!weatherResponse.ok) throw new Error('Weather API error');
                weatherData = await weatherResponse.json();
            } catch (apiErr) {
                apiSuccess = false;
                console.warn('API fetch failed, falling back to Supabase cache:', apiErr);
            }

            if (apiSuccess) {
                setItems(Array.isArray(itemsData) ? itemsData : []);
                setPets(Array.isArray(petsData) ? petsData : []);
                setWeatherItems(weatherData.weather || []);
                console.log('ItemEncyclopedia: Data loaded from API');
            } else {
                // Fallback: fetch from Supabase
                try {
                    // Use shared Supabase client
                    const { data: itemsCache } = await supabase.from('items').select('*');
                    setItems(Array.isArray(itemsCache) ? itemsCache : []);
                    const { data: petsCache } = await supabase.from('pets').select('*');
                    setPets(Array.isArray(petsCache) ? petsCache : []);
                    const { data: weatherCache } = await supabase.from('weather').select('*');
                    setWeatherItems(Array.isArray(weatherCache) ? weatherCache : []);
                    console.log('ItemEncyclopedia: Data loaded from Supabase cache');
                } catch (cacheErr) {
                    setError('Failed to fetch encyclopedia data from API and cache');
                    toast({
                        title: "Encyclopedia Error",
                        description: "Failed to load encyclopedia data",
                        variant: "destructive"
                    });
                }
            }
        } catch (error) {
            console.error('ItemEncyclopedia: Failed to fetch data:', error);
            setError('Failed to fetch encyclopedia data');
            toast({
                title: "Encyclopedia Error",
                description: "Failed to load encyclopedia data",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const mutations = [
        // Growth Mutations - Standard
        {
            name: 'Ripe',
            multiplier: 'x2',
            obtainment: ['Has a rare chance to replace the normal variant', 'Can stack with Gold or Rainbow', 'Sugar Apple only'],
            visualDescription: 'Purple in color, fading darker towards the bottom',
            type: 'standard',
            category: 'growth',
            cropSpecific: 'Sugar Apple'
        },
        {
            name: 'Gold',
            multiplier: 'x20',
            obtainment: ['1% chance to grow replacing the normal variant', 'Can be applied by the Dragonfly pet'],
            visualDescription: 'Shining, Golden in color, will emit a shimmering sound',
            type: 'standard',
            category: 'growth'
        },
        {
            name: 'Rainbow',
            multiplier: 'x50',
            obtainment: ['0.1% chance to grow replacing the normal variant', 'Can be applied by the Butterfly pet when a crop has 5+ mutations (removes all previous mutations)'],
            visualDescription: 'Continuously changes color, emits yellow particles and a rainbow above it',
            type: 'standard',
            category: 'growth'
        },
        // Environmental Mutations - Standard
        {
            name: 'Wet',
            multiplier: 'x2',
            obtainment: ['During Rain or Thunderstorm', 'Small chance from sprinklers', 'Can be applied by Sea Turtle', 'During admin event Under The Sea'],
            visualDescription: 'Dripping with water particles',
            type: 'standard',
            category: 'environmental'
        },
        {
            name: 'Windstruck',
            multiplier: 'x2',
            obtainment: ['During Windy weather', 'During Gale weather'],
            visualDescription: 'Has wind gusts swoop around the crop',
            type: 'standard',
            category: 'environmental'
        },
        {
            name: 'Moonlit',
            multiplier: 'x2',
            obtainment: ['During Night weather', 'Max of 6 plants being moonlit every 2 minutes during Night'],
            visualDescription: 'Glowing purple aroma, purple in color',
            type: 'standard',
            category: 'environmental'
        },
        {
            name: 'Chilled',
            multiplier: 'x2',
            obtainment: ['During Frost weather', 'Can be applied by Polar Bear', 'Can be applied using Mutation Spray Chilled'],
            visualDescription: 'Slightly bluish in color, emits frost particles',
            type: 'standard',
            category: 'environmental'
        },
        {
            name: 'Choc',
            multiplier: 'x3',
            obtainment: ['From Chocolate Sprinkler', 'During Chocolate Rain', 'Using Mutation Choc Spray'],
            visualDescription: 'Brown in color, dripping with chocolate syrup',
            type: 'standard',
            category: 'environmental'
        },
        {
            name: 'Bloodlit',
            multiplier: 'x4',
            obtainment: ['During Blood Moon (chance to replace Night every 4 hours)'],
            visualDescription: 'Shining, red in color',
            type: 'standard',
            category: 'environmental'
        },
        {
            name: 'Twisted',
            multiplier: 'x5',
            obtainment: ['During Tornado weather'],
            visualDescription: 'Has tornado-like swirls coming out of it, similar to Windstruck',
            type: 'standard',
            category: 'environmental'
        },
        {
            name: 'Drenched',
            multiplier: 'x5',
            obtainment: ['Given to crops during Tropical Rain'],
            visualDescription: 'Large water droplets fall from the crop',
            type: 'standard',
            category: 'environmental'
        },
        {
            name: 'Frozen',
            multiplier: 'x10',
            obtainment: ['If a crop has both Wet and Chilled mutations', 'Can be applied by Polar Bear', 'Can be applied by Flower Froster Sprinkler (flowers only)'],
            visualDescription: 'Encased in an ice block',
            type: 'standard',
            category: 'environmental'
        },
        {
            name: 'Aurora',
            multiplier: 'x90',
            obtainment: ['Given during Aurora Borealis weather'],
            visualDescription: 'Pulses between blues and purples, releases faint smoke from above the crop',
            type: 'standard',
            category: 'environmental'
        },
        {
            name: 'Shocked',
            multiplier: 'x100',
            obtainment: ['When a crop is struck during Thunderstorm', 'When a crop is struck during Jandel Storm', 'Using Mutation Spray Shocked'],
            visualDescription: 'Neon, won\'t have the classic studded texture',
            type: 'standard',
            category: 'environmental'
        },
        {
            name: 'Celestial',
            multiplier: 'x120',
            obtainment: ['When a crop is struck during Meteor Shower'],
            visualDescription: 'Slightly reflectant, sparkling yellow and purple',
            type: 'standard',
            category: 'environmental'
        },
        // Limited Mutations
        {
            name: 'Pollinated',
            multiplier: 'x3',
            obtainment: ['During Bee Swarm or Worker Bee Swarm', 'Can be applied by certain bee pets', 'Using Mutation Spray Pollinated'],
            visualDescription: 'Shining, yellow in color, emits yellow gas-like particles',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'Burnt',
            multiplier: 'x4',
            obtainment: ['Can be applied by Cooked Owl pet', 'Can be applied by Mutation Spray Burnt'],
            visualDescription: 'Black in color when unharvested (sparking), emits ash particles when harvested',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'Verdant',
            multiplier: 'x4',
            obtainment: ['Small chance to be applied by Scarlet Macaw pet'],
            visualDescription: 'Green in color, emits green rectangular particles',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'Wiltproof',
            multiplier: 'x4',
            obtainment: ['Obtainable in Drought weather'],
            visualDescription: 'Unknown visual appearance',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'Cloudtouched',
            multiplier: 'x5',
            obtainment: ['Can be applied by Mutation Spray Cloudtouched', 'Small chance to be applied by Hyacinth Macaw pet'],
            visualDescription: 'Cloud-like aura all around',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'HoneyGlazed',
            multiplier: 'x5',
            obtainment: ['From Honey Sprinkler', 'Can be applied by Bear Bee pet'],
            visualDescription: 'Emits yellow fog, dripping in honey',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'Plasma',
            multiplier: 'x5',
            obtainment: ['During Laser Storm/Jandel Laser (admin only)'],
            visualDescription: 'Neon, pinkish purple in color, emits flashing red glints',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'Heavenly',
            multiplier: 'x5',
            obtainment: ['During Floating Jandel event (admin only)'],
            visualDescription: 'Emits golden, shining stars from the base',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'Fried',
            multiplier: 'x8',
            obtainment: ['During Fried Chicken event'],
            visualDescription: 'Small yellow particles fall from the crop',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'Cooked',
            multiplier: 'x25',
            obtainment: ['Small chance to be applied by Cooked Owl pet'],
            visualDescription: 'Orange in color, emits white steam and red swirls',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'Zombified',
            multiplier: 'x25',
            obtainment: ['Can be applied by Chicken Zombie pet'],
            visualDescription: 'Emits green fog, dripping with green liquid',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'Molten',
            multiplier: 'x25',
            obtainment: ['During Volcano event'],
            visualDescription: 'Neon, orange/yellow/red in color',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'Sundried',
            multiplier: 'x85',
            obtainment: ['During Heatwave event', 'Can redirect with Tanning Mirror'],
            visualDescription: 'Dark brown tint applied',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'Paradisal',
            multiplier: 'x100',
            obtainment: ['Occurs when a plant is both Verdant and Sundried', 'Replaces both mutations'],
            visualDescription: 'Lime green in color, emits sun ray-like particles',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'Alienlike',
            multiplier: 'x100',
            obtainment: ['During Alien Invasion event'],
            visualDescription: 'Cyan in color, cyan particles emitted, parts can be transparent/invisible',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'Galactic',
            multiplier: 'x120',
            obtainment: ['During Space Travel event'],
            visualDescription: 'Light purple/pink in color, some areas are neon, glimmers pink sparkles',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'Disco',
            multiplier: 'x125',
            obtainment: ['During Disco event (admin only)', 'Can be applied by Disco Bee pet'],
            visualDescription: 'Shining, flashing red/pink/yellow/green/blue constantly',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'Voidtouched',
            multiplier: 'x135',
            obtainment: ['During Black Hole event (admin only)'],
            visualDescription: 'Emits black hole particles',
            type: 'limited',
            category: 'environmental'
        },
        {
            name: 'Dawnbound',
            multiplier: 'x150',
            obtainment: ['During Sun God event with 4 players holding 4 Sunflowers touching in front of Sun God', 'Sunflower only'],
            visualDescription: 'Glows pure white',
            type: 'limited',
            category: 'environmental',
            cropSpecific: 'Sunflower'
        }
    ];

    // Crop categories data structure
    const cropCategories = {
        'Berry Plants': [
            'elderstrawberry', 'lingonberry', 'strawberry', 'white_mulberry', 
            'celestiberry', 'raspberry', 'grape', 'blueberry'
        ],
        'Blossom Type Plants': [
            'bone_blossom', 'candy_blossom', 'moon_blossom', 'cherry_blossom'
        ],
        'Candy Type Plants': [
            'sugarglaze', 'candy_blossom', 'easter_egg', 'blue_lollipop', 
            'candy_sunflower', 'chocolate_carrot', 'red_lollipop'
        ],
        'Flower Type Plants': [
            'candy_blossom', 'burning_bud', 'veinpetal', 'ember_lily', 
            'honeysuckle', 'sunflower', 'moon_blossom', 'cherry_blossom'
        ],
        'Fruit Type Crops': [
            'grandtomato', 'sugar_apple', 'crownmelon', 'moon_melon', 
            'lingonberry', 'maple_apple', 'banana', 'pineapple'
        ],
        'Fungus Type Crops': [
            'mushroom', 'horned_dinoshroom', 'glowshroom', 'nectarshade'
        ],
        'Leafy Type Crops': [
            'grandtomato', 'sugar_apple', 'twistedtangle', 'giant_pinecone', 
            'beanstalk', 'honeysuckle', 'sunflower', 'spiked_mango'
        ],
        'Night Type Crops': [
            'moon_melon', 'moon_blossom', 'moon_mango', 'starfruit', 
            'celestiberry', 'blood_banana', 'mint', 'moonflower'
        ],
        'Prehistoric Plants': [
            'bone_blossom', 'amber_spine', 'lingonberry', 'grand_volcania', 
            'horned_dinoshroom', 'horsetail', 'fossilight', 'firefly_fern'
        ],
        'Prickly Fruits': [
            'pricklefruit', 'twistedtangle', 'spiked_mango', 'venus_fly_trap', 
            'horned_dinoshroom', 'pineapple', 'prickly_pear', 'dragon_fruit'
        ],
        'Sour Type Crops': [
            'lemon', 'starfruit', 'passionfruit', 'cranberry'
        ],
        'Spicy Type Crops': [
            'jalapeno', 'ember_lily', 'dragon_pepper', 'bell_pepper', 
            'pepper', 'grand_volcania', 'horned_dinoshroom', 'cacao'
        ],
        'Stalky Type Crops': [
            'spring_onion', 'sugarglaze', 'burning_bud', 'veinpetal', 
            'tallasparagus', 'beanstalk', 'elephant_ears', 'grand_volcania'
        ],
        'Summer Crops': [
            'butternut_squash', 'sugar_apple', 'bell_pepper', 'banana', 
            'elephant_ears', 'tomato', 'prickly_pear', 'pineapple'
        ],
        'Sweet Type Crops': [
            'sugarglaze', 'candy_blossom', 'sugar_apple', 'crownmelon', 
            'moon_melon', 'spiked_mango', 'banana'
        ],
        'Toxic Type Crops': [
            'foxglove', 'nightshade'
        ],
        'Tropical Type Crops': [
            'banana', 'pineapple', 'coconut', 'mango', 'cocovine', 
            'dragon_fruit', 'parasol_flower', 'starfruit'
        ],
        'Vegetable Type Crops': [
            'king_cabbage', 'grandtomato', 'rhubarb', 'tallasparagus', 
            'jalapeno', 'beanstalk', 'dragon_pepper', 'violet_corn'
        ],
        'Woody Type Crops': [
            'rhubarb', 'giant_pinecone', 'maple_apple', 'moon_blossom', 
            'mango', 'coconut', 'peach', "traveler's_fruit"
        ],
        'Zen Type Fruit': [
            'tranquilbloom', 'spiked_mango', 'maple_apple', 'serenity', 
            'enkaku', 'hinomai', 'luckybamboo', 'taro_flower'
        ]
    };

    // Filter functions with null safety
    const filteredItems = items.filter(item =>
        (item.display_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.item_id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.type?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.rarity?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const filteredMutations = mutations.filter(mutation =>
        mutation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mutation.obtainment.some(method => method.toLowerCase().includes(searchTerm.toLowerCase())) ||
        mutation.visualDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredWeather = weatherItems.filter(weather =>
        (weather.weather_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (weather.weather_id?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const filteredPets = pets.filter(pet =>
        pet.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.rarity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate totalResults for current tab
    const totalResults =
      activeTab === 'items' ? filteredItems.length :
      activeTab === 'mutations' ? filteredMutations.length :
      activeTab === 'weather' ? filteredWeather.length :
      activeTab === 'pets' ? filteredPets.length : 0;

    // Category filters
    const seedItems = filteredItems.filter(item => item.type === 'seed');
    const gearItems = filteredItems.filter(item => item.type === 'gear');
    const eggItems = filteredItems.filter(item => item.type === 'egg');
    const cosmeticItems = filteredItems.filter(item => item.type === 'cosmetic');
    const eventItems = filteredItems.filter(item => item.type === 'event');

    const standardMutations = filteredMutations.filter(m => m.type === 'standard');
    const limitedMutations = filteredMutations.filter(m => m.type === 'limited');
    const growthMutations = filteredMutations.filter(m => m.category === 'growth');
    const environmentalMutations = filteredMutations.filter(m => m.category === 'environmental');

    // Pet category filters (now all from API)
    const obtainablePets = filteredPets;
    const unobtainablePets = [];
    const commonPets = filteredPets.filter(pet => pet.rarity === 'Common');
    const uncommonPets = filteredPets.filter(pet => pet.rarity === 'Uncommon');
    const rarePets = filteredPets.filter(pet => pet.rarity === 'Rare');
    const legendaryPets = filteredPets.filter(pet => pet.rarity === 'Legendary');
    const mythicalPets = filteredPets.filter(pet => pet.rarity === 'Mythical');
    const divinePets = filteredPets.filter(pet => pet.rarity === 'Divine');
    const unknownPets = filteredPets.filter(pet => pet.rarity === 'Unknown');

    const renderItemTable = (itemList: ItemInfo[]) => {
        if (isMobile) {
            return (
                <div className="space-y-4 pb-4">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                        <div className="space-y-4 px-2">
                            {itemList.map((item) => (
                                <div
                                    key={item.item_id}
                                    onContextMenu={(e) => handleItemRightClick(e, item)}
                                >
                                    <ItemCard item={item} />
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            );
        }

        return (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Rarity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Currency</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {itemList.map((item) => (
                            <TableRow 
                                key={item.item_id} 
                                className="hover:bg-accent/50 cursor-pointer"
                                onContextMenu={(e) => handleItemRightClick(e, item)}
                                onClick={() => openFullItemView(item)}
                            >
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={item.icon}
                                            alt={item.display_name}
                                            className="w-8 h-8 object-contain"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                        {item.display_name}
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-xs">{item.item_id}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{item.type}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{item.rarity}</Badge>
                                </TableCell>
                                <TableCell>{item.price || 'N/A'}</TableCell>
                                <TableCell>{item.currency || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    };

    const renderMutationTable = (mutationList: typeof mutations) => (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Multiplier</TableHead>
                        <TableHead>Obtainment Methods</TableHead>
                        <TableHead>Visual Description</TableHead>
                        <TableHead>Special Notes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mutationList.map((mutation) => (
                        <TableRow key={mutation.name} className="hover:bg-accent/50">
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-accent rounded border flex items-center justify-center text-xs">
                                        🧬
                                    </div>
                                    {mutation.name}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={mutation.multiplier.startsWith('x') ? 'default' : 'secondary'}>
                                    {mutation.multiplier}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    {mutation.obtainment.map((method, index) => (
                                        <div key={index} className="text-sm bg-muted/50 px-2 py-1 rounded">
                                            {method}
                                        </div>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                                <p className="text-sm">{mutation.visualDescription}</p>
                            </TableCell>
                            <TableCell>
                                {mutation.cropSpecific && (
                                    <Badge variant="outline" className="mb-1">
                                        {mutation.cropSpecific} Only
                                    </Badge>
                                )}
                                {mutation.type === 'limited' && (
                                    <Badge variant="destructive">Limited</Badge>
                                )}
                                {mutation.category === 'growth' && (
                                    <Badge variant="secondary">Growth</Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );

    const renderWeatherTable = (weatherList: WeatherData[]) => (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Weather</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {weatherList.map((weather) => (
                        <TableRow key={weather.weather_id} className="hover:bg-accent/50">
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={weather.icon}
                                        alt={weather.weather_name}
                                        className="w-8 h-8 object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                    {weather.weather_name}
                                </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs">{weather.weather_id}</TableCell>
                            <TableCell>{weather.duration}s</TableCell>
                            <TableCell>
                                <Badge variant={weather.active ? "default" : "secondary"}>
                                    {weather.active ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );

    // Pet images now come from API, so getPetImage is not needed

    const renderPetTable = (petList: typeof pets) => (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Pet</TableHead>
                        <TableHead>Rarity</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {petList.map((pet) => (
                        <TableRow key={pet.item_id} className="hover:bg-accent/50">
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={pet.icon}
                                        alt={pet.display_name}
                                        className="w-8 h-8 object-contain bg-accent rounded border cursor-zoom-in"
                                        onClick={() => {
                                            setZoomedPetImg(pet.icon);
                                            setZoomedPetName(pet.display_name);
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                                            if (fallback) fallback.style.display = 'flex';
                                        }}
                                    />
                                    <div style={{ display: 'none' }} className="w-8 h-8 bg-accent rounded border flex items-center justify-center text-xs">
                                        🐾
                                    </div>
                                    {pet.display_name}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={
                                    pet.rarity === 'Common' ? 'outline' :
                                        pet.rarity === 'Uncommon' ? 'secondary' :
                                            pet.rarity === 'Rare' ? 'default' :
                                                pet.rarity === 'Legendary' ? 'destructive' :
                                                    pet.rarity === 'Mythical' ? 'destructive' :
                                                        pet.rarity === 'Divine' ? 'destructive' :
                                                            'outline'
                                }>
                                    {pet.rarity}
                                </Badge>
                            </TableCell>
                            <TableCell className="max-w-md">
                                <p className="text-sm">{pet.description}</p>
                            </TableCell>
                            <TableCell>
                                {pet.price ? (
                                    <span className="text-sm">{pet.price}</span>
                                ) : (
                                    <span className="text-muted-foreground text-xs">N/A</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* Pet Zoom Modal */}
            {zoomedPetImg && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 cursor-zoom-out"
                    onClick={() => { setZoomedPetImg(null); setZoomedPetName(null); }}
                >
                    <div
                        className="relative flex flex-col items-center"
                        onClick={e => e.stopPropagation()}
                    >
                        <img
                            src={zoomedPetImg}
                            alt={zoomedPetName || 'Pet'}
                            className="max-w-[90vw] max-h-[80vh] rounded-lg border-2 border-white shadow-2xl bg-white"
                            style={{ objectFit: 'contain', background: 'white' }}
                        />
                        <button
                            className="mt-4 px-4 py-2 rounded bg-accent text-foreground border shadow hover:bg-accent/80"
                            onClick={() => { setZoomedPetImg(null); setZoomedPetName(null); }}
                        >
                            Close
                        </button>
                        {zoomedPetName && (
                            <div className="mt-2 text-lg font-semibold text-white drop-shadow-lg text-center">
                                {zoomedPetName}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <Card>
                <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">Loading encyclopedia data...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">📚</span>
                                <CardTitle className="text-2xl">Encyclopedia</CardTitle>
                                {isAdmin && (
                                    <Button
                                        variant="outline"
                                        className="ml-4"
                                        disabled={refreshing}
                                        onClick={async () => {
                                            setRefreshing(true);
                                            try {
                                                // Call backend endpoint to trigger sync
                                                const resp = await fetch('/api/admin/sync-cache', { method: 'POST' });
                                                if (!resp.ok) throw new Error('Sync failed');
                                                toast({ title: 'Cache Updated', description: 'Encyclopedia cache refreshed.' });
                                                await fetchEncyclopediaData();
                                            } catch (err) {
                                                toast({ title: 'Sync Error', description: 'Failed to refresh cache.', variant: 'destructive' });
                                            } finally {
                                                setRefreshing(false);
                                            }
                                        }}
                                    >
                                        {refreshing ? 'Refreshing...' : 'Refresh Cache'}
                                    </Button>
                                )}
                            </div>
                        </div>
                        <Badge variant="secondary" className="h-6">
                            {filteredItems.length + filteredMutations.length + filteredWeather.length + filteredPets.length} results
                        </Badge>
                    </div>
                    <div className="relative">
                        <Input
                            placeholder="Search items, mutations, weather..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-secondary/50 border-0"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-muted-foreground text-sm">
                                {searchTerm ? '755 results' : 'Type to search...'}
                            </span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {error && (
                    <Card className="border-red-500/50 bg-red-500/10 mb-6">
                        <CardContent className="py-4">
                            <p className="text-center text-red-600 text-sm">
                                ❌ {error}
                            </p>
                        </CardContent>
                    </Card>
                )}

                <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
                    {isMobile ? (
                        <div className="space-y-4">
                            {/* Primary Category Selection */}
                            <Select value={activeTab} onValueChange={handleTabChange}>
                                <SelectTrigger className="w-full bg-background border-2">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="w-full bg-background border-2">
                                    <SelectGroup>
                                        <SelectLabel>Categories</SelectLabel>
                                         <SelectItem value="items">📦 Items ({filteredItems.length})</SelectItem>
                                         <SelectItem value="crops">🌱 Crop Categories</SelectItem>
                                         <SelectItem value="mutations">🧬 Mutations ({filteredMutations.length})</SelectItem>
                                         <SelectItem value="weather">🌦️ Weather ({filteredWeather.length})</SelectItem>
                                         <SelectItem value="pets">🐾 Pets ({filteredPets.length})</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {/* Secondary Category Selection - Only show if primary category is selected */}
                            {activeTab === 'items' && (
                                <Select value={activeSubTab} onValueChange={handleSubTabChange}>
                                    <SelectTrigger className="w-full bg-background border-2">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full bg-background border-2">
                                        <SelectGroup>
                                            <SelectLabel>Item Types</SelectLabel>
                                            <SelectItem value="all">All Items ({filteredItems.length})</SelectItem>
                                            <SelectItem value="seeds">Seeds ({seedItems.length})</SelectItem>
                                            <SelectItem value="gear">Gear ({gearItems.length})</SelectItem>
                                            <SelectItem value="eggs">Eggs ({eggItems.length})</SelectItem>
                                            <SelectItem value="cosmetics">Cosmetics ({cosmeticItems.length})</SelectItem>
                                            <SelectItem value="events">Event Items ({eventItems.length})</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    ) : (
                        <TabsList>
                             <TabsTrigger value="items">
                                 📦 Items ({filteredItems.length})
                             </TabsTrigger>
                             <TabsTrigger value="crops">
                                 🌱 Crop Categories
                             </TabsTrigger>
                             <TabsTrigger value="mutations">
                                 🧬 Mutations ({filteredMutations.length})
                             </TabsTrigger>
                             <TabsTrigger value="weather">
                                 🌦️ Weather ({filteredWeather.length})
                             </TabsTrigger>
                             <TabsTrigger value="pets">
                                 🐾 Pets ({filteredPets.length})
                             </TabsTrigger>
                        </TabsList>
                    )}

                    <TabsContent value="items">
                        <Tabs value={activeSubTab} onValueChange={handleSubTabChange} className="space-y-6">
                            {isMobile ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full">
                                            <Menu className="h-4 w-4 mr-2" />
                                            {activeSubTab.charAt(0).toUpperCase() + activeSubTab.slice(1)}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        <DropdownMenuItem onSelect={() => handleSubTabChange('all')}>All ({filteredItems.length})</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleSubTabChange('seeds')}>Seeds ({seedItems.length})</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleSubTabChange('gear')}>Gear ({gearItems.length})</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleSubTabChange('eggs')}>Eggs ({eggItems.length})</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleSubTabChange('cosmetics')}>Cosmetics ({cosmeticItems.length})</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleSubTabChange('events')}>Events ({eventItems.length})</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <TabsList>
                                    <TabsTrigger value="all">
                                        All ({filteredItems.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="seeds">
                                        Seeds ({seedItems.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="gear">
                                        Gear ({gearItems.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="eggs">
                                        Eggs ({eggItems.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="cosmetics">
                                        Cosmetics ({cosmeticItems.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="events">
                                        Events ({eventItems.length})
                                    </TabsTrigger>
                                </TabsList>
                            )}

                            <TabsContent value="all">
                                {renderItemTable(filteredItems)}
                            </TabsContent>
                            <TabsContent value="seeds">
                                {renderItemTable(seedItems)}
                            </TabsContent>
                            <TabsContent value="gear">
                                {renderItemTable(gearItems)}
                            </TabsContent>
                            <TabsContent value="eggs">
                                {renderItemTable(eggItems)}
                            </TabsContent>
                            <TabsContent value="cosmetics">
                                {renderItemTable(cosmeticItems)}
                            </TabsContent>
                            <TabsContent value="events">
                                {renderItemTable(eventItems)}
                            </TabsContent>
                         </Tabs>
                     </TabsContent>

                     <TabsContent value="crops">
                         <div className="space-y-6">
                             {Object.entries(cropCategories).map(([categoryName, crops]) => (
                                 <Card key={categoryName}>
                                     <CardHeader>
                                         <CardTitle className="flex items-center gap-2">
                                             <span className="text-lg">🌱</span>
                                             {categoryName}
                                             <Badge variant="secondary">{crops.length} crops</Badge>
                                         </CardTitle>
                                     </CardHeader>
                                     <CardContent>
                                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                             {crops.map((cropId) => {
                                                 const cropItem = items.find(item => 
                                                     item.item_id === cropId || 
                                                     item.display_name?.toLowerCase().replace(/\s+/g, '_') === cropId ||
                                                     item.display_name?.toLowerCase().replace(/\s+/g, '') === cropId.replace(/_/g, '')
                                                 );
                                                 const isPlanted = userCropChecklist[cropId] || false;
                                                 const isLoggedIn = user && !('isGuest' in user);
                                                 
                                                 return (
                                                     <div key={cropId} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                                                         {cropItem ? (
                                                             <>
                                                                 <img
                                                                     src={cropItem.icon}
                                                                     alt={cropItem.display_name}
                                                                     className="w-8 h-8 object-contain"
                                                                     onError={(e) => {
                                                                         e.currentTarget.style.display = 'none';
                                                                     }}
                                                                 />
                                                                 <div className="flex-1">
                                                                     <div className="font-medium">{cropItem.display_name}</div>
                                                                     <div className="text-sm text-muted-foreground">{cropItem.rarity}</div>
                                                                 </div>
                                                             </>
                                                         ) : (
                                                             <>
                                                                 <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-xs">🌱</div>
                                                                 <div className="flex-1">
                                                                     <div className="font-medium capitalize">{cropId.replace(/_/g, ' ')}</div>
                                                                     <div className="text-sm text-muted-foreground">Not found in database</div>
                                                                 </div>
                                                             </>
                                                         )}
                                                         {isLoggedIn && (
                                                             <div className="flex items-center gap-2">
                                                                 <Checkbox
                                                                     checked={isPlanted}
                                                                     onCheckedChange={(checked) => toggleCropChecklist(cropId, !!checked)}
                                                                     className="h-5 w-5"
                                                                 />
                                                                 <span className="text-sm text-muted-foreground">
                                                                     {isPlanted ? "Planted" : "Not planted"}
                                                                 </span>
                                                             </div>
                                                         )}
                                                         {!isLoggedIn && (
                                                             <div className="text-sm text-muted-foreground">Login to track</div>
                                                         )}
                                                     </div>
                                                 );
                                             })}
                                         </div>
                                         {user && !('isGuest' in user) && (
                                             <div className="mt-4 text-sm text-muted-foreground">
                                                 Progress: {crops.filter(cropId => userCropChecklist[cropId]).length} / {crops.length} planted
                                                 <div className="w-full bg-muted rounded-full h-2 mt-2">
                                                     <div 
                                                         className="bg-primary h-2 rounded-full transition-all duration-300"
                                                         style={{ 
                                                             width: `${(crops.filter(cropId => userCropChecklist[cropId]).length / crops.length) * 100}%` 
                                                         }}
                                                     />
                                                 </div>
                                             </div>
                                         )}
                                     </CardContent>
                                 </Card>
                             ))}
                         </div>
                     </TabsContent>

                     <TabsContent value="mutations">
                        <Tabs defaultValue="all" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="all">
                                    All ({filteredMutations.length})
                                </TabsTrigger>
                                <TabsTrigger value="growth">
                                    Growth ({growthMutations.length})
                                </TabsTrigger>
                                <TabsTrigger value="environmental">
                                    Environmental ({environmentalMutations.length})
                                </TabsTrigger>
                                <TabsTrigger value="standard">
                                    Standard ({standardMutations.length})
                                </TabsTrigger>
                                <TabsTrigger value="limited">
                                    Limited ({limitedMutations.length})
                                </TabsTrigger>
                                <TabsTrigger value="trivia">
                                    Trivia & Facts
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="all">
                                {renderMutationTable(filteredMutations)}
                            </TabsContent>
                            <TabsContent value="growth">
                                {renderMutationTable(growthMutations)}
                            </TabsContent>
                            <TabsContent value="environmental">
                                {renderMutationTable(environmentalMutations)}
                            </TabsContent>
                            <TabsContent value="standard">
                                {renderMutationTable(standardMutations)}
                            </TabsContent>
                            <TabsContent value="limited">
                                {renderMutationTable(limitedMutations)}
                            </TabsContent>
                            <TabsContent value="trivia">
                                <div className="space-y-4">
                                    <Card className="mutation-card">
                                        <CardContent className="pt-6">
                                            <h3 className="font-semibold mb-2">Key Facts</h3>
                                            <ul className="space-y-2 text-sm">
                                                <li>• <strong>Dawnbound</strong> is exclusive to Sunflowers and can only be obtained during Sun God events.</li>
                                                <li>• <strong>Ripe</strong> is exclusive to Sugar Apples and represents natural maturation.</li>
                                                <li>• The highest possible mutation multiplier is 47,950x for most crops, but 56,300x for Sunflowers.</li>
                                                <li>• <strong>Paradisal</strong> automatically replaces Sundried + Verdant combinations.</li>
                                                <li>• Only one growth mutation (Ripe, Gold, Rainbow) can be active at a time.</li>
                                                <li>• <strong>Dawnbound</strong> is the only mutation that can be given when fruit is picked up.</li>
                                            </ul>
                                        </CardContent>
                                    </Card>

                                    <Card className="mutation-card">
                                        <CardContent className="pt-6">
                                            <h3 className="font-semibold mb-2">Mutation Restrictions</h3>
                                            <ul className="space-y-2 text-sm">
                                                <li>• Only one of: Gold or Rainbow can be applied</li>
                                                <li>• Only one of: Chilled, Wet, or Frozen can be applied</li>
                                                <li>• Only one of: Burnt or Cooked can be applied</li>
                                                <li>• Sundried + Verdant combine to form Paradisal</li>
                                                <li>• A Paradisal plant can then gain either Verdant OR Sundried (but not both)</li>
                                            </ul>
                                        </CardContent>
                                    </Card>

                                    <Card className="mutation-card">
                                        <CardContent className="pt-6">
                                            <h3 className="font-semibold mb-2">Price Calculation Formula</h3>
                                            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                                                Total Price = Fruit Constant × Mass² × Growth Mutation × (1 + ΣMutations - Number of Mutations)
                                            </div>
                                            <p className="text-sm mt-2 text-muted-foreground">
                                                Where ΣMutations is the sum of all environmental mutation bonuses, and Number of Mutations is the count of unique environmental mutations applied.
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </TabsContent>

                    <TabsContent value="weather">
                        {renderWeatherTable(filteredWeather)}
                    </TabsContent>

                    <TabsContent value="pets">
                        <Tabs defaultValue="all" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="all">
                                    All ({filteredPets.length})
                                </TabsTrigger>
                                <TabsTrigger value="obtainable">
                                    Obtainable ({obtainablePets.length})
                                </TabsTrigger>
                                <TabsTrigger value="unobtainable">
                                    Unobtainable ({unobtainablePets.length})
                                </TabsTrigger>
                                <TabsTrigger value="common">
                                    Common ({commonPets.length})
                                </TabsTrigger>
                                <TabsTrigger value="uncommon">
                                    Uncommon ({uncommonPets.length})
                                </TabsTrigger>
                                <TabsTrigger value="rare">
                                    Rare ({rarePets.length})
                                </TabsTrigger>
                                <TabsTrigger value="legendary">
                                    Legendary ({legendaryPets.length})
                                </TabsTrigger>
                                <TabsTrigger value="mythical">
                                    Mythical ({mythicalPets.length})
                                </TabsTrigger>
                                <TabsTrigger value="divine">
                                    Divine ({divinePets.length})
                                </TabsTrigger>
                                <TabsTrigger value="info">
                                    Pet Info & Mechanics
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="all">
                                {renderPetTable(filteredPets)}
                            </TabsContent>
                            <TabsContent value="obtainable">
                                {renderPetTable(obtainablePets)}
                            </TabsContent>
                            <TabsContent value="unobtainable">
                                {renderPetTable(unobtainablePets)}
                            </TabsContent>
                            <TabsContent value="common">
                                {renderPetTable(commonPets)}
                            </TabsContent>
                            <TabsContent value="uncommon">
                                {renderPetTable(uncommonPets)}
                            </TabsContent>
                            <TabsContent value="rare">
                                {renderPetTable(rarePets)}
                            </TabsContent>
                            <TabsContent value="legendary">
                                {renderPetTable(legendaryPets)}
                            </TabsContent>
                            <TabsContent value="mythical">
                                {renderPetTable(mythicalPets)}
                            </TabsContent>
                            <TabsContent value="divine">
                                {renderPetTable(divinePets)}
                            </TabsContent>
                            <TabsContent value="info">
                                <div className="space-y-4">
                                    <Card>
                                        <CardContent className="pt-6">
                                            <h3 className="font-semibold mb-2">Pet Overview</h3>
                                            <ul className="space-y-2 text-sm">
                                                <li>• Players start with <strong>3</strong> equip slots, can get additional <strong>5</strong> slots from aged pets</li>
                                                <li>• Maximum <strong>60</strong> pets can be held in inventory</li>
                                                <li>• Pets have unique abilities that can stack when multiple of the same type are equipped</li>
                                                <li>• Pet age increases through XP, improving their traits with shorter cooldowns and better chances</li>
                                                <li>• Pets cannot age if their hunger reaches 0 - they must be fed to continue gaining XP</li>
                                            </ul>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="pt-6">
                                            <h3 className="font-semibold mb-2">Pet Equip Slot Upgrades</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span>+1 Slot (Age 20):</span>
                                                        <span className="font-medium">249 Robux</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>+2 Slots (Age 30):</span>
                                                        <span className="font-medium">399 Robux</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>+3 Slots (Age 45):</span>
                                                        <span className="font-medium">799 Robux</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span>+4 Slots (Age 60):</span>
                                                        <span className="font-medium">1,699 Robux</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>+5 Slots (Age 75):</span>
                                                        <span className="font-medium">1,699 Robux</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="pt-6">
                                            <h3 className="font-semibold mb-2">Pet Trait Categories</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-medium mb-2">🌱 Growth & Harvest Boosters</h4>
                                                    <p className="text-sm text-muted-foreground mb-2">Pets that enhance crop growth, size, and harvest rates</p>
                                                    <div className="text-xs space-y-1">
                                                        <div>• Cat Nap, Moon Nap - Boost nearby fruit size</div>
                                                        <div>• Croak, Echo Croak - Advance plant growth by 24 hours</div>
                                                        <div>• Fertilizer Frenzy - AOE growth boost</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-2">🧬 Mutation Effects</h4>
                                                    <p className="text-sm text-muted-foreground mb-2">Pets that apply specific mutations to crops</p>
                                                    <div className="text-xs space-y-1">
                                                        <div>• Bee types - Apply Pollinated mutation</div>
                                                        <div>• Dragonfly - Applies Gold mutation</div>
                                                        <div>• Butterfly - Applies Rainbow mutation</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-2">⚡ Experience Boosters</h4>
                                                    <p className="text-sm text-muted-foreground mb-2">Pets that boost XP gain for other pets</p>
                                                    <div className="text-xs space-y-1">
                                                        <div>• Night Owl - King of the Night</div>
                                                        <div>• Blood Owl - Monarch of Midnight</div>
                                                        <div>• Cooked Owl - King of the Grill</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-2">💰 Resource Gatherers</h4>
                                                    <p className="text-sm text-muted-foreground mb-2">Pets that help gather resources and currency</p>
                                                    <div className="text-xs space-y-1">
                                                        <div>• Mole - Digs up gear and Sheckles</div>
                                                        <div>• Bunny - Eats carrots for bonus Sheckles</div>
                                                        <div>• Squirrel - Seeds have chance not to be consumed</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="pt-6">
                                            <h3 className="font-semibold mb-2">Pet Mechanics</h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <h4 className="font-medium mb-1">Hunger & Feeding</h4>
                                                    <p className="text-sm text-muted-foreground">Pets must be fed crops to maintain hunger above 0. Hunger level affects XP gain and mutation effectiveness.</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-1">Age & XP Requirements</h4>
                                                    <p className="text-sm text-muted-foreground">XP requirements increase exponentially with age. Formula: floor(20*n^2.02). Age 100 requires 7,458,160 total XP.</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-1">Special Names</h4>
                                                    <p className="text-sm text-muted-foreground">Developer name "math.random(1, 4^X...)" grants ~100x efficiency boost. "Jandel" is another developer-exclusive name.</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>

        {/* Context Menu */}
        <ItemContextMenu
            item={contextMenu.item!}
            isOpen={contextMenu.isOpen}
            position={contextMenu.position}
            onClose={closeContextMenu}
            onViewItem={openFullItemView}
        />

        {/* Full Item View */}
        <FullItemView
            item={fullItemView.item}
            isOpen={fullItemView.isOpen}
            onClose={closeFullItemView}
        />
    </div>
    );
};
