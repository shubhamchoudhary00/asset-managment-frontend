"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import useAssetStore from '@/store/useAssetStore'
import { BarChart } from 'lucide-react'

const AssetStatus = () => {
  const {inventory, initalize} = useAssetStore();
  const [total, setTotal] = useState(0);
  const [, setTotalValue] = useState(0);

  useEffect(() => {
    if(!inventory){
      initalize();
    }

    if(inventory){
      const ttl = inventory.byStatus.reduce((acc, cum) => acc + cum.count, 0);
      setTotal(ttl);
      
      // Calculate total asset value if available in the inventory data
      if (inventory.totalValue) {
        setTotalValue(inventory.totalValue);
      } else {
        // Fallback calculation if needed
        // This assumes each asset has a value property. Adjust according to your actual data structure
        const value = inventory.byStatus.reduce((acc, item) => acc + (item.count || 0), 0);
        setTotalValue(value);
      }
    }
  }, [inventory, initalize]);

  const getProgress = (value:number) => {
    return total > 0 ? (value / total) * 100 : 0;
  }

  // Format currency with commas and 2 decimal places


  return (
    <Card className="lg:col-span-1 flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex gap-x-2 items-center">
            Asset Status <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">{total}</span>
          </CardTitle>
        </div>
        <CardDescription>Current allocation status</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
     

        {/* Status Progress Bars */}
        <div className="space-y-4">
          <div className="flex items-center mb-2">
            <BarChart size={16} className="mr-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Status Distribution</span>
          </div>
          
          {inventory && inventory.byStatus.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{item._id[0].toUpperCase() + item._id.slice(1)}</span>
                <div className="flex gap-x-2 items-center">
                  <span className="text-gray-500">{item.count}</span>
                  <span className="text-xs text-gray-400">({getProgress(item.count).toFixed(1)}%)</span>
                </div>
              </div>
              <Progress 
                value={getProgress(item.count)} 
                className="h-2 mt-1" 
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default AssetStatus