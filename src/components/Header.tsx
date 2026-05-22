import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Check } from 'lucide-react';

interface HeaderProps {
  onOpenConsultation: (serviceId?: string) => void;
}

export default function Header({ onOpenConsultation }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scheduledCount, setScheduledCount] = useState(0);

  // Monitor scroll state for styling and active item highlights
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section tracking logic
      const sections = ['home', 'about', 'services', 'expertise', 'testimonials', 'faq'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Fetch local booking count for dynamic indicator
    const updateBookingCount = () => {
      const stored = localStorage.getItem('nisa_consultations');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setScheduledCount(parsed.length);
        } catch {
          // ignore error
        }
      }
    };

    updateBookingCount();
    window.addEventListener('nisa_booking_updated', updateBookingCount);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('nisa_booking_updated', updateBookingCount);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const menuItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Expertise', id: 'expertise' },
    { label: 'Testimonials', id: 'testimonials' },
    { label: 'Contact/FAQ', id: 'faq' },
  ];

  return (
    <>
      <nav
        id="site-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-teal/95 backdrop-blur-md py-3 shadow-lg border-b border-white/5'
            : 'bg-teal/80 md:bg-teal/25 backdrop-blur-xs py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Elegant Brand Logo */}
            <div 
              onClick={() => scrollToSection('home')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-accent/20 border border-emerald-accent flex items-center justify-center font-bold text-white text-base tracking-wider transition-all duration-300 group-hover:bg-emerald-accent group-hover:scale-105">
                NI
              </div>
              <div>
                <span className="text-white text-lg font-bold tracking-tight block leading-none">
                  Nisa Idrisi
                </span>
                <span className="text-[10px] text-emerald-accent font-medium tracking-widest uppercase block mt-1">
                  Chartered & Strategic Finance
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium tracking-wide transition-colors relative py-2 ${
                    activeSection === item.id
                      ? 'text-emerald-accent font-bold'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-accent rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* CTA action / bookings status */}
            <div className="hidden sm:flex items-center gap-4">
              {scheduledCount > 0 && (
                <div 
                  onClick={() => scrollToSection('faq')} 
                  className="bg-emerald-accent/15 border border-emerald-accent/20 px-3 py-1.5 rounded-full text-emerald-accent text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-emerald-accent/25 transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent animate-pulse" />
                  {scheduledCount} Call{scheduledCount > 1 ? 's' : ''} Secured
                </div>
              )}
              
              <button
                onClick={() => onOpenConsultation()}
                className="bg-emerald-accent hover:bg-emerald-accent-dark text-white px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-md shadow-emerald-accent/20 hover:shadow-lg hover:shadow-emerald-accent/30 flex items-center gap-1.5 group cursor-pointer"
              >
                <span>Contact Me</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mobile Hamburguer */}
            <div className="flex lg:hidden items-center gap-3">
              {scheduledCount > 0 && (
                <span className="bg-emerald-accent text-white font-bold text-[9px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {scheduledCount}
                </span>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white hover:text-emerald-accent focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-teal-dark border-t border-white/5 py-4 px-6 shadow-2xl space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left py-2.5 text-base font-medium transition-colors ${
                  activeSection === item.id ? 'text-emerald-accent' : 'text-white/80'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full bg-emerald-accent py-3 rounded-xl text-center text-white font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2"
              >
                <span>Book Free Consultation</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
