"use client";

import {
  Ruler,
  BarChart3,
  LayoutTemplate,
  Users,
  FileText,
  User,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

const isDev = process.env.NODE_ENV === "development";

interface SidebarNavItem {
  title: string;
  url: string;
  Icon: LucideIcon;
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
    title: "치수 규칙 설정",
    url: "/measurement-rules",
    Icon: Ruler,
  },
  {
    title: "템플릿 관리",
    url: "/templates",
    Icon: LayoutTemplate,
  },
  {
    title: "차트 유형 관리",
    url: "/chart-types",
    Icon: BarChart3,
  },
  {
    title: "사용자 관리",
    url: "/users",
    Icon: Users,
  },
  ...(isDev ? devItems : []),
];
