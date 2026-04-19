import React, { useState } from 'react';
import { Mail, Building2, ArrowLeft, Send, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import adminAuthService from '../../../services/adminAuthService';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('verify'); // 'verify' or 'reset'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    organization: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [verifiedData, setVerifiedData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateVerifyForm = () => {
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

  const validateResetForm = () => {
    if (!formData.newPassword.trim()) {
      setError('New password is required');
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!formData.confirmPassword.trim()) {
      setError('Confirm password is required');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!validateVerifyForm()) return;

    // Just move to reset step (verification happens in backend during password reset)
    setVerifiedData({
      email: formData.email,
      organization: formData.organization,
    });
    setStep('reset');
    setError('');
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!validateResetForm()) return;

    setIsSubmitting(true);

    try {
      // Make API call
      const response = await adminAuthService.forgotPassword(
        formData.email,
        formData.organization,
        formData.newPassword
      );

      setSubmitted(true);
    } catch (err) {
      const errorMessage = err.message || err.data?.message || 'Failed to reset password. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
                Password Reset Successful
              </h2>
              <p className="text-gray-600 mb-6">
                Your password has been successfully reset. <br />
                You can now log in using your new password.
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

  if (step === 'reset') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8 transition-all duration-300">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-14 w-14 bg-indigo-100 rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Reset Password</h2>
            <p className="mt-2 text-sm text-gray-600">Enter your new password</p>
          </div>

          {/* Form */}
          <form className="mt-6 space-y-5" onSubmit={handleResetSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-3 border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                  placeholder="Confirm password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
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
                  <span>Resetting Password...</span>
                  <svg className="animate-spin h-5 w-5 text-white ml-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </>
              ) : (
                <>
                  Reset Password
                  <Send className="h-4 w-4 ml-2" />
                </>
              )}
            </button>

            {/* Back Button */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep('verify');
                  setError('');
                }}
                className="text-sm text-gray-600 hover:text-gray-700 font-medium transition cursor-pointer"
              >
                Back to verify
              </button>
            </div>
          </form>
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
        <form className="mt-6 space-y-5" onSubmit={handleVerifySubmit}>
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
                <span>Verifying...</span>
                <svg className="animate-spin h-5 w-5 text-white ml-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </>
            ) : (
              <>
                Continue
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