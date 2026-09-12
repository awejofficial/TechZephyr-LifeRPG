import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { GuildMarquee } from '@/components/landing/GuildMarquee';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';
import { StatsSection } from '@/components/landing/StatsSection';
import { ThemeGallery } from '@/components/landing/ThemeGallery';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white flex flex-col font-sans overflow-x-hidden">
      {/* 1. Tactical Game Launcher HUD Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* Section 1: Above-the-fold Hero */}
        <HeroSection />

        {/* Real-Time Realm Activity Feed */}
        <GuildMarquee />

        {/* Section 2: 3-Step Journey with Connector */}
        <HowItWorks />

        {/* Section 3: The RPG Systems (Horizontal Pinned Showcase) */}
        <FeatureShowcase />

        {/* Section 4: Live Stats Counters & Player Testimonials */}
        <StatsSection />

        {/* Section 5: Customization & Theme Showcase */}
        <ThemeGallery />

        {/* Section 6: Final Quest CTA with Ambient Glow */}
        <CTASection />
      </main>

      {/* Launcher Footer */}
      <Footer />
    </div>
  );
}
