"use client";

import { useEffect, useState } from "react";
import {  User, Building, MapPin,  Lock, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUserStore from "@/store/useUserStore";
import useUser from "@/hooks/use-user";



export default function ProfilePage() {

  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const {user,initalizeUser}=useUserStore();
  const {changePassword}=useUser();

  useEffect(()=>{
    if(!user){
        initalizeUser();
    }
  },[])



  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setEditedUser({
  //     ...editedUser,
  //     [name]: value
  //   });
  // };

  const handlePasswordChange = async(e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    const payload={password:currentPassword.trim(),newPassword:newPassword.trim()}

    try{
        const res=await changePassword(payload);
        console.log(res);
        if(res.success){
          setPasswordSuccess("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        }
    }catch(error){
        console.log("error",error)
    }

    // Here you would typically make an API call to change the password
    // Simulating API call success

  };

  const getInitials = (name: string) => {
    if(!name.includes(" ")) return name[0].toUpperCase();
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  if(!user){
    return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="animate-spin" />

        </div>
    )
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Profile Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <div className="grid gap-6 md:grid-cols-5">
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/api/placeholder/100/100" alt={user.name} />
                  <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Role
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <span>{user.department || "No department set"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{user.location || "No location set"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span>Added by {user?.addedBy as string}</span>
                  </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Profile Details</span>
                  {/* {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <Button size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  )} */}
                </CardTitle>
                <CardDescription>Manage your profile information</CardDescription>
              </CardHeader>
              {/* <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input 
                        id="name" 
                        name="name" 
                        value={editedUser.name} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <div className="rounded-md border p-3">{user.name}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    {isEditing ? (
                      <Input 
                        id="department" 
                        name="department" 
                        value={editedUser.department || ""} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <div className="rounded-md border p-3">{user.department || "Not specified"}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input 
                        id="location" 
                        name="location" 
                        value={editedUser.location || ""} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <div className="rounded-md border p-3">{user.location || "Not specified"}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <div className="rounded-md border p-3 bg-muted text-muted-foreground">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      {!isEditing && <p className="text-xs mt-1">Role can only be changed by administrators</p>}
                    </div>
                  </div>
                </div>
              </CardContent> */}
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to maintain a secure account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {passwordError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}
              
              {passwordSuccess && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>{passwordSuccess}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                <Button type="submit" className="w-full md:w-auto">
                  Update Password
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <h3 className="text-sm font-medium mb-2">Password Requirements:</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>At least 8 characters long</li>
                <li>Combination of uppercase letters, lowercase letters, numbers, and symbols</li>
                <li>Different from previously used passwords</li>
              </ul>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}