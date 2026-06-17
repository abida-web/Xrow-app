"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { X } from "lucide-react";

export interface TagInputProps {
  label?: string;
  value: string;
  tags: string[];
  onChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
}

export function TagInput({
  label,
  value,
  tags,
  onChange,
  onAdd,
  onRemove,
  placeholder,
  disabled,
  helperText,
}: TagInputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label ? <Label className="text-sm">{label}</Label> : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAdd();
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={onAdd}
          disabled={disabled || !value.trim()}
          variant="outline"
          size="sm"
        >
          Add
        </Button>
      </div>
      {helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700",
              )}
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                className="rounded-full p-1 text-gray-500 transition hover:bg-gray-200 hover:text-red-600 focus:outline-none"
                aria-label={`Remove ${tag}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
