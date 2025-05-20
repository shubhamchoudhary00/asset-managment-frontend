"use client"
import React, { useEffect } from 'react'
import { Card, CardContent } from '../ui/card'
import { 
  HardDrive, 
  Laptop, 
  Monitor, 
  Printer, 
  Server, 
  Smartphone, 
  Cable, 
  WifiIcon, 
  Headphones, 
  Keyboard, 
  Mouse, 
  Disc, 
  Package,
  Battery,
  Fingerprint,
  Database,
  Usb,
  ShieldCheck,
  Video,
  BadgeCheck,
  Key,
  Maximize,
  Code,
  FileBadge,
  Receipt,
  Stethoscope,
  GanttChart,
  Wrench,
  LucideIcon
} from 'lucide-react'
import { Badge } from '../ui/badge'
import useDashboardStore from '@/store/useDashboardStore';

// Icon mapping for different categories
const categoryIcons:Record<string, { icon: LucideIcon ; color: string }>  = {
  // Computing Devices
  laptops: { icon: Laptop, color: "text-blue-500" },
  desktops: { icon: Monitor, color: "text-purple-500" },
  servers: { icon: Server, color: "text-amber-500" },
  phones: { icon: Smartphone, color: "text-green-500" },
  tablets: { icon: Smartphone, color: "text-emerald-500" },
  workstations: { icon: Monitor, color: "text-indigo-600" },
  
  // Output Devices
  printers: { icon: Printer, color: "text-red-500" },
  scanners: { icon: Printer, color: "text-orange-500" },
  projectors: { icon: Monitor, color: "text-amber-600" },
  displays: { icon: Monitor, color: "text-blue-600" },
  
  // Networking Equipment
  networking: { icon: HardDrive, color: "text-indigo-500" },
  routers: { icon: WifiIcon, color: "text-cyan-500" },
  switches: { icon: HardDrive, color: "text-blue-400" },
  modems: { icon: WifiIcon, color: "text-teal-500" },
  firewalls: { icon: HardDrive, color: "text-red-600" },
  accesspoints: { icon: WifiIcon, color: "text-sky-500" },
  
  // Cables & Connectivity
  cables: { icon: Cable, color: "text-yellow-500" },
  adapters: { icon: Cable, color: "text-orange-400" },
  dongles: { icon: Cable, color: "text-amber-400" },
  
  // Communication Equipment
  voip: { icon: Smartphone, color: "text-slate-500" },
  telephones: { icon: Smartphone, color: "text-gray-500" },
  headsets: { icon: Headphones, color: "text-pink-500" },
  webcams: { icon: Headphones, color: "text-green-600" },
  conferencing: { icon: Smartphone, color: "text-purple-600" },
  
  // Input Devices
  keyboards: { icon: Keyboard, color: "text-emerald-500" },
  mice: { icon: Mouse, color: "text-orange-500" },
  trackpads: { icon: Mouse, color: "text-yellow-600" },
  biometric: { icon: Fingerprint, color: "text-blue-700" },
  
  // Storage
  storage: { icon: Disc, color: "text-violet-500" },
  harddrives: { icon: HardDrive, color: "text-violet-600" },
  ssd: { icon: Disc, color: "text-purple-400" },
  nas: { icon: Database, color: "text-indigo-400" },
  usb: { icon: Usb, color: "text-blue-300" },
  
  // Power Equipment
  power: { icon: Battery, color: "text-yellow-600" },
  ups: { icon: Battery, color: "text-amber-500" },
  powerstrips: { icon: Cable, color: "text-gray-400" },
  generators: { icon: Battery, color: "text-orange-600" },
  
  // Security Equipment
  security: { icon: ShieldCheck, color: "text-red-500" },
  cameras: { icon: Video, color: "text-blue-500" },
  badges: { icon: BadgeCheck, color: "text-green-600" },
  keycards: { icon: Key, color: "text-yellow-500" },
  
  // Accessories
  docks: { icon: Cable, color: "text-gray-600" },
  stands: { icon: Maximize, color: "text-slate-400" },
  mounts: { icon: Maximize, color: "text-gray-500" },
  cases: { icon: Package, color: "text-blue-400" },
  
  // Software/Licenses
  software: { icon: Code, color: "text-blue-600" },
  licenses: { icon: FileBadge, color: "text-green-400" },
  subscriptions: { icon: Receipt, color: "text-purple-500" },
  
  // Specialized Equipment
  audiovisual: { icon: Video, color: "text-red-400" },
  medical: { icon: Stethoscope, color: "text-green-500" },
  testing: { icon: GanttChart, color: "text-amber-400" },
  tools: { icon: Wrench, color: "text-gray-600" },
  
  // Default icon for any category not in this mapping
  default: { icon: Package, color: "text-gray-500" }
};

const AssetCategories = () => {
  const { assetCategories,initialize } = useDashboardStore();

  useEffect(()=>{
    if(!assetCategories){
      initialize();
    }
  },[])
  
  // Function to get the icon component and color for a category
  const getCategoryIcon = (categoryName:string) => {
    // Convert to lowercase for matching
    const normalizedName = categoryName.toLowerCase();
    
    // First try direct match (without spaces)
    const directMatch = categoryIcons[normalizedName.replace(/\s+/g, '')];
    if (directMatch) return directMatch;
    
    // If no direct match, check if the name contains keywords
    for (const [key, value] of Object.entries(categoryIcons)) {
      // Skip the default entry
      if (key === 'default') continue;
      
      // Check if the category name contains the key (singular or plural forms)
      const singularKey = key.endsWith('s') ? key.slice(0, -1) : key;
      if (normalizedName.includes(singularKey) || normalizedName.includes(key)) {
        return value;
      }
    }
    
    // If no matches found, return default
    return categoryIcons.default;
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Asset Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {assetCategories &&  assetCategories.map((category,index) => {
          const { icon: IconComponent, color } = getCategoryIcon(category.name);
          
          return (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <IconComponent size={32} className={`${color} mb-2`} />
                <h3 className="font-medium">{category.name}</h3>
                <Badge variant="secondary" className="mt-1">{category.count}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AssetCategories;