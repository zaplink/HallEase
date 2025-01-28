"use client";

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export default function ChangePasswordForm() {

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px',fontWeight:'bold',fontSize:'20px' }}>Change Password</h2>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '300px',
          margin: '0 auto',
          gap: '15px',
        }}
      >  
        <Label htmlFor="Old Password"style={labelStyle}>Old Password</Label>
        <Input type="password"
          name="oldPassword"
          placeholder="Old Password"
          style={inputStyle}/>

        <Label htmlFor="New Password"style={labelStyle}>New Password</Label>
        <Input type="password"
          name="newPassword"
          placeholder="New Password"
          style={inputStyle} />

        <Label htmlFor="New Password"style={labelStyle}>Re-Enter New Password</Label>
        <Input type="password"
          name="confirmPassword"
          placeholder="New Password"
          style={inputStyle}/>

        <Button variant="outline" style={buttonStyle}>Change Password</Button>
      </form>
    </div>
  );
}


const labelStyle = {
    fontSize: '14px',
  };

const inputStyle = {
  padding: '10px',
  fontSize: '14px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  marginBottom: '12px',
  width: '100%',
};

const buttonStyle = {
  padding: '10px',
  fontSize: '16px',
  color: '#fff',
  backgroundColor: 'black',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};
