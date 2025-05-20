// Types for Asset Management System

export interface Assignment {
    assignedUser: string;
    assignmentDate: Date | string;
    assignmentNotes?: string;
  }
  
  export interface Asset {
    _id: string;
    assetType: string;
    assetName: string;
    serialNumber: string;
    manufacturer: string;
    model: string;
    purchaseDate?: string;
    warranty?: number;
    status: 'available' | 'assigned' | 'maintenance' | 'reserved';
    location?: string;
    department?: string;
    notes?: string;
    trackable: boolean;
    value?: number;
    condition: 'new' | 'good' | 'fair' | 'poor';
    ipAddress?: string;
    macAddress?: string;
    subnetMask?: string;
    gateway?: string;
    isDhcp: boolean;
    images: string[];
    assignment?: Assignment;
    assignedBy?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AssetOverview {
    byStatus: { _id: string; count: number }[];
    byDepartment: { _id: string; count: number }[];
    byLocation: { _id: string; count: number }[];
    byAssetType: { _id: string; count: number }[];
    totalValue: number;
  }