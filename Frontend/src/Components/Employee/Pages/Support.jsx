import React from 'react';
import { Send, MessageCircle, Clock } from 'lucide-react';

export default function Support() {
  const tickets = [
    { id: 1, subject: 'Unable to access payroll records', status: 'Open', created: '2025-03-25' },
    { id: 2, subject: 'Leave application not submitted', status: 'In Progress', created: '2025-03-20' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Support & Help</h1>
          <p className="text-gray-600 dark:text-gray-400">Get help and track support tickets</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Support Ticket</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Subject</label>
              <input type="text" placeholder="Brief description" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
            <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg">
              <Send className="h-4 w-4" />
              Submit
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Tickets</h2>
          </div>
          <div className="divide-y">
            {tickets.map((t) => (
              <div key={t.id} className="p-6">
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{t.subject}</h3>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">{t.status}</span>
                      <span className="text-xs text-gray-500">#{t.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
