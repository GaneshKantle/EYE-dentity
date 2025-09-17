import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Maximize2, Minimize2, Layers, Settings, ClipboardList, 
  Eye, EyeOff, Lock, Unlock, Palette, Archive, Hash, 
  MousePointer2, Grid3X3, Target, Crop, Search
} from 'lucide-react';

interface FeatureAsset {
  id: string;
  name: string;
  category: string;
  path: string;
  tags: string[];
  description?: string;
}

interface PlacedFeature {
  id: string;
  asset: FeatureAsset;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  selected: boolean;
  locked: boolean;
  visible: boolean;
  flipH: boolean;
  flipV: boolean;
  brightness: number;
  contrast: number;
  scale: number;
}

interface CaseInfo {
  caseNumber: string;
  date: string;
  officer: string;
  description: string;
  witness: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'in-progress' | 'review' | 'completed';
}

interface CanvasSettings {
  backgroundColor: string;
  showRulers: boolean;
  showSafeArea: boolean;
  quality: 'standard' | 'high';
}

interface RightPanelProps {
  rightSidebarCollapsed: boolean;
  setRightSidebarCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  features: PlacedFeature[];
  selectedFeatures: string[];
  selectedFeature: PlacedFeature | null;
  featureCategories: Record<string, {
    name: string;
    icon: LucideIcon;
    color: string;
    assets: FeatureAsset[];
  }>;
  selectedCategory: string;
  caseInfo: CaseInfo;
  setCaseInfo: (info: CaseInfo | ((prev: CaseInfo) => CaseInfo)) => void;
  canvasSettings: CanvasSettings;
  setCanvasSettings: (settings: CanvasSettings | ((prev: CanvasSettings) => CanvasSettings)) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  addFeature: (asset: FeatureAsset) => void;
  toggleVisibility: (featureId: string) => void;
  toggleLock: (featureId: string) => void;
  updateSelectedFeatures: (updates: Partial<PlacedFeature>) => void;
  scaleSelectedFeatures: (scale: number) => void;
  scaleUp: () => void;
  scaleDown: () => void;
  resizeSelectedFeatures: (newWidth: number, newHeight: number) => void;
  bringToFront: () => void;
  sendToBack: () => void;
  duplicateFeature: () => void;
  deleteSelectedFeatures: () => void;
  exportPNG: () => void;
  saveProject: () => void;
  exportMetadata: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  rightSidebarCollapsed,
  setRightSidebarCollapsed,
  activeTab,
  setActiveTab,
  features,
  selectedFeatures,
  selectedFeature,
  featureCategories,
  selectedCategory,
  caseInfo,
  setCaseInfo,
  canvasSettings,
  setCanvasSettings,
  showGrid,
  setShowGrid,
  gridSize,
  setGridSize,
  snapToGrid,
  setSnapToGrid,
  addFeature,
  toggleVisibility,
  toggleLock,
  updateSelectedFeatures,
  scaleSelectedFeatures,
  scaleUp,
  scaleDown,
  resizeSelectedFeatures,
  bringToFront,
  sendToBack,
  duplicateFeature,
  deleteSelectedFeatures,
  exportPNG,
  saveProject,
  exportMetadata
}) => {
  // Filter assets based on selected category
  const filteredAssets = featureCategories[selectedCategory]?.assets || [];
  return (
    <div className={`${rightSidebarCollapsed ? 'w-12 xs:w-14 sm:w-16 lg:w-20 xl:w-24' : 'w-full sm:w-72 md:w-80 lg:w-80 xl:w-96'} bg-white/90 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-amber-200 flex flex-col shadow-sm order-3 transition-all duration-300 ease-in-out ${rightSidebarCollapsed ? 'bg-gradient-to-b from-white/95 to-slate-50/90' : ''}`}>
      {/* Panel Header with Toggle */}
      <div className={`${rightSidebarCollapsed ? 'p-1 xs:p-1.5 sm:p-1.5 justify-center' : 'p-1.5 xs:p-2 sm:p-2 md:p-3 lg:p-4 justify-between'} border-b border-amber-200 flex items-center transition-all duration-200`}>
        <h3 className={`font-semibold text-slate-800 text-xs xs:text-sm sm:text-sm transition-opacity duration-200 ${rightSidebarCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
          {activeTab === 'workspace' && 'Asset Library'}
          {activeTab === 'layers' && 'Layer Management'}
          {activeTab === 'properties' && 'Properties Panel'}
          {activeTab === 'case' && 'Case Information'}
        </h3>
        <Button 
          onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)} 
          variant="outline" 
          size="sm"
          className={`text-slate-600 border-slate-300 flex-shrink-0 transition-all duration-200 ${
            rightSidebarCollapsed ? 'h-6 w-6 xs:h-7 xs:w-7 sm:h-7 sm:w-7 p-0' : 'h-6 w-6 xs:h-7 xs:w-7 sm:h-7 sm:w-7 p-0'
          }`}
          title={rightSidebarCollapsed ? "Expand Panel" : "Collapse Panel"}
        >
          {rightSidebarCollapsed ? <Maximize2 className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" /> : <Minimize2 className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" />}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className={`grid bg-slate-100 m-1 xs:m-1.5 sm:m-1.5 transition-all duration-200 ${
          rightSidebarCollapsed 
            ? 'grid-cols-1 gap-1 xs:gap-1.5 sm:gap-1.5 p-1 xs:p-1.5 sm:p-1.5' 
            : 'grid-cols-2 sm:grid-cols-4 gap-0.5 xs:gap-1 sm:gap-0.5'
        }`}>
          <TabsTrigger 
            value="workspace" 
            className={`text-[9px] xs:text-[10px] sm:text-[10px] transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm ${
              rightSidebarCollapsed ? 'h-8 xs:h-9 sm:h-10 w-full p-1 xs:p-1.5 sm:p-1.5 flex-col justify-center' : 'h-6 xs:h-7 sm:h-7'
            }`}
            title="Assets"
          >
            {rightSidebarCollapsed ? (
              <div className="flex flex-col items-center space-y-0.5">
                <Layers className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5 text-blue-600" />
                <span className="text-[8px] xs:text-[9px] sm:text-[9px] font-medium text-slate-700">Assets</span>
              </div>
            ) : (
              'Assets'
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="layers" 
            className={`text-[9px] xs:text-[10px] sm:text-[10px] transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm ${
              rightSidebarCollapsed ? 'h-8 xs:h-9 sm:h-10 w-full p-1 xs:p-1.5 sm:p-1.5 flex-col justify-center' : 'h-6 xs:h-7 sm:h-7'
            }`}
            title="Layers"
          >
            {rightSidebarCollapsed ? (
              <div className="flex flex-col items-center space-y-0.5">
                <Layers className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5 text-green-600" />
                <span className="text-[8px] xs:text-[9px] sm:text-[9px] font-medium text-slate-700">Layers</span>
              </div>
            ) : (
              'Layers'
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="properties" 
            className={`text-[9px] xs:text-[10px] sm:text-[10px] transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm ${
              rightSidebarCollapsed ? 'h-8 xs:h-9 sm:h-10 w-full p-1 xs:p-1.5 sm:p-1.5 flex-col justify-center' : 'h-6 xs:h-7 sm:h-7'
            }`}
            title="Properties"
          >
            {rightSidebarCollapsed ? (
              <div className="flex flex-col items-center space-y-0.5">
                <Settings className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5 text-purple-600" />
                <span className="text-[8px] xs:text-[9px] sm:text-[9px] font-medium text-slate-700">Props</span>
              </div>
            ) : (
              'Props'
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="case" 
            className={`text-[9px] xs:text-[10px] sm:text-[10px] transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm ${
              rightSidebarCollapsed ? 'h-8 xs:h-9 sm:h-10 w-full p-1 xs:p-1.5 sm:p-1.5 flex-col justify-center' : 'h-6 xs:h-7 sm:h-7'
            }`}
            title="Case"
          >
            {rightSidebarCollapsed ? (
              <div className="flex flex-col items-center space-y-0.5">
                <ClipboardList className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5 text-orange-600" />
                <span className="text-[8px] xs:text-[9px] sm:text-[9px] font-medium text-slate-700">Case</span>
              </div>
            ) : (
              'Case'
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className={`flex-1 p-1 xs:p-1.5 sm:p-1.5 md:p-2 lg:p-3 xl:p-4 m-0 transition-all duration-200 ${rightSidebarCollapsed ? 'hidden' : ''}`}>
          <ScrollArea className="h-full">
            {/* Asset Grid Container with Fixed Height */}
            <div className="space-y-1.5 xs:space-y-2 sm:space-y-2">
              {/* Asset Grid */}
              <div className="grid gap-1 xs:gap-1.5 sm:gap-1.5 grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                {filteredAssets.map((asset) => (
                  <Card 
                    key={asset.id} 
                    className="cursor-grab active:cursor-grabbing hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-amber-300 group bg-white shadow-sm"
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify(asset));
                      e.dataTransfer.effectAllowed = 'copy';
                      // Add visual feedback
                      e.currentTarget.style.opacity = '0.5';
                      e.currentTarget.style.transform = 'scale(0.95)';
                    }}
                    onDragEnd={(e) => {
                      // Reset visual feedback
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <CardContent 
                      className="p-1 xs:p-1.5 sm:p-1.5 transition-all duration-200" 
                      onClick={() => addFeature(asset)}
                    >
                      {/* Compact Asset Thumbnail */}
                      <div className="aspect-square bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-lg p-0.5 xs:p-1 sm:p-1 mb-1 xs:mb-1.5 sm:mb-1.5 flex items-center justify-center shadow-inner group-hover:shadow-md transition-all duration-200">
                        <img
                          src={asset.path}
                          alt={asset.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                          draggable={false}
                          onError={(e) => {
                            console.error(`Failed to load asset image: ${asset.path}`);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      
                      {/* Asset Name */}
                      <h4 className="font-medium text-slate-900 text-center group-hover:text-amber-600 transition-colors text-[9px] xs:text-[10px] sm:text-[10px] leading-tight mb-0.5 xs:mb-1 sm:mb-1">
                        {asset.name}
                      </h4>
                      
                      {/* Asset Tags - Compact Display */}
                      <div className="flex flex-wrap gap-0.5 justify-center">
                        {asset.tags.slice(0, 1).map(tag => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-[8px] xs:text-[9px] sm:text-[9px] px-0.5 xs:px-1 sm:px-1 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 font-medium"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Drag Indicator */}
                      <div className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-1 xs:w-1.5 xs:h-1.5 sm:w-1.5 sm:h-1.5 bg-amber-400 rounded-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Empty State */}
              {filteredAssets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 xs:py-8 sm:py-8 text-slate-500">
                  <Search className="w-6 h-6 xs:w-8 xs:h-8 sm:w-8 sm:h-8 mb-1.5 xs:mb-2 sm:mb-2 opacity-50" />
                  <p className="text-[10px] xs:text-xs sm:text-xs font-medium">No assets found</p>
                  <p className="text-[9px] xs:text-[10px] sm:text-[10px] text-slate-400 mt-0.5">Try adjusting your search terms</p>
                </div>
              )}

              {/* Asset Count */}
              <div className="text-center pt-1 xs:pt-1.5 sm:pt-1.5 border-t border-slate-100">
                <span className="text-[9px] xs:text-[10px] sm:text-[10px] text-slate-500 font-medium">
                  {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''} available
                </span>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="layers" className={`flex-1 p-1 xs:p-1.5 sm:p-1.5 md:p-2 lg:p-3 xl:p-4 m-0 transition-all duration-200 ${rightSidebarCollapsed ? 'hidden' : ''}`}>
          <ScrollArea className="h-full">
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-1.5">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={`flex items-center rounded-lg border transition-all duration-200 ${
                    selectedFeatures.includes(feature.id)
                      ? 'bg-blue-50 border-blue-200 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-300 shadow-lg'
                  } ${
                    rightSidebarCollapsed ? 'p-1 xs:p-1.5 sm:p-1.5 lg:p-2' : 'p-1 xs:p-1.5 sm:p-1.5 md:p-2'
                  }`}
                >
                  <div className={`bg-white border border-slate-200 rounded-lg p-0.5 flex items-center justify-center shadow-inner flex-shrink-0 ${
                    rightSidebarCollapsed ? 'w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6' : 'w-5 h-5 xs:w-6 xs:h-6 sm:w-6 sm:h-6 md:w-7 md:h-7'
                  }`}>
                    <img
                      src={feature.asset.path}
                      alt={feature.asset.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {!rightSidebarCollapsed && (
                    <>
                      <div className="flex-1 min-w-0 ml-1 xs:ml-1.5 sm:ml-1.5 md:ml-2">
                        <p className={`font-medium text-slate-900 truncate ${
                          rightSidebarCollapsed ? 'text-[9px] xs:text-[10px] sm:text-[10px] lg:text-xs' : 'text-[9px] xs:text-[10px] sm:text-[10px] md:text-xs'
                        }`}>{feature.asset.name}</p>
                        <p className="text-[9px] xs:text-[10px] sm:text-[10px] text-slate-700 hidden xs:block">{feature.asset.category}</p>
                      </div>
                      <div className="flex items-center space-x-0.5">
                        <Button
                          onClick={() => toggleVisibility(feature.id)}
                          variant="ghost"
                          size="sm"
                          className={`hover:bg-slate-200 p-0 ${
                            rightSidebarCollapsed ? 'h-3 w-3 xs:h-4 xs:w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5' : 'h-4 w-4 xs:h-5 xs:w-5 sm:h-5 sm:w-5 md:h-6 md:w-6'
                          }`}
                          title={feature.visible ? "Hide" : "Show"}
                        >
                          {feature.visible ? 
                            <Eye className={`${rightSidebarCollapsed ? 'w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5' : 'w-2 xs:w-2.5 sm:w-2.5 md:w-3 h-2 xs:h-2.5 sm:h-2.5 md:h-3'}`} /> : 
                            <EyeOff className={`${rightSidebarCollapsed ? 'w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5' : 'w-2 xs:w-2.5 sm:w-2.5 md:w-3 h-2 xs:h-2.5 sm:h-2.5 md:h-3'}`} />
                          }
                        </Button>
                        <Button
                          onClick={() => toggleLock(feature.id)}
                          variant="ghost"
                          size="sm"
                          className={`hover:bg-slate-200 p-0 ${
                            rightSidebarCollapsed ? 'h-3 w-3 xs:h-4 xs:w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5' : 'h-4 w-4 xs:h-5 xs:w-5 sm:h-5 sm:w-5 md:h-6 md:w-6'
                          }`}
                          title={feature.locked ? "Unlock" : "Lock"}
                        >
                          {feature.locked ? 
                            <Lock className={`${rightSidebarCollapsed ? 'w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5' : 'w-2 xs:w-2.5 sm:w-2.5 md:w-3 h-2 xs:h-2.5 sm:h-2.5 md:h-3'}`} /> : 
                            <Unlock className={`${rightSidebarCollapsed ? 'w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5' : 'w-2 xs:w-2.5 sm:w-2.5 md:w-3 h-2 xs:h-2.5 sm:h-2.5 md:h-3'}`} />
                          }
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="properties" className={`flex-1 p-1 xs:p-1.5 sm:p-1.5 md:p-2 lg:p-3 xl:p-4 m-0 transition-all duration-200 ${rightSidebarCollapsed ? 'hidden' : ''}`}>
          <ScrollArea className="h-full">
            {selectedFeature ? (
              <div className={`space-y-2 xs:space-y-3 sm:space-y-3 md:space-y-4 transition-all duration-200 ${
                rightSidebarCollapsed ? 'space-y-1.5 xs:space-y-2 sm:space-y-2 lg:space-y-3' : 'space-y-2 xs:space-y-3 sm:space-y-3 md:space-y-4'
              }`}>
                <Card className="border-slate-300 bg-white shadow-lg">
                  <CardHeader className={`pb-1.5 xs:pb-2 sm:pb-2 transition-all duration-200 ${
                    rightSidebarCollapsed ? 'pb-1 xs:pb-1.5 sm:pb-1.5 lg:pb-2' : 'pb-1.5 xs:pb-2 sm:pb-2'
                  }`}>
                    <CardTitle className={`flex items-center space-x-1 xs:space-x-1.5 sm:space-x-1.5 transition-all duration-200 ${
                      rightSidebarCollapsed ? 'text-[9px] xs:text-[10px] sm:text-[10px] lg:text-xs' : 'text-[10px] xs:text-xs sm:text-xs'
                    } text-slate-900`}>
                      <Settings className={`${rightSidebarCollapsed ? 'w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3' : 'w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3 sm:h-3'}`} />
                      <span className={rightSidebarCollapsed ? 'hidden lg:inline' : ''}>
                        {rightSidebarCollapsed ? 'Props' : 'Transform'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={`space-y-2 xs:space-y-3 sm:space-y-3 transition-all duration-200 ${
                    rightSidebarCollapsed ? 'space-y-1.5 xs:space-y-2 sm:space-y-2 lg:space-y-3' : 'space-y-2 xs:space-y-3 sm:space-y-3'
                  }`}>
                    {/* Resize Sliders */}
                    <div>
                      <Label className={`text-slate-700 font-medium transition-all duration-200 ${
                        rightSidebarCollapsed ? 'text-[9px] xs:text-xs sm:text-xs lg:text-xs' : 'text-[10px] xs:text-xs sm:text-xs'
                      }`}>
                        {rightSidebarCollapsed ? 'Width' : 'Width'}: {selectedFeature.width}px
                      </Label>
                      <Slider
                        value={[selectedFeature.width]}
                        onValueChange={([value]) => resizeSelectedFeatures(value, selectedFeature.height)}
                        min={20}
                        max={800}
                        step={5}
                        className="mt-1.5 xs:mt-2 sm:mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label className={`text-slate-700 font-medium transition-all duration-200 ${
                        rightSidebarCollapsed ? 'text-[9px] xs:text-xs sm:text-xs lg:text-xs' : 'text-[10px] xs:text-xs sm:text-xs'
                      }`}>
                        {rightSidebarCollapsed ? 'Height' : 'Height'}: {selectedFeature.height}px
                      </Label>
                      <Slider
                        value={[selectedFeature.height]}
                        onValueChange={([value]) => resizeSelectedFeatures(selectedFeature.width, value)}
                        min={20}
                        max={800}
                        step={5}
                        className="mt-1.5 xs:mt-2 sm:mt-2"
                      />
                    </div>

                    {!rightSidebarCollapsed && (
                      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-3">
                        <div>
                          <Label className="text-[10px] xs:text-xs sm:text-xs text-slate-700 font-medium">Width</Label>
                          <Input
                            type="number"
                            value={selectedFeature.width}
                            onChange={(e) => updateSelectedFeatures({ width: Number(e.target.value) })}
                            className="h-6 xs:h-7 sm:h-7 text-[10px] xs:text-xs sm:text-xs border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] xs:text-xs sm:text-xs text-slate-700 font-medium">Height</Label>
                          <Input
                            type="number"
                            value={selectedFeature.height}
                            onChange={(e) => updateSelectedFeatures({ height: Number(e.target.value) })}
                            className="h-6 xs:h-7 sm:h-7 text-[10px] xs:text-xs sm:text-xs border-slate-300 bg-white"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <Label className={`text-slate-700 font-medium transition-all duration-200 ${
                        rightSidebarCollapsed ? 'text-[9px] xs:text-xs sm:text-xs lg:text-xs' : 'text-[10px] xs:text-xs sm:text-xs'
                      }`}>
                        {rightSidebarCollapsed ? 'Rot' : 'Rotation'}: {selectedFeature.rotation}°
                      </Label>
                      <Slider
                        value={[selectedFeature.rotation]}
                        onValueChange={([value]) => updateSelectedFeatures({ rotation: value })}
                        min={-180}
                        max={180}
                        step={1}
                        className="mt-1.5 xs:mt-2 sm:mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label className={`text-slate-700 font-medium transition-all duration-200 ${
                        rightSidebarCollapsed ? 'text-[9px] xs:text-xs sm:text-xs lg:text-xs' : 'text-[10px] xs:text-xs sm:text-xs'
                      }`}>
                        {rightSidebarCollapsed ? 'Opac' : 'Opacity'}: {Math.round(selectedFeature.opacity * 100)}%
                      </Label>
                      <Slider
                        value={[selectedFeature.opacity * 100]}
                        onValueChange={([value]) => updateSelectedFeatures({ opacity: value / 100 })}
                        min={0}
                        max={100}
                        step={1}
                        className="mt-1.5 xs:mt-2 sm:mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-300 bg-white shadow-lg">
                  <CardHeader className={`pb-2 xs:pb-3 sm:pb-3 transition-all duration-200 ${
                    rightSidebarCollapsed ? 'pb-1.5 xs:pb-2 sm:pb-2 lg:pb-3' : 'pb-2 xs:pb-3 sm:pb-3'
                  }`}>
                    <CardTitle className={`flex items-center space-x-1.5 xs:space-x-2 sm:space-x-2 transition-all duration-200 ${
                      rightSidebarCollapsed ? 'text-[10px] xs:text-xs sm:text-xs lg:text-sm' : 'text-xs xs:text-sm sm:text-sm'
                    } text-slate-900`}>
                      <Palette className={`${rightSidebarCollapsed ? 'w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4' : 'w-3 h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4'}`} />
                      <span className={rightSidebarCollapsed ? 'hidden lg:inline' : ''}>
                        {rightSidebarCollapsed ? 'App' : 'Appearance'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={`space-y-3 xs:space-y-4 sm:space-y-4 transition-all duration-200 ${
                    rightSidebarCollapsed ? 'space-y-2 xs:space-y-3 sm:space-y-3 lg:space-y-4' : 'space-y-3 xs:space-y-4 sm:space-y-4'
                  }`}>
                    <div>
                      <Label className={`text-slate-700 font-medium transition-all duration-200 ${
                        rightSidebarCollapsed ? 'text-[9px] xs:text-xs sm:text-xs lg:text-xs' : 'text-[10px] xs:text-xs sm:text-xs'
                      }`}>
                        {rightSidebarCollapsed ? 'Bright' : 'Brightness'}: {selectedFeature.brightness}%
                      </Label>
                      <Slider
                        value={[selectedFeature.brightness]}
                        onValueChange={([value]) => updateSelectedFeatures({ brightness: value })}
                        min={0}
                        max={200}
                        step={1}
                        className="mt-1.5 xs:mt-2 sm:mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label className={`text-slate-700 font-medium transition-all duration-200 ${
                        rightSidebarCollapsed ? 'text-[9px] xs:text-xs sm:text-xs lg:text-xs' : 'text-[10px] xs:text-xs sm:text-xs'
                      }`}>
                        {rightSidebarCollapsed ? 'Cont' : 'Contrast'}: {selectedFeature.contrast}%
                      </Label>
                      <Slider
                        value={[selectedFeature.contrast]}
                        onValueChange={([value]) => updateSelectedFeatures({ contrast: value })}
                        min={0}
                        max={200}
                        step={1}
                        className="mt-1.5 xs:mt-2 sm:mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Scaling Controls */}
                <Card className="border-slate-300 bg-white shadow-lg">
                  <CardHeader className={`pb-2 xs:pb-3 sm:pb-3 transition-all duration-200 ${
                    rightSidebarCollapsed ? 'pb-1.5 xs:pb-2 sm:pb-2 lg:pb-3' : 'pb-2 xs:pb-3 sm:pb-3'
                  }`}>
                    <CardTitle className={`flex items-center space-x-1.5 xs:space-x-2 sm:space-x-2 transition-all duration-200 ${
                      rightSidebarCollapsed ? 'text-[10px] xs:text-xs sm:text-xs lg:text-sm' : 'text-xs xs:text-sm sm:text-sm'
                    } text-slate-900`}>
                      <Settings className={`${rightSidebarCollapsed ? 'w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4' : 'w-3 h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4'}`} />
                      <span className={rightSidebarCollapsed ? 'hidden lg:inline' : ''}>
                        {rightSidebarCollapsed ? 'Scale' : 'Scaling'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={`space-y-3 xs:space-y-4 sm:space-y-4 transition-all duration-200 ${
                    rightSidebarCollapsed ? 'space-y-2 xs:space-y-3 sm:space-y-3 lg:space-y-4' : 'space-y-3 xs:space-y-4 sm:space-y-4'
                  }`}>
                    <div>
                      <Label className={`text-slate-700 font-medium transition-all duration-200 ${
                        rightSidebarCollapsed ? 'text-[9px] xs:text-xs sm:text-xs lg:text-xs' : 'text-[10px] xs:text-xs sm:text-xs'
                      }`}>
                        {rightSidebarCollapsed ? 'Scale' : 'Scale'}: {Math.round(selectedFeature.scale * 100)}%
                      </Label>
                      <Slider
                        value={[selectedFeature.scale]}
                        onValueChange={([value]) => scaleSelectedFeatures(value)}
                        min={0.5}
                        max={2.0}
                        step={0.05}
                        className="mt-1.5 xs:mt-2 sm:mt-2"
                      />
                    </div>
                    
                    {/* Scale Buttons */}
                    <div className="flex items-center justify-between space-x-1.5 xs:space-x-2 sm:space-x-2">
                      <Button
                        onClick={scaleDown}
                        variant="outline"
                        size="sm"
                        className="flex-1 h-6 xs:h-7 sm:h-7 text-[10px] xs:text-xs sm:text-xs border-amber-300 text-amber-700 hover:bg-amber-50"
                        title="Scale Down (-)"
                      >
                        <span className="hidden xs:inline">-</span>
                        <span className="xs:hidden">-</span>
                      </Button>
                      <Button
                        onClick={scaleUp}
                        variant="outline"
                        size="sm"
                        className="flex-1 h-6 xs:h-7 sm:h-7 text-[10px] xs:text-xs sm:text-xs border-amber-300 text-amber-700 hover:bg-amber-50"
                        title="Scale Up (+)"
                      >
                        <span className="hidden xs:inline">+</span>
                        <span className="xs:hidden">+</span>
                      </Button>
                    </div>
                    
                    {/* Scale Presets */}
                    <div className="grid grid-cols-3 gap-1.5 xs:gap-2 sm:gap-2">
                      <Button
                        onClick={() => scaleSelectedFeatures(0.5)}
                        variant="outline"
                        size="sm"
                        className="h-6 xs:h-7 sm:h-7 text-[9px] xs:text-xs sm:text-xs border-slate-300 text-slate-600 hover:bg-slate-50"
                        title="50% Scale"
                      >
                        50%
                      </Button>
                      <Button
                        onClick={() => scaleSelectedFeatures(1.0)}
                        variant="outline"
                        size="sm"
                        className="h-6 xs:h-7 sm:h-7 text-[9px] xs:text-xs sm:text-xs border-slate-300 text-slate-600 hover:bg-slate-50"
                        title="100% Scale (Default)"
                      >
                        100%
                      </Button>
                      <Button
                        onClick={() => scaleSelectedFeatures(1.5)}
                        variant="outline"
                        size="sm"
                        className="h-6 xs:h-7 sm:h-7 text-[9px] xs:text-xs sm:text-xs border-slate-300 text-slate-600 hover:bg-slate-50"
                        title="150% Scale"
                      >
                        150%
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 xs:h-56 sm:h-56 md:h-64 text-slate-600 bg-white border border-slate-300 rounded-lg shadow-lg">
                <MousePointer2 className={`opacity-50 transition-all duration-200 ${
                  rightSidebarCollapsed ? 'w-6 h-6 xs:w-8 xs:h-8 sm:w-8 sm:h-8 lg:w-12 lg:h-12' : 'w-8 h-8 xs:w-10 xs:h-10 sm:w-10 sm:h-10 md:w-12 md:h-12'
                } mb-3 xs:mb-4 sm:mb-4`} />
                <p className={`text-center transition-all duration-200 ${
                  rightSidebarCollapsed ? 'text-[10px] xs:text-xs sm:text-xs lg:text-sm' : 'text-xs xs:text-sm sm:text-sm'
                } text-slate-700`}>
                  {rightSidebarCollapsed ? 'Select feature' : 'Select a feature to view properties'}
                </p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="case" className={`flex-1 p-1 xs:p-1.5 sm:p-1.5 md:p-2 lg:p-3 xl:p-4 m-0 transition-all duration-200 ${rightSidebarCollapsed ? 'hidden' : ''}`}>
          <ScrollArea className="h-full">
            <div className={`space-y-2 xs:space-y-3 sm:space-y-3 md:space-y-4 transition-all duration-200 ${
              rightSidebarCollapsed ? 'space-y-1.5 xs:space-y-2 sm:space-y-2 lg:space-y-3' : 'space-y-2 xs:space-y-3 sm:space-y-3 md:space-y-4'
            }`}>
              <Card className="border-slate-300 bg-white shadow-lg">
                <CardHeader className={`pb-2 xs:pb-3 sm:pb-3 transition-all duration-200 ${
                  rightSidebarCollapsed ? 'pb-1.5 xs:pb-2 sm:pb-2 lg:pb-3' : 'pb-2 xs:pb-3 sm:pb-3'
                }`}>
                  <CardTitle className={`flex items-center space-x-1.5 xs:space-x-2 sm:space-x-2 transition-all duration-200 ${
                    rightSidebarCollapsed ? 'text-[10px] xs:text-xs sm:text-xs lg:text-sm' : 'text-xs xs:text-sm sm:text-sm'
                  } text-slate-900`}>
                    <ClipboardList className={`${rightSidebarCollapsed ? 'w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4' : 'w-3 h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4'}`} />
                    <span className={rightSidebarCollapsed ? 'hidden lg:inline' : ''}>
                      {rightSidebarCollapsed ? 'Case' : 'Case Information'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className={`space-y-3 xs:space-y-4 sm:space-y-4 transition-all duration-200 ${
                  rightSidebarCollapsed ? 'space-y-2 xs:space-y-3 sm:space-y-3 lg:space-y-4' : 'space-y-3 xs:space-y-4 sm:space-y-4'
                }`}>
                  {!rightSidebarCollapsed && (
                    <>
                      <div>
                        <Label className="text-[10px] xs:text-xs sm:text-xs text-slate-700 font-medium">Case Number</Label>
                        <Input
                          value={caseInfo.caseNumber}
                          onChange={(e) => setCaseInfo(prev => ({ ...prev, caseNumber: e.target.value }))}
                          className="h-6 xs:h-7 sm:h-7 text-[10px] xs:text-xs sm:text-xs mt-1 border-slate-300 bg-white"
                          placeholder="Enter case number..."
                        />
                      </div>
                      
                      <div>
                        <Label className="text-[10px] xs:text-xs sm:text-xs text-slate-700 font-medium">Date</Label>
                        <Input
                          type="date"
                          value={caseInfo.date}
                          onChange={(e) => setCaseInfo(prev => ({ ...prev, date: e.target.value }))}
                          className="h-6 xs:h-7 sm:h-7 text-[10px] xs:text-xs sm:text-xs mt-1 border-slate-300 bg-white"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-[10px] xs:text-xs sm:text-xs text-slate-700 font-medium">Officer</Label>
                        <Input
                          value={caseInfo.officer}
                          onChange={(e) => setCaseInfo(prev => ({ ...prev, officer: e.target.value }))}
                          className="h-6 xs:h-7 sm:h-7 text-[10px] xs:text-xs sm:text-xs mt-1 border-slate-300 bg-white"
                          placeholder="Officer name..."
                        />
                      </div>
                      
                      <div>
                        <Label className="text-[10px] xs:text-xs sm:text-xs text-slate-700 font-medium">Witness</Label>
                        <Input
                          value={caseInfo.witness}
                          onChange={(e) => setCaseInfo(prev => ({ ...prev, witness: e.target.value }))}
                          className="h-6 xs:h-7 sm:h-7 text-[10px] xs:text-xs sm:text-xs mt-1 border-slate-300 bg-white"
                          placeholder="Witness name..."
                        />
                      </div>

                      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-3">
                        <div>
                          <Label className="text-[10px] xs:text-xs sm:text-xs text-slate-700 font-medium">Priority</Label>
                          <select
                            value={caseInfo.priority}
                            onChange={(e) => setCaseInfo(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' }))}
                            className="h-6 xs:h-7 sm:h-7 text-[10px] xs:text-xs sm:text-xs mt-1 border border-slate-300 rounded-md px-1.5 xs:px-2 sm:px-2 bg-white w-full"
                            title="Select priority level"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                        
                        <div>
                          <Label className="text-[10px] xs:text-xs sm:text-xs text-slate-700 font-medium">Status</Label>
                          <select
                            value={caseInfo.status}
                            onChange={(e) => setCaseInfo(prev => ({ ...prev, status: e.target.value as 'draft' | 'in-progress' | 'review' | 'completed' }))}
                            className="h-6 xs:h-7 sm:h-7 text-[10px] xs:text-xs sm:text-xs mt-1 border border-slate-300 rounded-md px-1.5 xs:px-2 sm:px-2 bg-white w-full"
                            title="Select case status"
                          >
                            <option value="draft">Draft</option>
                            <option value="in-progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-[10px] xs:text-xs sm:text-xs text-slate-700 font-medium">Description</Label>
                        <textarea
                          value={caseInfo.description}
                          onChange={(e) => setCaseInfo(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full h-16 xs:h-18 sm:h-18 md:h-20 text-[10px] xs:text-xs sm:text-xs mt-1 p-1.5 xs:p-2 sm:p-2 border border-slate-300 rounded-md resize-none bg-white"
                          placeholder="Case description and notes..."
                        />
                      </div>
                    </>
                  )}

                  {/* Compact view for collapsed state */}
                  {rightSidebarCollapsed && (
                    <div className="space-y-2 xs:space-y-3 sm:space-y-3">
                      <div className="text-center">
                        <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1.5 xs:mb-2 sm:mb-2 border border-blue-200 shadow-inner">
                          <Hash className="w-5 h-5 xs:w-6 xs:h-6 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <p className="text-[10px] xs:text-xs sm:text-xs font-medium text-slate-900">{caseInfo.caseNumber || 'No Case'}</p>
                        <p className="text-[9px] xs:text-xs sm:text-xs text-slate-700">{caseInfo.priority}</p>
                      </div>
                      
                      <div className="space-y-1.5 xs:space-y-2 sm:space-y-2">
                        <div className="flex items-center justify-between text-[9px] xs:text-xs sm:text-xs">
                          <span className="text-slate-600">Features:</span>
                          <span className="font-medium text-slate-900">{features.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] xs:text-xs sm:text-xs">
                          <span className="text-slate-600">Status:</span>
                          <span className="font-medium text-slate-900">{caseInfo.status}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Canvas Settings - Only show when expanded */}
              {!rightSidebarCollapsed && (
                <>
                  <Card className="border-slate-300 bg-white shadow-lg">
                    <CardHeader className="pb-2 xs:pb-3 sm:pb-3">
                      <CardTitle className="text-xs xs:text-sm sm:text-sm flex items-center space-x-1.5 xs:space-x-2 sm:space-x-2 text-slate-900">
                        <Settings className="w-3 h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4" />
                        <span>Canvas Settings</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 xs:space-y-4 sm:space-y-4">
                      <div>
                        <Label className="text-[10px] xs:text-xs sm:text-xs text-slate-700 font-medium">Background Color</Label>
                        <div className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-2 mt-1">
                          <input
                            type="color"
                            value={canvasSettings.backgroundColor}
                            onChange={(e) => setCanvasSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                            className="w-6 h-6 xs:w-8 xs:h-8 sm:w-8 sm:h-8 rounded border border-slate-300 bg-white"
                            title="Select background color"
                          />
                          <Input
                            value={canvasSettings.backgroundColor}
                            onChange={(e) => setCanvasSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                            className="h-6 xs:h-7 sm:h-7 text-[10px] xs:text-xs sm:text-xs flex-1 border-slate-300 bg-white"
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-[10px] xs:text-xs sm:text-xs text-slate-700 font-medium">Grid Size: {gridSize}px</Label>
                        <Slider
                          value={[gridSize]}
                          onValueChange={([value]) => setGridSize(value)}
                          min={10}
                          max={50}
                          step={5}
                          className="mt-1.5 xs:mt-2 sm:mt-2"
                        />
                      </div>

                      <div className="space-y-1.5 xs:space-y-2 sm:space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] xs:text-xs sm:text-xs text-slate-700 font-medium">Show Grid</Label>
                          <Button
                            onClick={() => setShowGrid(!showGrid)}
                            variant={showGrid ? "default" : "outline"}
                            size="sm"
                            className="h-6 w-6 xs:h-7 xs:w-7 sm:h-7 sm:w-7 p-0"
                          >
                            <Grid3X3 className="w-2.5 h-2.5 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] xs:text-xs sm:text-xs text-slate-700 font-medium">Snap to Grid</Label>
                          <Button
                            onClick={() => setSnapToGrid(!snapToGrid)}
                            variant={snapToGrid ? "default" : "outline"}
                            size="sm"
                            className="h-6 w-6 xs:h-7 xs:w-7 sm:h-7 sm:w-7 p-0"
                          >
                            <Target className="w-2.5 h-2.5 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] xs:text-xs sm:text-xs text-slate-700 font-medium">Show Rulers</Label>
                          <Button
                            onClick={() => setCanvasSettings(prev => ({ ...prev, showRulers: !prev.showRulers }))}
                            variant={canvasSettings.showRulers ? "default" : "outline"}
                            size="sm"
                            className="h-6 w-6 xs:h-7 xs:w-7 sm:h-7 sm:w-7 p-0"
                          >
                            <Hash className="w-2.5 h-2.5 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] xs:text-xs sm:text-xs text-slate-700 font-medium">Safe Area</Label>
                          <Button
                            onClick={() => setCanvasSettings(prev => ({ ...prev, showSafeArea: !prev.showSafeArea }))}
                            variant={canvasSettings.showSafeArea ? "default" : "outline"}
                            size="sm"
                            className="h-6 w-6 xs:h-7 xs:w-7 sm:h-7 sm:w-7 p-0"
                          >
                            <Crop className="w-2.5 h-2.5 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-[10px] xs:text-xs sm:text-xs text-slate-700 font-medium">Export Quality</Label>
                        <select
                          value={canvasSettings.quality}
                          onChange={(e) => setCanvasSettings(prev => ({ ...prev, quality: e.target.value as 'standard' | 'high' }))}
                          className="w-full h-6 xs:h-7 sm:h-7 text-[10px] xs:text-xs sm:text-xs mt-1 border border-slate-300 rounded-md px-1.5 xs:px-2 sm:px-2 bg-white"
                          title="Select export quality"
                        >
                          <option value="standard">Standard (1x)</option>
                          <option value="high">High Quality (2x)</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-300 bg-white shadow-lg">
                    <CardHeader className="pb-2 xs:pb-3 sm:pb-3">
                      <CardTitle className="text-xs xs:text-sm sm:text-sm flex items-center space-x-1.5 xs:space-x-2 sm:space-x-2 text-slate-900">
                        <Archive className="w-3 h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4" />
                        <span>Project Statistics</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 xs:space-y-3 sm:space-y-3 text-[10px] xs:text-xs sm:text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-700 font-medium">Total Features:</span>
                          <span className="font-mono text-slate-900">{features.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-700 font-medium">Visible Features:</span>
                          <span className="font-mono text-slate-900">{features.filter(f => f.visible).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-700 font-medium">Locked Features:</span>
                          <span className="font-mono text-slate-900">{features.filter(f => f.locked).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-700 font-medium">Canvas Size:</span>
                          <span className="font-mono text-slate-900">600 × 700</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightPanel;