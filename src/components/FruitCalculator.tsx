
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
import { trending_up } from 'lucide-react';

interface FruitData {
  name: string;
  fruit_constant: number;
}

export const FruitCalculator = () => {
  const [cropName, setCropName] = useState('');
  const [mass, setMass] = useState('');
  const [fruitConstant, setFruitConstant] = useState<number | null>(null);
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

  const crops = ['Sugar Apple', 'Sunflower', 'Watermelon', 'Pumpkin', 'Tomato'];
  
  const growthMutations = [
    { value: 'ripe', label: 'Ripe (x20)', multiplier: 20, cropSpecific: 'Sugar Apple' },
    { value: 'gold', label: 'Gold (x50)', multiplier: 50 },
    { value: 'rainbow', label: 'Rainbow (x100)', multiplier: 100 }
  ];

  const environmentalMutationData = {
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

  const fetchFruitConstant = async (name: string) => {
    setLoading(true);
    try {
      // Simulate API call to /calculate endpoint
      // In production: const response = await fetch(`/calculate?name=${encodeURIComponent(name)}`);
      
      // Mock data for demonstration
      const mockConstants: {[key: string]: number} = {
        'Sugar Apple': 1.2,
        'Sunflower': 0.8,
        'Watermelon': 1.5,
        'Pumpkin': 1.0,
        'Tomato': 0.9
      };
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      const constant = mockConstants[name] || 1.0;
      setFruitConstant(constant);
      
      toast({
        title: "Fruit constant loaded",
        description: `${name}: ${constant}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch fruit constant.",
        variant: "destructive"
      });
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
    // Exclusivity rules
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
      return sum + environmentalMutationData[mutation as keyof typeof environmentalMutationData].multiplier;
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
                {crops.map((crop) => (
                  <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fruitConstant !== null && (
              <Badge variant="secondary">
                Fruit Constant: {fruitConstant}
              </Badge>
            )}
          </div>

          {/* Mass Input */}
          <div className="space-y-2">
            <Label>Mass (kg)</Label>
            <Input
              type="number"
              value={mass}
              onChange={(e) => setMass(e.target.value)}
              placeholder="Enter mass in kilograms"
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
                    disabled={mutation.cropSpecific && cropName !== mutation.cropSpecific}
                    className="w-4 h-4"
                  />
                  <Label 
                    htmlFor={mutation.value}
                    className={`${mutation.cropSpecific && cropName !== mutation.cropSpecific ? 'text-muted-foreground' : ''}`}
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
                    disabled={data.cropSpecific && cropName !== data.cropSpecific}
                  />
                  <Label 
                    htmlFor={key}
                    className={`text-sm ${data.cropSpecific && cropName !== data.cropSpecific ? 'text-muted-foreground' : ''}`}
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
                    <span>Environmental Multiplier:</span>
                    <span className="font-medium">x{calculationResult.breakdown.environmentalMultiplier.toFixed(3)}</span>
                  </div>
                </div>

                <Separator />

                <div className="text-xs text-muted-foreground">
                  Formula: Fruit Constant × Mass² × Growth Multiplier × Environmental Multiplier
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <trending_up className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a crop and enter mass to calculate price</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
