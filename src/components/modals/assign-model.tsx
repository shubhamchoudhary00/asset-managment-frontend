"use client"
import { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import useLocationStore from '@/store/useLocationStore';
import useDepartmentStore from '@/store/useDepartmentStore';
import useAssetStore from '@/store/useAssetStore';
import { IAsset } from '@/interfaces/IAsset';
import useAsset from '@/hooks/use-asset';
import { toast } from 'sonner';


interface ApiResponse{
  success:boolean;
}

// The actual modal component that can be used anywhere in the application
export function AssetAssignModal({ open, onOpenChange, assetId }: { open: boolean; onOpenChange: (open: boolean) => void; assetId?: string }) {
  // Form state for assignment, network details, and condition
  const [assignForm, setAssignForm] = useState({
    status: 'assigned' as 'available' | 'assigned' | 'maintenance' | 'reserved' | 'returned',
    department: '',
    location:'',
    assignedUser: '',
    assignmentDate: null as string | null,
    assignmentNotes: '',
    ipAddress: '',
    macAddress: '',
    subnetMask: '',
    gateway: '',
    isDhcp: true,
    condition: 'new' as 'new' | 'good' | 'fair' | 'poor',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { locations, initalize: locationInitialize } = useLocationStore();
  const { departments, initalize: departmentInitialize } = useDepartmentStore();
  const { assets, initalize: assetInitialize, refetch } = useAssetStore();
  const { updateAsset } = useAsset();
  const [selectedAsset, setSelectedAsset] = useState<IAsset | undefined>();

  // Initialize stores
  useEffect(() => {
    if (!assets) {
      assetInitialize();
    }
    if (!locations) {
      locationInitialize();
    }
    if (!departments) {
      departmentInitialize();
    }
  }, [assets, locations, departments, assetInitialize, locationInitialize, departmentInitialize]);

  // Load selected asset data
  useEffect(() => {
    if (!assets || !assetId) {
      setSelectedAsset(undefined);
      return;
    }
    const findAsset = assets.find((t) => t._id === assetId);
    setSelectedAsset(findAsset);
    if (findAsset) {
      setAssignForm({
        status: findAsset.status || 'assigned',
        location: findAsset.location || '',
        department: findAsset.department || '',
        assignedUser: findAsset.assignment?.assignedUser || '',
        assignmentDate: findAsset.assignment?.assignmentDate || null,
        assignmentNotes: findAsset.assignment?.assignmentNotes || '',
        ipAddress: findAsset.ipAddress || '',
        macAddress: findAsset.macAddress || '',
        subnetMask: findAsset.subnetMask || '',
        gateway: findAsset.gateway || '',
        isDhcp: findAsset.isDhcp !== undefined ? findAsset.isDhcp : true,
        condition: findAsset.condition || 'new',
      });
    }
  }, [assetId, assets]);

  // Update form fields
  const updateField = (field: keyof typeof assignForm, value:string | undefined | boolean ) => {
    setAssignForm({
      ...assignForm,
      [field]: value
    });
    // Clear error for this field when it's updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form data based on IAsset interface
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!assignForm.status) {
      newErrors.status = 'Status is required';
    } else if (!['available', 'assigned', 'maintenance', 'reserved'].includes(assignForm.status)) {
      newErrors.status = 'Invalid status value';
    }

    if (!assignForm.condition) {
      newErrors.condition = 'Condition is required';
    } else if (!['new', 'good', 'fair', 'poor'].includes(assignForm.condition)) {
      newErrors.condition = 'Invalid condition value';
    }

    // If status is 'assigned', assignedUser and assignmentDate are required
    if (assignForm.status === 'assigned') {
      if (!assignForm.assignedUser.trim()) {
        newErrors.assignedUser = 'Assigned user is required';
      }
      if (!assignForm.assignmentDate) {
        newErrors.assignmentDate = 'Assignment date is required';
      }
    }

    // Network field validations (optional, but must be valid if provided)
    if (!assignForm.isDhcp) {
      if (assignForm.ipAddress && !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(assignForm.ipAddress)) {
        newErrors.ipAddress = 'Invalid IP address format';
      }
      if (assignForm.subnetMask && !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(assignForm.subnetMask)) {
        newErrors.subnetMask = 'Invalid subnet mask format';
      }
      if (assignForm.gateway && !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(assignForm.gateway)) {
        newErrors.gateway = 'Invalid gateway format';
      }
    }
    if (assignForm.macAddress && !/^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/.test(assignForm.macAddress)) {
      newErrors.macAddress = 'Invalid MAC address format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm() || !assetId || !selectedAsset) {
      return;
    }

    setIsLoading(true);

    // Construct full asset payload with all IAsset fields
    const updatedAsset: IAsset = {
      ...selectedAsset, // Include all original fields
      status: assignForm.status,
      location: assignForm.location || undefined,
      department: assignForm.department || undefined,
      ipAddress: assignForm.ipAddress || undefined,
      macAddress: assignForm.macAddress || undefined,
      subnetMask: assignForm.subnetMask || undefined,
      gateway: assignForm.gateway || undefined,
      isDhcp: assignForm.isDhcp,
      condition: assignForm.condition,
      assignment: assignForm.status === 'assigned' ? {
        assignedUser: assignForm.assignedUser || undefined,
        assignmentDate: assignForm.assignmentDate || undefined,
        assignmentNotes: assignForm.assignmentNotes || undefined,
      } : undefined,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await updateAsset(assetId, updatedAsset);
      if ((res as ApiResponse).success) {
        toast.success("Successfully updated");
        await refetch();
        handleReset();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong");
    }
  };

  const handleReset = () => {
    setIsLoading(false);
    onOpenChange(false);
    // Reset form
    setAssignForm({
      status: 'assigned',
      location: '',
      department: '',
      assignedUser: '',
      assignmentDate: null,
      assignmentNotes: '',
      ipAddress: '',
      macAddress: '',
      subnetMask: '',
      gateway: '',
      isDhcp: true,
      condition: 'new',
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Assign Asset: {selectedAsset?.assetName || 'Loading...'}</DialogTitle>
          <DialogDescription>
            Assign this asset to a user, update its status, location, condition, or network details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Assignment */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status*</Label>
                <Select
                  value={assignForm.status}
                  onValueChange={(value: 'available' | 'assigned' | 'maintenance' | 'reserved') => updateField('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="maintenance">Under Maintenance</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition*</Label>
                <Select
                  value={assignForm.condition}
                  onValueChange={(value: 'new' | 'good' | 'fair' | 'poor') => updateField('condition', value)}
                >
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
                {errors.condition && <p className="text-red-500 text-sm">{errors.condition}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={assignForm.location}
                  onValueChange={(value) => updateField('location', value)}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations && locations.map((item, index) => (
                      <SelectItem key={index} value={item.name}>{item.name.toLocaleUpperCase()}</SelectItem>
                    ))}
                    <SelectItem value="branch-east">East Branch</SelectItem>
                    <SelectItem value="branch-west">West Branch</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="remote">Remote/Home Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={assignForm.department}
                  onValueChange={(value) => updateField('department', value)}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments && departments.map((item, index) => (
                      <SelectItem key={index} value={item.name}>{item.name.toLocaleUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignment details, shown only if status is 'assigned' */}
            {assignForm.status === 'assigned' && (
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                <h3 className="font-medium">User Assignment</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignedUser">Assigned To*</Label>
                    <Input
                      id="assignedUser"
                      placeholder="Enter user name or ID"
                      value={assignForm.assignedUser}
                      onChange={(e) => updateField('assignedUser', e.target.value)}
                    />
                    {errors.assignedUser && <p className="text-red-500 text-sm">{errors.assignedUser}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Assignment Date*</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {assignForm.assignmentDate ? (
                            new Date(assignForm.assignmentDate).toLocaleDateString()
                          ) : (
                            <span className="text-gray-500">Select date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={assignForm.assignmentDate ? new Date(assignForm.assignmentDate) : undefined}
                          onSelect={(date) => updateField('assignmentDate', date?.toISOString())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.assignmentDate && <p className="text-red-500 text-sm">{errors.assignmentDate}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignmentNotes">Assignment Notes</Label>
                  <Textarea 
                    id="assignmentNotes" 
                    placeholder="Enter any notes about this assignment"
                    value={assignForm.assignmentNotes}
                    onChange={(e) => updateField('assignmentNotes', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Network Information */}
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <h3 className="font-medium">Network Information</h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="isDhcp">DHCP Enabled</Label>
                <Switch 
                  id="isDhcp" 
                  checked={assignForm.isDhcp} 
                  onCheckedChange={(checked) => updateField('isDhcp', checked)}
                />
              </div>
              <p className="text-sm text-gray-500">
                Enable if this device obtains IP address automatically
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ipAddress">IP Address</Label>
                <Input 
                  id="ipAddress" 
                  placeholder="192.168.1.100" 
                  value={assignForm.ipAddress}
                  onChange={(e) => updateField('ipAddress', e.target.value)}
                  disabled={assignForm.isDhcp}
                />
                {errors.ipAddress && <p className="text-red-500 text-sm">{errors.ipAddress}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="macAddress">MAC Address</Label>
                <Input 
                  id="macAddress" 
                  placeholder="00:1A:2B:3C:4D:5E" 
                  value={assignForm.macAddress}
                  onChange={(e) => updateField('macAddress', e.target.value)}
                />
                {errors.macAddress && <p className="text-red-500 text-sm">{errors.macAddress}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subnetMask">Subnet Mask</Label>
                <Input 
                  id="subnetMask" 
                  placeholder="255.255.255.0" 
                  value={assignForm.subnetMask}
                  onChange={(e) => updateField('subnetMask', e.target.value)}
                  disabled={assignForm.isDhcp}
                />
                {errors.subnetMask && <p className="text-red-500 text-sm">{errors.subnetMask}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gateway">Default Gateway</Label>
                <Input 
                  id="gateway" 
                  placeholder="192.168.1.1" 
                  value={assignForm.gateway}
                  onChange={(e) => updateField('gateway', e.target.value)}
                  disabled={assignForm.isDhcp}
                />
                {errors.gateway && <p className="text-red-500 text-sm">{errors.gateway}</p>}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end items-center">
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !assetId || !selectedAsset}
          >
            {isLoading ? "Updating..." : "Update Asset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}