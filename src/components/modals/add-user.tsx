"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import useLocationStore from '@/store/useLocationStore'
import useDepartmentStore from '@/store/useDepartmentStore'
import useUser from '@/hooks/use-user'
import { IUser } from '@/interfaces/IUser'

interface AlertMessage{
    type:string;
    message:string;
}
interface Props{
    isAddUserDialogOpen:boolean;
    setIsAddUserDialogOpen:(data:boolean)=>void;
    setAlertMessage:(data:AlertMessage)=>void;
}

const AddUser = ({isAddUserDialogOpen,setIsAddUserDialogOpen,setAlertMessage}:Props) => {
      const {locations,initalize:locationInitialize}=useLocationStore();
      const {departments,initalize:departmentInitialize}=useDepartmentStore();
      const {addUser}=useUser()
      
     // New user form state
      const [newUser, setNewUser] = useState({
        name: "",
        password: "",
        confirmPassword: "",
        department: "",
        location: "",
        role: "admin" // Default role
      });
      
      // Form validation errors
      const [formErrors, setFormErrors] = useState({
        name: "",
        password: "",
        confirmPassword: "",
        department: "",
        location: "",
        role: ""
      });

       useEffect(()=>{
          if(!locations && !departments){
            locationInitialize();
            departmentInitialize()
          }
      
        },[])
      
        // Handle input change for new user form
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target;
          setNewUser({
            ...newUser,
            [name]: value
          });
          
          // Clear errors when user types
          if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors({
              ...formErrors,
              [name]: ""
            });
          }
        };
        
        // Handle select change for new user form
        const handleSelectChange = (name: string, value: string) => {
          setNewUser({
            ...newUser,
            [name]: value
          });
          
          // Clear errors when user selects
          if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors({
              ...formErrors,
              [name]: ""
            });
          }
        };
      const validateForm = () => {
        const errors = {
          name: "",
          password: "",
          confirmPassword: "",
          department: "",
          location: "",
          role: ""
        };
        let isValid = true;
        
        if (!newUser.name.trim()) {
          errors.name = "Name is required";
          isValid = false;
        }
        
        if (!newUser.password) {
          errors.password = "Password is required";
          isValid = false;
        } else if (newUser.password.length < 8) {
          errors.password = "Password must be at least 8 characters";
          isValid = false;
        }
        
        if (newUser.password !== newUser.confirmPassword) {
          errors.confirmPassword = "Passwords don't match";
          isValid = false;
        }
        
        if (!newUser.department) {
          errors.department = "Department is required";
          isValid = false;
        }
        
        if (!newUser.location) {
          errors.location = "Location is required";
          isValid = false;
        }
        
        if (!newUser.role) {
          errors.role = "Role is required";
          isValid = false;
        }
        
        setFormErrors(errors);
        return isValid;
      };

    const handleAddUser =async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
          return;
        }
        
        // Here you would typically make an API call to create the user
        const newUserEntry:IUser = {
          name: newUser.name,
          department: newUser.department,
          password:newUser.password,
          location: newUser.location,
          role: newUser.role,
          addedBy: "Current Admin" // This would come from the session in a real app
        };

        try{
            const res=await addUser(newUserEntry);
            if(res.success){
                setIsAddUserDialogOpen(false);
        
                // Reset form
                setNewUser({
                  name: "",
                  password: "",
                  confirmPassword: "",
                  department: "",
                  location: "",
                  role: "admin"
                });
                
                // Show success message
                setAlertMessage({ 
                  type: "success", 
                  message: `User ${newUser.name} has been successfully added.` 
                });
                    // Clear alert after 5 seconds
                setTimeout(() => {
                    setAlertMessage({ type: "", message: "" });
                }, 5000);
                    }
        }catch(error){
            console.log(error)
        }

        

        
        
    
      };
  return (
    <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
    <DialogTrigger asChild>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Add New User
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md md:max-w-lg">
      <DialogHeader>
        <DialogTitle>Add New User</DialogTitle>
        <DialogDescription>
          Create a new user account with specific role and permissions.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleAddUser}>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter user's full name"
              value={newUser.name}
              onChange={handleInputChange}
              className={formErrors.name ? "border-red-500" : ""}
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={handleInputChange}
                className={formErrors.password ? "border-red-500" : ""}
              />
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={newUser.confirmPassword}
                onChange={handleInputChange}
                className={formErrors.confirmPassword ? "border-red-500" : ""}
              />
              {formErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select 
                value={newUser.department}
                onValueChange={(value) => handleSelectChange("department", value)}
              >
                <SelectTrigger className={formErrors.department ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments && departments.map((dept,index) => (
                    <SelectItem key={index} value={dept.name}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.department && (
                <p className="text-red-500 text-xs mt-1">{formErrors.department}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select 
                value={newUser.location}
                onValueChange={(value) => handleSelectChange("location", value)}
              >
                <SelectTrigger className={formErrors.location ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations && locations.map((loc,index) => (
                    <SelectItem key={index} value={loc.name}>{loc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.location && (
                <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">User Role</Label>
            <Select 
              value={newUser.role}
              onValueChange={(value) => handleSelectChange("role", value)}
            >
              <SelectTrigger className={formErrors.role ? "border-red-500" : ""}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="reports">Reports</SelectItem>
                <SelectItem value="assets">Assets</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.role && (
              <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-medium">Admin:</span> Full system access
              <br />
              <span className="font-medium">Reports:</span> Can view and generate reports
              <br />
              <span className="font-medium">Assets:</span> Can manage assets only
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Add User</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
  )
}

export default AddUser
