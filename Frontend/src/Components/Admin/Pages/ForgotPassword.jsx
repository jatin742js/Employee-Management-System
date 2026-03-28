import React, { useState } from 'react';
import { Mail, Building2, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    organization: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email address is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.organization.trim()) {
      setError('Organization name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API call to send reset link
    setTimeout(() => {
      console.log('Reset password request:', formData);
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Check Your Email
              </h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <br />
                <strong className="text-gray-900">{formData.email}</strong>
              </p>
              <button
                onClick={() => navigate('/admin/login')}
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-medium transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8 transition-all duration-300">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 bg-indigo-100 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-sm text-gray-600">We'll help you reset it</p>
        </div>

        {/* Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-3 border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Work Email *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                placeholder="admin@company.com"
              />
            </div>
          </div>

          {/* Organization */}
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
              Organization / Company *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="organization"
                name="organization"
                type="text"
                required
                value={formData.organization}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                placeholder="Your Company Name"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span>Sending Reset Link</span>
                <svg className="animate-spin h-5 w-5 text-white ml-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </>
            ) : (
              <>
                Send Reset Link
                <Send className="h-4 w-4 ml-2" />
              </>
            )}
          </button>

          {/* Back to Login Link */}
          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="font-medium text-indigo-600 hover:text-indigo-500 transition cursor-pointer bg-none border-none p-0"
              >
                Back to Login
              </button>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-4 text-xs text-gray-500">
          <p>Secure access for authorized administrators only</p>
        </div>
      </div>
    </div>
  );
}