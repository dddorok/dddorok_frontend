"use client";

import {
  Ruler,
  BarChart3,
  LayoutTemplate,
  Users,
  FileText,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export interface SidebarNavItem {
  title: string;
  url: string;
  Icon: LucideIcon;
}

export const navItems: SidebarNavItem[] = [
  {
    title: "개발자 가이드",
    url: "/",
    Icon: FileText,
  },
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
];
