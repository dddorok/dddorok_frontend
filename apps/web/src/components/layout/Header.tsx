"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDownIcon, LogOut, Settings, User, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

import { ROUTE } from "@/constants/route";
import { deleteSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { userQueries } from "@/queries/users";
import { UserType } from "@/services/user";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const { data: myInfo } = useQuery(userQueries.myInfo());
  console.log("myInfo: ", myInfo);

  return (
    <>
      <div
        className={cn(
          "border-b  w-full bg-neutral-N0 border-neutral-N100 shadow-[0px_4px_4px_0px_var(--Neutral-N100, #F5F7FA)]",
          "fixed top-0 left-0 right-0 z-50",
          "px-8",
          className
        )}
      >
        <div className="flex flex-col items-start flex-1 container">
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
              <Link href={ROUTE.HOME}>
                <Image
                  src="/logo/logo-01.svg"
                  alt="logo"
                  width={104}
                  height={42}
                  priority
                />
              </Link>
              <ul className="flex gap-16 items-center text-neutral-N800 text-medium-r">
                <li>
                  <Link href={ROUTE.TEMPLATE}>템플릿</Link>
                </li>
                <li>
                  <Link href={ROUTE.PRICING}>요금제</Link>
                </li>
              </ul>
            </div>
            {!myInfo ? (
              <div className="flex gap-2">
                <Button asChild>
                  <Link href={ROUTE.LOGIN}>로그인</Link>
                </Button>
                <Button color="fill">회원가입</Button>
              </div>
            ) : (
              <UserMenuDropdown user={myInfo.user} />
            )}
          </div>
        </div>
      </div>
      <div className={cn("header-blank", "h-[var(--header-height)]")}></div>
    </>
  );
}

function UserMenuDropdown(props: { user: UserType }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-1 items-center text-primary-PR600 h-[52px]">
          <User2 className="w-6 h-6" />
          <div className="text-medium-b">{props.user.username}</div>
          <ChevronDownIcon className="w-4 h-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[180px]" align="end">
        <DropdownMenuItem asChild>
          <Link href={ROUTE.MYPAGE.PROJECT()}>
            <User />내 프로젝트
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings /> 설정
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-neutral-N700"
          onClick={async () => {
            await deleteSession();
            queryClient.removeQueries();
            router.replace(ROUTE.HOME);
          }}
        >
          <LogOut />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
