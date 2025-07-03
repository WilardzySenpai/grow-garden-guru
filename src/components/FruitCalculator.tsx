import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { TrendingUp, Search } from 'lucide-react';
import type { ItemInfo as BaseItemInfo } from '@/types/api';

// Extend ItemInfo to include weightDivisor and baseValue for local use
type ItemInfo = BaseItemInfo & { weightDivisor?: number; baseValue?: number };

interface CalculateResponse {
    base_price: number;
    variants: { [key: string]: number };
    mutations: { [key: string]: number };
}

interface EnvironmentalMutationData {
    label: string;
    multiplier: number;
    cropSpecific?: string;
    type: 'standard' | 'limited';
}

export const FruitCalculator = () => {
    const [cropName, setCropName] = useState('');
    const [mass, setMass] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [availableCrops, setAvailableCrops] = useState<ItemInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [cropsLoading, setCropsLoading] = useState(true);

    // Growth mutations (only one allowed, now called variantMutation)
    const [variantMutation, setVariantMutation] = useState<string>('');
    // Weather mutation (only one allowed)
    const [weatherMutation, setWeatherMutation] = useState<string>('');
    // Regular mutations (multi-select)
    const [regularMutations, setRegularMutations] = useState<{ [key: string]: boolean }>({});

    const [calculationResult, setCalculationResult] = useState<{
        totalPrice: number;
        breakdown: {
            basePrice: number;
            mass: number;
            variant: string;
            mutations: string[];
        };
    } | null>(null);

    const growthMutations = [
        { value: 'Ripe', label: 'Ripe (x2)', multiplier: 2, cropSpecific: 'Sugar Apple' },
        { value: 'Gold', label: 'Gold (x20)', multiplier: 20 },
        { value: 'Rainbow', label: 'Rainbow (x50)', multiplier: 50 }
    ];

    const environmentalMutationData: { [key: string]: EnvironmentalMutationData } = {
        // Standard Environmental Mutations
        wet: { label: 'Wet', multiplier: 2, type: 'limited' },
        chilled: { label: 'Chilled', multiplier: 2, type: 'limited' },
        drenched: { label: 'Drenched', multiplier: 5, type: 'limited' },
        frozen: { label: 'Frozen', multiplier: 10, type: 'limited' },

        // Limited Environmental Mutations
        windstruck: { label: 'Windstruck', multiplier: 2, type: 'standard' },
        twisted: { label: 'Twisted', multiplier: 5, type: 'standard' },
        bloodlit: { label: 'Bloodlit', multiplier: 4, type: 'standard' },
        moonlit: { label: 'Moonlit', multiplier: 2, type: 'standard' },
        choc: { label: 'Choc', multiplier: 2, type: 'standard' },
        aurora: { label: 'Aurora', multiplier: 90, type: 'standard' },
        shocked: { label: 'Shocked', multiplier: 100, type: 'standard' },
        celestial: { label: 'Celestial', multiplier: 120, type: 'standard' },
        pollinated: { label: 'Pollinated', multiplier: 3, type: 'standard' },
        burnt: { label: 'Burnt', multiplier: 4, type: 'standard' },
        verdant: { label: 'Verdant', multiplier: 4, type: 'standard' },
        wiltproof: { label: 'Wiltproof', multiplier: 4, type: 'standard' },
        cloudtouched: { label: 'Cloudtouched', multiplier: 5, type: 'standard' },
        honeyglazed: { label: 'HoneyGlazed', multiplier: 5, type: 'standard' },
        plasma: { label: 'Plasma', multiplier: 5, type: 'standard' },
        heavenly: { label: 'Heavenly', multiplier: 5, type: 'standard' },
        fried: { label: 'Fried', multiplier: 8, type: 'standard' },
        cooked: { label: 'Cooked', multiplier: 10, type: 'standard' },
        zombified: { label: 'Zombified', multiplier: 25, type: 'standard' },
        molten: { label: 'Molten', multiplier: 25, type: 'standard' },
        sundried: { label: 'Sundried', multiplier: 85, type: 'standard' },
        paradisal: { label: 'Paradisal', multiplier: 100, type: 'standard' },
        alienlike: { label: 'Alienlike', multiplier: 100, type: 'standard' },
        galactic: { label: 'Galactic', multiplier: 120, type: 'standard' },
        disco: { label: 'Disco', multiplier: 125, type: 'standard' },
        voidtouched: { label: 'Voidtouched', multiplier: 135, type: 'standard' },
        dawnbound: { label: 'Dawnbound', multiplier: 150, type: 'standard', cropSpecific: 'Sunflower' }
    };

    // Load available crops on component mount
    useEffect(() => {
        loadAvailableCrops();
    }, []);

    const loadAvailableCrops = async () => {
        setCropsLoading(true);
        try {
            console.log('FruitCalculator: Fetching available crops from calculate endpoint');
            const response = await fetch('https://api.joshlei.com/v2/growagarden/calculate', {
                headers: {
                    'Jstudio-key': 'jstudio'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Expecting data.fruits to be an array
            if (data && Array.isArray(data.fruits)) {
                // Map to ItemInfo shape, add icon property
                const crops = data.fruits.map((fruit: any) => ({
                    ...fruit,
                    icon: `https://api.joshlei.com/v2/growagarden/image/${fruit.item_id}`
                }));
                setAvailableCrops(crops);
                toast({
                    title: "Crops Loaded",
                    description: `Found ${crops.length} available crops`,
                });
            } else {
                console.error('FruitCalculator: API returned invalid data:', data);
                setAvailableCrops([]);
                toast({
                    title: "Warning",
                    description: "Invalid crop data format received",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('FruitCalculator: Failed to load available crops:', error);
            toast({
                title: "Error",
                description: "Failed to load available crops.",
                variant: "destructive"
            });
            setAvailableCrops([]);
        } finally {
            setCropsLoading(false);
        }
    };

    // Handle automatic Paradisal replacement and allow Paradisal+one
    useEffect(() => {
        // If both Sundried and Verdant are selected, replace with Paradisal
        if (regularMutations.sundried && regularMutations.verdant) {
            setRegularMutations(prev => ({
                ...prev,
                sundried: false,
                verdant: false,
                paradisal: true
            }));
            // Use toast's dismiss method to close the notification when "Got it!" is clicked
            toast({
                title: "Paradisal Mutation Triggered!",
                description: "Sundried + Verdant has been replaced with PARADISAL.",
                variant: "destructive",
                duration: 7000,
                action: <ToastAction altText="Dismiss">Got it!</ToastAction>
            });
        }
        // If Paradisal is selected, allow only one of Sundried or Verdant (not both)
        if (regularMutations.paradisal) {
            if (regularMutations.sundried && regularMutations.verdant) {
                // If both are checked, uncheck the one that was not most recently changed (default: uncheck verdant)
                setRegularMutations(prev => ({
                    ...prev,
                    verdant: false
                }));
            }
        }
    }, [regularMutations.sundried, regularMutations.verdant, regularMutations.paradisal]);

    const handleEnvironmentalMutationChange = (mutation: string, checked: boolean) => {
        if (checked) {
            let newMutations = { ...regularMutations };
            // 2. Only one of either Chilled, Wet, Drenched, or Frozen can be applied
            if (["chilled", "wet", "drenched", "frozen"].includes(mutation)) {
                newMutations.chilled = false;
                newMutations.wet = false;
                newMutations.drenched = false;
                newMutations.frozen = false;
            }
            // 3. Only one of either Burnt or Cooked can be applied
            if (mutation === 'burnt') {
                newMutations.cooked = false;
            } else if (mutation === 'cooked') {
                newMutations.burnt = false;
            }
            // 4. Paradisal + one of Sundried or Verdant (not both)
            if (mutation === 'paradisal') {
                // If both sundried and verdant are checked, uncheck verdant
                if (newMutations.sundried && newMutations.verdant) {
                    newMutations.verdant = false;
                }
            }
            newMutations[mutation] = checked;
            setRegularMutations(newMutations);
        } else {
            setRegularMutations(prev => ({ ...prev, [mutation]: checked }));
        }
    };

    const calculatePrice = () => {
        if (!cropName || !mass) {
            toast({
                title: "Missing Information",
                description: "Please select a crop and enter weight.",
                variant: "destructive"
            });
            return;
        }
        const massNum = parseFloat(mass);
        if (massNum <= 0) {
            toast({
                title: "Invalid Weight",
                description: "Weight must be greater than 0.",
                variant: "destructive"
            });
            return;
        }
        setLoading(true);
        try {
            // Get fruit constant (baseValue)
            const crop = availableCrops.find(c => c.item_id === cropName);
            if (!crop || typeof crop.baseValue !== 'number') {
                toast({
                    title: "Error",
                    description: "Selected crop does not have a valid base value.",
                    variant: "destructive"
                });
                setLoading(false);
                return;
            }
            // Growth mutation multiplier
            let growthMultiplier = 1;
            if (variantMutation) {
                const found = growthMutations.find(m => m.value === variantMutation);
                if (found) growthMultiplier = found.multiplier;
            }
            // Weather mutation (single)
            let mutationList: string[] = [];
            let mutationMultipliers: number[] = [];
            if (weatherMutation) {
                mutationList.push(environmentalMutationData[weatherMutation].label);
                mutationMultipliers.push(environmentalMutationData[weatherMutation].multiplier);
            }
            // Regular mutations (multi)
            Object.entries(regularMutations)
                .filter(([_, active]) => active)
                .forEach(([mutation]) => {
                    mutationList.push(environmentalMutationData[mutation].label);
                    mutationMultipliers.push(environmentalMutationData[mutation].multiplier);
                });
            // Formula: Total Price = Fruit Constant × (Mass²) × Growth Mutation × (1 + Sum of Mutations - Number of Mutations)
            const sumMutations = mutationMultipliers.reduce((a, b) => a + b, 0);
            const numMutations = mutationMultipliers.length;
            const totalPrice = crop.baseValue * (massNum ** 2) * growthMultiplier * (1 + sumMutations - numMutations);
            setCalculationResult({
                totalPrice,
                breakdown: {
                    basePrice: crop.baseValue,
                    mass: massNum,
                    variant: variantMutation,
                    mutations: mutationList
                }
            });
            toast({
                title: "Calculation Complete",
                description: `Total price: ${Math.round(totalPrice).toLocaleString()} Sheckles`,
            });
        } catch (error) {
            console.error('FruitCalculator: Calculation failed:', error);
            toast({
                title: "Calculation Failed",
                description: "Unable to calculate fruit price. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    // Filter crops based on search term and ensure uniqueness by item_id
    const uniqueCropsMap = new Map<string, ItemInfo>();
    (availableCrops || []).forEach(crop => {
        if (!uniqueCropsMap.has(crop.item_id)) {
            uniqueCropsMap.set(crop.item_id, crop);
        }
    });
    const uniqueCrops = Array.from(uniqueCropsMap.values());
    const filteredCrops = uniqueCrops.filter(crop =>
        crop?.display_name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        crop?.item_id?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );

    const standardMutations = Object.entries(environmentalMutationData).filter(([_, data]) => data.type === 'limited');
    const limitedMutations = Object.entries(environmentalMutationData).filter(([_, data]) => data.type === 'standard');

    // ...no longer restrict Gold/Rainbow/Disco combinations...

    // Helper: get the selected crop object
    const selectedCrop = availableCrops.find(c => c.item_id === cropName);

    // When a crop is selected, set the mass to its base weight (weightDivisor) if available
    const handleCropSelect = (item_id: string) => {
        setCropName(item_id);
        const crop = availableCrops.find(c => c.item_id === item_id);
        if (crop && crop.weightDivisor) {
            setMass(crop.weightDivisor.toString());
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-1 mx-auto w-full px-2 sm:px-4 md:px-8">
            {/* Fruit Price Calculator */}
            <Card>
                <CardHeader>
                    <CardTitle>🍉 Fruit Price Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Crop Selection */}
                    <div className="space-y-3">
                        <Label>Crop Type</Label>
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search crops..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                disabled={cropsLoading}
                            />
                        </div>
                        {/* Crop Selection Grid */}
                        {cropsLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="p-3 border rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="w-6 h-6" />
                                            <Skeleton className="h-4 w-16" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto border rounded-lg p-2">
                                {filteredCrops.length > 0 ?
                                    filteredCrops.map((crop) => (
                                        <Button
                                            key={crop.item_id}
                                            variant={cropName === crop.item_id ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleCropSelect(crop.item_id)}
                                            className="justify-start h-auto p-2 flex items-center gap-2 min-w-0 w-auto max-w-full whitespace-nowrap"
                                            style={{ width: 'auto', minWidth: 0 }}
                                        >
                                            {crop.icon && (
                                                <img src={crop.icon} alt={crop.display_name} className="w-4 h-4" />
                                            )}
                                            <span className="text-xs truncate" style={{ maxWidth: 120 }}>{crop.display_name}</span>
                                        </Button>
                                    ))
                                    : (
                                        <div className="col-span-full text-center text-muted-foreground py-4">
                                            {searchTerm ? 'No crops found matching your search' : 'No crops available'}
                                        </div>
                                    )}
                            </div>
                        )}
                        {cropName && (
                            <Badge variant="secondary">
                                Selected: {availableCrops.find(c => c.item_id === cropName)?.display_name}
                            </Badge>
                        )}
                    </div>
                    {/* Mass Input */}
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
                        {selectedCrop && selectedCrop.weightDivisor && (
                            <div className="text-xs text-muted-foreground">
                                Base weight for {selectedCrop.display_name}: <span className="font-semibold">{selectedCrop.weightDivisor} kg</span>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Variant Mutations (Single-select, as buttons) */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Variant Mutation (Choose One)</Label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={variantMutation === '' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setVariantMutation('')}
                            >
                                None
                            </Button>
                            {growthMutations.map((mutation) => (
                                <Button
                                    key={mutation.value}
                                    variant={variantMutation === mutation.value ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setVariantMutation(mutation.value)}
                                    disabled={
                                        (mutation.cropSpecific && !availableCrops.find(c => c.item_id === cropName)?.display_name?.includes(mutation.cropSpecific))
                                    }
                                >
                                    {mutation.label}
                                    {mutation.cropSpecific && (
                                        <Badge variant="outline" className="ml-2 text-xs">
                                            {mutation.cropSpecific} only
                                        </Badge>
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Weather Mutations (Single-select, as buttons) */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Weather Mutation (Choose One)</Label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={weatherMutation === '' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setWeatherMutation('')}
                            >
                                None
                            </Button>
                            {Object.entries(environmentalMutationData).filter(([key, data]) => data.type === 'limited').map(([key, data]) => (
                                <Button
                                    key={key}
                                    variant={weatherMutation === key ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setWeatherMutation(key)}
                                    disabled={data.cropSpecific && !availableCrops.find(c => c.item_id === cropName)?.display_name?.includes(data.cropSpecific)}
                                >
                                    {data.label} (x{data.multiplier})
                                    {data.cropSpecific && (
                                        <Badge variant="outline" className="ml-1 text-xs">
                                            {data.cropSpecific}
                                        </Badge>
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Regular Mutations (Multi-select, as buttons) */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Mutations (Multiple Allowed)</Label>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(environmentalMutationData).filter(([key, data]) => data.type === 'standard').map(([key, data]) => {
                                let disabled = false;
                                if ((key === 'sundried' || key === 'verdant') && regularMutations.sundried && regularMutations.verdant) disabled = true;
                                // Paradisal + only one of Sundried or Verdant
                                if (key === 'sundried' && regularMutations.paradisal && regularMutations.verdant) disabled = true;
                                if (key === 'verdant' && regularMutations.paradisal && regularMutations.sundried) disabled = true;
                                return (
                                    <Button
                                        key={key}
                                        variant={regularMutations[key] ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handleEnvironmentalMutationChange(key, !regularMutations[key])}
                                        disabled={
                                            (data.cropSpecific && !availableCrops.find(c => c.item_id === cropName)?.display_name?.includes(data.cropSpecific)) ||
                                            disabled
                                        }
                                    >
                                        {data.label} (x{data.multiplier})
                                        {data.cropSpecific && (
                                            <Badge variant="outline" className="ml-1 text-xs">
                                                {data.cropSpecific}
                                            </Badge>
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    <Button
                        onClick={calculatePrice}
                        className="w-full"
                        disabled={loading || cropsLoading || !cropName || !mass}
                    >
                        {loading ? 'Calculating...' : 'Calculate Price'}
                    </Button>
                </CardContent>
            </Card>
            {/* Calculation Results below Calculator */}
            <Card>
                <CardHeader>
                    <CardTitle>Calculation Results</CardTitle>
                </CardHeader>
                <CardContent>
                    {calculationResult ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">
                                    {Math.round(calculationResult.totalPrice).toLocaleString()}
                                </div>
                                <div className="text-muted-foreground">Sheckles</div>
                            </div>
                            <Separator />
                            <div className="space-y-4">
                                <h3 className="font-semibold">Calculation Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Crop:</span>
                                        <span className="font-medium">
                                            {availableCrops.find(c => c.item_id === cropName)?.display_name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Weight:</span>
                                        <span className="font-medium">{calculationResult.breakdown.mass} kg</span>
                                    </div>
                                    {calculationResult.breakdown.variant && (
                                        <div className="flex justify-between">
                                            <span>Variant:</span>
                                            <span className="font-medium">{calculationResult.breakdown.variant}</span>
                                        </div>
                                    )}
                                    {calculationResult.breakdown.mutations && calculationResult.breakdown.mutations.length > 0 && (
                                        <div className="flex justify-between">
                                            <span>Mutations:</span>
                                            <span className="font-medium text-right">
                                                {(calculationResult.breakdown.mutations || []).join(', ')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <Separator />
                                {/* Formula Breakdown */}
                                <div className="space-y-2 text-xs text-muted-foreground">
                                    <div className="font-semibold text-sm text-primary">Formula Used:</div>
                                    <div className="bg-muted rounded p-2">
                                        <span className="font-mono">Total Price = Fruit Constant × (Mass²) × Growth Mutation × (1 + Sum of Mutations - Number of Mutations)</span>
                                    </div>
                                    {/* Step-by-step breakdown */}
                                    {(() => {
                                        const crop = availableCrops.find(c => c.item_id === cropName);
                                        const baseValue = crop?.baseValue ?? 0;
                                        const mass = calculationResult.breakdown.mass;
                                        // Growth mutation multiplier
                                        let growthMultiplier = 1;
                                        let growthLabel = 'None';
                                        if (calculationResult.breakdown.variant) {
                                            const found = growthMutations.find(m => m.value === calculationResult.breakdown.variant);
                                            if (found) {
                                                growthMultiplier = found.multiplier;
                                                growthLabel = found.label;
                                            }
                                        }
                                        // Mutations
                                        let mutationMultipliers: number[] = [];
                                        let mutationLabels: string[] = [];
                                        if (weatherMutation) {
                                            mutationLabels.push(environmentalMutationData[weatherMutation].label);
                                            mutationMultipliers.push(environmentalMutationData[weatherMutation].multiplier);
                                        }
                                        Object.entries(regularMutations)
                                            .filter(([_, active]) => active)
                                            .forEach(([mutation]) => {
                                                mutationLabels.push(environmentalMutationData[mutation].label);
                                                mutationMultipliers.push(environmentalMutationData[mutation].multiplier);
                                            });
                                        const sumMutations = mutationMultipliers.reduce((a, b) => a + b, 0);
                                        const numMutations = mutationMultipliers.length;
                                        return (
                                            <div className="space-y-1 mt-2">
                                                <div>
                                                    <span className="font-semibold">Fruit Constant (Base Value): </span>
                                                    <span className="font-mono">{baseValue}</span>
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Mass: </span>
                                                    <span className="font-mono">{mass}</span>
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Growth Mutation Multiplier: </span>
                                                    <span className="font-mono">{growthMultiplier}</span>
                                                    {growthLabel !== 'None' && (
                                                        <span className="ml-2">({growthLabel})</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Mutation Multipliers: </span>
                                                    <span className="font-mono">[
                                                        {mutationMultipliers.join(', ')}
                                                        ]</span>
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Sum of Mutations: </span>
                                                    <span className="font-mono">{sumMutations}</span>
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Number of Mutations: </span>
                                                    <span className="font-mono">{numMutations}</span>
                                                </div>
                                                <div className="font-semibold mt-2">Step-by-step:</div>
                                                <div className="bg-muted rounded p-2 font-mono">
                                                    {baseValue} × ({mass}²) × {growthMultiplier} × (1 + {sumMutations} - {numMutations})
                                                </div>
                                                <div>
                                                    = {baseValue} × {Math.pow(mass, 2)} × {growthMultiplier} × {1 + sumMutations - numMutations}
                                                </div>
                                                <div>
                                                    = <span className="font-bold text-primary">{Math.round(calculationResult.totalPrice).toLocaleString()}</span> Sheckles
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    <div className="pt-2">
                                        Calculated using the official Calculation Method from the Grow A Garden.
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Select a crop and enter weight to calculate price</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
