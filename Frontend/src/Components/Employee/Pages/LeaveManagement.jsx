import { useState, useEffect } from "react";
import { Plus, Thermometer, Umbrella, Leaf, X, Send } from "lucide-react";
import employeeLeaveService from "../../../services/employeeLeaveService";
import { useSocket } from "../../../context/SocketContext";

export default function LeaveManagement() {
  const [showModal, setShowModal] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { socket } = useSocket();
  const [formData, setFormData] = useState({
    leaveType: "Sick Leave",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const sickLeaveCount = leaveRequests.filter((leave) => leave.type === 'SICK').length;
  const casualLeaveCount = leaveRequests.filter((leave) => leave.type === 'CASUAL').length;
  const annualLeaveCount = leaveRequests.filter((leave) => leave.type === 'ANNUAL').length;

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      setIsLoading(true);
      const response = await employeeLeaveService.getMyLeaves();
      const data =
        response?.data?.leaves ||
        response?.leaves ||
        (Array.isArray(response?.data) ? response.data : null) ||
        (Array.isArray(response) ? response : []);
      
      if (Array.isArray(data)) {
        const formattedLeaves = data.map((leave) => ({
          id: leave._id || leave.id,
          type: leave.leaveType?.toUpperCase() || 'LEAVE',
          dates: `${new Date(leave.startDate).toLocaleDateString('en-IN')} - ${new Date(leave.endDate).toLocaleDateString('en-IN')}`,
          reason: leave.reason || '',
          status: leave.status?.toUpperCase() || 'PENDING',
        }));
        setLeaveRequests(formattedLeaves);
      } else {
        setLeaveRequests([]);
      }
      setError('');
    } catch (err) {
      console.error('Error loading leaves:', err);
      setError(err.message || 'Failed to load leaves');
      setLeaveRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen to real-time leave updates via Socket.io
  useEffect(() => {
    if (!socket) return;

    socket.on('leave:statusUpdated', (data) => {
      console.log('Leave status updated:', data);
      loadLeaves(); // Refresh leaves data
    });

    socket.on('leave:approved', (data) => {
      console.log('Leave approved:', data);
      loadLeaves();
    });

    socket.on('leave:rejected', (data) => {
      console.log('Leave rejected:', data);
      loadLeaves();
    });

    return () => {
      socket.off('leave:statusUpdated');
      socket.off('leave:approved');
      socket.off('leave:rejected');
    };
  }, [socket]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fromDate || !formData.toDate || !formData.reason) {
      alert("Please fill all fields");
      return;
    }

    const startDate = new Date(`${formData.fromDate}T00:00:00`);
    const endDate = new Date(`${formData.toDate}T00:00:00`);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      alert("Please select valid dates");
      return;
    }

    if (endDate < startDate) {
      alert("To date cannot be earlier than from date");
      return;
    }

    // Inclusive date range: same day = 1 day
    const msPerDay = 24 * 60 * 60 * 1000;
    const numberOfDays = Math.floor((endDate - startDate) / msPerDay) + 1;

    try {
      setIsSubmitting(true);
      const response = await employeeLeaveService.requestLeave({
        leaveType: formData.leaveType.toLowerCase().split(' ')[0],
        startDate: formData.fromDate,
        endDate: formData.toDate,
        reason: formData.reason,
        numberOfDays,
      });

      const newLeave = {
        id: response.data?._id || response._id || leaveRequests.length + 1,
        type: formData.leaveType.split(" ")[0].toUpperCase(),
        dates: `${formData.fromDate} - ${formData.toDate}`,
        reason: formData.reason,
        status: "PENDING",
      };

      setLeaveRequests([newLeave, ...leaveRequests]);
      setShowModal(false);
      setFormData({
        leaveType: "Sick Leave",
        fromDate: "",
        toDate: "",
        reason: "",
      });
      alert("Leave request submitted successfully!");
    } catch (err) {
      console.error('Error submitting leave:', err);
      alert(err.message || 'Failed to submit leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-none">
            Leave Management
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Your leave history and requests
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center justify-center sm:justify-start gap-2 shadow-md text-sm font-semibold"
        >
          <Plus size={18} />
          Apply for Leave
        </button>
      </div>

      {/* Leave Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Sick Leave */}
        <div className="bg-white border-l-4 border-l-teal-500 rounded-md px-6 py-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded border border-gray-300 bg-gray-100">
              <Thermometer size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-medium tracking-wide">
                Sick Leave
              </p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-4xl font-bold text-gray-900">
                  {sickLeaveCount}
                </span>
                <span className="text-xs text-gray-600">taken</span>
              </div>
            </div>
          </div>
        </div>

        {/* Casual Leave */}
        <div className="bg-white border-l-4 border-l-teal-500 rounded-md px-6 py-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded border border-gray-300 bg-gray-100">
              <Umbrella size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-medium tracking-wide">
                Casual Leave
              </p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-4xl font-bold text-gray-900">
                  {casualLeaveCount}
                </span>
                <span className="text-xs text-gray-600">taken</span>
              </div>
            </div>
          </div>
        </div>

        {/* Annual Leave */}
        <div className="bg-white border-l-4 border-l-teal-500 rounded-md px-6 py-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded border border-gray-300 bg-gray-100">
              <Leaf size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-medium tracking-wide">
                Annual Leave
              </p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-4xl font-bold text-gray-900">
                  {annualLeaveCount}
                </span>
                <span className="text-xs text-gray-600">taken</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md shadow-sm overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                TYPE
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                DATES
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                REASON
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                STATUS
              </th>
            </tr>
          </thead>

          <tbody>
            {leaveRequests.length > 0 ? (
              leaveRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-100">
                  <td className="px-6 py-4">
                    <span className="bg-teal-50 text-teal-700 text-xs px-3 py-1 rounded-full font-semibold border border-teal-200">
                      {request.type}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {request.dates}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {request.reason}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      request.status === "APPROVED"
                        ? "bg-teal-50 text-teal-700 border border-teal-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                  No leave records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Apply for Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Apply for Leave</h2>
                <p className="text-sm text-gray-500 mt-1">Submit your leave request for approval</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Leave Type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Leaf size={16} className="text-gray-600" />
                  Leave Type
                </label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                  <option>Annual Leave</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Plus size={16} className="text-gray-600" />
                  Duration
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">From</p>
                    <input
                      type="date"
                      name="fromDate"
                      value={formData.fromDate}
                      onChange={handleInputChange}
                      placeholder="dd-mm-yyyy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">To</p>
                    <input
                      type="date"
                      name="toDate"
                      value={formData.toDate}
                      onChange={handleInputChange}
                      placeholder="dd-mm-yyyy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Briefly describe why you need this leave..."
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}