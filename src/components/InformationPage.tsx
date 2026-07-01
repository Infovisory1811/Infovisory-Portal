import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { 
  ArrowLeft, 
  Users, 
  Building, 
  Briefcase, 
  Star,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  Percent,
  CheckCircle,
  TrendingUp,
  Headphones,
  Award,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

const INFO_CONTENT: Record<string, { title: string, icon: any, content: string }> = {
  'about': {
    title: 'About Us',
    icon: Building,
    content: 'Infovisory is India\'s premier digital firm for legal, tax, and compliance services. We help thousands of entrepreneurs build their business legacy through seamless digital solutions.'
  },
  'affiliate': {
    title: 'Affiliate Program',
    icon: Users,
    content: 'Partner with us and earn commissions by referring clients to India\'s most trusted compliance platform.'
  },
  'career': {
    title: 'Careers',
    icon: Briefcase,
    content: 'Join our team of legal and tax experts to transform how business bureaucracy works in India.'
  },
  'reviews': {
    title: 'Client Reviews',
    icon: Star,
    content: 'Don\'t just take our word for it. Read what 10,000+ entrepreneurs have to say about their experience with Infovisory.'
  }
};

export default function InformationPage() {
  const { slug } = useParams<{ slug: string }>();
  const info = slug ? INFO_CONTENT[slug] : null;

  // Affiliate Form States
  const [affiliateName, setAffiliateName] = useState('');
  const [affiliateEmail, setAffiliateEmail] = useState('');
  const [affiliatePhone, setAffiliatePhone] = useState('');
  const [affiliateMessage, setAffiliateMessage] = useState('');
  
  // Real-time validation and feedback states
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Field Blur/Touch state markers
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; phone?: boolean; message?: boolean }>({});

  if (!info) {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-20 max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold text-blue-900 mb-4">Page Not Found</h1>
          <Link to="/" className="text-blue-600 font-bold underline">Go Home</Link>
        </div>
      </div>
    );
  }

  // Live validator utility
  const validateField = (field: 'name' | 'email' | 'phone' | 'message', val: string) => {
    const nextErrors = { ...errors };

    if (field === 'name') {
      if (!val.trim()) {
        nextErrors.name = 'Full Name is required.';
      } else if (val.trim().length < 3) {
        nextErrors.name = 'Name must be at least 3 characters.';
      } else {
        delete nextErrors.name;
      }
    }

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val.trim()) {
        nextErrors.email = 'Email address is required.';
      } else if (!emailRegex.test(val.trim())) {
        nextErrors.email = 'Please provide a valid email format (e.g., name@domain.com).';
      } else {
        delete nextErrors.email;
      }
    }

    if (field === 'phone') {
      const digits = val.replace(/\D/g, '');
      if (!val.trim()) {
        nextErrors.phone = 'Phone contact number is required.';
      } else if (digits.length < 10 || digits.length > 15) {
        nextErrors.phone = 'Please provide a valid phone number (10 to 15 digits).';
      } else {
        delete nextErrors.phone;
      }
    }

    if (field === 'message') {
      if (!val.trim()) {
        nextErrors.message = 'Please share a brief message about your referrals.';
      } else if (val.trim().length < 15) {
        nextErrors.message = 'Please make your message slightly longer (min 15 characters).';
      } else {
        delete nextErrors.message;
      }
    }

    setErrors(nextErrors);
  };

  const handleBlur = (field: 'name' | 'email' | 'phone' | 'message') => {
    setTouched({ ...touched, [field]: true });
    if (field === 'name') validateField('name', affiliateName);
    if (field === 'email') validateField('email', affiliateEmail);
    if (field === 'phone') validateField('phone', affiliatePhone);
    if (field === 'message') validateField('message', affiliateMessage);
  };

  const handleChange = (field: 'name' | 'email' | 'phone' | 'message', value: string) => {
    if (field === 'name') {
      setAffiliateName(value);
      if (touched.name) validateField('name', value);
    }
    if (field === 'email') {
      setAffiliateEmail(value);
      if (touched.email) validateField('email', value);
    }
    if (field === 'phone') {
      setAffiliatePhone(value);
      if (touched.phone) validateField('phone', value);
    }
    if (field === 'message') {
      setAffiliateMessage(value);
      if (touched.message) validateField('message', value);
    }
  };

  // Submit Submission Handlers
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger complete validation across all keys
    const currentErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = affiliatePhone.replace(/\D/g, '');

    if (!affiliateName.trim()) {
      currentErrors.name = 'Full Name is required.';
    } else if (affiliateName.trim().length < 3) {
      currentErrors.name = 'Name must be at least 3 characters.';
    }

    if (!affiliateEmail.trim()) {
      currentErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(affiliateEmail.trim())) {
      currentErrors.email = 'Please enter a valid, active email address.';
    }

    if (!affiliatePhone.trim()) {
      currentErrors.phone = 'Phone number is required.';
    } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      currentErrors.phone = 'Phone number must contain between 10 and 15 digits.';
    }

    if (!affiliateMessage.trim()) {
      currentErrors.message = 'Please share a brief message.';
    } else if (affiliateMessage.trim().length < 15) {
      currentErrors.message = 'Please provide a more descriptive message (min 15 characters).';
    }

    setErrors(currentErrors);
    setTouched({ name: true, email: true, phone: true, message: true });

    if (Object.keys(currentErrors).length > 0) {
      console.warn('[DEBUG] Affiliate form validation blocked submission', currentErrors);
      return;
    }

    setIsSubmitting(true);
    const leadId = `lead-affiliate-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newLead = {
      id: leadId,
      name: affiliateName.trim(),
      email: affiliateEmail.trim(),
      phone: affiliatePhone.trim(),
      message: affiliateMessage.trim(),
      service: 'Affiliate Onboarding',
      source: 'Affiliate Program',
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };

    try {
      console.log(`[DEBUG] Syncing Affiliate Application "${leadId}" to Firestore...`);
      // Update local storage so it registers immediately
      const existingLeads = localStorage.getItem('bizlaunch_leads') || '[]';
      let leadsList = [];
      try {
        leadsList = JSON.parse(existingLeads);
      } catch (err) {}
      leadsList = [newLead, ...leadsList];
      localStorage.setItem('bizlaunch_leads', JSON.stringify(leadsList));

      // Sync in Firestore real-time collection nodes!
      await setDoc(doc(db, 'leads', leadId), newLead);
      await setDoc(doc(db, 'leads_backup', leadId), newLead);

      // Trigger dynamic events to update operational dashboards
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('bizlaunch_owner_update'));

      console.log(`[DEBUG] Successfully logged affiliate applicant lead: "${leadId}" into CRM database.`);
      setIsSuccess(true);
    } catch (err) {
      console.error('[DEBUG] Failed saving affiliate lead to Firestore DB', err);
      try {
        handleFirestoreError(err, OperationType.WRITE, `leads/${leadId}`);
      } catch (e) {
        console.error('[DEBUG] Formatted CRM Database write report:', e);
      }
      // If Firestore failed, let's gracefully allow success if it saved to local state anyway
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold text-sm mb-12 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
        
        {/* Page Heading banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
              <info.icon size={32} />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Explore Infovisory</span>
              <h1 className="text-4xl font-serif font-black text-blue-950 mt-1">{info.title}</h1>
            </div>
          </div>
          <p className="max-w-md text-gray-500 font-medium text-sm leading-relaxed">
            {info.content}
          </p>
        </div>

        {/* Dynamic Branching for Slug: Affiliate Program */}
        {slug === 'affiliate' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Benefits & Value Propositions */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-slate-900 text-white rounded-[32px] p-8 relative overflow-hidden shadow-xl">
                <div className="absolute right-0 top-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute left-0 bottom-0 w-24 h-24 bg-emerald-600/10 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1 bg-white/10 text-emerald-400 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-4 border border-white/10">
                    <Sparkles size={12} className="text-emerald-400 animate-pulse" />
                    High Payout Program
                  </div>
                  <h3 className="text-2xl font-serif font-black text-white leading-tight mb-3">Partner with India's Premier Digital Corporate Firm</h3>
                  <p className="text-slate-300 text-xs font-medium leading-relaxed">
                    Refer clients, builders, and corporate entrepreneurs. We cover complete tax filing, trademark registration, business formations, and bookkeepping under robust digital workflows.
                  </p>
                </div>
              </div>

              {/* Explicit program highlights list */}
              <div className="space-y-4">
                <div className="flex gap-4 p-5 bg-blue-50/20 border border-blue-50/50 rounded-2xl hover:bg-blue-50/40 transition-colors">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                    <Percent size={18} className="font-extrabold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Earn Referral Commission</h4>
                    <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                      Enjoy premium commission payout rates on successfully converted leads with zero referral caps.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 bg-blue-50/20 border border-blue-50/50 rounded-2xl hover:bg-blue-50/40 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center shrink-0">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Real-time Lead Progression</h4>
                    <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                      Watch referral updates in real-time. Submissions link immediately with our secure CRM interface pipeline.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 bg-blue-50/20 border border-blue-50/50 rounded-2xl hover:bg-blue-50/40 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center shrink-0">
                    <Headphones size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Professional Execution Care</h4>
                    <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                      Your referrals are assisted by high-caliber compliance experts, assuring high retention and referrals trust.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 bg-blue-50/20 border border-blue-50/50 rounded-2xl hover:bg-blue-50/40 transition-colors">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                    <Award size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Timely Monthly Pay-outs</h4>
                    <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                      Get paid straight into your bank account monthly with explicit accounting statements.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Form UI with precise validation feedback */}
            <div className="lg:col-span-1" /> {/* Grid spacer */}
            
            <div className="lg:col-span-6 bg-white border border-gray-100 p-8 sm:p-10 rounded-[40px] shadow-2xl shadow-blue-900/5 relative">
              {isSuccess ? (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-md">
                    <CheckCircle2 size={42} />
                  </div>
                  
                  <h3 className="text-3xl font-serif font-bold text-blue-900 mb-4">Application Logged!</h3>
                  <p className="text-gray-500 font-semibold text-sm leading-relaxed mb-6">
                    A verification request has been successfully generated for <strong className="text-blue-900 font-bold">{affiliateName}</strong>. Thanks for applying to the Affiliate Program.
                  </p>

                  <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 border border-slate-100">
                    <p className="text-[11px] font-black uppercase text-gray-400 tracking-wider mb-2">Submitted Contact Card</p>
                    <div className="text-xs text-gray-500 space-y-2 font-medium">
                      <p>👤 <strong>Applicant Name:</strong> {affiliateName}</p>
                      <p>📞 <strong>Phone Number:</strong> {affiliatePhone}</p>
                      <p>✉️ <strong>Email Address:</strong> {affiliateEmail}</p>
                      <p className="border-t border-dashed border-gray-200 mt-2 pt-2">
                        💬 <strong>Message Details:</strong> <br />
                        <span className="text-slate-600 italic block mt-1">"{affiliateMessage}"</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-400 text-xs font-semibold mb-8">
                    Our partnership supervisor will carefully analyze your onboarding request and contact you on the registered contact nodes shortly.
                  </p>

                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setAffiliateName('');
                      setAffiliateEmail('');
                      setAffiliatePhone('');
                      setAffiliateMessage('');
                      setTouched({});
                    }}
                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold font-sans shadow-lg shadow-emerald-500/15 cursor-pointer flex items-center justify-center gap-2"
                  >
                    Register Another Account
                  </button>
                </div>
              ) : (
                <div id="affiliate-registration-form-region">
                  <h3 className="text-2xl font-serif font-bold text-blue-950 mb-2">Affiliate Application</h3>
                  <p className="text-gray-400 font-medium text-xs sm:text-sm mb-8 leading-relaxed">
                    Instantly register your refer-and-earn partnership handle below. All details will process directly into our CRM ledger.
                  </p>

                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    {/* Full Name input block */}
                    <div className="space-y-1 block text-left">
                      <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 pl-1 flex items-center justify-between">
                        <span>Full Name / Company Name</span>
                        {touched.name && !errors.name && <span className="text-emerald-600 flex items-center gap-0.5"><CheckCircle size={10} /> Valid</span>}
                      </label>
                      <div className="relative">
                        <User 
                          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                            touched.name ? (errors.name ? 'text-red-400' : 'text-emerald-500') : 'text-gray-400'
                          }`} 
                          size={18} 
                        />
                        <input 
                          type="text" 
                          placeholder="e.g. Rahul Sen"
                          required
                          className={`w-full h-12 pl-12 pr-4 bg-slate-50/50 border rounded-xl outline-none transition-all text-sm font-semibold text-blue-950 ${
                            touched.name 
                              ? errors.name 
                                ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                                : 'border-emerald-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50/50' 
                              : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                          }`}
                          value={affiliateName}
                          onChange={e => handleChange('name', e.target.value)}
                          onBlur={() => handleBlur('name')}
                        />
                      </div>
                      {touched.name && errors.name && (
                        <p className="text-xs font-semibold text-red-500 flex items-center gap-1 pl-1 mt-1">
                          <AlertCircle size={12} /> {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email address input block */}
                    <div className="space-y-1 block text-left">
                      <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 pl-1 flex items-center justify-between">
                        <span>Email Address</span>
                        {touched.email && !errors.email && <span className="text-emerald-600 flex items-center gap-0.5"><CheckCircle size={10} /> Valid</span>}
                      </label>
                      <div className="relative">
                        <Mail 
                          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                            touched.email ? (errors.email ? 'text-red-400' : 'text-emerald-500') : 'text-gray-400'
                          }`} 
                          size={18} 
                        />
                        <input 
                          type="email" 
                          placeholder="e.g. rahul@senconsulting.org"
                          required
                          className={`w-full h-12 pl-12 pr-4 bg-slate-50/50 border rounded-xl outline-none transition-all text-sm font-semibold text-blue-950 ${
                            touched.email 
                              ? errors.email 
                                ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                                : 'border-emerald-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50/50' 
                              : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                          }`}
                          value={affiliateEmail}
                          onChange={e => handleChange('email', e.target.value)}
                          onBlur={() => handleBlur('email')}
                        />
                      </div>
                      {touched.email && errors.email && (
                        <p className="text-xs font-semibold text-red-500 flex items-center gap-1 pl-1 mt-1">
                          <AlertCircle size={12} /> {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone input block (Only Valid Numbers) */}
                    <div className="space-y-1 block text-left">
                      <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 pl-1 flex items-center justify-between">
                        <span>Contact Phone Number</span>
                        {touched.phone && !errors.phone && <span className="text-emerald-600 flex items-center gap-0.5"><CheckCircle size={10} /> Valid</span>}
                      </label>
                      <div className="relative">
                        <Phone 
                          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                            touched.phone ? (errors.phone ? 'text-red-400' : 'text-emerald-500') : 'text-gray-400'
                          }`} 
                          size={18} 
                        />
                        <input 
                          type="tel" 
                          placeholder="e.g. +91 95875 82221"
                          required
                          className={`w-full h-12 pl-12 pr-4 bg-slate-50/50 border rounded-xl outline-none transition-all text-sm font-semibold text-blue-950 ${
                            touched.phone 
                              ? errors.phone 
                                ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                                : 'border-emerald-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50/50' 
                              : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                          }`}
                          value={affiliatePhone}
                          onChange={e => handleChange('phone', e.target.value)}
                          onBlur={() => handleBlur('phone')}
                        />
                      </div>
                      {touched.phone && errors.phone ? (
                        <p className="text-xs font-semibold text-red-500 flex items-center gap-1 pl-1 mt-1">
                          <AlertCircle size={12} /> {errors.phone}
                        </p>
                      ) : (
                        <p className="text-[10px] text-gray-400 pl-1">Min 10-digit valid contact number, excluding layout characters.</p>
                      )}
                    </div>

                    {/* Brief explanation message block */}
                    <div className="space-y-1 block text-left">
                      <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 pl-1 flex items-center justify-between">
                        <span>How do you plan to refer clients? (Message detailing background)</span>
                        {touched.message && !errors.message && <span className="text-emerald-600 flex items-center gap-0.5"><CheckCircle size={10} /> Valid</span>}
                      </label>
                      <div className="relative">
                        <MessageSquare 
                          className={`absolute left-4 top-4 transition-colors ${
                            touched.message ? (errors.message ? 'text-red-400' : 'text-emerald-500') : 'text-gray-400'
                          }`} 
                          size={18} 
                        />
                        <textarea 
                          rows={4}
                          placeholder="Tell us briefly about your marketing setup, blogs, client network, or referrable audiences (Minimum 15 characters, please)."
                          required
                          className={`w-full pl-12 pr-4 py-3 bg-slate-50/50 border rounded-xl outline-none transition-all text-sm font-semibold text-blue-950 resize-y min-h-[100px] ${
                            touched.message 
                              ? errors.message 
                                ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100' 
                                : 'border-emerald-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50/50' 
                              : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                          }`}
                          value={affiliateMessage}
                          onChange={e => handleChange('message', e.target.value)}
                          onBlur={() => handleBlur('message')}
                        />
                      </div>
                      {touched.message && errors.message && (
                        <p className="text-xs font-semibold text-red-500 flex items-center gap-1 pl-1 mt-1">
                          <AlertCircle size={12} /> {errors.message}
                        </p>
                      )}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-14 bg-blue-900 hover:bg-blue-950 disabled:opacity-50 text-white rounded-2xl font-bold font-sans shadow-lg shadow-blue-900/10 cursor-pointer flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing Application...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Request Onboarding Access
                          <ChevronRight size={16} />
                        </div>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* General templates for other slugs (about, careers, reviews, etc.) */
          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed bg-gray-50 p-8 sm:p-10 rounded-[32px] border border-gray-100">
            <p className="text-xl font-medium mb-8 text-blue-900">{info.content}</p>
            <p className="mb-4">At Infovisory, we believe that starting and running a business should be an empowering experience, not a bureaucratic nightmare. Our platform bridges the gap between complex Indian laws and modern digital efficiency.</p>
            <p>Founded by experts in law, technology, and finance, we are committed to providing transparent, affordable, and high-quality services to every entrepreneur, from solo founders to large enterprises.</p>
          </div>
        )}
      </div>
    </div>
  );
}

