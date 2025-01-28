import {
  Table,
  TableBody,
  TableCaption,
  // TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FaInfoCircle } from "react-icons/fa";

export default function Home() {
  return (
    <div style={{  justifyContent: 'center', alignItems: 'center', height: '100vh',padding:'20px' }}>
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "18px",
          padding: "10px",
          backgroundColor: "#f4f4f4",
          margin: "20px auto",
          marginTop:"2%",
          width: "60%",
          border: "1px solid #ddd",
        }}
      >
        Hall Details
      </div>

      
      <Table style={{width:'60%',borderCollapse:'collapse',marginLeft:'20%',marginTop:'1%',height:'30%'}}>
  
  <TableHeader style={{backgroundColor:'#f4f4f4'}}>
    <TableRow >
      <TableHead style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>Hall</TableHead>
      <TableHead style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>Capacity</TableHead>
      <TableHead style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>Status</TableHead>
      <TableHead style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow style={{ borderBottom: '1px solid #ddd' }}>
      <TableCell style={{padding:'12px',color:'#555',textAlign:'center'}}>AB-LCH-1</TableCell>
      <TableCell style={{padding:'12px',color:'#555',textAlign:'center'}}>50</TableCell>
      <TableCell style={{padding:'12px',color:'#555',textAlign:'center'}}>Available</TableCell>
      <TableCell style={{padding:'12px',color:'#555', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <FaInfoCircle size={24} />
      </TableCell>
    </TableRow>
    <TableRow style={{ borderBottom: '1px solid #ddd' }}>
      <TableCell style={{padding:'12px',color:'#555',textAlign:'center'}}>AB-LCH-1</TableCell>
      <TableCell style={{padding:'12px',color:'#555',textAlign:'center'}}>50</TableCell>
      <TableCell style={{padding:'12px',color:'#555',textAlign:'center'}}>Available</TableCell>
      <TableCell style={{padding:'12px',color:'#555', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <FaInfoCircle size={24} />
      </TableCell>
    </TableRow>
    <TableRow style={{ borderBottom: '1px solid #ddd' }}>
      <TableCell style={{padding:'12px',color:'#555',textAlign:'center'}}>AB-LCH-1</TableCell>
      <TableCell style={{padding:'12px',color:'#555',textAlign:'center'}}>50</TableCell>
      <TableCell style={{padding:'12px',color:'#555',textAlign:'center'}}>Available</TableCell>
      <TableCell style={{padding:'12px',color:'#555', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <FaInfoCircle size={24} />
      </TableCell>
    </TableRow>
    <TableRow style={{ borderBottom: '1px solid #ddd' }}>
      <TableCell style={{padding:'12px',color:'#555',textAlign:'center'}}>AB-LCH-1</TableCell>
      <TableCell style={{padding:'12px',color:'#555',textAlign:'center'}}>50</TableCell>
      <TableCell style={{padding:'12px',color:'#555',textAlign:'center'}}>Available</TableCell>
      <TableCell style={{padding:'12px',color:'#555', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <FaInfoCircle size={24} />
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
<div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "18px",
          padding: "10px",
          backgroundColor: "#f4f4f4",
          margin: "20px auto",
          marginTop:"3%",
          width: "60%",
          border: "1px solid #ddd",
        }}
      >
        Upcoming Activities
      </div>
<Table style={{width:'60%',borderCollapse:'collapse',marginLeft:'20%',marginTop:'1%',height:'20%'}}>

  <TableHeader style={{backgroundColor:'#f4f4f4'}}>
    
    <TableRow>
      <TableHead style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>Activity</TableHead>
      <TableHead style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>Date</TableHead>
      <TableHead style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>Time</TableHead>
      <TableHead style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>Action</TableHead>
    </TableRow>

  </TableHeader>
  <TableBody>
    <TableRow style={{ borderBottom: '1px solid #ddd' }}>
      <TableCell style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>Seminar 1</TableCell>
      <TableCell style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>2025/01/01</TableCell>
      <TableCell style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>10.00 AM</TableCell>
      <TableCell style={{padding:'12px',color:'#555', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <FaInfoCircle size={24} />
      </TableCell>

    </TableRow>
    <TableRow style={{ borderBottom: '1px solid #ddd' }}>
      <TableCell style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>Seminar 1</TableCell>
      <TableCell style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>2025/01/01</TableCell>
      <TableCell style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>10.00 AM</TableCell>
      <TableCell style={{padding:'12px',color:'#555', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <FaInfoCircle size={24} />
      </TableCell>

    </TableRow>
    <TableRow style={{ borderBottom: '1px solid #ddd' }}>
      <TableCell style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>Seminar 1</TableCell>
      <TableCell style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>2025/01/01</TableCell>
      <TableCell style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>10.00 AM</TableCell>
      <TableCell style={{padding:'12px',color:'#555', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <FaInfoCircle size={24} />
      </TableCell>

    </TableRow>
    <TableRow style={{ borderBottom: '1px solid #ddd' }}>
      <TableCell style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>Seminar 1</TableCell>
      <TableCell style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>2025/01/01</TableCell>
      <TableCell style={{padding:'12px',textAlign:'center',fontWeight:'bold',color:'#333',fontSize:'15px'}}>10.00 AM</TableCell>
      <TableCell style={{padding:'12px',color:'#555', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <FaInfoCircle size={24} />
      </TableCell>

    </TableRow>
  </TableBody>
  
</Table>



    </div>
  );
}
