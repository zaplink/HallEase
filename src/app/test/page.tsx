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

export default function Test() {
    return(
        <SidebarProvider>
            <AppSidebar/>
            <div className="w-full">
                <div className="w-full py-4 px-2 flex flex-row items-center">
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
                <div className="p-4">
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