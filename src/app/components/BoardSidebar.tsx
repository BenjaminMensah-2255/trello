'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BoardSidebar() {
  const [activeItem, setActiveItem] = useState('boards');

  const menuItems = [
    { id: 'boards', label: 'Boards', icon: 'view_kanban', href: '/boards' },
    { id: 'members', label: 'Members', icon: 'group', href: '/boards/members' },
    { id: 'settings', label: 'Settings', icon: 'settings', href: '/boards/settings' },
  ];

  return (
    <aside className="flex flex-col w-64 bg-card-light border-r border-border-light p-4 shrink-0">
      <div className="flex-grow">
        {/* Logo and Workspace */}
        <div className="flex items-center gap-3 p-2 mb-6">
          <div 
            className="size-10 rounded-lg bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDHvPrY3bB_ryxwXJfOomJr1d7AbVafhPrImZcf63SW6_nnveZV-LYSVnER7Cvq4LTJyYjv168b4cGmNLhsec9StfUcXiMicytr9d9amJrzTEl0Im09wcEvW0_MsFMFtwQRkx2CzVnAtKbmMvdef1NXg2JR9Rn27d9PjASl_7P602v9F33g0kqOJTog_-ol6beh3bo2-sOPoE254HYeJt8HETzRDDYfGpxMLkJxDj0abIyiWVeKEpSNx4fqAaODdSO-PxkDmlq1cakT")`
            }}
          />
          <div className="flex flex-col">
            <h1 className="text-base font-bold leading-normal">ProjectCo</h1>
            <p className="text-sm font-normal leading-normal text-text-secondary-light">Workspace</p>
          </div>
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
      <div className="flex items-center gap-3 p-2">
        <div 
          className="size-10 rounded-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCNAmG944F2xowFZzRmTBsbSTmce-FIFVNgIKUZnPa1161TjImWXznWzQjFTkUuVqkJn3tkdwqjOvLzJn2C_OGAmQkJ_BXj5oxqgMBvM7RnA3LGHt5N7bo87WaLm_VlfE9aPxXlnTTieoV0iXvLeK-DvHf6rRfmlDrs0Svc1MwNnm1M7zM4B_DK5rjUaO_YQNJh_rs2UQnQalqR-X-ojPibpEVSRALZ6eAQgeC0j7xolrzdwPFwCt2kpZcCg7Iw7yYmSNj4RgoXmFEz")`
          }}
        />
        <div className="flex flex-col">
          <p className="text-sm font-medium leading-normal">Alex Rivera</p>
          <p className="text-xs font-normal leading-normal text-text-secondary-light">alex@project.co</p>
        </div>
      </div>
    </aside>
  );
}