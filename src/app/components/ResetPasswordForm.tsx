'use client';

import { useState, useEffect } from 'react';

type PasswordStrength = 'weak' | 'medium' | 'strong';

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('weak');
  const [strengthPercentage, setStrengthPercentage] = useState(0);
  const [requirements, setRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    const newRequirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Calculate strength
    if (newRequirements.minLength) strength += 25;
    if (newRequirements.hasUppercase) strength += 25;
    if (newRequirements.hasNumber) strength += 25;
    if (newRequirements.hasSpecialChar) strength += 25;

    setStrengthPercentage(strength);
    setRequirements(newRequirements);

    if (strength < 50) return 'weak';
    if (strength < 75) return 'medium';
    return 'strong';
  };

  useEffect(() => {
    if (formData.newPassword) {
      const strength = checkPasswordStrength(formData.newPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength('weak');
      setStrengthPercentage(0);
    }
  }, [formData.newPassword]);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-red-500';
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      default: return 'Weak';
    }
  };

  const getStrengthTextColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'strong': return 'text-green-600';
      default: return 'text-red-600';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (passwordStrength === 'weak') {
      alert("Please choose a stronger password!");
      return;
    }

    // Handle password reset logic here
    console.log('Password reset:', formData.newPassword);
    alert('Password has been reset successfully!');
  };

  const getRequirementIcon = (met: boolean) => {
    return met ? 'check_circle' : 'radio_button_unchecked';
  };

  const getRequirementColor = (met: boolean) => {
    return met ? 'text-green-500' : 'text-text-secondary-light';
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8 bg-card-light">
      <div className="flex w-full max-w-md flex-col gap-8 py-10">
        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <span className="material-symbols-outlined text-primary text-5xl">
            lock_reset
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary-light">
              Reset Password
            </h1>
            <p className="text-text-secondary-light">
              Create a new, strong password for your account
            </p>
          </div>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {/* New Password Field */}
            <label className="flex flex-col w-full">
              <p className="text-sm font-medium leading-normal pb-2 text-text-primary-light">
                New Password
              </p>
              <div className="relative flex w-full flex-1 items-center">
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light focus:outline-0 border border-border-light bg-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 h-12 placeholder:text-text-secondary-light p-3 pr-10 text-base font-normal leading-normal"
                  placeholder="Enter your new password"
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 text-text-secondary-light hover:text-text-primary-light transition-colors"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showNewPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </label>

            {/* Password Strength Indicator */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-text-primary-light">Password Strength</p>
                <p className={`text-sm font-medium ${getStrengthTextColor()}`}>
                  {getStrengthText()}
                </p>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                  style={{ width: `${strengthPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <label className="flex flex-col w-full">
              <p className="text-sm font-medium leading-normal pb-2 text-text-primary-light">
                Confirm New Password
              </p>
              <div className="relative flex w-full flex-1 items-center">
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light focus:outline-0 border border-border-light bg-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 h-12 placeholder:text-text-secondary-light p-3 pr-10 text-base font-normal leading-normal"
                  placeholder="Confirm your new password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 text-text-secondary-light hover:text-text-primary-light transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </label>

            {/* Password Requirements */}
            <div className="flex flex-col gap-2 rounded-lg bg-gray-50 p-4 border border-gray-200">
              <p className="text-sm font-medium text-text-primary-light">Password must contain:</p>
              <ul className="space-y-1 text-sm text-text-secondary-light">
                <li className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-base ${getRequirementColor(requirements.minLength)}`}>
                    {getRequirementIcon(requirements.minLength)}
                  </span>
                  <span>At least 8 characters</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-base ${getRequirementColor(requirements.hasUppercase)}`}>
                    {getRequirementIcon(requirements.hasUppercase)}
                  </span>
                  <span>1 uppercase letter</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-base ${getRequirementColor(requirements.hasNumber)}`}>
                    {getRequirementIcon(requirements.hasNumber)}
                  </span>
                  <span>1 number</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-base ${getRequirementColor(requirements.hasSpecialChar)}`}>
                    {getRequirementIcon(requirements.hasSpecialChar)}
                  </span>
                  <span>1 special character</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            className="flex items-center justify-center whitespace-nowrap h-12 px-6 rounded-lg w-full bg-primary text-white text-base font-semibold hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors"
          >
            Reset Password
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center">
          <p className="text-sm text-text-secondary-light">
            Remember your password?{' '}
            <a
              className="font-semibold text-primary hover:underline"
              href="/login"
            >
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}