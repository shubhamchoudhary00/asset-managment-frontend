import { IActivity } from '@/interfaces/IActivity'
import { Cpu, HardDrive, Keyboard, Laptop, Monitor, Printer, Server, Smartphone } from 'lucide-react';
import React from 'react'

interface Props{
    activity:IActivity;
    viewActivityDetails:(data:IActivity)=>void
}

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

const ActivityCard = ({activity,viewActivityDetails}:Props) => {
  return (
    <div 
     
    className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
    onClick={() => viewActivityDetails(activity)}
  >
    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
      {getAssetIcon(activity.assetType)}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm truncate">
            {activity.assetName} ({activity.serialNumber})
          </h4>
          <ActionBadge actionType={activity.actionType} />
        </div>
        <span className="text-xs text-gray-500">
        {activity.timestamp}
        </span>
      </div>
      <div className="mt-1">
        <p className="text-sm text-gray-700">
          <span className="font-medium">{activity.user}</span> • {activity.department}
        </p>
      </div>
      {activity.notes && (
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{activity.notes}</p>
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        {activity.location && (
          <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
            {activity.location}
          </span>
        )}
        <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
          By: {activity.performedBy}
        </span>
      </div>
    </div>
  </div>
  )
}

export default ActivityCard
