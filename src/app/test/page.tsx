import SidebarLayout from "@/layouts/SidebarLayout";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Info } from "lucide-react";

export default function Test() {
    return (
        // Sidebar layout
        <SidebarLayout side="left">
            <div className="mb-6 flex flex-row">
                {/* Search halls */}
                <Input placeholder="Search Halls" />
            </div>

            {/* Table */}
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
                        <TableCell>
                            <Info size={20} />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>AB-LCH-02</TableCell>
                        <TableCell>50</TableCell>
                        <TableCell>Booked</TableCell>
                        <TableCell>
                            <Info size={20} />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </SidebarLayout>
    );
}
