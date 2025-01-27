"use client"

import { LayoutDashboard, Building2, Airplay, LogOut, TestTubeDiagonal } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader,
    SidebarFooter,
    SidebarGroupLabel,
    SidebarGroupContent
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";


const menuItems = [
    {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard
    },
    {
        title: "Hall Manage",
        url: "/hall",
        icon: Building2
    },
    {
        title: "Event Manage",
        url: "/event",
        icon: Airplay
    },
];

interface AppSidebarProps {
    side: "left" | "right";
}

export default function AppSidebar({ side }: AppSidebarProps) {
    const currentPath = usePathname();

    return(
        <Sidebar side={side}>
            <SidebarHeader>
            <SidebarMenu>
                    <SidebarMenuItem>
                    <SidebarMenuButton className="h-auto">
                        <Avatar className="mr-5">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <a href={'http://localhost:3000/profile'} className="flex flex-row justify-left">
                            <span className="font-bold">John Doe</span>
                        </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <Separator />

            <SidebarContent>

            <SidebarGroup>
                    <SidebarGroupLabel>Testing</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem key="test">
                                <SidebarMenuButton asChild isActive={currentPath=="/test"}>
                                    <a href={'http://localhost:3000/test'} className="flex flex-row justify-left">
                                        <TestTubeDiagonal size={20} className="mr-5"/>
                                        <span>Testing Page</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent> 
                </SidebarGroup>


                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
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
                    </SidebarGroupContent> 
                </SidebarGroup>

            </SidebarContent>

            <Separator />

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                            <a href={'http://localhost:3000/login'} className="flex flex-row justify-left">
                                <LogOut size={20} className="mr-5 text-red-500"/>
                                <span className="text-red-500">Logout</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}