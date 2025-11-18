'use client';

import { useState } from 'react';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup attempt:', formData);
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8 bg-card-light">
      <div className="flex w-full max-w-md flex-col gap-8 py-10">
        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <span className="material-symbols-outlined text-primary text-5xl">
            deployed_code
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary-light">
              Create Account
            </h1>
            <p className="text-text-secondary-light">
              Join thousands of teams shipping projects faster
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col w-full">
                <p className="text-sm font-medium leading-normal pb-2 text-text-primary-light">
                  First Name
                </p>
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light focus:outline-0 border border-border-light bg-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 h-12 placeholder:text-text-secondary-light p-3 text-base font-normal leading-normal"
                  placeholder="John"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="flex flex-col w-full">
                <p className="text-sm font-medium leading-normal pb-2 text-text-primary-light">
                  Last Name
                </p>
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light focus:outline-0 border border-border-light bg-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 h-12 placeholder:text-text-secondary-light p-3 text-base font-normal leading-normal"
                  placeholder="Doe"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            {/* Email Field */}
            <label className="flex flex-col w-full">
              <p className="text-sm font-medium leading-normal pb-2 text-text-primary-light">
                Work Email
              </p>
              <input
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light focus:outline-0 border border-border-light bg-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 h-12 placeholder:text-text-secondary-light p-3 text-base font-normal leading-normal"
                placeholder="you@company.com"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            {/* Company Field */}
            <label className="flex flex-col w-full">
              <p className="text-sm font-medium leading-normal pb-2 text-text-primary-light">
                Company <span className="text-text-secondary-light">(Optional)</span>
              </p>
              <input
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light focus:outline-0 border border-border-light bg-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 h-12 placeholder:text-text-secondary-light p-3 text-base font-normal leading-normal"
                placeholder="Your company name"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
              />
            </label>

            {/* Password Field */}
            <label className="flex flex-col w-full">
              <p className="text-sm font-medium leading-normal pb-2 text-text-primary-light">
                Password
              </p>
              <div className="relative flex w-full flex-1 items-center">
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light focus:outline-0 border border-border-light bg-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 h-12 placeholder:text-text-secondary-light p-3 pr-10 text-base font-normal leading-normal"
                  placeholder="Create a strong password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 text-text-secondary-light hover:text-text-primary-light transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </label>

            {/* Confirm Password Field */}
            <label className="flex flex-col w-full">
              <p className="text-sm font-medium leading-normal pb-2 text-text-primary-light">
                Confirm Password
              </p>
              <div className="relative flex w-full flex-1 items-center">
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light focus:outline-0 border border-border-light bg-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 h-12 placeholder:text-text-secondary-light p-3 pr-10 text-base font-normal leading-normal"
                  placeholder="Confirm your password"
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

            {/* Terms and Conditions */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-0.5 rounded border-border-light text-primary focus:ring-primary/20 focus:ring-4"
                required
              />
              <span className="text-sm text-text-secondary-light leading-tight">
                I agree to the{' '}
                <a className="text-primary hover:underline font-medium" href="#">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a className="text-primary hover:underline font-medium" href="#">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="flex items-center justify-center whitespace-nowrap h-12 px-6 rounded-lg w-full bg-primary text-white text-base font-semibold hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors"
          >
            Create Account
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center">
          <p className="text-sm text-text-secondary-light">
            Already have an account?{' '}
            <a
              className="font-semibold text-primary hover:underline"
              href="/login"
            >
              Sign In
            </a>
          </p>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-text-secondary-light">
            By signing up, you agree to our terms. We'll occasionally send you account-related emails.
          </p>
        </div>
      </div>
    </div>
  );
}