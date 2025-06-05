
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, TrendingUp, AlertTriangle, BarChart3, Lightbulb } from 'lucide-react';
import { ChartConfig } from '../Dashboard';

interface AIInsightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  charts: ChartConfig[];
  signals: string[];
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({
  isOpen,
  onClose,
  charts,
  signals
}) => {
  const [insights] = useState([
    {
      type: 'anomaly',
      title: 'Anomaly Detected',
      description: 'Signal1 shows unusual spike at 14:30-15:00',
      confidence: 'High',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      type: 'trend',
      title: 'Trending Pattern',
      description: 'Temperature correlates with pressure (0.87)',
      confidence: 'Medium',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      type: 'suggestion',
      title: 'Chart Suggestion',
      description: 'Consider adding heatmap for signal correlation',
      confidence: 'Low',
      icon: BarChart3,
      color: 'text-green-600'
    }
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-lg font-bold">AI Insights</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="text-sm text-gray-600">
          Analyzing {charts.length} charts with {signals.length} signals
        </div>

        {insights.map((insight, index) => (
          <Card key={index} className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center space-x-2">
                <insight.icon className={`w-4 h-4 ${insight.color}`} />
                <span>{insight.title}</span>
                <Badge variant="outline" className="text-xs">
                  {insight.confidence}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600">{insight.description}</p>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-purple-800 mb-2">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Signals:</span>
                <span className="font-medium ml-1">{signals.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Charts:</span>
                <span className="font-medium ml-1">{charts.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
