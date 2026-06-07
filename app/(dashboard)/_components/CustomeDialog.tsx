"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DialogProps {
  trigger: string | React.ReactNode;
  title: string;
  description?: string;
  buttonLabel: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  destructive?: boolean;
  loading?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CustomDialog = ({
  trigger,
  title,
  description,
  buttonLabel,
  onConfirm,
  onCancel,
  destructive = false,
  loading = false,
  open,
  onOpenChange,
}: DialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <AlertDialogTrigger>
          {typeof trigger === "string" ? (
            <span className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 cursor-pointer">
              {trigger}
            </span>
          ) : (
            trigger
          )}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            variant={destructive ? "destructive" : "default"}
          >
            {loading ? "Loading..." : buttonLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomDialog;
