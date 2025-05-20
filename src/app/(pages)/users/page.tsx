"use client";

import { useEffect, useState } from "react";
import { Check, Search, User, Users, X, Pencil } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import useUserStore from "@/store/useUserStore";
import AddUser from "@/components/modals/add-user";
import { IUser } from "@/interfaces/IUser";
import EditUser from "@/components/modals/edit-user";

export default function UserManagementPage() {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });
  const {allUsers:users, initalizeUser} = useUserStore();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    initalizeUser();
  }, []);

  // Filter users based on search term
  const filteredUsers = users && users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination values
  const totalUsers = filteredUsers ? filteredUsers.length : 0;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  
  // Get current users for the page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers ? filteredUsers.slice(indexOfFirstUser, indexOfLastUser) : [];

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first and last page
      pageNumbers.push(1);
      
      // Calculate middle pages to show
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the beginning or end
      if (currentPage <= 2) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis if needed at the beginning
      if (startPage > 2) {
        pageNumbers.push('ellipsis-start');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed at the end
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis-end');
      }
      
      // Add last page if not already included
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Get badge color based on role
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "reports":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "assets":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Handle edit button click
  const handleEditClick = (user:IUser) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Add and manage users in the system</p>
        </div>
        <AddUser 
          isAddUserDialogOpen={isAddUserDialogOpen} 
          setIsAddUserDialogOpen={setIsAddUserDialogOpen} 
          setAlertMessage={setAlertMessage} 
        />
      </div>
      
      {alertMessage.message && (
        <Alert 
          className={`mb-4 ${alertMessage.type === "success" ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"}`}
        >
          <AlertDescription className="flex items-center">
            {alertMessage.type === "success" ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <X className="h-4 w-4 mr-2" />
            )}
            {alertMessage.message}
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            User Accounts
          </CardTitle>
          <CardDescription>
            Manage user accounts and their permissions
          </CardDescription>
          <div className="flex items-center mt-2">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <Input
              placeholder="Search users by name, department, location, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Added By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        {user.name}
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.location}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.addedBy as string}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleEditClick(user)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <Pencil className="h-4 w-4 text-gray-600" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, totalUsers)} of {totalUsers} users
          </div>
          
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((pageNumber, i) => {
                  if (pageNumber === 'ellipsis-start' || pageNumber === 'ellipsis-end') {
                    return (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  
                  return (
                    <PaginationItem key={`page-${pageNumber}`}>
                      <PaginationLink 
                        onClick={() => handlePageChange(pageNumber as number)}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardFooter>
      </Card>
      
      {selectedUser && (
        <EditUser
          isEditUserDialogOpen={isEditUserDialogOpen}
          setIsEditUserDialogOpen={setIsEditUserDialogOpen}
          setAlertMessage={setAlertMessage}
          user={selectedUser}
        />
      )}
    </div>
  );
}