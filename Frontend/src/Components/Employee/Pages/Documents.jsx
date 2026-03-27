import React from 'react';
import { Folder, Download, Share2 } from 'lucide-react';

export default function Documents() {
  const documents = [
    { id: 1, name: 'Employee Handbook.pdf', size: '2.4 MB', uploaded: '2025-03-15', category: 'Policy' },
    { id: 2, name: 'Travel Policy.docx', size: '1.2 MB', uploaded: '2025-03-10', category: 'Policy' },
    { id: 3, name: 'Offer Letter.pdf', size: '340 KB', uploaded: '2025-01-15', category: 'Personal' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Documents</h1>
          <p className="text-gray-600 dark:text-gray-400">Access important documents and certificates</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Document</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Size</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium flex items-center gap-2">
                      <Folder className="h-4 w-4 text-blue-600" />
                      {doc.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{doc.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{doc.size}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{doc.uploaded}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button className="text-blue-600 hover:text-blue-700 p-1">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 p-1">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
