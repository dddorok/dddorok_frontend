"use client";

import { Ruler, BarChart3, LayoutTemplate, User, Settings } from "lucide-react";

import type { LucideIcon } from "lucide-react";

const isDev = process.env.NODE_ENV === "development";

interface SidebarNavItem {
  title: string;
  url: string;
  Icon: LucideIcon;
  subItems?: SidebarNavItem[];
}

const devItems: SidebarNavItem[] = [
  {
    title: "로그인 테스트",
    url: "/oauth/login",
    Icon: User,
  },
];

export const navItems: SidebarNavItem[] = [
  {
    title: "인프라관리",
    url: "/measurement-rules",
    Icon: Ruler,
    subItems: [
      {
        title: "치수 규칙 목록",
        url: "/measurement-rules",
        Icon: Ruler,
      },
      {
        title: "차트 유형 목록",
        url: "/chart-types",
        Icon: BarChart3,
      },
    ],
  },
  {
    title: "템플릿 관리",
    url: "/templates",
    Icon: LayoutTemplate,
  },
  {
    title: "설정",
    url: "/settings",
    Icon: Settings,
  },
  // {
  //   title: "사용자 관리",
  //   url: "/users",
  //   Icon: Users,
  // },
  ...(isDev ? devItems : []),
];
