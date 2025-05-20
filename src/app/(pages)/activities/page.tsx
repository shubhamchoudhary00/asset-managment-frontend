"use client"
import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { 
    ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Tabs,  TabsList, TabsTrigger } from "@/components/ui/tabs";

import useAssetStore from "@/store/useAssetStore";
import ActivityHeader from "@/components/recent-activity/header";
import FilterSection from "@/components/recent-activity/filter";
import ActivityDialog from "@/components/recent-activity/activity-dialog";
import { IActivity } from "@/interfaces/IActivity";
import Activities from "@/components/recent-activity/activity-card";
import { generateActivities } from "@/lib/utils";




export default function RecentActivities() {
  // State for data and filters
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAssetType, setFilterAssetType] = useState<string>("all");
  const [filterActionType, setFilterActionType] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [filterDateRange, setFilterDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [sortBy, ] = useState<string>("timestamp");
  const [sortOrder, ] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");

  const {assets,initalize}=useAssetStore();



  useEffect(()=>{
    if(!assets){
        initalize();
    }
    if(assets){
      console.log("assets",assets);
      const activities = generateActivities(assets);
      setActivities(activities);
    }
  },[assets]);

  // Extract unique values for filter dropdowns

  // Simulate loading data effect
  useEffect(() => {
    // Simulate initial data loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Simulate refresh action


  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterAssetType("all");
    setFilterActionType("all");
    setFilterDepartment("all");
    setFilterLocation("all");
    setFilterDateRange({});
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterAssetType, filterActionType, filterDepartment, filterLocation, filterDateRange]);

  // Memoized filtered activities
  const filteredActivities = useMemo(() => {
    let filtered = activities;
    
    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(activity => activity.actionType === activeTab);
    }
    
    // Apply search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.serialNumber.toLowerCase().includes(lowerTerm) ||
        activity.assetName.toLowerCase().includes(lowerTerm) ||
        activity.user.toLowerCase().includes(lowerTerm) ||
        activity.department.toLowerCase().includes(lowerTerm) ||
        (activity.notes && activity.notes.toLowerCase().includes(lowerTerm))
      );
    }
    
    // Apply asset type filter
    if (filterAssetType !== "all") {
      filtered = filtered.filter(activity => activity.assetType.toLowerCase() === filterAssetType.toLowerCase());
    }
    
    // Apply action type filter
    if (filterActionType !== "all") {
      filtered = filtered.filter(activity => activity.actionType === filterActionType);
    }
    
    // Apply department filter
    if (filterDepartment !== "all") {
      filtered = filtered.filter(activity => activity.department.toLowerCase() === filterDepartment.toLowerCase());
    }
    
    // Apply location filter
    if (filterLocation !== "all") {
      filtered = filtered.filter(activity => activity.location.toLowerCase() === filterLocation.toLowerCase());
    }
    
    // Apply date range filter
    if (filterDateRange.from || filterDateRange.to) {
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        
        if (filterDateRange.from && filterDateRange.to) {
          return activityDate >= filterDateRange.from && activityDate <= filterDateRange.to;
        } else if (filterDateRange.from) {
          return activityDate >= filterDateRange.from;
        } else if (filterDateRange.to) {
          return activityDate <= filterDateRange.to;
        }
        
        return true;
      });
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === "timestamp") {
        return sortOrder === "desc" 
          ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      } else if (sortBy === "assetName") {
        return sortOrder === "desc"
          ? b.assetName.localeCompare(a.assetName)
          : a.assetName.localeCompare(b.assetName);
      } else if (sortBy === "assetType") {
        return sortOrder === "desc"
          ? b.assetType.localeCompare(a.assetType)
          : a.assetType.localeCompare(b.assetType);
      } else if (sortBy === "user") {
        return sortOrder === "desc"
          ? b.user.localeCompare(a.user)
          : a.user.localeCompare(b.user);
      }
      return 0;
    });
  }, [
    activities, 
    searchTerm, 
    filterAssetType, 
    filterActionType, 
    filterDepartment, 
    filterLocation, 
    filterDateRange,
    sortBy,
    sortOrder,
    activeTab
  ]);
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  // Function to handle page change
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };






  // Function to render page buttons
  const renderPaginationButtons = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i + 1}
          variant={currentPage === i + 1 ? "default" : "outline"}
          size="sm"
          onClick={() => paginate(i + 1)}
          className="w-8 h-8 p-0"
        >
          {i + 1}
        </Button>
      ));
    }
    
    // More complex pagination with ellipsis
    const buttons = [];
    
    // Always show first page
    buttons.push(
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "outline"}
        size="sm"
        onClick={() => paginate(1)}
        className="w-8 h-8 p-0"
      >
        1
      </Button>
    );
    
    // Show ellipsis if current page is more than 3
    if (currentPage > 3) {
      buttons.push(
        <span key="ellipsis1" className="px-2">
          ...
        </span>
      );
    }
    
    // Show current page and one before/after
    const pageRange = [];
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last page as they're always shown
      pageRange.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => paginate(i)}
          className="w-8 h-8 p-0"
        >
          {i}
        </Button>
      );
    }
    buttons.push(...pageRange);
    
    // Show ellipsis if current page is less than total pages - 2
    if (currentPage < totalPages - 2) {
      buttons.push(
        <span key="ellipsis2" className="px-2">
          ...
        </span>
      );
    }
    
    // Always show last page
    if (totalPages > 1) {
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => paginate(totalPages)}
          className="w-8 h-8 p-0"
        >
          {totalPages}
        </Button>
      );
    }
    
    return buttons;
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg border-0">
        <ActivityHeader itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} />
        
        <div className="px-6 py-4 border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-2">
              <TabsTrigger value="all">All Activities</TabsTrigger>
              <TabsTrigger value="assigned">Assigned</TabsTrigger>
              <TabsTrigger value="returned">Returned</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="added">Added</TabsTrigger>
              <TabsTrigger value="reserved">Reserved</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Search and Filter Section */}
          <FilterSection activities={activities} />
        </div>

        <Activities filterActionType={filterActionType} filterAssetType={filterAssetType} filterDepartment={filterDepartment}
        filterDateRange={filterDateRange} filterLocation={filterLocation} filteredActivities={filteredActivities}
        clearAllFilters={clearAllFilters} currentPage={currentPage} itemsPerPage={itemsPerPage}
        setSelectedActivity={setSelectedActivity} setIsDetailsOpen={setIsDetailsOpen} />

        {/* Pagination */}
        {!isLoading && filteredActivities.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t">
            <p className="text-sm text-gray-600 mb-4 md:mb-0">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredActivities.length)} of{" "}
              {filteredActivities.length} activities
            </p>
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {renderPaginationButtons()}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Activity Details Dialog */}
     <ActivityDialog selectedActivity={selectedActivity} isDetailsOpen={isDetailsOpen} setIsDetailsOpen={setIsDetailsOpen} />
    </div>
  );
}