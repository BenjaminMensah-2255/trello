'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext'; 
import { createClient } from '../lib/supabase'; 
import { useRouter } from 'next/navigation';

export default function BoardSidebar() {
  const [activeItem, setActiveItem] = useState('boards');
  const { user, profile, loading } = useAuth(); // Add loading from AuthContext
  const supabase = createClient();
  const router = useRouter();

  const menuItems = [
    { id: 'boards', label: 'Boards', icon: 'view_kanban', href: '/boards' },
    { id: 'members', label: 'Members', icon: 'group', href: '/boards/members' },
    { id: 'settings', label: 'Settings', icon: 'settings', href: '/boards/members' },
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

  // Show loading state or use default values during hydration
  if (loading) {
    return (
      <aside className="flex flex-col w-64 bg-card-light border-r border-border-light p-4 shrink-0">
        <div className="grow">
          {/* Loading skeleton */}
          <div className="flex items-center gap-3 p-2 mb-6">
            <div className="size-10 rounded-lg bg-gray-200 animate-pulse" />
            <div className="flex flex-col gap-1">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Get user display info - use safe defaults
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || 'Loading...';
  const userAvatar = profile?.avatar_url || 'https://lh3.googleusercontent.com/a/default-user';

  return (
    <aside className="flex flex-col w-64 bg-card-light border-r border-border-light p-4 shrink-0">
      <div className="grow">
        {/* Logo and Workspace */}
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
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveItem(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeItem === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-primary/10'
              }`}
            >
              <span 
                className={`material-symbols-outlined ${
                  activeItem === item.id 
                    ? 'fill' 
                    : 'text-text-secondary-light'
                }`}
                style={activeItem === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <p className={`text-sm leading-normal ${activeItem === item.id ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </p>
            </Link>
          ))}
        </nav>
      </div>

      {/* User Section */}
      <div className="flex flex-col gap-2 border-t border-border-light pt-4">
        <div className="flex items-center gap-3 p-2">
          <div 
            className="size-10 rounded-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("${userAvatar}")`
            }}
          />
          <div className="flex flex-col">
            <p className="text-sm font-medium leading-normal">{userName}</p>
            <p className="text-xs font-normal leading-normal text-text-secondary-light">{userEmail}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-light hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <span className="material-symbols-outlined text-text-secondary-light">logout</span>
          <p className="text-sm font-medium">Logout</p>
        </button>
      </div>
    </aside>
  );
}