"use client"
import { useEffect, useState } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon, ChevronRight, Upload, Plus, X } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import useCategoryStore from '@/store/useCategoryStore';
import useDepartmentStore from '@/store/useDepartmentStore';
import useLocationStore from '@/store/useLocationStore';
import useAsset from '@/hooks/use-asset';
import { IAsset } from '@/interfaces/IAsset';
import { toast } from 'sonner';


interface ErrorResponse {
  response: {
    data: {
      message: {
        errorResponse:{
          errmsg:string;
        }
      }
    };
  };
}

interface ApiResponse{
  status:number
}


// Demo component that includes both the trigger button and the modal
export default function AssetAddModalDemo() {
  const [open, setOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setOpen(true)} className="gap-1">
        <Plus size={16} />
        Add Asset
      </Button>
      <AssetAddModal open={open} onOpenChange={setOpen} />
    </div>
  );
}

// The actual modal component that can be used anywhere in the application
export function AssetAddModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  // Form state
  const [assetForm, setAssetForm] = useState<IAsset>({
    assetType: '',
    assetName: '',
    serialNumber: '',
    manufacturer: '',
    model: '',
    purchaseDate: null,
    warranty: '',
    status: 'available',
    location: '',
    department: '',
    notes: '',
    trackable: true,
    value: '',
    condition: 'new',
    ipAddress: '',
    macAddress: '',
    subnetMask: '',
    gateway: '',
    isDhcp: true,
    images: [] as string[],
    imagePreviewUrls: [] as string[],
  });
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {category,initalize:categoryInitialize}=useCategoryStore();
  const {departments,initalize:departmentInitialize}=useDepartmentStore();
  const {locations,initalize:locationInitialize}=useLocationStore();
  const {addAsset}=useAsset()

  useEffect(()=>{
    if(!locations || !category || !departments){
      categoryInitialize();
      departmentInitialize();
      locationInitialize();
    }
  },[])
  
  // Update form fields
  const updateField = (field: keyof typeof assetForm, value: string | boolean | undefined | object) => {
    setAssetForm({
      ...assetForm,
      [field]: value
    });
    // Clear error for this field when it's updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle image file selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process each file
    Array.from(files).forEach((file) => {
      const fileAsFile = file as File;
      // Only process image files
      if (!fileAsFile.type.match('image.*')) return;
    
      const reader = new FileReader();
      
      reader.onload = (e) => {
        // Get base64 string
        const base64String = e.target?.result as string;        
        setAssetForm(prev => ({
          ...prev,
          images: [...prev.images, base64String],
          imagePreviewUrls: [...prev.imagePreviewUrls, base64String]
        }));
      };
      
      // Read the file as a data URL which gives us the base64 string
      reader.readAsDataURL(fileAsFile);
    });
  };

  // Remove an image
  const removeImage = (index: number) => {
    const newImages = [...assetForm.images];
    const newPreviews = [...assetForm.imagePreviewUrls];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setAssetForm({
      ...assetForm,
      images: newImages,
      imagePreviewUrls: newPreviews
    });
  };

  // Validate form data based on IAsset interface and current step
  const validateStep = (targetStep: number) => {
    const newErrors: Record<string, string> = {};

    // Step 1: Basic Information
    if (targetStep >= 1) {
      if (!assetForm.assetType.trim()) {
        newErrors.assetType = 'Asset type is required';
      }
      if (!assetForm.assetName.trim()) {
        newErrors.assetName = 'Asset name is required';
      }
      if (!assetForm.manufacturer.trim()) {
        newErrors.manufacturer = 'Manufacturer is required';
      }
      if (!assetForm.model.trim()) {
        newErrors.model = 'Model is required';
      }
    }

    // Step 2: Network Information
    if (targetStep >= 2) {
      if (!assetForm.isDhcp) {
        if (assetForm.ipAddress && !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(assetForm.ipAddress)) {
          newErrors.ipAddress = 'Invalid IP address format';
        }
        if (assetForm.subnetMask && !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(assetForm.subnetMask)) {
          newErrors.subnetMask = 'Invalid subnet mask format';
        }
        if (assetForm.gateway && !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(assetForm.gateway)) {
          newErrors.gateway = 'Invalid gateway format';
        }
      }
      if (assetForm.macAddress && !/^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/.test(assetForm.macAddress)) {
        newErrors.macAddress = 'Invalid MAC address format';
      }
    }

    // Step 3: Additional Details
    if (targetStep >= 3) {
      if (assetForm.warranty && isNaN(Number(assetForm.warranty))) {
        newErrors.warranty = 'Warranty must be a number';
      }
      if (assetForm.value && isNaN(Number(assetForm.value))) {
        newErrors.value = 'Value must be a number';
      }
      if (!['new', 'good', 'fair', 'poor'].includes(assetForm.condition)) {
        newErrors.condition = 'Invalid condition value';
      }
    }

    // Step 4: Assignment
    if (targetStep >= 4) {
      if (!assetForm.status) {
        newErrors.status = 'Status is required';
      }
      if (!['available', 'assigned', 'maintenance', 'reserved'].includes(assetForm.status)) {
        newErrors.status = 'Invalid status value';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(step + 1)) {
      setStep(step + 1);
    }
  };
  
  // Handle form submission
  const handleSubmit = async() => {
    if (!validateStep(4)) {
      return;
    }

    setIsLoading(true);
    try{
      const res=await addAsset(assetForm);
      console.log(res);

      if((res as ApiResponse).status===201){
        toast.success("Assest successfully added");
        handleReset();
      }else{
        // toast.error("Something went wrong.");
        toast.error((res as ErrorResponse).response.data.message.errorResponse.errmsg)
      }

    }catch(error){
      console.log(error)
      toast.error("Something went wrong")
    }finally{
      setIsLoading(false)
    }

    
 
  };

  const handleReset=()=>{
    setIsLoading(false);
    onOpenChange(false);
    // Reset form and step
    setAssetForm({
      assetType: '',
      assetName: '',
      serialNumber: '',
      manufacturer: '',
      model: '',
      purchaseDate: null,
      warranty: '',
      status: 'available',
      location: '',
      department: '',
      notes: '',
      trackable: true,
      value: '',
      condition: 'new',
      ipAddress: '',
      macAddress: '',
      subnetMask: '',
      gateway: '',
      isDhcp: true,
      images: [],
      imagePreviewUrls: []
    });
    setStep(1);
    setErrors({});

  }
  const isValidDate = (date: string | Date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Asset</DialogTitle>
          <DialogDescription>
            Enter the details of the new asset to add it to the inventory.
          </DialogDescription>
        </DialogHeader>
        
        {/* Step indicator */}
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${step === 1 ? '25%' : step === 2 ? '50%' : step === 3 ? '75%' : '100%'}` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-6">
          <span className={step >= 1 ? 'font-medium text-blue-600' : ''}>Basic Info</span>
          <span className={step >= 2 ? 'font-medium text-blue-600' : ''}>Network</span>
          <span className={step >= 3 ? 'font-medium text-blue-600' : ''}>Details</span>
          <span className={step >= 4 ? 'font-medium text-blue-600' : ''}>Assignment</span>
        </div>
        
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assetType">Asset Type*</Label>
                <Select
                  value={assetForm.assetType}
                  onValueChange={(value) => updateField('assetType', value)}
                >
                  <SelectTrigger id="assetType">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    {category && category.map((item,index)=>(
                      <SelectItem key={index} value={item.name}>{item.name.toLocaleUpperCase()}</SelectItem>
                    ))}
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.assetType && <p className="text-red-500 text-sm">{errors.assetType}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assetName">Asset Name*</Label>
                <Input 
                  id="assetName" 
                  placeholder="Enter asset name" 
                  value={assetForm.assetName}
                  onChange={(e) => updateField('assetName', e.target.value)}
                />
                {errors.assetName && <p className="text-red-500 text-sm">{errors.assetName}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer*</Label>
                <Input 
                  id="manufacturer" 
                  placeholder="Enter manufacturer" 
                  value={assetForm.manufacturer}
                  onChange={(e) => updateField('manufacturer', e.target.value)}
                />
                {errors.manufacturer && <p className="text-red-500 text-sm">{errors.manufacturer}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model*</Label>
                <Input 
                  id="model" 
                  placeholder="Enter model" 
                  value={assetForm.model}
                  onChange={(e) => updateField('model', e.target.value)}
                />
                {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input 
                  id="serialNumber" 
                  placeholder="Enter serial number" 
                  value={assetForm.serialNumber}
                  onChange={(e) => updateField('serialNumber', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Purchase Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {assetForm.purchaseDate ? (
                        new Date(assetForm.purchaseDate).toLocaleDateString()
                      ) : (
                        <span className="text-gray-500">Select purchase date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                  mode="single"
                  selected={assetForm.purchaseDate && isValidDate(assetForm.purchaseDate) ? new Date(assetForm.purchaseDate) : undefined}
                  onSelect={(date) => updateField('purchaseDate', date?.toISOString())}
                  initialFocus
                />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="trackable">Asset Tracking</Label>
                <Switch 
                  id="trackable" 
                  checked={assetForm.trackable} 
                  onCheckedChange={(checked) => updateField('trackable', checked)}
                />
              </div>
              <p className="text-sm text-gray-500">
                Enable to track this asset's location and assignment history
              </p>
            </div> */}
          </div>
        )}

        {/* Step 2: Network Information */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="isDhcp">DHCP Enabled</Label>
                <Switch 
                  id="isDhcp" 
                  checked={assetForm.isDhcp} 
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
                  value={assetForm.ipAddress}
                  onChange={(e) => updateField('ipAddress', e.target.value)}
                  disabled={assetForm.isDhcp}
                />
                {errors.ipAddress && <p className="text-red-500 text-sm">{errors.ipAddress}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="macAddress">MAC Address</Label>
                <Input 
                  id="macAddress" 
                  placeholder="00:1A:2B:3C:4D:5E" 
                  value={assetForm.macAddress}
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
                  value={assetForm.subnetMask}
                  onChange={(e) => updateField('subnetMask', e.target.value)}
                  disabled={assetForm.isDhcp}
                />
                {errors.subnetMask && <p className="text-red-500 text-sm">{errors.subnetMask}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gateway">Default Gateway</Label>
                <Input 
                  id="gateway" 
                  placeholder="192.168.1.1" 
                  value={assetForm.gateway}
                  onChange={(e) => updateField('gateway', e.target.value)}
                  disabled={assetForm.isDhcp}
                />
                {errors.gateway && <p className="text-red-500 text-sm">{errors.gateway}</p>}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Additional Details */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Purchase Value</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <Input 
                    id="value" 
                    type="number" 
                    placeholder="0.00" 
                    className="pl-7"
                    value={assetForm.value}
                    onChange={(e) => updateField('value', e.target.value)}
                  />
                </div>
                {errors.value && <p className="text-red-500 text-sm">{errors.value}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="warranty">Warranty (months)</Label>
                <Input 
                  id="warranty" 
                  type="number" 
                  placeholder="Enter warranty period" 
                  value={assetForm.warranty}
                  onChange={(e) => updateField('warranty', e.target.value)}
                />
                {errors.warranty && <p className="text-red-500 text-sm">{errors.warranty}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Condition</Label>
              <RadioGroup 
                value={assetForm.condition}
                onValueChange={(value) => updateField('condition', value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="condition-new" />
                  <Label htmlFor="condition-new">New</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="condition-good" />
                  <Label htmlFor="condition-good">Good</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fair" id="condition-fair" />
                  <Label htmlFor="condition-fair">Fair</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="poor" id="condition-poor" />
                  <Label htmlFor="condition-poor">Poor</Label>
                </div>
              </RadioGroup>
              {errors.condition && <p className="text-red-500 text-sm">{errors.condition}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Asset Images</Label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 text-center">
                  Drag & drop files here, or click to select files
                </p>
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  Select Files
                </Button>
              </div>
              
              {/* Image previews */}
              {assetForm.imagePreviewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {assetForm.imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-md overflow-hidden border bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <img 
                          src={url} 
                          alt={`Asset preview ${index + 1}`} 
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Enter any additional notes about this asset"
                value={assetForm.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}
        
        {/* Step 4: Assignment */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status*</Label>
              <Select
                value={assetForm.status}
                onValueChange={(value) => updateField('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={assetForm.location}
                  onValueChange={(value) => updateField('location', value)}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations && locations.map((item,index)=>(
                      <SelectItem key={index} value={item.name}>{item.name.toLocaleUpperCase()}</SelectItem>
                    ))}
                   
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={assetForm.department}
                  onValueChange={(value) => updateField('department', value)}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments && departments.map((item,index)=>(
                      <SelectItem key={index} value={item.name}>{item?.name.toLocaleUpperCase()}</SelectItem>

                    ))}
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Only visible if status is "assigned" */}
            {assetForm.status === 'assigned' && (
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                <h3 className="font-medium">User Assignment</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignedUser">Assigned To</Label>
                    <Input
                      id="assignedUser"
                      placeholder="Enter user name or ID"
                      value={assetForm.assignment?.assignedUser}
                      onChange={(e) => updateField('assignment', { ...assetForm.assignment, assignedUser: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Assignment Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <span className="text-gray-500">Select date</span>
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                      mode="single"
                      selected={assetForm.assignment?.assignmentDate && isValidDate(assetForm.assignment?.assignmentDate) ? new Date(assetForm.assignment?.assignmentDate) : undefined} 
                      onSelect={(date) => updateField('assignment', {...assetForm.assignment,assignmentDate: date?.toISOString()})} 
                      initialFocus
                    />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assignmentNotes">Assignment Notes</Label>
                  <Textarea 
                    id="assignmentNotes" 
                    placeholder="Enter any notes about this assignment"
                    rows={2}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter className="flex justify-between items-center">
          {step > 1 ? (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep(step - 1)}
            >
              Previous
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < 4 ? (
            <Button 
              type="button"
              onClick={handleNextStep}
              className="gap-1"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Asset"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}