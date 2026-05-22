import { Shield, Sparkles, Award, Users, BookOpen, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import nisaDeskPortrait from '../assets/images/nisa_desk_portrait_1779470330129.png';
import { useWebsiteData } from '../context/WebsiteDataContext';

interface WhyChooseMeProps {
  onOpenConsultation: () => void;
}

export default function WhyChooseMe({ onOpenConsultation }: WhyChooseMeProps) {
  const { data } = useWebsiteData();
  const c = data.content;

  const points = [
    {
      icon: Award,
      title: 'Strategic Finance Executive',
      desc: 'High-level corporate financial strategy, cash-flow diagnostics, and proactive capital modeling.'
    },
    {
      icon: BookOpen,
      title: 'Chartered Accounting',
      desc: 'Affiliated with RCi Chartered Accountants, ensuring elite-tier compliance standards and certified stat filings.'
    },
    {
      icon: Shield,
      title: 'HMRC Compliance Expert',
      desc: 'Expert level adherence to UK tax laws, R&D allowances, and structured representation during investigations.'
    },
    {
      icon: Users,
      title: 'Client-Centered Approach',
      desc: 'Tailor-made structural financial planning aligned accurately with your short-term buffers and long-term milestones.'
    }
  ];

  return (
    <section id="expertise" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE: Portrait on Darker Elegant Slate/Teal Framing */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-teal/5 rounded-[32px] blur-3xl pointer-events-none" />
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl bg-teal-dark/10 border-2 border-slate-100">
              <img
                src={nisaDeskPortrait}
                alt="Executive Strategic Consultant Nisa Idrisi"
                className="w-full h-auto object-cover rounded-[32px] aspect-[4/3] sm:aspect-auto"
                referrerPolicy="no-referrer"
              />
              {/* Context Tag Layer */}
              <div className="absolute inset-0 bg-gradient-to-t from-teal/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                <p className="text-emerald-accent text-xs font-bold uppercase tracking-widest mb-1">
                  Integrity & Strategy First
                </p>
                <h4 className="text-base sm:text-lg font-bold font-sans">
                  "Protecting margins, preparing for compliance audits, amplifying capital."
                </h4>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Point features & Collborate CTA */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-emerald-accent-dark font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-0.5 bg-emerald-accent"></span>
                Why Choose Me
              </span>
              <h2 className="text-3xl sm:text-4.5xl font-extrabold font-sans tracking-tight text-teal">
                Why Work With <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-light to-emerald-accent">Nisa Idrisi?</span>
              </h2>
              <p className="text-slate-luxury font-light text-sm sm:text-base leading-relaxed">
                Delivering premium strategic financial leadership, high-end bookkeeping advisory, and robust HMRC tax mitigations and protection schemas.
              </p>
            </div>

            {/* Grid layout for strengths */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {points.map((p, idx) => {
                const IconComp = p.icon;
                return (
                  <div 
                    key={idx}
                    className="border border-slate-100 rounded-2xl p-5 hover:border-emerald-accent/25 hover:shadow-xl transition-all duration-300 bg-slate-50/50 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-accent/10 border border-emerald-accent/15 text-teal flex items-center justify-center mb-4 group-hover:bg-emerald-accent group-hover:text-white transition-all">
                      <IconComp size={18} className="stroke-[1.8]" />
                    </div>
                    <h3 className="text-sm font-bold text-teal mb-1.5 group-hover:text-emerald-accent-dark transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-luxury font-light leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Collaboration Call to Action Button */}
            <div className="pt-4">
              <button
                onClick={onOpenConsultation}
                className="bg-emerald-accent hover:bg-emerald-accent-dark text-white px-8 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-md shadow-emerald-accent/15 hover:shadow-lg hover:shadow-emerald-accent/30 inline-flex items-center gap-2 group cursor-pointer"
              >
                <span>Let's Collaborate</span>
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
