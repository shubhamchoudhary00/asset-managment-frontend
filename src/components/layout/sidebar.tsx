"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { 
  Activity, 
  ArrowRight, 
  BarChart, 
  Building, 
  Calendar, 
  CatIcon, 
  ChevronLeft, 
  ChevronRight, 
  Laptop, 
  LocationEdit, 
  LogOut, 
  Menu, 
  PieChart, 
  Settings, 
  Users, 
  X
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import CategoryModal from '../modals/add-category'
import LocationModal from '../modals/add-location'
import DepartmentModal from '../modals/add-department'
import { useRouter } from 'next/navigation'

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openCategory, setOpenCategory] = useState<boolean>(false);
  const [openLocation, setOpenLocation] = useState<boolean>(false);
  const [openDepartment, setOpenDepartment] = useState<boolean>(false);
  const router=useRouter();

  // Check if we're on mobile on component mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart,onclick:()=>router.push("/dashboard") },
    { id: 'assets', label: 'Assets', icon: Laptop,onclick:()=>router.push("/assets") },
    { id: 'category', label: 'Add Category', icon: CatIcon, onclick: () => setOpenCategory(true) },
    { id: 'department', label: 'Add Department', icon: Building, onclick: () => setOpenDepartment(true) },
    { id: 'location', label: 'Add Location', icon: LocationEdit, onclick: () => setOpenLocation(true) },
    { id: 'users', label: 'Users', icon: Users,onclick:()=>router.push("/users") },
    { id: 'activities', label: 'Activities', icon: Activity,onclick:()=>router.push("/activities") },
    { id: 'maintenance', label: 'Maintenance', icon: Calendar,onclick:()=>router.push("/maintenance") },
    { id: 'reports', label: 'Reports', icon: BarChart,onclick:()=>router.push("/reports") },
    { id: 'settings', label: 'Settings', icon: Settings,onclick:()=>router.push("/settings") },
    { id: 'logout', label: 'Logout', icon: ArrowRight , onclick: ()=>{localStorage.clear(); router.push("/")}}
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleNavClick = (item: { id: string; onclick?: () => void }) => {
    setActiveItem(item.id);
    if (item.onclick) {
      item.onclick();
    }
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className={`hidden h-screen lg:flex flex-col ${collapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out relative shadow-sm`}>
      {/* Toggle button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">AssetTrack</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">IT Asset Management</p>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">AT</h2>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <TooltipProvider>
          {navItems.map(item => (
            <Tooltip key={item.id} delayDuration={0}>
              <TooltipTrigger asChild>
                <Button 
                  variant={activeItem === item.id ? "default" : "ghost"} 
                  className={`w-full justify-${collapsed ? 'center' : 'start'} gap-2 font-normal hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                    activeItem === item.id ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300'
                  }`}
                  onClick={() => handleNavClick(item)}
                >
                  <item.icon size={18} />
                  {!collapsed && item.label}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="bg-gray-800 text-white">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      
      {/* User profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Avatar>
                  <AvatarImage src="/api/placeholder/32/32" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="bg-gray-800 text-white">
                  <p className="font-medium">Admin User</p>
                  <p className="text-xs text-gray-400">IT Department</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          
          {!collapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-white">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">IT Department</p>
            </div>
          )}
          
          {!collapsed && (
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" title="Logout">
              <LogOut size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar Content
  const MobileSidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header with close button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">AssetTrack</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">IT Asset Management</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)} className="text-gray-600 dark:text-gray-300">
          <X size={18} />
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <Button 
            key={item.id}
            variant={activeItem === item.id ? "default" : "ghost"} 
            className={`w-full justify-start gap-3 py-3 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              activeItem === item.id ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300'
            }`}
            onClick={() => handleNavClick(item)}
          >
            <item.icon size={20} />
            {item.label}
          </Button>
        ))}
      </nav>
      
      {/* User profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/api/placeholder/32/32" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">IT Department</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" title="Logout">
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </div>
  );

  // Mobile Header
  const MobileHeader = () => (
    <div className="lg:hidden sticky top-0 z-10 flex items-center px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-3 text-gray-600 dark:text-gray-300">
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80 lg:hidden">
          <MobileSidebarContent />
        </SheetContent>
      </Sheet>
      <h2 className="text-lg font-bold text-gray-800 dark:text-white">AssetTrack</h2>
    </div>
  );

  return (
    <>
      <MobileHeader />
      <DesktopSidebar />
      <CategoryModal open={openCategory} onOpenChange={setOpenCategory} />
      <LocationModal open={openLocation} onOpenChange={setOpenLocation} />
      <DepartmentModal open={openDepartment} onOpenChange={setOpenDepartment} />
    </>
  )
}

export default Sidebar;