import { motion } from 'motion/react';
import { ArrowRight, Star, Shield, Award, Play, ChevronRight, Check } from 'lucide-react';
import nisaHeroPortrait from '../assets/images/nisa_hero_portrait_1779470310432.png';
import { useWebsiteData } from '../context/WebsiteDataContext';

interface HeroProps {
  onOpenConsultation: () => void;
}

export default function Hero({ onOpenConsultation }: HeroProps) {
  const { data, isDataLoaded } = useWebsiteData();
  const c = data.content;

  // Stagger wrapper for initial page load
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 25, stiffness: 100 }
    }
  };

  return (
    <section 
      id="home" 
      className="relative pt-24 md:pt-32 pb-20 md:pb-32 bg-gradient-to-b from-teal via-teal-dark to-slate-50 text-white overflow-hidden"
    >
      {/* Dynamic customizable background image overlay */}
      {data.images?.hero?.backgroundImage && (
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: `url(${data.images.hero.backgroundImage})` }}
        />
      )}
      {/* Dynamic Background Glow Layer */}
      <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-emerald-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[30%] h-[30%] bg-teal-light/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Strong Copy & CTAs */}
          <motion.div 
            className="lg:col-span-7 space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Highly Credible Affiliation Pill */}
            <motion.div 
              variants={itemVariants} 
              className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-xs font-semibold tracking-wider text-emerald-accent uppercase"
            >
              <Award size={14} />
              <span>{c.heroBadgeText}</span>
            </motion.div>

            {/* Strategic Title with High-Contrast Text Highlight */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight font-sans"
            >
              {c.heroHeadline} <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-accent to-emerald-accent-light block mt-1 sm:mt-2">
                {c.heroHighlightedWord}
              </span>
            </motion.h1>

            {/* Editorial Lead Paragraph */}
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl font-light"
            >
              {c.heroSubtitle}
            </motion.p>

            {/* Premium CTA Row */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <button
                onClick={onOpenConsultation}
                className="bg-emerald-accent hover:bg-emerald-accent-dark text-white px-8 py-4 rounded-xl text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-xl shadow-em[...]"
              >
                <span>{c.heroCtaText}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const target = document.getElementById('about');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border border-white/20 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-ce[...]"
              >
                <Play size={14} className="fill-white" />
                <span>Explore Journey</span>
              </button>
            </motion.div>

            {/* Trust Indicator / Social Proof Badge Layout & Sleek Theme Metrics */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 pt-4 border-t border-white/10"
            >
              {/* Real Stacked Avatars */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-4">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
                  ].map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Trusted Client Headshot ${idx + 1}`}
                      className="w-10 h-10 rounded-full border-2 border-teal-dark object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Trusted by 250+ clients
                  </p>
                  <p className="text-xs text-emerald-accent font-medium">
                    Global leaders & UK investors
                  </p>
                </div>
              </div>

              {/* Dynamic Sleek Metrics Grid inside Hero column */}
              <div className="flex-1 grid grid-cols-2 gap-3 min-w-[200px]">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-left">
                  <div className="text-xl font-extrabold text-emerald-accent leading-none">{c.aboutAssetsLabel}</div>
                  <div className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-1 font-serif">Assets Managed</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-left">
                  <div className="text-xl font-extrabold text-emerald-accent leading-none">{c.aboutExperienceYears}</div>
                  <div className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-1 font-serif">Years Expertise</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: Large Premium Asymmetric Framed Imagery & Float elements */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex justify-center">
            
            {/* Elegant Portrait Frame */}
            {isDataLoaded && data.images?.hero?.mainImage ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative w-full max-w-[380px] aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white pointer-events-none"
              >
                {/* Backdrop Gradient sweep in card */}
                <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/60 via-transparent to-transparent z-10" />
                
                <img
                  src={data.images.hero.mainImage}
                  alt="Portrait of Strategic Finance Executive Nisa Idrski"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ) : (
              // Loading skeleton while data loads
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative w-full max-w-[380px] aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white pointer-events-none bg-gradient-to-br from-slate-700 to-slate-800 animate-pulse"
              />
            )}

            {/* FLOATING CARD 1: HMRC Compliance visual indicator */}
            <motion.div 
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 60 }}
              className="absolute -right-4 top-[15%] w-[180px] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 text-slate-800 animate-float-slow z-20 pointer-events-[...]"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-accent/20 flex items-center justify-center text-emerald-accent-dark">
                  <Check size={14} className="stroke-[3]" />
                </div>
                <span className="text-xs font-bold text-slate-850">{c.heroFloatingCard1Title}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[100%] bg-emerald-accent" />
              </div>
            </motion.div>

            {/* FLOATING CARD 2: Wealth growth and columns chart */}
            <motion.div 
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1, type: 'spring', stiffness: 60 }}
              className="absolute -left-6 bottom-[10%] w-[190px] bg-white shadow-2xl border border-slate-50 p-4 rounded-2xl text-slate-800 animate-float-delayed z-20 pointer-events-none"
            >
              <div className="text-[9px] uppercase font-bold tracking-widest text-emerald-accent-dark mb-1 font-serif">{c.heroFloatingCard2Title}</div>
              <div className="text-2xl font-extrabold text-teal leading-none">{c.heroFloatingCard2Value}</div>
              <div className="flex gap-1 h-8 items-end mt-2">
                <div className="flex-1 bg-slate-100 h-[40%] rounded-sm" />
                <div className="flex-1 bg-slate-100 h-[60%] rounded-sm" />
                <div className="flex-1 bg-slate-100 h-[50%] rounded-sm" />
                <div className="flex-1 bg-[#10B981] h-[90%] rounded-sm" />
                <div className="flex-1 bg-[#10B981] h-[75%] rounded-sm" />
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
