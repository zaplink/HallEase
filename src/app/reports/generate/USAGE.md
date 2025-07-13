# Hall Usage Report Generator - User Guide

## Overview

The Hall Usage Report Generator allows users to create comprehensive Excel reports showing all usage of a specific hall for any given time period. The report includes approved reservations, events, extra lectures, and general lectures.

## How to Access

1. Navigate to **Reports** from the main sidebar
2. Click the **"Generate Hall Usage Report"** button (green button)
3. Or go directly to `/reports/generate`

## How to Use

### Step 1: Select a Hall

- Click on the **"Select Hall"** dropdown
- Choose from available halls showing:
    - Hall code (e.g., FCT-LH1, FCT-CL1)
    - Hall type (Lecture Hall, Computer Lab, etc.)
    - Capacity information

### Step 2: Choose Date Range

- **From Date**: Select the start date for the report
- **To Date**: Select the end date for the report
- Default: Last 30 days

### Step 3: Generate Report

- Click **"Generate Report"** button
- The system will:
    - Fetch all approved reservations for the selected hall
    - Include general lecture schedules
    - Calculate usage statistics

### Step 4: Review Results

The generated report shows:

- **Summary Statistics**:
    - Total Reservations
    - Total Hours Used
    - Utilization Rate (%)
    - Average Attendees
- **Breakdown by Type**:
    - Events
    - Extra Lectures
    - General Lectures
- **Recent Reservations Preview** (first 10 entries)

### Step 5: Download Excel Report

- Click **"Download Excel"** button
- The Excel file contains 3 sheets:
    1. **Summary**: Hall info and usage statistics
    2. **Reservations**: Detailed list of all bookings
    3. **Daily Usage**: Day-by-day breakdown

## Excel Report Contents

### Summary Sheet

- Hall information (code, type, capacity, building, floor)
- Report period details
- Usage statistics
- Peak usage days

### Reservations Sheet

- Date and time of each booking
- Duration in hours
- Booking type (event, extra lecture, general lecture)
- Event/course name
- Booked by (user name)
- Number of attendees
- Status

### Daily Usage Sheet

- Date-wise breakdown
- Total hours per day
- Number of reservations per day
- Count by type (events, lectures, etc.)

## Data Sources

- **Real Reservations**: From database tables (`reserve`, `hall_assign`, `event`, `extra_lecture`)
- **Recurring General Lectures**: Generated from `general_lecture` table based on weekly schedules
    - If a lecture is scheduled on Monday, it will appear once per week in the report
    - For a 2-week period, Monday lectures will appear twice
    - For a 1-month period, Monday lectures will appear ~4 times
- **User Information**: From `profiles` table

## Features

- ✅ Real-time data from database
- ✅ Multiple hall types support
- ✅ Flexible date range selection
- ✅ Comprehensive Excel export
- ✅ Usage statistics and analytics
- ✅ Error handling and validation
- ✅ Responsive design

## Tips

- Choose appropriate date ranges for meaningful reports
- Larger date ranges may take longer to process
- Excel files include all data, even if preview shows only 10 rows
- Reports include both manual reservations and recurring general lecture schedules
- General lectures are automatically calculated based on weekly schedules:
    - 1 week period = 1 occurrence per scheduled day
    - 2 week period = 2 occurrences per scheduled day
    - 1 month period = ~4 occurrences per scheduled day
