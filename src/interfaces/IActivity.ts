export interface IActivity {
    id: string;
    assetId: string;
    assetType: string;
    assetName: string;
    serialNumber: string;
    actionType: 'assigned' | 'returned' | 'maintenance' | 'added' | 'updated' | 'reserved';
    user: string;
    department: string;
    location: string;
    timestamp: string;
    notes?: string;
    performedBy: string;
  }