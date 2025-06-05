
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, BarChart3, ScatterChart, AreaChart } from 'lucide-react';
import { ChartConfig } from '../Dashboard';

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChart: (chart: Omit<ChartConfig, 'id' | 'position'>) => void;
  signals: string[];
}

const chartTypes = [
  { 
    value: 'line', 
    label: 'Line Chart', 
    icon: LineChart, 
    description: 'Best for time-series trends',
    color: 'text-blue-600 bg-blue-50'
  },
  { 
    value: 'bar', 
    label: 'Bar Chart', 
    icon: BarChart3, 
    description: 'Compare discrete values',
    color: 'text-green-600 bg-green-50'
  },
  { 
    value: 'scatter', 
    label: 'Scatter Plot', 
    icon: ScatterChart, 
    description: 'Show correlations',
    color: 'text-purple-600 bg-purple-50'
  },
  { 
    value: 'area', 
    label: 'Area Chart', 
    icon: AreaChart, 
    description: 'Emphasize magnitude',
    color: 'text-orange-600 bg-orange-50'
  }
];

export const ChartModal: React.FC<ChartModalProps> = ({
  isOpen,
  onClose,
  onAddChart,
  signals
}) => {
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!title || !selectedType || selectedSignals.length === 0) return;

    onAddChart({
      type: selectedType as any,
      title,
      data: [],
      size: { width: 400, height: 300 },
      signals: selectedSignals
    });

    // Reset form
    setTitle('');
    setSelectedType('');
    setSelectedSignals([]);
  };

  const handleSignalToggle = (signal: string) => {
    setSelectedSignals(prev => 
      prev.includes(signal) 
        ? prev.filter(s => s !== signal)
        : [...prev, signal]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Chart</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Chart Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Chart Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter chart title..."
              className="w-full"
            />
          </div>

          {/* Chart Type Selection */}
          <div className="space-y-3">
            <Label>Select Chart Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {chartTypes.map((type) => (
                <Card 
                  key={type.value}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedType === type.value 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedType(type.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${type.color}`}>
                        <type.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{type.label}</h3>
                        <p className="text-xs text-gray-600">{type.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Signal Selection */}
          <div className="space-y-3">
            <Label>Select Signals to Display</Label>
            <div className="max-h-32 overflow-y-auto border rounded-lg p-3 bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                {signals.map((signal) => (
                  <div key={signal} className="flex items-center space-x-2">
                    <Checkbox
                      id={signal}
                      checked={selectedSignals.includes(signal)}
                      onCheckedChange={() => handleSignalToggle(signal)}
                    />
                    <Label 
                      htmlFor={signal} 
                      className="text-sm cursor-pointer flex-1"
                    >
                      {signal}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            {selectedSignals.length > 0 && (
              <p className="text-xs text-green-600">
                {selectedSignals.length} signal(s) selected
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!title || !selectedType || selectedSignals.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create Chart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
