"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import '../style.css';
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {
    Table,
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from "@/components/ui/table";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar";
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';

export default function Test() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const toggleCalendar = () => {
        setIsCalendarVisible((prevState) => !prevState);  // Toggle the calendar visibility
    };

    return(
        <SidebarProvider>
            <AppSidebar side="left"/>
            <div className="w-full">
                <div className="w-full py-4 px-2 flex flex-row items- justify-between">
                    <div className="flex flex-row items-center">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="h-5 mx-6"/>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage>System</BreadcrumbPage>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Test</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    </div>

                    <div>
                    <Button onClick={toggleCalendar} variant="secondary">
                        <CalendarIcon size={20} />
                    </Button>
                    </div>
                    
                </div>
                <div className="relative w-full">
                {isCalendarVisible && (<Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border absolute bg-white z-10 top-0 right-2"
                    />) }
                </div>
                <div className="px-2 flex flex-col h-full">
                    <div className="mb-6 flex flex-row">
                        <Input placeholder="Search Halls" />
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Hall ID</TableHead>
                                <TableHead>Capacity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>AB-LCH-01</TableCell>
                                <TableCell>100</TableCell>
                                <TableCell>Available</TableCell>
                                <TableCell><Info size={20}/></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>AB-LCH-02</TableCell>
                                <TableCell>50</TableCell>
                                <TableCell>Booked</TableCell>
                                <TableCell><Info size={20}/></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                </div>

            </div>
        </SidebarProvider>
    );
}