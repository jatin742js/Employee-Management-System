# Backend Folder Structure

This document explains the backend folder structure following the **MVC + Service Layer Architecture**.

## Folder Organization

```
Backend/
├── config/                  # Configuration files
│   └── database.js         # MongoDB connection setup
│
├── middleware/              # Express middleware
│   └── auth.js             # JWT verification & role-based access control
│
├── models/                  # MongoDB Schemas
│   ├── Admin.js            # Admin model
│   ├── Employee.js         # Employee model
│   ├── Attendance.js       # Attendance tracking model
│   ├── Leave.js            # Leave request model
│   └── Payroll.js          # Payroll model
│
├── controllers/             # Request handlers (HTTP layer)
│   ├── adminAuthController.js      # Admin authentication endpoints
│   ├── employeeAuthController.js   # Employee authentication endpoints
│   ├── adminController.js          # Admin operations endpoints
│   ├── employeeController.js       # Employee operations endpoints
│   └── index.js            # Centralized exports
│
├── services/                # Business logic layer (Reusable)
│   ├── adminAuthService.js         # Admin auth logic
│   ├── employeeAuthService.js      # Employee auth logic
│   ├── employeeService.js          # Employee management logic
│   ├── attendanceService.js        # Attendance tracking logic
│   ├── leaveService.js             # Leave management logic
│   ├── payrollService.js           # Payroll processing logic
│   └── index.js            # Centralized exports
│
├── utils/                   # Utility functions & helpers
│   ├── tokenUtils.js       # JWT token generation & verification
│   ├── responseUtils.js    # Standardized API response formatting
│   ├── errorHandler.js     # Error handling & async wrapper
│   ├── helpers.js          # Common calculations & date utilities
│   └── index.js            # Centralized exports
│
├── routes/                  # API route definitions
│   ├── adminAuth.js        # Admin auth routes
│   ├── employeeAuth.js     # Employee auth routes
│   ├── admin.js            # Admin operation routes
│   └── employee.js         # Employee operation routes
│
├── server.js               # Express app entry point
├── package.json            # Dependencies
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
└── README.md              # API documentation
```

## Architecture Layers

### 1. **Routes Layer** (`routes/`)
- Defines API endpoints
- Handles request validation
- Delegates to controllers

### 2. **Controllers Layer** (`controllers/`)
- Request handlers (HTTP layer)
- Input validation & error handling
- Calls services for business logic
- Formats and sends responses

### 3. **Services Layer** (`services/`)
- **Core business logic** (Reusable across APIs)
- Database queries
- Complex calculations
- Data transformations
- Can be used by controllers, jobs, CLI, etc.

### 4. **Models Layer** (`models/`)
- MongoDB schema definitions
- Data validation rules
- Database constraints

### 5. **Middleware Layer** (`middleware/`)
- Authentication (JWT verification)
- Authorization (role-based access)
- Cross-cutting concerns

### 6. **Utils Layer** (`utils/`)
- Helper functions
- Token utilities
- Response formatting
- Error handling

### 7. **Config Layer** (`config/`)
- Database connections
- Environment-specific configurations

## Data Flow

```
Request → Routes → Controllers → Services → Models → Database
   ↓                                              ↓
Response ← Utils(Response) ← Services ← Models ← Database
```

## Benefits of This Structure

✅ **Separation of Concerns**
- Each layer has a single responsibility
- Easy to test and maintain

✅ **Code Reusability**
- Services can be used by multiple controllers
- Utils can be shared across layers

✅ **Scalability**
- Easy to add new features
- Supports microservices architecture

✅ **Maintainability**
- Clear folder organization
- Easy to locate code
- Reduces code duplication

✅ **Testability**
- Services can be unit tested independently
- Mocking is easier with services layer

## Service Layer Benefits

The **services layer** contains all business logic:

```javascript
// Can be used by multiple controllers
const user = await UserService.getUserById(id);

// Can be used by background jobs
const users = await UserService.getActiveUsers();

// Can be used by CLI commands
const stats = await UserService.generateMonthlyStats();

// Can be used by scheduled jobs
await UserService.sendReminderEmails();
```

## File Naming Conventions

- **Controllers**: `[feature]Controller.js` (e.g., `adminAuthController.js`)
- **Services**: `[feature]Service.js` (e.g., `adminAuthService.js`)
- **Routes**: `[feature].js` (e.g., `adminAuth.js`)
- **Models**: `[Model].js` (e.g., `Admin.js`)
- **Utils**: `[utility].js` (e.g., `tokenUtils.js`)

## Example: Creating a New Feature

To add a new feature (e.g., Departments):

1. **Create Model**: `models/Department.js`
2. **Create Service**: `services/departmentService.js`
3. **Create Controller**: `controllers/departmentController.js`
4. **Create Routes**: `routes/department.js`
5. **Add to Server**: Import in `server.js`

## Error Handling

Centralized error handling in `utils/errorHandler.js`:

```javascript
// Custom AppError class
throw new AppError("Invalid input", 400);

// Async wrapper
exports.controller = asyncHandler(async (req, res) => {
  // No need to try-catch, errors are caught
  const result = await Service.method();
});
```

## Response Formatting

Consistent API responses via `utils/responseUtils.js`:

```javascript
// Success response
successResponse(res, 200, "User created", userData);

// Error response
errorResponse(res, 400, "Validation failed", errors);
```

## Using Services

### Simple Usage
```javascript
// In controller
const user = await UserService.getUserById(id);
```

### With Error Handling
```javascript
// Service throws errors, controller catches them
try {
  const user = await UserService.getUserById(id);
  successResponse(res, 200, "User found", user);
} catch (error) {
  errorResponse(res, 404, error.message);
}
```

### With Async Handler
```javascript
// No need for try-catch with asyncHandler
exports.getUser = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.params.id);
  successResponse(res, 200, "User found", user);
});
```

## Best Practices

1. **Keep Controllers Thin**: Move business logic to services
2. **Use Services for Reusability**: Services can be used by multiple controllers
3. **Consistent Error Handling**: Use `AppError` and `asyncHandler`
4. **Standardize Responses**: Use `responseUtils` for all API responses
5. **Validate Input in Routes**: Use `express-validator` in routes
6. **Document Services**: Add JSDoc comments to service methods
7. **Use Index Files**: Centralize imports with `index.js` files

## Future Enhancements

- Add email service
- Add SMS service
- Add logging service
- Add caching layer
- Add background jobs
- Add WebSocket support
- Add GraphQL layer
