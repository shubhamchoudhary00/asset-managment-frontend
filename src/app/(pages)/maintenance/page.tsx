"use client"
import { useState, useEffect } from 'react';

import { AssetAssignModal } from '@/components/modals/assign-model';
import { IAsset } from '@/interfaces/IAsset';
import SearchBar from '@/components/assets/search';
import AssetTable from '@/components/assets/asset-table';
import useAssetStore from '@/store/useAssetStore';
import { Loader2 } from 'lucide-react';


// Interface for assets (same as provided)

export default function MaintenanceListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAssets, setFilteredAssets] = useState<IAsset[] | null>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const {assets,isLoading,initalize}=useAssetStore();
  // Simulate fetching assets from API
  useEffect(() => {
    // Replace with actual API call, e.g., fetch('/api/assets')
    initalize();
  }, [assets]);

  // Handle search
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = assets && assets.filter(asset => 
      asset.status==="maintenance" &&
     ( asset.assetName.toLowerCase().includes(lowerQuery) ||
      (asset.serialNumber && asset.serialNumber.toLowerCase().includes(lowerQuery)) ||
      asset.manufacturer.toLowerCase().includes(lowerQuery) ||
      asset.model.toLowerCase().includes(lowerQuery) ||
      (asset.assignment?.assignedUser && asset.assignment.assignedUser.toLowerCase().includes(lowerQuery)))
    );
    setFilteredAssets(filtered);
  }, [searchQuery, assets]);

  // Handle opening assign modal
  const handleAssignClick = (assetId: string) => {
    setSelectedAssetId(assetId);
    setIsAssignModalOpen(true);
  };

  if(isLoading){
    return (
        <div className='h-screen w-full flex items-center justify-center'>
            <Loader2 className='animate-spin' />

        </div>
    )
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Asset Inventory</h1>

      {/* Search Bar */}
     <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Asset Table */}
     <AssetTable filteredAssets={filteredAssets} handleAssignClick={handleAssignClick} />

      {/* Assign Modal */}
      {selectedAssetId && (
        <AssetAssignModal
          open={isAssignModalOpen}
          onOpenChange={(open) => {
            setIsAssignModalOpen(open);
            if (!open) setSelectedAssetId(null);
          }}
          assetId={selectedAssetId}
        />
      )}
    </div>
  );
}