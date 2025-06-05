
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronRight, Upload, BarChart3, LineChart, ScatterChart, AreaChart, Save, FolderOpen, Info, Search, Plus } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';

interface SidebarProps {
  onAddChart: () => void;
  onSaveConfig: () => void;
  onLoadConfig: () => void;
  selectedFiles: File[];
  onFilesChange: (files: File[]) => void;
  signals: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  onAddChart,
  onSaveConfig,
  onLoadConfig,
  selectedFiles,
  onFilesChange,
  signals
}) => {
  const [isChartsOpen, setIsChartsOpen] = useState(true);
  const [isConfigOpen, setIsConfigOpen] = useState(true);
  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState(true);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    onFilesChange([...selectedFiles, ...files]);
    toast({
      title: "Files Uploaded",
      description: `${files.length} file(s) added successfully`,
    });
  };

  const chartTypes = [
    { icon: LineChart, name: 'Line Chart', type: 'line' },
    { icon: BarChart3, name: 'Bar Chart', type: 'bar' },
    { icon: ScatterChart, name: 'Scatter Plot', type: 'scatter' },
    { icon: AreaChart, name: 'Area Chart', type: 'area' },
  ];

  return (
    <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Bosch Header */}
      <div className="p-6 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-red-600 font-bold text-sm">B</span>
          </div>
          <div>
            <h1 className="text-lg font-bold">Signal Analysis</h1>
            <p className="text-sm opacity-90">Dashboard</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Chart Types */}
        <Card>
          <Collapsible open={isChartsOpen} onOpenChange={setIsChartsOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 rounded-t-lg">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span>Chart Types</span>
                  </span>
                  {isChartsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-2">
                {chartTypes.map((chart) => (
                  <Button
                    key={chart.type}
                    variant="ghost"
                    className="w-full justify-start hover:bg-blue-50 hover:text-blue-700"
                    onClick={onAddChart}
                  >
                    <chart.icon className="w-4 h-4 mr-2" />
                    {chart.name}
                  </Button>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Saved Config */}
        <Card>
          <Collapsible open={isConfigOpen} onOpenChange={setIsConfigOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 rounded-t-lg">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Save className="w-4 h-4 text-green-600" />
                    <span>Configuration</span>
                  </span>
                  {isConfigOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-xs text-gray-600">Drop config files here</p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="config-upload"
                  />
                  <label htmlFor="config-upload" className="text-xs text-blue-600 cursor-pointer hover:underline">
                    or browse
                  </label>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={onSaveConfig} className="flex-1">
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={onLoadConfig} className="flex-1">
                    <FolderOpen className="w-3 h-3 mr-1" />
                    Load
                  </Button>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Upload className="w-4 h-4 text-purple-600" />
              <span>Data Files</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
              <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-xs text-gray-600">Drop signal files here</p>
              <input
                type="file"
                multiple
                accept=".csv,.json,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="text-xs text-purple-600 cursor-pointer hover:underline">
                or browse
              </label>
            </div>
            {selectedFiles.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700">Uploaded Files:</p>
                {selectedFiles.slice(0, 3).map((file, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {file.name}
                  </Badge>
                ))}
                {selectedFiles.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{selectedFiles.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analyze Data */}
        <Card>
          <Collapsible open={isAnalyzeOpen} onOpenChange={setIsAnalyzeOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 rounded-t-lg">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-orange-600" />
                    <span>Analyze Data</span>
                  </span>
                  {isAnalyzeOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-2">
                <Button variant="ghost" className="w-full justify-start hover:bg-orange-50 hover:text-orange-700">
                  <Info className="w-4 h-4 mr-2" />
                  Signal Info
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-orange-50 hover:text-orange-700">
                  <Search className="w-4 h-4 mr-2" />
                  Query Data
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-orange-50 hover:text-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Signal
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Available Signals */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <LineChart className="w-4 h-4 text-blue-600" />
              <span>Available Signals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {signals.map((signal, index) => (
                <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                  {signal}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
