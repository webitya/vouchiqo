"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Helper functions to safely extract primitive string values/labels
const extractVal = (v) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (typeof v === "object")
    return String(v.value || v.city || v.name || v.id || JSON.stringify(v));
  return String(v);
};

const extractLabel = (v) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (typeof v === "object")
    return String(v.label || v.name || v.city || v.title || extractVal(v));
  return String(v);
};

/**
 * FormSelect — Universal, DRY Select Dropdown component.
 */
export default function FormSelect({
  name,
  label,
  icon: Icon,
  options = [],
  placeholder = "Select an option",
  required = false,
  error,
  hint,
  value,
  onValueChange,
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
}) {
  // Normalise options into uniform [{ value: string, label: string }] format
  const normalised = Array.isArray(options)
    ? options.map((opt) => {
        if (typeof opt === "string" || typeof opt === "number") {
          return { value: String(opt), label: String(opt) };
        }
        if (opt && typeof opt === "object") {
          return {
            value: extractVal(opt.value !== undefined ? opt.value : opt),
            label: extractLabel(opt.label !== undefined ? opt.label : opt),
          };
        }
        return { value: String(opt), label: String(opt) };
      })
    : Object.entries(options).map(([v, l]) => ({
        value: extractVal(v),
        label: extractLabel(l),
      }));

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label
          htmlFor={name}
          className="text-xs font-bold text-brand-text uppercase flex items-center gap-1.5"
        >
          {Icon && <Icon className="w-3.5 h-3.5 text-brand-blue" />}
          {label}
          {required && <span className="text-brand-error ml-0.5">*</span>}
        </Label>
      )}

      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
      >
        <SelectTrigger
          id={name}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${name}-error` : hint ? `${name}-hint` : undefined
          }
          className={cn(
            "h-10 text-xs border-brand-border bg-brand-bg text-brand-text font-bold focus:ring-brand-blue/40 rounded-xl",
            error && "border-brand-error focus:ring-brand-error/30",
            triggerClassName,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className={cn(
            "bg-brand-bg border-brand-border text-brand-text z-[300]",
            contentClassName,
          )}
        >
          {normalised.map((opt, idx) => (
            <SelectItem
              key={`${opt.value}-${idx}`}
              value={opt.value}
              className="text-xs cursor-pointer focus:bg-brand-surface font-medium"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="text-[11px] text-brand-error font-medium"
        >
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${name}-hint`} className="text-[11px] text-brand-subtext">
          {hint}
        </p>
      )}
    </div>
  );
}
