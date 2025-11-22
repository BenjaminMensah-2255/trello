Trello Clone
A full-featured project management app built with Next.js 14 and Supabase.

🚀 Features
Organizations & Teams - Manage multiple teams with role-based permissions

Kanban Boards - Drag-and-drop boards, lists, and cards

Invitation System - Invite team members via email

🛠 Tech Stack
Frontend: Next.js 14, TypeScript, Tailwind CSS, dnd-kit
Backend: Supabase (PostgreSQL, Auth, Storage, Real-time)

📦 Quick Setup
1. Environment Setup
bash
# Clone and install
git clone https://github.com/BenjaminMensah-2255/trello.git
cd trello
npm install

# Environment variables (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
2. Database Setup
Run the SQL schema in your Supabase SQL Editor to create:

Users, Organizations, Members

Boards, Lists, Cards

Activities, Comments, Attachments

Row Level Security policies

3. Run the App

npm run dev
Visit http://localhost:3000



🎯 Getting Started
Sign up for an account

Login

Create an organization

Create boards and start organizing tasks

Invite team members (boards/invites)

Drag & drop cards between lists

🚀 Deployment
Deploy to Vercel in minutes:

Connect your GitHub repo

Add environment variables

Deploy!