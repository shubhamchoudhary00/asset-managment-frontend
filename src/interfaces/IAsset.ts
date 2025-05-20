export interface IAsset {
    _id?: string; // MongoDB ObjectId, optional for new assets
    assetType: string;
    assetName: string;
    serialNumber?: string;
    manufacturer: string;
    model: string;
    purchaseDate?: string | null; // ISO string for Date
    warranty?: number |  string;
    status: 'available' | 'assigned' | 'maintenance' | 'reserved' | 'returned';
    location?: string;
    department?: string;
    notes?: string;
    trackable: boolean;
    value?: number | string;
    condition: 'new' | 'good' | 'fair' | 'poor';
    ipAddress?: string;
    macAddress?: string;
    subnetMask?: string;
    gateway?: string;
    isDhcp: boolean;
    images: string[]; // Array of base64 strings
    imagePreviewUrls:string[]
    assignment?: {
      assignedUser?: string;
      assignmentDate?: string; // ISO string for Date
      assignmentNotes?: string;
    };
    assignedBy?:string;
    assignedById?:string;
    createdAt?: string; // ISO string for Date
    updatedAt?: string; // ISO string for Date
  }

  export interface IAssetOverview {
    byStatus: { _id: string; count: number }[];
    byDepartment: { _id: string; count: number }[];
    byLocation: { _id: string; count: number }[];
    byAssetType: { _id: string; count: number }[];
    totalValue: number;
  }