"use client"
import React, {  useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
// import usedepartment from '@/hooks/use-department'
import { toast } from 'sonner'
import { Loader2, X } from 'lucide-react'
import useDepartment from '@/hooks/use-department'
import useDepartmentStore from '@/store/useDepartmentStore'
// import usedepartmentStore from '@/store/usedepartmentStore'

const DepartmentModal = ({open,onOpenChange}:{open:boolean,onOpenChange:(data:boolean)=>void}) => {
    const [name,setName]=useState("");
    const {isLoading,addDepartment}=useDepartment();
    const {refetch}=useDepartmentStore();
    const handleSubmit = async () => {
        console.log(name)
      const res = await addDepartment(name);
      if (res instanceof Error) {
        toast.error("Something went wrong");
      } else if (res.success) {
        toast.success("department added");
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
      <DialogTitle>Add New department</DialogTitle>
      <DialogDescription>
        Create a new product department.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="departmentName">Department Name</Label>
        <Input id="departmentName" placeholder="Enter department name" onChange={(e)=>setName(e.target.value)} />
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
      <Button onClick={handleSubmit}>Save department</Button>
    </div>
  </DialogContent>
    </Dialog>
    
  )
}

export default DepartmentModal
