# Employee Management System - Backend

Complete backend API for Employee Management System built with Node.js, Express.js, and MongoDB.

## Features

### Admin Panel
- Admin authentication and profile management
- Employee management (Create, Read, Update, Deactivate)
- Attendance tracking and management
- Leave request approval/rejection
- Payroll management and processing
- Dashboard with statistics

### Employee Panel
- Employee authentication and profile management
- Check-in/Check-out functionality
- Attendance history viewing
- Leave request submission
- Payroll history viewing
- Personal dashboard with statistics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Environment Variables**: dotenv
- **CORS**: Cross-Origin Resource Sharing

## Project Structure

```
Backend/
├── config/
│   └── database.js           # MongoDB connection
├── middleware/
│   └── auth.js              # JWT verification & role-based access
├── models/
│   ├── Admin.js             # Admin schema
│   ├── Employee.js          # Employee schema
│   ├── Attendance.js        # Attendance schema
│   ├── Leave.js             # Leave request schema
│   └── Payroll.js           # Payroll schema
├── routes/
│   ├── adminAuth.js         # Admin authentication routes
│   ├── employeeAuth.js      # Employee authentication routes
│   ├── admin.js             # Admin operations routes
│   └── employee.js          # Employee operations routes
├── server.js                # Main entry point
├── package.json             # Dependencies
├── .env                     # Environment variables
└── .gitignore              # Git ignore rules
```

## Installation

1. **Install dependencies**
```bash
npm install
```

2. **Setup environment variables**
Create `.env` file in Backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/employee_management
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

3. **Ensure MongoDB is running**
```bash
# On Windows with MongoDB installed
net start MongoDB

# Or if using MongoDB Atlas, update MONGODB_URI in .env
```

4. **Start the server**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Admin Authentication
- `POST /api/admin/auth/register` - Register new admin
- `POST /api/admin/auth/login` - Login admin
- `GET /api/admin/auth/profile` - Get admin profile
- `PUT /api/admin/auth/profile` - Update admin profile
- `PUT /api/admin/auth/change-password` - Change password

### Employee Authentication
- `POST /api/employee/auth/register` - Register new employee
- `POST /api/employee/auth/login` - Login employee
- `GET /api/employee/auth/profile` - Get employee profile
- `PUT /api/employee/auth/profile` - Update employee profile
- `PUT /api/employee/auth/change-password` - Change password

### Admin Operations
**Employees**
- `GET /api/admin/employees` - Get all employees
- `GET /api/admin/employees/:id` - Get single employee
- `POST /api/admin/employees` - Create employee
- `PUT /api/admin/employees/:id` - Update employee
- `PUT /api/admin/employees/:id/deactivate` - Deactivate employee

**Attendance**
- `GET /api/admin/attendance` - Get attendance records
- `POST /api/admin/attendance` - Record attendance

**Leaves**
- `GET /api/admin/leaves` - Get all leave requests
- `PUT /api/admin/leaves/:id/approve` - Approve leave
- `PUT /api/admin/leaves/:id/reject` - Reject leave

**Payroll**
- `GET /api/admin/payroll` - Get payroll records
- `POST /api/admin/payroll` - Create payroll
- `PUT /api/admin/payroll/:id/status` - Update payroll status

**Dashboard**
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

### Employee Operations
**Attendance**
- `GET /api/employee/attendance` - Get my attendance
- `POST /api/employee/attendance/check-in` - Check in
- `POST /api/employee/attendance/check-out` - Check out

**Leaves**
- `GET /api/employee/leaves` - Get my leaves
- `POST /api/employee/leaves` - Request leave
- `DELETE /api/employee/leaves/:id` - Cancel leave request

**Payroll**
- `GET /api/employee/payroll` - Get my payroll
- `GET /api/employee/payroll/:id` - Get payroll details

**Dashboard**
- `GET /api/employee/dashboard/stats` - Get dashboard statistics

## Authentication

All protected routes require JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

Tokens are returned after login and expire based on `JWT_EXPIRE` setting.

## Database Models

### Admin
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  phone: String,
  department: String,
  role: "admin",
  isActive: Boolean,
  timestamps: true
}
```

### Employee
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  employeeId: String (required, unique),
  department: String (required),
  position: String (required),
  salary: Number,
  phone: String,
  dateOfJoining: Date,
  manager: ObjectId (ref: Employee),
  role: "employee",
  isActive: Boolean,
  address: {
    street, city, state, postalCode, country
  },
  timestamps: true
}
```

### Attendance
```javascript
{
  employee: ObjectId (ref: Employee, required),
  date: Date (required),
  status: "present|absent|leave|half-day",
  checkInTime: String,
  checkOutTime: String,
  workingHours: Number,
  remarks: String,
  timestamps: true
}
```

### Leave
```javascript
{
  employee: ObjectId (ref: Employee, required),
  leaveType: "sick|casual|earned|maternity|paternity|unpaid",
  startDate: Date (required),
  endDate: Date (required),
  numberOfDays: Number (required),
  status: "pending|approved|rejected",
  reason: String (required),
  approvedBy: ObjectId (ref: Admin),
  rejectionReason: String,
  remarks: String,
  timestamps: true
}
```

### Payroll
```javascript
{
  employee: ObjectId (ref: Employee, required),
  month: String (format: YYYY-MM, required),
  baseSalary: Number (required),
  allowances: Number,
  deductions: Number,
  bonus: Number,
  netSalary: Number (required),
  paymentStatus: "pending|processed|paid",
  paymentMethod: "bank-transfer|check|cash",
  paymentDate: Date,
  remarks: String,
  timestamps: true
}
```

## Example Requests

### Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### Employee Login
```bash
curl -X POST http://localhost:5000/api/employee/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@example.com",
    "password": "password123"
  }'
```

### Create Employee (Admin Only)
```bash
curl -X POST http://localhost:5000/api/admin/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "employeeId": "EMP001",
    "department": "IT",
    "position": "Developer",
    "salary": 50000,
    "dateOfJoining": "2024-01-15"
  }'
```

### Check In (Employee)
```bash
curl -X POST http://localhost:5000/api/employee/attendance/check-in \
  -H "Authorization: Bearer <jwt_token>"
```

## Error Handling

All errors return JSON with appropriate HTTP status codes:

```javascript
{
  "message": "Error description",
  "errors": [] // array of validation errors (if applicable)
}
```

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control (Admin/Employee)
- Input validation and sanitization
- CORS enabled for frontend communication
- Environment variables for sensitive data

## Development

Install dev dependencies:
```bash
npm install --save-dev nodemon
```

Run in development mode with auto-reload:
```bash
npm run dev
```

## Notes

- Change `JWT_SECRET` in `.env` for production
- Implement rate limiting in production
- Add logging middleware for production
- Use environment-specific configurations
- Regularly backup MongoDB database
- Consider adding email notifications for leave approvals
- Implement audit logging for sensitive operations

## Future Enhancements

- Email notifications
- SMS alerts
- Performance analytics
- Advanced filtering and pagination
- File uploads for documents
- Multi-level approval workflows
- Department-wise reporting
- Employee self-service portal
- Integration with third-party HR tools

## License

ISC

## Support

For issues or questions, please refer to the main project README or contact the development team.
