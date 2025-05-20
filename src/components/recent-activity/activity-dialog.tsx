import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Cpu, HardDrive, Keyboard, Laptop, Monitor, Printer, Server, Smartphone } from 'lucide-react';
import { IActivity } from '@/interfaces/IActivity';
import { format } from 'date-fns';


  const getAssetIcon = (assetType: string) => {
    switch (assetType.toLowerCase()) {
      case 'laptop':
        return <Laptop className="h-5 w-5" />;
      case 'monitor':
        return <Monitor className="h-5 w-5" />;
      case 'server':
        return <Server className="h-5 w-5" />;
      case 'smartphone':
        return <Smartphone className="h-5 w-5" />;
      case 'printer':
        return <Printer className="h-5 w-5" />;
      case 'desktop':
        return <Cpu className="h-5 w-5" />;
      case 'storage':
        return <HardDrive className="h-5 w-5" />;
      default:
        return <Keyboard className="h-5 w-5" />;
    }
  };
const ActionBadge = ({ actionType }: { actionType: string }) => {
    // const variant = getBadgeVariant(actionType);
    
    // Custom class mapping for more visually distinct badges
    const customClasses = {
      'assigned': 'bg-blue-100 text-blue-800 border-blue-200',
      'returned': 'bg-gray-100 text-gray-800 border-gray-200',
      'maintenance': 'bg-amber-100 text-amber-800 border-amber-200',
      'added': 'bg-green-100 text-green-800 border-green-200',
      'updated': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'reserved': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${customClasses[actionType.toLowerCase() as keyof typeof customClasses] || 'bg-blue-100 text-blue-800'}`}>
        {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
      </span>
    );
  };


interface Props{
    selectedActivity:IActivity | null;
    isDetailsOpen:boolean;
    setIsDetailsOpen:(data:boolean)=>void;
}

const ActivityDialog = ({selectedActivity,isDetailsOpen,setIsDetailsOpen}:Props) => {
    
  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return 'N/A'; // Handle undefined or null
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Invalid Date'; // Handle invalid date
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    } catch (error) {
      console.log(error)
      return 'Invalid Date'; // Handle any parsing errors
    }
  };

  return (
    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Activity Details</DialogTitle>
        <DialogDescription>
          Complete information about this asset activity
        </DialogDescription>
      </DialogHeader>
      
      {selectedActivity && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-3 rounded-lg">
              {getAssetIcon(selectedActivity.assetType)}
            </div>
            <div>
              <h3 className="font-semibold">{selectedActivity.assetName}</h3>
              <p className="text-sm text-gray-500">{selectedActivity.serialNumber}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Action</p>
              <p className="font-medium">
                <ActionBadge actionType={selectedActivity.actionType} />
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Date & Time</p>
              <p className="font-medium">
              {formatTimestamp(selectedActivity.timestamp)}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">User</p>
              <p className="font-medium">{selectedActivity.user}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Department</p>
              <p className="font-medium">{selectedActivity.department}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="font-medium">{selectedActivity.location}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Performed By</p>
              <p className="font-medium">{selectedActivity.performedBy}</p>
            </div>
          </div>
          
          {selectedActivity.notes && (
            <div>
              <p className="text-xs text-gray-500">Notes</p>
              <p className="text-sm bg-gray-50 p-3 rounded mt-1">{selectedActivity.notes}</p>
            </div>
          )}
          
          <div className="border-t pt-4">
            <p className="text-xs text-gray-500">Asset ID</p>
            <p className="text-sm font-mono">{selectedActivity.assetId}</p>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
  )
}

export default ActivityDialog
