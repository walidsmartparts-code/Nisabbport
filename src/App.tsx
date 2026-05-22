import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import WhyChooseMe from './components/WhyChooseMe';
import Industries from './components/Industries';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import ConsultationModal from './components/ConsultationModal';

export default function App() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  const handleOpenConsultation = (serviceId?: string) => {
    setPreselectedService(serviceId);
    setIsConsultationOpen(true);
  };

  const handleCloseConsultation = () => {
    setIsConsultationOpen(false);
    setPreselectedService(undefined);
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased selection:bg-emerald-accent/20">
      
      {/* Floating Header */}
      <Header onOpenConsultation={handleOpenConsultation} />

      {/* Main Structural Layout blocks */}
      <main>
        {/* Full-width premium hero with generated visual assets */}
        <Hero onOpenConsultation={() => handleOpenConsultation()} />
        
        {/* About section highlighting RCi/Revolo partnership, qualifications & desk portrait */}
        <About />

        {/* Services grid detailing specific features + Compliance & Tax calculator playground */}
        <Services onOpenConsultation={handleOpenConsultation} />

        {/* Strategic proof board for Why work with Nisa */}
        <WhyChooseMe onOpenConsultation={() => handleOpenConsultation()} />

        {/* Industries dynamic capsule pill strip */}
        <Industries />

        {/* Staggered testimonials from core UK clients */}
        <Testimonials />

        {/* Accordions + Live local database Booking Ledger */}
        <FAQ />

        {/* Closing conversion CTA matching the reference layout */}
        <CTASection onOpenConsultation={() => handleOpenConsultation()} />
      </main>

      {/* Global Brand Footer page anchors & licensing */}
      <Footer onOpenConsultation={() => handleOpenConsultation()} />

      {/* Advanced consultation scheduling modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={handleCloseConsultation}
        preselectedServiceId={preselectedService}
      />
      
    </div>
  );
}
