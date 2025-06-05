
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Move, Maximize2 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig } from '../Dashboard';

interface MainCanvasProps {
  charts: ChartConfig[];
  onUpdateChart: (id: string, updates: Partial<ChartConfig>) => void;
  onRemoveChart: (id: string) => void;
}

// Sample data for demonstration
const sampleData = [
  { time: '00:00', signal1: 4000, signal2: 2400, signal3: 2400, temperature: 22.5, pressure: 101.3 },
  { time: '04:00', signal1: 3000, signal2: 1398, signal3: 2210, temperature: 21.8, pressure: 101.1 },
  { time: '08:00', signal1: 2000, signal2: 9800, signal3: 2290, temperature: 23.2, pressure: 101.5 },
  { time: '12:00', signal1: 2780, signal2: 3908, signal3: 2000, temperature: 25.1, pressure: 101.2 },
  { time: '16:00', signal1: 1890, signal2: 4800, signal3: 2181, temperature: 24.6, pressure: 101.4 },
  { time: '20:00', signal1: 2390, signal2: 3800, signal3: 2500, temperature: 23.8, pressure: 101.6 },
  { time: '24:00', signal1: 3490, signal2: 4300, signal3: 2100, temperature: 22.9, pressure: 101.3 },
];

const getRandomColor = () => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const MainCanvas: React.FC<MainCanvasProps> = ({
  charts,
  onUpdateChart,
  onRemoveChart
}) => {
  const renderChart = (chart: ChartConfig) => {
    const { type, signals } = chart;
    
    const chartProps = {
      data: sampleData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            {signals.map((signal, index) => (
              <Line 
                key={signal} 
                type="monotone" 
                dataKey={signal} 
                stroke={getRandomColor()}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            {signals.map((signal, index) => (
              <Area 
                key={signal} 
                type="monotone" 
                dataKey={signal} 
                fill={getRandomColor()}
                stroke={getRandomColor()}
              />
            ))}
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            {signals.map((signal, index) => (
              <Bar 
                key={signal} 
                dataKey={signal} 
                fill={getRandomColor()}
              />
            ))}
          </BarChart>
        );
      case 'scatter':
        return (
          <ScatterChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            {signals.map((signal, index) => (
              <Scatter 
                key={signal} 
                dataKey={signal} 
                fill={getRandomColor()}
              />
            ))}
          </ScatterChart>
        );
      default:
        return null;
    }
  };

  if (charts.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <LineChart className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Charts Yet</h3>
          <p className="text-gray-600 mb-4">Create your first chart to start analyzing your signals</p>
          <Badge variant="outline" className="text-sm">
            Use the sidebar to add charts
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative bg-gray-50 rounded-lg border overflow-hidden">
      <div className="absolute inset-0 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {charts.map((chart) => (
            <Card 
              key={chart.id} 
              className="relative group hover:shadow-lg transition-shadow duration-200 bg-white"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center space-x-2">
                    <span>{chart.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {chart.type}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <Move className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                      onClick={() => onRemoveChart(chart.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {chart.signals.map((signal) => (
                    <Badge key={signal} variant="outline" className="text-xs">
                      {signal}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    {renderChart(chart)}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
