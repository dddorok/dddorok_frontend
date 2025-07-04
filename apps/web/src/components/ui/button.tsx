import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // 기본 스타일 (모든 버튼에 공통 적용)
  [
    "inline-flex items-center justify-center gap-0",
    "rounded-lg", // 8px border radius
    "px-4 min-h-[52px]", // 16px padding
    "text-medium-sb",
    "transition-all duration-200",
    "disabled:cursor-not-allowed",
    "backdrop-blur-[12px]", // blur(12px) effect,
    "[&_svg]:w-5 [&_svg]:h-5",
    "cursor-pointer",
    // disable
    "disable:bg-neutral-N400",
    "disable:border-0",
    "disable:text-neutral-N0",
    "disable:cursor-not-allowed",
    "disable:opacity-60",
    "[&_svg]:w-5 [&_svg]:h-5",
  ],
  {
    variants: {
      // Color variants (피그마의 Color 속성)
      color: {
        // Default: 흰색 배경 + 파란색 테두리 + 파란색 텍스트
        default: [
          "bg-transparent",
          "border border-primary-PR600",
          "text-primary-PR600",
          // "hover:bg-primary-PR100",
          // "active:bg-primary-PR200",
          // "focus:ring-primary-PR300",
          "backdrop-blur-sm",
        ],

        // Fill: 파란색 배경 + 흰색 텍스트
        fill: [
          "bg-primary-PR", // #75C0EF
          "border-0",
          "text-neutral-N0", // #FFFFFF
          // "hover:bg-primary-PR600", // hover state
          // "active:bg-primary-PR400", // active state
          "focus:ring-primary-PR300",
        ],

        // Trans: 투명 배경 + 회색 테두리 + 회색 텍스트
        trans: [
          "bg-neutralAlpha-NA05", // rgba(28, 31, 37, 0.05)
          "border border-neutral-N400", // #C8CDD9
          "text-neutral-N800", // #4B5162
          // "hover:bg-neutralAlpha-NA10", // hover state
          // "active:bg-neutralAlpha-NA20", // active state
          "focus:ring-neutral-N400",
        ],
      },

      disabled: {
        true: [
          "bg-neutral-N400", // #C8CDD9
          "border-0",
          "text-neutral-N0", // #FFFFFF
          "cursor-not-allowed",
          "opacity-60",
          // "hover:bg-neutral-N400 active:bg-neutral-N400",
        ],
        false: "",
      },
    },

    // 기본값 설정
    defaultVariants: {
      color: "default",
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, color, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ color, className, disabled: props.disabled })
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
