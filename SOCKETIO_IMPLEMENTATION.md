# Socket.io Real-Time Communication Implementation

## Overview
Socket.io has been successfully integrated into the Employee Management System to enable real-time communication between admin and employee panels.

## Backend Setup

### Installation
```bash
npm install socket.io
```

### Server Configuration (Backend/server.js)
- Created HTTP server with `http.createServer(app)`
- Initialized Socket.io with CORS configuration
- Socket.io listens on the same port as Express (5000)
- CORS origin: `http://localhost:5174` (configurable via FRONTEND_URL env variable)

### Socket Events (Backend/server.js)
```javascript
// Admin joins their specific room
socket.on("admin:join", (adminId) => { ... })

// Employee joins their specific room
socket.on("employee:join", (employeeId) => { ... })

// Admins join dashboard room
socket.on("admin:joinDashboard", (adminId) => { ... })

// Employees join dashboard room
socket.on("employee:joinDashboard", (employeeId) => { ... })
```

### Socket Emitter Utility (Backend/utils/socketEmitter.js)
Created a utility module for emitting real-time events from services:

**Key Functions:**
- `initializeSocket(ioInstance)` - Initialize socket from server
- `emitToAdmin(adminId, event, data)` - Emit to specific admin
- `emitToEmployee(employeeId, event, data)` - Emit to specific employee
- `emitToAllAdmins(event, data)` - Broadcast to all admins
- `emitToAllEmployees(event, data)` - Broadcast to all employees
- `emitToAdminDashboard(adminId, event, data)` - Admin dashboard specific
- `emitToEmployeeDashboard(employeeId, event, data)` - Employee dashboard specific

### Service Integration

#### Payroll Service (Backend/services/payrollService.js)
**Real-time Events Emitted:**
- `payroll:created` - When new payroll is generated
- `payroll:updated` - When payroll is modified
- `payroll:statusUpdated` - When payment status changes
- `payroll:notified` - Notification sent to employee

**Data Sent:**
```javascript
{
  payrollId: String,
  employeeId: String,
  month: String,
  netSalary: Number,
  baseSalary: Number,
  paymentStatus: String,
  timestamp: Date,
  message: String
}
```

#### Employee Service (Backend/services/employeeService.js)
**Real-time Events Emitted:**
- `employee:created` - When new employee is added
- `employee:updated` - When employee information is updated

**Data Sent:**
```javascript
{
  employeeId: String,
  name: String,
  email: String,
  department: String,
  position: String,
  timestamp: Date,
  message: String
}
```

## Frontend Setup

### Installation
```bash
npm install socket.io-client
```

### Socket Context (Frontend/src/context/SocketContext.jsx)
Created React context for managing Socket.io connection globally.

**Features:**
- Automatic connection establishment on app load
- Connection status tracking (`isConnected`)
- Event listener management
- Notification queue (maintains last 50 notifications)
- Auto-reconnection logic (5 attempts, max delay 5s)

**useSocket Hook:**
```javascript
const { socket, isConnected, notifications, addNotification } = useSocket();
```

### App Configuration (Frontend/src/App.jsx)
- Wrapped entire app with `<SocketProvider>`
- Enables all child components to access Socket.io

### Layout Updates

#### Admin Layout (Frontend/src/Components/Admin/Layout/AdminLayout.jsx)
On render:
1. Gets admin ID from localStorage
2. Emits `admin:join` and `admin:joinDashboard` events
3. Joins admin-specific Socket.io rooms

#### Employee Layout (Frontend/src/Components/Employee/Layout/EmployeeLayout.jsx)
On render:
1. Gets employee ID from localStorage
2. Emits `employee:join` and `employee:joinDashboard` events
3. Joins employee-specific Socket.io rooms

### Dashboard Integration

#### Admin Dashboard (Frontend/src/Components/Admin/Pages/Dashboard.jsx)
**Real-time Listeners:**
- `payroll:created` - Refreshes notifications automatically
- `employee:created` - Updates employee count in real-time
- `employee:updated` - Logs employee updates

**Auto-Updates:**
- Notification list refreshes when payroll is generated
- Employee count increments when new employee is added
- Dashboard stays synchronized with backend

#### Employee Dashboard (Frontend/src/Components/Employee/Pages/Dashboard.jsx)
**Real-time Listeners:**
- `payroll:notified` - Shows payroll ready notification
- `payroll:updated` - Shows payroll update notification
- `payroll:statusUpdated` - Shows payment status change

**Notifications:**
- Payroll notifications displayed in real-time
- Maintains history of last 10 notifications
- Instant updates without page refresh

## Real-Time Events Flow

### Scenario 1: Admin Creates Employee
```
Admin Panel (Employee.jsx)
    ↓
Creates Employee via API
    ↓
Backend: employeeService.createEmployee()
    ↓
Emits socket event: "employee:created"
    ↓
Admin Dashboard listens
    ↓
Stats updated in real-time
```

### Scenario 2: Admin Generates Payroll
```
Admin Panel (Payroll.jsx)
    ↓
Creates Payroll via API
    ↓
Backend: payrollService.createPayroll()
    ↓
Emits socket events: "payroll:created" + "payroll:notified"
    ↓
Admin Dashboard listens → Refreshes notifications
AND
Employee Dashboard listens → Shows payroll notification
    ↓
Both dashboards updated instantly
```

### Scenario 3: Payment Status Update
```
Admin updates payment status
    ↓
Backend: payrollService.updatePayrollStatus()
    ↓
Emits: "payroll:statusUpdated" to both admin & employee
    ↓
Both dashboards receive update in real-time
```

## Environment Configuration

### Backend (.env)
```
PORT=5000
FRONTEND_URL=http://localhost:5174
NODE_ENV=development
```

### Frontend (.env or vite.config.js)
```
VITE_BACKEND_URL=http://localhost:5000
```

## Testing Socket.io

### Backend Console
```javascript
// Check Socket.io logs
console.log(`User connected: ${socket.id}`);
console.log(`Admin ${adminId} joined their room`);
```

### Browser Console
```javascript
// Check Socket connection status
const { socket, isConnected } = useSocket();
console.log("Socket connected:", isConnected);
```

### Events to Test
1. **Create Employee** → Check admin dashboard stats
2. **Generate Payroll** → Check both dashboards for notifications
3. **Update Employee** → Check console logs
4. **Change Payment Status** → Check employee dashboard

## Key Benefits

✅ **Real-time Updates** - Instant notifications without page refresh
✅ **Live Collaboration** - Admin and employee panels stay synchronized
✅ **Employee Count Updates** - Dashboard stats update when employees are added
✅ **Payroll Notifications** - Both admin and employee notified instantly
✅ **Scalable Architecture** - Room-based event handling for multiple users
✅ **Auto-reconnection** - Automatic reconnect with exponential backoff
✅ **Error Handling** - Graceful fallback if Socket.io disconnects

## Features Implemented

### Real-time Events
- ✅ Employee creation notifications
- ✅ Employee update notifications
- ✅ Payroll creation notifications
- ✅ Payroll update notifications
- ✅ Payment status change notifications

### Rooms & Channels
- ✅ Admin-specific rooms (`admin:${adminId}`)
- ✅ Employee-specific rooms (`employee:${employeeId}`)
- ✅ Admin dashboard room (`admin:dashboard:${adminId}`)
- ✅ Employee dashboard room (`employee:dashboard:${employeeId}`)

### Dashboard Integration
- ✅ Auto-refresh notifications on payroll creation
- ✅ Employee count updates
- ✅ Payroll notifications on employee dashboard
- ✅ Payment status updates

## Future Enhancements

🔄 **Possible Additions:**
- Direct messaging between admin and employee
- Attendance mark notifications
- Leave request real-time updates
- Performance review notifications
- Meeting reminders
- System alerts and announcements
- Typing indicators for chat
- Read receipts for messages
- Presence indicators (online/offline status)

## Files Modified

**Backend:**
- `Backend/server.js` - Socket.io initialization
- `Backend/utils/socketEmitter.js` - Event emission utility (NEW)
- `Backend/services/payrollService.js` - Payroll events
- `Backend/services/employeeService.js` - Employee events
- `Backend/package.json` - Added socket.io

**Frontend:**
- `Frontend/src/App.jsx` - Added SocketProvider
- `Frontend/src/context/SocketContext.jsx` - Socket context (NEW)
- `Frontend/src/Components/Admin/Layout/AdminLayout.jsx` - Join admin room
- `Frontend/src/Components/Employee/Layout/EmployeeLayout.jsx` - Join employee room
- `Frontend/src/Components/Admin/Pages/Dashboard.jsx` - Listen to events
- `Frontend/src/Components/Employee/Pages/Dashboard.jsx` - Listen to events
- `Frontend/package.json` - Added socket.io-client

## Troubleshooting

**Issue: Connection refused**
- Check if backend server is running on port 5000
- Verify FRONTEND_URL environment variable

**Issue: Events not received**
- Check browser console for connection status
- Verify Socket.io is initialized before emitting
- Check that user ID is correctly stored in localStorage

**Issue: Multiple connections**
- Only one connection per user should exist
- Check for duplicate SocketProvider wraps

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│            React Application (Frontend)              │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │         SocketProvider (Context)             │  │
│  │  • Manages Socket.io connection              │  │
│  │  • Broadcasts events to all components       │  │
│  └──────────────────────────────────────────────┘  │
│           ↓            ↓            ↓               │
│     AdminLayout  EmployeeLayout  Components        │
│     (join rooms) (join rooms)  (listen to events)   │
└─────────────────────────────────────────────────────┘
         ↓ Socket Events ↓ Emit Events ↑
┌─────────────────────────────────────────────────────┐
│         Express Server + Socket.io (Backend)        │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │       Socket Event Handler                   │  │
│  │  • Listen to join events                     │  │
│  │  • Manage rooms (admin, employee, dashboard) │  │
│  └──────────────────────────────────────────────┘  │
│           ↓            ↓            ↓               │
│    PayrollService EmployeeService AdminController  │
│    (emit events)  (emit events)    (manage routes)  │
│           ↓            ↓            ↓               │
│          MongoDB Database                          │
└─────────────────────────────────────────────────────┘
```

---

**Status:** ✅ Fully Implemented and Tested
**Last Updated:** April 22, 2026
