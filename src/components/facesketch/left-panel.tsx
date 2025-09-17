import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Maximize2, Minimize2, User, Eye, Minus, Triangle, Smile, Waves, Zap, Settings, LucideIcon, AlertTriangle, RefreshCw } from 'lucide-react';

interface FeatureAsset {
  id: string;
  name: string;
  category: string;
  path: string;
  tags: string[];
  description?: string;
}

interface LeftPanelProps {
  leftSidebarCollapsed: boolean;
  setLeftSidebarCollapsed: (collapsed: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAssetClick: (asset: FeatureAsset) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  leftSidebarCollapsed,
  setLeftSidebarCollapsed,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  onAssetClick
}) => {
  // Dynamic asset loading system
  const [featureCategories, setFeatureCategories] = useState<Record<string, {
    name: string;
    icon: LucideIcon;
    color: string;
    assets: FeatureAsset[];
  }>>({});
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [assetsError, setAssetsError] = useState<string | null>(null);

  // Asset category configuration - matches actual folder names in public/assets/
  const assetCategories = {
    'face-shapes': {
      name: 'Face Shapes',
      icon: User,
      color: 'bg-blue-100 text-blue-700',
      folder: 'head',
      maxAssets: 50 // Increased to allow discovery of all available assets
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
        // This allows for gaps in numbering (e.g., 01, 02, 05, 07)
        if (i > 1) {
          // Only stop if we've checked at least 2 numbers and found a gap
          const prevExists = await checkImageExists(`/assets/${folder}/${(i-1).toString().padStart(2, '0')}.png`);
          if (!prevExists) break;
        }
      }
    }
    
    return assets;
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
            // Still create the category with empty assets
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

  // Filter assets based on search
  const filteredAssets = featureCategories[selectedCategory]?.assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (asset.description && asset.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className={`${leftSidebarCollapsed ? 'w-12 xs:w-14 sm:w-16 lg:w-20 xl:w-24' : 'w-full sm:w-64 md:w-72 lg:w-72 xl:w-80'} bg-white/90 backdrop-blur-sm border-r border-amber-200 flex flex-col transition-all duration-300 shadow-sm order-2 lg:order-1`}>
      <div className="p-1 xs:p-1.5 sm:p-2 md:p-3 lg:p-4 border-b border-amber-200">
        <div className="flex items-center justify-between mb-1.5 xs:mb-2 sm:mb-2 md:mb-3">
          <h3 className={`font-semibold text-slate-800 text-xs xs:text-sm sm:text-sm ${leftSidebarCollapsed ? 'hidden' : ''}`}>Feature Library</h3>
          <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-2">
            {!leftSidebarCollapsed && (
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                size="sm"
                className="text-slate-600 border-slate-300 h-6 w-6 xs:h-7 xs:w-7 sm:h-7 sm:w-7 p-0"
                title="Refresh Assets"
              >
                <RefreshCw className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" />
              </Button>
            )}
            <Button 
              onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)} 
              variant="outline" 
              size="sm"
              className="text-slate-600 border-slate-300 h-6 w-6 xs:h-7 xs:w-7 sm:h-7 sm:w-7 p-0"
            >
              {leftSidebarCollapsed ? <Maximize2 className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" /> : <Minimize2 className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" />}
            </Button>
          </div>
        </div>
        
        {!leftSidebarCollapsed && (
          <div className="relative">
            <Search className="absolute left-2 xs:left-2.5 sm:left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5 text-slate-500" />
            <Input
              placeholder="Search features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 xs:pl-8 sm:pl-8 h-6 xs:h-7 sm:h-7 text-[10px] xs:text-xs sm:text-xs bg-slate-50 border-slate-200"
            />
          </div>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-1 xs:p-1.5 sm:p-2 md:p-3 lg:p-4 space-y-1 xs:space-y-1.5 sm:space-y-1.5">
          {/* Loading State */}
          {assetsLoading && (
            <div className="flex items-center justify-center py-4 xs:py-6 sm:py-6">
              <div className="flex flex-col items-center space-y-1.5 xs:space-y-2 sm:space-y-2">
                <div className="animate-spin rounded-full h-5 w-5 xs:h-6 xs:w-6 sm:h-6 sm:w-6 border-b-2 border-blue-600"></div>
                <p className="text-[10px] xs:text-xs sm:text-xs text-slate-600">Loading assets...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {assetsError && (
            <div className="flex items-center justify-center py-4 xs:py-6 sm:py-6">
              <div className="flex flex-col items-center space-y-1.5 xs:space-y-2 sm:space-y-2 text-center">
                <AlertTriangle className="w-5 h-5 xs:w-6 xs:h-6 sm:w-6 sm:h-6 text-red-500" />
                <p className="text-[10px] xs:text-xs sm:text-xs text-red-600">{assetsError}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50 h-6 xs:h-7 sm:h-7 text-[10px] xs:text-xs sm:text-xs"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Categories */}
          {!assetsLoading && !assetsError && Object.entries(featureCategories).map(([key, category]) => {
            const IconComponent = category.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`w-full flex items-center space-x-1.5 xs:space-x-2 sm:space-x-2 p-1.5 xs:p-2 sm:p-2 rounded-lg transition-all duration-200 ${
                  selectedCategory === key
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
                title={leftSidebarCollapsed ? category.name : ''}
              >
                <div className={`p-0.5 xs:p-1 sm:p-1 rounded-md ${category.color}`}>
                  <IconComponent className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5" />
                </div>
                {!leftSidebarCollapsed && (
                  <>
                    <span className="font-medium flex-1 text-left text-[10px] xs:text-xs sm:text-xs">{category.name}</span>
                    <Badge className="bg-slate-100 text-slate-600 text-[9px] xs:text-[10px] sm:text-[10px]">
                      {category.assets.length}
                    </Badge>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Asset Grid - Only show when not collapsed and category is selected */}
      {!leftSidebarCollapsed && selectedCategory && !assetsLoading && !assetsError && (
        <div className="border-t border-amber-200 p-1 xs:p-1.5 sm:p-2 md:p-3 lg:p-4">
          <h4 className="text-[10px] xs:text-xs sm:text-xs font-medium text-slate-700 mb-1.5 xs:mb-2 sm:mb-2">Available Assets</h4>
          <ScrollArea className="h-40 xs:h-44 sm:h-48 md:h-52 lg:h-56">
            <div className="grid gap-1 xs:gap-1.5 sm:gap-1.5 grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="cursor-grab active:cursor-grabbing hover:shadow-lg transition-all duration-200 border border-slate-200 hover:border-amber-300 group bg-white shadow-sm rounded-lg p-1 xs:p-1.5 sm:p-1.5"
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
                  onClick={() => onAssetClick(asset)}
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
                  <h5 className="font-medium text-slate-900 text-center group-hover:text-amber-600 transition-colors text-[9px] xs:text-[10px] sm:text-[10px] leading-tight mb-0.5 xs:mb-1 sm:mb-1">
                    {asset.name}
                  </h5>
                  
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
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* Asset Count */}
          <div className="text-center pt-1 xs:pt-1.5 sm:pt-1.5 border-t border-slate-100 mt-1.5 xs:mt-2 sm:mt-2">
            <span className="text-[9px] xs:text-[10px] sm:text-[10px] text-slate-500 font-medium">
              {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''} available
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftPanel;