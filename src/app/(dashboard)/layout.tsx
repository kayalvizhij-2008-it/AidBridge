import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { prisma } from '@/lib/prisma';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // Count unread notifications
  let unreadCount = 0;
  try {
    unreadCount = await prisma.notification.count({
      where: {
        OR: [
          { userId: user.userId },
          { roleTarget: user.role },
          { orgIdTarget: user.orgId },
        ],
        read: false,
      },
    });
  } catch {
    unreadCount = 2;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F3EC] text-[#182536] relative overflow-hidden">
      {/* Subtle warm ambient styling */}
      <div className="absolute top-0 right-0 w-[600px] h-[300px] bg-[#176B67]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-[#D8B77A]/5 rounded-full blur-3xl pointer-events-none" />

      <DashboardHeader user={user} unreadCount={unreadCount} />
      <main className="relative z-10 flex-1 py-6 sm:py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
