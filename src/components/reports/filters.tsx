import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Filter } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { IAsset } from '@/interfaces/IAsset';
import { Checkbox } from '../ui/checkbox';

export interface FormData {
  dateFrom: string;
  dateTo: string;
  assetType: string;
  status: string;
  department: string;
  location: string;
  conditions: string[];
}

interface Props {
  filters: FormData;
  setFilters: (data: FormData) => void;
  assets: IAsset[];
}

const Filters = ({ filters, setFilters, assets }: Props) => {
  // State to control dialog open/close
  const [isOpen, setIsOpen] = useState(false);

  const handleResetFilters = () => {
    console.log('Current filters:', filters);
    setFilters({
      dateFrom: '',
      dateTo: '',
      assetType: '',
      status: '',
      department: '',
      location: '',
      conditions: [],
    });
  };

  // Dynamic filter options with strict filtering
  const assetTypes = [...new Set(assets.map(asset => asset.assetType).filter(type => type != null && type.trim() !== ''))];
  const departments = [...new Set(assets.map(asset => asset.department).filter(dept => dept != null && dept.trim() !== ''))];
  const locations = [...new Set(assets.map(asset => asset.location).filter(loc => loc != null && loc.trim() !== ''))];
  const statuses = ['available', 'assigned', 'maintenance', 'reserved', 'returned'];
  const conditions = ['new', 'good', 'fair', 'poor'];

  // Log arrays to debug
  console.log('Asset Types:', assetTypes);
  console.log('Departments:', departments);
  console.log('Locations:', locations);
  console.log('Filters:', filters);

  return (
    <div className="flex space-x-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report Filters</DialogTitle>
            <DialogDescription>Apply filters to customize your report data</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Date From</Label>
              <Input
                type="date"
                id="dateFrom"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">Date To</Label>
              <Input
                type="date"
                id="dateTo"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assetType">Asset Type</Label>
              <Select
                value={filters.assetType}
                onValueChange={(value) => setFilters({ ...filters, assetType: value })}
              >
                <SelectTrigger id="assetType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={filters.department ?? ''}
                onValueChange={(value) => setFilters({ ...filters, department: value })}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept, index) => (
                    <SelectItem key={index} value={dept ?? ''}>
                      {(dept ?? '').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={filters.location ?? ''}
                onValueChange={(value) => setFilters({ ...filters, location: value })}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc, index) => (
                    <SelectItem key={index} value={loc ?? ''}>
                      {(loc ?? '').charAt(0).toUpperCase() + (loc ?? '').slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="condition">Condition</Label>
              <div className="flex space-x-4 pt-2">
                {conditions.map((cond) => (
                  <div key={cond} className="flex items-center space-x-2">
                    <Checkbox
                      id={cond}
                      checked={filters.conditions.includes(cond)}
                      onCheckedChange={(checked) => {
                        setFilters({
                          ...filters,
                          conditions: checked
                            ? [...filters.conditions, cond]
                            : filters.conditions.filter((c) => c !== cond),
                        });
                      }}
                    />
                    <label htmlFor={cond} className="capitalize">{cond}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleResetFilters} className="mr-2">
              Reset
            </Button>
            <Button onClick={() => setIsOpen(false)}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Filters;