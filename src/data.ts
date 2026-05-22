import { Service, Testimonial, FAQItem, Industry } from './types';

export const SERVICES: Service[] = [
  {
    id: 'strategic-planning',
    title: 'Strategic Financial Planning',
    description: 'Build strong financial strategies that align with your business goals and drive sustainable growth, ensuring long-term profitability.',
    icon: 'TrendingUp',
    features: ['Long-term forecasting', 'Cash-flow modeling', 'Capital allocation', 'Growth benchmarking'],
  },
  {
    id: 'uk-accounting',
    title: 'UK Accounting & Bookkeeping',
    description: 'Accurate, reliable, and compliant accounting services for businesses across the UK, leveraging modern cloud ecosystems.',
    icon: 'BookOpen',
    features: ['Year-end statutory accounts', 'Double-entry audit maintenance', 'Balance sheet verification', 'Real-time ledger syncing'],
    isFeatured: true, // Marked styled card as per reference image design
  },
  {
    id: 'hmrc-compliance',
    title: 'HMRC Compliance Services',
    description: 'Expert support for VAT, Self-Assessment, Corporation Tax, and full HMRC compliance. Minimize risks and avoid penalties.',
    icon: 'ShieldCheck',
    features: ['VAT return filings', 'Corporation tax computations', 'HMRC representation', 'Payroll & PAYE schemes'],
  },
  {
    id: 'business-advisory',
    title: 'Business Advisory',
    description: 'Strategic advice to improve efficiency, profitability, and long-term business value. Your trusted partner in operational transitions.',
    icon: 'Users',
    features: ['Operational workflow audits', 'Cost optimization studies', 'M&A consultation', 'Executive-level mentoring'],
  },
  {
    id: 'tax-optimization',
    title: 'Tax Planning & Optimization',
    description: 'Legally optimize your tax position and improve cash flow with smart, proactive, forward-looking tax planning tailored to UK/US guidelines.',
    icon: 'Percent',
    features: ['Capital allowances reviews', 'R&D tax credits claims', 'Structural tax relief schemes', 'Inheritance & wealth protection'],
  },
  {
    id: 'portfolio-expansion',
    title: 'Portfolio Expansion Support',
    description: 'Financial analysis, forecasting, and strategy for businesses and investment portfolio growth across global jurisdictions.',
    icon: 'Activity',
    features: ['Investment valuation models', 'Cross-border structure audits', 'Syndicated deal evaluations', 'Alternative asset strategies'],
  }
];

export const INDUSTRIES: Industry[] = [
  { id: 'ecommerce', name: 'E-commerce', icon: 'ShoppingBag' },
  { id: 'realestate', name: 'Real Estate', icon: 'Building' },
  { id: 'consulting', name: 'Consulting Firms', icon: 'Briefcase' },
  { id: 'startups', name: 'Startups', icon: 'Rocket' },
  { id: 'soletraders', name: 'Sole Traders', icon: 'User' },
  { id: 'agencies', name: 'Digital Agencies', icon: 'Monitor' },
  { id: 'healthcare', name: 'Healthcare', icon: 'HeartPulse' },
  { id: 'retail', name: 'Retail Businesses', icon: 'Store' },
  { id: 'investors', name: 'Investors', icon: 'Coins' }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'James Walker',
    role: 'CEO',
    company: 'FinFlow Solutions',
    quote: "Nisa's financial insights and strategic advice have been instrumental in helping our business improve profitability and stay HMRC compliant.",
    rating: 5,
    avatarSeed: 'James'
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    role: 'Director',
    company: 'Elevate Consulting',
    quote: 'Highly professional, detail-oriented, and reliable. Nisa always delivers beyond expectations.',
    rating: 5,
    avatarSeed: 'Sarah'
  },
  {
    id: '3',
    name: 'Oliver Grant',
    role: 'Entrepreneur & Investor',
    company: 'Capital Venture Partners',
    quote: 'Her financial planning and advisory support helped me expand my investment portfolio with confidence.',
    rating: 5,
    avatarSeed: 'Oliver'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Services',
    question: 'What financial services do you offer?',
    answer: 'We provide comprehensive full-spectrum corporate services including Strategic Financial Planning, Year-end UK Accounting & Bookkeeping, HMRC Compliance, Tax Planning & Advisory, and Portfolio Expansion Advice. We specialize in robust, cloud-integrated financial support for SMEs, startups, and high-net-worth investors.'
  },
  {
    id: 'faq-2',
    category: 'Compliance',
    question: 'How do you ensure HMRC compliance?',
    answer: 'As certified accountants affiliated with RCi Chartered Accountants, we maintain 100% up-to-date knowledge on UK tax codes, VAT revisions, and HMRC filing protocols. We use automated compliance checkpoints to audit ledger transactions and represent our clients diligently during statutory inquiries.'
  },
  {
    id: 'faq-3',
    category: 'Clients',
    question: 'Do you work with startups and small businesses?',
    answer: 'Absolutely. We actively partner with early-stage startups and traditional SMEs. We assist with initial incorporation setups, standard bookkeeping processes, seed/series funding model reviews, and scaling strategies.'
  },
  {
    id: 'faq-4',
    category: 'Taxation',
    question: 'Can you help with tax planning and optimization?',
    answer: 'Yes. Tax optimization is one of our primary expert areas. We evaluate your organizational structure, verify qualifications for structural allowances (like R&D tax credits and capital allowances), and build smart, legal blueprints to reduce your effective tax burden.'
  },
  {
    id: 'faq-5',
    category: 'Onboarding',
    question: 'How can we get started?',
    answer: 'To get started, you can book a free strategic consultation directly through our automated planner here. We will review your current systems, address your pressing fiscal questions, and prepare a customized service proposal aligned with your goals.'
  }
];
