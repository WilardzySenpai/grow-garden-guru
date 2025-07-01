
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { TrendingUp } from 'lucide-react';
import type { ItemInfo } from '@/types/api';

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
  const [availableCrops, setAvailableCrops] = useState<ItemInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [cropsLoading, setCropsLoading] = useState(true);
  
  // Growth mutations (only one allowed)
  const [growthMutation, setGrowthMutation] = useState<string>('');
  
  // Environmental mutations
  const [environmentalMutations, setEnvironmentalMutations] = useState<{[key: string]: boolean}>({
    wet: false,
    windstruck: false,
    moonlit: false,
    chilled: false,
    choc: false,
    bloodlit: false,
    twisted: false,
    drenched: false,
    frozen: false,
    aurora: false,
    shocked: false,
    celestial: false,
    pollinated: false,
    burnt: false,
    verdant: false,
    wiltproof: false,
    cloudtouched: false,
    honeyglazed: false,
    plasma: false,
    heavenly: false,
    fried: false,
    cooked: false,
    zombified: false,
    molten: false,
    sundried: false,
    paradisal: false,
    alienlike: false,
    galactic: false,
    disco: false,
    voidtouched: false,
    dawnbound: false
  });

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

  const environmentalMutationData: {[key: string]: EnvironmentalMutationData} = {
    // Standard Environmental Mutations
    wet: { label: 'Wet', multiplier: 2, type: 'standard' },
    windstruck: { label: 'Windstruck', multiplier: 2, type: 'standard' },
    moonlit: { label: 'Moonlit', multiplier: 2, type: 'standard' },
    chilled: { label: 'Chilled', multiplier: 2, type: 'standard' },
    choc: { label: 'Choc', multiplier: 3, type: 'standard' },
    bloodlit: { label: 'Bloodlit', multiplier: 4, type: 'standard' },
    twisted: { label: 'Twisted', multiplier: 5, type: 'standard' },
    drenched: { label: 'Drenched', multiplier: 5, type: 'standard' },
    frozen: { label: 'Frozen', multiplier: 10, type: 'standard' },
    aurora: { label: 'Aurora', multiplier: 90, type: 'standard' },
    shocked: { label: 'Shocked', multiplier: 100, type: 'standard' },
    celestial: { label: 'Celestial', multiplier: 120, type: 'standard' },
    
    // Limited Environmental Mutations
    pollinated: { label: 'Pollinated', multiplier: 3, type: 'limited' },
    burnt: { label: 'Burnt', multiplier: 4, type: 'limited' },
    verdant: { label: 'Verdant', multiplier: 4, type: 'limited' },
    wiltproof: { label: 'Wiltproof', multiplier: 4, type: 'limited' },
    cloudtouched: { label: 'Cloudtouched', multiplier: 5, type: 'limited' },
    honeyglazed: { label: 'HoneyGlazed', multiplier: 5, type: 'limited' },
    plasma: { label: 'Plasma', multiplier: 5, type: 'limited' },
    heavenly: { label: 'Heavenly', multiplier: 5, type: 'limited' },
    fried: { label: 'Fried', multiplier: 8, type: 'limited' },
    cooked: { label: 'Cooked', multiplier: 25, type: 'limited' },
    zombified: { label: 'Zombified', multiplier: 25, type: 'limited' },
    molten: { label: 'Molten', multiplier: 25, type: 'limited' },
    sundried: { label: 'Sundried', multiplier: 85, type: 'limited' },
    paradisal: { label: 'Paradisal', multiplier: 100, type: 'limited' },
    alienlike: { label: 'Alienlike', multiplier: 100, type: 'limited' },
    galactic: { label: 'Galactic', multiplier: 120, type: 'limited' },
    disco: { label: 'Disco', multiplier: 125, type: 'limited' },
    voidtouched: { label: 'Voidtouched', multiplier: 135, type: 'limited' },
    dawnbound: { label: 'Dawnbound', multiplier: 150, type: 'limited', cropSpecific: 'Sunflower' }
  };

  // Load available crops on component mount
  useEffect(() => {
    loadAvailableCrops();
  }, []);

  const loadAvailableCrops = async () => {
    setCropsLoading(true);
    try {
      console.log('FruitCalculator: Fetching available crops');
      const response = await fetch('https://api.joshlei.com/v2/growagarden/info?type=seed');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ItemInfo[] = await response.json();
      console.log('FruitCalculator: Crops loaded', data);
      setAvailableCrops(data || []);
      
      toast({
        title: "Crops Loaded",
        description: `Found ${data?.length || 0} available crops`,
      });
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

  // Handle automatic Paradisal replacement
  useEffect(() => {
    if (environmentalMutations.sundried && environmentalMutations.verdant) {
      setEnvironmentalMutations(prev => ({
        ...prev,
        sundried: false,
        verdant: false,
        paradisal: true
      }));
      
      toast({
        title: "Automatic Replacement",
        description: "Sundried + Verdant has been replaced with Paradisal.",
      });
    }
  }, [environmentalMutations.sundried, environmentalMutations.verdant]);

  const handleEnvironmentalMutationChange = (mutation: string, checked: boolean) => {
    if (checked) {
      let newMutations = { ...environmentalMutations };
      
      // Temperature exclusions: chilled, wet, frozen (only one allowed)
      if (['chilled', 'wet', 'frozen'].includes(mutation)) {
        newMutations.chilled = false;
        newMutations.wet = false;
        newMutations.frozen = false;
      }
      
      // Heat exclusions: burnt and cooked cannot coexist
      if (mutation === 'burnt') {
        newMutations.cooked = false;
      } else if (mutation === 'cooked') {
        newMutations.burnt = false;
      }
      
      newMutations[mutation] = checked;
      setEnvironmentalMutations(newMutations);
    } else {
      setEnvironmentalMutations(prev => ({ ...prev, [mutation]: checked }));
    }
  };

  const calculatePrice = async () => {
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
      // Build API parameters
      const params = new URLSearchParams({
        Name: cropName,
        Weight: mass
      });

      // Add variant if selected
      if (growthMutation) {
        params.append('Variant', growthMutation);
      }

      // Add mutations if selected
      const activeMutations = Object.entries(environmentalMutations)
        .filter(([_, active]) => active)
        .map(([mutation, _]) => environmentalMutationData[mutation].label);
      
      if (activeMutations.length > 0) {
        params.append('Mutation', activeMutations.join(','));
      }

      console.log('FruitCalculator: Calculating with params:', params.toString());
      const response = await fetch(`https://api.joshlei.com/v2/growagarden/calculate?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CalculateResponse = await response.json();
      console.log('FruitCalculator: Calculation result:', data);

      setCalculationResult({
        totalPrice: data.base_price,
        breakdown: {
          basePrice: data.base_price,
          mass: massNum,
          variant: growthMutation,
          mutations: activeMutations
        }
      });

      toast({
        title: "Calculation Complete",
        description: `Total price: ${Math.round(data.base_price).toLocaleString()} Sheckles`,
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

  const standardMutations = Object.entries(environmentalMutationData).filter(([_, data]) => data.type === 'standard');
  const limitedMutations = Object.entries(environmentalMutationData).filter(([_, data]) => data.type === 'limited');

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>🍉 Fruit Price Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Crop Selection */}
          <div className="space-y-2">
            <Label>Crop Type</Label>
            <Select value={cropName} onValueChange={setCropName} disabled={cropsLoading}>
              <SelectTrigger>
                <SelectValue placeholder={cropsLoading ? "Loading crops..." : "Select a crop"} />
              </SelectTrigger>
              <SelectContent>
                {availableCrops.map((crop) => (
                  <SelectItem key={crop.item_id} value={crop.item_id}>
                    <div className="flex items-center gap-2">
                      {crop.icon && (
                        <img src={crop.icon} alt={crop.display_name} className="w-4 h-4" />
                      )}
                      {crop.display_name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          </div>

          <Separator />

          {/* Growth Mutations */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Growth Mutation (Choose One)</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="none"
                  name="growthMutation"
                  value=""
                  checked={growthMutation === ''}
                  onChange={(e) => setGrowthMutation(e.target.value)}
                  className="w-4 h-4"
                />
                <Label htmlFor="none">None</Label>
              </div>
              {growthMutations.map((mutation) => (
                <div key={mutation.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={mutation.value}
                    name="growthMutation"
                    value={mutation.value}
                    checked={growthMutation === mutation.value}
                    onChange={(e) => setGrowthMutation(e.target.value)}
                    disabled={mutation.cropSpecific && !availableCrops.find(c => c.item_id === cropName)?.display_name?.includes(mutation.cropSpecific)}
                    className="w-4 h-4"
                  />
                  <Label 
                    htmlFor={mutation.value}
                    className={`${mutation.cropSpecific && !availableCrops.find(c => c.item_id === cropName)?.display_name?.includes(mutation.cropSpecific) ? 'text-muted-foreground' : ''}`}
                  >
                    {mutation.label}
                    {mutation.cropSpecific && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {mutation.cropSpecific} only
                      </Badge>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Standard Environmental Mutations */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Standard Environmental Mutations</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {standardMutations.map(([key, data]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={environmentalMutations[key]}
                    onCheckedChange={(checked) => handleEnvironmentalMutationChange(key, checked as boolean)}
                    disabled={data.cropSpecific && !availableCrops.find(c => c.item_id === cropName)?.display_name?.includes(data.cropSpecific)}
                  />
                  <Label 
                    htmlFor={key}
                    className={`text-sm ${data.cropSpecific && !availableCrops.find(c => c.item_id === cropName)?.display_name?.includes(data.cropSpecific) ? 'text-muted-foreground' : ''}`}
                  >
                    {data.label} (x{data.multiplier})
                    {data.cropSpecific && (
                      <Badge variant="outline" className="ml-1 text-xs">
                        {data.cropSpecific}
                      </Badge>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Limited Environmental Mutations */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Limited Environmental Mutations</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {limitedMutations.map(([key, data]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`limited-${key}`}
                    checked={environmentalMutations[key]}
                    onCheckedChange={(checked) => handleEnvironmentalMutationChange(key, checked as boolean)}
                    disabled={data.cropSpecific && !availableCrops.find(c => c.item_id === cropName)?.display_name?.includes(data.cropSpecific)}
                  />
                  <Label 
                    htmlFor={`limited-${key}`}
                    className={`text-sm ${data.cropSpecific && !availableCrops.find(c => c.item_id === cropName)?.display_name?.includes(data.cropSpecific) ? 'text-muted-foreground' : ''}`}
                  >
                    {data.label} (x{data.multiplier})
                    {data.cropSpecific && (
                      <Badge variant="outline" className="ml-1 text-xs">
                        {data.cropSpecific}
                      </Badge>
                    )}
                  </Label>
                </div>
              ))}
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

      {/* Results Section */}
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
                  
                  {calculationResult.breakdown.mutations.length > 0 && (
                    <div className="flex justify-between">
                      <span>Mutations:</span>
                      <span className="font-medium text-right">
                        {calculationResult.breakdown.mutations.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="text-xs text-muted-foreground">
                  <div>Calculated using the official Grow A Garden API</div>
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
