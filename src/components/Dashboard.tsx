
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sidebar } from './dashboard/Sidebar';
import { MainCanvas } from './dashboard/MainCanvas';
import { ChartModal } from './dashboard/ChartModal';
import { ChartEditModal } from './dashboard/ChartEditModal';
import { AIInsights } from './dashboard/AIInsights';
import { FilterPanel } from './dashboard/FilterPanel';
import { useToast } from '@/hooks/use-toast';

export interface ChartConfig {
  id: string;
  type: 'line' | 'bar' | 'scatter' | 'area';
  title: string;
  data: any[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  signals: string[];
  signalFilters: { signal: string; condition: string; value: number }[];
  legendName: string;
  xAxisName: string;
  yAxisName: string;
}

export interface DashboardConfig {
  charts: ChartConfig[];
  filters: {
    dateRange: [string, string];
    timeRange: [number, number];
    selectedFiles: string[];
    signalFilters: any[];
  };
}

const Dashboard = () => {
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingChart, setEditingChart] = useState<ChartConfig | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [signals, setSignals] = useState<string[]>(['signal1', 'signal2', 'signal3', 'temperature', 'pressure']);
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig | null>(null);
  const { toast } = useToast();

  const handleAddChart = useCallback(() => {
    const newChart: ChartConfig = {
      id: `chart-${Date.now()}`,
      type: 'line',
      title: 'New Chart',
      data: [],
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      size: { width: 400, height: 300 },
      signals: [],
      signalFilters: [],
      legendName: 'Legend',
      xAxisName: 'Time',
      yAxisName: 'Value'
    };
    setCharts(prev => [...prev, newChart]);
    toast({
      title: "Chart Added",
      description: "New chart created successfully",
    });
  }, [toast]);

  const handleEditChart = useCallback((chart: ChartConfig) => {
    setEditingChart(chart);
    setIsEditModalOpen(true);
  }, []);

  const handleUpdateChart = useCallback((id: string, updates: Partial<ChartConfig>) => {
    setCharts(prev => prev.map(chart => 
      chart.id === id ? { ...chart, ...updates } : chart
    ));
  }, []);

  const handleRemoveChart = useCallback((id: string) => {
    setCharts(prev => prev.filter(chart => chart.id !== id));
    toast({
      title: "Chart Removed",
      description: "Chart has been deleted from the dashboard",
    });
  }, [toast]);

  const handleSaveConfig = useCallback(() => {
    const config: DashboardConfig = {
      charts,
      filters: {
        dateRange: ['2024-01-01', '2024-12-31'],
        timeRange: [0, 24],
        selectedFiles: selectedFiles.map(f => f.name),
        signalFilters: [],
      },
    };
    setDashboardConfig(config);
    
    // Save to localStorage
    localStorage.setItem('dashboard-config', JSON.stringify(config));
    
    toast({
      title: "Configuration Saved",
      description: "Dashboard layout and settings have been saved",
    });
  }, [charts, selectedFiles, toast]);

  const handleLoadConfig = useCallback(() => {
    const saved = localStorage.getItem('dashboard-config');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        setCharts(config.charts || []);
        setDashboardConfig(config);
        toast({
          title: "Configuration Loaded",
          description: "Dashboard has been restored from saved settings",
        });
      } catch (error) {
        toast({
          title: "Load Failed",
          description: "Could not load configuration",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <div className="flex h-screen">
        <Sidebar
          onAddChart={handleAddChart}
          onSaveConfig={handleSaveConfig}
          onLoadConfig={handleLoadConfig}
          selectedFiles={selectedFiles}
          onFilesChange={setSelectedFiles}
          signals={signals}
        />
        
        <div className="flex-1 flex flex-col">
          <FilterPanel 
            signals={signals}
            selectedFiles={selectedFiles}
          />
          
          <div className="flex-1 p-6">
            <MainCanvas
              charts={charts}
              onUpdateChart={handleUpdateChart}
              onRemoveChart={handleRemoveChart}
              onEditChart={handleEditChart}
            />
          </div>
          
          <AIInsights charts={charts} signals={signals} />
        </div>
      </div>

      <ChartEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        chart={editingChart}
        onUpdateChart={handleUpdateChart}
        signals={signals}
      />
    </div>
  );
};

export default Dashboard;
