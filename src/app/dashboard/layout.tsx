import { Sidebar } from '@/components/dashboard/Sidebar';
import { StatsHUD } from '@/components/game/StatsHUD';
import { LevelUpOverlay } from '@/components/game/LevelUpOverlay';
import { OfflineBanner } from '@/components/game/OfflineBanner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <OfflineBanner />
      <LevelUpOverlay />

      {/* Desktop Sidebar navigation */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <StatsHUD />
        {/* pb-20 on mobile for bottom nav clearance */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
