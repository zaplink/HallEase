# Hall Usage Report Generator

This feature allows administrators to generate comprehensive usage reports for any hall in the system.

## Features

### 📊 **Comprehensive Reporting**

- **Hall Selection**: Choose from all available halls via dropdown
- **Flexible Time Periods**: 1 week, 2 weeks, 1 month, 2 months, 3 months, 6 months, or 1 year
- **Multi-Source Data**: Combines approved reservations and general lecture schedules

### 📈 **Statistics Included**

- Total number of reservations
- Total hours of usage
- Utilization rate (percentage of available time used)
- Breakdown by reservation type (Events, Extra Lectures, General Lectures)
- Average number of attendees
- Peak usage days identification

### 📑 **Excel Export**

Multi-sheet Excel workbook containing:

1. **Summary Sheet**: Hall information and usage statistics
2. **Reservations Sheet**: Detailed list of all reservations
3. **Daily Usage Sheet**: Day-by-day usage breakdown

## Usage

### 🚀 **Accessing the Report Generator**

1. Navigate to **Reports** from the sidebar
2. Click **"Generate Hall Usage Report"** button (green button in navigation)
3. Or go directly to `/reports/generate`

### 📋 **Generating a Report**

1. **Select a Hall**: Choose from the dropdown list showing hall codes, types, and capacities
2. **Choose Time Period**: Select from 1 week up to 1 year
3. **Click "Generate Report"**: The system will fetch and process all relevant data
4. **Review Results**: View summary statistics and recent reservations preview
5. **Download Excel**: Click "Download Excel" for the complete detailed report

### 📊 **Report Contents**

#### Summary Statistics

- **Total Reservations**: Count of all approved bookings
- **Total Hours Used**: Sum of all reservation durations
- **Utilization Rate**: Percentage of maximum possible usage (based on 12 hours/day)
- **Average Attendees**: Mean attendance across all events

#### Breakdown by Type

- **Events**: User-initiated event bookings
- **Extra Lectures**: Additional academic sessions
- **General Lectures**: Regular course schedules

#### Data Sources

- **Real Reservations**: From the database (events and extra lectures)
- **General Lectures**: Generated based on typical academic schedules (for demonstration)

## Technical Implementation

### 🛠 **Technologies Used**

- **Frontend**: Next.js 15, React, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Excel Export**: XLSX library
- **State Management**: React hooks

### 🔧 **Key Components**

- Hall selection with real-time data fetching
- Date range calculation based on selected period
- Database queries with complex joins for reservation data
- Excel generation with multiple sheets and formatting
- Real-time progress indicators and error handling

### 📊 **Data Processing**

1. **Hall Data**: Fetched from `hall` table
2. **Reservations**: Complex join between `hall_assignment`, `reserve`, `event`, and `extra_lecture` tables
3. **User Information**: Linked through `profiles` table
4. **General Lectures**: Simulated based on hall type and academic schedule patterns

## File Structure

```
src/app/reports/generate/
├── page.tsx                 # Main report generator component
└── README.md               # This documentation

src/app/reports/
└── page.tsx                # Updated to include navigation button
```

## Dependencies

```json
{
	"xlsx": "^0.18.5", // Excel export functionality
	"lucide-react": "^x.x.x", // Icons
	"@radix-ui/react-select": "^x.x.x" // Dropdown components
}
```

## Usage Examples

### For Academic Planning

- Generate monthly reports to analyze classroom utilization
- Identify peak usage times for better scheduling
- Track attendance patterns across different hall types

### For Administrative Decisions

- Determine which halls are underutilized
- Plan maintenance schedules around usage patterns
- Allocate resources based on actual demand

### For Reporting

- Create usage summaries for management
- Export data for external analysis
- Track trends over different time periods

## Future Enhancements

- **Custom Date Ranges**: Allow users to specify exact start/end dates
- **Multiple Hall Comparison**: Generate reports for multiple halls simultaneously
- **Automated Scheduling**: Set up recurring report generation
- **Email Delivery**: Send reports automatically to administrators
- **Advanced Analytics**: Add charts and visualizations to the web interface
