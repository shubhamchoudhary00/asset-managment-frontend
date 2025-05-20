"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { ChevronDown, Plus } from 'lucide-react'
import { AssetAddModal } from '../modals/add-asset-modal'

const Header = () => {
      const [open, setOpen] = useState(false);
    
  return (
    <>
    <AssetAddModal open={open} onOpenChange={setOpen} />
    
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Asset Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Overview of all IT assets and inventory</p>
              </div>
              <div className="flex mt-4 md:mt-0 gap-2">
                <Button variant="outline" className="gap-1 text-sm">
                  Export
                  <ChevronDown size={16} />
                </Button>
                <Button onClick={() => setOpen(true)} className="gap-1">
                <Plus size={16} />
                Add Asset
              </Button>
              </div>
            </div>
    </>
    
  )
}

export default Header
