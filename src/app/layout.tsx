import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { OrganizationProvider } from './contexts/OrganizationContext';
import { AuthProvider } from './contexts/AuthContext'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-family-display'
});

export const metadata: Metadata = {
  title: 'ProjectFlow - Effortless Project Management',
  description: 'Organize tasks, collaborate with your team, and ship projects faster with our intuitive visual platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
        <style>{`
          .material-symbols-outlined {
            font-variation-settings:
              'FILL' 0,
              'wght' 400,
              'GRAD' 0,
              'opsz' 24
          }
        `}</style>
      </head>
      <body className="font-display bg-background-light text-text-light-primary">
        <AuthProvider>
          <OrganizationProvider>
            {children}
          </OrganizationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}