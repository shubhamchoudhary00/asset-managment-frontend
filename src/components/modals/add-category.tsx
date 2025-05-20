"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import useCategory from "@/hooks/use-category";
import useCategoryStore from "@/store/useCategoryStore";

const CategoryModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [name, setName] = useState("");
  const { isLoading, addCategory } = useCategory();
  const { refetch } = useCategoryStore();

  const handleSubmit = async () => {
    console.log(name);
    const res = await addCategory(name);
    if (res instanceof Error) {
      toast.error("Something went wrong");
    } else if (res.success) {
      toast.success("Category added");
      onOpenChange(false); // Close modal on success
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="absolute right-4 top-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-slate-100"
              onClick={() => onOpenChange(false)} // Close modal
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>Create a new product category.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              placeholder="Enter category name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="mr-2"
            onClick={() => onOpenChange(false)} // Fix: Explicitly close modal
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Category</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;