import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Building2, Briefcase, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import adminAuthService from '../../../services/adminAuthService';

export default function AdminRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    position: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  // Hide password manager icons
  useEffect(() => {
    const removePasswordManagerIcons = () => {
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      passwordInputs.forEach(input => {
        input.addEventListener('input', (e) => {
          // Prevent any browser UI from appearing
          if (e.isTrusted) {
            input.removeAttribute('data-pwd');
          }
        });
      });
    };

    const timer = setTimeout(removePasswordManagerIcons, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email address is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.organization.trim()) {
      setError('Organization name is required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the Terms and Conditions');
      return;
    }

    setIsSubmitting(true);

    try {
      // Make API call
      const response = await adminAuthService.registerAdmin(formData);
      
      setSuccessMessage('Registration successful! Redirecting to login...');
      console.log('Admin registration successful:', response);

      // Redirect to login after 1.5 seconds
      setTimeout(() => {
        navigate('/admin/login');
      }, 1500);
    } catch (err) {
      const errorMessage = err.message || err.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
          {/* Header with gradient accent */}
          <div className="relative px-8 py-6 bg-gradient-to-r from-indigo-50 to-indigo-50 dark:from-indigo-900 dark:to-indigo-800 border-b border-indigo-200 dark:border-indigo-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg shadow-sm">
                <Briefcase className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Registration
                </h1>
                <p className="text-gray-600 text-sm mt-0.5">
                  Create your admin account to manage your organization
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm font-medium">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Essential Info - Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="admin@company.com"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                    />
                  </div>
                </div>
              </div>

              {/* Organization & Position & Phone - Three Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Organization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization / Company *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="Your Company Name"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                    />
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position / Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="HR Manager, IT Admin, etc."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                    />
                  </div>
                </div>
              </div>

              {/* Password Fields - Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter Password "
                      required
                      autoComplete="new-password"
                      data-lpignore="true"
                      data-form-type="other"
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition pointer-events-auto z-10"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Enter Confirm Password"
                      required
                      autoComplete="new-password"
                      data-lpignore="true"
                      data-form-type="other"
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition pointer-events-auto z-10"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  I agree to the{' '}
                  <button type="button" className="text-indigo-600 hover:text-indigo-500 font-medium transition bg-none border-none p-0 cursor-pointer">
                    Terms and Conditions
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-indigo-600 hover:text-indigo-500 font-medium transition bg-none border-none p-0 cursor-pointer">
                    Privacy Policy
                  </button>
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span>Creating Account</span>
                  </>
                ) : (
                  <>
                    <span>Create Admin Account</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/admin/login')}
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition cursor-pointer bg-none border-none p-0"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>

       
      </div>
    </div>
  );
}