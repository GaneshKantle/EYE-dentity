import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ZoomIn, ZoomOut, Grid3X3, Target, Copy, Trash2, 
  FlipHorizontal, FlipVertical, Layers, MousePointer2, X
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

interface CanvasSettings {
  backgroundColor: string;
  showRulers: boolean;
  showSafeArea: boolean;
  quality: 'standard' | 'high';
}

interface CanvasBoardProps {
  features: PlacedFeature[];
  selectedFeatures: string[];
  canvasSettings: CanvasSettings;
  showGrid: boolean;
  gridSize: number;
  snapToGrid: boolean;
  zoom: number;
  panOffset: { x: number; y: number };
  onZoomChange: (zoom: number) => void;
  onPanChange: (pan: { x: number; y: number }) => void;
  onGridToggle: () => void;
  onSnapToggle: () => void;
  onResetView: () => void;
  onExport: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onFeatureSelect: (featureIds: string[]) => void;
  onFeatureMove: (featureId: string, x: number, y: number) => void;
  onFeatureDragStart: (featureId: string, x: number, y: number) => void;
  onFeatureDragEnd: () => void;
  onCanvasDragOver: (e: React.DragEvent<HTMLCanvasElement>) => void;
  onCanvasDrop: (e: React.DragEvent<HTMLCanvasElement>) => void;
  featurePicker: {
    x: number;
    y: number;
    features: PlacedFeature[];
  } | null;
  onSelectFeatureFromPicker: (featureId: string) => void;
  onCloseFeaturePicker: () => void;
  autoSelectedFeature: string | null;
}

const CanvasBoard: React.FC<CanvasBoardProps> = ({
  features,
  selectedFeatures,
  canvasSettings,
  showGrid,
  gridSize,
  snapToGrid,
  zoom,
  panOffset,
  onZoomChange,
  onPanChange,
  onGridToggle,
  onSnapToggle,
  onResetView,
  onExport,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onFeatureSelect,
  onFeatureMove,
  onFeatureDragStart,
  onFeatureDragEnd,
  onCanvasDragOver,
  onCanvasDrop,
  featurePicker,
  onSelectFeatureFromPicker,
  onCloseFeaturePicker,
  autoSelectedFeature
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Canvas drawing with enhanced features
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background
    ctx.fillStyle = canvasSettings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan transformations
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoom / 100, zoom / 100);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1 / (zoom / 100);
      
      for (let x = 0; x <= 600; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 700);
        ctx.stroke();
      }
      
      for (let y = 0; y <= 700; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(600, y);
        ctx.stroke();
      }
    }

    // Draw safe area guidelines
    if (canvasSettings.showSafeArea) {
      ctx.strokeStyle = '#3b82f6';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2 / (zoom / 100);
      ctx.strokeRect(50, 50, 500, 600);
      ctx.setLineDash([]);
    }

    // Sort features by zIndex
    const sortedFeatures = [...features].sort((a, b) => a.zIndex - b.zIndex);

    // Draw features
    sortedFeatures.forEach(feature => {
      if (!feature.visible) return;

      const img = new Image();
      img.src = feature.asset.path;
      
      img.onload = () => {
        // Canvas image loaded successfully
        ctx.save();
        
        // Apply transformations
        ctx.translate(feature.x + feature.width / 2, feature.y + feature.height / 2);
        ctx.rotate(feature.rotation * Math.PI / 180);
        ctx.scale(feature.flipH ? -1 : 1, feature.flipV ? -1 : 1);
        ctx.globalAlpha = feature.opacity;
        
        // Apply filters
        ctx.filter = `brightness(${feature.brightness}%) contrast(${feature.contrast}%)`;
        
        ctx.drawImage(
          img,
          -feature.width / 2,
          -feature.height / 2,
          feature.width,
          feature.height
        );
        
        // Reset filter
        ctx.filter = 'none';
        
        // Draw selection indicators
        if (feature.selected) {
          // Check if this is an auto-selected feature
          const isAutoSelected = autoSelectedFeature === feature.id;
          
          ctx.strokeStyle = isAutoSelected ? '#10b981' : '#ef4444'; // Green for auto-selected, red for normal
          ctx.lineWidth = isAutoSelected ? 3 / (zoom / 100) : 2 / (zoom / 100); // Thicker for auto-selected
          ctx.setLineDash(isAutoSelected ? [5, 5] : [3, 3]);
          ctx.strokeRect(
            -feature.width / 2,
            -feature.height / 2,
            feature.width,
            feature.height
          );
          ctx.setLineDash([]);
          
          // Draw resize handles
          const handleSize = 8 / (zoom / 100);
          const handles = [
            { x: -feature.width / 2, y: -feature.height / 2 }, // top-left
            { x: feature.width / 2, y: -feature.height / 2 },  // top-right
            { x: -feature.width / 2, y: feature.height / 2 },  // bottom-left
            { x: feature.width / 2, y: feature.height / 2 },   // bottom-right
          ];
          
          handles.forEach(handle => {
            ctx.fillStyle = isAutoSelected ? '#10b981' : '#ef4444';
            ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1 / (zoom / 100);
            ctx.strokeRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
          });
        }
        
        // Draw lock indicator
        if (feature.locked) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(feature.width / 2 - 10, -feature.height / 2, 20, 20);
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('🔒', feature.width / 2, -feature.height / 2 + 15);
        }
        
        ctx.restore();
      };
      
      img.onerror = () => {
        console.error(`Failed to load canvas image: ${feature.asset.path}`);
      };
    });

    ctx.restore();
  }, [features, zoom, panOffset, showGrid, gridSize, canvasSettings, autoSelectedFeature]);

  // Enhanced canvas event handlers
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / (zoom / 100);
    const y = (e.clientY - rect.top - panOffset.y) / (zoom / 100);

    // Find all features at this location (including overlapping ones)
    const featuresAtLocation = features.filter(feature => {
      if (!feature.visible) return false;
      
      const featureX = feature.x;
      const featureY = feature.y;
      const featureWidth = feature.width;
      const featureHeight = feature.height;
      
      return x >= featureX && x <= featureX + featureWidth &&
             y >= featureY && y <= featureY + featureHeight;
    });

    if (featuresAtLocation.length > 0) {
      if (featuresAtLocation.length === 1) {
        // Single feature - select it directly
        const clickedFeature = featuresAtLocation[0];
        
        if (e.shiftKey) {
          // Multi-select with shift
          const newSelection = selectedFeatures.includes(clickedFeature.id) 
            ? selectedFeatures.filter(id => id !== clickedFeature.id)
            : [...selectedFeatures, clickedFeature.id];
          onFeatureSelect(newSelection);
        } else {
          // Single select
          onFeatureSelect([clickedFeature.id]);
        }
        
        setIsDragging(true);
        setDragStart({ x: x - clickedFeature.x, y: y - clickedFeature.y });
        onFeatureDragStart(clickedFeature.id, x, y);
      } else {
        // Multiple features - prioritize the SMALLEST feature (most likely what user wants to click)
        // Sort by size first (smallest first), then by zIndex (top layer first)
        const sortedFeatures = featuresAtLocation.sort((a, b) => {
          const aArea = a.width * a.height;
          const bArea = b.width * b.height;
          
          // First priority: smallest area (smallest feature)
          if (aArea !== bArea) {
            return aArea - bArea;
          }
          
          // Second priority: higher zIndex (top layer)
          return b.zIndex - a.zIndex;
        });
        
        // Auto-select the smallest feature instead of showing picker
        const smallestFeature = sortedFeatures[0];
        onFeatureSelect([smallestFeature.id]);
        setIsDragging(true);
        setDragStart({ x: x - smallestFeature.x, y: y - smallestFeature.y });
        onFeatureDragStart(smallestFeature.id, x, y);
        
        // Show auto-selection indicator
        console.log(`Auto-selected: ${smallestFeature.asset.name} (${smallestFeature.width}×${smallestFeature.height}px)`);
      }
    } else {
      // Clicked on empty space - deselect all
      onFeatureSelect([]);
    }
  }, [features, panOffset, zoom, selectedFeatures, onFeatureSelect, onFeatureDragStart]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || selectedFeatures.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / (zoom / 100);
    const y = (e.clientY - rect.top - panOffset.y) / (zoom / 100);

    selectedFeatures.forEach(featureId => {
      let newX = x - dragStart.x;
      let newY = y - dragStart.y;

      // Apply grid snapping if enabled
      if (snapToGrid) {
        newX = Math.round(newX / gridSize) * gridSize;
        newY = Math.round(newY / gridSize) * gridSize;
      }

      onFeatureMove(featureId, newX, newY);
    });
  }, [isDragging, selectedFeatures, panOffset, zoom, dragStart, snapToGrid, gridSize, onFeatureMove]);

  const handleCanvasMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onFeatureDragEnd();
    }
  }, [isDragging, onFeatureDragEnd]);

  // Redraw canvas when features change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-amber-100 to-orange-50 order-1 lg:order-2 min-h-0">
      {/* Enhanced Toolbar */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-amber-200 p-1 xs:p-1.5 sm:p-2 md:p-3 lg:p-4 shadow-sm flex-shrink-0">
        <div className="flex flex-col space-y-1.5 xs:space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 xs:gap-2 sm:gap-3">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-0.5 xs:space-x-0.5 sm:space-x-0.5 bg-white rounded-lg p-0.5 xs:p-1 sm:p-1 border-2 border-slate-200 shadow-lg">
              <Button 
                onClick={() => onZoomChange(Math.max(zoom - 25, 25))} 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 xs:h-7 xs:w-7 sm:h-6 sm:w-6 p-0 hover:bg-amber-100 text-amber-700 hover:text-amber-800 transition-all duration-200"
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" />
              </Button>
              <span className="text-[10px] xs:text-xs sm:text-xs text-slate-800 min-w-[40px] xs:min-w-[45px] sm:min-w-[45px] text-center font-mono px-1.5 xs:px-2 sm:px-2 py-0.5 bg-amber-50 rounded-md border border-amber-200 font-semibold">{zoom}%</span>
              <Button 
                onClick={() => onZoomChange(Math.min(zoom + 25, 300))} 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 xs:h-7 xs:w-7 sm:h-6 sm:w-6 p-0 hover:bg-amber-100 text-amber-700 hover:text-amber-800 transition-all duration-200"
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-5 xs:h-6 sm:h-6 hidden xs:block sm:block bg-amber-300" />
            
            {/* Grid Controls */}
            <div className="flex items-center space-x-0.5 xs:space-x-0.5 sm:space-x-0.5 bg-white rounded-lg p-0.5 xs:p-1 sm:p-1 border-2 border-slate-200 shadow-lg">
              <Button
                onClick={onGridToggle}
                variant={showGrid ? "default" : "ghost"}
                size="sm"
                className={`h-6 w-6 xs:h-7 xs:w-7 sm:h-6 sm:w-6 p-0 transition-all duration-200 ${
                  showGrid 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" 
                    : "hover:bg-blue-100 text-blue-700 hover:text-blue-800"
                }`}
                title="Toggle Grid"
              >
                <Grid3X3 className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" />
              </Button>
              <Button
                onClick={onSnapToggle}
                variant={snapToGrid ? "default" : "ghost"}
                size="sm"
                className={`h-6 w-6 xs:h-7 xs:w-7 sm:h-6 sm:w-6 p-0 transition-all duration-200 ${
                  snapToGrid 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" 
                    : "hover:bg-blue-100 text-blue-700 hover:text-blue-800"
                }`}
                title="Snap to Grid"
              >
                <Target className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-5 xs:h-6 sm:h-6 hidden xs:block sm:block bg-amber-300" />

            {/* Edit Controls */}
            <div className="flex items-center space-x-0.5 xs:space-x-0.5 sm:space-x-0.5 bg-white rounded-lg p-0.5 xs:p-1 sm:p-1 border-2 border-slate-200 shadow-lg">
              <Button 
                onClick={() => {}} 
                disabled={false} 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 xs:h-7 xs:w-7 sm:h-6 sm:w-6 p-0 hover:bg-green-100 text-green-700 hover:text-green-800 disabled:opacity-50 transition-all duration-200" 
                title="Duplicate (Ctrl+D)"
              >
                <Copy className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" />
              </Button>
              <Button 
                onClick={() => {}} 
                disabled={false} 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 xs:h-7 xs:w-7 sm:h-6 sm:w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-100 disabled:opacity-50 transition-all duration-200" 
                title="Delete (Del)"
              >
                <Trash2 className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 flex items-start justify-center p-1 xs:p-1.5 sm:p-2 md:p-3 lg:p-4 xl:p-6 overflow-hidden min-h-0">
        <div className="relative max-w-full max-h-full flex items-center justify-center">
          {/* Canvas with responsive scaling */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={700}
              className="border-2 border-slate-300 bg-white shadow-xl cursor-crosshair rounded-lg transition-all duration-200 hover:shadow-2xl transform-gpu"
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onDragOver={onCanvasDragOver}
              onDrop={onCanvasDrop}
              style={{
                transform: `scale(${Math.min(zoom / 100, window.innerWidth / 650, window.innerHeight / 750)})`,
                transformOrigin: 'center',
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto'
              }}
            />
            
            {/* Zoom level indicator */}
            <div className="absolute top-1 xs:top-2 sm:top-2 right-1 xs:right-2 sm:right-2 bg-white/90 backdrop-blur-sm px-1.5 xs:px-2 sm:px-2 py-0.5 xs:py-1 sm:py-1 rounded-md border border-slate-200 shadow-sm">
              <span className="text-[10px] xs:text-xs sm:text-xs font-mono text-slate-600">{zoom}%</span>
            </div>

            {/* Grid size indicator */}
            {showGrid && (
              <div className="absolute bottom-1 xs:bottom-2 sm:bottom-2 left-1 xs:left-2 sm:left-2 bg-white/90 backdrop-blur-sm px-1.5 xs:px-2 sm:px-2 py-0.5 xs:py-1 sm:py-1 rounded-md border border-slate-200 shadow-sm">
                <span className="text-[10px] xs:text-xs sm:text-xs font-mono text-slate-600">Grid: {gridSize}px</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature Picker for overlapping features */}
      {featurePicker && (
        <div 
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-slate-200 p-2 xs:p-3 sm:p-3 min-w-[180px] xs:min-w-[200px] sm:min-w-[200px] max-w-[90vw] xs:max-w-[80vw] sm:max-w-[60vw]"
          style={{
            left: Math.min(featurePicker.x, window.innerWidth - 200),
            top: Math.min(featurePicker.y, window.innerHeight - 200)
          }}
        >
          <div className="flex items-center justify-between mb-1.5 xs:mb-2 sm:mb-2">
            <h3 className="text-xs xs:text-sm sm:text-sm font-medium text-slate-700">Select Feature</h3>
            <Button
              onClick={onCloseFeaturePicker}
              variant="ghost"
              size="sm"
              className="h-5 w-5 xs:h-6 xs:w-6 sm:h-6 sm:w-6 p-0 hover:bg-slate-100 transition-all duration-200"
            >
              <X className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3 sm:h-3" />
            </Button>
          </div>
          
          <div className="space-y-1.5 xs:space-y-2 sm:space-y-2 max-h-40 xs:max-h-48 sm:max-h-48 overflow-y-auto">
            {featurePicker.features.map((feature, index) => (
              <div
                key={feature.id}
                className="flex items-center space-x-2 xs:space-x-3 sm:space-x-3 p-1.5 xs:p-2 sm:p-2 rounded-md hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => onSelectFeatureFromPicker(feature.id)}
              >
                <div className="w-6 h-6 xs:w-8 xs:h-8 sm:w-8 sm:h-8 bg-slate-100 rounded border flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] xs:text-xs sm:text-xs text-slate-600 font-medium">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs xs:text-sm sm:text-sm font-medium text-slate-700 truncate">
                    {feature.asset.name}
                  </div>
                  <div className="text-[10px] xs:text-xs sm:text-xs text-slate-500 truncate">
                    {feature.asset.category} • {feature.width}×{feature.height}px
                  </div>
                </div>
                <div className="text-[10px] xs:text-xs sm:text-xs text-slate-400 flex-shrink-0">
                  Z:{feature.zIndex}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-[10px] xs:text-xs sm:text-xs text-slate-500 mt-1.5 xs:mt-2 sm:mt-2 pt-1.5 xs:pt-2 sm:pt-2 border-t border-slate-200">
            Click on a feature to select it
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasBoard;