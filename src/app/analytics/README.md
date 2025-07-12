# Analytics Dashboard

## Overview

The Analytics Dashboard provides comprehensive insights into the HallEase system usage, including hall bookings, event trends, and system performance metrics.

## Features

### 📊 Key Metrics

- **Total Bookings**: Current month's booking count with trend indicators
- **Active Users**: Number of users who made bookings
- **Available Halls**: Total halls in the system
- **Approval Rate**: Percentage of approved bookings
- **Average Response Time**: Time taken to process bookings
- **System Issues**: Count of open technical issues

### 📈 Charts and Visualizations

#### Usage Tab

- **Hall Usage Chart**: Monthly trends showing bookings, events, and lectures
- **Popular Halls Chart**: Ranked list of most booked halls with capacity information

#### Events Tab

- **Event Type Distribution**: Pie chart showing breakdown of conferences, seminars, workshops, and events
- **Event Status Distribution**: Current status of all events (approved, pending, rejected, waiting)

#### Trends Tab

- **Daily Usage Pattern**: Area chart showing hall usage throughout the day
- **Weekly Comparison**: Comparison metrics between current and previous week

#### Performance Tab

- **System Performance**: Response time, uptime, active sessions, and error rate
- **User Engagement**: Daily, weekly, and monthly active users with retention rate

### 🔧 Interactive Features

#### Filters

- **Date Range**: Filter data by custom date ranges
- **Hall Selection**: Filter by specific halls
- **Event Type**: Filter by event types (conference, seminar, workshop, etc.)
- **Status**: Filter by booking status (approved, pending, rejected, waiting)

#### Export Options

- **CSV Export**: Download analytics data in CSV format
- **PDF Export**: Generate PDF reports (feature ready for implementation)

#### Real-time Updates

- **Refresh Button**: Manually refresh all analytics data
- **Loading States**: Visual feedback during data loading

## Technical Implementation

### Components Structure

```
src/
├── app/analytics/
│   └── page.tsx                 # Main analytics page
├── components/ui/
│   ├── analytics-charts.tsx     # Chart components
│   ├── analytics-filters.tsx    # Filter components
│   └── metrics-cards.tsx        # Metric cards
└── lib/
    └── analytics.ts             # Data fetching utilities
```

### Technologies Used

- **React**: Frontend framework
- **Recharts**: Chart library for data visualization
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **TypeScript**: Type safety

### Data Sources

The analytics dashboard is designed to work with your existing Supabase database tables:

- `reserve`: For booking data
- `event`: For event information
- `extra_lecture`: For lecture data
- `profiles`: For user information
- `hall`: For hall information

## Future Enhancements

### Real Database Integration

To connect to your actual Supabase database, update the `fetchAnalyticsData` function in `src/lib/analytics.ts`:

```typescript
// Example: Fetch hall usage data
export async function fetchHallUsageData(startDate: string, endDate: string) {
	const { data, error } = await supabase
		.from('reserve')
		.select(
			`
      date,
      hall,
      type,
      status,
      event(type),
      extra_lecture(type)
    `
		)
		.gte('date', startDate)
		.lte('date', endDate)
		.eq('status', 'approved');

	if (error) throw error;
	return data;
}
```

### Additional Features

- **Advanced Filters**: Department-wise filtering, organizer-based filtering
- **Custom Date Ranges**: Preset ranges (last 7 days, last month, etc.)
- **Drill-down Analytics**: Click on charts to see detailed breakdowns
- **Alerts and Notifications**: Set up alerts for unusual patterns
- **Scheduled Reports**: Automated report generation and email delivery
- **Mobile Responsiveness**: Enhanced mobile experience
- **Data Caching**: Improve performance with data caching strategies

### Performance Optimization

- **Pagination**: For large datasets
- **Lazy Loading**: Load charts on demand
- **Data Compression**: Optimize data transfer
- **Caching**: Client-side caching for frequently accessed data

## Usage

1. **Access the Analytics Dashboard**: Navigate to `/analytics` in your application
2. **Apply Filters**: Use the filter panel to narrow down your data
3. **Explore Charts**: Switch between different tabs to view various analytics
4. **Export Data**: Use the export buttons to download data in CSV or PDF format
5. **Refresh Data**: Click the refresh button to get the latest data

## Maintenance

- **Regular Updates**: Keep chart data updated with real-time or scheduled refreshes
- **Performance Monitoring**: Monitor query performance and optimize as needed
- **User Feedback**: Gather feedback to improve the analytics experience
- **Data Validation**: Ensure data accuracy and consistency

## Support

For technical support or feature requests related to the analytics dashboard, please refer to your project's issue tracking system or contact the development team.
