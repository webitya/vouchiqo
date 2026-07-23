"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * FormInput — a fully labelled, accessible input field with error support.
 *
 * @param {string} name - field name (used for id + htmlFor)
 * @param {string} label - visible label text
 * @param {React.ComponentType} [icon] - lucide-react icon prepended to label
 * @param {string} [type="text"] - HTML input type
 * @param {string} [placeholder]
 * @param {boolean} [required=false]
 * @param {string} [error] - error message to display below the input
 * @param {string} [hint] - small helper text shown below the input
 * @param {React.ComponentType} [prefix] - icon shown inside input on the left
 * @param {React.ComponentType} [suffix] - icon shown inside input on the right
 * @param {string} [className] - extra classes on the wrapper
 * @param {object} [rest] - any other props forwarded to <Input />
 */
export default function FormInput({
  name,
  label,
  icon: Icon,
  type = "text",
  placeholder,
  required = false,
  error,
  hint,
  prefix: Prefix,
  suffix: Suffix,
  className,
  ...rest
}) {
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

      <div className="relative">
        {Prefix && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-subtext pointer-events-none">
            <Prefix className="w-4 h-4" />
          </span>
        )}
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          aria-required={required}
          aria-describedby={
            error ? `${name}-error` : hint ? `${name}-hint` : undefined
          }
          aria-invalid={!!error}
          className={cn(
            "text-sm h-9 border-brand-border bg-brand-bg text-brand-text placeholder:text-brand-subtext/60 focus-visible:ring-brand-blue/40",
            Prefix && "pl-9",
            Suffix && "pr-9",
            error && "border-brand-error focus-visible:ring-brand-error/30",
          )}
          {...rest}
        />
        {Suffix && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-subtext pointer-events-none">
            <Suffix className="w-4 h-4" />
          </span>
        )}
      </div>

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
