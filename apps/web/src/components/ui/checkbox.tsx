"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded-[2px] border border-[#D2D5E2]",
      "bg-[#1C1F25]/0.05",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-PR",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary-PR data-[state=checked]:border-none  ",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <CheckSvg />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };

export function CheckboxWithLabel({
  label,
  id,
  ...props
}: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  label: string | React.ReactNode;
  id: string;
}) {
  return (
    <div className="flex items-center gap-5 py-[10px]">
      <Checkbox {...props} id={id} />
      <label
        htmlFor={id}
        className="text-[20px] text-neutral-N800 [&_strong]:text-primary-PR font-regular [&_strong]:font-[400]"
      >
        {label}
      </label>
    </div>
  );
}

function CheckSvg() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="20" height="20" rx="3" fill="#75C0EF" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.7856 5.23886C17.0817 5.54657 17.0696 6.03347 16.7585 6.32639L7.77084 14.7879C7.61735 14.9324 7.4109 15.0087 7.19922 14.9992C6.98753 14.9897 6.78894 14.8951 6.64936 14.7374L3.19257 10.8321C2.90963 10.5125 2.94227 10.0265 3.26548 9.74666C3.58868 9.46683 4.08006 9.49911 4.363 9.81876L7.28566 13.1206L15.686 5.21208C15.9971 4.91916 16.4894 4.93115 16.7856 5.23886Z"
        fill="white"
      />
    </svg>
  );
}
