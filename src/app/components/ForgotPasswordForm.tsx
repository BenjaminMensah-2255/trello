'use client';

import { useState } from 'react';

type Step = 'email' | 'success';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('email');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 1500);
  };

  const handleResend = () => {
    setIsLoading(true);
    // Simulate resend API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  if (step === 'success') {
    return (
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8 bg-card-light">
        <div className="flex w-full max-w-md flex-col gap-8 py-10">
          {/* Success Icon and Header */}
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center justify-center size-16 rounded-full bg-green-100 text-green-600">
              <span className="material-symbols-outlined text-3xl">
                check_circle
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-text-primary-light">
                Check Your Email
              </h1>
              <p className="text-text-secondary-light">
                We've sent a password reset link to<br />
                <strong className="text-text-primary-light">{email}</strong>
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 text-lg mt-0.5">
                info
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-blue-800 font-medium">
                  Didn't receive the email?
                </p>
                <p className="text-xs text-blue-700">
                  Check your spam folder or click below to resend the link.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="flex items-center justify-center whitespace-nowrap h-12 px-6 rounded-lg w-full bg-primary text-white text-base font-semibold hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Resending...
                </div>
              ) : (
                'Resend Reset Link'
              )}
            </button>
            
            <a
              href="/login"
              className="flex items-center justify-center whitespace-nowrap h-12 px-6 rounded-lg w-full border border-border-light text-text-primary-light text-base font-semibold hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8 bg-card-light">
      <div className="flex w-full max-w-md flex-col gap-8 py-10">
        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <span className="material-symbols-outlined text-primary text-5xl">
            lock
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary-light">
              Forgot Password?
            </h1>
            <p className="text-text-secondary-light">
              Enter your email and we'll send you a reset link
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {/* Email Field */}
            <label className="flex flex-col w-full">
              <p className="text-sm font-medium leading-normal pb-2 text-text-primary-light">
                Email Address
              </p>
              <input
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light focus:outline-0 border border-border-light bg-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 h-12 placeholder:text-text-secondary-light p-3 text-base font-normal leading-normal"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-gray-600 text-lg mt-0.5">
                lightbulb
              </span>
              <p className="text-sm text-gray-700">
                Make sure to enter the email address you used when creating your account.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center whitespace-nowrap h-12 px-6 rounded-lg w-full bg-primary text-white text-base font-semibold hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </div>
            ) : (
              'Send Reset Link'
            )}
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