
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { LineChart, BarChart3, ScatterChart, AreaChart, X, Plus } from 'lucide-react';
import { ChartConfig } from '../Dashboard';

interface ChartEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  chart: ChartConfig | null;
  onUpdateChart: (id: string, updates: Partial<ChartConfig>) => void;
  signals: string[];
}

const chartTypes = [
  { value: 'line', label: 'Line Chart', icon: LineChart },
  { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
  { value: 'scatter', label: 'Scatter Plot', icon: ScatterChart },
  { value: 'area', label: 'Area Chart', icon: AreaChart }
];

export const ChartEditModal: React.FC<ChartEditModalProps> = ({
  isOpen,
  onClose,
  chart,
  onUpdateChart,
  signals
}) => {
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const [signalFilters, setSignalFilters] = useState<{ signal: string; condition: string; value: number }[]>([]);
  const [legendName, setLegendName] = useState('');
  const [xAxisName, setXAxisName] = useState('');
  const [yAxisName, setYAxisName] = useState('');
  const [chartWidth, setChartWidth] = useState(400);
  const [chartHeight, setChartHeight] = useState(300);

  useEffect(() => {
    if (chart) {
      setTitle(chart.title);
      setSelectedType(chart.type);
      setSelectedSignals(chart.signals);
      setSignalFilters(chart.signalFilters || []);
      setLegendName(chart.legendName || 'Legend');
      setXAxisName(chart.xAxisName || 'Time');
      setYAxisName(chart.yAxisName || 'Value');
      setChartWidth(chart.size.width);
      setChartHeight(chart.size.height);
    }
  }, [chart]);

  const handleSubmit = () => {
    if (!chart) return;

    onUpdateChart(chart.id, {
      title,
      type: selectedType as any,
      signals: selectedSignals,
      signalFilters,
      legendName,
      xAxisName,
      yAxisName,
      size: { width: chartWidth, height: chartHeight }
    });

    onClose();
  };

  const handleSignalToggle = (signal: string) => {
    setSelectedSignals(prev => 
      prev.includes(signal) 
        ? prev.filter(s => s !== signal)
        : [...prev, signal]
    );
  };

  const addSignalFilter = () => {
    setSignalFilters(prev => [
      ...prev,
      { signal: signals[0] || '', condition: '>', value: 0 }
    ]);
  };

  const updateSignalFilter = (index: number, field: string, value: any) => {
    setSignalFilters(prev => prev.map((filter, i) => 
      i === index ? { ...filter, [field]: value } : filter
    ));
  };

  const removeSignalFilter = (index: number) => {
    setSignalFilters(prev => prev.filter((_, i) => i !== index));
  };

  if (!chart) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Chart Configuration</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Properties */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Chart Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter chart title..."
                  />
                </div>

                <div>
                  <Label>Chart Type</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {chartTypes.map((type) => (
                      <Button
                        key={type.value}
                        variant={selectedType === type.value ? "default" : "outline"}
                        onClick={() => setSelectedType(type.value)}
                        className="h-auto p-3"
                      >
                        <div className="flex flex-col items-center space-y-1">
                          <type.icon className="w-4 h-4" />
                          <span className="text-xs">{type.label}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Signal Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Signal Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-32 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                  <div className="grid grid-cols-1 gap-2">
                    {signals.map((signal) => (
                      <div key={signal} className="flex items-center space-x-2">
                        <Checkbox
                          id={signal}
                          checked={selectedSignals.includes(signal)}
                          onCheckedChange={() => handleSignalToggle(signal)}
                        />
                        <Label htmlFor={signal} className="text-sm cursor-pointer flex-1">
                          {signal}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Axis and Legend Names */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Labels & Naming</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="legendName">Legend Name</Label>
                  <Input
                    id="legendName"
                    value={legendName}
                    onChange={(e) => setLegendName(e.target.value)}
                    placeholder="Legend"
                  />
                </div>
                <div>
                  <Label htmlFor="xAxisName">X-Axis Label</Label>
                  <Input
                    id="xAxisName"
                    value={xAxisName}
                    onChange={(e) => setXAxisName(e.target.value)}
                    placeholder="Time"
                  />
                </div>
                <div>
                  <Label htmlFor="yAxisName">Y-Axis Label</Label>
                  <Input
                    id="yAxisName"
                    value={yAxisName}
                    onChange={(e) => setYAxisName(e.target.value)}
                    placeholder="Value"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Chart Size */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chart Size</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Width: {chartWidth}px</Label>
                  <Slider
                    value={[chartWidth]}
                    onValueChange={(value) => setChartWidth(value[0])}
                    min={200}
                    max={800}
                    step={50}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Height: {chartHeight}px</Label>
                  <Slider
                    value={[chartHeight]}
                    onValueChange={(value) => setChartHeight(value[0])}
                    min={150}
                    max={600}
                    step={50}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Signal Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Signal Filters</CardTitle>
              <Button onClick={addSignalFilter} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {signalFilters.length === 0 ? (
              <p className="text-sm text-gray-500">No filters applied</p>
            ) : (
              <div className="space-y-3">
                {signalFilters.map((filter, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Select
                      value={filter.signal}
                      onValueChange={(value) => updateSignalFilter(index, 'signal', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {signals.map(signal => (
                          <SelectItem key={signal} value={signal}>{signal}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={filter.condition}
                      onValueChange={(value) => updateSignalFilter(index, 'condition', value)}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=">">{'>'}</SelectItem>
                        <SelectItem value="<">{'<'}</SelectItem>
                        <SelectItem value=">=">{'≥'}</SelectItem>
                        <SelectItem value="<=">{'≤'}</SelectItem>
                        <SelectItem value="==">{'='}</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input
                      type="number"
                      value={filter.value}
                      onChange={(e) => updateSignalFilter(index, 'value', Number(e.target.value))}
                      className="w-24"
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSignalFilter(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Update Chart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
