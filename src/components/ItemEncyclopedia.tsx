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
import { Menu } from 'lucide-react';
import { ItemCard } from '@/components/ItemCard';

import type { ItemInfo, WeatherData } from '@/types/api';
import type { PetInfo } from '@/types/pet';

export const ItemEncyclopedia = () => {
    const isMobile = useIsMobile();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('items');
    const [activeSubTab, setActiveSubTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<ItemInfo[]>([]);
    const [weatherItems, setWeatherItems] = useState<WeatherData[]>([]);
    const [pets, setPets] = useState<PetInfo[]>([]);
    // For zoom modal
    const [zoomedPetImg, setZoomedPetImg] = useState<string | null>(null);
    const [zoomedPetName, setZoomedPetName] = useState<string | null>(null);

    useEffect(() => {
        fetchEncyclopediaData();
    }, []);

    const fetchEncyclopediaData = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('ItemEncyclopedia: Fetching data from API');

            // Fetch all items
            const itemsResponse = await fetch('https://api.joshlei.com/v2/growagarden/info/', {
                headers: {
                    'Jstudio-key': 'jstudio',
                    'Content-Type': 'application/json'
                }
            });
            if (!itemsResponse.ok) {
                throw new Error(`Items API error! status: ${itemsResponse.status}`);
            }
            const itemsData = await itemsResponse.json();
            setItems(Array.isArray(itemsData) ? itemsData : []);

            // Fetch pets
            const petsResponse = await fetch('https://api.joshlei.com/v2/growagarden/info?type=pet', {
                headers: {
                    'Jstudio-key': 'jstudio',
                    'Content-Type': 'application/json'
                }
            });
            if (!petsResponse.ok) {
                throw new Error(`Pets API error! status: ${petsResponse.status}`);
            }
            const petsData = await petsResponse.json();
            setPets(Array.isArray(petsData) ? petsData : []);

            // Fetch weather data for weather items
            const weatherResponse = await fetch('https://api.joshlei.com/v2/growagarden/weather', {
                headers: {
                    'Jstudio-key': 'jstudio',
                    'Content-Type': 'application/json'
                }
            });
            if (!weatherResponse.ok) {
                throw new Error(`Weather API error! status: ${weatherResponse.status}`);
            }
            const weatherData = await weatherResponse.json();
            setWeatherItems(weatherData.weather || []);

            console.log('ItemEncyclopedia: Data loaded successfully');

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

    // Pet category filters
    // The API does not provide 'obtainable', so treat all as obtainable or filter by logic if needed
    const obtainablePets = filteredPets; // or add logic if you have a way to determine this
    const unobtainablePets: typeof filteredPets = []; // no unobtainable pets in new API
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
                <div className="space-y-4">
                    {itemList.map((item) => (
                        <ItemCard key={item.item_id} item={item} />
                    ))}
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
                            <TableRow key={item.item_id} className="hover:bg-accent/50">
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

    // Helper to get pet image path
    const getPetImage = (pet: { name: string; rarity: string; obtainable: boolean }) => {
        // Normalize name for file lookup
        const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        const rarityFolder = pet.rarity;
        const base = `/Pets/${pet.obtainable ? 'Obtainable' : 'Unobtainable'}`;
        let folder = '';
        switch (rarityFolder) {
            case 'Common': folder = 'Common'; break;
            case 'Uncommon': folder = 'Uncommon'; break;
            case 'Rare': folder = 'Rare'; break;
            case 'Legendary': folder = 'Legendary'; break;
            case 'Mythical': folder = 'Mythical'; break;
            case 'Divine': folder = 'Divine'; break;
            case 'Unknown': folder = 'Unknown'; break;
            default: folder = '';
        }
        // Map pet name to file name exceptions
        const nameMap: Record<string, string> = {
            'Golden Lab': 'GoldenLabPet',
            'Starfish': 'StarfishIcon',
            'Crab': 'CrabIcon',
            'Seagull': 'SeagullIcon',
            'Black Bunny': 'Black_bunny',
            'Orange Tabby': 'Orange_tabby',
            'Sea Turtle': 'SeaTurtle',
            'Honey Bee': 'HoneyBee',
            'Spotted Deer': 'Spotteddeer',
            'Tarantula Hawk': 'Tarantula_Hawk',
            'Petal Bee': 'Petal_Bee',
            'Scarlet Macaw': 'scarlet_macow',
            'Hyacinth Macaw': 'hyacinth_macaw',
            'Bear Bee': 'bear_bee',
            'Red Giant Ant': 'red_giant_ant',
            'Pack Bee': 'pack_bee',
            'Praying Mantis': 'praying_mantis',
            'Blood Kiwi': 'blood_kiwi',
            'Disco Bee': 'disco_bee',
            'Queen Bee': 'queen_bee',
            'Night Owl': 'night_owl',
            'Fennec Fox': 'fennec_fox',
            'Moth': 'Moth',
            'Moon Cat': 'Moon_Cat',
            'Mode': 'mode',
            'Capybara': 'capybara',
            'Turtle': 'Turtle',
            'Peacock': 'peacock',
            'Ostrich': 'ostrich',
            'Meerkat': 'meerkat',
            'Frog': 'frog',
            'Dog': 'DogPet',
            'Bunny': 'BunnyPet',
            'Cat': 'Cat',
            'Bee': 'Beee',
            'Chicken': 'Chicken',
            'Deer': 'Deer',
            'Monkey': 'Monkey',
            'Pig': 'Pig',
            'Rooster': 'Rooster',
            'Seal': 'Seal',
            'Flamingo': 'FlamingoIcon',
            'Wasp': 'Wasp',
            'Kiwi': 'Kiwi',
            'Orangutan': 'Orangutan',
            'Hedgehog': 'Hedgehog',
            'Squirrel': 'squirrel',
            'Snail': 'snail',
            'Hamster': 'hamster',
            'Grey Mouse': 'grey_mouse',
            'Brown Mouse': 'brown_mouse',
            'Caterpillar': 'carterpillar',
            'Giant Ant': 'giant_ant',
            'Echo Frog': 'echo_frog',
            'Butterfly': 'butterfly',
            'Red Fox': 'red_fox',
            'Mimic Octopus': 'mimic_octopus',
            // Unobtainable
            'Cow': 'cow',
            'Polar Bear': 'polar_bear',
            'Sea Otter': 'sea_otter',
            'Silver Monkey': 'silver_monkey',
            'Panda': 'panda',
            'Blood Hedgehog': 'blood_hedgehog',
            'Chicken Zombie': 'chicken_zombie',
            'Firefly': 'firefly',
            'Owl': 'owl',
            'Golden Bee': 'golden_bee',
            'Cooked Owl': 'cooked_owl',
            'Blood Owl': 'blood_owl',
            'Red Dragon': 'red_dragon',
        };
        const extMap: Record<string, string> = {
            'disco_bee': 'gif',
            'FlamingoIcon': 'png',
            'StarfishIcon': 'png',
            'CrabIcon': 'png',
            'GoldenLabPet': 'png',
            'BunnyPet': 'png',
            'DogPet': 'png',
            'SeagullIcon': 'png',
        };
        let file = nameMap[pet.name] || normalize(pet.name);
        let ext = extMap[file] || 'png';
        // Some files are .gif
        if (file === 'disco_bee') ext = 'gif';
        // Some folders are missing, fallback to base if needed
        let path = `/Pets/${pet.obtainable ? 'Obtainable' : 'Unobtainable'}`;
        if (folder) path += `/${folder}`;
        path += `/${file}.${ext}`;
        return path;
    };

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
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    📚 Encyclopedia
                </CardTitle>
                <div className="flex gap-4 items-center">
                    <Input
                        placeholder="Search items, mutations, weather..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    <Badge variant="secondary">
                        {filteredItems.length + filteredMutations.length + filteredWeather.length + filteredPets.length} results
                    </Badge>
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

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    {isMobile ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <Menu className="h-4 w-4 mr-2" />
                                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                                <DropdownMenuItem onSelect={() => setActiveTab('items')}>
                                    📦 Items ({filteredItems.length})
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setActiveTab('mutations')}>
                                    🧬 Mutations ({filteredMutations.length})
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setActiveTab('weather')}>
                                    🌦️ Weather ({filteredWeather.length})
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setActiveTab('pets')}>
                                    🐾 Pets ({filteredPets.length})
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <TabsList>
                            <TabsTrigger value="items">
                                📦 Items ({filteredItems.length})
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
                        <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
                            {isMobile ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full">
                                            <Menu className="h-4 w-4 mr-2" />
                                            {activeSubTab.charAt(0).toUpperCase() + activeSubTab.slice(1)}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        <DropdownMenuItem onSelect={() => setActiveSubTab('all')}>All ({filteredItems.length})</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => setActiveSubTab('seeds')}>Seeds ({seedItems.length})</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => setActiveSubTab('gear')}>Gear ({gearItems.length})</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => setActiveSubTab('eggs')}>Eggs ({eggItems.length})</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => setActiveSubTab('cosmetics')}>Cosmetics ({cosmeticItems.length})</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => setActiveSubTab('events')}>Events ({eventItems.length})</DropdownMenuItem>
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
    );
};
