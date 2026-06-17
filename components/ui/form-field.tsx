"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface FormFieldProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  labelClassName?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  description,
  error,
  className,
  labelClassName,
  contentClassName,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <Label
        htmlFor={htmlFor}
        className={cn("text-sm font-medium", labelClassName)}
      >
        {label}
      </Label>
      <div className={cn("flex flex-col gap-2", contentClassName)}>
        {children}
      </div>
      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
