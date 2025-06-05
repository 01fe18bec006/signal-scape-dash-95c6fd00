
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Play, Database, Filter, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QueryDatasetProps {
  signals: string[];
  isVisible: boolean;
}

interface QueryCondition {
  id: string;
  signal: string;
  operator: string;
  value: string;
}

export const QueryDataset: React.FC<QueryDatasetProps> = ({
  signals,
  isVisible
}) => {
  const [conditions, setConditions] = useState<QueryCondition[]>([]);
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const operators = [
    { value: '>', label: '>' },
    { value: '<', label: '<' },
    { value: '>=', label: '>=' },
    { value: '<=', label: '<=' },
    { value: '==', label: '=' },
    { value: '!=', label: '≠' }
  ];

  const addCondition = () => {
    const newCondition: QueryCondition = {
      id: Date.now().toString(),
      signal: signals[0] || '',
      operator: '>',
      value: ''
    };
    setConditions(prev => [...prev, newCondition]);
  };

  const removeCondition = (id: string) => {
    setConditions(prev => prev.filter(c => c.id !== id));
  };

  const updateCondition = (id: string, field: keyof QueryCondition, value: string) => {
    setConditions(prev => prev.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const executeQuery = async () => {
    if (conditions.length === 0) {
      toast({
        title: "No Conditions",
        description: "Please add at least one condition to query",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate query execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate query string for display
      const queryString = conditions
        .map(c => `${c.signal} ${c.operator} ${c.value}`)
        .join(' AND ');

      // Mock result
      const mockResult = [
        { time: '2025-01-16 12:40', BattU: 12.5, SDRFs: 1250, I: 820, match: 'Yes' },
        { time: '2025-01-16 13:15', BattU: 12.1, SDRFs: 1350, I: 890, match: 'Yes' },
        { time: '2025-01-16 14:30', BattU: 12.7, SDRFs: 1100, I: 720, match: 'No' }
      ];

      setQueryResult(mockResult);
      toast({
        title: "Query Executed",
        description: `Found ${mockResult.length} results for: ${queryString}`,
      });
    } catch (error) {
      toast({
        title: "Query Failed",
        description: "An error occurred while executing the query",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickQueries = [
    {
      label: "High Battery & Current",
      conditions: [
        { signal: 'BattU', operator: '>', value: '12' },
        { signal: 'I', operator: '>', value: '800' }
      ]
    },
    {
      label: "SDRF Anomalies",
      conditions: [
        { signal: 'SDRFs', operator: '>', value: '1200' }
      ]
    },
    {
      label: "Temperature Range",
      conditions: [
        { signal: 'temperature', operator: '>', value: '20' },
        { signal: 'temperature', operator: '<', value: '25' }
      ]
    }
  ];

  const applyQuickQuery = (quickQuery: typeof quickQueries[0]) => {
    const newConditions = quickQuery.conditions.map((cond, index) => ({
      id: `${Date.now()}-${index}`,
      signal: cond.signal,
      operator: cond.operator,
      value: cond.value
    }));
    setConditions(newConditions);
  };

  if (!isVisible) return null;

  return (
    <Card className="border-blue-200 shadow-lg bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-red-600 text-white">
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Query Dataset</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-sm text-gray-600 font-medium">Quick Queries:</span>
            {quickQueries.map((query, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => applyQuickQuery(query)}
                className="text-xs hover:bg-blue-50"
              >
                {query.label}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Conditions:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={addCondition}
                className="text-xs"
              >
                <Filter className="w-3 h-3 mr-1" />
                Add Condition
              </Button>
            </div>

            {conditions.map((condition, index) => (
              <div key={condition.id} className="flex items-center space-x-2 p-2 border rounded-lg bg-gray-50">
                {index > 0 && (
                  <span className="text-xs text-gray-500 font-medium px-2">AND</span>
                )}
                
                <Select 
                  value={condition.signal} 
                  onValueChange={(value) => updateCondition(condition.id, 'signal', value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {signals.map(signal => (
                      <SelectItem key={signal} value={signal}>{signal}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={condition.operator} 
                  onValueChange={(value) => updateCondition(condition.id, 'operator', value)}
                >
                  <SelectTrigger className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map(op => (
                      <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input 
                  value={condition.value}
                  onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                  placeholder="Value"
                  className="w-20"
                />
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  onClick={() => removeCondition(condition.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={executeQuery} 
          disabled={isLoading || conditions.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Play className="w-4 h-4 mr-2" />
          {isLoading ? 'Executing...' : 'Run Query'}
        </Button>

        {queryResult.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium mb-2 flex items-center text-blue-800">
              <Search className="w-4 h-4 mr-2" />
              Query Results ({queryResult.length} rows)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-200">
                    {Object.keys(queryResult[0] || {}).map(key => (
                      <th key={key} className="text-left p-2 font-medium text-blue-700">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queryResult.map((row, index) => (
                    <tr key={index} className="border-b border-blue-100">
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="p-2 text-gray-700">
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
