import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Landmark, BookOpen, ShieldCheck, CheckCircle2, MapPin, Building, Globe, ChevronDown, Sparkles } from 'lucide-react';
import nisaDeskPortrait from '../assets/images/nisa_desk_portrait_1779470330129.png';
import { useWebsiteData } from '../context/WebsiteDataContext';

export default function About() {
  const [showJourney, setShowJourney] = useState(false);
  const { data, isDataLoaded } = useWebsiteData();
  const c = data.content;

  const qualificationCards = [
    {
      icon: Award,
      title: c.aboutQualifications[0] || 'MBA in Finance',
      subtitle: 'Finance & Strategy',
      desc: 'Advanced corporate fiscal strategy, financial modeling, and venture valuation frameworks.',
    },
    {
      icon: Landmark,
      title: c.aboutQualifications[1] || 'BSS in Economics',
      subtitle: 'Economics & Policy',
      desc: 'Macroeconomic structures, policy evaluations, and econometric market behavior models.',
    },
    {
      icon: BookOpen,
      title: c.aboutQualifications[2] || 'UK Accounting Expert',
      subtitle: 'UK GAAP & IFRS',
      desc: 'Comprehensive application of statutory rules, complex double-entry journals, and balance metrics.',
    },
    {
      icon: ShieldCheck,
      title: c.aboutQualifications[3] || 'HMRC Compliance Specialist',
      subtitle: 'Specialist Advisor',
      desc: 'Precise corporation tax computations, VAT schemes management, and audit defense preparedness.',
    }
  ];

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Dynamic graphic context ring */}
      <div className="absolute -left-16 top-1/2 w-72 h-72 bg-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE: Professional portrait at desk */}
          <div className="lg:col-span-5 relative">
            {isDataLoaded && data.images?.about?.image ? (
              <div className="relative rounded-[32px] overflow-hidden shadow-xl border border-slate-100">
                {/* Overlay with subtle lighting */}
                <div className="absolute inset-0 bg-teal/5 pointer-events-none" />
                <img
                  src={data.images.about.image}
                  alt="Nisa Idrski sitting at her executive consulting workspace"
                  className="w-full h-auto object-cover rounded-[32px] hover:scale-105 transition-transform duration-700 aspect-[4/3] sm:aspect-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              // Loading skeleton while data loads
              <div className="relative rounded-[32px] overflow-hidden shadow-xl border border-slate-100 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse aspect-[4/3] sm:aspect-auto" />
            )}
            
            {/* Context Floating Tag */}
            <div className="absolute -bottom-6 -right-4 bg-white shadow-xl rounded-2xl p-4 border border-slate-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-accent/15 text-emerald-accent-dark flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-teal block leading-none">UK GAAP</span>
                <span className="text-[10px] text-slate-luxury block mt-1">Authorized Standards Specialist</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Personal copy, credentials and affiliations */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-emerald-accent-dark font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-0.5 bg-emerald-accent"></span>
                About Me
              </span>
              <h2 className="text-3xl sm:text-4.5xl font-bold font-sans tracking-tight text-teal">
                Nisa Idrski
              </h2>
            </div>

            <div className="space-y-4 text-slate-luxury font-light leading-relaxed text-sm sm:text-base">
              <p>
                {c.aboutBiography}
              </p>
              <p>
                My consultancy framework is built on absolute clarity, proactive HMRC compliance forecasting, and long-term capital compounding. Whether you are navigating complicated cross-border[...]
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-5 hover:border-emerald-accent/25 transition-all">
                <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider mb-1">
                  Professional Affiliation
                </span>
                <p className="text-teal font-bold text-sm sm:text-base">
                  RCi Chartered Accountants & Revolo Consultancy
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-5 hover:border-emerald-accent/25 transition-all">
                <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider mb-1">
                  Primary Location
                </span>
                <p className="text-teal font-bold text-sm sm:text-base flex items-center gap-1.5">
                  <MapPin size={16} className="text-emerald-accent" />
                  United Kingdom (HMRC Registered)
                </p>
              </div>
            </div>

            {/* Micro Journey Trigger button */}
            <div>
              <button
                onClick={() => setShowJourney(!showJourney)}
                className="inline-flex items-center gap-2 bg-emerald-accent hover:bg-emerald-accent-dark text-white px-6 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-al[...]"
              >
                <span>More About My Journey</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${showJourney ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Expandable Professional Milestone History */}
            <AnimatePresence>
              {showJourney && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mt-2 space-y-4">
                    <h4 className="text-xs font-bold text-teal uppercase tracking-wider">
                      Strategic Accomplishments Timeline
                    </h4>
                    <div className="relative pl-6 border-l border-emerald-accent-light/40 space-y-5 text-xs text-slate-luxury font-light">
                      {c.aboutAchievements?.map((achievement, idx) => (
                        <div key={idx} className="relative">
                          <span className="absolute -left-[29px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-accent border-2 border-white" />
                          <strong className="text-teal block font-semibold">Key Achievement {idx + 1}</strong>
                          <p className="mt-1">{achievement}</p>
                        </div>
                      )) || (
                        <>
                          <div className="relative">
                            <span className="absolute -left-[29px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-accent border-2 border-white" />
                            <strong className="text-teal block font-semibold">Associate Director | RCi Chartered Accountants</strong>
                            <p className="mt-1">Managing comprehensive statutory tax advisory for 50+ medium corporate entities totaling over £120M in collective revenue stream.</p>
                          </div>
                          <div className="relative">
                            <span className="absolute -left-[29px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-accent border-2 border-white" />
                            <strong className="text-teal block font-semibold">Senior Corporate Advisor | Revolo Consultancy</strong>
                            <p className="mt-1">Architecting business turnaround structures, cross-border corporate alignment, and digital cloud conversion setups.</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Academic and Core Specialized Credential Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 pt-12 border-t border-slate-100">
          {qualificationCards.map((q, idx) => {
            const IconComp = q.icon;

            return (
              <div 
                key={idx}
                className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-1 hover:border-emerald-accent/20 gr[...]"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-accent/10 border border-emerald-accent/15 flex items-center justify-center text-teal mb-4 group-hover:bg-emerald-accent group-hover[...]">
                  <IconComp size={20} className="stroke-[1.8]" />
                </div>
                <h3 className="text-sm font-bold text-teal mb-1">
                  {q.title}
                </h3>
                <span className="text-[10px] uppercase font-bold text-emerald-accent tracking-wider block mb-2 font-roboto">
                  {q.subtitle}
                </span>
                <p className="text-xs text-slate-luxury font-light leading-relaxed">
                  {q.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
