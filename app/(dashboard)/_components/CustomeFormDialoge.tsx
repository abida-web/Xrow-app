"use client";
import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomeFormDialogeProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSave?: () => void;
}

const CustomeFormDialoge = ({
  isOpen,
  onClose,
  title,
  children,
  onSave,
}: CustomeFormDialogeProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className=" text-sm">{title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4">{children}</div>

        {onSave && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave}>Save</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomeFormDialoge;
