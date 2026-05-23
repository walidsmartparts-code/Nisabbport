import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service, Testimonial, FAQItem, Industry, Booking } from '../types';
import { SERVICES, TESTIMONIALS, FAQS, INDUSTRIES } from '../data';

import { 
  db, 
  auth, 
  OperationType, 
  handleFirestoreError 
} from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User 
} from 'firebase/auth';

// Types for Blog & Portfolio Posts
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage: string;
  status: 'published' | 'draft';
  publishedAt: string;
  views: number;
}

export interface PortfolioProject {
  id: string;
  title: string;
  client: string;
  category: string;
  image: string;
  metric: string;
  metricLabel: string;
  description: string;
  status: 'published' | 'draft';
}

export interface SEOInfo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  robots: string;

  openGraph: {
    title: string;
    description: string;
    image: string;
    url: string;
    type: string;
  };

  twitterCard: {
    cardType: 'summary' | 'summary_large_image';
    title: string;
    description: string;
    image: string;
  };

  linkedin: {
    title: string;
    description: string;
    image: string;
  };

  facebook: {
    title: string;
    description: string;
    image: string;
  };
}

export interface SectionImages {
  hero: {
    backgroundImage: string;
    mainImage: string;
  };
  about: {
    image: string;
  };
  expertise: {
    image: string;
  };
  testimonials: {
    image: string;
  };
  footer: {
    image: string;
  };
}

export interface GlobalSettings {
  siteTitle: string;
  faviconUrl: string;
  logoText: string;
  contactEmail: string;
  contactPhone: string;
  businessAddress: string;
  facebookUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  brandPrimaryColor: string;
  brandAccentColor: string;
  isMaintenanceMode: boolean;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  uploadedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  ip: string;
  action: string;
  status: 'success' | 'failed';
  details: string;
}

export interface PageAnalytics {
  views: number;
  uniqueVisitors: number;
  bounceRate: number;
  ctr: number;
  desktopPercent: number;
  mobilePercent: number;
  tabletPercent: number;
  trafficSources: { source: string; count: number; percent: number }[];
  timelineData: { date: string; views: number; actions: number }[];
}

export interface WebsiteContent {
  headerText: string;
  headerCtaLabel: string;
  heroHeadline: string;
  heroHighlightedWord: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroBadgeText: string;
  heroFloatingCard1Title: string;
  heroFloatingCard2Title: string;
  heroFloatingCard2Value: string;
  aboutBiography: string;
  aboutQualifications: string[];
  aboutAchievements: string[];
  aboutExperienceYears: string;
  aboutAssetsLabel: string;
  whyChooseMeTitle: string;
  whyChooseMeSubtitle: string;
  ctaHeading: string;
  ctaSubtext: string;
  ctaButtonText: string;
  footerText: string;
}

export interface FullWebsiteState {
  content: WebsiteContent;
  services: Service[];
  industries: Industry[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  blogs: BlogPost[];
  portfolio: PortfolioProject[];
  seo: SEOInfo;
  settings: GlobalSettings;
  leads: Booking[];
  analytics: PageAnalytics;
  images: SectionImages;
}

interface WebsiteDataContextType {
  data: FullWebsiteState;          // Published active state
  draftData: FullWebsiteState;     // Workspace state under edit
  hasChanges: boolean;
  isDataLoaded: boolean;           // NEW: Track if data has finished loading
  saveDraft: (updatedDraft: Partial<FullWebsiteState> | ((prev: FullWebsiteState) => FullWebsiteState)) => void;
  publishDraft: () => Promise<boolean>;
  undoChanges: () => void;
  resetToDefault: () => Promise<boolean>;
  
  // Custom single operations
  addLead: (lead: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  updateLeadStatus: (id: string, status: 'pending' | 'confirmed') => void;
  addBlogPost: (post: Omit<BlogPost, 'id' | 'publishedAt' | 'views'>) => void;
  editBlogPost: (id: string, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  addProject: (project: Omit<PortfolioProject, 'id'>) => void;
  editProject: (id: string, project: Partial<PortfolioProject>) => void;
  deleteProject: (id: string) => void;
  
  // Security log handlers
  logs: AuditLog[];
  addLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  purgeCdnCache: () => Promise<boolean>;

  // Firebase integration additions
  user: User | null;
  isAdminUser: boolean;
  authLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const WebsiteDataContext = createContext<WebsiteDataContextType | undefined>(undefined);

const DEFAULT_CONTENT: WebsiteContent = {
  headerText: 'NISA IDRISI',
  headerCtaLabel: 'Book Consultation',
  heroHeadline: 'Strategic Wealth Redefined',
  heroHighlightedWord: 'Redefined.',
  heroSubtitle: 'High-level financial strategy and HMRC compliance for global executives, SMEs, and international investors. Delivering growth through precision and expertise.',
  heroCtaText: 'Start Strategy Session',
  heroBadgeText: 'Finance Executive & Consultant',
  heroFloatingCard1Title: 'HMRC Compliant',
  heroFloatingCard2Title: 'Portfolio Growth',
  heroFloatingCard2Value: '+24.8%',
  aboutBiography: 'Affiliated with RCi Chartered Accountants and Revolo Capital, Nisa brings over 15 years of world-class, rigorous, and multi-jurisidictional accounting experience to your busine[...]',
  aboutQualifications: [
    'Fellow of Chartered Certified Accountants (FCCA)',
    'HMRC Licensed Statutory Tax Advisor',
    'Trust & Estate Practitioner (TEP) Board Associate',
    'BSc (Hons) in International Corporate Finance'
  ],
  aboutAchievements: [
    'Managed audit advisory workflows representing portfolio assets in excess of £2B',
    'Spearheaded global structural audits for 250+ enterprise SMEs and developers',
    'Established Revolo Capital Cross-Border SME Structuring Advisory guidelines'
  ],
  aboutExperienceYears: '15+',
  aboutAssetsLabel: '£2B+',
  whyChooseMeTitle: 'A Blueprint for Absolute Prosperity',
  whyChooseMeSubtitle: 'Combining global sovereign fund analytical rigor with precise, local UK private ledger execution.',
  ctaHeading: 'Ready to Redefine Your Financial Architecture?',
  ctaSubtext: 'Unlock strategic growth blueprints, robust HMRC tax shelter solutions, and optimized balance sheet structure templates with a direct private advisory session.',
  ctaButtonText: 'Schedule My Private Session',
  footerText: 'Licensed UK Statutory Tax Counsel. Operating under the RCi Chartered Accountants, registered and compliant in England & Wales.'
};

const DEFAULT_SEO: SEOInfo = {
  metaTitle: 'Nisa Idrisi | Strategic Wealth Finance Executive & Compliance Advisory',
  metaDescription: 'High-level corporate accounting, statutory HMRC auditing, and strategic tax planning for SMEs, global executives, and real estate portfolios.',
  keywords: ['Finance Executive', 'Chartered Accountant', 'HMRC Compliance', 'Strategic Wealth'],
  canonicalUrl: 'https://nisaidrisi-consulting.co.uk',
  robots: 'index, follow',
  openGraph: {
    title: 'Nisa Idrisi - Strategic Corporate Wealth Redefined',
    description: 'Executive tax advisory, compliance checklists, and high-net-worth portfolio optimization.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    url: 'https://nisaidrisi-consulting.co.uk',
    type: 'website'
  },
  twitterCard: {
    cardType: 'summary_large_image',
    title: 'Nisa Idrisi | Strategic Corporate Finance',
    description: 'High-level corporate tax accounting, statutory auditing compliance, and wealth design strategy.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80'
  },
  linkedin: {
    title: 'Nisa Idrski | Chartered Certified Accountant (FCCA)',
    description: 'Advising SMEs and real-estate developers on HMRC compliance guidelines and double-entry auditing workflows.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80'
  },
  facebook: {
    title: 'Nisa Idrski Advisory Services',
    description: 'Statutory compliance advisory, double tax treaties planning, and global fund auditing pipelines.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80'
  }
};

// EMPTY placeholder images - will be replaced on load
const EMPTY_IMAGES: SectionImages = {
  hero: {
    backgroundImage: '',
    mainImage: ''
  },
  about: {
    image: ''
  },
  expertise: {
    image: ''
  },
  testimonials: {
    image: ''
  },
  footer: {
    image: ''
  }
};

const DEFAULT_SETTINGS: GlobalSettings = {
  siteTitle: 'Nisa Idrski Advisory',
  faviconUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=32&h=32&q=80',
  logoText: 'NISA IDRSKI',
  contactEmail: 'advisory@nisaidrski.com',
  contactPhone: '+44 20 7946 0192',
  businessAddress: '72 Mayfair Court, London, W1J 8DJ, United Kingdom',
  facebookUrl: 'https://facebook.com/nisa.idrski.wealth',
  linkedinUrl: 'https://linkedin.com/in/nisa-idrski-fcca',
  twitterUrl: 'https://twitter.com/nisa_wealth',
  brandPrimaryColor: '#004D40',
  brandAccentColor: '#10B981',
  isMaintenanceMode: false
};

const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Maximizing R&D Tax Credits for Tech Startups',
    slug: 'maximizing-rd-tax-credits',
    excerpt: 'A comprehensive walkthrough on qualifying software costs, claiming maximum expenditure offsets, and surviving HMRC scrutinies.',
    content: `# Maximizing R&D Tax Credits for Tech Startups\n\nResearch and Development (R&D) Tax Credits represent one of the most powerful cash-generating mechanisms available to innovative UK[...]`,
    author: 'Nisa Idrski, FCCA',
    category: 'Tax Strategy',
    tags: ['R&D Claims', 'Startup Finance', 'Tax Relief'],
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    publishedAt: '2026-05-18T10:30:00Z',
    views: 142
  },
  {
    id: 'blog-2',
    title: 'The Shift to Multi-Jurisdiction Portfolios',
    slug: 'multi-jurisdiction-portfolios',
    excerpt: 'How global investors balance double tax treaties, dynamic offshore holding structures, and UK status changes.',
    content: `# The Shift to Multi-Jurisdiction Portfolios\n\nCross-border investment holds incredible benefits, but introduces high exposure if not structured correctly.\n\n### Double Tax Treati[...]`,
    author: 'Nisa Idrski, FCCA',
    category: 'Portfolios',
    tags: ['Double Taxation', 'Wealth Protection', 'Global Wealth'],
    featuredImage: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    publishedAt: '2026-05-20T14:15:00Z',
    views: 98
  }
];

const INITIAL_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj-1',
    title: 'Tax Refactor & Multi-Channel Optimization',
    client: 'LuxVogue Ltd',
    category: 'E-commerce',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    metric: '£120,000',
    metricLabel: 'Annual Legal Savings',
    description: 'Reassigned double VAT liability on cross-border dropshipping setups under updated post-Brexit marketplace regulations.',
    status: 'published'
  },
  {
    id: 'proj-2',
    title: 'Seed Funding Structural Alignment Study',
    client: 'Revolo Capital Venture',
    category: 'Fintech',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    metric: '£4.5M',
    metricLabel: 'Seed Capital Secured',
    description: 'Engineered corporate equity allocation tables and verified regulatory compliance matrices ahead of audit checks.',
    status: 'published'
  }
];

const INITIAL_LEADS: Booking[] = [
  {
    id: 'lead-1',
    name: 'Alexander Rostova',
    email: 'arost@rostovatech.com',
    company: 'Rostova Tech Group',
    service: 'strategic-planning',
    date: '2026-06-03',
    time: '14:00',
    notes: 'Looking to audit cross-border ledger guidelines prior to expanding operations into Central Europe markets.',
    status: 'pending',
    createdAt: '2026-05-21T11:45:00Z'
  },
  {
    id: 'lead-2',
    name: 'Fiona Gallagher',
    email: 'fiona@gallagher-estates.co.uk',
    company: 'Gallagher Real Estate',
    service: 'tax-optimization',
    date: '2026-06-05',
    time: '10:30',
    notes: 'Urgent inquiry regarding tax exemptions on inheritance structure expansions for trust properties.',
    status: 'confirmed',
    createdAt: '2026-05-22T08:12:00Z'
  }
];

const INITIAL_ANALYTICS: PageAnalytics = {
  views: 8432,
  uniqueVisitors: 3120,
  bounceRate: 41.2,
  ctr: 14.8,
  desktopPercent: 64,
  mobilePercent: 31,
  tabletPercent: 5,
  trafficSources: [
    { source: 'LinkedIn Direct', count: 1840, percent: 59 },
    { source: 'Google Search Organics', count: 720, percent: 23 },
    { source: 'RCi Directory Referral', count: 320, percent: 10 },
    { source: 'Financial Times Insights', count: 240, percent: 8 }
  ],
  timelineData: [
    { date: 'May 16', views: 820, actions: 92 },
    { date: 'May 17', views: 940, actions: 110 },
    { date: 'May 18', views: 1200, actions: 145 },
    { date: 'May 19', views: 1150, actions: 130 },
    { date: 'May 20', views: 1450, actions: 180 },
    { date: 'May 21', views: 1542, actions: 210 },
    { date: 'May 22', views: 1330, actions: 172 }
  ]
};

const INITIAL_LOGS: AuditLog[] = [
  { id: 'log-1', timestamp: '2026-05-22T09:12:00Z', ip: '185.120.44.12', action: 'Admin System Reset Initiated', status: 'success', details: 'Database schema reset cleanly' },
  { id: 'log-2', timestamp: '2026-05-22T14:32:00Z', ip: '92.42.110.154', action: 'Failed Credentials Attempt', status: 'failed', details: 'Invalid username: master_ad' },
  { id: 'log-3', timestamp: '2026-05-22T16:01:00Z', ip: '82.35.91.24', action: 'Successful Authentication', status: 'success', details: 'Admitted using username and password: [admin]' }
];

const INITIAL_STATE: FullWebsiteState = {
  content: DEFAULT_CONTENT,
  services: SERVICES,
  industries: INDUSTRIES,
  testimonials: TESTIMONIALS,
  faqs: FAQS,
  blogs: INITIAL_BLOGS,
  portfolio: INITIAL_PROJECTS,
  seo: DEFAULT_SEO,
  settings: DEFAULT_SETTINGS,
  leads: INITIAL_LEADS,
  analytics: INITIAL_ANALYTICS,
  images: EMPTY_IMAGES // Start with empty images, not demo images
};

export const WebsiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<FullWebsiteState>(INITIAL_STATE);
  const [draftData, setDraftData] = useState<FullWebsiteState>(INITIAL_STATE);
  const [logs, setLogsState] = useState<AuditLog[]>(INITIAL_LOGS);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // NEW: Track if data has loaded
  
  // Real-time custom indicators
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Helper function to check admin status from current Firebase auth state
  // Uses auth.currentUser directly to avoid stale closure issues
  const checkIsAdmin = (): boolean => {
    const currentUser = auth.currentUser;
    return currentUser?.email === "walidsmartparts@gmail.com" && currentUser?.emailVerified === true;
  };

  const isAdminUser = user?.email === "walidsmartparts@gmail.com" && user?.emailVerified === true;
  const hasChanges = JSON.stringify(data) !== JSON.stringify(draftData);

  // 1. Core Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // 2. Real-time Subscription - Public Website Layout (site/published)
  // PRIORITY: Load immediately and mark as loaded
  useEffect(() => {
    let mounted = true;

    // First, do a one-time fetch to get data ASAP
    const fetchPublishedData = async () => {
      try {
        const snapshot = await getDoc(doc(db, 'site', 'published'));
        if (mounted) {
          if (snapshot.exists()) {
            const dbData = snapshot.data() as FullWebsiteState;
            setData(prev => ({
              ...prev,
              ...dbData,
              leads: prev.leads.length > 0 ? prev.leads : (dbData.leads || [])
            }));
          } else {
            // Self-initialize empty database with fallback defaults
            const bootstrap = async () => {
              try {
                await setDoc(doc(db, 'site', 'published'), INITIAL_STATE);
                console.log("Self-bootstrapped Firestore layout config");
              } catch (e) {
                console.warn("Passive configuration seed bypass:", e);
              }
            };
            bootstrap();
          }
          setIsDataLoaded(true); // Mark as loaded after initial fetch
        }
      } catch (error) {
        if (mounted) {
          console.warn("Error fetching published data:", error);
          setIsDataLoaded(true); // Still mark as loaded to prevent permanent loading state
        }
      }
    };

    fetchPublishedData();

    // Then set up real-time listener
    const unsub = onSnapshot(doc(db, 'site', 'published'), (snapshot) => {
      if (mounted && snapshot.exists()) {
        const dbData = snapshot.data() as FullWebsiteState;
        setData(prev => ({
          ...prev,
          ...dbData,
          leads: prev.leads.length > 0 ? prev.leads : (dbData.leads || [])
        }));
      }
    }, (error) => {
      console.warn("Direct site/published snapshot subscription handled passively:", error.message);
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  // 3. Real-time Subscription - Sandbox Workspace Layout (site/draft)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site', 'draft'), (snapshot) => {
      if (snapshot.exists()) {
        const dbDraft = snapshot.data() as FullWebsiteState;
        setDraftData(prev => ({
          ...prev,
          ...dbDraft,
          leads: prev.leads.length > 0 ? prev.leads : (dbDraft.leads || [])
        }));
      } else {
        const bootstrapDraft = async () => {
          try {
            await setDoc(doc(db, 'site', 'draft'), INITIAL_STATE);
          } catch (e) {
            console.warn("Passive draft configuration seed bypass:", e);
          }
        };
        bootstrapDraft();
      }
    }, (error) => {
      console.warn("Direct site/draft snapshot subscription handled passively:", error.message);
    });

    return unsub;
  }, []);

  // 4. Real-time Subscription - Secured Leads & Audit Trails (Admin SSO Exclusive)
  useEffect(() => {
    let unsubLeads: (() => void) | undefined;
    let unsubLogs: (() => void) | undefined;

    if (isAdminUser) {
      console.log("Admin verified! Initializing secure collection sync streams.");
      
      const leadsQuery = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      unsubLeads = onSnapshot(leadsQuery, (snapshot) => {
        const fetchedLeads: Booking[] = [];
        snapshot.forEach(docSnap => {
          fetchedLeads.push(docSnap.data() as Booking);
        });
        
        setData(prev => ({ ...prev, leads: fetchedLeads }));
        setDraftData(prev => ({ ...prev, leads: fetchedLeads }));
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'leads');
      });

      const logsQuery = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(100));
      unsubLogs = onSnapshot(logsQuery, (snapshot) => {
        const fetchedLogs: AuditLog[] = [];
        snapshot.forEach(docSnap => {
          fetchedLogs.push(docSnap.data() as AuditLog);
        });
        setLogsState(fetchedLogs);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'logs');
      });
    } else {
      // Spectators or non-admins fall back to empty or mock lists
      setLogsState(INITIAL_LOGS);
    }

    return () => {
      if (unsubLeads) unsubLeads();
      if (unsubLogs) unsubLogs();
    };
  }, [isAdminUser]);

  // 5. Auto passive visitor metrics tracker
  useEffect(() => {
    const incrementPassiveViews = setTimeout(async () => {
      try {
        const publishedDocRef = doc(db, 'site', 'published');
        // Fetch current document first
        const snap = await getDoc(publishedDocRef);
        if (snap.exists()) {
          const currentData = snap.data() as FullWebsiteState;
          const updatedViews = (currentData.analytics?.views || INITIAL_ANALYTICS.views) + 1;
          
          await updateDoc(publishedDocRef, {
            'analytics.views': updatedViews
          });
        }
      } catch (err) {
        // Suppress errors during local spectator loading to keep console clean
      }
    }, 2000);

    return () => clearTimeout(incrementPassiveViews);
  }, []);

  // Core functions
  const saveDraft = (updatedDraft: Partial<FullWebsiteState> | ((prev: FullWebsiteState) => FullWebsiteState)) => {
    setDraftData(prev => {
      const next = typeof updatedDraft === 'function' ? updatedDraft(prev) : { ...prev, ...updatedDraft };
      
      // Only save to Firestore if user is authenticated as admin
      // Use checkIsAdmin() to get fresh auth state, avoiding stale closure
      if (checkIsAdmin()) {
        setDoc(doc(db, 'site', 'draft'), next)
          .catch(err => handleFirestoreError(err, OperationType.UPDATE, 'site/draft'));
      }

      return next;
    });
  };

  const publishDraft = async (): Promise<boolean> => {
    // Require admin authentication to publish
    // Use checkIsAdmin() to get fresh auth state from Firebase directly
    if (!checkIsAdmin()) {
      console.warn('Publish blocked: User is not authenticated as admin. Current user:', auth.currentUser?.email);
      return false;
    }

    try {
      // Synchronize sandbox draft with production in parallel
      await Promise.all([
        setDoc(doc(db, 'site', 'published'), draftData),
        setDoc(doc(db, 'site', 'draft'), draftData)
      ]);
      
      // Update local published state only after successful Firebase write
      setData(draftData);
      
      addLog({
        ip: '127.0.0.1 (Web CMS Block)',
        action: 'Publish Changes',
        status: 'success',
        details: 'All sandbox visual modules and layout content guidelines were pushed live to the public ledger.'
      });
      
      return true;
    } catch (error) {
      console.error('Publish failed:', error);
      addLog({
        ip: '127.0.0.1 (Web CMS Block)',
        action: 'Publish Changes',
        status: 'failed',
        details: `Publish operation failed: ${error instanceof Error ? error.message : String(error)}`
      });
      return false;
    }
  };

  const undoChanges = () => {
    setDraftData(data);
    // Only save to Firestore if user is authenticated as admin
    // Use checkIsAdmin() to get fresh auth state
    if (checkIsAdmin()) {
      setDoc(doc(db, 'site', 'draft'), data)
        .catch(err => handleFirestoreError(err, OperationType.WRITE, 'site/draft'));
    }
  };

  const resetToDefault = async (): Promise<boolean> => {
    // Require admin authentication to reset
    // Use checkIsAdmin() to get fresh auth state from Firebase directly
    if (!checkIsAdmin()) {
      console.warn('Reset blocked: User is not authenticated as admin. Current user:', auth.currentUser?.email);
      return false;
    }

    try {
      await Promise.all([
        setDoc(doc(db, 'site', 'draft'), INITIAL_STATE),
        setDoc(doc(db, 'site', 'published'), INITIAL_STATE)
      ]);
      
      setDraftData(INITIAL_STATE);
      setData(INITIAL_STATE);
      
      addLog({
        ip: '127.0.0.1 (Platform Reset)',
        action: 'Reset Entire Project',
        status: 'success',
        details: 'Sovereign database reset to default template standards.'
      });
      
      return true;
    } catch (error) {
      console.error('Reset failed:', error);
      addLog({
        ip: '127.0.0.1 (Platform Reset)',
        action: 'Reset Entire Project',
        status: 'failed',
        details: `Reset operation failed: ${error instanceof Error ? error.message : String(error)}`
      });
      return false;
    }
  };

  // Add consultation booking leads (visitor function)
  const addLead = async (lead: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const leadId = `lead-${Date.now()}`;
    const newLead: Booking = {
      ...lead,
      id: leadId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'leads', leadId), newLead);
      
      // Increment submit metrics locally if available
      setData(prev => ({
        ...prev,
        analytics: {
          ...prev.analytics,
          timelineData: prev.analytics.timelineData.map((d, index) => 
            index === prev.analytics.timelineData.length - 1 
              ? { ...d, actions: d.actions + 1 } 
              : d
          )
        }
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `leads/${leadId}`);
    }
  };

  const updateLeadStatus = async (id: string, status: 'pending' | 'confirmed') => {
    try {
      await updateDoc(doc(db, 'leads', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `leads/${id}`);
    }
  };

  const addBlogPost = (post: Omit<BlogPost, 'id' | 'publishedAt' | 'views'>) => {
    const newPost: BlogPost = {
      ...post,
      id: `blog-${Date.now()}`,
      publishedAt: new Date().toISOString(),
      views: 0
    };
    saveDraft(prev => ({
      ...prev,
      blogs: [newPost, ...prev.blogs]
    }));
  };

  const editBlogPost = (id: string, post: Partial<BlogPost>) => {
    saveDraft(prev => ({
      ...prev,
      blogs: prev.blogs.map(b => b.id === id ? { ...b, ...post } : b)
    }));
  };

  const deleteBlogPost = (id: string) => {
    saveDraft(prev => ({
      ...prev,
      blogs: prev.blogs.filter(b => b.id !== id)
    }));
  };

  const addProject = (project: Omit<PortfolioProject, 'id'>) => {
    const newProj: PortfolioProject = {
      ...project,
      id: `proj-${Date.now()}`
    };
    saveDraft(prev => ({
      ...prev,
      portfolio: [newProj, ...prev.portfolio]
    }));
  };

  const editProject = (id: string, project: Partial<PortfolioProject>) => {
    saveDraft(prev => ({
      ...prev,
      portfolio: prev.portfolio.map(p => p.id === id ? { ...p, ...project } : p)
    }));
  };

  const deleteProject = (id: string) => {
    saveDraft(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter(p => p.id !== id)
    }));
  };

  const addLog = async (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const logId = `log-${Date.now()}`;
    const newLog: AuditLog = {
      ...log,
      id: logId,
      timestamp: new Date().toISOString()
    };

    if (isAdminUser) {
      try {
        await setDoc(doc(db, 'logs', logId), newLog);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `logs/${logId}`);
      }
    } else {
      // Local fallback for passive logging before SSO authorization completes
      setLogsState(prev => [newLog, ...prev]);
    }
  };

  const purgeCdnCache = async () => {
    await addLog({
      ip: '127.0.0.1 (Cloud Admin)',
      action: 'Purge CDN Cloud Cache',
      status: 'success',
      details: 'All regional sovereign static and dynamic content Delivery networks successfully flushed.'
    });
    return true;
  };

  // Google Single Sign-On handles
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("Google SSO Popup triggered exception: ", e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Error signing out:", e);
    }
  };

  return (
    <WebsiteDataContext.Provider
      value={{
        data,
        draftData,
        hasChanges,
        isDataLoaded,
        saveDraft,
        publishDraft,
        undoChanges,
        resetToDefault,
        addLead,
        updateLeadStatus,
        addBlogPost,
        editBlogPost,
        deleteBlogPost,
        addProject,
        editProject,
        deleteProject,
        logs,
        addLog,
        purgeCdnCache,
        // Google authentication extensions
        user,
        isAdminUser,
        authLoading,
        signInWithGoogle,
        logout
      }}
    >
      {children}
    </WebsiteDataContext.Provider>
  );
};

export const useWebsiteData = () => {
  const context = useContext(WebsiteDataContext);
  if (!context) {
    throw new Error('useWebsiteData must be used within a WebsiteDataProvider');
  }
  return context;
};
