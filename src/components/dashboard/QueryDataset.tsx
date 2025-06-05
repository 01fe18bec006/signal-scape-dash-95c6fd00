
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, Play, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QueryDatasetProps {
  signals: string[];
  isVisible: boolean;
}

export const QueryDataset: React.FC<QueryDatasetProps> = ({
  signals,
  isVisible
}) => {
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sampleQueries = [
    "Show unique values in signal1",
    "Filter where signal1 > 100",
    "Calculate mean of selected signals",
    "Find correlations between signals"
  ];

  const executeQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a query to execute",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate query execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock result based on query content
      let mockResult = [];
      if (query.toLowerCase().includes('unique')) {
        mockResult = [
          { value: 'Value 1', count: 25 },
          { value: 'Value 2', count: 18 },
          { value: 'Value 3', count: 12 }
        ];
      } else if (query.toLowerCase().includes('mean')) {
        mockResult = signals.map(signal => ({
          signal,
          mean: (Math.random() * 100).toFixed(2),
          std: (Math.random() * 20).toFixed(2)
        }));
      } else {
        mockResult = [
          { result: 'Query executed successfully' },
          { rows_affected: Math.floor(Math.random() * 1000) }
        ];
      }

      setQueryResult(mockResult);
      toast({
        title: "Query Executed",
        description: `Query completed with ${mockResult.length} results`,
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

  if (!isVisible) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-blue-600" />
          <span>Query Dataset</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-sm text-gray-600">Available signals:</span>
            {signals.slice(0, 5).map(signal => (
              <Badge key={signal} variant="outline" className="text-xs">
                {signal}
              </Badge>
            ))}
            {signals.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{signals.length - 5} more
              </Badge>
            )}
          </div>
          
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query here (e.g., SELECT * FROM signals WHERE signal1 > 100)"
            className="min-h-[100px] font-mono text-sm"
          />
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Quick queries:</span>
            {sampleQueries.map((sample, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setQuery(sample)}
                className="text-xs"
              >
                {sample}
              </Button>
            ))}
          </div>
        </div>

        <Button 
          onClick={executeQuery} 
          disabled={isLoading || !query.trim()}
          className="w-full"
        >
          <Play className="w-4 h-4 mr-2" />
          {isLoading ? 'Executing...' : 'Run Query'}
        </Button>

        {queryResult.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center">
              <Search className="w-4 h-4 mr-2" />
              Query Results
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {Object.keys(queryResult[0] || {}).map(key => (
                      <th key={key} className="text-left p-2 font-medium">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queryResult.map((row, index) => (
                    <tr key={index} className="border-b">
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="p-2">
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
