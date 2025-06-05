
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Filter, Calendar, Clock, FileText, Plus, X } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FilterPanelProps {
  signals: string[];
  selectedFiles: File[];
}

interface ConditionalFilter {
  id: string;
  signal: string;
  operator: string;
  value: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  signals,
  selectedFiles
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dateRange, setDateRange] = useState(['2024-01-01', '2024-12-31']);
  const [timeRange, setTimeRange] = useState([0, 24]);
  const [conditionalFilters, setConditionalFilters] = useState<ConditionalFilter[]>([]);

  const addConditionalFilter = () => {
    const newFilter: ConditionalFilter = {
      id: `filter-${Date.now()}`,
      signal: signals[0] || '',
      operator: '>',
      value: ''
    };
    setConditionalFilters(prev => [...prev, newFilter]);
  };

  const removeConditionalFilter = (id: string) => {
    setConditionalFilters(prev => prev.filter(f => f.id !== id));
  };

  const updateConditionalFilter = (id: string, field: keyof ConditionalFilter, value: string) => {
    setConditionalFilters(prev => prev.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  return (
    <div className="border-b bg-white shadow-sm">
      <div className="p-4">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between h-auto p-2">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Filters & Analysis</span>
                <Badge variant="secondary" className="text-xs">
                  {conditionalFilters.length} active
                </Badge>
              </div>
              <span className="text-xs text-gray-500">
                {isExpanded ? 'Hide' : 'Show'} Filters
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
              {/* File Selection */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>File Filter</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Select>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="All files" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Files</SelectItem>
                      {selectedFiles.map((file, index) => (
                        <SelectItem key={index} value={file.name}>
                          {file.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Date Range */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span>Date Range</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      type="date" 
                      value={dateRange[0]}
                      onChange={(e) => setDateRange([e.target.value, dateRange[1]])}
                      className="h-8 text-xs"
                    />
                    <Input 
                      type="date" 
                      value={dateRange[1]}
                      onChange={(e) => setDateRange([dateRange[0], e.target.value])}
                      className="h-8 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Time Range */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span>Time Range</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="px-2">
                    <Slider
                      value={timeRange}
                      onValueChange={setTimeRange}
                      max={24}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{timeRange[0]}:00</span>
                    <span>{timeRange[1]}:00</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    Reset Filters
                  </Button>
                  <Button size="sm" className="w-full text-xs bg-blue-600 hover:bg-blue-700">
                    Apply Filters
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Conditional Filters */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Conditional Filters</h3>
                <Button size="sm" variant="outline" onClick={addConditionalFilter}>
                  <Plus className="w-3 h-3 mr-1" />
                  Add Condition
                </Button>
              </div>
              
              {conditionalFilters.length > 0 && (
                <div className="space-y-2">
                  {conditionalFilters.map((filter, index) => (
                    <div key={filter.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      {index > 0 && (
                        <span className="text-xs text-gray-500 font-medium">AND</span>
                      )}
                      <Select 
                        value={filter.signal} 
                        onValueChange={(value) => updateConditionalFilter(filter.id, 'signal', value)}
                      >
                        <SelectTrigger className="h-8 w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {signals.map(signal => (
                            <SelectItem key={signal} value={signal}>{signal}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={filter.operator} 
                        onValueChange={(value) => updateConditionalFilter(filter.id, 'operator', value)}
                      >
                        <SelectTrigger className="h-8 w-16">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=">">{'>'}</SelectItem>
                          <SelectItem value="<">{'<'}</SelectItem>
                          <SelectItem value=">=">{'≥'}</SelectItem>
                          <SelectItem value="<=">{'≤'}</SelectItem>
                          <SelectItem value="=">{'='}</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Input 
                        value={filter.value}
                        onChange={(e) => updateConditionalFilter(filter.id, 'value', e.target.value)}
                        placeholder="Value"
                        className="h-8 w-20"
                      />
                      
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => removeConditionalFilter(filter.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
