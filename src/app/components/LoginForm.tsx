'use client';

import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { email, password });
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
              Welcome back
            </h1>
            <p className="text-text-secondary-light">
              Log in to your account to continue
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

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="flex flex-col w-full">
                <p className="text-sm font-medium leading-normal pb-2 text-text-primary-light">
                  Password
                </p>
                <div className="relative flex w-full flex-1 items-center">
                  <input
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-primary-light focus:outline-0 border border-border-light bg-transparent focus:border-primary focus:ring-4 focus:ring-primary/20 h-12 placeholder:text-text-secondary-light p-3 pr-10 text-base font-normal leading-normal"
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              <a
                className="text-sm font-medium text-primary hover:underline self-end"
                href="/forgot-password"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="flex items-center justify-center whitespace-nowrap h-12 px-6 rounded-lg w-full bg-primary text-white text-base font-semibold hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors"
          >
            Login
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center">
          <p className="text-sm text-text-secondary-light">
            Don't have an account?{' '}
            <a
              className="font-semibold text-primary hover:underline"
              href="/signup"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}