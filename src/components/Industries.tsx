import { ShoppingBag, Building, Briefcase, Rocket, User, Monitor, HeartPulse, Store, Coins } from 'lucide-react';
import { useWebsiteData } from '../context/WebsiteDataContext';

export default function Industries() {
  const { data } = useWebsiteData();
  const industriesList = data.industries;

  const customIconMap: { [key: string]: any } = {
    ShoppingBag,
    Building,
    Briefcase,
    Rocket,
    User,
    Monitor,
    HeartPulse,
    Store,
    Coins
  };

  return (
    <section className="py-16 bg-gradient-to-r from-teal-dark to-teal text-white relative overflow-hidden">
      {/* Dynamic Background visual overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,180,139,0.15),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-emerald-accent font-bold text-xs uppercase tracking-widest block font-roboto">
            Sectors & Clients Served
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Industries I Serve
          </h2>
          <p className="text-white/70 text-xs sm:text-sm font-light">
            Custom-tailored financial leadership across diverse modern corporate environments.
          </p>
        </div>

        {/* Modular horizontal structured pill flow list */}
        <div className="flex flex-wrap items-center justify-center gap-4 max-w-5xl mx-auto">
          {industriesList.map((ind) => {
            const IconComp = customIconMap[ind.icon] || Briefcase;

            return (
              <div
                key={ind.id}
                className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-emerald-accent/30 py-3 px-5 sm:px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 cursor-pointer text-sm font-medium tracking-wide"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-accent/20 border border-emerald-accent/20 flex items-center justify-center text-emerald-accent shrink-0 text-xs">
                  <IconComp size={12} className="stroke-[2.5]" />
                </div>
                <span>{ind.name}</span>
              </div>
            );
          })}
        </div>

        {/* Small trust confirmation */}
        <p className="text-[11px] text-white/50 tracking-wider mt-8 uppercase font-medium">
          Licensed under global reporting compliance frameworks • Certified advisory standards
        </p>

      </div>
    </section>
  );
}
