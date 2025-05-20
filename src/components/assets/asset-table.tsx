import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { FileEdit } from 'lucide-react'
import { IAsset } from '@/interfaces/IAsset'

const AssetTable = ({ filteredAssets, handleAssignClick }: { filteredAssets: IAsset[] | null, handleAssignClick: (data: string) => void }) => {
  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-'; // Handle invalid dates
    return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead>Manufacturer</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Assigned On</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAssets && filteredAssets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} className="text-center py-4">
                No assets found
              </TableCell>
            </TableRow>
          ) : (
            filteredAssets && filteredAssets.map((asset) => (
              <TableRow key={asset._id}>
                <TableCell>{asset.assetName}</TableCell>
                <TableCell>{asset.assetType}</TableCell>
                <TableCell>{asset.serialNumber || '-'}</TableCell>
                <TableCell>{asset.manufacturer}</TableCell>
                <TableCell>{asset.model}</TableCell>
                <TableCell>
                  <span className={`capitalize ${
                    asset.status === 'available' ? 'text-green-600' :
                    asset.status === 'assigned' ? 'text-blue-600' :
                    asset.status === 'maintenance' ? 'text-orange-600' :
                    'text-purple-600'
                  }`}>
                    {asset.status}
                  </span>
                </TableCell>
                <TableCell>{asset.location?.toLocaleUpperCase() || '-'}</TableCell>
                <TableCell>{asset.department?.toLocaleUpperCase() || '-'}</TableCell>
                <TableCell>{asset.assignment?.assignedUser || '-'}</TableCell>
                <TableCell>{formatDate(asset.assignment?.assignmentDate)}</TableCell>
                <TableCell>{asset.condition}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAssignClick(asset._id!)}
                    className="gap-1"
                  >
                    <FileEdit size={16} />
                    Assign
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default AssetTable