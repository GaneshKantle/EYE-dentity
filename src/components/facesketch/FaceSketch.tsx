import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Save, Download, RotateCcw, RotateCw, ZoomIn, ZoomOut, Grid3X3,
  Layers, Search, Eye, EyeOff, Lock, Unlock, Copy, Trash2, Undo2, Redo2,
  FileText, Printer, HelpCircle, User, Hash, Move, Maximize2, Minimize2, Upload,
  Settings, Palette, Target, RefreshCw, Camera, Shield, AlertTriangle,
  Archive, Calendar, ClipboardList, MousePointer2,
  FlipHorizontal, FlipVertical, Crop, Filter, Contrast, Minus, Triangle, Smile, Waves, Zap, LucideIcon,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Import the new separated components
import LeftPanel from './left-panel';
import RightPanel from './right-panel';
import CanvasBoard from './canva-board';

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
  scale: number; // Add scale property
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

const FaceSketch: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [features, setFeatures] = useState<PlacedFeature[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('face-shapes');
  const [searchTerm, setSearchTerm] = useState('');
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<PlacedFeature[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('workspace');
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [autoSelectedFeature, setAutoSelectedFeature] = useState<string | null>(null);

  const [caseInfo, setCaseInfo] = useState<CaseInfo>({
    caseNumber: '',
    date: new Date().toISOString().split('T')[0],
    officer: '',
    description: '',
    witness: '',
    priority: 'medium',
    status: 'draft'
  });

  const [canvasSettings, setCanvasSettings] = useState({
    backgroundColor: '#ffffff',
    showRulers: false,
    showSafeArea: false,
    quality: 'high' as 'standard' | 'high'
  });

  // Dynamic asset loading system
  const [featureCategories, setFeatureCategories] = useState<Record<string, {
    name: string;
    icon: LucideIcon;
    color: string;
    assets: FeatureAsset[];
  }>>({});
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [assetsError, setAssetsError] = useState<string | null>(null);

  // Asset category configuration
  const assetCategories = {
    'face-shapes': {
      name: 'Face Shapes',
      icon: User,
      color: 'bg-blue-100 text-blue-700',
      folder: 'head',
      maxAssets: 10
    },
    'eyes': {
      name: 'Eyes',
      icon: Eye,
      color: 'bg-green-100 text-green-700',
      folder: 'eyes',
      maxAssets: 12
    },
    'eyebrows': {
      name: 'Eyebrows',
      icon: Minus,
      color: 'bg-purple-100 text-purple-700',
      folder: 'eyebrows',
      maxAssets: 12
    },
    'nose': {
      name: 'Nose',
      icon: Triangle,
      color: 'bg-orange-100 text-orange-700',
      folder: 'nose',
      maxAssets: 12
    },
    'lips': {
      name: 'Lips',
      icon: Smile,
      color: 'bg-pink-100 text-pink-700',
      folder: 'lips',
      maxAssets: 12
    },
    'hair': {
      name: 'Hair',
      icon: Waves,
      color: 'bg-yellow-100 text-yellow-700',
      folder: 'hair',
      maxAssets: 12
    },
    'facial-hair': {
      name: 'Mustach',
      icon: Zap,
      color: 'bg-gray-100 text-gray-700',
      folder: 'mustach',
      maxAssets: 12
    },
    'accessories': {
      name: 'More',
      icon: Settings,
      color: 'bg-indigo-100 text-indigo-700',
      folder: 'more',
      maxAssets: 6
    }
  };

  // Generate simple numeric asset names
  const generateAssetNames = (category: string, folder: string, maxAssets: number): Record<string, string> => {
    const names: Record<string, string> = {};
    
    // Generate simple numeric names (01, 02, 03, etc.)
    for (let i = 1; i <= maxAssets; i++) {
      const assetNumber = i.toString().padStart(2, '0');
      names[assetNumber] = assetNumber;
    }
    
    return names;
  };

  // Generate tags based on category
  const generateAssetTags = (category: string, assetName: string) => {
    const tagMap: Record<string, string[]> = {
      'face-shapes': ['face', 'shape', 'structure'],
      'eyes': ['eyes', 'vision', 'facial'],
      'eyebrows': ['eyebrows', 'brows', 'facial'],
      'nose': ['nose', 'nasal', 'facial'],
      'lips': ['lips', 'mouth', 'facial'],
      'hair': ['hair', 'hairstyle', 'head'],
      'facial-hair': ['beard', 'mustache', 'facial'],
      'accessories': ['accessory', 'wear', 'item']
    };

    const baseTags = tagMap[category] || [];
    const nameWords = assetName.toLowerCase().split(' ').filter(word => word.length > 2);
    return [...baseTags, ...nameWords];
  };

  // Load assets dynamically
  useEffect(() => {
    const loadAssets = async () => {
      try {
        setAssetsLoading(true);
        setAssetsError(null);
        
        const categories: Record<string, {
          name: string;
          icon: LucideIcon;
          color: string;
          assets: FeatureAsset[];
        }> = {};

        Object.entries(assetCategories).forEach(([categoryKey, categoryConfig]) => {
          const assets: FeatureAsset[] = [];
          const assetNames = generateAssetNames(categoryKey, categoryConfig.folder, categoryConfig.maxAssets);

          // Generate assets for this category
          for (let i = 1; i <= categoryConfig.maxAssets; i++) {
            const assetNumber = i.toString().padStart(2, '0');
            const assetName = assetNumber; // Use simple numeric name (01, 02, 03, etc.)
            const path = `/assets/${categoryConfig.folder}/${assetNumber}.png`;
            
            // Asset path for face sketch features
            
            assets.push({
              id: `${categoryKey}-${assetNumber}`,
              name: assetName,
              path: path,
              category: categoryKey,
              tags: generateAssetTags(categoryKey, assetName),
              description: `${assetName} - ${categoryConfig.name} option`
            });
          }

          categories[categoryKey] = {
            name: categoryConfig.name,
            icon: categoryConfig.icon,
            color: categoryConfig.color,
            assets: assets
          };
        });

        setFeatureCategories(categories);
        setAssetsLoading(false);
        // Assets loaded successfully
      } catch (error) {
        console.error('Error loading assets:', error);
        setAssetsError('Failed to load assets. Please refresh the page.');
        setAssetsLoading(false);
      }
    };

    loadAssets();
  }, []);

  // Priority colors
  const priorityColors = {
    low: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    urgent: 'bg-red-100 text-red-700 border-red-200'
  };

  // Status colors
  const statusColors = {
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
    review: 'bg-purple-100 text-purple-700 border-purple-200',
    completed: 'bg-green-100 text-green-700 border-green-200'
  };

  // Filter assets based on search
  const filteredAssets = featureCategories[selectedCategory]?.assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (asset.description && asset.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

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

  // History management
  const addToHistory = useCallback((newFeatures: PlacedFeature[]) => {
    setHistory(prev => {
      const newHistory = [...prev.slice(0, historyIndex + 1), [...newFeatures]];
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Undo/Redo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setFeatures([...history[newIndex]]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setFeatures([...history[newIndex]]);
    }
  }, [history, historyIndex]);

  // Add feature with enhanced properties
  const addFeature = useCallback((asset: FeatureAsset) => {
    const defaultSize = getFeatureDefaultSize(asset.category);
    const newFeature: PlacedFeature = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      asset,
      x: snapToGrid ? Math.round(250 / gridSize) * gridSize : 250,
      y: snapToGrid ? Math.round(300 / gridSize) * gridSize : 300,
      width: defaultSize.width,
      height: defaultSize.height,
      rotation: 0,
      opacity: 1,
      zIndex: features.length,
      selected: false,
      locked: false,
      visible: true,
      flipH: false,
      flipV: false,
      brightness: 100,
      contrast: 100,
      scale: defaultSize.scale
    };

    const newFeatures = [...features, newFeature];
    setFeatures(newFeatures);
    addToHistory(newFeatures);
    setSelectedFeatures([newFeature.id]);
  }, [features, addToHistory, snapToGrid, gridSize]);

  // Feature picker for overlapping features
  const [featurePicker, setFeaturePicker] = useState<{
    x: number;
    y: number;
    features: PlacedFeature[];
  } | null>(null);

  // Enhanced canvas event handlers would go here...
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
          setSelectedFeatures(prev => 
            prev.includes(clickedFeature.id) 
              ? prev.filter(id => id !== clickedFeature.id)
              : [...prev, clickedFeature.id]
          );
        } else {
          // Single select
          setSelectedFeatures([clickedFeature.id]);
        }
        
        setIsDragging(true);
        setDragStart({ x: x - clickedFeature.x, y: y - clickedFeature.y });
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
        setSelectedFeatures([smallestFeature.id]);
        setIsDragging(true);
        setDragStart({ x: x - smallestFeature.x, y: y - smallestFeature.y });
        
        // Show auto-selection indicator
        setAutoSelectedFeature(smallestFeature.id);
        
        // Clear the indicator after 2 seconds
        setTimeout(() => {
          setAutoSelectedFeature(null);
        }, 2000);
        
        // Show a brief tooltip indicating which feature was selected
        console.log(`Auto-selected: ${smallestFeature.asset.name} (${smallestFeature.width}×${smallestFeature.height}px)`);
      }
    } else {
      // Clicked on empty space - deselect all
      setSelectedFeatures([]);
      setFeaturePicker(null);
    }
  }, [features, panOffset, zoom]);

  // Handle feature selection from picker
  const selectFeatureFromPicker = useCallback((featureId: string) => {
    setSelectedFeatures([featureId]);
    setFeaturePicker(null);
    
    // Set up dragging for the selected feature
    const feature = features.find(f => f.id === featureId);
    if (feature) {
      setIsDragging(true);
      setDragStart({ x: 0, y: 0 });
    }
  }, [features]);

  // Close feature picker
  const closeFeaturePicker = useCallback(() => {
    setFeaturePicker(null);
  }, []);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || selectedFeatures.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / (zoom / 100);
    const y = (e.clientY - rect.top - panOffset.y) / (zoom / 100);

    const newFeatures = features.map(feature => {
      if (selectedFeatures.includes(feature.id)) {
        let newX = x - dragStart.x;
        let newY = y - dragStart.y;

        // Apply grid snapping if enabled
        if (snapToGrid) {
          newX = Math.round(newX / gridSize) * gridSize;
          newY = Math.round(newY / gridSize) * gridSize;
        }

        return { ...feature, x: newX, y: newY };
      }
      return feature;
    });

    setFeatures(newFeatures);
  }, [isDragging, selectedFeatures, features, panOffset, zoom, dragStart, snapToGrid, gridSize]);

  const handleCanvasMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      addToHistory(features);
    }
  }, [isDragging, features, addToHistory]);

  // Resize feature function
  const resizeFeature = useCallback((featureId: string, newWidth: number, newHeight: number) => {
    const newFeatures = features.map(f => {
      if (f.id === featureId) {
        return {
          ...f,
          width: Math.max(20, newWidth), // Minimum size of 20px
          height: Math.max(20, newHeight)
        };
      }
      return f;
    });
    setFeatures(newFeatures);
    addToHistory(newFeatures);
  }, [features, addToHistory]);

  // Resize selected features
  const resizeSelectedFeatures = useCallback((newWidth: number, newHeight: number) => {
    console.log('Resizing features:', { newWidth, newHeight, selectedFeatures });
    const newFeatures = features.map(f => {
      if (selectedFeatures.includes(f.id)) {
        console.log('Resizing feature:', f.id, 'from', f.width, 'x', f.height, 'to', newWidth, 'x', newHeight);
        return {
          ...f,
          width: Math.max(20, newWidth),
          height: Math.max(20, newHeight)
        };
      }
      return f;
    });
    setFeatures(newFeatures);
    addToHistory(newFeatures);
    console.log('Features updated:', newFeatures);
    
    // Force canvas redraw
    setTimeout(() => {
      if (canvasRef.current) {
        drawCanvas();
      }
    }, 0);
  }, [features, selectedFeatures, addToHistory, drawCanvas]);

  // Handle drag and drop for features
  const handleCanvasDragOver = useCallback((e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleCanvasDrop = useCallback((e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    try {
      const assetData = e.dataTransfer.getData('application/json');
      if (assetData) {
        const asset: FeatureAsset = JSON.parse(assetData);
        
        // Get canvas rect and calculate drop position
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Apply zoom and pan transformations
        const adjustedX = (x - panOffset.x) / (zoom / 100);
        const adjustedY = (y - panOffset.y) / (zoom / 100);
        
        // Snap to grid if enabled
        const finalX = snapToGrid ? Math.round(adjustedX / gridSize) * gridSize : adjustedX;
        const finalY = snapToGrid ? Math.round(adjustedY / gridSize) * gridSize : adjustedY;
        
        // Create new feature at drop position
        const newFeature: PlacedFeature = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          asset,
          x: finalX,
          y: finalY,
          width: getFeatureDefaultSize(asset.category).width,
          height: getFeatureDefaultSize(asset.category).height,
          rotation: 0,
          opacity: 1,
          zIndex: features.length,
          selected: false,
          locked: false,
          visible: true,
          flipH: false,
          flipV: false,
          brightness: 100,
          contrast: 100,
          scale: getFeatureDefaultSize(asset.category).scale
        };

        const newFeatures = [...features, newFeature];
        setFeatures(newFeatures);
        addToHistory(newFeatures);
        setSelectedFeatures([newFeature.id]);
        
        // Show success feedback
        console.log(`Added ${asset.name} at position (${finalX}, ${finalY})`);
      }
    } catch (error) {
      console.error('Error processing dropped asset:', error);
    }
  }, [features, addToHistory, snapToGrid, gridSize, zoom, panOffset]);

  // Export functionality with metadata
  const exportCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    if (!exportCtx) return;

    const resolution = canvasSettings.quality === 'high' ? 2 : 1;
    exportCanvas.width = 600 * resolution;
    exportCanvas.height = 700 * resolution;
    
    exportCtx.scale(resolution, resolution);
    exportCtx.fillStyle = canvasSettings.backgroundColor;
    exportCtx.fillRect(0, 0, 600, 700);

    // Export with metadata
    const metadata = {
      caseInfo,
      exportDate: new Date().toISOString(),
      features: features.length,
      software: 'Forensic Face Builder v2.0'
    };

    try {
      const imagePromises = features
        .filter(f => f.visible)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(feature => {
          return new Promise<{ feature: PlacedFeature; img: HTMLImageElement }>((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ feature, img });
            img.src = feature.asset.path;
          });
        });

      const loadedImages = await Promise.all(imagePromises);
      
      loadedImages.forEach(({ feature, img }) => {
        exportCtx.save();
        exportCtx.translate(feature.x + feature.width / 2, feature.y + feature.height / 2);
        exportCtx.rotate(feature.rotation * Math.PI / 180);
        exportCtx.scale(feature.flipH ? -1 : 1, feature.flipV ? -1 : 1);
        exportCtx.globalAlpha = feature.opacity;
        exportCtx.filter = `brightness(${feature.brightness}%) contrast(${feature.contrast}%)`;
        
        exportCtx.drawImage(
          img,
          -feature.width / 2,
          -feature.height / 2,
          feature.width,
          feature.height
        );
        
        exportCtx.restore();
      });

      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `forensic-sketch-${caseInfo.caseNumber || 'case'}-${timestamp}.png`;
      link.download = fileName;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();

      // Also save metadata as JSON
      const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
      const metadataLink = document.createElement('a');
      metadataLink.download = `forensic-metadata-${caseInfo.caseNumber || 'case'}-${timestamp}.json`;
      metadataLink.href = URL.createObjectURL(metadataBlob);
      metadataLink.click();
    } catch (error) {
      console.error('Error exporting canvas:', error);
    }
  }, [caseInfo, features, canvasSettings]);

  // Export PNG image only (without metadata JSON)
  const exportPNG = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    if (!exportCtx) return;

    const resolution = canvasSettings.quality === 'high' ? 2 : 1;
    exportCanvas.width = 600 * resolution;
    exportCanvas.height = 700 * resolution;
    
    exportCtx.scale(resolution, resolution);
    exportCtx.fillStyle = canvasSettings.backgroundColor;
    exportCtx.fillRect(0, 0, 600, 700);

    try {
      const imagePromises = features
        .filter(f => f.visible)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(feature => {
          return new Promise<{ feature: PlacedFeature; img: HTMLImageElement }>((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ feature, img });
            img.src = feature.asset.path;
          });
        });

      const loadedImages = await Promise.all(imagePromises);
      
      loadedImages.forEach(({ feature, img }) => {
        exportCtx.save();
        exportCtx.translate(feature.x + feature.width / 2, feature.y + feature.height / 2);
        exportCtx.rotate(feature.rotation * Math.PI / 180);
        exportCtx.scale(feature.flipH ? -1 : 1, feature.flipV ? -1 : 1);
        exportCtx.globalAlpha = feature.opacity;
        exportCtx.filter = `brightness(${feature.brightness}%) contrast(${feature.contrast}%)`;
        
        exportCtx.drawImage(
          img,
          -feature.width / 2,
          -feature.height / 2,
          feature.width,
          feature.height
        );
        
        exportCtx.restore();
      });

      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `forensic-sketch-${caseInfo.caseNumber || 'case'}-${timestamp}.png`;
      link.download = fileName;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting PNG:', error);
    }
  }, [caseInfo, features, canvasSettings]);

  // Export JSON metadata only
  const exportMetadata = useCallback(() => {
    const metadata = {
      caseInfo,
      features: features.map(f => ({
        id: f.id,
        asset: {
          id: f.asset.id,
          name: f.asset.name,
          category: f.asset.category,
          path: f.asset.path
        },
        position: { x: f.x, y: f.y },
        size: { width: f.width, height: f.height },
        rotation: f.rotation,
        opacity: f.opacity,
        zIndex: f.zIndex,
        locked: f.locked,
        visible: f.visible,
        flipH: f.flipH,
        flipV: f.flipV,
        brightness: f.brightness,
        contrast: f.contrast,
        scale: f.scale
      })),
      canvasSettings,
      exportDate: new Date().toISOString(),
      software: 'Forensic Face Builder v2.0',
      version: '2.0'
    };
    
    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `forensic-metadata-${caseInfo.caseNumber || 'case'}-${timestamp}.json`;
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    link.click();
  }, [caseInfo, features, canvasSettings]);

  // Enhanced save project
  const saveProject = useCallback(() => {
    const projectData = {
      caseInfo,
      features,
      canvasSettings,
      metadata: {
        version: '2.0',
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        featureCount: features.length,
        software: 'Forensic Face Builder v2.0'
      }
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `forensic-project-${caseInfo.caseNumber || 'case'}-${timestamp}.ffb`;
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    link.click();
  }, [caseInfo, features, canvasSettings]);

  // Feature manipulation functions
  const duplicateFeature = useCallback(() => {
    if (selectedFeatures.length === 0) return;
    
    const newFeatures = [...features];
    selectedFeatures.forEach(id => {
      const feature = features.find(f => f.id === id);
      if (feature) {
        const duplicate: PlacedFeature = {
          ...feature,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          x: feature.x + 20,
          y: feature.y + 20,
          zIndex: features.length + newFeatures.length - features.length,
          selected: false
        };
        newFeatures.push(duplicate);
      }
    });
    setFeatures(newFeatures);
    addToHistory(newFeatures);
  }, [features, selectedFeatures, addToHistory]);

  const deleteSelectedFeatures = useCallback(() => {
    const newFeatures = features.filter(f => !selectedFeatures.includes(f.id));
    setFeatures(newFeatures);
    setSelectedFeatures([]);
    addToHistory(newFeatures);
  }, [features, selectedFeatures, addToHistory]);

  const bringToFront = useCallback(() => {
    if (selectedFeatures.length === 0) return;
    const maxZ = Math.max(...features.map(f => f.zIndex));
    const newFeatures = features.map(f => 
      selectedFeatures.includes(f.id) ? { ...f, zIndex: maxZ + 1 } : f
    );
    setFeatures(newFeatures);
    addToHistory(newFeatures);
  }, [features, selectedFeatures, addToHistory]);

  const sendToBack = useCallback(() => {
    if (selectedFeatures.length === 0) return;
    const minZ = Math.min(...features.map(f => f.zIndex));
    const newFeatures = features.map(f => 
      selectedFeatures.includes(f.id) ? { ...f, zIndex: minZ - 1 } : f
    );
    setFeatures(newFeatures);
    addToHistory(newFeatures);
  }, [features, selectedFeatures, addToHistory]);

  const toggleVisibility = useCallback((featureId: string) => {
    const newFeatures = features.map(f => 
      f.id === featureId ? { ...f, visible: !f.visible } : f
    );
    setFeatures(newFeatures);
    addToHistory(newFeatures);
  }, [features, addToHistory]);

  const toggleLock = useCallback((featureId: string) => {
    const newFeatures = features.map(f => 
      f.id === featureId ? { ...f, locked: !f.locked } : f
    );
    setFeatures(newFeatures);
    addToHistory(newFeatures);
  }, [features, addToHistory]);

  // Property updates for selected features
  const updateSelectedFeatures = useCallback((updates: Partial<PlacedFeature>) => {
    const newFeatures = features.map(f => 
      selectedFeatures.includes(f.id) ? { ...f, ...updates } : f
    );
    setFeatures(newFeatures);
    addToHistory(newFeatures);
  }, [features, selectedFeatures, addToHistory]);

  // Feature-specific default sizes and scaling rules
  const getFeatureDefaultSize = (category: string): { width: number; height: number; scale: number } => {
    const baseSizes = {
      'face-shapes': { width: 400, height: 500, scale: 1.0 },      // Largest - base layer
      'eyes': { width: 80, height: 60, scale: 0.8 },               // Smaller, proportional
      'eyebrows': { width: 90, height: 40, scale: 0.85 },          // Slightly above eye size
      'nose': { width: 120, height: 150, scale: 0.9 },             // Medium, centered
      'lips': { width: 100, height: 80, scale: 0.75 },             // Smaller width than nose
      'hair': { width: 450, height: 550, scale: 1.1 },             // Slightly larger than face
      'facial-hair': { width: 140, height: 120, scale: 0.8 },      // Proportional to lips/jaw
      'accessories': { width: 200, height: 200, scale: 0.9 }       // Fits relative to head/face
    };
    
    return baseSizes[category as keyof typeof baseSizes] || { width: 100, height: 100, scale: 1.0 };
  };

  // Scale feature function
  const scaleFeature = useCallback((featureId: string, newScale: number) => {
    const newFeatures = features.map(f => {
      if (f.id === featureId) {
        const defaultSize = getFeatureDefaultSize(f.asset.category);
        return {
          ...f,
          scale: Math.max(0.5, Math.min(2.0, newScale)), // Clamp between 50% and 200%
          width: defaultSize.width * newScale,
          height: defaultSize.height * newScale
        };
      }
      return f;
    });
    setFeatures(newFeatures);
    addToHistory(newFeatures);
  }, [features, addToHistory]);

  // Scale selected features
  const scaleSelectedFeatures = useCallback((newScale: number) => {
    const newFeatures = features.map(f => {
      if (selectedFeatures.includes(f.id)) {
        const defaultSize = getFeatureDefaultSize(f.asset.category);
        const clampedScale = Math.max(0.5, Math.min(2.0, newScale));
        return {
          ...f,
          scale: clampedScale,
          width: defaultSize.width * clampedScale,
          height: defaultSize.height * clampedScale
        };
      }
      return f;
    });
    setFeatures(newFeatures);
    addToHistory(newFeatures);
  }, [features, selectedFeatures, addToHistory]);

  // Incremental scaling functions
  const scaleUp = useCallback(() => {
    if (selectedFeatures.length > 0) {
      const selectedFeature = features.find(f => f.id === selectedFeatures[0]);
      if (selectedFeature) {
        const newScale = Math.min(2.0, selectedFeature.scale + 0.1);
        scaleSelectedFeatures(newScale);
      }
    }
  }, [selectedFeatures, features, scaleSelectedFeatures]);

  const scaleDown = useCallback(() => {
    if (selectedFeatures.length > 0) {
      const selectedFeature = features.find(f => f.id === selectedFeatures[0]);
      if (selectedFeature) {
        const newScale = Math.max(0.5, selectedFeature.scale - 0.1);
        scaleSelectedFeatures(newScale);
      }
    }
  }, [selectedFeatures, features, scaleSelectedFeatures]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return; // Don't trigger when typing in inputs

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) redo();
            else undo();
            break;
          case 'd':
            e.preventDefault();
            duplicateFeature();
            break;
          case 's':
            e.preventDefault();
            saveProject();
            break;
          case 'e':
            e.preventDefault();
            exportCanvas();
            break;
          case 'a':
            e.preventDefault();
            setSelectedFeatures(features.map(f => f.id));
            break;
        }
      } else {
        switch (e.key) {
          case 'Delete':
          case 'Backspace':
            deleteSelectedFeatures();
            break;
          case 'Escape':
            setSelectedFeatures([]);
            break;
          case 'h':
            if (selectedFeatures.length > 0) {
              updateSelectedFeatures({ flipH: !features.find(f => selectedFeatures.includes(f.id))?.flipH });
            }
            break;
          case 'v':
            if (selectedFeatures.length > 0) {
              updateSelectedFeatures({ flipV: !features.find(f => selectedFeatures.includes(f.id))?.flipV });
            }
            break;
          case '[':
            bringToFront();
            break;
          case ']':
            sendToBack();
            break;
          case '+':
          case '=':
            e.preventDefault();
            scaleUp();
            break;
          case '-':
            e.preventDefault();
            scaleDown();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, duplicateFeature, saveProject, exportCanvas, deleteSelectedFeatures, updateSelectedFeatures, bringToFront, sendToBack, features, selectedFeatures, scaleUp, scaleDown]);

  // Initialize history
  useEffect(() => {
    if (history.length === 0) {
      addToHistory([]);
    }
  }, []);

  // Redraw canvas
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas, features]);

  // Get selected feature for property panel
  const selectedFeature = selectedFeatures.length === 1 ? features.find(f => f.id === selectedFeatures[0]) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 shadow-sm">
        <div className="px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 sm:pl-6 sm:border-l sm:border-amber-200">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-slate-500" />
                  <Input
                    placeholder="Case Number"
                    value={caseInfo.caseNumber}
                    onChange={(e) => setCaseInfo(prev => ({ ...prev, caseNumber: e.target.value }))}
                    className="w-full sm:w-40 h-8 text-sm bg-slate-50 border-slate-200"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${priorityColors[caseInfo.priority]}`}>
                    {caseInfo.priority.toUpperCase()}
                  </Badge>
                  <Badge className={`text-xs ${statusColors[caseInfo.status]}`}>
                    {caseInfo.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Resize Section - Only show when feature is selected */}
            {selectedFeature && (
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-slate-700 hidden sm:inline">Quick Resize:</span>
                  
                  {/* Percentage Viewer */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      {Math.round(selectedFeature.scale * 100)}%
                    </span>
                    
                    {/* Resize Buttons */}
                    <div className="flex items-center space-x-1">
                      <Button
                        onClick={() => {
                          const newScale = Math.max(0.5, selectedFeature.scale - 0.1);
                          scaleSelectedFeatures(newScale);
                        }}
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 text-xs border-red-300 text-red-600 hover:bg-red-50"
                        title="Decrease size"
                      >
                        -
                      </Button>
                      <Button
                        onClick={() => {
                          const newScale = Math.min(2.0, selectedFeature.scale + 0.1);
                          scaleSelectedFeatures(newScale);
                        }}
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 text-xs border-green-300 text-green-600 hover:bg-green-50"
                        title="Increase size"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <Button onClick={undo} disabled={historyIndex <= 0} variant="outline" size="sm" className="text-slate-600 border-slate-300 h-8 w-8 sm:w-auto sm:px-3">
                <Undo2 className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Undo</span>
              </Button>
              <Button onClick={redo} disabled={historyIndex >= history.length - 1} variant="outline" size="sm" className="text-slate-600 border-slate-300 h-8 w-8 sm:w-auto sm:px-3">
                <Redo2 className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Redo</span>
              </Button>
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-8 w-8 sm:w-auto sm:px-3" size="sm">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Download</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={exportPNG}>
                    <FileText className="mr-2 h-4 w-4" />
                    PNG Image
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={saveProject}>
                    <Save className="mr-2 h-4 w-4" />
                    FFB Project
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportMetadata}>
                    <FileText className="mr-2 h-4 w-4" />
                    JSON Metadata
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Enhanced Left Sidebar */}
        <LeftPanel
          leftSidebarCollapsed={leftSidebarCollapsed}
          setLeftSidebarCollapsed={setLeftSidebarCollapsed}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          featureCategories={featureCategories}
          assetsLoading={assetsLoading}
          assetsError={assetsError}
        />

        {/* Main Canvas Area */}
        <CanvasBoard
          canvasRef={canvasRef}
          canvasSettings={canvasSettings}
          showGrid={showGrid}
          gridSize={gridSize}
          snapToGrid={snapToGrid}
          zoom={zoom}
          panOffset={panOffset}
          onZoomChange={setZoom}
          onPanChange={setPanOffset}
          onGridToggle={() => setShowGrid(!showGrid)}
          onSnapToggle={() => setSnapToGrid(!snapToGrid)}
          onResetView={() => {
            setZoom(100);
            setPanOffset({ x: 0, y: 0 });
          }}
          onExport={exportCanvas}
          onSave={saveProject}
          onUndo={undo}
          onRedo={redo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          handleCanvasMouseMove={handleCanvasMouseMove}
          handleCanvasMouseUp={handleCanvasMouseUp}
          handleCanvasDragOver={handleCanvasDragOver}
          handleCanvasDrop={handleCanvasDrop}
          handleCanvasMouseDown={handleCanvasMouseDown}
          featurePicker={featurePicker}
          onSelectFeatureFromPicker={selectFeatureFromPicker}
          onCloseFeaturePicker={closeFeaturePicker}
        />

        {/* Enhanced Right Panel */}
        <RightPanel
          rightSidebarCollapsed={rightSidebarCollapsed}
          setRightSidebarCollapsed={setRightSidebarCollapsed}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          features={features}
          selectedFeatures={selectedFeatures}
          selectedFeature={selectedFeature}
          filteredAssets={filteredAssets}
          caseInfo={caseInfo}
          setCaseInfo={setCaseInfo}
          canvasSettings={canvasSettings}
          setCanvasSettings={setCanvasSettings}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          gridSize={gridSize}
          setGridSize={setGridSize}
          snapToGrid={snapToGrid}
          setSnapToGrid={setSnapToGrid}
          addFeature={addFeature}
          toggleVisibility={toggleVisibility}
          toggleLock={toggleLock}
          updateSelectedFeatures={updateSelectedFeatures}
          scaleSelectedFeatures={scaleSelectedFeatures}
          scaleUp={scaleUp}
          scaleDown={scaleDown}
          resizeSelectedFeatures={resizeSelectedFeatures}
        />
      </div>

      {/* Enhanced Status Bar */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-amber-200 px-3 sm:px-4 md:px-6 py-2 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-600 space-y-2 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Ready</span>
            </div>
            {caseInfo.caseNumber && (
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <Hash className="w-3 h-3" />
                <span>Case: {caseInfo.caseNumber}</span>
              </div>
            )}
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <Calendar className="w-3 h-3" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center justify-center sm:justify-end space-x-4">
              <span className="hidden sm:inline">Features: {features.length}</span>
              <span className="sm:hidden">F: {features.length}</span>
              <span className="hidden sm:inline">Selected: {selectedFeatures.length}</span>
              <span className="sm:hidden">S: {selectedFeatures.length}</span>
              <span>Zoom: {zoom}%</span>
            </div>
            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                caseInfo.priority === 'urgent' ? 'bg-red-500' :
                caseInfo.priority === 'high' ? 'bg-orange-500' :
                caseInfo.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="capitalize hidden sm:inline">{caseInfo.priority} Priority</span>
              <span className="capitalize sm:hidden">{caseInfo.priority}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Tooltip (Hidden by default, could be toggled) */}
      <div className="fixed bottom-4 right-4 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
        <Card className="bg-slate-900 text-white text-xs p-3 max-w-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Ctrl+Z</span><span>Undo</span>
            </div>
            <div className="flex justify-between">
              <span>Ctrl+Y</span><span>Redo</span>
            </div>
            <div className="flex justify-between">
              <span>Ctrl+D</span><span>Duplicate</span>
            </div>
            <div className="flex justify-between">
              <span>Del</span><span>Delete</span>
            </div>
            <div className="flex justify-between">
              <span>H</span><span>Flip Horizontal</span>
            </div>
            <div className="flex justify-between">
              <span>V</span><span>Flip Vertical</span>
            </div>
            <div className="flex justify-between">
              <span>Esc</span><span>Deselect All</span>
            </div>
            <div className="flex justify-between">
              <span>+</span><span>Scale Up</span>
            </div>
            <div className="flex justify-between">
              <span>-</span><span>Scale Down</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FaceSketch;  