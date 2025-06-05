
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Move, Maximize2, Edit, GripHorizontal, GripVertical } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig } from '../Dashboard';

interface MainCanvasProps {
  charts: ChartConfig[];
  onUpdateChart: (id: string, updates: Partial<ChartConfig>) => void;
  onRemoveChart: (id: string) => void;
  onEditChart: (chart: ChartConfig) => void;
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
  onRemoveChart,
  onEditChart
}) => {
  const renderChart = (chart: ChartConfig) => {
    const { type, signals, xAxisName, yAxisName } = chart;
    
    const chartProps = {
      data: sampleData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" label={{ value: xAxisName, position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: yAxisName, angle: -90, position: 'insideLeft' }} />
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
            <XAxis dataKey="time" label={{ value: xAxisName, position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: yAxisName, angle: -90, position: 'insideLeft' }} />
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
            <XAxis dataKey="time" label={{ value: xAxisName, position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: yAxisName, angle: -90, position: 'insideLeft' }} />
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
            <XAxis dataKey="time" label={{ value: xAxisName, position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: yAxisName, angle: -90, position: 'insideLeft' }} />
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

  const handleResize = (chartId: string, direction: 'width' | 'height', delta: number) => {
    const chart = charts.find(c => c.id === chartId);
    if (!chart) return;

    const newSize = {
      ...chart.size,
      [direction]: Math.max(200, chart.size[direction] + delta)
    };
    onUpdateChart(chartId, { size: newSize });
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
      <div className="absolute inset-0 p-4 space-y-4">
        {charts.map((chart) => (
          <Card 
            key={chart.id} 
            className="relative group hover:shadow-lg transition-shadow duration-200 bg-white border-2 hover:border-blue-300"
            style={{ 
              width: chart.size.width, 
              height: chart.size.height,
              minWidth: '200px',
              minHeight: '150px'
            }}
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
                    title="Move Chart"
                  >
                    <Move className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 w-6 p-0 text-blue-400 hover:text-blue-600"
                    onClick={() => onEditChart(chart)}
                    title="Edit Chart"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                    onClick={() => onRemoveChart(chart.id)}
                    title="Delete Chart"
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
            <CardContent className="pt-0 pb-2">
              <div style={{ height: chart.size.height - 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart(chart)}
                </ResponsiveContainer>
              </div>
            </CardContent>
            
            {/* Resize Handles */}
            <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 text-gray-400 hover:text-gray-600 cursor-ew-resize"
                  onMouseDown={(e) => {
                    const startX = e.clientX;
                    const startWidth = chart.size.width;
                    
                    const handleMouseMove = (e: MouseEvent) => {
                      const delta = e.clientX - startX;
                      onUpdateChart(chart.id, { 
                        size: { ...chart.size, width: Math.max(200, startWidth + delta) }
                      });
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                  title="Resize Width"
                >
                  <GripVertical className="w-2 h-2" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 text-gray-400 hover:text-gray-600 cursor-ns-resize"
                  onMouseDown={(e) => {
                    const startY = e.clientY;
                    const startHeight = chart.size.height;
                    
                    const handleMouseMove = (e: MouseEvent) => {
                      const delta = e.clientY - startY;
                      onUpdateChart(chart.id, { 
                        size: { ...chart.size, height: Math.max(150, startHeight + delta) }
                      });
                    };
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                  title="Resize Height"
                >
                  <GripHorizontal className="w-2 h-2" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
