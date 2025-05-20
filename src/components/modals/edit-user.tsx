"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import {  Eye, EyeOff } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import useLocationStore from '@/store/useLocationStore';
import useDepartmentStore from '@/store/useDepartmentStore';
import useUser from '@/hooks/use-user';
import { IUser } from '@/interfaces/IUser';

interface AlertMessage {
  type: string;
  message: string;
}

interface Props {
  isEditUserDialogOpen: boolean;
  setIsEditUserDialogOpen: (data: boolean) => void;
  setAlertMessage: (data: AlertMessage) => void;
  user: IUser;
}

const EditUser = ({ isEditUserDialogOpen, setIsEditUserDialogOpen, setAlertMessage, user }: Props) => {
  const { locations, initalize: locationInitialize } = useLocationStore();
  const { departments, initalize: departmentInitialize } = useDepartmentStore();
  const { updateUser } = useUser();

  // User form state
  const [editUser, setEditUser] = useState({
    name: user.name || "",
    password: "",
    confirmPassword: "",
    department: user.department || "",
    location: user.location || "",
    role: user.role || "admin"
  });

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form validation errors
  const [formErrors, setFormErrors] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    department: "",
    location: "",
    role: ""
  });

  useEffect(() => {
    if (!locations && !departments) {
      locationInitialize();
      departmentInitialize();
    }
  }, []);

  // Update form when user prop changes
  useEffect(() => {
    setEditUser({
      name: user.name || "",
      password: "",
      confirmPassword: "",
      department: user.department || "",
      location: user.location || "",
      role: user.role || "admin"
    });
  }, [user]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditUser(prev => {
      // If password field is changing, automatically update confirmPassword
      if (name === 'password') {
        return {
          ...prev,
          [name]: value,
          confirmPassword: value
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });

    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setEditUser({
      ...editUser,
      [name]: value
    });

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

    if (!editUser.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (editUser.password && editUser.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (editUser.password !== editUser.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    if (!editUser.department) {
      errors.department = "Department is required";
      isValid = false;
    }

    if (!editUser.location) {
      errors.location = "Location is required";
      isValid = false;
    }

    if (!editUser.role) {
      errors.role = "Role is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updatedUser: IUser = {
      ...user,
      name: editUser.name,
      department: editUser.department,
      location: editUser.location,
      role: editUser.role,
      ...(editUser.password && { password: editUser.password })
    };

    try {
      const res = await updateUser(updatedUser);
      if (res.success) {
        setIsEditUserDialogOpen(false);

        // Reset password fields
        setEditUser(prev => ({
          ...prev,
          password: "",
          confirmPassword: ""
        }));

        // Show success message
        setAlertMessage({
          type: "success",
          message: `User ${editUser.name} has been successfully updated.`
        });

        // Clear alert after 5 seconds
        setTimeout(() => {
          setAlertMessage({ type: "", message: "" });
        }, 5000);
      }
    } catch (error) {
      console.error(error);
      setAlertMessage({
        type: "error",
        message: "Failed to update user. Please try again."
      });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user account details and permissions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditUser}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter user's full name"
                value={editUser.name}
                onChange={handleInputChange}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password (optional)</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={editUser.password}
                    onChange={handleInputChange}
                    className={formErrors.password ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={editUser.confirmPassword}
                    onChange={handleInputChange}
                    className={formErrors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={editUser.department}
                  onValueChange={(value) => handleSelectChange("department", value)}
                >
                  <SelectTrigger className={formErrors.department ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments && departments.map((dept, index) => (
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
                  value={editUser.location}
                  onValueChange={(value) => handleSelectChange("location", value)}
                >
                  <SelectTrigger className={formErrors.location ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations && locations.map((loc, index) => (
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
                value={editUser.role}
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
            <Button type="button" variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;