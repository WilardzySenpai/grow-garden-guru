import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Item {
  item_id: string;
  display_name: string;
  icon: string;
  rarity: string | null;
  price: string;
  currency: string;
  description: string;
  last_seen: string;
  duration: string;
}

interface Pet {
  name: string;
  mutations: string[];
  description: string;
  rarity: string;
}

interface Mutation {
  name: string;
  appearance: string;
  multiplier: string;
  obtainment: string[];
  visualDescription: string;
  type: 'standard' | 'limited';
  category: 'growth' | 'environmental';
  cropSpecific?: string;
}

export const ItemEncyclopedia = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  
  // Pet data - this could be moved to API later
  const [pets] = useState<Pet[]>([
    {
      name: 'Dragonfly',
      mutations: ['Gold'],
      description: 'A shimmering dragonfly that can turn crops golden with its touch.',
      rarity: 'Rare'
    },
    {
      name: 'Polar Bear',
      mutations: ['Frozen', 'Chilled'],
      description: 'A majestic polar bear that brings the chill of winter to crops.',
      rarity: 'Epic'
    },
    {
      name: 'Disco Bee',
      mutations: ['Rainbow'],
      description: 'A groovy bee that adds rainbow colors to everything it touches.',
      rarity: 'Legendary'
    },
    {
      name: 'Wind Sprite',
      mutations: ['Windstruck'],
      description: 'An ethereal being that carries the power of wind.',
      rarity: 'Uncommon'
    },
    {
      name: 'Dragon',
      mutations: ['Burnt'],
      description: 'A fierce dragon whose breath can char crops.',
      rarity: 'Epic'
    },
    {
      name: 'Chef',
      mutations: ['Cooked'],
      description: 'A culinary master that can perfectly cook crops.',
      rarity: 'Rare'
    }
  ]);

  // Mutation data from wiki
  const [mutations] = useState<Mutation[]>([
    // Growth Mutations - Standard
    {
      name: 'Ripe',
      appearance: 'RipeSugarApple.webp',
      multiplier: 'x2',
      obtainment: ['Has a rare chance to replace the normal variant', 'Can stack with Gold or Rainbow', 'Sugar Apple only'],
      visualDescription: 'Purple in color, fading darker towards the bottom',
      type: 'standard',
      category: 'growth',
      cropSpecific: 'Sugar Apple'
    },
    {
      name: 'Gold',
      appearance: 'GoldenMutation.png',
      multiplier: 'x20',
      obtainment: ['1% chance to grow replacing the normal variant', 'Can be applied by the Dragonfly pet'],
      visualDescription: 'Shining, Golden in color, will emit a shimmering sound',
      type: 'standard',
      category: 'growth'
    },
    {
      name: 'Rainbow',
      appearance: 'Tomato Rainbow.gif',
      multiplier: 'x50',
      obtainment: ['0.1% chance to grow replacing the normal variant', 'Can be applied by the Butterfly pet when a crop has 5+ mutations (removes all previous mutations)'],
      visualDescription: 'Continuously changes color, emits yellow particles and a rainbow above it',
      type: 'standard',
      category: 'growth'
    },
    // Environmental Mutations - Standard
    {
      name: 'Wet',
      appearance: 'WetMutation.png',
      multiplier: 'x2',
      obtainment: ['During Rain or Thunderstorm', 'Small chance from sprinklers', 'Can be applied by Sea Turtle', 'During admin event Under The Sea'],
      visualDescription: 'Dripping with water particles',
      type: 'standard',
      category: 'environmental'
    },
    {
      name: 'Windstruck',
      appearance: 'WindstruckDr.png',
      multiplier: 'x2',
      obtainment: ['During Windy weather', 'During Gale weather'],
      visualDescription: 'Has wind gusts swoop around the crop',
      type: 'standard',
      category: 'environmental'
    },
    {
      name: 'Moonlit',
      appearance: 'Strawberry Moonlit.png',
      multiplier: 'x2',
      obtainment: ['During Night weather', 'Max of 6 plants being moonlit every 2 minutes during Night'],
      visualDescription: 'Glowing purple aroma, purple in color',
      type: 'standard',
      category: 'environmental'
    },
    {
      name: 'Chilled',
      appearance: '(Chilled).png',
      multiplier: 'x2',
      obtainment: ['During Frost weather', 'Can be applied by Polar Bear', 'Can be applied using Mutation Spray Chilled'],
      visualDescription: 'Slightly bluish in color, emits frost particles',
      type: 'standard',
      category: 'environmental'
    },
    {
      name: 'Choc',
      appearance: 'Strawberry Choc Png.png',
      multiplier: 'x3',
      obtainment: ['From Chocolate Sprinkler', 'During Chocolate Rain', 'Using Mutation Choc Spray'],
      visualDescription: 'Brown in color, dripping with chocolate syrup',
      type: 'standard',
      category: 'environmental'
    },
    {
      name: 'Bloodlit',
      appearance: 'Bloodlitdragonfruit png.png',
      multiplier: 'x4',
      obtainment: ['During Blood Moon (chance to replace Night every 4 hours)'],
      visualDescription: 'Shining, red in color',
      type: 'standard',
      category: 'environmental'
    },
    {
      name: 'Twisted',
      appearance: 'Twistedcocovineba.png',
      multiplier: 'x5',
      obtainment: ['During Tornado weather'],
      visualDescription: 'Has tornado-like swirls coming out of it, similar to Windstruck',
      type: 'standard',
      category: 'environmental'
    },
    {
      name: 'Drenched',
      appearance: 'Drenched.png',
      multiplier: 'x5',
      obtainment: ['Given to crops during Tropical Rain'],
      visualDescription: 'Large water droplets fall from the crop',
      type: 'standard',
      category: 'environmental'
    },
    {
      name: 'Frozen',
      appearance: 'Mango Frozen.png',
      multiplier: 'x10',
      obtainment: ['If a crop has both Wet and Chilled mutations', 'Can be applied by Polar Bear', 'Can be applied by Flower Froster Sprinkler (flowers only)'],
      visualDescription: 'Encased in an ice block',
      type: 'standard',
      category: 'environmental'
    },
    {
      name: 'Aurora',
      appearance: 'aurora gif.gif',
      multiplier: 'x90',
      obtainment: ['Given during Aurora Borealis weather'],
      visualDescription: 'Pulses between blues and purples, releases faint smoke from above the crop',
      type: 'standard',
      category: 'environmental'
    },
    {
      name: 'Shocked',
      appearance: 'ShockedMutation.png',
      multiplier: 'x100',
      obtainment: ['When a crop is struck during Thunderstorm', 'When a crop is struck during Jandel Storm', 'Using Mutation Spray Shocked'],
      visualDescription: 'Neon, won\'t have the classic studded texture',
      type: 'standard',
      category: 'environmental'
    },
    {
      name: 'Celestial',
      appearance: 'Strawberry Celestial.PNG',
      multiplier: 'x120',
      obtainment: ['When a crop is struck during Meteor Shower'],
      visualDescription: 'Slightly reflectant, sparkling yellow and purple',
      type: 'standard',
      category: 'environmental'
    },

    // Limited Mutations
    {
      name: 'Pollinated',
      appearance: 'Pollinated_Banana.png',
      multiplier: 'x3',
      obtainment: ['During Bee Swarm or Worker Bee Swarm', 'Can be applied by certain bee pets', 'Using Mutation Spray Pollinated'],
      visualDescription: 'Shining, yellow in color, emits yellow gas-like particles',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'Burnt',
      appearance: 'Obraz 2025-06-07 173233267.png',
      multiplier: 'x4',
      obtainment: ['Can be applied by Cooked Owl pet', 'Can be applied by Mutation Spray Burnt'],
      visualDescription: 'Black in color when unharvested (sparking), emits ash particles when harvested',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'Verdant',
      appearance: 'pineapple_verdant.png',
      multiplier: 'x4',
      obtainment: ['Small chance to be applied by Scarlet Macaw pet'],
      visualDescription: 'Green in color, emits green rectangular particles',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'Wiltproof',
      appearance: 'Placeholder.png',
      multiplier: 'x4',
      obtainment: ['Obtainable in Drought weather'],
      visualDescription: 'Unknown visual appearance',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'Cloudtouched',
      appearance: 'CloudtouchedPricklyPear.png',
      multiplier: 'x5',
      obtainment: ['Can be applied by Mutation Spray Cloudtouched', 'Small chance to be applied by Hyacinth Macaw pet'],
      visualDescription: 'Cloud-like aura all around',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'HoneyGlazed',
      appearance: 'Honeyglazed template fr2.png',
      multiplier: 'x5',
      obtainment: ['From Honey Sprinkler', 'Can be applied by Bear Bee pet'],
      visualDescription: 'Emits yellow fog, dripping in honey',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'Plasma',
      appearance: 'Plasma tomato.png',
      multiplier: 'x5',
      obtainment: ['During Laser Storm/Jandel Laser (admin only)'],
      visualDescription: 'Neon, pinkish purple in color, emits flashing red glints',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'Heavenly',
      appearance: 'MoonBlossomHeavenlyAnimated.gif',
      multiplier: 'x5',
      obtainment: ['During Floating Jandel event (admin only)'],
      visualDescription: 'Emits golden, shining stars from the base',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'Fried',
      appearance: 'Fried tomato2.png',
      multiplier: 'x8',
      obtainment: ['During Fried Chicken event'],
      visualDescription: 'Small yellow particles fall from the crop',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'Cooked',
      appearance: 'Ember_Lily_Cooked.PNG',
      multiplier: 'x25',
      obtainment: ['Small chance to be applied by Cooked Owl pet'],
      visualDescription: 'Orange in color, emits white steam and red swirls',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'Zombified',
      appearance: 'Cactus Zombified.png',
      multiplier: 'x25',
      obtainment: ['Can be applied by Chicken Zombie pet'],
      visualDescription: 'Emits green fog, dripping with green liquid',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'Molten',
      appearance: 'Nectarine_Molten.png',
      multiplier: 'x25',
      obtainment: ['During Volcano event'],
      visualDescription: 'Neon, orange/yellow/red in color',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'Sundried',
      appearance: 'Sundriedbeans.png',
      multiplier: 'x85',
      obtainment: ['During Heatwave event', 'Can redirect with Tanning Mirror'],
      visualDescription: 'Dark brown tint applied',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'Paradisal',
      appearance: 'Moon Mango Paradisal.png',
      multiplier: 'x100',
      obtainment: ['Occurs when a plant is both Verdant and Sundried', 'Replaces both mutations'],
      visualDescription: 'Lime green in color, emits sun ray-like particles',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'Alienlike',
      appearance: 'Alienlikegif.gif',
      multiplier: 'x100',
      obtainment: ['During Alien Invasion event'],
      visualDescription: 'Cyan in color, cyan particles emitted, parts can be transparent/invisible',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'Galactic',
      appearance: 'GalacticBeanstalk.png',
      multiplier: 'x120',
      obtainment: ['During Space Travel event'],
      visualDescription: 'Light purple/pink in color, some areas are neon, glimmers pink sparkles',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'Disco',
      appearance: 'Disco Mutation.gif',
      multiplier: 'x125',
      obtainment: ['During Disco event (admin only)', 'Can be applied by Disco Bee pet'],
      visualDescription: 'Shining, flashing red/pink/yellow/green/blue constantly',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'Voidtouched',
      appearance: 'Voidblueberrry.jpg',
      multiplier: 'x135',
      obtainment: ['During Black Hole event (admin only)'],
      visualDescription: 'Emits black hole particles',
      type: 'limited',
      category: 'environmental'
    },
    {
      name: 'Dawnbound',
      appearance: 'Dawnbound Sunflower.png',
      multiplier: 'x150',
      obtainment: ['During Sun God event with 4 players holding 4 Sunflowers touching in front of Sun God', 'Sunflower only'],
      visualDescription: 'Glows pure white',
      type: 'limited',
      category: 'environmental',
      cropSpecific: 'Sunflower'
    }
  ]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('https://api.joshlei.com/v2/growagarden/info/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter items by category
  const getFilteredItems = () => {
    let filtered = items;
    
    if (selectedCategory !== 'all') {
      // Filter by item category (you can adjust these categories based on your data structure)
      filtered = items.filter(item => {
        switch (selectedCategory) {
          case 'seeds':
            return item.item_id.includes('seed') || item.display_name.toLowerCase().includes('seed');
          case 'tools':
            return item.item_id.includes('tool') || item.display_name.toLowerCase().includes('tool') || 
                   item.item_id.includes('sprinkler') || item.display_name.toLowerCase().includes('sprinkler');
          case 'cosmetics':
            return item.item_id.includes('crate') || item.item_id.includes('decoration') || 
                   item.display_name.toLowerCase().includes('decoration');
          case 'eggs':
            return item.item_id.includes('egg') || item.display_name.toLowerCase().includes('egg');
          default:
            return true;
        }
      });
    }

    // Apply search filter
    return filtered.filter(item =>
      item.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.rarity && item.rarity.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const filteredItems = getFilteredItems();

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.mutations.some(mutation => mutation.toLowerCase().includes(searchTerm.toLowerCase())) ||
    pet.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMutations = mutations.filter(mutation =>
    mutation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mutation.obtainment.some(method => method.toLowerCase().includes(searchTerm.toLowerCase())) ||
    mutation.visualDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRarityColor = (rarity: string | null) => {
    if (!rarity) return 'secondary';
    
    switch (rarity.toLowerCase()) {
      case 'common': return 'secondary';
      case 'uncommon': return 'outline';  
      case 'rare': return 'default';
      case 'epic': return 'destructive';
      case 'legendary': return 'default';
      case 'mythical': return 'default';
      default: return 'secondary';
    }
  };

  const formatDuration = (durationStr: string) => {
    const seconds = parseInt(durationStr);
    if (seconds === 0 || isNaN(seconds)) return 'N/A';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatPrice = (price: string) => {
    const priceNum = parseInt(price);
    if (priceNum === 0 || isNaN(priceNum)) return 'Free';
    return priceNum.toLocaleString();
  };

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
          📚 Game Encyclopedia
        </CardTitle>
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Search items, pets, and mutations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="seeds">Seeds</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
              <SelectItem value="cosmetics">Cosmetics</SelectItem>
              <SelectItem value="eggs">Eggs</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="secondary">
            {filteredItems.length + filteredPets.length + filteredMutations.length} results
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList>
            <TabsTrigger value="items">Items ({filteredItems.length})</TabsTrigger>
            <TabsTrigger value="mutations">Mutations ({filteredMutations.length})</TabsTrigger>
            <TabsTrigger value="pets">Pets ({filteredPets.length})</TabsTrigger>
            <TabsTrigger value="crops">Crops (Coming Soon)</TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Rarity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.item_id} className="hover:bg-accent/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.icon}
                            alt={item.display_name}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div>
                            <div className="font-medium">{item.display_name}</div>
                            <div className="text-xs text-muted-foreground">ID: {item.item_id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRarityColor(item.rarity)}>
                          {item.rarity || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatPrice(item.price)} {item.currency}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm">{item.description || 'No description available'}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          {item.last_seen !== '0' && (
                            <div>Last seen: {new Date(parseInt(item.last_seen) * 1000).toLocaleDateString()}</div>
                          )}
                          {item.duration !== '0' && (
                            <div>Duration: {formatDuration(item.duration)}</div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="mutations">
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
                  {filteredMutations.map((mutation) => (
                    <TableRow key={mutation.name} className="hover:bg-accent/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-accent rounded border flex items-center justify-center text-xs">
                            IMG
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
          </TabsContent>

          <TabsContent value="pets">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredPets.map((pet) => (
                <Card key={pet.name} className="mutation-card">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{pet.name}</h3>
                        <Badge variant={getRarityColor(pet.rarity)}>
                          {pet.rarity}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {pet.description}
                      </p>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Can Apply Mutations:</h4>
                        <div className="flex flex-wrap gap-2">
                          {pet.mutations.map((mutation) => (
                            <Badge key={mutation} variant="outline" className="text-xs">
                              {mutation}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="crops">
            <Card className="text-center py-8">
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">Crops Database Coming Soon!</h3>
                <p className="text-muted-foreground">
                  This section will contain detailed information about all available crops, 
                  their growth times, base values, and special properties.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
