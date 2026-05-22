import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, BookOpen, ShieldCheck, Users, Percent, Activity, ArrowRight, HelpCircle, Check, Sparkles, Coins, Calculator } from 'lucide-react';
import { SERVICES } from '../data';

interface ServicesProps {
  onOpenConsultation: (serviceId?: string) => void;
}

export default function Services({ onOpenConsultation }: ServicesProps) {
  // Calculator state
  const [revenue, setRevenue] = useState(150000);
  const [taxReliefClaims, setTaxReliefClaims] = useState<string[]>([]);
  const [hasVatIssue, setHasVatIssue] = useState<string>('no');
  const [isCalculated, setIsCalculated] = useState(false);

  // Calculated results
  const [estTaxRelief, setEstTaxRelief] = useState(0);
  const [score, setScore] = useState(100);

  const toggleClaim = (id: string) => {
    if (taxReliefClaims.includes(id)) {
      setTaxReliefClaims(taxReliefClaims.filter(c => c !== id));
    } else {
      setTaxReliefClaims([...taxReliefClaims, id]);
    }
  };

  const handleComputeAssessment = () => {
    // Strategic formula representing realistic UK SME allowances
    let reliefAmount = revenue * 0.08; // default baseline R&D / Capital allowance potential
    if (taxReliefClaims.includes('rd')) reliefAmount += revenue * 0.12;
    if (taxReliefClaims.includes('cap')) reliefAmount += revenue * 0.05;
    
    let compliancyScore = 95;
    if (hasVatIssue === 'yes') compliancyScore -= 25;
    if (taxReliefClaims.length === 0) compliancyScore -= 10; // no tax planning in place

    setEstTaxRelief(Math.round(reliefAmount));
    setScore(Math.max(compliancyScore, 30));
    setIsCalculated(true);
  };

  const serviceIconMap: { [key: string]: any } = {
    TrendingUp,
    BookOpen,
    ShieldCheck,
    Users,
    Percent,
    Activity
  };

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-slate-50 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-emerald-accent-dark font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-2 h-0.5 bg-emerald-accent"></span>
            Services I Offer
          </span>
          <h2 className="text-3xl sm:text-4.5xl font-extrabold font-sans tracking-tight text-teal">
            Premium Financial <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-light to-emerald-accent">Advisory Scope</span>
          </h2>
          <p className="text-slate-luxury font-light text-sm sm:text-base leading-relaxed">
            Comprehensive financial, strategic management, and HMRC compliance solutions designed by elite accountants and structured for SMEs, startups, and private family offices.
          </p>
        </div>

        {/* Dynamic Service Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s) => {
            const IconComponent = serviceIconMap[s.icon] || BookOpen;
            const isAccounting = s.isFeatured; // Highlighted card

            return (
              <div
                key={s.id}
                className={`flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden group ${
                  isAccounting
                    ? 'bg-gradient-to-br from-emerald-accent-dark to-teal text-white shadow-xl shadow-emerald-accent/15'
                    : 'bg-white border border-slate-100 shadow-sm text-slate-900 hover:border-emerald-accent/20'
                }`}
              >
                {/* Decorative border highlight for normal cards */}
                {!isAccounting && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 group-hover:bg-emerald-accent transition-colors duration-300" />
                )}

                <div>
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                    isAccounting
                      ? 'bg-white/15 border border-white/20 text-white group-hover:scale-110'
                      : 'bg-emerald-accent/10 border border-emerald-accent/15 text-teal group-hover:bg-emerald-accent group-hover:text-white group-hover:scale-110'
                  }`}>
                    <IconComponent size={24} className="stroke-[1.8]" />
                  </div>

                  {/* Title & Description */}
                  <h3 className={`text-lg sm:text-xl font-bold font-sans mb-3 tracking-tight ${
                    isAccounting ? 'text-white' : 'text-teal'
                  }`}>
                    {s.title}
                  </h3>
                  
                  <p className={`text-xs sm:text-sm font-light leading-relaxed mb-6 ${
                    isAccounting ? 'text-white/80' : 'text-slate-luxury'
                  }`}>
                    {s.description}
                  </p>

                  {/* Feature Lists */}
                  <ul className="space-y-3 mb-8">
                    {s.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5 text-xs">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          isAccounting ? 'bg-white/20 text-white' : 'bg-emerald-accent/15 text-emerald-accent-dark'
                        }`}>
                          <Check size={10} className="stroke-[3]" />
                        </span>
                        <span className={isAccounting ? 'text-white/90' : 'text-slate-700 font-medium'}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer buttons booking triggers */}
                <div className="pt-4 border-t border-dashed shrink-0 flex items-center justify-between gap-4 border-white/10 decoration-slate-100">
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${
                    isAccounting ? 'text-emerald-accent-light' : 'text-emerald-accent-dark'
                  }`}>
                    {isAccounting ? '★ Featured Account' : 'Strategic Suite'}
                  </span>
                  
                  <button
                    onClick={() => onOpenConsultation(s.id)}
                    className={`inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-xl transition-all duration-300 ${
                      isAccounting
                        ? 'bg-white text-teal hover:bg-emerald-accent-light hover:text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-emerald-accent hover:text-white'
                    }`}
                  >
                    <span>Request Case</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* COMPLIANCE WORKSHOP & TAX SAVINGS ESTIMATOR */}
        <div className="mt-24 bg-teal rounded-[32px] overflow-hidden shadow-2xl relative border border-white/10">
          {/* Accent decoration rings */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-accent/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute left-10 bottom-0 w-80 h-32 bg-teal-light/20 rounded-t-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Visual Header and explanation */}
            <div className="lg:col-span-5 p-8 sm:p-12 text-white flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest text-emerald-accent">
                  <Calculator size={10} />
                  Compliance Playground
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  UK Corporate <br />Tax & Compliance self-Assessment
                </h3>
                <p className="text-white/80 text-xs sm:text-sm font-light leading-relaxed">
                  Assess how optimized your corporate cash is, identify potential capital allowances (R&D tax credits, equipment deductions), and score your standard HMRC liability risks.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-light text-white/90 space-y-2">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent" />
                  Calculations based on 2026 UK Finance Acts
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent" />
                  Provides directional R&D capital estimations
                </p>
              </div>
            </div>

            {/* Interactive Form panel */}
            <div className="lg:col-span-7 bg-white/95 backdrop-blur-md p-8 sm:p-12 text-slate-800">
              
              {!isCalculated ? (
                <div className="space-y-6">
                  {/* Revenue Slider Input */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="range-revenue" className="text-xs font-bold text-slate-750 uppercase tracking-wider">
                        Estimated Annual Turnover (SME Range)
                      </label>
                      <span className="text-sm font-bold text-teal">
                        £{revenue.toLocaleString()}
                      </span>
                    </div>
                    <input
                      id="range-revenue"
                      type="range"
                      min="50000"
                      max="1500000"
                      step="25000"
                      value={revenue}
                      onChange={(e) => setRevenue(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-accent"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                      <span>£50k</span>
                      <span>£500k</span>
                      <span>£1M</span>
                      <span>£1.5M+</span>
                    </div>
                  </div>

                  {/* Multi Select for claims potential */}
                  <div>
                    <span className="block text-xs font-bold text-slate-750 uppercase tracking-wider mb-2">
                      Exemptions or structures currently in play:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => toggleClaim('rd')}
                        className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
                          taxReliefClaims.includes('rd')
                            ? 'bg-emerald-accent/10 border-emerald-accent text-teal-dark font-bold'
                            : 'bg-slate-50/50 border-slate-200 text-slate-650 hover:bg-slate-100'
                        }`}
                      >
                        Active Research (R&D) Programs
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleClaim('cap')}
                        className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
                          taxReliefClaims.includes('cap')
                            ? 'bg-emerald-accent/10 border-emerald-accent text-teal-dark font-bold'
                            : 'bg-slate-50/50 border-slate-200 text-slate-650 hover:bg-slate-100'
                        }`}
                      >
                        Capital Equipment / Machinery Invested
                      </button>
                    </div>
                  </div>

                  {/* VAT Status selector */}
                  <div>
                    <span className="block text-xs font-bold text-slate-755 uppercase tracking-wider mb-1">
                      Are you currently dealing with any HMRC / VAT disputes or late filings?
                    </span>
                    <div className="flex gap-4">
                      {['no', 'yes'].map((opt) => (
                        <label key={opt} className="flex items-center gap-2 text-xs font-medium capitalize text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name="vat-status"
                            value={opt}
                            checked={hasVatIssue === opt}
                            onChange={() => setHasVatIssue(opt)}
                            className="w-4 h-4 text-emerald-accent border-slate-300 focus:ring-emerald-accent focus:ring-2"
                          />
                          <span>{opt === 'no' ? 'No, everything compliant' : 'Yes, seeking advisory assistance'}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit evaluation */}
                  <div className="pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleComputeAssessment}
                      className="w-full bg-teal hover:bg-teal-light text-white py-3.5 rounded-xl font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal/10"
                    >
                      <span>Compute Compliance Potential</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center py-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Score Gauge */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2">
                        Estimated Tax Relief Potential
                      </span>
                      <p className="text-3xl sm:text-4xl font-extrabold text-teal">
                        £{estTaxRelief.toLocaleString()}
                      </p>
                      <span className="text-[10px] font-semibold text-emerald-accent-dark block mt-2">
                        * Under UK Capital & Innovation Codes
                      </span>
                    </div>

                    {/* Health metric */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2 font-roboto">
                        HMRC Security Matrix Score
                      </span>
                      <p className={`text-3xl sm:text-4xl font-extrabold ${score > 75 ? 'text-emerald-accent-dark' : 'text-amber-500'}`}>
                        {score} <span className="text-xs text-slate-400">/ 100</span>
                      </p>
                      <span className="text-[10px] text-slate-500 font-medium block mt-2">
                        {score > 75 ? 'Excellent compliancy stance' : 'Actions recommended immediately'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-teal/5 border border-teal/10 rounded-2xl p-5 text-left text-xs text-slate-750 font-light leading-relaxed">
                    <strong className="text-teal font-semibold block mb-1">Nisa Idrisi Advisory Recommendation:</strong>
                    Based on a monthly flow scaling up towards £{revenue.toLocaleString()}, you qualify for specialized innovation relief programs that could unlock significant liquidity back into your margins. However, {score < 80 ? 'active tax exposures require immediate statutory alignment.' : 'there reside substantial structures to further optimize.'}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsCalculated(false)}
                      className="flex-1 py-3 text-xs font-bold uppercase border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all font-sans"
                    >
                      Adjust Figures
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenConsultation('tax-optimization')}
                      className="flex-1 py-3 text-xs font-bold uppercase bg-emerald-accent text-white rounded-xl hover:bg-emerald-accent-dark transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-emerald-accent/15"
                    >
                      <span>Claim Free Advisory</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
