import { ChevronDownIcon } from "lucide-react";

import { Button } from "../ui/button";

import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <>
      <div
        className={cn(
          "border-b  w-full",
          "fixed top-0 left-0 right-0 z-50",
          "px-8",
          className
        )}
      >
        <div className="flex flex-col items-start flex-1 max-w-[1204px] mx-auto w-full">
          <div className="flex justify-end pt-4 w-full">
            <ul className="flex gap-5 items-center text-small text-neutral-N600">
              <li>About Us</li>
              <li className="flex items-center gap-1">
                한국어 <ChevronDownIcon className="w-4 h-4" />
              </li>
            </ul>
          </div>
          <div className="flex justify-between items-center py-5 w-full">
            <div className="flex gap-10">
              <div>
                <img
                  src="/logo/logo-01.svg"
                  alt="logo"
                  width={104}
                  height={42}
                />
              </div>
              <ul className="flex gap-16 items-center text-neutral-N800 text-medium-r">
                <li>템플릿</li>
                <li>요금제</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button>로그인</Button>
              <Button color="fill">회원가입</Button>
            </div>
          </div>
        </div>
      </div>
      <div className={cn("header-blank", "h-[var(--header-height)]")}></div>
    </>
  );
}
