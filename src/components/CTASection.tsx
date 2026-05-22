import { motion } from 'motion/react';
import { ArrowRight, MessageSquare, CheckCircle, Sparkles, Building, Briefcase } from 'lucide-react';
import nisaHeroPortrait from '../assets/images/nisa_hero_portrait_1779470310432.png';
import { useWebsiteData } from '../context/WebsiteDataContext';

interface CTASectionProps {
  onOpenConsultation: () => void;
}

export default function CTASection({ onOpenConsultation }: CTASectionProps) {
  const { data } = useWebsiteData();
  const c = data.content;

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main CTA background container */}
        <div className="bg-gradient-to-r from-teal to-teal-dark rounded-[40px] p-8 sm:p-14 lg:p-16 text-white relative overflow-hidden shadow-2xl border border-white/10">
          {/* Dynamic gloss flare vector */}
          <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-[radial-gradient(ellipse_at_top_right,rgba(0,180,139,0.22),transparent_60%)] pointer-events-none" />
          <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-teal-light/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* LEFT SIDE: Heading pitch & value statements */}
            <div className="lg:col-span-8 space-y-6">
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-emerald-accent font-roboto">
                <Sparkles size={11} />
                Secure Your Strategic Advantage
              </span>
              
              <h2 className="text-3xl sm:text-4.5xl font-extrabold font-sans leading-tight tracking-tight text-white">
                {c.ctaHeading}
              </h2>

              <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-2xl">
                {c.ctaSubtext}
              </p>

              {/* Fast Value Seals */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-white/90">
                {[
                  'Zero Obligations discovery block',
                  'HMRC compliancy diagnostics',
                  'Bespoke scaling proposals'
                ].map((txt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-accent/25 text-emerald-accent flex items-center justify-center shrink-0">
                      <ArrowRight size={10} className="stroke-[3]" />
                    </span>
                    <span className="font-light">{txt}</span>
                  </div>
                ))}
              </div>

              {/* Consultation trigger button */}
              <div className="pt-4">
                <button
                  onClick={onOpenConsultation}
                  className="bg-emerald-accent hover:bg-emerald-accent-dark text-teal-dark font-extrabold px-8 py-4 rounded-xl text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-xl shadow-emerald-accent/25 hover:shadow-2xl hover:shadow-emerald-accent/45 inline-flex items-center gap-2.5 cursor-pointer text-white"
                >
                  <span>{c.ctaButtonText}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: Circular Headshot frame of Nisa Idrisi */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Decorative border rings */}
                <div className="absolute inset-[-12px] border border-white/15 rounded-full animate-pulse pointer-events-none" />
                <div className="absolute inset-[-24px] border border-white/5 rounded-full pointer-events-none" />
                
                {/* Image asset container */}
                <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl relative bg-teal-dark bg-opacity-80">
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/30 to-transparent pointer-events-none" />
                  <img
                    src={nisaHeroPortrait}
                    alt="Corporate Advisor Nisa Idrisi smiling"
                    className="w-full h-full object-cover object-center scale-[1.05]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
