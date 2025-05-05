"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "./sidebar-nav";
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  Sidebar,
  SidebarProvider,
} from "../ui/sidebar";

const data = {
  navMain: [{ title: "관리자 시스템", url: "#", items: navItems }],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <Sidebar {...props} collapsible="icon">
        <SidebarHeader />
        <SidebarContent>
          {data.navMain.map((item) => (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items.map((item) => {
                    const isActive = pathname.startsWith(item.url);
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link
                            href={item.url}
                            aria-label={item.title}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? "bg-accent" : "hover:bg-accent/50"}`}
                          >
                            <item.Icon />
                            {item.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}
