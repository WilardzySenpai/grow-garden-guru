
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
  const [fruitConstant, setFruitConstant] = useState<number | null>(null);
  const [availableCrops, setAvailableCrops] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
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
      fruitConstant: number;
      mass: number;
      growthMultiplier: number;
      environmentalMultiplier: number;
      mutationSum: number;
      mutationCount: number;
    };
  } | null>(null);

  const growthMutations = [
    { value: 'ripe', label: 'Ripe (x2)', multiplier: 2, cropSpecific: 'Sugar Apple' },
    { value: 'gold', label: 'Gold (x20)', multiplier: 20 },
    { value: 'rainbow', label: 'Rainbow (x50)', multiplier: 50 }
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
    try {
      const response = await fetch('https://api.joshlei.com/v2/growagarden/calculate');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CalculateResponse = await response.json();
      setAvailableCrops(['cactus', 'sugar_apple', 'sunflower', 'watermelon', 'pumpkin', 'tomato']);
    } catch (error) {
      console.error('Failed to load available crops:', error);
      setAvailableCrops(['cactus', 'sugar_apple', 'sunflower', 'watermelon', 'pumpkin', 'tomato']);
    }
  };

  const fetchFruitConstant = async (name: string) => {
    setLoading(true);
    try {
      const itemId = name.toLowerCase().replace(/ /g, "_");
      const response = await fetch(`https://api.joshlei.com/v2/growagarden/calculate?Name=${encodeURIComponent(itemId)}&Weight=1`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CalculateResponse = await response.json();
      const constant = data.base_price || 1.0;
      setFruitConstant(constant);
      
      toast({
        title: "Fruit constant loaded",
        description: `${name}: ${constant}`,
      });
    } catch (error) {
      console.error('Failed to fetch fruit constant:', error);
      toast({
        title: "Error",
        description: "Failed to fetch fruit constant. Using default value.",
        variant: "destructive"
      });
      setFruitConstant(1.0);
    } finally {
      setLoading(false);
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

  const calculatePrice = () => {
    if (!fruitConstant || !mass) {
      toast({
        title: "Missing Information",
        description: "Please select a crop and enter mass.",
        variant: "destructive"
      });
      return;
    }

    const massNum = parseFloat(mass);
    if (massNum <= 0) {
      toast({
        title: "Invalid Mass",
        description: "Mass must be greater than 0.",
        variant: "destructive"
      });
      return;
    }

    // Growth multiplier
    const growthMultiplier = growthMutation ? 
      growthMutations.find(m => m.value === growthMutation)?.multiplier || 1 : 1;

    // Environmental multiplier calculation using wiki formula
    const activeEnvironmentalMutations = Object.entries(environmentalMutations)
      .filter(([_, active]) => active)
      .map(([mutation, _]) => mutation);
    
    const mutationSum = activeEnvironmentalMutations.reduce((sum, mutation) => {
      return sum + environmentalMutationData[mutation].multiplier;
    }, 0);
    
    const mutationCount = activeEnvironmentalMutations.length;
    
    // Wiki formula: (1 + ΣMutations - Number of Mutations)
    const environmentalMultiplier = mutationCount > 0 ? (1 + mutationSum - mutationCount) : 1;

    // Final calculation: TotalPrice = FruitConstant × Mass² × GrowthMutation × EnvironmentalMultiplier
    const totalPrice = fruitConstant * Math.pow(massNum, 2) * growthMultiplier * environmentalMultiplier;

    setCalculationResult({
      totalPrice,
      breakdown: {
        fruitConstant,
        mass: massNum,
        growthMultiplier,
        environmentalMultiplier,
        mutationSum,
        mutationCount
      }
    });

    toast({
      title: "Calculation Complete",
      description: `Total price: ${Math.round(totalPrice).toLocaleString()} Sheckles`,
    });
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
            <Select value={cropName} onValueChange={(value) => {
              setCropName(value);
              fetchFruitConstant(value);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a crop" />
              </SelectTrigger>
              <SelectContent>
                {availableCrops.map((crop) => (
                  <SelectItem key={crop} value={crop}>
                    {crop.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fruitConstant !== null && (
              <Badge variant="secondary">
                Base Price: {fruitConstant}
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
                <Label htmlFor="none">None (x1)</Label>
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
                    disabled={mutation.cropSpecific && !cropName.toLowerCase().includes(mutation.cropSpecific.toLowerCase().replace(/ /g, '_'))}
                    className="w-4 h-4"
                  />
                  <Label 
                    htmlFor={mutation.value}
                    className={`${mutation.cropSpecific && !cropName.toLowerCase().includes(mutation.cropSpecific.toLowerCase().replace(/ /g, '_')) ? 'text-muted-foreground' : ''}`}
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
                    disabled={data.cropSpecific && !cropName.toLowerCase().includes(data.cropSpecific.toLowerCase().replace(/ /g, '_'))}
                  />
                  <Label 
                    htmlFor={key}
                    className={`text-sm ${data.cropSpecific && !cropName.toLowerCase().includes(data.cropSpecific.toLowerCase().replace(/ /g, '_')) ? 'text-muted-foreground' : ''}`}
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
                    disabled={data.cropSpecific && !cropName.toLowerCase().includes(data.cropSpecific.toLowerCase().replace(/ /g, '_'))}
                  />
                  <Label 
                    htmlFor={`limited-${key}`}
                    className={`text-sm ${data.cropSpecific && !cropName.toLowerCase().includes(data.cropSpecific.toLowerCase().replace(/ /g, '_')) ? 'text-muted-foreground' : ''}`}
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
            disabled={loading || !fruitConstant || !mass}
          >
            {loading ? 'Loading...' : 'Calculate Price'}
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
                <h3 className="font-semibold">Calculation Breakdown</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Fruit Constant:</span>
                    <span className="font-medium">{calculationResult.breakdown.fruitConstant}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Mass²:</span>
                    <span className="font-medium">
                      {calculationResult.breakdown.mass}² = {Math.pow(calculationResult.breakdown.mass, 2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Growth Multiplier:</span>
                    <span className="font-medium">x{calculationResult.breakdown.growthMultiplier}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Environmental Calculation:</span>
                    <span className="font-medium">
                      (1 + {calculationResult.breakdown.mutationSum} - {calculationResult.breakdown.mutationCount}) = x{calculationResult.breakdown.environmentalMultiplier.toFixed(0)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Formula: Fruit Constant × Mass² × Growth Multiplier × Environmental Multiplier</div>
                  <div>Environmental: (1 + Sum of Mutations - Count of Mutations)</div>
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
