"use client"
import React, {  useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
// import useLocation from '@/hooks/use-Location'
import { toast } from 'sonner'
import { Loader2, X } from 'lucide-react'
import useLocation from '@/hooks/use-location'
import useLocationStore from '@/store/useLocationStore'
// import useLocationStore from '@/store/useLocationStore'

const LocationModal = ({open,onOpenChange}:{open:boolean,onOpenChange:(data:boolean)=>void}) => {
    const [name,setName]=useState("");
    const {isLoading,addLocation}=useLocation();
    const {refetch}=useLocationStore();
    const handleSubmit = async () => {
        console.log(name)
      const res = await addLocation(name);
      if (res instanceof Error) {
        toast.error("Something went wrong");
      } else if (res.success) {
        toast.success("Location added");
        onOpenChange(false);
        refetch();
      }
    };
    if(isLoading){
        return (
            <div className='flex items-center justify-center h-full'>
                <Loader2 className='animate-spin' />
            </div>
        )
    }
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent >
    <DialogHeader>
    <div className="absolute right-4 top-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full hover:bg-slate-100" 
          onClick={()=>onOpenChange(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <DialogTitle>Add New Location</DialogTitle>
      <DialogDescription>
        Create a new location.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="LocationName">Location Name</Label>
        <Input id="LocationName" placeholder="Enter Location name" onChange={(e)=>setName(e.target.value)} />
      </div>
     
    </div>
    <div className="flex justify-end">
      <Button
        variant="outline"
        className="mr-2"
        onClick={()=>onOpenChange(false)}
        >
        Cancel
      </Button>
      <Button onClick={handleSubmit}>Save Location</Button>
    </div>
  </DialogContent>
    </Dialog>
    
  )
}

export default LocationModal
