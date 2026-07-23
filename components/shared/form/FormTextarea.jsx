"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * FormTextarea — labelled textarea with optional character counter.
 *
 * @param {string} name - field name
 * @param {string} label - visible label text
 * @param {React.ComponentType} [icon] - lucide-react icon prepended to label
 * @param {number} [rows=4]
 * @param {number} [maxLength] - enables character counter when set
 * @param {boolean} [showCounter=true] - show/hide counter (only when maxLength is set)
 * @param {string} [placeholder]
 * @param {boolean} [required=false]
 * @param {string} [error]
 * @param {string} [hint]
 * @param {string} [value] - controlled value (used for counter)
 * @param {function} [onChange]
 * @param {string} [className]
 * @param {object} [rest]
 */
export default function FormTextarea({
  name,
  label,
  icon: Icon,
  rows = 4,
  maxLength,
  showCounter = true,
  placeholder,
  required = false,
  error,
  hint,
  value,
  onChange,
  className,
  ...rest
}) {
  const charCount = typeof value === "string" ? value.length : 0;
  const isNearLimit = maxLength && charCount >= maxLength * 0.85;
  const isAtLimit = maxLength && charCount >= maxLength;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label
            htmlFor={name}
            className="text-xs font-bold text-brand-text uppercase flex items-center gap-1.5"
          >
            {Icon && <Icon className="w-3.5 h-3.5 text-brand-blue" />}
            {label}
            {required && <span className="text-brand-error ml-0.5">*</span>}
          </Label>
          {maxLength && showCounter && (
            <span
              className={cn(
                "text-[10px] font-medium tabular-nums",
                isAtLimit
                  ? "text-brand-error"
                  : isNearLimit
                    ? "text-amber-500"
                    : "text-brand-subtext",
              )}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}

      <Textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${name}-error` : hint ? `${name}-hint` : undefined
        }
        className={cn(
          "text-sm border-brand-border bg-brand-bg text-brand-text placeholder:text-brand-subtext/60 focus-visible:ring-brand-blue/40 resize-none leading-relaxed",
          error && "border-brand-error focus-visible:ring-brand-error/30",
        )}
        {...rest}
      />

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
