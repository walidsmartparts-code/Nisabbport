import React, { useState, useEffect, useRef } from 'react';
import { 
  useWebsiteData, 
  BlogPost, 
  PortfolioProject, 
  AuditLog,
  SectionImages
} from '../context/WebsiteDataContext';
import {
  Booking,
  Service,
  Industry,
  Testimonial,
  FAQItem
} from '../types';
import AdminImageBlock from './AdminImageBlock';
import { 
  LayoutDashboard, 
  Menu as MenuIcon, 
  Image as ImageIcon, 
  Search, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCcw, 
  CheckCircle, 
  ExternalLink, 
  TrendingUp, 
  Users, 
  Calendar, 
  ChevronRight, 
  Settings, 
  ArrowLeft, 
  LogOut, 
  Lock, 
  Globe, 
  FileText, 
  Database, 
  ShieldAlert, 
  Activity, 
  Sparkles, 
  Send, 
  Sliders, 
  Upload, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Eye, 
  Shield, 
  Download,
  AlertTriangle,
  Folder,
  Palette,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom lightweight SVG Map and Area chart components to ensure 100% compilation safety
const DynamicDashboardChart: React.FC<{ data: { date: string; views: number; actions: number }[] }> = ({ data }) => {
  const maxViews = Math.max(...data.map(d => d.views), 1000);
  const width = 500;
  const height = 150;
  
  // Calculate SVG line points
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (d.views / maxViews) * (height - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  const actionPoints = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (d.actions * 6 / maxViews) * (height - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-44 mt-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="actionGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#004D40" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#004D40" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((val, idx) => (
          <line 
            key={idx}
            x1="0"
            y1={height * val}
            x2={width}
            y2={height * val}
            stroke="#F1F5F9"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Areas */}
        <path
          d={`M 0,${height} L ${points} L ${width},${height} Z`}
          fill="url(#chartGrad)"
        />
        
        {/* Connection paths */}
        <polyline
          fill="none"
          stroke="#10B981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        <polyline
          fill="none"
          stroke="#004D40"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2 2"
          points={actionPoints}
        />

        {/* Data point circles */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * width;
          const y = height - (d.views / maxViews) * (height - 20) - 10;
          return (
            <g key={i} className="group/dot cursor-pointer">
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="#10B981"
                stroke="#FFFFFF"
                strokeWidth="2"
                className="transition-transform duration-200 group-hover/dot:scale-150"
              />
              <title>{`${d.date}: ${d.views} views`}</title>
            </g>
          );
        })}
      </svg>
      {/* Chart Legend */}
      <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2 px-1">
        {data.map((d, i) => <span key={i}>{d.date}</span>)}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { 
    data, 
    draftData, 
    hasChanges, 
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
    // Google authentication integration
    user,
    isAdminUser,
    authLoading,
    signInWithGoogle,
    logout
  } = useWebsiteData();

  // Authentication States
  const [isLocalCredsAuth, setIsLocalCredsAuth] = useState(() => {
    return localStorage.getItem('nisa_admin_logged_in') === 'true';
  });
  
  const isAuthenticated = isAdminUser || isLocalCredsAuth;
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Google auth loader state
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googlePopupOpen, setGooglePopupOpen] = useState(false);

  // Active workspace subsection
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSeoTab, setSelectedSeoTab] = useState<'global' | 'og' | 'twitter' | 'linkedin' | 'facebook'>('global');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Local Workspace Draft changes (transient till published or saved)
  const [currentSectionContent, setCurrentSectionContent] = useState(draftData.content);
  const [currentSeo, setCurrentSeo] = useState(draftData.seo);
  const [currentSettings, setCurrentSettings] = useState(draftData.settings);

  // Search filter and list triggers
  const [blogSearch, setBlogSearch] = useState('');
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [blogEditForm, setBlogEditForm] = useState<Partial<BlogPost>>({});

  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectEditForm, setProjectEditForm] = useState<Partial<PortfolioProject>>({});

  const [leadFilter, setLeadFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [leadSearchName, setLeadSearchName] = useState('');
  const [selectedLead, setSelectedLead] = useState<Booking | null>(null);
  const [leadReplyText, setLeadReplyText] = useState('');

  // Media interaction
  const [mediaFilterType, setMediaFilterType] = useState('all');
  const [clipboardCopySuccess, setClipboardCopySuccess] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Real-time custom live draft website visualizer state
  const [showDraftPreview, setShowDraftPreview] = useState(false);
  
  // Publishing state for proper async feedback
  const [isPublishing, setIsPublishing] = useState(false);

  // Update transient edit objects when the global draft model updates
  useEffect(() => {
    setCurrentSectionContent(draftData.content);
    setCurrentSeo(draftData.seo);
    setCurrentSettings(draftData.settings);
  }, [draftData]);

  const handleImageChange = (section: keyof SectionImages, key: string, value: string) => {
    saveDraft(prev => ({
      ...prev,
      images: {
        ...prev.images,
        [section]: {
          ...prev.images[section],
          [key]: value
        }
      }
    }));
    showToast(`Updated image configuration for ${section}`);
  };

  // Toast Helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Credentials sign in
  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'bigbooty69') {
      setIsLocalCredsAuth(true);
      localStorage.setItem('nisa_admin_logged_in', 'true');
      setAuthError('');
      addLog({
        ip: '192.168.1.1',
        action: 'Secure Authentication',
        status: 'success',
        details: 'Admitted using credentials username: ' + username
      });
      showToast('Authenticated Securely as Nisa Idrisi');
    } else {
      setAuthError('Invalid credentials entered. Please try again.');
      addLog({
        ip: '192.168.1.1',
        action: 'Failed Credentials Attempt',
        status: 'failed',
        details: `Credentials input: [${username}] failed evaluation match.`
      });
    }
  };

  // Real Google Application Authentication Popup handlers
  const triggerGoogleAuthMock = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      addLog({
        ip: '172.56.24.8',
        action: 'Google SSO Authentication',
        status: 'success',
        details: 'Authenticated successfully via Firebase Google SSO.'
      });
      showToast('Authenticated Securely via Google Single Sign-On.');
    } catch (e: any) {
      console.error("Popup Error details:", e);
      setAuthError('Google SSO popup failed or was blockaded: ' + (e.message || String(e)));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const completeGoogleAuth = (email: string) => {
    setGooglePopupOpen(false);
    setIsLocalCredsAuth(true);
    localStorage.setItem('nisa_admin_logged_in', 'true');
    addLog({
      ip: '172.56.24.8',
      action: 'Google SSO Authentication',
      status: 'success',
      details: `Authenticated via token representing security ID: [${email}]`
    });
    showToast(`Welcome back, ${email.split('@')[0]}`);
  };

  const handleLogout = async () => {
    setIsLocalCredsAuth(false);
    localStorage.removeItem('nisa_admin_logged_in');
    
    try {
      await logout();
    } catch (e) {
      console.warn("Auth logout returned exception:", e);
    }

    addLog({
      ip: '127.0.0.1',
      action: 'Terminated User Session',
      status: 'success',
      details: 'User explicitly logged out of administrative framework'
    });
    showToast('Secure user session terminated.');
  };

  const triggerPublish = async () => {
    if (isPublishing) return;
    
    // Check if user has Firebase authentication (required for Firestore writes)
    if (!isAdminUser) {
      // User is logged in via local credentials but not Firebase
      // Prompt them to sign in with Google for publishing
      const shouldSignIn = window.confirm(
        'Publishing requires Google authentication to save changes to the database.\n\n' +
        'Would you like to sign in with Google now?'
      );
      
      if (shouldSignIn) {
        setIsGoogleLoading(true);
        try {
          await signInWithGoogle();
          // After successful sign-in, proceed with publish
          setIsPublishing(true);
          const success = await publishDraft();
          if (success) {
            showToast('Successfully published all draft edits live!');
          } else {
            showToast('Publish failed: Authentication error. Please try signing in again.');
          }
        } catch (error) {
          console.error('Google sign-in error:', error);
          showToast('Google sign-in failed. Please try again.');
        } finally {
          setIsGoogleLoading(false);
          setIsPublishing(false);
        }
      }
      return;
    }
    
    setIsPublishing(true);
    try {
      const success = await publishDraft();
      if (success) {
        showToast('Successfully published all draft edits live!');
      } else {
        showToast('Publish failed: Authentication error. Please sign in with Google.');
      }
    } catch (error) {
      console.error('Publish error:', error);
      showToast('Publish failed: An unexpected error occurred.');
    } finally {
      setIsPublishing(false);
    }
  };

  const triggerResetToTemplates = async () => {
    // Check if user has Firebase authentication (required for Firestore writes)
    if (!isAdminUser) {
      const shouldSignIn = window.confirm(
        'Resetting requires Google authentication to save changes to the database.\n\n' +
        'Would you like to sign in with Google now?'
      );
      
      if (shouldSignIn) {
        setIsGoogleLoading(true);
        try {
          await signInWithGoogle();
          // After successful sign-in, proceed with reset confirmation
          if (window.confirm('Are you absolutely sure you want to revert ALL sections, settings, blogs, and database entries to sovereign defaults? Your edits will be lost.')) {
            const success = await resetToDefault();
            if (success) {
              showToast('Nisa Idrisi system restored to template state.');
            } else {
              showToast('Reset failed: Authentication error. Please try signing in again.');
            }
          }
        } catch (error) {
          console.error('Google sign-in error:', error);
          showToast('Google sign-in failed. Please try again.');
        } finally {
          setIsGoogleLoading(false);
        }
      }
      return;
    }
    
    if (window.confirm('Are you absolutely sure you want to revert ALL sections, settings, blogs, and database entries to sovereign defaults? Your edits will be lost.')) {
      const success = await resetToDefault();
      if (success) {
        showToast('Nisa Idrisi system restored to template state.');
      } else {
        showToast('Reset failed: Authentication error. Please sign in with Google.');
      }
    }
  };

  // Form helper to modify content under Workspace Draft state
  const handleContentChange = (field: keyof typeof currentSectionContent, val: string) => {
    const updated = { ...currentSectionContent, [field]: val };
    setCurrentSectionContent(updated);
    saveDraft({ content: updated });
  };

  const handleSEOChange = (field: keyof typeof currentSeo, val: string) => {
    const updated = { ...currentSeo, [field]: val };
    setCurrentSeo(updated as any);
    saveDraft({ seo: updated as any });
  };

  const handleNestedSEOChange = (category: 'openGraph' | 'twitterCard' | 'linkedin' | 'facebook', field: string, val: string) => {
    const updated = {
      ...currentSeo,
      [category]: {
        ...((currentSeo[category] as any) || {}),
        [field]: val
      }
    };
    setCurrentSeo(updated as any);
    saveDraft({ seo: updated as any });
  };

  const handleSettingsChange = (field: keyof typeof currentSettings, val: string | boolean) => {
    const updated = { ...currentSettings, [field]: val };
    setCurrentSettings(updated);
    saveDraft({ settings: updated });
  };

  // Blog creation and modification
  const handleSelectBlog = (id: string | 'new') => {
    if (id === 'new') {
      setSelectedBlogId('new');
      setBlogEditForm({
        title: 'New Strategic Insight Article',
        excerpt: 'Write a powerful synopsis here for global executives.',
        content: '# New Strategic Insight Article\n\nEnter rich body text using full markdown templates here.',
        category: 'Strategy Advisory',
        tags: ['Finance', 'UK Accounting'],
        status: 'draft',
        featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
        author: 'Nisa Idrisi, FCCA'
      });
    } else {
      setSelectedBlogId(id);
      const article = draftData.blogs.find(b => b.id === id);
      if (article) {
        setBlogEditForm({ ...article });
      }
    }
  };

  const saveBlogItem = () => {
    if (!blogEditForm.title || !blogEditForm.excerpt) {
      showToast('Validation Failed: Title and excerpt are required.');
      return;
    }
    const slug = (blogEditForm.title || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const completeForm = {
      ...blogEditForm,
      slug,
    } as Omit<BlogPost, 'id' | 'publishedAt' | 'views'>;

    if (selectedBlogId === 'new') {
      addBlogPost(completeForm);
      showToast(`Created new article "${blogEditForm.title}" in workspace.`);
    } else if (selectedBlogId) {
      editBlogPost(selectedBlogId, blogEditForm);
      showToast(`Updated article "${blogEditForm.title}" in workspace.`);
    }
    setSelectedBlogId(null);
  };

  // Case Study / Portfolio setup
  const handleSelectProject = (id: string | 'new') => {
    if (id === 'new') {
      setSelectedProjectId('new');
      setProjectEditForm({
        title: 'High-Level Advisory Project',
        client: 'Global Venture Ltd',
        category: 'E-commerce',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
        metric: '£75,000',
        metricLabel: 'Capital Saved',
        description: 'Detailing structural tax planning optimizations legally executed in global markets.',
        status: 'draft'
      });
    } else {
      setSelectedProjectId(id);
      const proj = draftData.portfolio.find(p => p.id === id);
      if (proj) {
        setProjectEditForm({ ...proj });
      }
    }
  };

  const saveProjectItem = () => {
    if (!projectEditForm.title || !projectEditForm.client) {
      showToast('Validation Error: Title and Client name required.');
      return;
    }
    const completeForm = {
      ...projectEditForm
    } as Omit<PortfolioProject, 'id'>;

    if (selectedProjectId === 'new') {
      addProject(completeForm);
      showToast(`Created Case Study: ${projectEditForm.title}`);
    } else if (selectedProjectId) {
      editProject(selectedProjectId, projectEditForm);
      showToast(`Edited Case Study details.`);
    }
    setSelectedProjectId(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setClipboardCopySuccess(text);
    setTimeout(() => setClipboardCopySuccess(null), 2000);
    showToast('Asset CDN URL copied to secure clipboard.');
  };

  const exportLeadsCSV = () => {
    const headers = 'ID,Name,Email,Company,Service,Date,Time,Status,CreatedAt\n';
    const rows = draftData.leads.map(l => 
      `"${l.id}","${l.name}","${l.email}","${l.company}","${l.service}","${l.date}","${l.time}","${l.status}","${l.createdAt}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Nisa_Idrisi_Leads_Report.csv');
    a.click();
    showToast('Exported Leads Desk submissions securely to CSV format.');
  };

  // Render Authentication Wall
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 font-sans antialiased text-[#1A202C]">
        <div className="w-full max-w-md bg-white rounded-3xl shrink-0 p-8 shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col">
          {/* Accent Glow Ring */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#004D40] to-[#10B981]" />
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#004D40] to-[#10B981] flex items-center justify-center font-bold text-white text-lg tracking-wider mb-3">
              NI
            </div>
            <h2 className="text-2xl font-extrabold text-[#004D40] tracking-tight leading-none">
              NISA IDRISI CMS
            </h2>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-1">
              Enterprise Control Framework
            </p>
          </div>

          <form onSubmit={handleCredentialsLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#004D40] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#004D40] transition-colors"
                required
              />
            </div>

            {authError && (
              <div className="p-3 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl leading-relaxed">
                {authError}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-3.5 px-6 bg-[#004D40] hover:bg-[#00382E] text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#004D40]/25 cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock size={14} />
              <span>Sign In Securely</span>
            </button>
          </form>

          {/* OR divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-200" />
            <span className="px-3 text-[10px] uppercase font-bold text-slate-400 tracking-widest">or</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* Google Sign-in button */}
          <button 
            type="button"
            onClick={triggerGoogleAuthMock}
            className="w-full py-3 px-5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-705 text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-3 relative"
          >
            {/* Minimal SVG representation of Google G */}
            <svg className="w-4 h-4 ml-1 shrink-0" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.43 1.68 14.9 1 12 1 7.35 1 3.39 3.65 1.5 7.5L4.85 10C5.7 7.14 8.6 5.04 12 5.04z" />
              <path fill="#4285F4" d="M23.52 12.3c0-.83-.07-1.63-.22-2.4H12v4.54h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.74-4.94 3.74-8.59z" />
              <path fill="#FBBC05" d="M4.85 14c-.23-.69-.35-1.43-.35-2.2s.12-1.51.35-2.2L1.5 7.15C.54 9.12 0 11.23 0 13.5s.54 4.38 1.5 6.35L4.85 14.1z" />
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.34 1.11-3.93 1.11-3.4 0-6.3-2.1-7.15-4.96L1.5 15.85C3.39 19.7 7.35 22.3 12 23z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="text-[10px] text-center text-slate-400 font-medium leading-relaxed mt-6 italic">
            Default credentials for trial: admin / bigbooty69
          </p>
        </div>

        {/* Mock Google Consent Popup Screen Handler */}
        {googlePopupOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">G</div>
                  <span className="text-xs font-bold text-slate-700">OAuth Sign-in Verification</span>
                </div>
                <button onClick={() => setGooglePopupOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs">Close</button>
              </div>

              <div className="p-8 text-center flex-1">
                {isGoogleLoading ? (
                  <div className="py-12 space-y-4 flex flex-col items-center">
                    <span className="w-10 h-10 border-4 border-emerald-accent/30 border-t-emerald-accent rounded-full animate-spin" />
                    <p className="text-sm text-slate-500 font-medium">Connecting secure credential loops...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Select an Account</h3>
                      <p className="text-xs text-slate-400 mt-1">To continue with Nisa Idrisi Executive CRM</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        'walidsmartparts@gmail.com',
                        'advisory.lead@rci-accountants.org',
                        'compliance@nisaidrisi.co.uk'
                      ].map((email, index) => (
                        <button
                          key={index}
                          onClick={() => completeGoogleAuth(email)}
                          className="w-full p-4 hover:bg-slate-50 rounded-2xl border border-slate-100 text-left text-xs font-semibold text-slate-700 flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#10B981]/15 text-emerald-accent-dark font-extrabold flex items-center justify-center">
                            {email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-slate-800 font-bold leading-none">{email.split('@')[0]}</p>
                            <p className="text-slate-400 font-medium mt-1">{email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dashboard content workspace layout structure
  const sidebarItems = [
    { label: 'Overview', id: 'overview', icon: LayoutDashboard },
    { label: 'Header/Navbar', id: 'header', icon: MenuIcon },
    { label: 'Hero Section', id: 'hero', icon: Sparkles },
    { label: 'About Section', id: 'about', icon: Users },
    { label: 'Services', id: 'services', icon: Sliders },
    { label: 'Why Choose Me', id: 'why', icon: CheckCircle },
    { label: 'Industries', id: 'industries', icon: Folder },
    { label: 'Testimonials', id: 'testimonials', icon: FileText },
    { label: 'FAQ Section', id: 'faq', icon: Database },
    { label: 'CTA Banner', id: 'cta', icon: ArrowUpRight },
    { label: 'Blog CMS', id: 'blog', icon: FileText },
    { label: 'Portfolio/Case Studies', id: 'portfolio', icon: Activity },
    { label: 'SEO Settings', id: 'seo', icon: Globe },
    { label: 'Leads Inbox', id: 'leads', icon: Calendar },
    { label: 'Branding Settings', id: 'branding', icon: Palette },
    { label: 'Admin Logs & System', id: 'security', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-[#1A202C]">
      
      {/* Toast Alert pop notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold leading-relaxed shadow-2xl z-50 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR navigation */}
      <aside className="w-72 bg-gradient-to-b from-[#004D40] to-[#002A23] text-white/90 sticky top-0 h-screen flex flex-col justify-between p-6 overflow-y-auto z-30 shrink-0 select-none">
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10B981] to-[#004D40] flex items-center justify-center font-bold text-white text-xs tracking-wider">
              NI
            </div>
            <div>
              <span className="text-sm font-black tracking-widest text-[#10B981] block">NISA ADVISORY</span>
              <span className="text-[9px] uppercase tracking-wider text-white/50 block font-serif">Enterprise Portal</span>
            </div>
          </div>

          <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold mb-4">Core Modules</p>
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSelectedBlogId(null);
                    setSelectedProjectId(null);
                  }}
                  className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    activeTab === item.id 
                      ? 'bg-white/10 text-[#10B981] shadow-sm font-black border-l-2 border-[#10B981]' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} className={activeTab === item.id ? 'text-[#10B981]' : 'text-white/40'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Workspace state and Draft control actions block */}
        <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-center flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Workspace Status</span>
              <span className={`w-2 h-2 rounded-full ${hasChanges ? 'bg-amber-400 animate-pulse' : 'bg-[#10B981]'}`} />
            </div>
            
            <p className="text-[10px] text-left text-white/60 leading-relaxed italic">
              {hasChanges ? 'Edits are in draft mode' : 'All workspace drafts are published.'}
            </p>

            {hasChanges && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button 
                  onClick={undoChanges}
                  className="py-1.5 px-2 bg-white/10 hover:bg-white/15 text-white font-bold text-[9px] uppercase tracking-widest rounded-lg cursor-pointer"
                >
                  Discard
                </button>
                <button 
                  onClick={triggerPublish}
                  className="py-1.5 px-2 bg-[#10B981] hover:bg-emerald-accent-dark text-slate-900 font-extrabold text-[9px] uppercase tracking-widest rounded-lg cursor-pointer"
                >
                  Publish
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-3"
          >
            <LogOut size={13} />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* RIGHT SIDE WORKSPACE EDITOR WINDOW */}
      <main className="flex-1 flex flex-col overflow-y-auto max-h-screen">
        
        {/* Dynamic Editor Header with quick actions and stats */}
        <header className="px-8 py-5 border-b border-slate-100 bg-white sticky top-0 z-20 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.history.back()} 
              className="p-1.5 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer"
              title="Return to website homepage"
            >
              <ArrowLeft size={14} />
            </button>
            <div>
              <h1 className="text-base font-extrabold text-[#004D40] leading-none">
                {sidebarItems.find(i => i.id === activeTab)?.label} Editor
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">
                CMS / Framework controls / Static and live updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                // Open visual overlay representation of the whole website pages
                setShowDraftPreview(true);
              }}
              className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-705 text-xs font-semibold cursor-pointer flex items-center gap-2"
            >
              <Eye size={13} />
              <span>Full Screen Draft Preview</span>
            </button>

            {/* Auth status indicator */}
            {isAuthenticated && !isAdminUser && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span className="text-[10px] font-semibold text-amber-700">Local Auth Only</span>
              </div>
            )}
            {isAdminUser && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-semibold text-emerald-700">Firebase Connected</span>
              </div>
            )}

            <button 
              onClick={triggerPublish}
              disabled={!hasChanges || isPublishing}
              className={`py-2.5 px-5 text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2 ${
                hasChanges && !isPublishing
                  ? 'bg-[#10B981] hover:bg-emerald-accent-dark shadow-emerald-accent/25' 
                  : 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed opacity-50'
              }`}
            >
              {isPublishing ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Save size={13} />
                  <span>Publish Workspace Live</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Workspace editable panels */}
        <div className="flex-1 p-8">
          
          {/* OVERVIEW PANEL */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-5xl">
              <div className="grid grid-cols-4 gap-6">
                <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Page Views</span>
                    <TrendingUp className="text-[#10B981]" size={16} />
                  </div>
                  <div className="text-3xl font-black text-slate-800 leading-none">{draftData.analytics.views}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Real-time dynamic monitoring</div>
                </div>

                <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Submissions Inbox</span>
                    <Calendar className="text-emerald-key" size={16} />
                  </div>
                  <div className="text-3xl font-black text-[#004D40] leading-none">{draftData.leads.length}</div>
                  <div className="text-[10px] font-semibold text-emerald-accent-dark">
                    {draftData.leads.filter(l => l.status === 'pending').length} Pending consultation
                  </div>
                </div>

                <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Conversion CTR</span>
                    <Activity className="text-emerald-accent-dark" size={16} />
                  </div>
                  <div className="text-3xl font-black text-slate-800 leading-none">{draftData.analytics.ctr}%</div>
                  <div className="text-[10px] text-slate-400 font-medium">Click-through and call setup rates</div>
                </div>

                <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Bounce Rate</span>
                    <Shield className="text-slate-400" size={16} />
                  </div>
                  <div className="text-3xl font-black text-slate-800 leading-none">{draftData.analytics.bounceRate}%</div>
                  <div className="text-[10px] text-slate-400 font-medium">Visitor visual retention benchmark</div>
                </div>
              </div>

              {/* Chart of Dynamic Analytical Trends */}
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Visual Engagement Trends</h4>
                      <p className="text-[10px] text-slate-400">Comparing page views to client dynamic conversions</p>
                    </div>
                    <div className="flex gap-4 text-[10px] font-bold font-mono">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Page Views</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#004D40]" /> Dynamic CTA clicks</span>
                    </div>
                  </div>
                  <DynamicDashboardChart data={draftData.analytics.timelineData} />
                </div>

                {/* Quick actions box */}
                <div className="bg-[#004D40] text-white rounded-3xl p-6 flex flex-col justify-between shadow-lg shadow-[#004D40]/15 relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
                  <div className="space-y-4">
                    <div className="inline-flex py-1 px-2.5 bg-white/10 rounded-full font-mono text-[9px] text-[#10B981] font-bold uppercase">Actions Console</div>
                    <h4 className="text-base font-extrabold tracking-tight">Active CMS Workspace shortcuts</h4>
                    <p className="text-xs text-white/70 leading-relaxed">Modify your content dynamically, view insights, or publish recent draft modifications across the entire website structure.</p>
                  </div>
                  
                  <div className="space-y-2 pt-6">
                    <button 
                      onClick={() => handleSelectBlog('new')}
                      className="w-full py-2.5 px-4 bg-[#10B981] hover:bg-[#34D399] text-slate-900 font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-between"
                    >
                      <span>Draft New Post</span>
                      <Plus size={13} />
                    </button>
                    <button 
                      onClick={() => purgeCdnCache().then(() => showToast('Bypassed DNS and purged CDN Cache files successfully'))}
                      className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white font-bold text-[11px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-between"
                    >
                      <span>Purge Edge Files</span>
                      <RefreshCcw size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Top traffic sources desk */}
              <div className="p-6 bg-white rounded-3xl border border-[#F1F5F9] shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-4">Leading Traffic Channels</h4>
                <div className="grid grid-cols-4 gap-4">
                  {draftData.analytics.trafficSources.map((src, index) => (
                    <div key={index} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{src.source}</div>
                      <div className="text-xl font-extrabold text-slate-800 mb-2">{src.count}</div>
                      <div className="h-1.5 w-full bg-slate-150 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-accent-dark" style={{ width: `${src.percent}%` }} />
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono mt-1 text-right">{src.percent}% representation</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION HEADER CONTENT FOR COMS */}
          {activeTab === 'header' && (
            <div className="max-w-2xl bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
              <h3 className="text-base font-extrabold text-slate-800 pb-4 border-b border-slate-50">Header & Navbar Properties</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Logo Text</label>
                  <input 
                    type="text" 
                    value={currentSectionContent.headerText || ''}
                    onChange={(e) => handleContentChange('headerText', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#004D40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CTA Action Button text</label>
                  <input 
                    type="text" 
                    value={currentSectionContent.headerCtaLabel || ''}
                    onChange={(e) => handleContentChange('headerCtaLabel', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#004D40]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* HERO SECTION CONSOLE */}
          {activeTab === 'hero' && (
            <div className="max-w-3xl bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
              <h3 className="text-base font-extrabold text-slate-800 pb-4 border-b border-slate-50">Hero Section Content Editor</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Badge Text</label>
                  <input 
                    type="text" 
                    value={currentSectionContent.heroBadgeText || ''}
                    onChange={(e) => handleContentChange('heroBadgeText', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#004D40]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Headline First Words</label>
                    <input 
                      type="text" 
                      value={currentSectionContent.heroHeadline || ''}
                      onChange={(e) => handleContentChange('heroHeadline', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#004D40]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Highlighted Suffix</label>
                    <input 
                      type="text" 
                      value={currentSectionContent.heroHighlightedWord || ''}
                      onChange={(e) => handleContentChange('heroHighlightedWord', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#004D40]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sub-paragraph Explanation</label>
                  <textarea 
                    rows={4}
                    value={currentSectionContent.heroSubtitle || ''}
                    onChange={(e) => handleContentChange('heroSubtitle', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#004D40] leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CTA Action Button</label>
                    <input 
                      type="text" 
                      value={currentSectionContent.heroCtaText || ''}
                      onChange={(e) => handleContentChange('heroCtaText', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#004D40]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Floating Badge Title</label>
                    <input 
                      type="text" 
                      value={currentSectionContent.heroFloatingCard1Title || ''}
                      onChange={(e) => handleContentChange('heroFloatingCard1Title', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#004D40]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Floating Card growth %</label>
                    <input 
                      type="text" 
                      value={currentSectionContent.heroFloatingCard2Value || ''}
                      onChange={(e) => handleContentChange('heroFloatingCard2Value', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#004D40]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-[#004D40] uppercase tracking-wider">Hero Section Dynamic Images</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminImageBlock
                    label="Hero Desktop Portrait"
                    description="Professional photo of Nisa Idrisi (Cloudinary or CDN URL)"
                    value={draftData.images?.hero?.mainImage || ''}
                    onChange={(val) => handleImageChange('hero', 'mainImage', val)}
                  />
                  <AdminImageBlock
                    label="Hero Background Overlay"
                    description="Wallpaper/backdrop image URL"
                    value={draftData.images?.hero?.backgroundImage || ''}
                    onChange={(val) => handleImageChange('hero', 'backgroundImage', val)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ABOUT SECTION EDITOR */}
          {activeTab === 'about' && (
            <div className="max-w-3xl bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
              <h3 className="text-base font-extrabold text-slate-800 pb-4 border-b border-slate-50">About Section Biography & Desk Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Executive Biography Statement</label>
                  <textarea 
                    rows={4}
                    value={currentSectionContent.aboutBiography || ''}
                    onChange={(e) => handleContentChange('aboutBiography', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#004D40] leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Years of Experience Highlight</label>
                    <input 
                      type="text" 
                      value={currentSectionContent.aboutExperienceYears || ''}
                      onChange={(e) => handleContentChange('aboutExperienceYears', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#004D40]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Managed Assets Label</label>
                    <input 
                      type="text" 
                      value={currentSectionContent.aboutAssetsLabel || ''}
                      onChange={(e) => handleContentChange('aboutAssetsLabel', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#004D40]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Qualifications Checklist</label>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    {currentSectionContent.aboutQualifications.map((qual, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={qual}
                          onChange={(e) => {
                            const clone = [...currentSectionContent.aboutQualifications];
                            clone[idx] = e.target.value;
                            const updatedContent = { ...currentSectionContent, aboutQualifications: clone };
                            setCurrentSectionContent(updatedContent);
                            saveDraft({ content: updatedContent });
                          }}
                          className="flex-1 px-4 py-2 bg-white text-xs font-medium text-slate-705 border border-slate-200 rounded-lg focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Major Accomplishments Check</label>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    {currentSectionContent.aboutAchievements.map((ach, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={ach}
                          onChange={(e) => {
                            const clone = [...currentSectionContent.aboutAchievements];
                            clone[idx] = e.target.value;
                            const updatedContent = { ...currentSectionContent, aboutAchievements: clone };
                            setCurrentSectionContent(updatedContent);
                            saveDraft({ content: updatedContent });
                          }}
                          className="flex-1 px-4 py-2 bg-white text-xs font-medium text-slate-705 border border-slate-200 rounded-lg focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-[#004D40] uppercase tracking-wider">About Section Dynamic Image</h4>
                <AdminImageBlock
                  label="Biography Executive Image"
                  description="Main portrait of Nisa Idrisi next to the biography text (Cloudinary or CDN URL)"
                  value={draftData.images?.about?.image || ''}
                  onChange={(val) => handleImageChange('about', 'image', val)}
                />
              </div>
            </div>
          )}

          {/* SERVICES MANAGEMENT */}
          {activeTab === 'services' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                  <h3 className="text-base font-extrabold text-[#004D40]">Sovereign Consulting Services</h3>
                  <p className="text-xs text-slate-400">Total {draftData.services.length} items configured.</p>
                </div>
                <button 
                  onClick={() => {
                    const id = `service-${Date.now()}`;
                    const newService: Service = {
                      id,
                      title: 'New Executive Service',
                      description: 'High-fidelity financial service outline',
                      icon: 'Sliders',
                      features: ['Structural evaluation audit', 'Comprehensive compliance checking']
                    };
                    saveDraft(prev => ({
                      ...prev,
                      services: [...prev.services, newService]
                    }));
                    showToast('Successfully drafted a new consulting service card.');
                  }}
                  className="py-2.5 px-4 bg-[#004D40] hover:bg-[#00382E] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-[#004D40]/10"
                >
                  <Plus size={14} />
                  <span>Create Service</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {draftData.services.map((serv, index) => (
                  <div key={serv.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative group">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          const filterServices = draftData.services.filter(s => s.id !== serv.id);
                          saveDraft({ services: filterServices });
                          showToast('Deleted service outline card.');
                        }}
                        className="p-1 px-2.5 hover:bg-rose-50 border border-slate-100 rounded-lg text-rose-500 hover:border-rose-100 transition-all text-xs flex items-center gap-1 cursor-pointer"
                        title="Remove service permanently"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          const toggled = draftData.services.map(s => s.id === serv.id ? { ...s, isFeatured: !s.isFeatured } : s);
                          saveDraft({ services: toggled });
                          showToast(serv.isFeatured ? 'Card features status deselected' : 'FCCA Emerald highlighted card structure applied!');
                        }}
                        className={`p-1 px-2.5 border rounded-lg text-xs flex items-center gap-1 cursor-pointer select-none ${serv.isFeatured ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}
                      >
                        Featured
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Title</label>
                        <input 
                          type="text" 
                          value={serv.title}
                          onChange={(e) => {
                            const mapped = draftData.services.map(s => s.id === serv.id ? { ...s, title: e.target.value } : s);
                            saveDraft({ services: mapped });
                          }}
                          className="w-full px-3 py-2 text-sm font-bold text-slate-805 bg-slate-50 border border-slate-100 focus:border-emerald-accent rounded-xl focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Description</label>
                        <textarea 
                          rows={2}
                          value={serv.description}
                          onChange={(e) => {
                            const mapped = draftData.services.map(s => s.id === serv.id ? { ...s, description: e.target.value } : s);
                            saveDraft({ services: mapped });
                          }}
                          className="w-full px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 focus:border-emerald-accent rounded-xl focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Sub-Bullet Lines</label>
                        <textarea 
                          rows={2}
                          value={serv.features.join(', ')}
                          onChange={(e) => {
                            const arr = e.target.value.split(',').map(item => item.trim());
                            const mapped = draftData.services.map(s => s.id === serv.id ? { ...s, features: arr } : s);
                            saveDraft({ services: mapped });
                          }}
                          className="w-full px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 focus:border-emerald-accent rounded-xl focus:outline-none"
                        />
                        <span className="text-[9px] text-slate-400 font-medium">Separate guidelines using commas</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-[#004D40] uppercase tracking-wider">Expertise Section Dynamic Image</h4>
                <AdminImageBlock
                  label="Expertise Display Chart"
                  description="Illustration or graph showing compliance ratings/expertise outcomes (Cloudinary or CDN URL)"
                  value={draftData.images?.expertise?.image || ''}
                  onChange={(val) => handleImageChange('expertise', 'image', val)}
                />
              </div>
            </div>
          )}

          {/* WHY CHOOSE ME SECTION WORKSPACE */}
          {activeTab === 'why' && (
            <div className="max-w-2xl bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
              <h3 className="text-base font-extrabold text-slate-800 pb-4 border-b border-slate-50">Why Choose Me Content Properties</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Section Header Title</label>
                  <input 
                    type="text" 
                    value={currentSectionContent.whyChooseMeTitle || ''}
                    onChange={(e) => handleContentChange('whyChooseMeTitle', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Section Subtext</label>
                  <textarea 
                    value={currentSectionContent.whyChooseMeSubtitle || ''}
                    onChange={(e) => handleContentChange('whyChooseMeSubtitle', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* INDUSTRIES TAGS */}
          {activeTab === 'industries' && (
            <div className="max-w-3xl bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">Dynamic Industries Strip</h3>
                  <p className="text-xs text-slate-400">Add or manage capsule components shown on the landing ribbons.</p>
                </div>
                <button
                  onClick={() => {
                    const id = `industry-${Date.now()}`;
                    const newIndustry: Industry = { id, name: 'Private Equity', icon: 'Coins' };
                    saveDraft({ industries: [...draftData.industries, newIndustry] });
                    showToast('Add new trade market capsule');
                  }}
                  className="py-2 px-4 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Industry</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                {draftData.industries.map(ind => (
                  <div key={ind.id} className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 flex items-center gap-2">
                    <input 
                      type="text" 
                      value={ind.name}
                      onChange={(e) => {
                        const mapped = draftData.industries.map(i => i.id === ind.id ? { ...i, name: e.target.value } : i);
                        saveDraft({ industries: mapped });
                      }}
                      className="bg-transparent font-bold focus:outline-none w-28 text-slate-800"
                    />
                    <button 
                      onClick={() => {
                        saveDraft({ industries: draftData.industries.filter(i => i.id !== ind.id) });
                        showToast('Industry capsule deleted');
                      }}
                      className="text-rose-500 hover:text-rose-700 cursor-pointer text-xs font-bold font-mono ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TESTIMONIALS PANEL */}
          {activeTab === 'testimonials' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Client Reviews & Testimonials desk</h3>
                  <p className="text-xs text-slate-400">Add reviews validating RCi auditing outcomes.</p>
                </div>
                
                <button
                  onClick={() => {
                    const id = `${Date.now()}`;
                    const items: Testimonial = {
                      id,
                      name: 'Client Executive',
                      role: 'Director',
                      company: 'Venture Enterprises',
                      quote: 'Phenomenal strategic financial execution.',
                      rating: 5,
                      avatarSeed: 'Executive'
                    };
                    saveDraft({ testimonials: [...draftData.testimonials, items] });
                    showToast('Created new testimonials draft template');
                  }}
                  className="py-2.5 px-4 bg-[#004D40] text-white hover:bg-[#00382E] text-xs font-bold uppercase rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#004D40]/10"
                >
                  <Plus size={14} />
                  <span>Add Testimonial</span>
                </button>
              </div>

              <div className="space-y-4">
                {draftData.testimonials.map(test => (
                  <div key={test.id} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm grid grid-cols-3 gap-6 relative group">
                    <button 
                      onClick={() => {
                        saveDraft({ testimonials: draftData.testimonials.filter(t => t.id !== test.id) });
                        showToast('Removed testimonial card.');
                      }}
                      className="absolute top-4 right-4 p-1 px-2 bg-rose-50 text-rose-500 border border-rose-100 text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      Remove
                    </button>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Author Name</label>
                        <input 
                          type="text" 
                          value={test.name}
                          onChange={(e) => {
                            const mapped = draftData.testimonials.map(t => t.id === test.id ? { ...t, name: e.target.value } : t);
                            saveDraft({ testimonials: mapped });
                          }}
                          className="w-full px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-100 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Company / Designation</label>
                        <input 
                          type="text" 
                          value={test.company}
                          onChange={(e) => {
                            const mapped = draftData.testimonials.map(t => t.id === test.id ? { ...t, company: e.target.value } : t);
                            saveDraft({ testimonials: mapped });
                          }}
                          className="w-full px-3 py-2 text-xs font-bold text-slate-850 bg-slate-50 border border-slate-100 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Verbatim Quote Content</label>
                      <textarea 
                        rows={3}
                        value={test.quote}
                        onChange={(e) => {
                          const mapped = draftData.testimonials.map(t => t.id === test.id ? { ...t, quote: e.target.value } : t);
                          saveDraft({ testimonials: mapped });
                        }}
                        className="w-full px-4 py-2.5 text-xs font-semibold text-slate-705 bg-slate-50 border border-slate-100 rounded-xl leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-[#004D40] uppercase tracking-wider">Testimonials Section Dynamic Image</h4>
                <AdminImageBlock
                  label="Trust / Clients Illustration Image"
                  description="Secondary background portrait or branding graphic in reviews section (Cloudinary or CDN URL)"
                  value={draftData.images?.testimonials?.image || ''}
                  onChange={(val) => handleImageChange('testimonials', 'image', val)}
                />
              </div>
            </div>
          )}

          {/* FAQ SECTION */}
          {activeTab === 'faq' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-white p-6 border border-slate-105 rounded-3xl shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Audit & Tax FAQ Accordion panel</h3>
                  <p className="text-xs text-slate-400">Control core advisory information panels displayed on home page.</p>
                </div>
                <button
                  onClick={() => {
                    const id = `faq-${Date.now()}`;
                    const item: FAQItem = {
                      id,
                      category: 'Taxation',
                      question: 'New Strategic compliance query',
                      answer: 'Describe correct guidelines response metrics here.'
                    };
                    saveDraft({ faqs: [...draftData.faqs, item] });
                    showToast('Created FAQ component in draft list.');
                  }}
                  className="py-2 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-4">
                {draftData.faqs.map(item => (
                  <div key={item.id} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4 transition-all hover:border-[#10B981]/50 relative group">
                    <button 
                      onClick={() => {
                        saveDraft({ faqs: draftData.faqs.filter(f => f.id !== item.id) });
                        showToast('FAQ item deleted.');
                      }}
                      className="absolute top-4 right-4 p-1 px-2 text-rose-500 bg-rose-50 text-[9px] font-bold rounded-lg opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      Delete
                    </button>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="block text-[8px] uppercase font-bold text-slate-400 mb-1">Question Headline</label>
                        <input 
                          type="text" 
                          value={item.question}
                          onChange={(e) => {
                            const mapped = draftData.faqs.map(f => f.id === item.id ? { ...f, question: e.target.value } : f);
                            saveDraft({ faqs: mapped });
                          }}
                          className="w-full px-3 py-2 text-xs font-extrabold text-slate-800 bg-slate-50 border border-slate-100 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase font-bold text-slate-400 mb-1">Tax/Service Category</label>
                        <input 
                          type="text" 
                          value={item.category}
                          onChange={(e) => {
                            const mapped = draftData.faqs.map(f => f.id === item.id ? { ...f, category: e.target.value } : f);
                            saveDraft({ faqs: mapped });
                          }}
                          className="w-full px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] uppercase font-bold text-slate-400 mb-1">Advisory Response Body</label>
                      <textarea 
                        rows={2}
                        value={item.answer}
                        onChange={(e) => {
                          const mapped = draftData.faqs.map(f => f.id === item.id ? { ...f, answer: e.target.value } : f);
                          saveDraft({ faqs: mapped });
                        }}
                        className="w-full px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA BANNER SETTINGS */}
          {activeTab === 'cta' && (
            <div className="max-w-2xl bg-white border border-slate-105 rounded-3xl p-8 shadow-sm space-y-6">
              <h3 className="text-base font-extrabold text-slate-800 pb-4 border-b border-slate-50">Conversion CTA Banner Editor</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Main Conversion Slogan</label>
                  <input 
                    type="text" 
                    value={currentSectionContent.ctaHeading || ''}
                    onChange={(e) => handleContentChange('ctaHeading', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#004D40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sub-slogan details</label>
                  <textarea 
                    value={currentSectionContent.ctaSubtext || ''}
                    onChange={(e) => handleContentChange('ctaSubtext', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CTA Submit Button Text</label>
                  <input 
                    type="text" 
                    value={currentSectionContent.ctaButtonText || ''}
                    onChange={(e) => handleContentChange('ctaButtonText', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-[#004D40] uppercase tracking-wider">Footer Section Dynamic Image</h4>
                <AdminImageBlock
                  label="Footer Office Backdrop"
                  description="Branded skyline, document checklist, or corporate graphic shown in website footer structure (Cloudinary or CDN URL)"
                  value={draftData.images?.footer?.image || ''}
                  onChange={(val) => handleImageChange('footer', 'image', val)}
                />
              </div>
            </div>
          )}

          {/* BLOG CMS PANEL */}
          {activeTab === 'blog' && (
            <div className="max-w-5xl space-y-6">
              {selectedBlogId === null ? (
                <>
                  <div className="bg-white p-6 border border-slate-105 rounded-3xl shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-[#004D40]">Strategic Insights Blog CMS</h3>
                      <p className="text-xs text-slate-400">Current Articles Count: {draftData.blogs.length}</p>
                    </div>
                    
                    <button 
                      onClick={() => handleSelectBlog('new')}
                      className="py-2.5 px-4 bg-[#004D40] text-white text-xs font-bold uppercase rounded-xl cursor-pointer flex items-center gap-1 w-fit shadow-md"
                    >
                      <Plus size={14} />
                      <span>Draft New Article</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {draftData.blogs.map(post => (
                      <div key={post.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm relative group flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-widest font-extrabold ${post.status === 'published' ? 'bg-[#10B981]/15 text-emerald-accent-dark' : 'bg-amber-100 text-amber-700'}`}>
                              {post.status}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono font-bold">Views: {post.views}</span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-805 leading-relaxed">{post.title}</h4>
                          <p className="text-xs text-slate-400 leading-snug">{post.excerpt}</p>
                          <div className="text-[9px] text-slate-400 font-bold tracking-wider font-mono">SLUG: {post.slug}</div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-50 mt-4">
                          <span className="text-[10px] text-slate-400 font-bold italic">{post.author}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                deleteBlogPost(post.id);
                                showToast('Blog article deleted.');
                              }}
                              className="p-1 px-2 hover:bg-rose-50 border border-slate-100 rounded text-rose-500 font-bold text-[10px]"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleSelectBlog(post.id)}
                              className="p-1 px-3 bg-[#004D40]/10 hover:bg-[#004D40] hover:text-white text-[#004D40] font-bold text-[10px] rounded"
                            >
                              Edit Core
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-sidebar-100">
                    <button 
                      onClick={() => setSelectedBlogId(null)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft size={12} />
                      Back to blog list
                    </button>
                    <h3 className="text-base font-extrabold text-[#004D40]">Edit Insight Manuscript</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Article Title</label>
                        <input 
                          type="text" 
                          value={blogEditForm.title || ''}
                          onChange={(e) => setBlogEditForm({ ...blogEditForm, title: e.target.value })}
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Short Excerpt Summary (SMEs focus)</label>
                        <textarea 
                          rows={3}
                          value={blogEditForm.excerpt || ''}
                          onChange={(e) => setBlogEditForm({ ...blogEditForm, excerpt: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Article Category</label>
                          <input 
                            type="text" 
                            value={blogEditForm.category || ''}
                            onChange={(e) => setBlogEditForm({ ...blogEditForm, category: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 id-input rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                          <select
                            value={blogEditForm.status || 'draft'}
                            onChange={(e) => setBlogEditForm({ ...blogEditForm, status: e.target.value as 'published' | 'draft' })}
                            className="w-full p-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
                          >
                            <option value="draft">Saves Draft</option>
                            <option value="published">Push Live</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Featured Image CDN link</label>
                        <input 
                          type="text" 
                          value={blogEditForm.featuredImage || ''}
                          onChange={(e) => setBlogEditForm({ ...blogEditForm, featuredImage: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Manuscript Markdown Editor</label>
                      <textarea 
                        rows={12}
                        value={blogEditForm.content || ''}
                        onChange={(e) => setBlogEditForm({ ...blogEditForm, content: e.target.value })}
                        className="w-full px-4 py-3 font-mono text-xs bg-slate-900 text-slate-200 rounded-2xl leading-relaxed focus:outline-none"
                        placeholder="# Title..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => setSelectedBlogId(null)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-705 text-xs font-bold uppercase rounded-xl cursor-pointer"
                    >
                      Discard Edits
                    </button>
                    <button 
                      onClick={saveBlogItem}
                      className="px-6 py-2.5 bg-[#10B981] hover:bg-emerald-accent-dark text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Save Article
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PORTFOLIO MANAGEMENT */}
          {activeTab === 'portfolio' && (
            <div className="max-w-5xl space-y-6">
              {selectedProjectId === null ? (
                <>
                  <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-[#004D40]">Sovereign Case Studies portfolio</h3>
                      <p className="text-xs text-slate-400">Total Portfolio items: {draftData.portfolio.length}</p>
                    </div>
                    
                    <button 
                      onClick={() => handleSelectProject('new')}
                      className="py-2.5 px-4 bg-[#004D40] text-white text-xs font-bold uppercase rounded-xl cursor-pointer flex items-center gap-1 shadow-md shadow-[#004D40]/10"
                    >
                      <Plus size={14} />
                      <span>Create Case Study</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {draftData.portfolio.map(proj => (
                      <div key={proj.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm relative group flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">{proj.category}</span>
                            <span className="text-[10px] font-mono text-slate-400 font-bold">Client: {proj.client}</span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-805 leading-relaxed">{proj.title}</h4>
                          <p className="text-xs text-slate-400 leading-snug">{proj.description}</p>
                          
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{proj.metricLabel}</span>
                            <span className="text-base font-extrabold text-[#004D40]">{proj.metric}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-50 mt-4">
                          <span className="px-2 py-0.5 rounded text-[8px] uppercase tracking-widest font-extrabold bg-[#10B981]/15 text-emerald-accent-dark">
                            {proj.status}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                deleteProject(proj.id);
                                showToast('Case study post deleted.');
                              }}
                              className="p-1 px-2 hover:bg-rose-50 text-rose-500 font-bold text-[10px] rounded"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleSelectProject(proj.id)}
                              className="p-1 px-3 bg-[#004D40]/10 hover:bg-[#004D40] hover:text-white text-[#004D40] font-bold text-[10px] rounded"
                            >
                              Edit details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <button 
                      onClick={() => setSelectedProjectId(null)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft size={12} />
                      Back to project list
                    </button>
                    <h3 className="text-base font-extrabold text-[#004D40]">Edit Portfolio Case Study</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Project/Study Title</label>
                        <input 
                          type="text" 
                          value={projectEditForm.title || ''}
                          onChange={(e) => setProjectEditForm({ ...projectEditForm, title: e.target.value })}
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Client Brand</label>
                          <input 
                            type="text" 
                            value={projectEditForm.client || ''}
                            onChange={(e) => setProjectEditForm({ ...projectEditForm, client: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Industry Sector</label>
                          <input 
                            type="text" 
                            value={projectEditForm.category || ''}
                            onChange={(e) => setProjectEditForm({ ...projectEditForm, category: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Main Saved Metric (e.g., £150K)</label>
                          <input 
                            type="text" 
                            value={projectEditForm.metric || ''}
                            onChange={(e) => setProjectEditForm({ ...projectEditForm, metric: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Metric Label</label>
                          <input 
                            type="text" 
                            value={projectEditForm.metricLabel || ''}
                            onChange={(e) => setProjectEditForm({ ...projectEditForm, metricLabel: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Brief Case Study Description</label>
                        <textarea 
                          rows={4}
                          value={projectEditForm.description || ''}
                          onChange={(e) => setProjectEditForm({ ...projectEditForm, description: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Featured Image CDN</label>
                          <input 
                            type="text" 
                            value={projectEditForm.image || ''}
                            onChange={(e) => setProjectEditForm({ ...projectEditForm, image: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                          <select
                            value={projectEditForm.status || 'draft'}
                            onChange={(e) => setProjectEditForm({ ...projectEditForm, status: e.target.value as 'published' | 'draft' })}
                            className="w-full p-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
                          >
                            <option value="draft">Saves Draft</option>
                            <option value="published">Push Live</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => setSelectedProjectId(null)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-705 text-xs font-bold uppercase rounded-xl cursor-pointer"
                    >
                      Discard Edits
                    </button>
                    <button 
                      onClick={saveProjectItem}
                      className="px-6 py-2.5 bg-[#10B981] hover:bg-emerald-accent-dark text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Save Case Study
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SEO SETTINGS */}
          {activeTab === 'seo' && (
            <div className="max-w-5xl space-y-6">
              {/* Tabs selector */}
              <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl gap-1">
                <button
                  onClick={() => setSelectedSeoTab('global')}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all ${selectedSeoTab === 'global' ? 'bg-[#004D40] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Global Index (Google)
                </button>
                <button
                  onClick={() => setSelectedSeoTab('og')}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all ${selectedSeoTab === 'og' ? 'bg-[#004D40] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  OpenGraph (WhatsApp)
                </button>
                <button
                  onClick={() => setSelectedSeoTab('twitter')}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all ${selectedSeoTab === 'twitter' ? 'bg-[#004D40] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Twitter / X Preview
                </button>
                <button
                  onClick={() => setSelectedSeoTab('linkedin')}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all ${selectedSeoTab === 'linkedin' ? 'bg-[#004D40] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  LinkedIn Post Card
                </button>
                <button
                  onClick={() => setSelectedSeoTab('facebook')}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all ${selectedSeoTab === 'facebook' ? 'bg-[#004D40] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Facebook Feed Card
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inputs Column */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                  {selectedSeoTab === 'global' && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-[#004D40] font-sans border-b border-slate-50 pb-2">Global Meta Tags</h3>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meta Title</label>
                        <input 
                          type="text" 
                          value={currentSeo.metaTitle || ''}
                          onChange={(e) => handleSEOChange('metaTitle', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meta Description</label>
                        <textarea 
                          rows={3}
                          value={currentSeo.metaDescription || ''}
                          onChange={(e) => handleSEOChange('metaDescription', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Canonical Link URL</label>
                        <input 
                          type="text" 
                          value={currentSeo.canonicalUrl || ''}
                          onChange={(e) => handleSEOChange('canonicalUrl', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none font-mono text-emerald-accent-dark font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Focus Keywords (Comma Separated)</label>
                        <input 
                          type="text" 
                          value={currentSeo.keywords || ''}
                          onChange={(e) => handleSEOChange('keywords', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                          placeholder="wealth tax advisor, chartered accountant, HMRC compliance"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Search Bots Directives (Robots)</label>
                        <select 
                          value={currentSeo.robots || 'index, follow'}
                          onChange={(e) => handleSEOChange('robots', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                        >
                          <option value="index, follow">index, follow (Default Global Indexing)</option>
                          <option value="noindex, nofollow">noindex, nofollow (Private Sandbox Mode)</option>
                          <option value="index, nofollow">index, nofollow (Index main only, skip child links)</option>
                          <option value="noindex, follow">noindex, follow (Do not display on lists, but follow index backlinks)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedSeoTab === 'og' && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-[#004D40] font-sans border-b border-slate-50 pb-2">OpenGraph Metadata Tag Settings</h3>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Social Preview Title</label>
                        <input 
                          type="text" 
                          value={currentSeo.openGraph?.title || ''}
                          onChange={(e) => handleNestedSEOChange('openGraph', 'title', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Social Description</label>
                        <textarea 
                          rows={3}
                          value={currentSeo.openGraph?.description || ''}
                          onChange={(e) => handleNestedSEOChange('openGraph', 'description', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:outline-none"
                        />
                      </div>
                      <AdminImageBlock
                        label="OpenGraph Preview Image URL"
                        description="Custom high-contrast portrait or business card brand thumbnail URL for shared previews"
                        value={currentSeo.openGraph?.image || ''}
                        onChange={(val) => handleNestedSEOChange('openGraph', 'image', val)}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase text-slate-400 font-extrabold mb-1">OG Type</label>
                          <input 
                            type="text" 
                            value={currentSeo.openGraph?.type || 'website'}
                            onChange={(e) => handleNestedSEOChange('openGraph', 'type', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-slate-400 font-extrabold mb-1">OG Share URL</label>
                          <input 
                            type="text" 
                            value={currentSeo.openGraph?.url || ''}
                            onChange={(e) => handleNestedSEOChange('openGraph', 'url', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedSeoTab === 'twitter' && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-[#004D40] font-sans border-b border-slate-50 pb-2">Twitter / X Card Meta Tags</h3>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Card Type Representation</label>
                        <select 
                          value={currentSeo.twitterCard?.cardType || 'summary_large_image'}
                          onChange={(e) => handleNestedSEOChange('twitterCard', 'cardType', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                        >
                          <option value="summary_large_image">Summary with Large Cover Image</option>
                          <option value="summary">Standard In-Feed Square Summary Card</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Card Title Header</label>
                        <input 
                          type="text" 
                          value={currentSeo.twitterCard?.title || ''}
                          onChange={(e) => handleNestedSEOChange('twitterCard', 'title', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Card Description Meta Text</label>
                        <textarea 
                          rows={3}
                          value={currentSeo.twitterCard?.description || ''}
                          onChange={(e) => handleNestedSEOChange('twitterCard', 'description', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:outline-none"
                        />
                      </div>
                      <AdminImageBlock
                        label="Twitter In-Card Graphic URL"
                        description="Custom card graphic thumbnail URL"
                        value={currentSeo.twitterCard?.image || ''}
                        onChange={(val) => handleNestedSEOChange('twitterCard', 'image', val)}
                      />
                    </div>
                  )}

                  {selectedSeoTab === 'linkedin' && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-[#004D40] font-sans border-b border-slate-50 pb-2">LinkedIn Post Card Snippets</h3>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">LinkedIn Post Title</label>
                        <input 
                          type="text" 
                          value={currentSeo.linkedin?.title || ''}
                          onChange={(e) => handleNestedSEOChange('linkedin', 'title', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Post Snippet Description</label>
                        <textarea 
                          rows={3}
                          value={currentSeo.linkedin?.description || ''}
                          onChange={(e) => handleNestedSEOChange('linkedin', 'description', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:outline-none"
                        />
                      </div>
                      <AdminImageBlock
                        label="LinkedIn Cover Image URL"
                        description="Shared landscape graphic design URL optimized for LinkedIn professional feed formats"
                        value={currentSeo.linkedin?.image || ''}
                        onChange={(val) => handleNestedSEOChange('linkedin', 'image', val)}
                      />
                    </div>
                  )}

                  {selectedSeoTab === 'facebook' && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-[#004D40] font-sans border-b border-slate-50 pb-2">Facebook Shared Feed Previews</h3>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Facebook Post Title</label>
                        <input 
                          type="text" 
                          value={currentSeo.facebook?.title || ''}
                          onChange={(e) => handleNestedSEOChange('facebook', 'title', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Facebook Subtitle Snippet</label>
                        <textarea 
                          rows={3}
                          value={currentSeo.facebook?.description || ''}
                          onChange={(e) => handleNestedSEOChange('facebook', 'description', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:outline-none"
                        />
                      </div>
                      <AdminImageBlock
                        label="Facebook Shared Image Cover"
                        description="Shared imagery landscape wallpaper URL optimized for Facebook timelines"
                        value={currentSeo.facebook?.image || ''}
                        onChange={(val) => handleNestedSEOChange('facebook', 'image', val)}
                      />
                    </div>
                  )}
                </div>

                {/* Previews / Live-Demo Column */}
                <div className="space-y-6">
                  {/* Global (Google) Preview */}
                  {selectedSeoTab === 'global' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Google SERP Preview (Desktop)</h4>
                      <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 text-left text-xs font-sans">
                        <div className="text-slate-500 text-[10px] truncate">{currentSeo.canonicalUrl || 'https://nisaidrisi-consulting.co.uk'}</div>
                        <a className="text-[#1a0dab] hover:underline text-base font-medium leading-tight block truncate">
                          {currentSeo.metaTitle || 'Nisa Idrisi | Executive Strategic Accountant'}
                        </a>
                        <p className="text-[#4d5156] leading-relaxed text-[11px] line-clamp-2">
                          {currentSeo.metaDescription || 'Chartered accountant advisory, offering precision compliance calculation logs and global executive portfolio expansion strategies.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* WhatsApp/Slack OpenGraph Preview */}
                  {selectedSeoTab === 'og' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">OpenGraph Live Feed Preview</h4>
                      <div className="border border-l-4 border-l-[#10B981] border-slate-200 bg-slate-50 rounded-xl overflow-hidden flex flex-col">
                        {currentSeo.openGraph?.image && (
                          <div className="aspect-video bg-slate-205 relative overflow-hidden">
                            <img src={currentSeo.openGraph.image} alt="OG Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                        <div className="p-4 space-y-1 text-left text-xs">
                          <p className="font-mono text-[9px] uppercase text-slate-400">{currentSeo.openGraph?.type || 'website'}</p>
                          <h5 className="font-bold text-slate-800 text-sm line-clamp-1">{currentSeo.openGraph?.title || currentSeo.metaTitle || 'Nisa Idrisi Consulting'}</h5>
                          <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">{currentSeo.openGraph?.description || currentSeo.metaDescription}</p>
                          <p className="text-slate-400 text-[9px] font-mono">{currentSeo.openGraph?.url || currentSeo.canonicalUrl || 'nisaidrisi-consulting.co.uk'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Twitter Preview */}
                  {selectedSeoTab === 'twitter' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Twitter / X Card Preview</h4>
                      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white text-left text-xs">
                        {currentSeo.twitterCard?.image && currentSeo.twitterCard?.cardType !== 'summary' ? (
                          <div className="aspect-video bg-slate-200 relative overflow-hidden">
                            <img src={currentSeo.twitterCard.image} alt="Twitter Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ) : null}
                        
                        <div className="p-3 flex items-start gap-3">
                          {currentSeo.twitterCard?.image && currentSeo.twitterCard?.cardType === 'summary' && (
                            <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                              <img src={currentSeo.twitterCard.image} alt="Twitter Square" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          )}
                          <div className="space-y-1">
                            <p className="text-[10px] text-slate-400 font-mono">nisaidrisi-consulting.co.uk</p>
                            <h5 className="font-bold text-slate-900 text-[13px] leading-snug line-clamp-1">{currentSeo.twitterCard?.title || currentSeo.metaTitle || 'Nisa Idrisi Strategic Finance'}</h5>
                            <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">{currentSeo.twitterCard?.description || currentSeo.metaDescription}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LinkedIn Preview */}
                  {selectedSeoTab === 'linkedin' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">LinkedIn In-Feed Card Preview</h4>
                      <div className="border border-slate-200 rounded bg-white text-left text-xs">
                        <div className="p-3 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#004D40] text-white flex items-center justify-center font-extrabold text-[10px]">NI</div>
                          <div>
                            <p className="font-bold text-slate-800 text-[11px]">Nisa Idrisi</p>
                            <p className="text-slate-400 text-[9px]">Strategic Financial Executive | Chartered Accountant</p>
                          </div>
                        </div>
                        {currentSeo.linkedin?.image && (
                          <div className="aspect-video bg-slate-150 relative overflow-hidden">
                            <img src={currentSeo.linkedin.image} alt="LinkedIn landscape" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                        <div className="p-3.5 bg-slate-100 border-t border-slate-150 space-y-1">
                          <h5 className="font-bold text-slate-800 text-xs truncate">{currentSeo.linkedin?.title || currentSeo.metaTitle}</h5>
                          <p className="text-slate-500 text-[10px] truncate">{currentSeo.linkedin?.description || currentSeo.metaDescription}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Facebook Preview */}
                  {selectedSeoTab === 'facebook' && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Facebook Feed Snippet Preview</h4>
                      <div className="border border-slate-200 rounded-lg bg-white text-left text-xs shadow-sm">
                        <div className="p-3 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-[10px]">N</div>
                          <div>
                            <p className="font-bold text-slate-805 text-[11px]">Nisa Idrisi Executive Consulting</p>
                            <p className="text-slate-400 text-[8px] font-mono">Sponsored · 🌐</p>
                          </div>
                        </div>
                        {currentSeo.facebook?.image && (
                          <div className="aspect-video bg-slate-200 relative overflow-hidden">
                            <img src={currentSeo.facebook.image} alt="Facebook timeline cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                        <div className="p-3.5 bg-slate-50 border-t border-slate-150 space-y-1">
                          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wide">NISAIDRISI-CONSULTING.CO.UK</p>
                          <h5 className="font-bold text-slate-800 text-xs truncate">{currentSeo.facebook?.title || currentSeo.metaTitle}</h5>
                          <p className="text-slate-550 text-[10.5px] line-clamp-1">{currentSeo.facebook?.description || currentSeo.metaDescription}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Universal tips card */}
                  <div className="bg-[#004D40]/5 rounded-3xl p-6 border border-[#10B981]/15 space-y-2 text-left">
                    <h5 className="text-[11px] font-bold text-[#004D40] uppercase tracking-widest flex items-center gap-1.5 pl-1 font-serif">
                      <Sparkles size={11} className="text-[#10B981]" /> Enterprise Schema Ready
                    </h5>
                    <p className="text-[10px] text-slate-600 leading-relaxed">
                      Changes made across these tabs will automatically populate the local OpenGraph meta header cards, standard search indices, and structural Schema.org JSON-LD elements layout in live production builds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEADS DESK */}
          {activeTab === 'leads' && (
            <div className="max-w-5xl space-y-6">
              <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#004D40]">Contact & Consultation Leads Desk</h3>
                  <p className="text-xs text-slate-400">Manage real-time inbound booking queries and CSV summaries.</p>
                </div>
                
                <button 
                  onClick={exportLeadsCSV}
                  className="py-2.5 px-4 border border-slate-250 hover:bg-slate-50 text-[11px] font-bold uppercase rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Export leads CSV</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Submitted Enquiries</span>
                    <div className="flex gap-2">
                      {['all', 'pending', 'confirmed'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setLeadFilter(f as any)}
                          className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg border cursor-pointer ${leadFilter === f ? 'bg-[#004D40] text-white border-[#004D40]' : 'bg-white text-slate-505 border-slate-200'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {draftData.leads
                      .filter(l => leadFilter === 'all' || l.status === leadFilter)
                      .map(lead => (
                        <div 
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className={`p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedLead?.id === lead.id ? 'bg-emerald-accent/5' : ''}`}
                        >
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-slate-800">{lead.name}</h5>
                            <p className="text-[11px] text-slate-400 font-medium">{lead.company} · <span className="font-semibold text-[#004D40]">{lead.service}</span></p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-slate-450 font-bold">{lead.date} at {lead.time}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${lead.status === 'confirmed' ? 'bg-[#10B981]/15 text-emerald-accent-dark' : 'bg-amber-100 text-amber-700'}`}>
                              {lead.status}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Lead Detail Action Desk */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 h-fit">
                  {selectedLead ? (
                    <div className="space-y-4">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest pl-1">Lead Analysis Desk</h4>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-black text-slate-805 leading-tight">{selectedLead.name}</div>
                        <p className="text-xs text-[#004D40] font-bold truncate">{selectedLead.email}</p>
                        <p className="text-xs text-slate-505 font-medium">{selectedLead.company || 'Private Corporation'}</p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Notes / Request Statement</div>
                        <p className="text-xs font-semibold text-slate-650 leading-relaxed italic">
                          "{selectedLead.notes || 'No custom memo submitted.'}"
                        </p>
                      </div>

                      <div className="space-y-2">
                        <button 
                          onClick={() => {
                            updateLeadStatus(selectedLead.id, selectedLead.status === 'confirmed' ? 'pending' : 'confirmed');
                            setSelectedLead(prev => prev ? { ...prev, status: prev.status === 'confirmed' ? 'pending' : 'confirmed' } : null);
                            showToast(`Status modified successfully.`);
                          }}
                          className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selectedLead.status === 'confirmed' 
                              ? 'bg-amber-100 text-amber-750 hover:bg-amber-150' 
                              : 'bg-[#10B981] text-slate-900 hover:bg-[#34D399]'
                          }`}
                        >
                          {selectedLead.status === 'confirmed' ? 'Mark as Pending Review' : 'Mark as Secured Match'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-400 text-xs font-medium space-y-2">
                      <Calendar className="mx-auto" size={24} />
                      <p>Select a consultation invoice details column to view lead analysis.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* BRANDING SETTINGS PANEL */}
          {activeTab === 'branding' && (
            <div className="max-w-2xl bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
              <h3 className="text-base font-extrabold text-slate-800 pb-4 border-b border-slate-50">Global Identity & Branding Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Office Headquarters Address</label>
                  <input 
                    type="text" 
                    value={currentSettings.businessAddress || ''}
                    onChange={(e) => handleSettingsChange('businessAddress', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Advisory Email</label>
                    <input 
                      type="text" 
                      value={currentSettings.contactEmail || ''}
                      onChange={(e) => handleSettingsChange('contactEmail', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Office Hotline Phone</label>
                    <input 
                      type="text" 
                      value={currentSettings.contactPhone || ''}
                      onChange={(e) => handleSettingsChange('contactPhone', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">FCCA Sovereign Color</label>
                    <input 
                      type="color" 
                      value={currentSettings.brandPrimaryColor || '#004D40'}
                      onChange={(e) => handleSettingsChange('brandPrimaryColor', e.target.value)}
                      className="w-full h-10 p-1 rounded-xl cursor-pointer bg-slate-50 border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tactical Accent Color</label>
                    <input 
                      type="color" 
                      value={currentSettings.brandAccentColor || '#10B981'}
                      onChange={(e) => handleSettingsChange('brandAccentColor', e.target.value)}
                      className="w-full h-10 p-1 rounded-xl cursor-pointer bg-slate-50 border border-slate-200"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <button 
                      onClick={() => {
                        handleSettingsChange('brandPrimaryColor', '#004D40');
                        handleSettingsChange('brandAccentColor', '#10B981');
                        showToast('Reverted branding hex codes back to Sleek Interface standards.');
                      }}
                      className="py-2 px-3 hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl select-none"
                    >
                      Reset Colors
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN LOGS AUDIT TRAIL PANEL */}
          {activeTab === 'security' && (
            <div className="max-w-4xl space-y-6">
              <div className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#004D40]">Audit Trails & System Cache</h3>
                  <p className="text-xs text-slate-400">Review system login operations logs or hard reset settings.</p>
                </div>
                
                <button
                  onClick={triggerResetToTemplates}
                  className="py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold uppercase rounded-xl cursor-pointer flex items-center gap-1 shadow-md shadow-rose-500/20"
                >
                  <AlertTriangle size={13} />
                  <span>Absolute Site Reset</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono">System Activity Logging Console</span>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {logs.map(log => (
                    <div key={log.id} className="p-4 flex items-center justify-between text-xs font-mono font-bold hover:bg-slate-50/50">
                      <div className="space-y-1">
                        <div className="text-slate-800 flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-[#10B981]' : 'bg-rose-500'}`} />
                          {log.action}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium font-sans">{log.details}</div>
                      </div>

                      <div className="text-right text-[10px] text-slate-400">
                        <p>{log.ip}</p>
                        <p className="font-sans font-semibold text-[9px] mt-0.5">{new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* DYNAMIC WEBSITE DRAFT DRAWER LIVE PREVIEW (Interactive iframe representation) */}
      <AnimatePresence>
        {showDraftPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex flex-col p-4"
          >
            {/* Visual Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 select-none">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-yellow-450 text-[#004D40] text-[10px] uppercase tracking-widest font-extrabold rounded-full bg-yellow-400 animate-pulse">Draft Preview</span>
                <span className="text-xs text-white/50 font-bold font-mono">Simulating fully editable custom templates in live mode.</span>
              </div>
              
              <button 
                onClick={() => setShowDraftPreview(false)}
                className="py-2 px-5 bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Close Preview Screen
              </button>
            </div>

            {/* Sandbox Render Box Container */}
            <div className="flex-1 rounded-2xl bg-[#FDFEFE] text-slate-800 overflow-y-auto max-w-7xl mx-auto w-full p-8 border border-white/10 relative shadow-2xl">
              
              {/* Dynamic Header mockup */}
              <nav className="px-8 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#004D40] to-[#10B981] flex items-center justify-center font-bold text-white text-xs">NI</div>
                  <span className="text-sm font-black text-[#004D40]">{draftData.content.headerText || 'NISA IDRISI'}</span>
                </div>
                <div className="flex gap-8 text-xs font-bold text-slate-500">
                  <a href="#" className="hover:text-[#004D40]">Strategy</a>
                  <a href="#" className="hover:text-[#004D40]">Services</a>
                  <a href="#" className="hover:text-[#004D40]">Portfolio</a>
                  <a href="#" className="hover:text-[#004D40]">Insights</a>
                </div>
                <button className="px-5 py-2 rounded-full bg-[#004D40] text-white text-xs font-extrabold">{draftData.content.headerCtaLabel}</button>
              </nav>

              {/* Dynamic Hero mockup */}
              <div className="grid grid-cols-12 gap-12 py-16 px-8 items-center border-b border-slate-100">
                <div className="col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-accent/10 border border-emerald-accent/20 rounded-full text-emerald-accent-dark text-[10px] font-extrabold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent animate-ping" />
                    <span>{draftData.content.heroBadgeText}</span>
                  </div>
                  <h1 className="text-5xl font-black text-slate-850 leading-tight font-serif">
                    {draftData.content.heroHeadline} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-accent to-[#004D40]">{draftData.content.heroHighlightedWord}</span>
                  </h1>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xl">{draftData.content.heroSubtitle}</p>
                </div>

                <div className="col-span-5 relative flex items-center justify-center">
                  <div className="w-64 h-80 bg-slate-100 rounded-3xl relative border border-slate-200 shadow-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#004D40]/30 to-transparent flex items-end justify-center p-4">
                      <div className="text-white text-center font-bold text-xs">{draftData.content.headerText} Portrait</div>
                    </div>
                  </div>
                  
                  {/* Glass indicator tags mockup */}
                  <div className="absolute top-[10%] -left-8 p-3 bg-white/90 shadow-xl rounded-xl border border-white/50 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-800 flex items-center gap-1">✔ {draftData.content.heroFloatingCard1Title}</span>
                  </div>

                  <div className="absolute bottom-[10%] -right-8 p-4 bg-white shadow-xl rounded-xl border border-slate-100 space-y-1">
                    <div className="text-[8px] font-bold text-slate-400 uppercase">{draftData.content.heroFloatingCard2Title}</div>
                    <div className="text-lg font-black text-[#004D40]">{draftData.content.heroFloatingCard2Value}</div>
                  </div>
                </div>
              </div>

              {/* Dynamic About section mockup */}
              <div className="py-16 px-8 grid grid-cols-2 gap-12 border-b border-slate-100 text-left">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Biography Blueprint</span>
                  <h2 className="text-2xl font-extrabold text-[#004D40]">Over {draftData.content.aboutExperienceYears} of Elite Corporate Finance Experience</h2>
                  <p className="text-xs text-slate-500 leading-relaxed">{draftData.content.aboutBiography}</p>
                </div>
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Dynamic Stats</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="text-2xl font-black text-[#004D40]">{draftData.content.aboutAssetsLabel}</div>
                      <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Advisory assets managed</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="text-2xl font-black text-[#004D40]">{draftData.content.aboutExperienceYears}</div>
                      <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Statutory practice years</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Services grid mockup */}
              <div className="py-16 px-8 space-y-8 border-b border-slate-100 text-left">
                <div className="text-center">
                  <h3 className="text-2xl font-extrabold text-[#004D40]">Consulting Competency Areas</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-6">
                  {draftData.services.map(s => (
                    <div key={s.id} className="p-6 bg-white border border-slate-150 rounded-3xl shadow-sm text-left relative overflow-hidden">
                      {s.isFeatured && <div className="absolute top-0 right-0 py-1 px-3 bg-[#10B981] text-xs font-black text-slate-900 rounded-bl-xl uppercase tracking-wider">Featured</div>}
                      <h4 className="text-sm font-black text-[#004D40] mb-2">{s.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights Blog dynamic preview */}
              <div className="py-16 px-8 space-y-8 text-left">
                <h3 className="text-xl font-extrabold text-slate-805">Sovereign Financial Insight Articles</h3>
                <div className="grid grid-cols-2 gap-6">
                  {draftData.blogs.map(post => (
                    <div key={post.id} className="border border-slate-100 rounded-3xl p-6 bg-slate-50/50 space-y-3">
                      <span className="text-[8px] uppercase tracking-wider bg-[#10B981]/20 font-bold px-2 py-0.5 rounded text-emerald-accent-dark">{post.category}</span>
                      <h4 className="text-sm font-black text-slate-800 leading-snug">{post.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed truncate">{post.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic CTA mockup */}
              <div className="bg-[#004D40] text-center text-white py-16 px-8 rounded-3xl my-8">
                <h3 className="text-3xl font-black text-white">{draftData.content.ctaHeading}</h3>
                <p className="text-xs text-white/70 max-w-2xl mx-auto leading-relaxed mt-3">{draftData.content.ctaSubtext}</p>
                <button className="px-6 py-3 bg-[#10B981] text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-xl mt-6">{draftData.content.ctaButtonText}</button>
              </div>

              {/* Dynamic Footer mockup */}
              <footer className="pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
                <p>{draftData.content.footerText}</p>
              </footer>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
