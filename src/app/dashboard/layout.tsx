import { AuthProvider } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0 lg:ml-0">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}