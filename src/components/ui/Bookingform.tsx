"use client";

import React, { use, useState } from 'react';
import '../../app/style.css';
import './button';
import { Combobox } from '../combobox';


function Bookingform() {
  // States to store selected values
  const [hall, setHall] = useState('');
  const [date, setDate] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [reason, setReason] = useState('');

  // Options for each field
  const hallOptions = [
    { value: 'hall01', label: 'Hall 01' },
    { value: 'hall02', label: 'Hall 02' },
    { value: 'hall03', label: 'Hall 03' },
    { value: 'hall04', label: 'Hall 04' },
    { value: 'hall05', label: 'Hall 05' },
  ];

  const dateOptions = [
    { value: '2025-01-25', label: '2025-01-25' },
    { value: '2025-01-26', label: '2025-01-26' },
    { value: '2025-01-27', label: '2025-01-27' },
    { value: '2025-01-28', label: '2025-01-28' },
  ];

  const timeOptions = [
    { value: '09:00', label: '09:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '01:00', label: '01:00 PM' },
  ];

  

  return (
    <div className="container">
      <form className="bookingform">
        <h1 className="bookingtitle">Hall Booking Form</h1>

        <div className="field-container">
          <label className="bookinglabel">Name</label>
          <input type="text" placeholder="Name" className="bookinginput" />
        </div>

        <div className="field-container">
          <label className="bookinglabel">Hall</label>
          <Combobox
            options={hallOptions}
            placeholder="Select Hall"
            value={hall}
            onChange={setHall}
          />
        </div>

        <div className="field-container">
          <label className="bookinglabel">Date</label>
          <Combobox
            options={dateOptions}
            placeholder="Select Date"
            value={date}
            onChange={setDate}
          />
        </div>

        <div className="field-container">
          <label className="bookinglabel">Time From</label>
          <Combobox
            options={timeOptions}
            placeholder="Select Time"
            value={timeFrom}
            onChange={setTimeFrom}
          />
        </div>

        <div className="field-container">
          <label className="bookinglabel">Time To</label>
          <Combobox
            options={timeOptions}
            placeholder="Select Time"
            value={timeTo}
            onChange={setTimeTo}
          />
        </div>

        <div className="field-container">
          <label className="bookinglabel">Reason</label>
          <input type="text" className='bookinginput2' placeholder='Enter the reason'/>
        </div>

        <button className="button">Submit</button>
      </form>
    </div>
  );
}

export default Bookingform;
