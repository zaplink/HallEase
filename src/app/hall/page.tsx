import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FaInfoCircle } from "react-icons/fa";

export default function Home() {
  return (
    <div style={{  justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      
      <Table >
  
  <TableHeader >
    <TableRow >
      <TableHead >Hall</TableHead>
      <TableHead >Capacity</TableHead>
      <TableHead >Status</TableHead>
      <TableHead >Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow >
      <TableCell >AB-LCH-1</TableCell>
      <TableCell >50</TableCell>
      <TableCell >Available</TableCell>
      <TableCell >
        <FaInfoCircle size={24} />
      </TableCell>
    </TableRow>
    <TableRow >
      <TableCell >AB-LCH-1</TableCell>
      <TableCell >50</TableCell>
      <TableCell >Available</TableCell>
      <TableCell >
        <FaInfoCircle size={24} />
      </TableCell>
    </TableRow>
    <TableRow >
      <TableCell >AB-LCH-1</TableCell>
      <TableCell >50</TableCell>
      <TableCell >Available</TableCell>
      <TableCell >
        <FaInfoCircle size={24} />
      </TableCell>
    </TableRow>
    <TableRow >
      <TableCell >AB-LCH-1</TableCell>
      <TableCell >50</TableCell>
      <TableCell >Available</TableCell>
      <TableCell >
        <FaInfoCircle size={24} />
      </TableCell>
    </TableRow>
  </TableBody>
</Table>



    </div>
  );
}
