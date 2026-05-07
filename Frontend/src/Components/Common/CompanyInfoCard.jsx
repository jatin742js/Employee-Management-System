import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, Globe } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';

export default function CompanyInfoCard() {
  const { socket } = useSocket() || {};
  const [companyInfo, setCompanyInfo] = useState({
    organization: 'Company Name',
    email: 'contact@company.com',
    phone: 'N/A',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
  });

  // Fetch company info from API on mount
  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const response = await api.get('/admin/auth/company-info');
      if (response.data.data) {
        setCompanyInfo(response.data.data);
        // Store in localStorage for offline access
        localStorage.setItem('companyInfo', JSON.stringify(response.data.data));
      }
    } catch (err) {
      console.log('Error fetching company info:', err);
      // Try to use cached data
      const cached = localStorage.getItem('companyInfo');
      if (cached) {
        try {
          setCompanyInfo(JSON.parse(cached));
        } catch {
          // Use defaults
        }
      }
    }
  };

  // Listen for real-time company info updates
  useEffect(() => {
    if (socket) {
      socket.on('admin:addressUpdated', (data) => {
        if (data) {
          setCompanyInfo(prev => ({
            ...prev,
            address: data.address || prev.address,
            organization: data.organization || prev.organization,
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
          }));
        }
      });

      socket.on('company:infoUpdated', (data) => {
        if (data) {
          setCompanyInfo(prev => {
            const updated = {
              ...prev,
              address: data.address || prev.address,
              organization: data.organization || prev.organization,
              email: data.email || prev.email,
              phone: data.phone || prev.phone,
            };
            // Update localStorage for offline access
            localStorage.setItem('companyInfo', JSON.stringify(updated));
            return updated;
          });
        }
      });

      return () => {
        socket.off('admin:addressUpdated');
        socket.off('company:infoUpdated');
      };
    }
  }, [socket]);

  // Listen for profile updates from custom events
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      const { detail } = event;
      setCompanyInfo(prev => ({
        ...prev,
        organization: detail.organization || prev.organization,
        email: detail.email || prev.email,
        phone: detail.phone || prev.phone,
        address: detail.address || prev.address,
      }));
    };

    window.addEventListener('adminProfileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('adminProfileUpdated', handleProfileUpdate);
  }, []);

  const fullAddress = [
    companyInfo.address.street,
    companyInfo.address.city,
    companyInfo.address.state,
    companyInfo.address.zip,
    companyInfo.address.country,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-indigo-200 dark:border-gray-700 shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          {companyInfo.organization}
        </h3>

        {/* Address */}
        {fullAddress && (
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Address
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{fullAddress}</p>
            </div>
          </div>
        )}

        {/* Email */}
        {companyInfo.email && (
          <div className="flex items-center gap-3 mb-4">
            <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email
              </p>
              <a
                href={`mailto:${companyInfo.email}`}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {companyInfo.email}
              </a>
            </div>
          </div>
        )}

        {/* Phone */}
        {companyInfo.phone && companyInfo.phone !== 'N/A' && (
          <div className="flex items-center gap-3 mb-4">
            <Phone className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </p>
              <a
                href={`tel:${companyInfo.phone}`}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {companyInfo.phone}
              </a>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-gray-700 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Information updates in real-time
          </p>
        </div>
      </div>
    </div>
  );
}
