
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sidebar } from './dashboard/Sidebar';
import { MainCanvas } from './dashboard/MainCanvas';
import { ChartModal } from './dashboard/ChartModal';
import { ChartEditModal } from './dashboard/ChartEditModal';
import { FilterPanel } from './dashboard/FilterPanel';
import { QueryDataset } from './dashboard/QueryDataset';
import { SignalCreation } from './dashboard/SignalCreation';
import { AIInsightPanel } from './dashboard/AIInsightPanel';
import { useToast } from '@/hooks/use-toast';

export interface ChartConfig {
  id: string;
  type: 'line' | 'bar' | 'scatter' | 'area' | 'heatmap' | 'anomaly';
  title: string;
  data: any[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  signals: string[];
  signalFilters: { signal: string; condition: string; value: number }[];
  legendName: string;
  xAxisName: string;
  yAxisName: string;
  enableCursor?: boolean;
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
  const [signals, setSignals] = useState<string[]>(['signal1', 'signal2', 'signal3', 'temperature', 'pressure', 'BattU', 'SDRFs', 'I']);
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig | null>(null);
  const [showQuery, setShowQuery] = useState(false);
  const [showSignalCreation, setShowSignalCreation] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const { toast } = useToast();

  const handleAddChart = useCallback(() => {
    setIsChartModalOpen(true);
  }, []);

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

  const handleToggleQuery = useCallback(() => {
    setShowQuery(prev => !prev);
    setShowSignalCreation(false);
    setShowAI(false);
  }, []);

  const handleToggleSignalCreation = useCallback(() => {
    setShowSignalCreation(prev => !prev);
    setShowQuery(false);
    setShowAI(false);
  }, []);

  const handleToggleAI = useCallback(() => {
    setShowAI(prev => !prev);
    setShowQuery(false);
    setShowSignalCreation(false);
  }, []);

  const handleSignalCreated = useCallback((newSignalName: string) => {
    setSignals(prev => [...prev, newSignalName]);
    toast({
      title: "Signal Added",
      description: `New signal "${newSignalName}" is now available for charting`,
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
    
    // Create and download file
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-config-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Configuration Saved",
      description: "Dashboard layout and settings have been saved and downloaded",
    });
  }, [charts, selectedFiles, toast]);

  const handleLoadConfig = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const config = JSON.parse(e.target?.result as string);
            setCharts(config.charts || []);
            setDashboardConfig(config);
            toast({
              title: "Configuration Loaded",
              description: "Dashboard has been restored from saved settings",
            });
          } catch (error) {
            toast({
              title: "Load Failed",
              description: "Could not load configuration file",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <div className="flex h-screen relative">
        <Sidebar
          onAddChart={handleAddChart}
          onSaveConfig={handleSaveConfig}
          onLoadConfig={handleLoadConfig}
          selectedFiles={selectedFiles}
          onFilesChange={setSelectedFiles}
          signals={signals}
          onToggleQuery={handleToggleQuery}
          onToggleSignalCreation={handleToggleSignalCreation}
          onToggleAI={handleToggleAI}
        />
        
        <div className="flex-1 flex flex-col">
          <FilterPanel 
            signals={signals}
            selectedFiles={selectedFiles}
          />
          
          <div className="flex-1 p-6 overflow-hidden relative">
            <MainCanvas
              charts={charts}
              onUpdateChart={handleUpdateChart}
              onRemoveChart={handleRemoveChart}
              onEditChart={handleEditChart}
            />

            {showQuery && (
              <div className="absolute bottom-4 left-4 right-4 z-40">
                <QueryDataset 
                  signals={signals}
                  isVisible={showQuery}
                />
              </div>
            )}

            {showSignalCreation && (
              <div className="absolute bottom-4 left-4 right-4 z-40">
                <SignalCreation 
                  signals={signals}
                  isVisible={showSignalCreation}
                  onSignalCreated={handleSignalCreated}
                />
              </div>
            )}
          </div>
        </div>

        <AIInsightPanel
          isOpen={showAI}
          onClose={() => setShowAI(false)}
          charts={charts}
          signals={signals}
        />
      </div>

      <ChartModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        onAddChart={(chart) => {
          const newChart: ChartConfig = {
            ...chart,
            id: `chart-${Date.now()}`,
            position: { x: Math.random() * 200, y: Math.random() * 200 }
          };
          setCharts(prev => [...prev, newChart]);
          setIsChartModalOpen(false);
          toast({
            title: "Chart Added",
            description: "New chart created successfully",
          });
        }}
        signals={signals}
      />

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
