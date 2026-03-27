import React from 'react';
import { Briefcase, Users } from 'lucide-react';

export default function Projects() {
  const projects = [
    { id: 1, name: 'Website Redesign', description: 'Complete redesign of company website', status: 'In Progress', team: 5, progress: 65, dueDate: '2025-04-15' },
    { id: 2, name: 'Mobile App Development', description: 'iOS and Android app launch', status: 'In Progress', team: 8, progress: 45, dueDate: '2025-05-30' },
    { id: 3, name: 'Dashboard Analytics', description: 'New analytics dashboard for clients', status: 'Completed', team: 3, progress: 100, dueDate: '2025-03-20' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
    };
    return colors[status] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Projects</h1>
          <p className="text-gray-600 dark:text-gray-400">View and collaborate on assigned projects</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <Briefcase className="h-6 w-6 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{project.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>{project.team} members</span>
                </div>
                <span className="text-xs text-gray-500">Due: {project.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
