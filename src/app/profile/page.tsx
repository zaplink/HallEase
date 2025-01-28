import {
    Table,
    TableBody,
    TableCell,
    TableRow,
  } from "@/components/ui/table"

import ChangePasswordForm from "@/components/ui/ChangePasswordForm";

  
export default function Profile(){
    return (
    <div style={{  justifyContent: 'center', alignItems: 'center', height: '100vh',padding:'20px',width:'100vw',display: 'flex' }}>

        <div style={{ width: '50vw' }}>
        <Table style={{borderCollapse:'collapse',fontSize:'15px'}}>
           <TableBody>
                <TableRow>
                    <TableCell className="font-medium">User ID</TableCell>
                    <TableCell className="text-left">1002</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">User Name</TableCell>
                    <TableCell className="text-left">John Doe</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Email</TableCell>
                    <TableCell className="text-left">exampl@domain.com</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Phone</TableCell>
                    <TableCell className="text-left">0123456789</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Role</TableCell>
                    <TableCell className="text-left">Hall Manager</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">Permissions</TableCell>
                    <TableCell className="text-left">approve/reject bookingsadd new halls</TableCell>
                </TableRow>
            </TableBody>
        </Table>
        </div>
        
        <div style={{ width: '50vw' }}>
        <ChangePasswordForm />
        </div>

    </div>

    );
}