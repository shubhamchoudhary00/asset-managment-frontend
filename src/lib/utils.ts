import { IActivity } from "@/interfaces/IActivity";
import { IAsset } from "@/interfaces/IAsset";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export   const generateActivities = (assets: IAsset[]): IActivity[] => {
    const activities: IActivity[] = [];
    
    // Create activities for each asset
    assets.forEach((asset, index) => {
      // Add activity for creation
      activities.push({
        id: `act-${index}-1`,
        assetId: asset._id ?? "",
        assetType: asset.assetType,
        assetName: asset.assetName,
        serialNumber: asset.serialNumber ?? "",
        actionType: 'added',
        user: 'System',
        department: asset.department ?? "" ,
        location: asset.location ?? "",
        timestamp: asset.createdAt ?? "",
        notes: `New ${asset.assetType} added to inventory`,
        performedBy: asset.assignedBy ?? ""
      });
      
      // Add assignment activity if assigned
      if (asset.status === 'assigned' && asset.assignment) {
        activities.push({
          id: `act-${index}-2`,
          assetId: asset._id ?? "",
          assetType: asset.assetType,
          assetName: asset.assetName,
          serialNumber: asset.serialNumber ?? "",
          actionType: 'assigned',
          user: asset.assignment.assignedUser ?? "",
          department: asset.department ?? "",
          location: asset.location ?? "",
          timestamp: asset.assignment.assignmentDate ?? "",
          notes: asset.assignment.assignmentNotes || `Assigned to ${asset.assignment.assignedUser}`,
          performedBy: asset.assignedBy || 'Admin'
        });
      }
      
      // Add maintenance activity for items in maintenance
      if (asset.status === 'maintenance') {
        activities.push({
          id: `act-${index}-3`,
          assetId: asset._id ?? "",
          assetType: asset.assetType,
          assetName: asset.assetName,
          serialNumber: asset.serialNumber ?? "",
          actionType: 'maintenance',
          user: 'IT Support',
          department: asset.department ?? "",
          location: asset.location ?? "",
          timestamp: asset.updatedAt ?? "",
          notes: asset.notes ?? "",
          performedBy: asset.assignedBy ?? ""
        });
      }
      
      // Add reserved activity for reserved items
      if (asset.status === 'reserved') {
        activities.push({
          id: `act-${index}-4`,
          assetId: asset._id ?? "",
          assetType: asset.assetType,
          assetName: asset.assetName,
          serialNumber: asset.serialNumber ?? "",
          actionType: 'reserved',
          user: 'HR',
          department: asset.department ?? "",
          location: asset.location ?? "",
          timestamp: asset.updatedAt ?? "",
          notes: asset.notes,
          performedBy: asset.assignedBy ?? ""
        });
      }
      // Add retuned activity for returned items
      if (asset.status === 'returned') {
        activities.push({
          id: `act-${index}-4`,
          assetId: asset._id ?? "",
          assetType: asset.assetType,
          assetName: asset.assetName,
          serialNumber: asset.serialNumber ?? "",
          actionType: 'returned',
          user: 'HR',
          department: asset.department ?? "",
          location: asset.location ?? "",
          timestamp: asset.updatedAt ?? "",
          notes: asset.notes,
          performedBy: asset.assignedBy ?? ""
        });
      }
    });
    
    
    
    // Sort activities by timestamp (newest first)
    return activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };