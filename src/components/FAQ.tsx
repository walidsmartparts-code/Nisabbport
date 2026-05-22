import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Calendar, Shield, Trash2, Mail, MapPin, Phone, HelpCircle, Check } from 'lucide-react';
import { FAQS } from '../data';
import { Booking } from '../types';

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchBookings = () => {
    const stored = localStorage.getItem('nisa_consultations');
    if (stored) {
      try {
        setBookings(JSON.parse(stored));
      } catch {
        // fail-safe
      }
    } else {
      setBookings([]);
    }
  };

  useEffect(() => {
    fetchBookings();
    window.addEventListener('nisa_booking_updated', fetchBookings);
    return () => {
      window.removeEventListener('nisa_booking_updated', fetchBookings);
    };
  }, []);

  const handleCancelBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    localStorage.setItem('nisa_consultations', JSON.stringify(updated));
    setBookings(updated);
    // Broadcast updates
    window.dispatchEvent(new Event('nisa_booking_updated'));
  };

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* LEFT COLUMN: Section Title & Real-time Booking Ledger */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-emerald-accent-dark font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-0.5 bg-emerald-accent"></span>
                Frequently Asked Questions
              </span>
              <h2 className="text-3xl sm:text-4.5xl font-extrabold font-sans tracking-tight text-teal">
                Frequently Asked <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-light to-emerald-accent">Questions</span>
              </h2>
              <p className="text-slate-luxury font-light text-sm leading-relaxed">
                Quick answers to common questions about strategic financial structures, corporate VAT filing compliance, and Nisa's private onboarding workflows.
              </p>
            </div>

            {/* LIVE DATA PERSISTENCE: Discovery Session Tracker widget */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-teal flex items-center gap-2 mb-4 font-sans">
                <span className="w-2 h-2 rounded-full bg-emerald-accent animate-pulse" />
                Discovery Call Ledger ({bookings.length})
              </h3>

              {bookings.length === 0 ? (
                <div className="text-center py-6 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    No active strategic discovery sessions booked on this browser session yet.
                  </p>
                  <p className="text-[11px] text-emerald-accent font-semibold mt-1">
                    Book above to monitor real-time sync!
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {bookings.map((booking) => (
                    <div 
                      key={booking.id}
                      className="bg-white border border-slate-100 p-4 rounded-xl flex items-start justify-between gap-3 shadow-xs hover:border-emerald-accent/20 transition-all"
                    >
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 bg-emerald-accent/15 text-emerald-accent-dark px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                          {booking.service}
                        </span>
                        <h4 className="text-xs font-bold text-teal">
                          Session for {booking.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-luxury font-medium font-roboto">
                          <Calendar size={11} className="text-emerald-accent" />
                          <span>{booking.date} at {booking.time}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancel Scheduled Session"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Multi Channel support block */}
            <div className="bg-teal/5 border border-teal/10 rounded-2xl p-6 space-y-4">
              <h4 className="text-xs font-bold text-teal uppercase tracking-wider">
                Require direct fast response?
              </h4>
              <div className="space-y-3 text-xs text-slate-700 font-medium">
                <a href="mailto:nisa.idrisi@rci.com" className="flex items-center gap-2.5 hover:text-emerald-accent-dark transition-colors">
                  <Mail size={14} className="text-emerald-accent shrink-0" />
                  <span>nisa.idrisi@revolo-consultancy.co.uk</span>
                </a>
                <a href="tel:+447700900077" className="flex items-center gap-2.5 hover:text-emerald-accent-dark transition-colors">
                  <Phone size={14} className="text-emerald-accent shrink-0" />
                  <span>+44 7700 900077 (Office advisory Desk)</span>
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Advanced interactive FAQ accordion rows */}
          <div className="lg:col-span-7 space-y-4">
            {FAQS.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? 'bg-gradient-to-br from-slate-50 to-white border-emerald-accent/35 shadow-md' 
                      : 'bg-white border-slate-100 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left py-5 px-6 flex items-center justify-between gap-4 font-sans focus:outline-none"
                  >
                    <span className="text-sm sm:text-base font-bold text-teal tracking-tight leading-snug">
                      {faq.question}
                    </span>
                    <span className={`w-6 h-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-teal shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-emerald-accent/15 text-emerald-accent-dark border-emerald-accent/20' : ''
                    }`}>
                      <ChevronDown size={14} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-1 border-t border-slate-100/60 text-xs sm:text-sm text-slate-luxury font-light leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
