import React from 'react'
import { CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Button } from '../ui/button'
import { RefreshCw } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import useAssetStore from '@/store/useAssetStore'

interface Props{
  itemsPerPage:number,
  setItemsPerPage:(data:number)=>void;
}

const ActivityHeader = ({itemsPerPage,setItemsPerPage}:Props) => {
    const {refetch}=useAssetStore()
    const handleRefresh = async() => {
        await refetch();
      };
  return (
    <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg">
    <div className="flex justify-between items-center">
      <div>
        <CardTitle className="text-xl font-bold">Asset Activity Log</CardTitle>
        <CardDescription className="text-sm">Track all asset movements and status changes</CardDescription>
      </div>
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="5 items" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 items</SelectItem>
            <SelectItem value="10">10 items</SelectItem>
            <SelectItem value="20">20 items</SelectItem>
            <SelectItem value="50">50 items</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </CardHeader>
  )
}

export default ActivityHeader
