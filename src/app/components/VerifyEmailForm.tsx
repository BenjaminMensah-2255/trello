'use client';

import { useState } from 'react';

export default function VerifyEmailForm() {
  const [isResending, setIsResending] = useState(false);
  const [email] = useState('user@example.com'); // This would typically come from props or context

  const handleResendEmail = async () => {
    setIsResending(true);
    
    // Simulate API call to resend verification email
    setTimeout(() => {
      setIsResending(false);
      alert('Verification email sent!');
    }, 1500);
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8 bg-card-light">
      <div className="flex w-full max-w-md flex-col gap-8 py-10">
        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-4xl">
              outgoing_mail
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary-light">
              Check Your Email
            </h1>
            <p className="text-text-secondary-light">
              We've sent a verification link to your email address
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center gap-6">
          {/* Instructions */}
          <p className="text-text-secondary-light text-base font-normal leading-relaxed">
            Please check your inbox and spam folder to continue with your account verification.
          </p>

          {/* Email Display */}
          <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 w-full">
            <p className="text-text-primary-light text-sm font-medium">
              {email}
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 w-full">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 text-lg mt-0.5">
                info
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-blue-800 font-medium">
                  Can't find the email?
                </p>
                <p className="text-xs text-blue-700">
                  Check your spam folder or click below to resend the verification link.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleResendEmail}
            disabled={isResending}
            className="flex items-center justify-center whitespace-nowrap h-12 px-6 rounded-lg w-full bg-primary text-white text-base font-semibold hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors"
          >
            {isResending ? (
              <div className="flex items-center gap-2">
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </div>
            ) : (
              'Resend Verification Email'
            )}
          </button>

          <a
            href="/login"
            className="flex items-center justify-center whitespace-nowrap h-12 px-6 rounded-lg w-full border border-border-light text-text-primary-light text-base font-semibold hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
          >
            Back to Login
          </a>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-3">
          <p className="text-sm text-text-secondary-light">
            Already verified your email?{' '}
            <a
              className="font-semibold text-primary hover:underline"
              href="/login"
            >
              Sign in to your account
            </a>
          </p>
          <p className="text-xs text-text-secondary-light">
            Need help?{' '}
            <a
              className="font-medium text-primary hover:underline"
              href="/contact"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}