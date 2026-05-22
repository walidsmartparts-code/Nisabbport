import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Globe, Check, Award, ArrowRight } from 'lucide-react';

interface FooterProps {
  onOpenConsultation: () => void;
}

export default function Footer({ onOpenConsultation }: FooterProps) {
  const scrollSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-teal-dark text-white pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
      {/* Dynamic light vector */}
      <div className="absolute left-0 bottom-0 w-80 h-80 bg-emerald-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-white/10">
          
          {/* Brand block (Lg: 4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div onClick={() => scrollSection('home')} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-emerald-accent/20 border border-emerald-accent flex items-center justify-center font-bold text-white text-sm transition-all group-hover:bg-emerald-accent">
                NI
              </div>
              <div>
                <span className="text-white text-base font-bold tracking-tight block leading-none">
                  Nisa Idrisi
                </span>
                <span className="text-[9px] text-emerald-accent font-medium tracking-widest uppercase block mt-1">
                  Chartered & Strategic Finance
                </span>
              </div>
            </div>

            <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
              Strategic Finance Executive helping businesses and individual investors achieve absolute financial clarity, compliance, and explosive portfolio growth across the United Kingdom and globally.
            </p>

            {/* Premium Social Circles */}
            <div className="flex gap-3">
              {[
                { icon: Linkedin, href: 'https://linkedin.com' },
                { icon: Twitter, href: 'https://twitter.com' },
                { icon: Instagram, href: 'https://instagram.com' },
                { icon: Globe, href: 'https://rci-accountants.com' }
              ].map((soc, idx) => {
                const IconComp = soc.icon;
                return (
                  <a
                    key={idx}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-emerald-accent hover:text-white hover:border-emerald-accent transition-all duration-300"
                  >
                    <IconComp size={14} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links block (Lg: 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-emerald-accent uppercase tracking-wider font-roboto">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-light text-white/70">
              {[
                { label: 'Home Page', id: 'home' },
                { label: 'About Nisa', id: 'about' },
                { label: 'Advisory Services', id: 'services' },
                { label: 'Core Expertise', id: 'expertise' },
                { label: 'Client Feedback', id: 'testimonials' },
                { label: 'Contact / FAQ', id: 'faq' }
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => scrollSection(link.id)}
                    className="hover:text-emerald-accent transition-colors py-1 block text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Business scope block (Lg: 3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-emerald-accent uppercase tracking-wider font-roboto">
              Core Services
            </h4>
            <ul className="space-y-2 text-xs font-light text-white/70">
              {[
                'Strategic Financial Planning',
                'UK Accounting & Bookkeeping',
                'HMRC Compliance Services',
                'Tax Planning & Optimization',
                'Business Advisory Support',
                'Portfolio Expansion Systems'
              ].map((scope, idx) => (
                <li key={idx} className="flex items-center gap-1.5 py-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-accent" />
                  <span>{scope}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact pointer blocks (Lg: 3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-emerald-accent uppercase tracking-wider font-roboto">
              Contact Desk
            </h4>
            <ul className="space-y-3.5 text-xs font-light text-white/80">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-emerald-accent shrink-0 mt-0.5" />
                <span>
                  London Office, <br />
                  United Kingdom
                </span>
              </li>
              <li className="flex items-center gap-2.5 bg-white/5 border border-white/5 p-2 rounded-xl">
                <Mail size={14} className="text-emerald-accent shrink-0" />
                <a href="mailto:nisa@rci-accountants.com" className="hover:text-emerald-accent transition-colors font-medium break-all text-[11px]">
                  nisa.idrisi@rci.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-emerald-accent shrink-0" />
                <a href="tel:+447700900077" className="hover:text-emerald-accent transition-colors font-medium">
                  +44 7700 900077
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onOpenConsultation}
                className="w-full bg-emerald-accent hover:bg-emerald-accent-dark text-white py-2 px-4 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all duration-300 shadow-md shadow-emerald-accent/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Book Consultation</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

        </div>

        {/* Footnote Licensing Info */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/50 font-light font-roboto">
          <p>© 2026 Nisa Idrisi. All rights reserved globally.</p>
          <div className="flex gap-6">
            <a href="#about" className="hover:text-emerald-accent">Privacy Policy</a>
            <a href="#services" className="hover:text-emerald-accent">Terms & Conditions</a>
            <a href="#faq" className="hover:text-emerald-accent">HMRC Disclaimer</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
