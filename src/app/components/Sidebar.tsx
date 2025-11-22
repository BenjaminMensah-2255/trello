'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext'; 
import { createClient } from '../lib/supabase'; 
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('organizations');
  const { user, profile } = useAuth(); 
  const supabase = createClient();
  const router = useRouter();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
    { id: 'organizations', label: 'Organizations', icon: 'corporate_fare', href: '/dashboard/organizations' },
    { id: 'settings', label: 'Settings', icon: 'settings', href: '/dashboard/settings' },
  ];

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        alert('Error signing out. Please try again.');
        return;
      }

      console.log('Successfully logged out');
      
      // Redirect to login page or home page
      router.push('/');
      router.refresh(); // Refresh the router to update auth state
      
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout.');
    }
  };

  // Get user display info
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || 'email@example.com';
  const userAvatar = profile?.avatar_url || 'https://lh3.googleusercontent.com/a/default-user';

  return (
    <aside className="flex w-64 flex-col bg-content-light p-4 shadow-soft">
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-8">
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
                onClick={() => setActiveItem(item.id)}
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

        {/* User Section */}
        <div className="flex flex-col gap-2 border-t border-border-light pt-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div 
              className="size-10 rounded-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("${userAvatar}")`
              }}
            />
            <div className="flex flex-col">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-text-secondary-light">{userEmail}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-light hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <span className="material-symbols-outlined text-text-secondary-light">logout</span>
            <p className="text-sm font-medium">Logout</p>
          </button>
        </div>
      </div>
    </aside>
  );
}