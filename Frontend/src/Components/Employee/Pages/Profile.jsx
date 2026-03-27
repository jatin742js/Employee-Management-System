import React, { useState } from 'react';
import { Edit, Mail, Phone, MapPin, Briefcase, Calendar, Award } from 'lucide-react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const profileData = {
    name: 'Cody Fisher',
    email: 'cody@company.com',
    phone: '+1 (555) 000-0000',
    location: 'San Francisco, CA',
    department: 'Product Design',
    position: 'Senior Product Designer',
    joinDate: 'January 15, 2022',
    bio: 'Creative designer with 5+ years of experience in digital product design and UI/UX.',
  };

  const skills = ['UI Design', 'UX Research', 'Figma', 'Prototyping', 'User Testing', 'Design Systems'];

  const achievements = [
    { title: 'Employee of the Month', date: 'March 2025' },
    { title: 'Project Excellence Award', date: 'February 2025' },
    { title: 'Top Designer Q1', date: 'January 2025' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">View and manage your professional information</p>
          </div>
          <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Edit className="h-4 w-4" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                CF
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{profileData.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{profileData.position}</p>
              <p className="text-xs text-gray-500 mt-4">{profileData.department}</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
                  {isEditing ? (
                    <input type="email" defaultValue={profileData.email} className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" />
                  ) : (
                    <p className="text-gray-900 dark:text-white font-medium">{profileData.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Phone</p>
                  {isEditing ? (
                    <input type="tel" defaultValue={profileData.phone} className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white" />
                  ) : (
                    <p className="text-gray-900 dark:text-white font-medium">{profileData.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Location</p>
                  <p className="text-gray-900 dark:text-white font-medium">{profileData.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Professional Info</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Department</p>
                <p className="text-gray-900 dark:text-white font-medium">{profileData.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Position</p>
                <p className="text-gray-900 dark:text-white font-medium">{profileData.position}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Joined Date</p>
                <p className="text-gray-900 dark:text-white font-medium">{profileData.joinDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Achievements</h3>
          </div>
          <div className="space-y-3">
            {achievements.map((achievement, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{achievement.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex gap-3">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
            <button onClick={() => setIsEditing(false)} className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
