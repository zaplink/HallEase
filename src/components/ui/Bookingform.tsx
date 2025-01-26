"use client";

import React, { use, useState } from 'react';
import '../../app/style.css';
import './button';
import { Combobox } from '../combobox';
import { DatePickerDemo } from './DatePicker';
import { Button } from './button';




function Bookingform() {
  // States to store selected values
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
  
  

  // Options for each field
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
          <input type="text" placeholder= "Innovative Society"className="bookinginput" required/>
          
        </div>

        <div className="field-container">
          <label className="bookinglabel">Event Description</label>
          <input type="text" className='bookinginput2' placeholder='An inspiring event that brings creative minds together.'/>
        </div>

        
<div className="field-container">
          <label className="bookinglabel">Number of Attendance</label>
          <input type="text" placeholder="100" className="bookinginput" required/>
        </div>


        <div className="field-container">
          <label className="bookinglabel">Date</label>
        <DatePickerDemo />
        </div>

        <div className="field-container">
          <label className="bookinglabel">Start Time</label>
          <input type="text" placeholder="10.30 am" className="bookinginput" required />
        </div>

        <div className="field-container">
          <label className="bookinglabel">End Time</label>
          <input type="text" placeholder="1.00pm" className="bookinginput" required/>
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
          <input type="email" placeholder="example@domain.com" className="bookinginput" required/>
        </div>

        <div className="field-container">
          <label className="bookinglabel">Contact Phone</label>
          <input type="phone" placeholder="(123) 456-7890" className="bookinginput" required/>
        </div>

        <div className="field-container">
          <label className="bookinglabel">Special Request</label>
          <input type="text" className='bookinginput2' placeholder='Please arrange extra chairs.'/>
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
