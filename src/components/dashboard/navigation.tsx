"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Bell, Search, Settings } from 'lucide-react'
import { Input } from '../ui/input'

const Navigation = () => {
      const [searchQuery, setSearchQuery] = useState('');
    
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center lg:hidden">
              <Button variant="ghost" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                  <line x1="4" x2="20" y1="12" y2="12"></line>
                  <line x1="4" x2="20" y1="6" y2="6"></line>
                  <line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
              </Button>
              <h2 className="text-lg font-bold ml-2 lg:hidden">AssetTrack</h2>
            </div>
            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input 
                  type="search" 
                  placeholder="Search assets, users or tags..." 
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell size={20} />
                <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
              </Button>
              <Button variant="ghost" size="icon">
                <Settings size={20} />
              </Button>
            </div>
          </div>
        </header>
  )
}

export default Navigation
