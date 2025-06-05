import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Move, Maximize2, Edit, GripHorizontal, GripVertical, ZoomIn, ZoomOut } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig } from '../Dashboard';

interface MainCanvasProps {
  charts: ChartConfig[];
  onUpdateChart: (id: string, updates: Partial<ChartConfig>) => void;
  onRemoveChart: (id: string) => void;
  onEditChart: (chart: ChartConfig) => void;
}

// Sample data for demonstration with more realistic signal names
const sampleData = [
  { time: '00:00', signal1: 4000, signal2: 2400, signal3: 2400, temperature: 22.5, pressure: 101.3, BattU: 12.5, SDRFs: 800, I: 450 },
  { time: '04:00', signal1: 3000, signal2: 1398, signal3: 2210, temperature: 21.8, pressure: 101.1, BattU: 12.3, SDRFs: 1250, I: 820 },
  { time: '08:00', signal1: 2000, signal2: 9800, signal3: 2290, temperature: 23.2, pressure: 101.5, BattU: 12.7, SDRFs: 950, I: 650 },
  { time: '12:00', signal1: 2780, signal2: 3908, signal3: 2000, temperature: 25.1, pressure: 101.2, BattU: 12.1, SDRFs: 1100, I: 720 },
  { time: '16:00', signal1: 1890, signal2: 4800, signal3: 2181, temperature: 24.6, pressure: 101.4, BattU: 12.4, SDRFs: 1350, I: 890 },
  { time: '20:00', signal1: 2390, signal2: 3800, signal3: 2500, temperature: 23.8, pressure: 101.6, BattU: 12.6, SDRFs: 1050, I: 680 },
  { time: '24:00', signal1: 3490, signal2: 4300, signal3: 2100, temperature: 22.9, pressure: 101.3, BattU: 12.2, SDRFs: 1200, I: 750 },
];

const getRandomColor = () => {
  const colors = ['#dc2626', '#2563eb', '#16a34a', '#ea580c', '#7c3aed', '#c2410c'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const MainCanvas: React.FC<MainCanvasProps> = ({
  charts,
  onUpdateChart,
  onRemoveChart,
  onEditChart
}) => {
  const [draggedChart, setDraggedChart] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const renderChart = (chart: ChartConfig) => {
    const { type, signals, xAxisName, yAxisName, enableCursor } = chart;
    
    const chartProps = {
      data: sampleData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const baseConfig = {
      strokeDasharray: enableCursor ? "3 3" : "5 5"
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid {...baseConfig} />
            <XAxis dataKey="time" label={{ value: xAxisName, position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: yAxisName, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {signals.map((signal) => (
              <Line 
                key={signal} 
                type="monotone" 
                dataKey={signal} 
                stroke={getRandomColor()}
                strokeWidth={2}
                connectNulls={false}
              />
            ))}
          </LineChart>
        );
      case 'heatmap':
        // For heatmap, we'll create a simple correlation matrix visualization
        return (
          <div className="p-4 text-center">
            <h4 className="text-lg font-medium mb-4">Signal Correlation Heatmap</h4>
            <div className="grid grid-cols-3 gap-1 max-w-xs mx-auto">
              {signals.slice(0, 9).map((signal, index) => (
                <div 
                  key={signal} 
                  className="w-16 h-16 flex items-center justify-center text-xs text-white rounded"
                  style={{ backgroundColor: `hsl(${index * 40}, 70%, 50%)` }}
                >
                  {signal}
                </div>
              ))}
            </div>
          </div>
        );
      case 'anomaly':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" label={{ value: xAxisName, position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: yAxisName, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {signals.map((signal) => (
              <Line 
                key={signal} 
                type="monotone" 
                dataKey={signal} 
                stroke={getRandomColor()}
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 3 }}
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
            {signals.map((signal) => (
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
            {signals.map((signal) => (
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
            {signals.map((signal) => (
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

  const handleMouseDown = (e: React.MouseEvent, chartId: string) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('drag-handle')) {
      const chart = charts.find(c => c.id === chartId);
      if (!chart) return;

      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setDraggedChart(chartId);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedChart || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - dragOffset.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y;

    onUpdateChart(draggedChart, {
      position: { x: Math.max(0, newX), y: Math.max(0, newY) }
    });
  };

  const handleMouseUp = () => {
    setDraggedChart(null);
  };

  if (charts.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-red-100 to-blue-100 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Signal Analysis Canvas</h3>
          <p className="text-gray-600 mb-4">Create your first chart to start analyzing your signals</p>
          <Badge variant="outline" className="text-sm bg-gradient-to-r from-red-50 to-blue-50">
            Use the sidebar to add charts
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={canvasRef}
      className="h-full relative bg-gray-50 rounded-lg border overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute inset-0 p-4">
        {charts.map((chart) => (
          <Card 
            key={chart.id} 
            className="absolute group hover:shadow-xl transition-all duration-200 bg-white border-2 hover:border-red-300 cursor-move"
            style={{ 
              left: chart.position.x,
              top: chart.position.y,
              width: chart.size.width, 
              height: chart.size.height,
              minWidth: '300px',
              minHeight: '200px',
              zIndex: draggedChart === chart.id ? 50 : 10
            }}
            onMouseDown={(e) => handleMouseDown(e, chart.id)}
          >
            <CardHeader className="pb-2 drag-handle cursor-move">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <Move className="w-4 h-4 text-gray-400" />
                  <span>{chart.title}</span>
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-red-100 to-blue-100">
                    {chart.type}
                  </Badge>
                </CardTitle>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 w-6 p-0 text-blue-400 hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditChart(chart);
                    }}
                    title="Edit Chart"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveChart(chart.id);
                    }}
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
                    e.stopPropagation();
                    const startX = e.clientX;
                    const startWidth = chart.size.width;
                    
                    const handleMouseMove = (e: MouseEvent) => {
                      const delta = e.clientX - startX;
                      onUpdateChart(chart.id, { 
                        size: { ...chart.size, width: Math.max(300, startWidth + delta) }
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
                    e.stopPropagation();
                    const startY = e.clientY;
                    const startHeight = chart.size.height;
                    
                    const handleMouseMove = (e: MouseEvent) => {
                      const delta = e.clientY - startY;
                      onUpdateChart(chart.id, { 
                        size: { ...chart.size, height: Math.max(200, startHeight + delta) }
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
