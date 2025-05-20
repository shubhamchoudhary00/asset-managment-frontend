"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Activity, Database, PieChart, Plus, Settings, Users } from 'lucide-react'
import { AssetAddModal } from '../modals/add-asset-modal'
import { useRouter } from 'next/navigation'

const QuickActions = () => {
    const [open,setOpen]=useState(false)
    const router=useRouter();
  return (
    <>
    <AssetAddModal open={open} onOpenChange={()=>setOpen(false)} />
     <Card>
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
      <CardDescription>Common tasks and reports</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Button variant="outline" onClick={() => setOpen(true)}  className="h-auto flex flex-col items-center py-4 px-2">
          <Plus size={20} className="mb-2" />
          <span className="text-xs text-center">New Asset</span>
        </Button>
        <Button variant="outline" onClick={()=>router.push("/assets")} className="h-auto cursor-pointer flex flex-col items-center py-4 px-2">
          <Users size={20} className="mb-2" />
          <span className="text-xs text-center">Assign Asset</span>
        </Button>
        <Button variant="outline" onClick={()=>router.push("/maintenance")} className="h-auto cursor-pointer flex flex-col items-center py-4 px-2">
          <Activity size={20} className="mb-2" />
          <span className="text-xs text-center">Maintenance</span>
        </Button>
        <Button variant="outline" onClick={()=>router.push("/inventory")} className="h-auto cursor-pointer flex flex-col items-center py-4 px-2">
          <Database size={20} className="mb-2" />
          <span className="text-xs text-center">Inventory</span>
        </Button>
        <Button variant="outline" className="h-auto flex flex-col items-center py-4 px-2">
          <PieChart size={20} className="mb-2" />
          <span className="text-xs text-center">Reports</span>
        </Button>
        <Button variant="outline" className="h-auto flex flex-col items-center py-4 px-2">
          <Settings size={20} className="mb-2" />
          <span className="text-xs text-center">Settings</span>
        </Button>
      </div>
    </CardContent>
  </Card>
    </>
   
  )
}

export default QuickActions
