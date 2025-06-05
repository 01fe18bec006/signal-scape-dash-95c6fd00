
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Sparkles, Zap } from 'lucide-react';
import { ChartConfig } from '../Dashboard';

interface AIInsightsProps {
  charts: ChartConfig[];
  signals: string[];
}

interface Insight {
  id: string;
  type: 'anomaly' | 'trend' | 'suggestion' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  signal?: string;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ charts, signals }) => {
  const [insights, setInsights] = useState<Insight[]>([
    {
      id: '1',
      type: 'anomaly',
      title: 'Signal Spike Detected',
      description: 'Unusual spike in signal1 at 08:00 - 45% above normal range',
      confidence: 92,
      signal: 'signal1'
    },
    {
      id: '2', 
      type: 'trend',
      title: 'Temperature Correlation',
      description: 'Strong correlation detected between temperature and pressure (r=0.87)',
      confidence: 87,
    },
    {
      id: '3',
      type: 'suggestion',
      title: 'Optimal Chart Recommendation',
      description: 'Consider using scatter plot for temperature vs pressure analysis',
      confidence: 78,
    }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateInsights = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const newInsights: Insight[] = [
        {
          id: Date.now().toString(),
          type: 'prediction',
          title: 'Trend Forecast',
          description: 'Signal2 likely to increase by 15% in next time window based on current pattern',
          confidence: 84,
          signal: 'signal2'
        },
        ...insights
      ];
      setInsights(newInsights);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'anomaly': return AlertTriangle;
      case 'trend': return TrendingUp;
      case 'suggestion': return Lightbulb;
      case 'prediction': return Zap;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'anomaly': return 'text-red-600 bg-red-50 border-red-200';
      case 'trend': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'suggestion': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'prediction': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">AI Insights</h2>
              <p className="text-sm text-gray-600">Powered by signal analysis</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {insights.length} insights
          </Badge>
        </div>
        
        <Button 
          onClick={generateInsights}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Generate Insights
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {insights.map((insight) => {
          const Icon = getInsightIcon(insight.type);
          const colorClass = getInsightColor(insight.type);
          
          return (
            <Card key={insight.id} className={`border transition-all duration-200 hover:shadow-md ${colorClass}`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 rounded-lg bg-white/50">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm">{insight.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {insight.confidence}%
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-700 mb-2">{insight.description}</p>
                    {insight.signal && (
                      <Badge variant="outline" className="text-xs">
                        {insight.signal}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
