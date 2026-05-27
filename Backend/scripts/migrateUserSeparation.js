require("dotenv").config();
const connectDB = require("../config/database");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Payroll = require("../models/Payroll");
const Admin = require("../models/Admin");

async function migrate() {
  await connectDB();
  
  console.log("🚀 Starting EMS User Separation Migration...\n");
  
  try {
    // Get the first admin (for single-organization setups)
    const admin = await Admin.findOne();
    if (!admin) {
      console.error("❌ Error: No admin found in database!");
      console.log("Please create an admin account first.");
      process.exit(1);
    }
    
    console.log(`📋 Using admin: ${admin.name} (${admin.organization})\n`);
    
    // Migrate Employees
    console.log("📝 Migrating Employees...");
    const empResult = await Employee.updateMany(
      { admin: { $exists: false } },
      { admin: admin._id }
    );
    console.log(`   ✓ Updated ${empResult.modifiedCount} employee records`);
    console.log(`   ℹ️  ${empResult.matchedCount - empResult.modifiedCount} already migrated\n`);
    
    // Migrate Attendance
    console.log("📝 Migrating Attendance Records...");
    const attendances = await Attendance.find({ admin: { $exists: false } });
    let attCount = 0;
    for (let att of attendances) {
      const employee = await Employee.findById(att.employee);
      if (employee && employee.admin) {
        att.admin = employee.admin;
        await att.save();
        attCount++;
      }
    }
    console.log(`   ✓ Updated ${attCount} attendance records`);
    const totalAtt = await Attendance.countDocuments({});
    console.log(`   ℹ️  Total attendance records: ${totalAtt}\n`);
    
    // Migrate Leave
    console.log("📝 Migrating Leave Requests...");
    const leaves = await Leave.find({ admin: { $exists: false } });
    let leaveCount = 0;
    for (let leave of leaves) {
      const employee = await Employee.findById(leave.employee);
      if (employee && employee.admin) {
        leave.admin = employee.admin;
        await leave.save();
        leaveCount++;
      }
    }
    console.log(`   ✓ Updated ${leaveCount} leave records`);
    const totalLeaves = await Leave.countDocuments({});
    console.log(`   ℹ️  Total leave records: ${totalLeaves}\n`);
    
    // Migrate Payroll
    console.log("📝 Migrating Payroll Records...");
    const payrolls = await Payroll.find({ admin: { $exists: false } });
    let payrollCount = 0;
    for (let payroll of payrolls) {
      const employee = await Employee.findById(payroll.employee);
      if (employee && employee.admin) {
        payroll.admin = employee.admin;
        await payroll.save();
        payrollCount++;
      }
    }
    console.log(`   ✓ Updated ${payrollCount} payroll records`);
    const totalPayroll = await Payroll.countDocuments({});
    console.log(`   ℹ️  Total payroll records: ${totalPayroll}\n`);
    
    // Summary
    console.log("✅ Migration completed successfully!\n");
    console.log("📊 Migration Summary:");
    console.log(`   • Employees: ${empResult.modifiedCount} updated`);
    console.log(`   • Attendance: ${attCount} updated`);
    console.log(`   • Leave: ${leaveCount} updated`);
    console.log(`   • Payroll: ${payrollCount} updated\n`);
    
    console.log("🎉 User separation is now active!");
    console.log("   - Each admin can only access their organization's data");
    console.log("   - Employees are linked to their admin/organization");
    console.log("   - All records are now tenant-separated\n");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("\nStack trace:", error);
    process.exit(1);
  }
}

migrate();
