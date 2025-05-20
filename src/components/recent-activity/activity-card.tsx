import React from 'react'
import { CardContent } from '../ui/card'
import useAssetStore from '@/store/useAssetStore'
import { AlertCircle} from 'lucide-react';
import { Button } from '../ui/button';
import { IActivity } from '@/interfaces/IActivity';
import ActivityCard from './card';




interface Props{
    filteredActivities:IActivity[] ;
    filterAssetType:string;
    filterDepartment:string;
    filterDateRange:{ from?: Date; to?: Date };
    filterLocation:string;
    filterActionType:string;
    clearAllFilters:()=>void;
    currentPage:number;
    itemsPerPage:number;
    setSelectedActivity:(data:IActivity) =>void;
    setIsDetailsOpen:(data:boolean) =>void;
    
}
const Activities = ({filteredActivities,filterActionType,filterAssetType,filterDepartment,filterDateRange,filterLocation,clearAllFilters,currentPage,itemsPerPage,setSelectedActivity,setIsDetailsOpen}:Props) => {
    const {isLoading}=useAssetStore();
    const getActiveFilterCount = () => {
        let count = 0;
        if (filterAssetType !== "all") count++;
        if (filterActionType !== "all") count++;
        if (filterDepartment !== "all") count++;
        if (filterLocation !== "all") count++;
        if (filterDateRange.from || filterDateRange.to) count++;
        return count;
      };
      const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredActivities.slice(indexOfFirstItem, indexOfLastItem);

    const viewActivityDetails = (activity: IActivity) => {
        setSelectedActivity(activity);
        setIsDetailsOpen(true);
      };

  return (
    <CardContent className="p-0">
    {isLoading ? (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    ) : filteredActivities.length === 0 ? (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">No activities found</h3>
        <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or search criteria</p>
        {getActiveFilterCount() > 0 && (
          <Button variant="outline" onClick={clearAllFilters} className="mt-4">
            Clear all filters
          </Button>
        )}
      </div>
    ) : (
      <div className="divide-y">
        {currentItems.map((activity,index) => (
        <ActivityCard key={index} activity={activity} viewActivityDetails={viewActivityDetails} />
        ))}
      </div>
    )}
  </CardContent>
  )
}

export default Activities
