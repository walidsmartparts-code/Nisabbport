import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, X, Check, ArrowRight, Shield, Award } from 'lucide-react';
import { SERVICES } from '../data';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
}

export default function ConsultationModal({ isOpen, onClose, preselectedServiceId }: ConsultationModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (preselectedServiceId) {
      setService(preselectedServiceId);
    } else {
      setService(SERVICES[0]?.id || '');
    }
  }, [preselectedServiceId, isOpen]);

  // Clean form state on close/open
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setIsSubmitting(false);
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!date) newErrors.date = 'Please pick a consultation date';
    if (!time) newErrors.time = 'Please pick a preferred time slot';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate reliable API callback
    setTimeout(() => {
      const newBooking = {
        id: 'booking_' + Date.now(),
        name,
        email,
        company,
        service: SERVICES.find(s => s.id === service)?.title || service,
        date,
        time,
        notes,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage
      const existing = localStorage.getItem('nisa_consultations');
      const consultations = existing ? JSON.parse(existing) : [];
      consultations.push(newBooking);
      localStorage.setItem('nisa_consultations', JSON.stringify(consultations));

      // Trigger custom window event to update lists in real time
      window.dispatchEvent(new Event('nisa_booking_updated'));

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const nextAvailableSlots = [
    '09:00 AM (BST)',
    '10:30 AM (BST)',
    '01:00 PM (BST)',
    '02:30 PM (BST)',
    '04:00 PM (BST)'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-teal-dark/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden glass-card max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal to-teal-dark p-6 text-white flex justify-between items-center shrink-0">
              <div>
                <span className="text-emerald-accent font-semibold tracking-wider text-xs uppercase block mb-1">
                  Private Advisory Consultation
                </span>
                <h3 className="text-xl md:text-2xl font-bold font-sans">
                  Book Strategic Discovery Call
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6 md:p-8 flex-1">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 px-4 text-center max-w-md mx-auto"
                >
                  <div className="w-16 h-16 bg-emerald-accent/15 border border-emerald-accent/30 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-accent">
                    <Check size={32} className="stroke-[3]" />
                  </div>
                  <h4 className="text-2xl font-bold text-teal mb-3">
                    Consultation Scheduled!
                  </h4>
                  <p className="text-slate-luxury text-sm mb-6 leading-relaxed">
                    Thank you, <strong className="text-slate-900">{name}</strong>. Your executive discovery session regarding <strong className="text-slate-900">{SERVICES.find(s => s.id === service)?.title}</strong> is fully secured on <strong className="text-slate-900">{date}</strong> at <strong className="text-slate-900">{time}</strong>.
                  </p>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-left text-xs text-slate-500 mb-8 space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent"></span>
                      A detailed Zoom invitation and custom prep agenda have been sent to <strong>{email}</strong>.
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent"></span>
                      Nisa Idrisi will personally review your provided notes before the session.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-teal hover:bg-teal-light text-white font-medium rounded-xl transition-all duration-300 shadow-md shadow-teal/10 hover:shadow-lg hover:shadow-teal/20"
                  >
                    Done & Return to Site
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Trust Badge overlay */}
                  <div className="bg-teal/5 border border-teal/10 rounded-xl p-4 flex items-center gap-3 text-xs text-teal">
                    <Shield size={18} className="text-emerald-accent shrink-0" />
                    <p className="leading-relaxed">
                      All consultation communications and corporate materials shared are fully protected under strict non-disclosure agreement guidelines.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="modal-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Full Name / Principal *
                      </label>
                      <input
                        id="modal-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Robert Sterling"
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm focus:bg-white transition-all outline-none ${
                          errors.name ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:border-teal'
                        }`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="modal-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Work Email *
                      </label>
                      <input
                        id="modal-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. r.sterling@corporation.com"
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm focus:bg-white transition-all outline-none ${
                          errors.email ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:border-teal'
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Company */}
                    <div>
                      <label htmlFor="modal-company" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Company Name (Optional)
                      </label>
                      <input
                        id="modal-company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Sterling Ventures Ltd"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-teal focus:bg-white transition-all outline-none"
                      />
                    </div>

                    {/* Service selection */}
                    <div>
                      <label htmlFor="modal-service" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Advisory Scope *
                      </label>
                      <select
                        id="modal-service"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-teal focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                        style={{ backgroundImage: 'rgba(0,0,0,0.05)' }}
                      >
                        {SERVICES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date picker */}
                    <div>
                      <label htmlFor="modal-date" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Preferred Date *
                      </label>
                      <input
                        id="modal-date"
                        type="date"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm focus:bg-white transition-all outline-none ${
                          errors.date ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:border-teal'
                        }`}
                      />
                      {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                    </div>

                    {/* Time slots */}
                    <div>
                      <label htmlFor="modal-time" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Preferred Time (BST/GMT) *
                      </label>
                      <select
                        id="modal-time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm focus:bg-white transition-all outline-none appearance-none cursor-pointer ${
                          errors.time ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:border-teal'
                        }`}
                      >
                        <option value="">Select a slot...</option>
                        {nextAvailableSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                    </div>
                  </div>

                  {/* Corporate briefing notes */}
                  <div>
                    <label htmlFor="modal-notes" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Brief Briefing Notes
                    </label>
                    <textarea
                      id="modal-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Seeking advisory for Q3 VAT and strategic tax structures following portfolio expansion..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:border-teal focus:bg-white transition-all outline-none resize-none"
                    />
                  </div>

                  {/* Submission and Close buttons */}
                  <div className="flex gap-4 pt-4 shrink-0">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-emerald-accent hover:bg-emerald-accent-dark text-white font-medium rounded-xl transition-all duration-300 shadow-md shadow-emerald-accent/15 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Securing Slot...</span>
                        </>
                      ) : (
                        <>
                          <span>Secure Free Consultation</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
