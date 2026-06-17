"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface SearchInputProps extends Omit<
  React.ComponentPropsWithoutRef<"input">,
  "className"
> {
  icon?: React.ReactNode;
  wrapperClassName?: string;
  inputClassName?: string;
  className?: string;
}

export function SearchInput({
  icon,
  wrapperClassName,
  inputClassName,
  className,
  ...props
}: SearchInputProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 w-full rounded-md  border-input bg-background px-3 ",
        wrapperClassName,
      )}
    >
      {icon ? <span className="text-muted-foreground">{icon}</span> : null}
      <Input
        className={cn(
          "border-none bg-transparent px-0 py-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0",
          inputClassName,
          className,
        )}
        {...props}
      />
    </div>
  );
}
