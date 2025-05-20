// app/page.tsx
'use client';

import { useState, useEffect } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { InventoryOverview } from '@/components/inventory/inventory-overview';
import { AssetList } from '@/components/inventory/asset-list';
import useAssetStore from '@/store/useAssetStore';
import { IAsset } from '@/interfaces/IAsset';

export default function Inventory() {

  const [error, ] = useState<string | null>(null);
  const {assets, inventory:overview,initalize,isLoading:loading} = useAssetStore()


  useEffect(() => {
    

    if(!assets || !overview){
      initalize();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">IT Asset Management</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assets">All Assets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {overview && <InventoryOverview overview={overview} />}
        </TabsContent>
        
        <TabsContent value="assets">
          <Card className="p-4">
            <AssetList assets={assets as IAsset[]} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}