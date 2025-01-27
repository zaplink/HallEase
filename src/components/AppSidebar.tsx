"use client"

import { LayoutDashboard, Building2, Airplay } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

const menuItems = [
    {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard
    },
    {
        title: "Hall Manage",
        url: "/test",
        icon: Building2
    },
    {
        title: "Event Manage",
        url: "/event",
        icon: Airplay
    },
];

export default function AppSidebar() {
    const currentPath = usePathname();

    return(
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {menuItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={currentPath==item.url}>
                                    <a href={'http://localhost:3000' + item.url} className="flex flex-row justify-left">
                                        <item.icon size={20} className="mr-5"/>
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}