
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
    category: 'growth' | 'environmental';
    cropSpecific?: string;
}

export const Mutationpedia = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const mutations: Mutation[] = [
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
    ];

    const filteredMutations = mutations.filter(mutation =>
        mutation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mutation.obtainment.some(method => method.toLowerCase().includes(searchTerm.toLowerCase())) ||
        mutation.visualDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const standardMutations = filteredMutations.filter(m => m.type === 'standard');
    const limitedMutations = filteredMutations.filter(m => m.type === 'limited');
    const growthMutations = filteredMutations.filter(m => m.category === 'growth');
    const environmentalMutations = filteredMutations.filter(m => m.category === 'environmental');

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
                <Tabs defaultValue="all" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="all">
                            All Mutations ({filteredMutations.length})
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
                                        <li>• <strong>Ripe</strong> is exclusive to Sugar Apples and represents natural maturation - it's the only mutation that cannot multiply.</li>
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
            </CardContent>
        </Card>
    );
};
