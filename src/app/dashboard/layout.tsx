// app/dashboard/layout.tsx (or wherever you use Sidebar)
import { AuthProvider } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}