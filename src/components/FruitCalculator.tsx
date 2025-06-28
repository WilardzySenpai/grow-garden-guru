
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
    windstruck: false,
    wet: false,
    chilled: false,
    frozen: false,
    burnt: false,
    cooked: false,
    sundried: false,
    verdant: false,
    paradisal: false,
    dawnbound: false
  });

  const [calculationResult, setCalculationResult] = useState<{
    totalPrice: number;
    breakdown: {
      fruitConstant: number;
      mass: number;
      growthMultiplier: number;
      environmentalMultiplier: number;
    };
  } | null>(null);

  const growthMutations = [
    { value: 'ripe', label: 'Ripe (x20)', multiplier: 20, cropSpecific: 'Sugar Apple' },
    { value: 'gold', label: 'Gold (x50)', multiplier: 50 },
    { value: 'rainbow', label: 'Rainbow (x100)', multiplier: 100 }
  ];

  const environmentalMutationData: {[key: string]: EnvironmentalMutationData} = {
    windstruck: { label: 'Windstruck', multiplier: 0.15 },
    wet: { label: 'Wet', multiplier: 0.25 },
    chilled: { label: 'Chilled', multiplier: 0.10 },
    frozen: { label: 'Frozen', multiplier: 0.35 },
    burnt: { label: 'Burnt', multiplier: 0.20 },
    cooked: { label: 'Cooked', multiplier: 0.30 },
    sundried: { label: 'Sundried', multiplier: 0.18 },
    verdant: { label: 'Verdant', multiplier: 0.22 },
    paradisal: { label: 'Paradisal', multiplier: 0.45 },
    dawnbound: { label: 'Dawnbound', multiplier: 0.28, cropSpecific: 'Sunflower' }
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
      // Extract crop names from the variants or mutations keys
      // For now, we'll use a default list since the API structure isn't fully clear
      setAvailableCrops(['cactus', 'sugar_apple', 'sunflower', 'watermelon', 'pumpkin', 'tomato']);
    } catch (error) {
      console.error('Failed to load available crops:', error);
      // Fallback to default crops
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

    // Environmental multiplier calculation
    const activeEnvironmentalMutations = Object.entries(environmentalMutations)
      .filter(([_, active]) => active)
      .map(([mutation, _]) => mutation);
    
    const environmentalSum = activeEnvironmentalMutations.reduce((sum, mutation) => {
      return sum + environmentalMutationData[mutation].multiplier;
    }, 0);
    
    const environmentalMultiplier = 1 + environmentalSum - activeEnvironmentalMutations.length;

    // Final calculation: TotalPrice = FruitConstant * Mass^2 * GrowthMutation * EnvironmentalMultiplier
    const totalPrice = fruitConstant * Math.pow(massNum, 2) * growthMultiplier * environmentalMultiplier;

    setCalculationResult({
      totalPrice,
      breakdown: {
        fruitConstant,
        mass: massNum,
        growthMultiplier,
        environmentalMultiplier
      }
    });

    toast({
      title: "Calculation Complete",
      description: `Total price: ${Math.round(totalPrice).toLocaleString()} Sheckles`,
    });
  };

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

          {/* Environmental Mutations */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Environmental Mutations</Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(environmentalMutationData).map(([key, data]) => (
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
                    {data.label} (+{data.multiplier})
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
                    <span>Base Price:</span>
                    <span className="font-medium">{calculationResult.breakdown.fruitConstant}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Weight²:</span>
                    <span className="font-medium">
                      {calculationResult.breakdown.mass}² = {Math.pow(calculationResult.breakdown.mass, 2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Growth Multiplier:</span>
                    <span className="font-medium">x{calculationResult.breakdown.growthMultiplier}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Environmental Multiplier:</span>
                    <span className="font-medium">x{calculationResult.breakdown.environmentalMultiplier.toFixed(3)}</span>
                  </div>
                </div>

                <Separator />

                <div className="text-xs text-muted-foreground">
                  Formula: Base Price × Weight² × Growth Multiplier × Environmental Multiplier
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
