"use client";




import React, { useState } from 'react';

import '../../app/style.css';


import { Combobox } from '../combobox';
import { DatePickerDemo } from './DatePicker';
import { Button } from './button';




function Bookingform() {
  
  const [hall, setHall] = useState('');


  const [eventType, setEventType] = useState('');

  const [organizedBy, setOrganizedBy] = useState('');
const [description, setDescription] = useState('');
const [attendance, setAttendance] = useState('');
const [startTime, setStartTime] = useState('');
const [endTime, setEndTime] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
const [specialRequest, setSpecialRequest] = useState('');

  

  
  const eventtype = [
    { value: 'seminar', label: 'Seminar' },
    { value: 'workshop', label: 'work shop' },
    { value: 'confference', label: 'confference' },
    { value: 'prizegiving', label: 'prize giving' },
    { value: 'consert', label: 'consert' },
  ];

  const hallOptions = [
    { value: 'ABH1', label: 'ABH1' },
    { value: 'ABH2', label: 'ABH2' },
    { value: 'ABH3', label: 'ABH3' },
    { value: 'ABH4', label: 'ABH4' },
  ];

  const clearForm = () => {
    
    setHall('');
    setEventType('');
    setOrganizedBy('');
    setDescription('');
    setAttendance('');
    setStartTime('');
    setEndTime('');
    setEmail('');
    setPhone('');
    setSpecialRequest('');
  };
  
 

  

  return (
    <div className="container">
      <form className="bookingform">
        <h1 className="bookingtitle">Hall Booking Form</h1>
 <p className='para'>Submit key details for your event to complete your booking efficiently.</p>
       

        <div className="field-container">
          <label className="bookinglabel">Name</label>
          <input type="text" placeholder="Dream Big 2025 Conference" className="bookinginput" required />
        </div>

        <div className="field-container">
          <label className="bookinglabel">Event Type</label>
          <Combobox
            options={eventtype}
            placeholder="Choose from Seminar, Workshop, Conference..."
            value={eventType}
            onChange={setEventType}
          />
        </div>

        <div className="field-container">
          <label className="bookinglabel">Organized By</label>
          <input type="text" placeholder= "Innovative Society"className="bookinginput"  value={organizedBy}
    onChange={(e) => setOrganizedBy(e.target.value)} required/>
          
        </div>

        <div className="field-container">
          <label className="bookinglabel">Event Description</label>
          <input type="text" className='bookinginput2' placeholder='An inspiring event that brings creative minds together.' value={description}
    onChange={(e) => setDescription(e.target.value)}/>
        </div>

        
<div className="field-container">
          <label className="bookinglabel">Number of Attendance</label>
          <input type="text" placeholder="100" className="bookinginput"value={attendance}
    onChange={(e) => setAttendance(e.target.value)} required/>
        </div>


        <div className="field-container">
          <label className="bookinglabel">Date</label>
        <DatePickerDemo />
        </div>

        <div className="field-container">
          <label className="bookinglabel">Start Time</label>
          <input type="text" placeholder="10.30 am" className="bookinginput"   value={startTime}
    onChange={(e) => setStartTime(e.target.value)} required />
        </div>

        <div className="field-container">
          <label className="bookinglabel">End Time</label>
          <input type="text" placeholder="1.00pm" className="bookinginput"   value={endTime}
    onChange={(e) => setEndTime(e.target.value)}  required/>
        </div>

        <div className="field-container">
          <label className="bookinglabel">Hall/Location</label>
          <Combobox
            options={hallOptions}
            placeholder="AB-LCH-01"
            value={hall}
            onChange={setHall}
          />
        </div>

        <div className="field-container">
          <label className="bookinglabel">Contact Email</label>
          <input type="email" placeholder="example@domain.com" className="bookinginput"  value={email}
    onChange={(e) => setEmail(e.target.value)}  required/>
        </div>

        <div className="field-container">
          <label className="bookinglabel">Contact Phone</label>
          <input type="phone" placeholder="(123) 456-7890" className="bookinginput"  value={phone}
    onChange={(e) => setPhone(e.target.value)} required/>
        </div>

        <div className="field-container">
          <label className="bookinglabel">Special Request</label>
          <input type="text" className='bookinginput2' placeholder='Please arrange extra chairs.'  value={specialRequest}
    onChange={(e) => setSpecialRequest(e.target.value)}/>
        </div>
       
<div  className="field-container">
<Button className='clearbut'onClick={clearForm} >Clear Form</Button>
<Button className='submitbut'>Submit Booking</Button>
</div>
      

       
      </form>
    </div>
  );
}

export default Bookingform;
