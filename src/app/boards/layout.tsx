import BoardSidebar from '../components/BoardSidebar';

interface BoardLayoutProps {
  children: React.ReactNode;
}

export default function BoardLayout({ children }: BoardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background-light text-text-primary-light">
      <BoardSidebar />
      <main className="flex-1 p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
}