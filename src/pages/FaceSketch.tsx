import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Save, Download, Undo2, Redo2, FileText, Hash, Calendar,
  ChevronDown, User, Eye, Minus, Triangle, Smile, Waves, Zap, Settings, LucideIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Import the modular components
import LeftPanel from '@/components/facesketch/left-panel';
import RightPanel from '@/components/facesketch/right-panel';
import CanvasBoard from '@/components/facesketch/canva-board';

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

const FaceSketch: React.FC = () => {
  // Main state management
  const [features, setFeatures] = useState<PlacedFeature[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('face-shapes');
  const [searchTerm, setSearchTerm] = useState('');
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<PlacedFeature[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('workspace');
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [autoSelectedFeature, setAutoSelectedFeature] = useState<string | null>(null);
  const [featurePicker, setFeaturePicker] = useState<{
    x: number;
    y: number;
    features: PlacedFeature[];
  } | null>(null);

  // Dynamic asset loading system
  const [featureCategories, setFeatureCategories] = useState<Record<string, {
    name: string;
    icon: LucideIcon;
    color: string;
    assets: FeatureAsset[];
  }>>({});
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [assetsError, setAssetsError] = useState<string | null>(null);

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

  // Resize selected features
  const resizeSelectedFeatures = useCallback((newWidth: number, newHeight: number) => {
    const newFeatures = features.map(f => {
      if (selectedFeatures.includes(f.id)) {
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
  }, [features, selectedFeatures, addToHistory]);

  // Canvas event handlers
  const handleFeatureSelect = useCallback((featureIds: string[]) => {
    setSelectedFeatures(featureIds);
  }, []);

  const handleFeatureMove = useCallback((featureId: string, x: number, y: number) => {
    setFeatures(prev => prev.map(f => 
      f.id === featureId ? { ...f, x, y } : f
    ));
  }, []);

  const handleFeatureDragStart = useCallback((featureId: string, x: number, y: number) => {
    // Handle drag start if needed
  }, []);

  const handleFeatureDragEnd = useCallback(() => {
    addToHistory(features);
  }, [features, addToHistory]);

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
        addFeature(asset);
      }
    } catch (error) {
      console.error('Error processing dropped asset:', error);
    }
  }, [addFeature]);

  // Export functionality
  const exportPNG = useCallback(async () => {
    // Export PNG functionality would be implemented here
    console.log('Export PNG');
  }, []);

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

  // Handle feature selection from picker
  const selectFeatureFromPicker = useCallback((featureId: string) => {
    setSelectedFeatures([featureId]);
    setFeaturePicker(null);
  }, []);

  // Close feature picker
  const closeFeaturePicker = useCallback(() => {
    setFeaturePicker(null);
  }, []);

  // Initialize history
  useEffect(() => {
    if (history.length === 0) {
      addToHistory([]);
    }
  }, []);

  // Get selected feature for property panel
  const selectedFeature = selectedFeatures.length === 1 ? features.find(f => f.id === selectedFeatures[0]) : null;

  // Asset category configuration - matches actual folder names in public/assets/
  const assetCategories = {
    'face-shapes': {
      name: 'Face Shapes',
      icon: User,
      color: 'bg-blue-100 text-blue-700',
      folder: 'head',
      maxAssets: 50
    },
    'eyes': {
      name: 'Eyes',
      icon: Eye,
      color: 'bg-green-100 text-green-700',
      folder: 'eyes',
      maxAssets: 50
    },
    'eyebrows': {
      name: 'Eyebrows',
      icon: Minus,
      color: 'bg-purple-100 text-purple-700',
      folder: 'eyebrows',
      maxAssets: 50
    },
    'nose': {
      name: 'Nose',
      icon: Triangle,
      color: 'bg-orange-100 text-orange-700',
      folder: 'nose',
      maxAssets: 50
    },
    'lips': {
      name: 'Lips',
      icon: Smile,
      color: 'bg-pink-100 text-pink-700',
      folder: 'lips',
      maxAssets: 50
    },
    'hair': {
      name: 'Hair',
      icon: Waves,
      color: 'bg-yellow-100 text-yellow-700',
      folder: 'hair',
      maxAssets: 50
    },
    'facial-hair': {
      name: 'Mustach',
      icon: Zap,
      color: 'bg-gray-100 text-gray-700',
      folder: 'mustach',
      maxAssets: 50
    },
    'accessories': {
      name: 'More',
      icon: Settings,
      color: 'bg-indigo-100 text-indigo-700',
      folder: 'more',
      maxAssets: 50
    }
  };

  // Function to check if an image exists
  const checkImageExists = async (imagePath: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imagePath;
    });
  };

  // Function to discover available numbered assets
  const discoverAssets = async (folder: string, maxCheck: number = 50): Promise<FeatureAsset[]> => {
    const assets: FeatureAsset[] = [];
    
    for (let i = 1; i <= maxCheck; i++) {
      const assetNumber = i.toString().padStart(2, '0');
      const imagePath = `/assets/${folder}/${assetNumber}.png`;
      
      // Check if the image exists
      const exists = await checkImageExists(imagePath);
      if (exists) {
        assets.push({
          id: `${folder}-${assetNumber}`,
          name: assetNumber,
          path: imagePath,
          category: folder,
          tags: generateAssetTags(folder, assetNumber),
          description: `${assetNumber} - ${assetCategories[folder]?.name || folder} option`
        });
      } else {
        // If we don't find a consecutive number, stop checking
        if (i > 1) {
          const prevExists = await checkImageExists(`/assets/${folder}/${(i-1).toString().padStart(2, '0')}.png`);
          if (!prevExists) break;
        }
      }
    }
    
    return assets;
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

        // Load assets for each category
        for (const [categoryKey, categoryConfig] of Object.entries(assetCategories)) {
          try {
            const assets = await discoverAssets(categoryKey, categoryConfig.maxAssets);
            
            categories[categoryKey] = {
              name: categoryConfig.name,
              icon: categoryConfig.icon,
              color: categoryConfig.color,
              assets: assets
            };
          } catch (error) {
            console.error(`Error loading assets for ${categoryKey}:`, error);
            categories[categoryKey] = {
              name: categoryConfig.name,
              icon: categoryConfig.icon,
              color: categoryConfig.color,
              assets: []
            };
          }
        }

        setFeatureCategories(categories);
        setAssetsLoading(false);
        console.log('Assets loaded successfully:', categories);
      } catch (error) {
        console.error('Error loading assets:', error);
        setAssetsError('Failed to load assets. Please refresh the page.');
        setAssetsLoading(false);
      }
    };

    loadAssets();
  }, []);

  // Get filtered assets for right panel
  const filteredAssets = featureCategories[selectedCategory]?.assets || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 shadow-sm">
        <div className="px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-2 xs:py-2.5 sm:py-3">
          <div className="flex flex-col xs:flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 xs:space-y-2 sm:space-y-0">
            <div className="flex flex-col xs:flex-col sm:flex-row sm:items-center space-y-1 xs:space-y-1 sm:space-y-0 sm:space-x-4">
              
              <div className="flex flex-col xs:flex-col sm:flex-row sm:items-center space-y-1 xs:space-y-1 sm:space-y-0 sm:space-x-3 sm:pl-4 sm:border-l sm:border-amber-200">
                <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-1.5">
                  <Hash className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5 text-slate-500" />
                  <Input
                    placeholder="Case Number"
                    value={caseInfo.caseNumber}
                    onChange={(e) => setCaseInfo(prev => ({ ...prev, caseNumber: e.target.value }))}
                    className="w-full xs:w-28 sm:w-32 md:w-36 h-6 xs:h-7 sm:h-7 text-xs xs:text-xs sm:text-xs bg-slate-50 border-slate-200"
                  />
                </div>
                
                <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-1.5">
                  <Badge className={`text-[9px] xs:text-[10px] sm:text-[10px] px-1.5 xs:px-2 sm:px-2 py-0.5 ${priorityColors[caseInfo.priority]}`}>
                    {caseInfo.priority.toUpperCase()}
                  </Badge>
                  <Badge className={`text-[9px] xs:text-[10px] sm:text-[10px] px-1.5 xs:px-2 sm:px-2 py-0.5 ${statusColors[caseInfo.status]}`}>
                    {caseInfo.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Resize Section - Only show when feature is selected */}
            {selectedFeature && (
              <div className="flex flex-col xs:flex-col sm:flex-row sm:items-center space-y-1 xs:space-y-1 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-1.5">
                  <span className="text-[9px] xs:text-[10px] sm:text-[10px] font-medium text-slate-700 hidden xs:inline sm:inline">Resize:</span>
                  
                  {/* Percentage Viewer */}
                  <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-1.5">
                    <span className="text-[9px] xs:text-[10px] sm:text-[10px] text-slate-600 bg-slate-100 px-1 xs:px-1.5 sm:px-1.5 py-0.5 rounded border border-slate-200">
                      {Math.round(selectedFeature.scale * 100)}%
                    </span>
                    
                    {/* Resize Buttons */}
                    <div className="flex items-center space-x-0.5 xs:space-x-1 sm:space-x-1">
                      <Button
                        onClick={() => {
                          const newScale = Math.max(0.5, selectedFeature.scale - 0.1);
                          scaleSelectedFeatures(newScale);
                        }}
                        variant="outline"
                        size="sm"
                        className="h-5 w-5 xs:h-6 xs:w-6 sm:h-6 sm:w-6 p-0 text-[9px] xs:text-[10px] sm:text-[10px] border-red-300 text-red-600 hover:bg-red-50 transition-all duration-200"
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
                        className="h-5 w-5 xs:h-6 xs:w-6 sm:h-6 sm:w-6 p-0 text-[9px] xs:text-[10px] sm:text-[10px] border-green-300 text-green-600 hover:bg-green-50 transition-all duration-200"
                        title="Increase size"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center sm:justify-end space-x-1 xs:space-x-1.5 sm:space-x-1.5">
              <Button onClick={undo} disabled={historyIndex <= 0} variant="outline" size="sm" className="text-slate-600 border-slate-300 h-6 w-6 xs:h-7 xs:w-7 sm:h-7 sm:w-7 xs:w-auto xs:px-2 sm:w-auto sm:px-2 transition-all duration-200">
                <Undo2 className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline sm:inline ml-1 text-[9px] xs:text-xs sm:text-xs">Undo</span>
              </Button>
              <Button onClick={redo} disabled={historyIndex >= history.length - 1} variant="outline" size="sm" className="text-slate-600 border-slate-300 h-6 w-6 xs:h-7 xs:w-7 sm:h-7 sm:w-7 xs:w-auto xs:px-2 sm:w-auto sm:px-2 transition-all duration-200">
                <Redo2 className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline sm:inline ml-1 text-[9px] xs:text-xs sm:text-xs">Redo</span>
              </Button>
              <Separator orientation="vertical" className="h-5 xs:h-6 sm:h-6 hidden xs:block sm:block" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-6 w-6 xs:h-7 xs:w-7 sm:h-7 sm:w-7 xs:w-auto xs:px-2 sm:w-auto sm:px-2 transition-all duration-200" size="sm">
                    <Download className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden xs:inline sm:inline ml-1 text-[9px] xs:text-xs sm:text-xs">Download</span>
                    <ChevronDown className="ml-1 h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-3.5 sm:w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 xs:w-48 sm:w-48">
                  <DropdownMenuItem onClick={exportPNG} className="text-xs xs:text-sm sm:text-sm">
                    <FileText className="mr-2 h-3 w-3 xs:h-4 xs:w-4 sm:h-4 sm:w-4" />
                    PNG Image
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={saveProject} className="text-xs xs:text-sm sm:text-sm">
                    <Save className="mr-2 h-3 w-3 xs:h-4 xs:w-4 sm:h-4 sm:w-4" />
                    FFB Project
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportMetadata} className="text-xs xs:text-sm sm:text-sm">
                    <FileText className="mr-2 h-3 w-3 xs:h-4 xs:w-4 sm:h-4 sm:w-4" />
                    JSON Metadata
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Left Panel */}
        <LeftPanel
          leftSidebarCollapsed={leftSidebarCollapsed}
          setLeftSidebarCollapsed={setLeftSidebarCollapsed}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAssetClick={addFeature}
        />

        {/* Main Canvas Area */}
        <CanvasBoard
          features={features}
          selectedFeatures={selectedFeatures}
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
          onExport={exportPNG}
          onSave={saveProject}
          onUndo={undo}
          onRedo={redo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onFeatureSelect={handleFeatureSelect}
          onFeatureMove={handleFeatureMove}
          onFeatureDragStart={handleFeatureDragStart}
          onFeatureDragEnd={handleFeatureDragEnd}
          onCanvasDragOver={handleCanvasDragOver}
          onCanvasDrop={handleCanvasDrop}
          featurePicker={featurePicker}
          onSelectFeatureFromPicker={selectFeatureFromPicker}
          onCloseFeaturePicker={closeFeaturePicker}
          autoSelectedFeature={autoSelectedFeature}
        />

        {/* Right Panel */}
        <RightPanel
          rightSidebarCollapsed={rightSidebarCollapsed}
          setRightSidebarCollapsed={setRightSidebarCollapsed}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          features={features}
          selectedFeatures={selectedFeatures}
          selectedFeature={selectedFeature}
          featureCategories={featureCategories}
          selectedCategory={selectedCategory}
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
          bringToFront={bringToFront}
          sendToBack={sendToBack}
          duplicateFeature={duplicateFeature}
          deleteSelectedFeatures={deleteSelectedFeatures}
          exportPNG={exportPNG}
          saveProject={saveProject}
          exportMetadata={exportMetadata}
        />
      </div>

      {/* Enhanced Status Bar */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-amber-200 px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-1 xs:py-1.5 sm:py-1.5 shadow-sm">
        <div className="flex flex-col xs:flex-col sm:flex-row sm:items-center sm:justify-between text-[9px] xs:text-[10px] sm:text-[10px] text-slate-600 space-y-1 xs:space-y-1 sm:space-y-0">
          <div className="flex flex-col xs:flex-col sm:flex-row sm:items-center space-y-1 xs:space-y-1 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center justify-center sm:justify-start space-x-1 xs:space-x-1.5 sm:space-x-1.5">
              <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Ready</span>
            </div>
            {caseInfo.caseNumber && (
              <div className="flex items-center justify-center sm:justify-start space-x-1 xs:space-x-1.5 sm:space-x-1.5">
                <Hash className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-2.5 sm:h-2.5" />
                <span>Case: {caseInfo.caseNumber}</span>
              </div>
            )}
            <div className="flex items-center justify-center sm:justify-start space-x-1 xs:space-x-1.5 sm:space-x-1.5">
              <Calendar className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-2.5 sm:h-2.5" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex flex-col xs:flex-col sm:flex-row sm:items-center space-y-1 xs:space-y-1 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center justify-center sm:justify-end space-x-2 xs:space-x-3 sm:space-x-3">
              <span className="hidden xs:inline sm:inline">Features: {features.length}</span>
              <span className="xs:hidden sm:hidden">F: {features.length}</span>
              <span className="hidden xs:inline sm:inline">Selected: {selectedFeatures.length}</span>
              <span className="xs:hidden sm:hidden">S: {selectedFeatures.length}</span>
              <span>Zoom: {zoom}%</span>
            </div>
            <div className="flex items-center justify-center sm:justify-end space-x-1 xs:space-x-1.5 sm:space-x-1.5">
              <div className={`w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-1.5 sm:h-1.5 rounded-full ${
                caseInfo.priority === 'urgent' ? 'bg-red-500' :
                caseInfo.priority === 'high' ? 'bg-orange-500' :
                caseInfo.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="capitalize hidden xs:inline sm:inline">{caseInfo.priority} Priority</span>
              <span className="capitalize xs:hidden sm:hidden">{caseInfo.priority}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceSketch;
