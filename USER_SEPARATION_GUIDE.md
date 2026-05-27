# EMS User Separation Implementation Guide

## Overview
The Employee Management System has been successfully updated to support multi-tenant user separation. Each admin user can now only access employees, attendance records, leave requests, payroll, and other data that belongs to their organization.

## What Was Changed

### 1. **Database Models** ✅
Added `admin` field (ObjectId reference) to:
- **Employee.js** - Links employees to their admin/organization
- **Attendance.js** - Links attendance records to their admin
- **Leave.js** - Links leave requests to their admin  
- **Payroll.js** - Links payroll records to their admin
- **Notification.js** - Already had admin field

### 2. **Backend Services** ✅

#### Employee Service
- `getAllEmployees(filters, adminId)` - Now filters by admin
- `createEmployee(data, adminId)` - Sets admin field when creating

#### Attendance Service
- `getAttendance(filters, adminId)` - Filters by admin
- `recordAttendance(data, adminId)` - Sets admin field
- `checkIn(employeeId, adminId)` - Includes admin filtering
- `checkOut(employeeId, adminId)` - Includes admin filtering

#### Leave Service
- `getAllLeaves(filters, adminId)` - Filters by admin
- `requestLeave(data, adminId)` - Sets admin field

#### Payroll Service
- `getAllPayroll(filters, adminId)` - Filters by admin
- `createPayroll(data, adminId)` - Sets admin field

### 3. **Backend Controllers** ✅

#### Admin Controller
- Passes `req.user.id` as adminId to all service calls
- Added authorization checks to prevent cross-admin access
- All GET endpoints now filter by current admin
- All POST endpoints now link to current admin

#### Employee Controller
- Updated to get admin from employee record
- Passes admin to service methods for check-in/check-out
- Employee's leave requests now linked to their admin

### 4. **Authorization Checks** ✅
Added `admin` ownership verification for:
- `getEmployeeById()` - Only access own employees
- `updateEmployee()` - Only update own employees
- `deactivateEmployee()` - Only deactivate own employees
- `activateEmployee()` - Only activate own employees
- `deleteEmployee()` - Only delete own employees

## Data Migration Required ⚠️

For existing deployments, you need to migrate existing data:

### Migration Strategy

#### For Existing Employees
```javascript
// Backend migration script needed:
// Set admin field for all existing employees
// Option 1: Assign to the first/only admin if single admin system
const Employee = require("./models/Employee");
const Admin = require("./models/Admin");

const admin = await Admin.findOne();
if (admin) {
  await Employee.updateMany({}, { admin: admin._id });
}

// Option 2: Use employee's department/organization to map to admin
// (requires manual mapping logic)
```

#### For Existing Attendance Records
```javascript
const Attendance = require("./models/Attendance");
const Employee = require("./models/Employee");

const attendances = await Attendance.find({ admin: { $exists: false } });
for (let att of attendances) {
  const employee = await Employee.findById(att.employee);
  if (employee) {
    att.admin = employee.admin;
    await att.save();
  }
}
```

#### For Existing Leave Records
```javascript
const Leave = require("./models/Leave");
const Employee = require("./models/Employee");

const leaves = await Leave.find({ admin: { $exists: false } });
for (let leave of leaves) {
  const employee = await Employee.findById(leave.employee);
  if (employee) {
    leave.admin = employee.admin;
    await leave.save();
  }
}
```

#### For Existing Payroll Records
```javascript
const Payroll = require("./models/Payroll");
const Employee = require("./models/Employee");

const payrolls = await Payroll.find({ admin: { $exists: false } });
for (let payroll of payrolls) {
  const employee = await Employee.findById(payroll.employee);
  if (employee) {
    payroll.admin = employee.admin;
    await payroll.save();
  }
}
```

### Create Migration Script
Create `Backend/scripts/migrateUserSeparation.js`:

```javascript
require("dotenv").config();
const connectDB = require("../config/database");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Payroll = require("../models/Payroll");
const Admin = require("../models/Admin");

async function migrate() {
  await connectDB();
  
  console.log("Starting user separation migration...");
  
  try {
    // Get the first admin (for single-organization setups)
    const admin = await Admin.findOne();
    if (!admin) {
      console.error("No admin found!");
      process.exit(1);
    }
    
    // Migrate Employees
    const empResult = await Employee.updateMany(
      { admin: { $exists: false } },
      { admin: admin._id }
    );
    console.log(`✓ Employees: ${empResult.modifiedCount} records updated`);
    
    // Migrate Attendance
    const attendances = await Attendance.find({ admin: { $exists: false } });
    let attCount = 0;
    for (let att of attendances) {
      const employee = await Employee.findById(att.employee);
      if (employee) {
        att.admin = employee.admin;
        await att.save();
        attCount++;
      }
    }
    console.log(`✓ Attendance: ${attCount} records updated`);
    
    // Migrate Leave
    const leaves = await Leave.find({ admin: { $exists: false } });
    let leaveCount = 0;
    for (let leave of leaves) {
      const employee = await Employee.findById(leave.employee);
      if (employee) {
        leave.admin = employee.admin;
        await leave.save();
        leaveCount++;
      }
    }
    console.log(`✓ Leave: ${leaveCount} records updated`);
    
    // Migrate Payroll
    const payrolls = await Payroll.find({ admin: { $exists: false } });
    let payrollCount = 0;
    for (let payroll of payrolls) {
      const employee = await Employee.findById(payroll.employee);
      if (employee) {
        payroll.admin = employee.admin;
        await payroll.save();
        payrollCount++;
      }
    }
    console.log(`✓ Payroll: ${payrollCount} records updated`);
    
    console.log("✓ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
```

Run migration:
```bash
node Backend/scripts/migrateUserSeparation.js
```

## Frontend Implications

### No Major Changes Needed ✅
- Frontend already has role-based routing
- Employees already see only their own data
- Admins see their dashboard with filtered data

### Optional Improvements
- Add organization name to UI (already available from admin profile)
- Display company information in employee dashboard
- Add multi-admin support in admin panel (future)

## Testing

### Test Data Isolation
1. Create multiple admin accounts
2. Each admin creates employees
3. Verify each admin can only see their own employees
4. Verify attendance/leave/payroll are admin-specific
5. Test cross-admin access prevention

### Test Authorization
```bash
# Test 1: Get employee from different admin - should fail
curl -H "Authorization: Bearer token1" \
  http://localhost:5000/api/admin/employees/objectId

# Test 2: Get own employees - should succeed
curl -H "Authorization: Bearer token2" \
  http://localhost:5000/api/admin/employees/objectId
```

## Rollout Steps

1. **Backup Database** - Create backup before migration
2. **Deploy Code Changes** - Update all files listed above
3. **Run Migration Script** - Execute migration on existing data
4. **Test Thoroughly** - Verify data isolation works
5. **Monitor Logs** - Watch for authorization errors
6. **Communicate to Users** - Inform admins about new data isolation

## Security Benefits

✅ **Data Isolation** - Admins can only access their organization's data
✅ **Multi-Tenancy** - System now supports multiple organizations
✅ **Audit Trail** - All operations are tracked per admin
✅ **Authorization** - Cross-admin access is prevented
✅ **Scalability** - Ready for SaaS deployment

## Future Enhancements

- [ ] Add unique indexes: `{ admin: 1, employeeId: 1 }` for Employee
- [ ] Add unique indexes: `{ admin: 1, employee: 1, date: 1 }` for Attendance
- [ ] Add soft delete support for data retention
- [ ] Add audit logging for compliance
- [ ] Add admin invitation system for multiple admin management
- [ ] Add organization settings/preferences

## Support & Troubleshooting

**Issue**: Employees not showing up after update
- **Solution**: Run migration script to set admin field

**Issue**: "Access denied" errors for valid operations
- **Solution**: Check if employee's admin field matches token's admin ID

**Issue**: Old data not accessible
- **Solution**: Verify migration completed successfully for all collections

## Documentation References

- [Employee Model](Backend/models/Employee.js)
- [Attendance Model](Backend/models/Attendance.js)
- [Leave Model](Backend/models/Leave.js)
- [Payroll Model](Backend/models/Payroll.js)
- [Admin Controller](Backend/controllers/adminController.js)
- [Employee Controller](Backend/controllers/employeeController.js)
