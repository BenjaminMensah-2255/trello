'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('organizations');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
    { id: 'organizations', label: 'Organizations', icon: 'corporate_fare', href: '/dashboard/organizations' },
    { id: 'settings', label: 'Settings', icon: 'settings', href: '/dashboard/settings' },
  ];

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
            <h1 className="text-lg font-bold">ProjectFlow</h1>
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
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBlbsKBGzNGIVJpPvwCNbVxDzK0HQwTXLfMydYCZL8rd9cb5m7zEQw7MH_Yr52Dk_G2_hChj61CLCgqujuBv4gSYBwu_4xr9pphl57lzlBq3m01om_7Ii97wbTjfWIj3jioWYKOxLAI2tCDrZPRgJCgJZwEioauWKG6ILUMM21GHbLdvgo1QBOsFAv3P6ozQdz7b0MYasVgMyh9BJ016_zHR0orXY7xheGFcZWvvr19SqDww5B1h9zNwxOClIrAdxXJkQzfizYURYW5")`
              }}
            />
            <div className="flex flex-col">
              <p className="text-sm font-medium">Alex Johnson</p>
              <p className="text-xs text-text-secondary-light">alex.j@example.com</p>
            </div>
          </div>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-text-light hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-text-secondary-light">logout</span>
            <p className="text-sm font-medium">Logout</p>
          </button>
        </div>
      </div>
    </aside>
  );
}