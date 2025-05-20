"use client"
import { useState } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import { IAsset } from '@/interfaces/IAsset';

interface AssetListProps {
  assets: IAsset[];
}

const statusColors = {
  available: 'bg-green-500',
  assigned: 'bg-blue-500',
  maintenance: 'bg-yellow-500',
  reserved: 'bg-purple-500',
  returned: 'bg-gray-500' // add this line
};

export function AssetList({ assets }: AssetListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all'); // New state for location filter
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique values for filter dropdowns
  const assetTypes = Array.from(new Set(assets.map(asset => asset.assetType)));
  const departments = Array.from(new Set(assets.filter(asset => asset.department).map(asset => asset.department as string)));
  const locations = Array.from(new Set(assets.filter(asset => asset.location).map(asset => asset.location as string))); // New: unique locations
  const statuses = ['available', 'assigned', 'maintenance', 'reserved'];
  
  // Filter assets based on search term and filters
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = searchTerm === '' || 
      asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset?.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.assignment?.assignedUser && asset.assignment.assignedUser.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || asset.status === filterStatus;
    const matchesType = filterType === 'all' || asset.assetType === filterType;
    const matchesDepartment = filterDepartment === 'all' || asset.department === filterDepartment;
    const matchesLocation = filterLocation === 'all' || asset.location === filterLocation; // New: location filter
    
    return matchesSearch && matchesStatus && matchesType && matchesDepartment && matchesLocation;
  });
  
  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      console.log(e)
      return 'Invalid Date';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search assets..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" /> 
          Filters
        </Button>
      </div>
      
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          <div className="w-full sm:w-auto">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {assetTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto">
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>
                    {dept.charAt(0).toUpperCase() + dept.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto">
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location.charAt(0).toUpperCase() + location.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => {
              setFilterStatus('all');
              setFilterType('all');
              setFilterDepartment('all');
              setFilterLocation('all'); // New: reset location filter
              setSearchTerm('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <TableRow key={asset._id}>
                <TableCell>
                  <Link href={`/assets/${asset._id}`} className="font-medium hover:underline">
                    {asset.assetName}
                  </Link>
                  <div className="text-xs text-gray-500">{asset.manufacturer} {asset.model}</div>
                </TableCell>
                <TableCell>{asset.assetType}</TableCell>
                <TableCell>{asset.serialNumber}</TableCell>
                <TableCell>
                  <Badge className={`${statusColors[asset.status]}`}>{asset.status}</Badge>
                </TableCell>
                <TableCell>{asset.location || 'N/A'}</TableCell>
                <TableCell>{asset.assignment?.assignedUser || 'Unassigned'}</TableCell>
                <TableCell>{formatDate(asset.updatedAt)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No assets found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <div className="text-sm text-gray-500">
        Showing {filteredAssets.length} of {assets.length} assets
      </div>
    </div>
  );
}