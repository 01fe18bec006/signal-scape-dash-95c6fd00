
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Function, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SignalCreationProps {
  signals: string[];
  isVisible: boolean;
  onSignalCreated: (newSignalName: string) => void;
}

const predefinedFunctions = [
  { name: 'sum', description: 'Sum of selected signals', formula: 'signal1 + signal2' },
  { name: 'mean', description: 'Average of selected signals', formula: '(signal1 + signal2) / 2' },
  { name: 'diff', description: 'Difference between signals', formula: 'signal1 - signal2' },
  { name: 'ratio', description: 'Ratio of signals', formula: 'signal1 / signal2' },
  { name: 'zscore', description: 'Z-score normalization', formula: '(signal1 - mean) / std' },
  { name: 'moving_avg', description: 'Moving average', formula: 'rolling_mean(signal1, window=5)' }
];

export const SignalCreation: React.FC<SignalCreationProps> = ({
  signals,
  isVisible,
  onSignalCreated
}) => {
  const [newSignalName, setNewSignalName] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('');
  const [customFormula, setCustomFormula] = useState('');
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleSignalToggle = (signal: string) => {
    setSelectedSignals(prev => 
      prev.includes(signal) 
        ? prev.filter(s => s !== signal)
        : [...prev, signal]
    );
  };

  const applyPredefinedFunction = (functionName: string) => {
    const func = predefinedFunctions.find(f => f.name === functionName);
    if (func && selectedSignals.length >= 2) {
      let formula = func.formula;
      selectedSignals.forEach((signal, index) => {
        formula = formula.replace(`signal${index + 1}`, signal);
      });
      setCustomFormula(formula);
    }
  };

  const createSignal = async () => {
    if (!newSignalName.trim() || !customFormula.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both signal name and formula",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      // Simulate signal creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSignalCreated(newSignalName);
      
      toast({
        title: "Signal Created",
        description: `New signal "${newSignalName}" has been created successfully`,
      });

      // Reset form
      setNewSignalName('');
      setCustomFormula('');
      setSelectedSignals([]);
      setSelectedFunction('');
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "An error occurred while creating the signal",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Function className="w-5 h-5 text-green-600" />
          <span>Create New Signal</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="signal-name">New Signal Name</Label>
              <Input
                id="signal-name"
                value={newSignalName}
                onChange={(e) => setNewSignalName(e.target.value)}
                placeholder="e.g., combined_signal"
              />
            </div>

            <div>
              <Label>Select Base Signals</Label>
              <div className="max-h-32 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                <div className="grid grid-cols-1 gap-1">
                  {signals.map((signal) => (
                    <div key={signal} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`signal-${signal}`}
                        checked={selectedSignals.includes(signal)}
                        onChange={() => handleSignalToggle(signal)}
                        className="rounded"
                      />
                      <label 
                        htmlFor={`signal-${signal}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {signal}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {selectedSignals.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedSignals.map(signal => (
                    <Badge key={signal} variant="secondary" className="text-xs">
                      {signal}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Predefined Functions</Label>
              <Select onValueChange={(value) => {
                setSelectedFunction(value);
                applyPredefinedFunction(value);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a function" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedFunctions.map((func) => (
                    <SelectItem key={func.name} value={func.name}>
                      <div>
                        <div className="font-medium">{func.name}</div>
                        <div className="text-xs text-gray-600">{func.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="formula">Custom Formula</Label>
              <Textarea
                id="formula"
                value={customFormula}
                onChange={(e) => setCustomFormula(e.target.value)}
                placeholder="Enter custom formula (e.g., signal1 * 2 + signal2)"
                className="min-h-[100px] font-mono text-sm"
              />
              <p className="text-xs text-gray-600 mt-1">
                Use signal names directly in your formula. Available operators: +, -, *, /, ()
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={createSignal} 
          disabled={isCreating || !newSignalName.trim() || !customFormula.trim()}
          className="w-full"
        >
          <Calculator className="w-4 h-4 mr-2" />
          {isCreating ? 'Creating Signal...' : 'Create Signal'}
        </Button>
      </CardContent>
    </Card>
  );
};
