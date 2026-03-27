import React, { useState } from "react";
import { Search, Plus, MoreHorizontal, ChevronLeft, ChevronRight, X, Edit, Trash2, Eye, Lock, Briefcase, AlertCircle } from "lucide-react";

const allEmployees = [
  { name: "Cody Fisher", email: "masum@halallab.co", phone: "+1 (555) 123-4567", id: "#EP5659", role: "Web Designer", date: "Oct 14, 2025", status: "Full-time", password: "CodyF@2025", department: "Design", description: "Experienced web designer with strong UI/UX expertise", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { name: "Wade Wilson", email: "wade@merouth.com", phone: "+1 (555) 234-5678", id: "#AP2589", role: "Product Designer", date: "Oct 13, 2025", status: "Freelance", password: "WadeW@2025", department: "Design", description: "Creative product designer focusing on user experience", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Albert Flores", email: "albertf@gmail.com", phone: "+1 (555) 345-6789", id: "#DS9735", role: "Lead Designer", date: "Sep 29, 2025", status: "Part-time", password: "AlbertF@2025", department: "Design", description: "Lead designer with 10+ years of industry experience", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { name: "Bruce Wayne", email: "bruce@wprise.com", phone: "+1 (555) 456-7890", id: "#F1DAA1", role: "Motion Designer", date: "Sep 25, 2025", status: "Contract", password: "BruceW@2025", department: "Design", description: "Specialized in motion graphics and animations", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Diana Prince", email: "diana@themycra.com", phone: "+1 (555) 567-8901", id: "#3BFFE0", role: "Graphic Designer", date: "Sep 20, 2025", status: "Internship", password: "DianaP@2025", department: "Design", description: "Junior graphic designer with strong visual skills", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { name: "Clark Kent", email: "clark@dailyplet.com", phone: "+1 (555) 678-9012", id: "#5E5D87", role: "Service Designer", date: "Sep 29, 2025", status: "Temporary", password: "ClarkK@2025", department: "Design", description: "Service design expert with focus on user journeys", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Natasha Roma", email: "natasha@shield.com", phone: "+1 (555) 789-0123", id: "#E5C7CA", role: "Visual Designer", date: "Aug 28, 2025", status: "Volunteer", password: "NatashaR@2025", department: "Design", description: "Visual designer passionate about brand identity", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { name: "Peter Parker", email: "peter@dailgle.com", phone: "+1 (555) 890-1234", id: "#8E5A7D", role: "Lead Designer", date: "Aug 27, 2025", status: "Remote", password: "PeterP@2025", department: "Design", description: "Lead designer leading creative team initiatives", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Tony Stark", email: "tony@startries.com", phone: "+1 (555) 901-2345", id: "#FF6F61", role: "Motion Designer", date: "Aug 26, 2025", status: "Hybrid", password: "TonyS@2025", department: "Design", description: "Innovative motion designer creating engaging content", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { name: "Jane Cooper", email: "hello@hugeicons.com", phone: "+1 (555) 012-3456", id: "#4D9B93", role: "Design Manager", date: "Aug 25, 2025", status: "Consultant", password: "JaneC@2025", department: "Design", description: "Design manager overseeing creative projects", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Steve Rogers", email: "steve@avengers.com", phone: "+1 (555) 123-5678", id: "#F0E68A", role: "Brand Designer", date: "Aug 24, 2025", status: "Seasonal", password: "SteveR@2025", department: "Design", description: "Brand designer creating visual identities", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { name: "Nicole Taylor", email: "nicole@creative.com", phone: "+1 (555) 234-6789", id: "#FF6B9D", role: "UI Designer", date: "Aug 23, 2025", status: "Full-time", password: "NicoleT@2025", department: "Design", description: "UI designer specialized in web interfaces", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Tom Holland", email: "tom@marvel.com", phone: "+1 (555) 345-7890", id: "#8B4513", role: "Frontend Dev", date: "Aug 22, 2025", status: "Full-time", password: "TomH@2025", department: "Development", description: "Frontend developer with React expertise", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { name: "Scarlett Johansson", email: "scarlett@marvel.com", phone: "+1 (555) 456-8901", id: "#DC143C", role: "Product Designer", date: "Aug 21, 2025", status: "Freelance", password: "ScarletJ@2025", department: "Design", description: "Product designer with user research background", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Chris Evans", email: "chris@marvel.com", phone: "+1 (555) 567-9012", id: "#228B22", role: "Lead Designer", date: "Aug 20, 2025", status: "Part-time", password: "ChrisE@2025", department: "Design", description: "Seasoned lead designer with mentoring skills", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { name: "Zendaya Smith", email: "zendaya@creative.com", phone: "+1 (555) 678-0123", id: "#FFD700", role: "UX Designer", date: "Aug 19, 2025", status: "Full-time", password: "ZendayaS@2025", department: "Design", description: "UX designer focused on accessibility", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Robert Pattinson", email: "robert@creative.com", phone: "+1 (555) 789-1234", id: "#1A1A1A", role: "Backend Developer", date: "Aug 18, 2025", status: "Full-time", password: "RobertP@2025", department: "Development", description: "Backend developer specializing in databases", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { name: "Emma Watson", email: "emma@creative.com", phone: "+1 (555) 890-2345", id: "#2B2B2B", role: "Frontend Developer", date: "Aug 17, 2025", status: "Part-time", password: "EmmaW@2025", department: "Development", description: "Frontend developer with Vue.js expertise", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Leonardo DiCaprio", email: "leo@creative.com", phone: "+1 (555) 901-3456", id: "#3C3C3C", role: "Full Stack Developer", date: "Aug 16, 2025", status: "Freelance", password: "LeoD@2025", department: "Development", description: "Full stack developer comfortable across all layers", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { name: "Bryce Dallas Howard", email: "bryce@creative.com", phone: "+1 (555) 012-4567", id: "#4D4D4D", role: "UI/UX Designer", date: "Aug 15, 2025", status: "Contract", password: "BryceH@2025", department: "Design", description: "UI/UX designer combining aesthetics and usability", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Andrew Garfield", email: "andrew@creative.com", phone: "+1 (555) 123-6789", id: "#5E5E5E", role: "QA Engineer", date: "Aug 14, 2025", status: "Full-time", password: "AndrewG@2025", department: "Development", description: "QA engineer ensuring product quality", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { name: "Kirsten Dunst", email: "kirsten@creative.com", phone: "+1 (555) 234-7890", id: "#6F6F6F", role: "Product Manager", date: "Aug 13, 2025", status: "Full-time", password: "KirstenD@2025", department: "Management", description: "Product manager driving strategic initiatives", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Ryan Gosling", email: "ryan@creative.com", phone: "+1 (555) 345-8901", id: "#7G7G7G", role: "DevOps Engineer", date: "Aug 12, 2025", status: "Part-time", password: "RyanG@2025", department: "Development", description: "DevOps engineer managing infrastructure", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { name: "Rachel McAdams", email: "rachel@creative.com", phone: "+1 (555) 456-9012", id: "#8H8H8H", role: "Data Analyst", date: "Aug 11, 2025", status: "Freelance", password: "RachelM@2025", department: "Development", description: "Data analyst providing business insights", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Benedict Cumberbatch", email: "benedict@creative.com", phone: "+1 (555) 567-0123", id: "#9I9I9I", role: "System Architect", date: "Aug 10, 2025", status: "Contract", password: "BenedictC@2025", department: "Development", description: "System architect designing scalable solutions", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { name: "Tilda Swinton", email: "tilda@creative.com", phone: "+1 (555) 678-1234", id: "#1J1J1J", role: "Creative Director", date: "Aug 09, 2025", status: "Full-time", password: "TildaS@2025", department: "Design", description: "Creative director leading design vision", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Tom Hiddleston", email: "tom.h@creative.com", phone: "+1 (555) 789-2345", id: "#2K2K2K", role: "Graphic Designer", date: "Aug 08, 2025", status: "Part-time", password: "TomH2@2025", department: "Design", description: "Graphic designer with print expertise", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { name: "Idris Elba", email: "idris@creative.com", phone: "+1 (555) 890-3456", id: "#3L3L3L", role: "Marketing Manager", date: "Aug 07, 2025", status: "Full-time", password: "IdrisE@2025", department: "Marketing", description: "Marketing manager driving campaigns", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Lupita Nyong'o", email: "lupita@creative.com", phone: "+1 (555) 901-4567", id: "#4M4M4M", role: "Content Writer", date: "Aug 06, 2025", status: "Freelance", password: "LupitaN@2025", department: "Marketing", description: "Content writer creating engaging copy", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { name: "Oscar Isaac", email: "oscar@creative.com", phone: "+1 (555) 012-5678", id: "#5N5N5N", role: "SEO Specialist", date: "Aug 05, 2025", status: "Full-time", password: "OscarI@2025", department: "Marketing", description: "SEO specialist optimizing search visibility", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Saoirse Ronan", email: "saoirse@creative.com", phone: "+1 (555) 123-7890", id: "#6O6O6O", role: "Social Media Manager", date: "Aug 04, 2025", status: "Part-time", password: "SaoirseR@2025", department: "Marketing", description: "Social media manager building community", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  { name: "Jake Gyllenhaal", email: "jake@creative.com", phone: "+1 (555) 234-8901", id: "#7P7P7P", role: "Video Editor", date: "Aug 03, 2025", status: "Contract", password: "JakeG@2025", department: "Design", description: "Video editor producing high-quality content", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Rebecca Ferguson", email: "rebecca@creative.com", phone: "+1 (555) 345-9012", id: "#8Q8Q8Q", role: "Copywriter", date: "Aug 02, 2025", status: "Full-time", password: "RebeccaF@2025", department: "Marketing", description: "Copywriter skilled in persuasive writing", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
];

const avatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80";

export default function EmployeeTableUI() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(11);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState(allEmployees);
  
  // Modal states
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Design",
    role: "Web Designer",
    status: "Full-time",
    joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    description: "",
    photo: null
  });

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const statusMatch = !filterStatus || emp.status === filterStatus;
    const searchMatch = !searchQuery || 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const displayedEmployees = filteredEmployees.slice(startIdx, endIdx);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    
    return pages;
  };

  const handleAddEmployee = () => {
    if (formData.name && formData.email && formData.role) {
      const generatePassword = () => {
        return "Pass" + Math.random().toString(36).substring(2, 8).toUpperCase() + "@2025";
      };
      const newEmployee = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        id: `#${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        role: formData.role,
        date: formData.joinDate,
        status: formData.status,
        password: generatePassword(),
        department: formData.department,
        description: formData.description,
        photo: formData.photo || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80"
      };
      setEmployees([newEmployee, ...employees]);
      setFormData({ name: "", email: "", phone: "", department: "Design", role: "Web Designer", status: "Full-time", joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), description: "", photo: null });
      setShowAddModal(false);
      alert("Employee added successfully!");
    } else {
      alert("Please fill in all fields!");
    }
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page) => {
    if (page !== '...') setCurrentPage(page);
  };

  const clearFilters = () => {
    setFilterStatus("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Employee Management</h1>
              <p className="text-slate-500 text-sm mt-1">Manage and organize your team members efficiently</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              <Plus className="w-5 h-5" /> Add Employee
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Total Employees</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{employees.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Active Employees</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{employees.filter(e => e.status === "Full-time").length}</p>
          </div>
          {/* <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">New Hires</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{employees.filter(e => e.date.includes("Aug") || e.date.includes("Oct")).length}</p>
          </div> */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Remote Workers</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{employees.filter(e => e.status === "Remote" || e.status === "Hybrid").length}</p>
          </div>
        </div>

        {/* Filter & Search Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-800">Search & Filter</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Box */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Employee</label>
              <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2.5 bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Name, email, ID, or role..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="outline-none text-sm w-full bg-transparent"
                />
              </div>
            </div>

            {/* Filter by Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Status</label>
              <select 
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Status</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Freelance">Freelance</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Temporary">Temporary</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Consultant">Consultant</option>
                <option value="Seasonal">Seasonal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6">

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="py-4 px-6 text-slate-700 font-semibold text-sm">Name</th>
                  <th className="py-4 px-6 text-slate-700 font-semibold text-sm">ID</th>
                  <th className="py-4 px-6 text-slate-700 font-semibold text-sm">Role</th>
                  <th className="py-4 px-6 text-slate-700 font-semibold text-sm">Join Date</th>
                  <th className="py-4 px-6 text-slate-700 font-semibold text-sm">Status</th>
                  <th className="py-4 px-6 text-slate-700 font-semibold text-sm">Password</th>
                  <th className="py-4 px-6 text-slate-700 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {displayedEmployees.map((emp, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50 transition"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={avatar}
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{emp.name}</p>
                          <p className="text-xs text-slate-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-600">{emp.id}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium">
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{emp.date}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        ● {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-xs font-mono">
                        {emp.password}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative flex justify-center">
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === emp.id ? null : emp.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition"
                          title="Actions"
                        >
                          <MoreHorizontal className="w-5 h-5 text-slate-500 cursor-pointer" />
                        </button>

                        {/* Professional Action Dropdown Menu */}
                        {activeDropdown === emp.id && (
                          <div className="absolute right-0 top-10 z-40 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden w-56 animate-in fade-in duration-150">
                            {/* Header Section */}
                            <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Actions</p>
                            </div>
                            
                            {/* View Profile */}
                            <button 
                              onClick={() => {
                                setSelectedEmployee(emp);
                                setShowViewModal(true);
                                setActiveDropdown(null);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-blue-50 text-slate-700 text-sm border-b border-slate-100 transition duration-150"
                            >
                              <Eye size={16} className="text-blue-500 flex-shrink-0" />
                              <span className="font-medium">View Profile</span>
                            </button>

                            {/* Edit Employee */}
                            <button 
                              onClick={() => {
                                setSelectedEmployee(emp);
                                setFormData({
                                  name: emp.name,
                                  email: emp.email,
                                  phone: emp.phone,
                                  department: emp.department,
                                  role: emp.role,
                                  status: emp.status,
                                  joinDate: emp.date,
                                  description: emp.description,
                                  photo: emp.photo
                                });
                                setShowEditModal(true);
                                setActiveDropdown(null);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-amber-50 text-slate-700 text-sm border-b border-slate-100 transition duration-150"
                            >
                              <Edit size={16} className="text-amber-500 flex-shrink-0" />
                              <span className="font-medium">Edit Employee</span>
                            </button>

                            {/* Change Status */}
                            {/* <button 
                              onClick={() => {
                                setSelectedEmployee(emp);
                                setShowStatusModal(true);
                                setActiveDropdown(null);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-purple-50 text-slate-700 text-sm border-b border-slate-100 transition duration-150"
                            >
                              <AlertCircle size={16} className="text-purple-500 flex-shrink-0" />
                              <span className="font-medium">Change Status</span>
                            </button> */}

                            {/* Assign Department */}
                            {/* <button 
                              onClick={() => {
                                setSelectedEmployee(emp);
                                setShowDepartmentModal(true);
                                setActiveDropdown(null);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-green-50 text-slate-700 text-sm border-b border-slate-100 transition duration-150"
                            >
                              <Briefcase size={16} className="text-green-500 flex-shrink-0" />
                              <span className="font-medium">Assign Department</span>
                            </button> */}

                            {/* Reset Password */}
                            <button 
                              onClick={() => {
                                setSelectedEmployee(emp);
                                setShowResetPasswordModal(true);
                                setActiveDropdown(null);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-cyan-50 text-slate-700 text-sm border-b border-slate-100 transition duration-150"
                            >
                              <Lock size={16} className="text-cyan-500 flex-shrink-0" />
                              <span className="font-medium">Reset Password</span>
                            </button>

                            {/* Delete Employee - Danger Action */}
                            <button 
                              onClick={() => {
                                handleDeleteEmployee(emp.id);
                                setActiveDropdown(null);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 text-red-600 text-sm transition duration-150"
                            >
                              <Trash2 size={16} className="text-red-500 flex-shrink-0" />
                              <span className="font-medium">Delete Employee</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-center pt-6 border-t border-slate-200 mt-6 gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>

              {getPageNumbers().map((page, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageClick(page)}
                  disabled={page === '...'}
                  className={`
                    w-8 h-8 rounded-lg text-sm font-medium transition
                    ${page === currentPage
                      ? 'bg-slate-900 text-white'
                      : page === '...'
                      ? 'cursor-default text-slate-400'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }
                  `}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Add New Employee</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="First & Last"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="employee@company.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Design">Design</option>
                    <option value="Development">Development</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Web Designer">Web Designer</option>
                    <option value="UI Designer">UI Designer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Join Date</label>
                  <input
                    type="date"
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                      setFormData({ ...formData, joinDate: formattedDate });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the employee..."
                  rows="2"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Photo Upload</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, photo: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="flex-1"
                  />
                  {formData.photo && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                      <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmployee}
                  className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition"
                >
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Employee Profile</h2>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Header with Photo */}
              <div className="col-span-2 flex items-center gap-4 pb-4 border-b border-slate-200">
                <img
                  src={selectedEmployee.photo || avatar}
                  alt={selectedEmployee.name}
                  className="w-20 h-20 rounded-lg border-2 border-slate-200 object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedEmployee.name}</h3>
                  <p className="text-sm text-slate-500">{selectedEmployee.id}</p>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium mt-2">
                    {selectedEmployee.role}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Email</label>
                  <p className="text-slate-900 font-medium">{selectedEmployee.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Phone</label>
                  <p className="text-slate-900 font-medium">{selectedEmployee.phone}</p>
                </div>
              </div>

              {/* Department and Status */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Department</label>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                    {selectedEmployee.department}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Employment Type</label>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                    {selectedEmployee.status}
                  </span>
                </div>
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Join Date</label>
                <p className="text-slate-900 font-medium">{selectedEmployee.date}</p>
              </div>

              {/* Description */}
              {selectedEmployee.description && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Description</label>
                  <p className="text-slate-700 leading-relaxed">{selectedEmployee.description}</p>
                </div>
              )}

              {/* Close Button */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Edit Employee</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name and Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Department and Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Design">Design</option>
                    <option value="Development">Development</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Web Designer">Web Designer</option>
                    <option value="UI Designer">UI Designer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                  </select>
                </div>
              </div>

              {/* Employment Type and Join Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Employment Type</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Join Date</label>
                  <input
                    type="date"
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                      setFormData({ ...formData, joinDate: formattedDate });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the employee..."
                  rows="2"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Photo</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, photo: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="flex-1"
                  />
                  {(formData.photo || selectedEmployee.photo) && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                      <img src={formData.photo || selectedEmployee.photo} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert("Employee updated successfully!");
                    setShowEditModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Status Modal */}
      {showStatusModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Change Employee Status</h2>

            <div className="space-y-3 mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">Select New Status</label>
              <select
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                defaultValue={selectedEmployee.status}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Freelance">Freelance</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Status updated successfully!");
                  setShowStatusModal(false);
                }}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Department Modal */}
      {showDepartmentModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Assign Department</h2>

            <div className="space-y-3 mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">Select Department</label>
              <select
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="">Choose a department...</option>
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDepartmentModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Department assigned successfully!");
                  setShowDepartmentModal(false);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h2>
            <p className="text-slate-600 text-sm mb-6">Send a password reset link to {selectedEmployee.email}?</p>

            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-cyan-900">
                A reset link will be sent to the employee's email. They will be able to set a new password.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Password reset link sent to " + selectedEmployee.email);
                  setShowResetPasswordModal(false);
                }}
                className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium transition"
              >
                Send Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
