
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Mutation {
  name: string;
  appearance: string;
  multiplier: string;
  obtainment: string[];
  visualDescription: string;
  type: 'standard' | 'limited';
  cropSpecific?: string;
}

export const Mutationpedia = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mutations: Mutation[] = [
    {
      name: 'Ripe',
      appearance: 'RipeSugarApple.webp',
      multiplier: 'x20',
      obtainment: ['Exclusive to Sugar Apples', 'Grows naturally over time'],
      visualDescription: 'Rich, deep red coloration with enhanced fruit definition',
      type: 'standard',
      cropSpecific: 'Sugar Apple'
    },
    {
      name: 'Gold',
      appearance: 'GoldSugarApple.webp',
      multiplier: 'x50',
      obtainment: ['Can be applied by the Dragonfly pet', 'Rare natural occurrence'],
      visualDescription: 'Shining, Golden in color',
      type: 'standard'
    },
    {
      name: 'Rainbow',
      appearance: 'RainbowSugarApple.webp',
      multiplier: 'x100',
      obtainment: ['Extremely rare natural occurrence', 'Special event rewards'],
      visualDescription: 'Vibrant rainbow hues across the entire fruit surface',
      type: 'limited'
    },
    {
      name: 'Windstruck',
      appearance: 'WindstruckSugarApple.webp',
      multiplier: '+0.15',
      obtainment: ['During windy weather conditions', 'Can be applied by Wind Sprite pet'],
      visualDescription: 'Leaves appear blown and scattered around the plant',
      type: 'standard'
    },
    {
      name: 'Wet',
      appearance: 'WetSugarApple.webp',
      multiplier: '+0.25',
      obtainment: ['During Rain weather', 'Watering during specific conditions'],
      visualDescription: 'Glistening water droplets cover the fruit and leaves',
      type: 'standard'
    },
    {
      name: 'Chilled',
      appearance: 'ChilledSugarApple.webp',
      multiplier: '+0.10',
      obtainment: ['During cold weather events', 'Ice-type pet abilities'],
      visualDescription: 'Frost crystals form around the base and leaves',
      type: 'standard'
    },
    {
      name: 'Frozen',
      appearance: 'FrozenSugarApple.webp',
      multiplier: '+0.35',
      obtainment: ['Severe cold weather events', 'Polar Bear pet ability'],
      visualDescription: 'Entire plant encased in ice crystals',
      type: 'limited'
    },
    {
      name: 'Burnt',
      appearance: 'BurntSugarApple.webp',
      multiplier: '+0.20',
      obtainment: ['Extreme heat conditions', 'Dragon pet fire breath'],
      visualDescription: 'Charred edges with smoldering effect',
      type: 'standard'
    },
    {
      name: 'Cooked',
      appearance: 'CookedSugarApple.webp',
      multiplier: '+0.30',
      obtainment: ['Prolonged heat exposure', 'Chef pet cooking ability'],
      visualDescription: 'Golden-brown coloration as if perfectly baked',
      type: 'standard'
    },
    {
      name: 'Sundried',
      appearance: 'SundriedSugarApple.webp',
      multiplier: '+0.18',
      obtainment: ['Extended sunny weather', 'Sun alignment events'],
      visualDescription: 'Wrinkled skin with concentrated color',
      type: 'standard'
    },
    {
      name: 'Verdant',
      appearance: 'VerdantSugarApple.webp',
      multiplier: '+0.22',
      obtainment: ['Lush growing conditions', 'Nature spirit blessing'],
      visualDescription: 'Extra vibrant green foliage with enhanced growth',
      type: 'standard'
    },
    {
      name: 'Paradisal',
      appearance: 'ParadisalSugarApple.webp',
      multiplier: '+0.45',
      obtainment: ['Combination of Sundried + Verdant', 'Perfect growing conditions'],
      visualDescription: 'Perfect balance of sun-kissed fruit with lush foliage',
      type: 'limited'
    },
    {
      name: 'Dawnbound',
      appearance: 'DawnboundSunflower.webp',
      multiplier: '+0.28',
      obtainment: ['Sunrise events', 'Exclusive to Sunflowers'],
      visualDescription: 'Petals glow with dawn light, facing east perpetually',
      type: 'limited',
      cropSpecific: 'Sunflower'
    }
  ];

  const filteredMutations = mutations.filter(mutation =>
    mutation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mutation.obtainment.some(method => method.toLowerCase().includes(searchTerm.toLowerCase())) ||
    mutation.visualDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const standardMutations = filteredMutations.filter(m => m.type === 'standard');
  const limitedMutations = filteredMutations.filter(m => m.type === 'limited');

  const renderMutationTable = (mutationList: Mutation[]) => (
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧬 The Mutationpedia
        </CardTitle>
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Search mutations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Badge variant="secondary">
            {filteredMutations.length} mutations found
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="standard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="standard">
              Standard Mutations ({standardMutations.length})
            </TabsTrigger>
            <TabsTrigger value="limited">
              Limited Mutations ({limitedMutations.length})
            </TabsTrigger>
            <TabsTrigger value="trivia">
              Trivia & Facts
            </TabsTrigger>
          </TabsList>

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
                    <li>• <strong>Dawnbound</strong> is exclusive to Sunflowers and can only be obtained during sunrise events.</li>
                    <li>• <strong>Ripe</strong> is exclusive to Sugar Apples and represents the natural maturation process.</li>
                    <li>• The ability to hover over plants to see mutations was added on June 28th, 2025.</li>
                    <li>• <strong>Paradisal</strong> automatically replaces Sundried + Verdant combinations.</li>
                    <li>• Growth mutations (Ripe, Gold, Rainbow) cannot be combined - only one can be active.</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="mutation-card">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Exclusivity Rules</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Chilled, Wet, and Frozen cannot coexist (only one temperature-based mutation allowed)</li>
                    <li>• Burnt and Cooked are mutually exclusive</li>
                    <li>• Sundried + Verdant automatically becomes Paradisal</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
