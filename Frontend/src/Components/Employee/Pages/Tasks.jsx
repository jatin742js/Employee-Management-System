import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Plus, Trash2, Edit } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Redesign Website Homepage', description: 'Create modern homepage design', priority: 'High', status: 'In Progress', dueDate: '2025-03-31' },
    { id: 2, title: 'Update Documentation', description: 'Add API documentation', priority: 'Medium', status: 'Pending', dueDate: '2025-04-05' },
    { id: 3, title: 'Fix Bug in Login Module', description: 'Resolve authentication issue', priority: 'High', status: 'In Progress', dueDate: '2025-03-28' },
    { id: 4, title: 'Review PR #123', description: 'Code review for feature branch', priority: 'Medium', status: 'Completed', dueDate: '2025-03-25' },
  ]);

  const statusCounts = {
    Pending: tasks.filter(t => t.status === 'Pending').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    Completed: tasks.filter(t => t.status === 'Completed').length,
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'text-red-600 bg-red-50 dark:bg-red-900/20',
      'Medium': 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
      'Low': 'text-green-600 bg-green-50 dark:bg-green-900/20',
    };
    return colors[priority] || '';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Completed': <CheckCircle className="h-5 w-5 text-green-600" />,
      'In Progress': <Clock className="h-5 w-5 text-blue-600" />,
      'Pending': <AlertCircle className="h-5 w-5 text-yellow-600" />,
    };
    return icons[status] || null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Tasks</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your daily tasks and assignments</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.Pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts['In Progress']}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.Completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    {getStatusIcon(task.status)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                        {task.priority} Priority
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Due: {task.dueDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
