import { ArrowUpDown, Calendar, Filter, Search, X } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import {Calendar as CalendarComponent} from '@/components/ui/calendar'
import { IActivity } from '@/interfaces/IActivity'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'

interface Props{
    activities:IActivity[]
}
const FilterSection = ({activities}:Props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterAssetType, setFilterAssetType] = useState<string>("all");
    const [filterActionType, setFilterActionType] = useState<string>("all");
    const [filterDepartment, setFilterDepartment] = useState<string>("all");
    const [filterLocation, setFilterLocation] = useState<string>("all");
    const [filterDateRange, setFilterDateRange] = useState<{ from?: Date; to?: Date }>({});
    const [sortBy, setSortBy] = useState<string>("timestamp");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");


    const getActiveFilterCount = () => {
        let count = 0;
        if (filterAssetType !== "all") count++;
        if (filterActionType !== "all") count++;
        if (filterDepartment !== "all") count++;
        if (filterLocation !== "all") count++;
        if (filterDateRange.from || filterDateRange.to) count++;
        return count;
      };

    
  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterAssetType("all");
    setFilterActionType("all");
    setFilterDepartment("all");
    setFilterLocation("all");
    setFilterDateRange({});
  };

    // Extract unique values for filter dropdowns
    const assetTypes = useMemo(() => {
      return [...new Set(activities.map(activity => activity.assetType))];
    }, [activities]);
    
    const departments = useMemo(() => {
      return [...new Set(activities.map(activity => activity.department))];
    }, [activities]);
    
    const locations = useMemo(() => {
      return [...new Set(activities.map(activity => activity.location))];
    }, [activities]);
      
    const handleSelect = (range: DateRange | undefined) => {
        if (range) {
          setFilterDateRange({ from: range.from, to: range.to });
        } else {
          setFilterDateRange({});
        }
      };
  return (
    <div className="mb-4 flex flex-col md:flex-row gap-4">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <Input
        placeholder="Search by asset name, serial number, user..."
        className="pl-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative h-10">
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {getActiveFilterCount()}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Filter Activities</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 text-xs"
              >
                Clear all
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Asset Type</label>
              <Select value={filterAssetType} onValueChange={setFilterAssetType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {assetTypes.map(type => (
                    <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Action Type</label>
              <Select value={filterActionType} onValueChange={setFilterActionType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="added">Added</SelectItem>
                  <SelectItem value="updated">Updated</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept.charAt(0).toUpperCase() + dept.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc.charAt(0).toUpperCase() + loc.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {filterDateRange.from ? (
                        filterDateRange.to ? (
                          <>
                            {format(filterDateRange.from, "LLL dd, y")} - {" "}
                            {format(filterDateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(filterDateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    selected={{
                        from: filterDateRange.from ?? new Date(),
                        to: filterDateRange.to ?? new Date(),
                    }}
                    onSelect={handleSelect}
                    numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                {(filterDateRange.from || filterDateRange.to) && (
                  <Button 
                    variant="ghost" 
                    className="h-8" 
                    onClick={() => setFilterDateRange({})}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear dates
                  </Button>
                )}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-10">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sort
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timestamp">Date</SelectItem>
                  <SelectItem value="assetName">Asset Name</SelectItem>
                  <SelectItem value="assetType">Asset Type</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Order</label>
              <div className="flex space-x-2">
                <Button 
                  variant={sortOrder === "desc" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setSortOrder("desc")}
                >
                  Descending
                </Button>
                <Button 
                  variant={sortOrder === "asc" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setSortOrder("asc")}
                >
                  Ascending
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </div>
  )
}

export default FilterSection
