
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Item {
  item_id: string;
  display_name: string;
  icon?: string;
  rarity: string;
  price: number;
  currency: string;
  description: string;
  last_seen?: string;
  duration?: number;
}

interface Pet {
  name: string;
  mutations: string[];
  description: string;
  rarity: string;
}

export const ItemEncyclopedia = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<Item[]>([]);
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

  useEffect(() => {
    // Simulate API call to /info/ endpoint
    const mockItems: Item[] = [
      {
        item_id: 'item_001',
        display_name: 'Golden Watering Can',
        icon: '🥤',
        rarity: 'Epic',
        price: 1500,
        currency: 'Sheckles',
        description: 'A magnificent watering can that enhances plant growth rate by 25%.',
        last_seen: '2024-12-28',
        duration: 7200
      },
      {
        item_id: 'item_002',
        display_name: 'Premium Fertilizer',
        icon: '💊',
        rarity: 'Rare',
        price: 750,
        currency: 'Sheckles',
        description: 'High-quality fertilizer that increases mutation chance.',
        last_seen: '2024-12-27',
        duration: 3600
      },
      {
        item_id: 'item_003',
        display_name: 'Weather Predictor',
        icon: '🌡️',
        rarity: 'Legendary',
        price: 3000,
        currency: 'Gems',
        description: 'A mystical device that can predict weather patterns 24 hours in advance.',
        last_seen: '2024-12-25',
        duration: 86400
      },
      {
        item_id: 'pet_001',
        display_name: 'Dragonfly Egg',
        icon: '🥚',
        rarity: 'Rare',
        price: 2000,
        currency: 'Sheckles',
        description: 'An egg that will hatch into a Dragonfly pet. Can apply Gold mutation to crops.',
        last_seen: '2024-12-28',
        duration: 14400
      }
    ];

    setItems(mockItems);
  }, []);

  const filteredItems = items.filter(item =>
    item.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.rarity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.mutations.some(mutation => mutation.toLowerCase().includes(searchTerm.toLowerCase())) ||
    pet.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'secondary';
      case 'uncommon': return 'outline';  
      case 'rare': return 'default';
      case 'epic': return 'destructive';
      case 'legendary': return 'default';
      default: return 'secondary';
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📖 Item & Pet Encyclopedia
        </CardTitle>
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Search items and pets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Badge variant="secondary">
            {filteredItems.length + filteredPets.length} results
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList>
            <TabsTrigger value="items">Items ({filteredItems.length})</TabsTrigger>
            <TabsTrigger value="pets">Pets ({filteredPets.length})</TabsTrigger>
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
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <div className="font-medium">{item.display_name}</div>
                            <div className="text-xs text-muted-foreground">ID: {item.item_id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRarityColor(item.rarity)}>
                          {item.rarity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {item.price.toLocaleString()} {item.currency}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm">{item.description}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          {item.last_seen && (
                            <div>Last seen: {item.last_seen}</div>
                          )}
                          {item.duration && (
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
        </Tabs>
      </CardContent>
    </Card>
  );
};
