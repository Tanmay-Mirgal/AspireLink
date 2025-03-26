import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Search, Check, X, UserPlus, Users, Clock, CheckSquare, UserCheck } from 'lucide-react';

// Header Component
const Header = () => {
  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-gray-700 text-white rounded-md px-4 py-2 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <div className="bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center">
          <span className="font-medium">A</span>
        </div>
      </div>
    </header>
  );
};

// Sidebar Component
const Sidebar = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Users size={18} /> },
    { id: 'students', label: 'Students', icon: <Users size={18} /> },
    { id: 'mentors', label: 'Mentors', icon: <UserCheck size={18} /> },
    { id: 'pending', label: 'Pending Registrations', icon: <Clock size={18} /> },
    { id: 'approved', label: 'Approved Registrations', icon: <CheckSquare size={18} /> },
    { id: 'assign', label: 'Assign Mentor', icon: <UserPlus size={18} /> },
  ];

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center p-3 rounded-md transition-colors ${
                  activeView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// Stats Cards Component
const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="border border-gray-700 rounded-md p-4 flex flex-col justify-center items-center bg-gray-800">
        <h2 className="text-lg text-gray-300">Total Students</h2>
        <p className="text-2xl font-bold mt-2">{stats.totalStudents}</p>
      </div>
      <div className="border border-gray-700 rounded-md p-4 flex flex-col justify-center items-center bg-gray-800">
        <h2 className="text-lg text-gray-300">Total Mentor</h2>
        <p className="text-2xl font-bold mt-2">{stats.totalMentors}</p>
      </div>
      <div className="border border-gray-700 rounded-md p-4 flex flex-col justify-center items-center bg-gray-800 relative">
        <div className="absolute top-2 right-2">
          <button className="bg-gray-700 hover:bg-gray-600 rounded-full p-1 transition-colors">
            <Plus size={16} />
          </button>
        </div>
        <h2 className="text-lg text-gray-300">No of pending registrations</h2>
        <p className="text-2xl font-bold mt-2">{stats.pendingRegistrations}</p>
      </div>
    </div>
  );
};

// Chart Component
const Chart = ({ data }) => {
  return (
    <div className="border border-gray-700 rounded-md p-4 bg-gray-800 h-64 mb-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
            labelStyle={{ color: '#eee' }}
          />
          <Bar dataKey="students" fill="#3B82F6" name="Students" />
          <Bar dataKey="mentors" fill="#10B981" name="Mentors" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Search Bar Component
const SearchBar = ({ placeholder }) => {
  return (
    <div className="relative">
      <input 
        type="text" 
        placeholder={placeholder || "Search..."} 
        className="bg-gray-700 text-white rounded-md px-4 py-2 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
    </div>
  );
};


// Dashboard View Component
const DashboardView = ({ stats, chartData }) => {
  return (
    <div className="flex flex-col gap-4">
      <StatsCards stats={stats} />
      <Chart data={chartData} />
    </div>
  );
};

// Main AdminDashboard Component
const AdminDashboard = () => {
  // Sample data for the dashboard
  const [stats, setStats] = useState({
    totalStudents: 120,
    totalMentors: 25,
    pendingRegistrations: 8
  });

  const [chartData, setChartData] = useState([
    { name: 'Jan', students: 65, mentors: 12 },
    { name: 'Feb', students: 80, mentors: 14 },
    { name: 'Mar', students: 95, mentors: 18 },
    { name: 'Apr', students: 110, mentors: 22 },
    { name: 'May', students: 120, mentors: 25 }
  ]);

  // Sample data for tables
  const [students, setStudents] = useState([
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', course: 'Computer Science', joinDate: '2024-01-15' },
    { id: 2, name: 'Samantha Lee', email: 'samantha@example.com', course: 'Data Science', joinDate: '2024-02-03' },
    { id: 3, name: 'Michael Chen', email: 'michael@example.com', course: 'Web Development', joinDate: '2024-02-15' },
    { id: 4, name: 'Jessica Wang', email: 'jessica@example.com', course: 'UX Design', joinDate: '2024-03-01' },
    { id: 5, name: 'David Smith', email: 'david@example.com', course: 'AI & Machine Learning', joinDate: '2024-03-10' }
  ]);

  const [mentors, setMentors] = useState([
    { id: 1, name: 'Dr. Robert Miller', email: 'robert@example.com', expertise: 'Machine Learning', students: 12 },
    { id: 2, name: 'Prof. Sarah Johnson', email: 'sarah@example.com', expertise: 'Web Development', students: 15 },
    { id: 3, name: 'Dr. James Wilson', email: 'james@example.com', expertise: 'Data Science', students: 10 },
    { id: 4, name: 'Prof. Linda Garcia', email: 'linda@example.com', expertise: 'UX/UI Design', students: 8 }
  ]);

  const [pendingRegistrations, setPendingRegistrations] = useState([
    { id: 1, name: 'Thomas Brown', email: 'thomas@example.com', course: 'AI & Machine Learning', date: '2024-03-18' },
    { id: 2, name: 'Emily Davis', email: 'emily@example.com', course: 'Data Science', date: '2024-03-19' },
    { id: 3, name: 'Ryan Wilson', email: 'ryan@example.com', course: 'Cybersecurity', date: '2024-03-20' },
    { id: 4, name: 'Olivia Martinez', email: 'olivia@example.com', course: 'Web Development', date: '2024-03-21' }
  ]);

  const [approvedRegistrations, setApprovedRegistrations] = useState([
    { id: 1, name: 'Kevin Thompson', email: 'kevin@example.com', course: 'Computer Science', date: '2024-03-15', mentor: 'Dr. Robert Miller' },
    { id: 2, name: 'Lisa Anderson', email: 'lisa@example.com', course: 'UX Design', date: '2024-03-16', mentor: 'Prof. Linda Garcia' },
    { id: 3, name: 'Brian Taylor', email: 'brian@example.com', course: 'Data Science', date: '2024-03-17', mentor: 'Dr. James Wilson' }
  ]);

  // State for active view
  const [activeView, setActiveView] = useState('dashboard');

  // Handle approval and rejection
  const handleApprove = (id) => {
    const registration = pendingRegistrations.find(reg => reg.id === id);
    if (registration) {
      // Add to approved registrations
      setApprovedRegistrations([
        ...approvedRegistrations, 
        { ...registration, mentor: 'Unassigned' }
      ]);
      
      // Remove from pending
      setPendingRegistrations(pendingRegistrations.filter(reg => reg.id !== id));
      
      // Update stats
      setStats({
        ...stats,
        totalStudents: stats.totalStudents + 1,
        pendingRegistrations: stats.pendingRegistrations - 1
      });
    }
  };

  const handleReject = (id) => {
    // Remove from pending
    setPendingRegistrations(pendingRegistrations.filter(reg => reg.id !== id));
    
    // Update stats
    setStats({
      ...stats,
      pendingRegistrations: stats.pendingRegistrations - 1
    });
  };

  // Render different views based on activeView state
  const renderView = () => {
    switch (activeView) {
      case 'students':
        return <StudentsTable students={students} />;
      
      case 'mentors':
        return <MentorsTable mentors={mentors} />;
      
      case 'pending':
        return <PendingRegistrationsTable 
                 registrations={pendingRegistrations} 
                 onApprove={handleApprove} 
                 onReject={handleReject} 
               />;
      
      case 'approved':
        return <ApprovedRegistrationsTable registrations={approvedRegistrations} />;
      
      case 'assign':
        return <AssignMentorTable registrations={approvedRegistrations} mentors={mentors} />;
      
      case 'dashboard':
      default:
        return <DashboardView stats={stats} chartData={chartData} />;
    }
  };

  return (
    <div className="flex flex-col bg-gray-900 text-white min-h-screen">
      <div className="flex h-screen">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <div className="flex-1 p-6 overflow-auto">
          <Header />
          <main>
            {renderView()}
          </main>
        </div>
      </div>
    </div>
  );
};

// Mentors Table Component
const MentorsTable = ({ mentors }) => {
  return (
    <div className="bg-gray-800 rounded-md p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Mentor Directory</h2>
        <SearchBar placeholder="Search mentors..." />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Expertise</th>
              <th className="py-3 px-4 text-left">Students</th>
            </tr>
          </thead>
          <tbody>
            {mentors.map((mentor) => (
              <tr key={mentor.id} className="border-t border-gray-800 hover:bg-gray-800">
                <td className="py-3 px-4">{mentor.id}</td>
                <td className="py-3 px-4">{mentor.name}</td>
                <td className="py-3 px-4">{mentor.email}</td>
                <td className="py-3 px-4">{mentor.expertise}</td>
                <td className="py-3 px-4">{mentor.students}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Fix for StudentsTable Component - there was an issue with the table headers
const StudentsTable = ({ students }) => {
  return (
    <div className="bg-gray-800 rounded-md p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Student Directory</h2>
        <SearchBar placeholder="Search students..." />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Course</th>
              <th className="py-3 px-4 text-left">Join Date</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t border-gray-800 hover:bg-gray-800">
                <td className="py-3 px-4">{student.id}</td>
                <td className="py-3 px-4">{student.name}</td>
                <td className="py-3 px-4">{student.email}</td>
                <td className="py-3 px-4">{student.course}</td>
                <td className="py-3 px-4">{student.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Fix for PendingRegistrationsTable Component - there was an issue with the table rows
const PendingRegistrationsTable = ({ registrations, onApprove, onReject }) => {
  return (
    <div className="bg-gray-800 rounded-md p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Pending Registrations</h2>
        <SearchBar placeholder="Search pending..." />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Course</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => (
              <tr key={registration.id} className="border-t border-gray-800 hover:bg-gray-800">
                <td className="py-3 px-4">{registration.id}</td>
                <td className="py-3 px-4">{registration.name}</td>
                <td className="py-3 px-4">{registration.email}</td>
                <td className="py-3 px-4">{registration.course}</td>
                <td className="py-3 px-4">{registration.date}</td>
                <td className="py-3 px-4 flex justify-center space-x-2">
                  <button 
                    onClick={() => onApprove(registration.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center"
                  >
                    <Check size={16} className="mr-1" /> Approve
                  </button>
                  <button 
                    onClick={() => onReject(registration.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md flex items-center"
                  >
                    <X size={16} className="mr-1" /> Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Completion of AssignMentorTable Component
const AssignMentorTable = ({ registrations, mentors }) => {
  return (
    <div className="bg-gray-800 rounded-md p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Assign Mentor</h2>
        <SearchBar placeholder="Search students..." />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-3 px-4 text-left">Student</th>
              <th className="py-3 px-4 text-left">Course</th>
              <th className="py-3 px-4 text-left">Current Mentor</th>
              <th className="py-3 px-4 text-left">Assign To</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => (
              <tr key={registration.id} className="border-t border-gray-800 hover:bg-gray-800">
                <td className="py-3 px-4">{registration.name}</td>
                <td className="py-3 px-4">{registration.course}</td>
                <td className="py-3 px-4">{registration.mentor}</td>
                <td className="py-3 px-4">
                  <select className="bg-gray-700 text-white rounded-md px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Mentor</option>
                    {mentors.map(mentor => (
                      <option key={mentor.id} value={mentor.id}>{mentor.name}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4 text-center">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md">
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;