'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext'; 
import { createClient } from '../lib/supabase'; 
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('organizations');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, loading } = useAuth(); 
  const supabase = createClient();
  const router = useRouter();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
    { id: 'organizations', label: 'Organizations', icon: 'corporate_fare', href: '/dashboard/dashboard' },
    { id: 'settings', label: 'Settings', icon: 'settings', href: '/dashboard/dashboard' },
  ];

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        alert('Error signing out. Please try again.');
        return;
      }

      console.log('Successfully logged out');
      router.push('/');
      router.refresh();
      
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout.');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <aside className="flex flex-col w-64 bg-content-light p-4 shadow-soft">
        <div className="flex flex-col gap-8">
          {/* Loading Logo */}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="bg-primary rounded-lg p-2 text-white">
              <span className="material-symbols-outlined">flowsheet</span>
            </div>
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Loading Navigation */}
          <nav className="flex flex-col gap-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg px-3 py-2">
                <div className="size-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    );
  }

  // Get user display info
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || 'email@example.com';
  const userAvatar = profile?.avatar_url || 'https://lh3.googleusercontent.com/a/default-user';

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-content-light border border-border-light shadow-sm"
      >
        <span className="material-symbols-outlined">
          {isMobileMenuOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 
        flex flex-col w-64 bg-content-light p-4 shadow-soft
        transform transition-transform duration-300
        overflow-y-auto // Added to handle overflow
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex h-full flex-col justify-between min-h-0"> {/* Added min-h-0 for flexbox */}
          <div className="flex flex-col gap-8 shrink-0"> {/* Added flex-shrink-0 */}
            {/* Logo */}
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="bg-primary rounded-lg p-2 text-white">
                <span 
                  className="material-symbols-outlined" 
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}
                >
                  flowsheet
                </span>
              </div>
              <h1 className="text-lg font-bold">Trello</h1>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    setActiveItem(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    activeItem === item.id
                      ? 'bg-primary/20 text-primary'
                      : 'text-text-light hover:bg-primary/10'
                  }`}
                >
                  <span 
                    className={`material-symbols-outlined ${
                      activeItem === item.id 
                        ? '' 
                        : 'text-text-secondary-light'
                    }`}
                    style={activeItem === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <p className={`text-sm ${activeItem === item.id ? 'font-bold' : 'font-medium'}`}>
                    {item.label}
                  </p>
                </Link>
              ))}
            </nav>
          </div>

          {/* User Section - Made sure it stays at bottom */}
          <div className="flex flex-col gap-2 border-t border-border-light pt-4 mt-auto shrink-0"> {/* Added mt-auto and flex-shrink-0 */}
            <div className="flex items-center gap-3 px-3 py-2">
              <div 
                className="size-10 rounded-full bg-cover bg-center bg-no-repeat shrink-0"
                style={{
                  backgroundImage: `url("${userAvatar}")`
                }}
              />
              <div className="flex flex-col min-w-0"> {/* Added min-w-0 for text truncation */}
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-text-secondary-light truncate">{userEmail}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-light hover:bg-red-50 hover:text-red-600 transition-colors w-full"
            >
              <span className="material-symbols-outlined text-text-secondary-light shrink-0">logout</span>
              <p className="text-sm font-medium truncate">Logout</p>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}