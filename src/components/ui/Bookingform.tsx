import React from 'react';
import  '../../app/style.css';
import '../combobox';
import './button';

function Bookingform() {
    return (
      <div className='container'>
        <form className='bookingform'>
          <h1 className='bookingtitle'>Hall Booking Form</h1>
  
          <div className='field-container'>
            <label className='bookinglabel'>Name</label>
            <input type="text" placeholder='Name' className='bookinginput' />
          </div>



        <div className='field-container'>
            <label className='bookinglabel'>Hall</label>
            <input type="text" placeholder='Select Hall' className='bookinginput' />
          </div>
  
          <div className='field-container'>
            <label className='bookinglabel'>Date</label>
            <input type="text" placeholder='Select Date' className='bookinginput' />
          </div>
  
          <div className='field-container'>
            <label className='bookinglabel'>Time From</label>
            <input type="text" placeholder='Select Time' className='bookinginput' />
          </div>
  
          <div className='field-container'>
            <label className='bookinglabel'>Time To</label>
            <input type="text" placeholder='Select Time' className='bookinginput' />
          </div>

          <div className='field-container'>
            <label className='bookinglabel'>Reason</label>
            <input type="text" placeholder='Type your reason here' className='bookinginput2' />
          </div>

     <button className='button'>Submit</button>


        </form>
      </div>
    );
  }
  
  export default Bookingform;
  
