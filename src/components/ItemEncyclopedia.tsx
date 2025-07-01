import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import type { ItemInfo, WeatherData } from '@/types/api';

export const ItemEncyclopedia = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ItemInfo[]>([]);
  const [weatherItems, setWeatherItems] = useState<WeatherData[]>([]);

  useEffect(() => {
    fetchEncyclopediaData();
  }, []);

  const fetchEncyclopediaData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('ItemEncyclopedia: Fetching data from API');
      
      // Fetch all items
      const itemsResponse = await fetch('https://api.joshlei.com/v2/growagarden/info/');
      if (!itemsResponse.ok) {
        throw new Error(`Items API error! status: ${itemsResponse.status}`);
      }
      const itemsData = await itemsResponse.json();
      setItems(Array.isArray(itemsData) ? itemsData : []);
      
      // Fetch weather data for weather items
      const weatherResponse = await fetch('https://api.joshlei.com/v2/growagarden/weather');
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

  const renderItemTable = (itemList: ItemInfo[]) => (
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
            {filteredItems.length + filteredMutations.length + filteredWeather.length} results
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

        <Tabs defaultValue="items" className="space-y-6">
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
          </TabsList>

          <TabsContent value="items">
            <Tabs defaultValue="all" className="space-y-6">
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
        </Tabs>
      </CardContent>
    </Card>
  );
};
