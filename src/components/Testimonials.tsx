import { Star, Quote } from 'lucide-react';
import { useWebsiteData } from '../context/WebsiteDataContext';

export default function Testimonials() {
  const { data } = useWebsiteData();
  const testimonialsList = data.testimonials;

  // Map static profile image sources to keep them extremely professional and visually clean
  const avatarUrls = [
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&h=120&q=80', // James Walker male executive
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80', // Sarah Mitchell female executive
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&h=120&q=80'  // Oliver Grant male investor
  ];

  return (
    <section id="testimonials" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background radial soft light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-emerald-accent-dark font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-2 h-0.5 bg-emerald-accent"></span>
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4.5xl font-extrabold font-sans tracking-tight text-teal">
            What My <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-light to-emerald-accent">Clients Say</span>
          </h2>
          <p className="text-slate-luxury font-light text-sm sm:text-base leading-relaxed">
            Real feedback from UK business owners, fast-growing startups, and international investors who have scaled with Nisa Idrisi.
          </p>
        </div>

        {/* Staggered Modern Bento Grid for cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {testimonialsList.map((t, index) => {
            const avatar = avatarUrls[index % avatarUrls.length] || `https://picsum.photos/seed/${t.id}/120/120`;
            const isMiddle = index === 1; // Middle card gets slightly different accent or margin staggering

            return (
              <div
                key={t.id}
                className={`flex flex-col justify-between rounded-3xl p-8 bg-white border border-slate-150 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative shadow-md ${
                  isMiddle ? 'md:translate-y-6 border-emerald-accent/20' : ''
                }`}
              >
                {/* Modern Quote Icon Badge */}
                <span className="absolute -top-4 -right-2 bg-emerald-accent/10 border border-emerald-accent/10 text-emerald-accent-dark p-3.5 rounded-2xl">
                  <Quote size={18} className="rotate-180" />
                </span>

                <div className="space-y-6">
                  {/* Star Ratings */}
                  <div className="flex gap-1 text-yellow-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-current" />
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-sm text-slate-700 italic font-light leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                {/* Client profile meta footer */}
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100 shrink-0">
                  <img
                    src={avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-teal">
                      {t.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-luxury font-roboto">
                      {t.role}, <span className="text-emerald-accent-dark">{t.company}</span>
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Margin adjustment spacer for middle card staggering */}
        <div className="h-0 md:h-10 pointer-events-none" />

      </div>
    </section>
  );
}
