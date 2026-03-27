import React, { useState } from 'react';
import { Briefcase, Mail, ArrowRight, CheckCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Verification, 3: Reset Password
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = (e) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter your email');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      alert('Verification code sent to your email!');
    }, 1500);
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (!verificationCode) {
      alert('Please enter the verification code');
      return;
    }
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Password reset successful! Redirecting to login...');
      navigate('/admin/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 px-8 py-6">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="h-8 w-8 text-white" />
              <h1 className="text-3xl font-bold text-white">AdminHub</h1>
            </div>
            <p className="text-blue-100">Reset your password</p>
          </div>

          {/* Progress Steps */}
          <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center justify-between gap-2">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                      step >= num
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {step > num ? <CheckCircle className="h-5 w-5" /> : num}
                  </div>
                  {num < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded ${
                        step > num ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
              <span>Email</span>
              <span>Verify</span>
              <span>Reset</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Step 1: Email */}
            {step === 1 && (
              <form onSubmit={handleSendCode} className="space-y-6">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Enter your registered email address to receive a verification code.
                  </p>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@company.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending...' : 'Send Verification Code'}
                  {!loading && <ArrowRight className="h-5 w-5" />}
                </button>
              </form>
            )}

            {/* Step 2: Verification Code */}
            {step === 2 && (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Enter the 6-digit verification code sent to <strong>{email}</strong>
                  </p>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                    placeholder="000000"
                    maxLength="6"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
                >
                  Verify Code
                  <ArrowRight className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Use different email
                </button>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Create your new password. Make sure it's strong and secure.
                  </p>
                  
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    New Password
                  </label>
                  <div className="relative mb-4">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                  {!loading && <ArrowRight className="h-5 w-5" />}
                </button>
              </form>
            )}

            {/* Back to Login */}
            <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
              Remember your password?{' '}
              <button
                onClick={() => navigate('/admin/login')}
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Login here
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-100 mt-4 text-sm">
          © 2025 AdminHub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
