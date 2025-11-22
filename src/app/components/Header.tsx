"use client"
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-full flex justify-center sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-50 border-b border-border-light dark:border-border-dark">
      <div className="w-full max-w-6xl px-4 sm:px-6">
        <header className="flex items-center justify-between whitespace-nowrap py-3 sm:py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.75 2.75a.75.75 0 00-1.5 0v8.5h-1.5a.75.75 0 000 1.5h1.5v7a.75.75 0 001.5 0v-7h1.5a.75.75 0 000-1.5h-1.5V2.75zM6 6a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5H6.75A.75.75 0 016 6zm-2.25 7.5a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5zM14.25 8a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5zm0 8.5a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5z"></path>
              </svg>
            </div>
            <h2 className="text-text-light-primary dark:text-text-dark-primary text-lg sm:text-xl font-bold leading-tight">Trello</h2>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-6 lg:gap-8">
            <a className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal transition-colors" href="#">
              Features
            </a>
            <a className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal transition-colors" href="#">
              Pricing
            </a>
            <a className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal transition-colors" href="#">
              About
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex items-center gap-3 lg:gap-4">
            <a className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors" href="/login">
              Log In
            </a>
            <Link
              href="/signup"
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 sm:h-10 px-3 sm:px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-soft hover:opacity-90 transition-opacity"
            >
              <span className="truncate">Sign Up</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark shadow-lg">
            <div className="flex flex-col p-4 space-y-4">
              {/* Mobile Navigation Links */}
              <a 
                className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-primary text-base font-medium py-2 transition-colors"
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-primary text-base font-medium py-2 transition-colors"
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-primary text-base font-medium py-2 transition-colors"
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
              
              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t border-border-light dark:border-border-dark">
                <a 
                  className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-primary text-base font-medium py-2 text-center transition-colors"
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </a>
                <Link
                  href="/signup"
                  className="flex cursor-pointer items-center justify-center rounded-lg h-11 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] shadow-soft hover:opacity-90 transition-opacity"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Sign Up</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}