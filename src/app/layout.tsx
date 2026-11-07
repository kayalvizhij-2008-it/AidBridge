import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AidBridge — Connecting Every Need, Ensuring Every Care',
  description:
    'A unified social care & assistance verification platform connecting vulnerable individuals with essential services and verifying that help actually reaches them.',
  keywords: ['GovTech', 'Social Impact', 'Case Management', 'Care Coordination', 'Assistance Verification'],
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'AidBridge — Connecting Every Need, Ensuring Every Care',
    description: 'A unified social care & assistance verification platform.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-[#F5F3EC] text-[#182536]">
        {children}
      </body>
    </html>
  );
}
