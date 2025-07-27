# Role-Based Dashboard Implementation

This implementation provides different dashboard views based on user roles fetched from the `profiles` table.

## Features

### Admin Dashboard (`/dashboard` for ADMIN role)

- **Full KPI Cards**: Total Bookings, Pending Approvals, Occupancy Rate, Completed Bookings
- **Advanced Charts**: All chart types including trends, pie charts, donut charts
- **Detailed Analytics**: Recent activity, hall status, utilization metrics
- **Additional Stats**: Rejected bookings, average utilization, available halls, peak usage hours

### User Dashboard (`/dashboard` for USER role)

- **Simplified View**: Focus on essential charts and data
- **Core Charts**: Booking trends, status charts, hall utilization
- **Recent Information**: Recent bookings and hall status
- **No Administrative KPIs**: Removes admin-specific metrics for cleaner user experience

## Implementation Details

### Files Created/Modified:

1. **`src/lib/fetchProfileServer.ts`** - Server-side profile fetching with role
2. **`src/components/custom/AdminDashboard.tsx`** - Full admin dashboard component
3. **`src/components/custom/UserDashboard.tsx`** - Simplified user dashboard component
4. **`src/components/custom/RoleIndicator.tsx`** - Visual indicator of current role and dashboard type
5. **`src/app/dashboard/page.tsx`** - Updated main dashboard page with role-based rendering
6. **`src/types/profile.ts`** - Added ProfileWithRole type

### Role Logic:

- **ADMIN**: Gets the full-featured dashboard with all KPI cards and admin features
- **USER, GUEST, SYSTEM**: Gets the simplified dashboard focused on basic charts and information
- **Error Handling**: Displays error message if profile cannot be fetched

### Database Requirements:

- Uses existing `profiles` table with `role` field
- Requires user to be authenticated and have a profile record
- Supports roles: `GUEST`, `USER`, `ADMIN`, `SYSTEM` (as defined in database schema)

## Usage

The dashboard automatically detects the user's role from the database and renders the appropriate view. Users don't need to navigate to different URLs - the same `/dashboard` route shows different content based on their role.

## Testing

To test different roles:

1. Update a user's role in the `profiles` table in your database
2. Log in as that user
3. Navigate to `/dashboard`
4. The role indicator at the top will show which dashboard view is active
