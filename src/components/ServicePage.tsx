import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICE_DETAILS } from '../serviceDetails';
import { CheckCircle2, ShieldCheck, Mail, User, Phone, MessageSquare, ArrowLeft, Lock, Plus, Minus, FileText, ChevronRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { getPricingOverride, PricingPackage } from '../lib/pricingService';
import { useSEO } from '../utils/seo';
import { useServices } from '../context/ServicesContext';

function Accordion({ title, content }: { title: string, content: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-blue-50 rounded-2xl overflow-hidden mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-blue-50/50 transition-all font-bold text-blue-900"
      >
        {title}
        {isOpen ? <Minus size={20} className="text-blue-600" /> : <Plus size={20} className="text-blue-600" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-gray-500 font-medium leading-relaxed bg-white">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ServicePage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [isRegistered, setIsRegistered] = useState(() => {
    return localStorage.getItem('bizlaunch_is_registered') === 'true';
  });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [shakeForm, setShakeForm] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', phone: '', message: '' });
  const [whatsappToast, setWhatsappToast] = useState<{ show: boolean, name: string, phone: string } | null>(null);

  // States for Pricing Packages multi-selection & checkout process
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [customPackages, setCustomPackages] = useState<PricingPackage[] | null>(null);
  const [isAdminOwner, setIsAdminOwner] = useState(false);

  useEffect(() => {
    setIsAdminOwner(localStorage.getItem('bizlaunch_is_owner') === 'true');
    const handleOwnerUpdate = () => {
      setIsAdminOwner(localStorage.getItem('bizlaunch_is_owner') === 'true');
    };
    window.addEventListener('storage', handleOwnerUpdate);
    window.addEventListener('bizlaunch_owner_update', handleOwnerUpdate);
    return () => {
      window.removeEventListener('storage', handleOwnerUpdate);
      window.removeEventListener('bizlaunch_owner_update', handleOwnerUpdate);
    };
  }, []);

  useEffect(() => {
    if (serviceId) {
      getPricingOverride(serviceId).then(override => {
        if (override && override.length > 0) {
          setCustomPackages(override);
        } else {
          setCustomPackages(null);
        }
      }).catch(err => {
        console.error("Failed to load pricing override from Firestore:", err);
      });
    }
  }, [serviceId]);

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccessState, setCheckoutSuccessState] = useState(false);

  const getPreFilledDetails = () => {
    const existing = localStorage.getItem('bizlaunch_leads');
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const lastLead = parsed[0];
          return {
            name: lastLead.name || '',
            email: lastLead.email || '',
            phone: lastLead.phone || ''
          };
        }
      } catch (err) {
        console.warn("Failed to parse existing leads for pre-filling checkout", err);
      }
    }
    return { name: '', email: '', phone: '' };
  };

  const handleOpenCheckoutModal = () => {
    const prefill = getPreFilledDetails();
    setCheckoutName(prefill.name || formData.name || '');
    setCheckoutEmail(prefill.email || formData.email || '');
    setCheckoutPhone(prefill.phone || formData.phone || '');
    setIsCheckoutModalOpen(true);
    setCheckoutSuccessState(false);
  };

  const togglePackageSelection = (packageName: string) => {
    setSelectedPackages(prev => {
      if (prev.includes(packageName)) {
        return prev.filter(name => name !== packageName);
      } else {
        return [...prev, packageName];
      }
    });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkoutName.trim() || !checkoutEmail.trim() || !checkoutPhone.trim()) {
      alert("Please fill in all contact details to complete the selection.");
      return;
    }

    setIsCheckingOut(true);

    const checkoutId = `checkout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const checkoutData = {
      id: checkoutId,
      name: checkoutName.trim(),
      email: checkoutEmail.trim(),
      phone: checkoutPhone.trim(),
      selectedPlans: selectedPackages,
      serviceName: service?.name || 'Inquire Service',
      serviceId: service?.id || serviceId || '',
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };

    // Save to localStorage as a record
    const existingCheckouts = localStorage.getItem('bizlaunch_checkouts') || '[]';
    let checkoutsList = [];
    try {
      checkoutsList = JSON.parse(existingCheckouts);
    } catch (err) {
      checkoutsList = [];
    }
    checkoutsList = [checkoutData, ...checkoutsList];
    localStorage.setItem('bizlaunch_checkouts', JSON.stringify(checkoutsList));

    // Also update leads database in local storage if they edited their profile
    const existingLeads = localStorage.getItem('bizlaunch_leads') || '[]';
    let leadsList = [];
    try {
      leadsList = JSON.parse(existingLeads);
    } catch (err) {}
    
    // Construct the lead schema object for CRM matching
    const newLead = {
      id: checkoutId,
      name: checkoutName.trim(),
      email: checkoutEmail.trim(),
      phone: checkoutPhone.trim(),
      message: `Checked out Package Plan(s): ${selectedPackages.join(', ')}`,
      service: service?.name || 'Inquire Service',
      source: 'Pricing Package Checkout',
      selectedPlans: selectedPackages,
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };
    leadsList = [newLead, ...leadsList];
    localStorage.setItem('bizlaunch_leads', JSON.stringify(leadsList));

    try {
      // Sync in Firestore!
      await setDoc(doc(db, 'checkouts', checkoutId), checkoutData);
      console.log("[DEBUG] ServicePage: Successfully wrote checkout transaction to Firestore.");
      
      // Real-time backup mirroring
      await setDoc(doc(db, 'checkouts_backup', checkoutId), checkoutData);

      // Save as lead directly so it shows in CRM and Database as main lead row!
      console.log("[DEBUG] ServicePage: Syncing checkout directly as a LEAD under 'leads' and 'leads_backup' entities.");
      await setDoc(doc(db, 'leads', checkoutId), newLead);
      await setDoc(doc(db, 'leads_backup', checkoutId), newLead);
      
      // Dispatch global storage state notification to refresh dashboards
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('bizlaunch_owner_update'));
    } catch (error) {
      console.error("[DEBUG] ServicePage: Firestore checkout save failed in background", error);
      try {
        handleFirestoreError(error, OperationType.WRITE, `checkouts/${checkoutId}`);
      } catch (e) {
        // Log the detailed error info but don't crash the user flow since we have local storage fallback
        console.error("[DEBUG] Formatted error details:", e);
      }
    }

    setIsCheckingOut(false);
    setCheckoutSuccessState(true);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 9 && digitsOnly.length <= 15;
  };

  const { services } = useServices();
  const service = services.flatMap(c => c.subServices || []).find(s => s.id === serviceId);
  const details = SERVICE_DETAILS[serviceId || ''];
  const activePackages = customPackages || details?.packages || [];

  useSEO(
    service ? `${service.name} Registration & Advisory` : 'Expert Corporate Service',
    service ? `${service.description} Get professional CA-guided company formation, state filing, and end-to-end compliance advisory with Infovisory.` : 'Explore expert financial, legal, and corporate compliance services with Infovisory.',
    serviceId ? `/service/${serviceId}` : '/service'
  );

  if (!service) return <div className="p-20 text-center">Service not found. <Link to="/">Go back</Link></div>;

  const handleUnlockClick = () => {
    const formElement = document.getElementById('registration-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setShakeForm(true);
      setTimeout(() => setShakeForm(false), 1500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[DEBUG] ServicePage: Submitting details form to reveal pricing details.", formData);
    
    const newErrors = { name: '', email: '', phone: '', message: '' };
    let hasErrors = false;

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
      hasErrors = true;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters';
      hasErrors = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
      hasErrors = true;
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
      hasErrors = true;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      hasErrors = true;
    } else if (!validatePhone(formData.phone.trim())) {
      newErrors.phone = 'Please provide a valid 10-15 digit phone number';
      hasErrors = true;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Requirements/message is required';
      hasErrors = true;
    } else if (formData.message.trim().length < 5) {
      newErrors.message = 'Requirements must be at least 5 characters';
      hasErrors = true;
    }

    if (hasErrors) {
      console.warn("[DEBUG] ServicePage: Lead registration validation failed:", newErrors);
      setErrors(newErrors);
      setShakeForm(true);
      setTimeout(() => setShakeForm(false), 1500);
      return;
    }

    setErrors({ name: '', email: '', phone: '', message: '' });
    console.log("[DEBUG] ServicePage: Lead registration passed validation. Saving lead database entry.");
    
    if (formData.name.trim() && formData.email.trim() && formData.phone.trim()) {
      const leadId = `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      // Save user details to Leads Database
      const newLead = {
        id: leadId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        service: service?.name || 'Inquire Service',
        source: 'Pricing Reveal' as const,
        timestamp: new Date().toISOString(),
        status: 'Pending' as const
      };

      // 1. PERFORM ALL STATE UPDATES & LOCALSTORAGE INSTANTLY
      // This ensures pricing is unlocked immediately on click, even if network or Firestore hangs.
      console.log("[DEBUG] ServicePage: Recording local indicators to localStorage.");
      const existing = localStorage.getItem('bizlaunch_leads');
      let leadsList = [];
      if (existing) {
        try {
          leadsList = JSON.parse(existing);
        } catch (err) {
          console.error("[DEBUG] ServicePage: Failed parsing existing leads from storage", err);
          leadsList = [];
        }
      }
      leadsList = [newLead, ...leadsList];
      localStorage.setItem('bizlaunch_leads', JSON.stringify(leadsList));
      localStorage.setItem('bizlaunch_is_registered', 'true');
      console.log("[DEBUG] ServicePage: Local stats updated successfully.");

      setIsRegistered(true);
      
      // Trigger sliding WhatsApp message toast response
      setWhatsappToast({
        show: true,
        name: formData.name.trim(),
        phone: formData.phone.trim()
      });

      // Notify other components (like navbar or dashboards)
      console.log("[DEBUG] ServicePage: Dispatching updates for other synced page blocks.");
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('bizlaunch_owner_update'));

      // Smooth scroll to the revealed pricing charges table at the bottom of page
      // Staggered scroll to ensure correct target position even if framer-motion transitions rearrange layout height
      const doScroll = () => {
        const pricingSection = document.getElementById('pricing-reveal');
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
      setTimeout(doScroll, 50);
      setTimeout(doScroll, 300);
      setTimeout(doScroll, 600);
      setTimeout(doScroll, 1000);

      // 2. FIRE AND FORGET THE FIRESTORE SYNCHRONIZATION
      // This allows Firestore to queue or complete the operation in background without pausing our UI.
      (async () => {
        try {
          console.log(`[DEBUG] ServicePage: Writing lead to Firestore in background with ID = ${leadId}`);
          await setDoc(doc(db, 'leads', leadId), newLead);
          console.log("[DEBUG] ServicePage: Successfully synced lead block with Firestore.");

          // Real-time immutable lifetime database backup mirroring
          console.log(`[DEBUG] ServicePage: Replicating lead copy to leads_backup collection. id=${leadId}`);
          await setDoc(doc(db, 'leads_backup', leadId), newLead);
          console.log("[DEBUG] ServicePage: Backup record duplicated successfully.");
        } catch (error) {
          console.error("[DEBUG] ServicePage ERROR: Background Firestore document-write failed", error);
        }
      })();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold text-sm mb-12 transition-colors">
          <ArrowLeft size={18} />
          Back to Overview
        </Link>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Service Description */}
          <div className="lg:col-span-7">
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-blue-900 mb-8 leading-tight">
              {service.name}
            </h1>
            <p className="text-xl text-gray-500 mb-12 leading-relaxed">
              {service.description} We offer specialized assistance for {service.name} with 100% digital processing and expert consultation.
            </p>

            <div className="space-y-8 mb-16">
               <h3 className="text-2xl font-bold text-blue-900">Why choose us?</h3>
               <div className="grid sm:grid-cols-2 gap-6">
                 {[
                   'Quick Turnaround Time',
                   '100% Tax Compliant Process',
                   'End-to-End Digital Documentation',
                   'Dedicated Relationship Manager',
                   'Transparent Communication',
                   'Secure Data Handling'
                 ].map(feature => (
                   <div key={feature} className="flex items-center gap-3 text-gray-600 font-medium">
                     <CheckCircle2 className="text-emerald-500" size={20} />
                     {feature}
                   </div>
                 ))}
               </div>
            </div>
            
            <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-6">
               <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0">
                 <ShieldCheck size={32} />
               </div>
               <div>
                 <h4 className="text-xl font-bold text-blue-900 mb-1">Guaranteed Compliance</h4>
                 <p className="text-gray-500">All filings are vetted by seasoned corporate lawyers and chartered accountants.</p>
               </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-5 sticky top-36" id="registration-card">
            <div className={`glass rounded-[40px] p-8 lg:p-10 bg-white border shadow-2xl relative overflow-hidden transition-all duration-500 ${
              shakeForm 
                ? 'ring-4 ring-orange-400 border-orange-400 scale-[1.03] shadow-orange-500/10' 
                : 'border-blue-100'
            }`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-1/2 -translate-y-1/2 -z-10" />
              
              <AnimatePresence mode="wait">
                {isRegistered ? (
                  <motion.div 
                    key="unlocked-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-6"
                  >
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border border-emerald-100">
                      <CheckCircle2 size={40} className="animate-pulse" />
                    </div>
                    
                    <h2 className="text-3xl font-serif font-bold text-blue-900 mb-3">Prices Unlocked</h2>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">
                      Your details are registered securely. All filing charges and corporate package structures for <span className="text-blue-900 font-bold">{service.name}</span> are fully unlocked below.
                    </p>

                    <button 
                      onClick={() => {
                        const pricingSection = document.getElementById('pricing-reveal');
                        if (pricingSection) {
                          pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className="w-full h-14 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all font-sans cursor-pointer shadow-lg shadow-emerald-600/15 flex items-center justify-center gap-2"
                    >
                      View Pricing Table ↓
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsRegistered(false);
                        localStorage.removeItem('bizlaunch_is_registered');
                        window.dispatchEvent(new Event('storage'));
                        window.dispatchEvent(new Event('bizlaunch_owner_update'));
                      }}
                      className="mt-6 text-xs text-slate-400 hover:text-blue-900 font-bold transition-all hover:underline cursor-pointer"
                    >
                      Use a different profile / Re-register
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="registration-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h2 className="text-3xl font-serif font-bold text-blue-900 mb-2">Register Today</h2>
                    <p className="text-gray-400 text-sm mb-8 font-medium italic">Fill details to reveal exclusive pricing and packages</p>

                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                      <div className="space-y-1">
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                          <input 
                            type="text" 
                            placeholder="Full Name" 
                            className={`w-full h-14 pl-12 pr-4 rounded-2xl bg-blue-50/30 border focus:bg-white focus:ring-2 outline-none transition-all ${
                              errors.name ? 'border-red-400 focus:ring-red-500' : 'border-blue-100 focus:ring-blue-500'
                            }`}
                            value={formData.name}
                            onChange={e => {
                              setFormData({...formData, name: e.target.value});
                              if (errors.name) setErrors({...errors, name: ''});
                            }}
                          />
                        </div>
                        {errors.name && <p id="error-name" className="text-xs text-red-500 font-semibold pl-2">{errors.name}</p>}
                      </div>

                      <div className="space-y-1">
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                          <input 
                            type="email" 
                            placeholder="Email Address" 
                            className={`w-full h-14 pl-12 pr-4 rounded-2xl bg-blue-50/30 border focus:bg-white focus:ring-2 outline-none transition-all ${
                              errors.email ? 'border-red-400 focus:ring-red-500' : 'border-blue-100 focus:ring-blue-500'
                            }`}
                            value={formData.email}
                            onChange={e => {
                              setFormData({...formData, email: e.target.value});
                              if (errors.email) setErrors({...errors, email: ''});
                            }}
                          />
                        </div>
                        {errors.email && <p id="error-email" className="text-xs text-red-500 font-semibold pl-2">{errors.email}</p>}
                      </div>

                      <div className="space-y-1">
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                          <input 
                            type="tel" 
                            placeholder="Phone Number (e.g. +91...)" 
                            className={`w-full h-14 pl-12 pr-4 rounded-2xl bg-blue-50/30 border focus:bg-white focus:ring-2 outline-none transition-all ${
                              errors.phone ? 'border-red-400 focus:ring-red-500' : 'border-blue-100 focus:ring-blue-500'
                            }`}
                            value={formData.phone}
                            onChange={e => {
                              setFormData({...formData, phone: e.target.value});
                              if (errors.phone) setErrors({...errors, phone: ''});
                            }}
                          />
                        </div>
                        {errors.phone && <p id="error-phone" className="text-xs text-red-500 font-semibold pl-2">{errors.phone}</p>}
                      </div>

                      <div className="space-y-1">
                        <div className="relative group">
                          <MessageSquare className="absolute left-4 top-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                          <textarea 
                            placeholder="Your Message / Business Requirements" 
                            rows={3}
                            className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-blue-50/30 border focus:bg-white focus:ring-2 outline-none transition-all ${
                              errors.message ? 'border-red-400 focus:ring-red-500' : 'border-blue-100 focus:ring-blue-500'
                            }`}
                            value={formData.message}
                            onChange={e => {
                              setFormData({...formData, message: e.target.value});
                              if (errors.message) setErrors({...errors, message: ''});
                            }}
                          ></textarea>
                        </div>
                        {errors.message && <p id="error-message" className="text-xs text-red-500 font-semibold pl-2">{errors.message}</p>}
                      </div>

                      <button 
                        type="submit" 
                        className="w-full h-16 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Reveal Prices & Filings ↓
                      </button>
                    </form>

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">
                      <Lock size={12} />
                      100% Secure & Confidential
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Detailed Sections (Rich Content) */}
        {details && (
          <div className="mt-32 space-y-32">
            {details.sections.map((section, idx) => (
              <section key={idx} className="max-w-4xl">
                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-blue-900 mb-12 border-l-4 border-blue-600 pl-6">
                  {section.title}
                </h2>
                
                {section.type === 'grid' && Array.isArray(section.content) && (
                  <div className="grid sm:grid-cols-2 gap-8">
                    {(section.content as {title: string, description: string}[]).map((item, i) => (
                      <div key={i} className="p-8 rounded-[32px] border border-blue-50 bg-white hover:border-blue-600 transition-all group">
                        <h4 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="text-blue-600" size={20} />
                          {item.title}
                        </h4>
                        <p className="text-gray-500 font-medium leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {section.type === 'list' && Array.isArray(section.content) && (
                  <div className="bg-blue-50/30 p-10 rounded-[40px] border border-blue-50">
                    <ul className="space-y-6">
                      {(section.content as string[]).map((item, i) => (
                        <li key={i} className="flex gap-4 items-start text-gray-600 font-medium">
                          <FileText className="text-blue-600 shrink-0 mt-1" size={20} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {section.type === 'steps' && Array.isArray(section.content) && (
                  <div className="space-y-8 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-blue-100">
                    {(section.content as {title: string, description: string}[]).map((step, i) => (
                      <div key={i} className="relative pl-16 flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="absolute left-0 w-12 h-12 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center text-blue-600 font-bold z-10">
                          {i + 1}
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-xl font-bold text-blue-900 mb-2">{step.title}</h4>
                          <p className="text-gray-500 font-medium leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {section.type === 'faqs' && Array.isArray(section.content) && (
                  <div>
                    {(section.content as {title: string, description: string}[]).map((faq, i) => (
                      <div key={i}>
                        <Accordion title={faq.title} content={faq.description} />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
        
        {/* Gated Pricing Part */}
        <div className="mt-32 pt-24 border-t border-blue-100" id="pricing-reveal">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            {!isRegistered && (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-50 text-orange-850 border border-orange-100 text-xs font-black uppercase tracking-wider mb-4 animate-pulse shadow-sm">
                <Lock size={12} />
                Pricing Locked
              </span>
            )}
            <h2 className="text-4xl font-serif font-bold text-blue-900 mb-4">{service.name} Filing Charges</h2>
            <p className="text-gray-500 font-medium">
              {isRegistered 
                ? 'Transparent pricing with no hidden costs. Select your package.' 
                : `Pricing is gated for security. Provide your company contact details above to instantly unlock the charge matrix for ${service.name}.`}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {activePackages && activePackages.length > 0 ? (
              activePackages.map((pkg, i) => {
                const isPopular = pkg.isPopular;
                const isSelected = selectedPackages.includes(pkg.name);
                return (
                  <div key={pkg.name} className={`p-10 rounded-[40px] border transition-all flex flex-col relative ${
                    isSelected 
                      ? 'ring-4 ring-emerald-500 border-emerald-500 scale-[1.02] bg-white text-blue-900 shadow-2xl' 
                      : isPopular 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xl overflow-hidden' 
                        : 'bg-white text-blue-900 border-blue-100'
                  }`}>
                    {isSelected && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Selected
                      </div>
                    )}
                    {isPopular && !isSelected && <div className="absolute top-6 right-6 px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold tracking-widest uppercase">Most Popular</div>}
                    <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                    
                    <div className="text-4xl font-bold mb-8 flex items-baseline gap-1 relative">
                      {isRegistered ? (
                        <>
                          <span className="text-xl font-medium">₹</span>
                          {pkg.price}
                        </>
                      ) : (
                        <div className="relative inline-block w-full">
                          <span className="filter blur-[5px] select-none opacity-40 text-3xl font-mono">₹9,999</span>
                          <span className={`absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-xl shadow-sm ${isPopular ? 'bg-white text-blue-950' : 'bg-blue-900 text-white'}`}>
                            <Lock size={10} />
                            Locked
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <ul className={`space-y-4 mb-12 flex-grow ${!isRegistered ? 'filter blur-[1px]' : ''}`}>
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className={`flex gap-3 text-sm font-medium ${isPopular && !isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                          <CheckCircle2 size={18} className={isPopular && !isSelected ? 'text-white' : 'text-blue-600'} />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {isRegistered ? (
                      <button 
                        onClick={() => togglePackageSelection(pkg.name)}
                        className={`w-full py-4 rounded-2xl font-bold transition-all hover:scale-102 active:scale-95 flex items-center justify-center gap-2 ${
                          isSelected 
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                            : isPopular 
                              ? 'bg-white text-blue-600 hover:bg-blue-50' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isSelected ? '✓ Selected' : `Select ${pkg.name}`}
                      </button>
                    ) : (
                      <button 
                        onClick={handleUnlockClick}
                        className={`w-full py-4 rounded-2xl font-bold transition-all hover:scale-102 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${isPopular ? 'bg-white text-blue-950 hover:bg-blue-50' : 'bg-blue-600 text-white hover:bg-blue-800'}`}
                      >
                        <Lock size={14} />
                        Unlock to Select
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              [
                { name: 'Standard', desc: 'Basic Filing Assistance', price: 'Quote on Request', icon: '🚀' },
                { name: 'Premium', desc: 'Full Compliance Suite', price: 'Contact for Quote', icon: '💎' },
                { name: 'Enterprise', desc: 'Custom Business Support', price: 'Tailored', icon: '🏛️' }
              ].map((plan, i) => {
                const isSelected = selectedPackages.includes(plan.name);
                return (
                  <div key={plan.name} className={`p-10 rounded-[40px] border transition-all flex flex-col relative ${
                    isSelected 
                      ? 'ring-4 ring-emerald-500 border-emerald-500 scale-[1.02] bg-white text-blue-900 shadow-2xl' 
                      : i === 0 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xl overflow-hidden' 
                        : 'bg-white text-blue-900 border-blue-100'
                  }`}>
                    {isSelected && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Selected
                      </div>
                    )}
                    {i === 0 && !isSelected && <div className="absolute top-6 right-6 px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold tracking-widest uppercase">Best Value</div>}
                    <div className="text-4xl mb-6">{plan.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className={`mb-8 font-medium ${isSelected ? 'text-gray-400' : i === 0 ? 'text-blue-100' : 'text-gray-400'}`}>{plan.desc}</p>
                    
                    <div className="text-4xl font-bold mb-10 relative">
                      {isRegistered ? (
                        plan.price
                      ) : (
                        <div className="relative inline-block w-full">
                          <span className="filter blur-[5px] select-none opacity-40 text-3xl font-mono">₹4,999</span>
                          <span className={`absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-xl shadow-sm ${i === 0 ? 'bg-white text-blue-950' : 'bg-blue-900 text-white'}`}>
                            <Lock size={10} />
                            Locked
                          </span>
                        </div>
                      )}
                    </div>

                    {isRegistered ? (
                      <button 
                        onClick={() => togglePackageSelection(plan.name)}
                        className={`w-full py-4 mt-auto rounded-2xl font-bold transition-all hover:scale-102 active:scale-95 flex items-center justify-center gap-2 ${
                          isSelected 
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                            : i === 0 
                              ? 'bg-white text-blue-600 hover:bg-blue-50' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isSelected ? '✓ Selected' : 'Select Plan'}
                      </button>
                    ) : (
                      <button 
                        onClick={handleUnlockClick}
                        className={`w-full py-4 mt-auto rounded-2xl font-bold transition-all hover:scale-102 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${i === 0 ? 'bg-white text-blue-950 hover:bg-blue-50' : 'bg-blue-600 text-white hover:bg-blue-800'}`}
                      >
                        <Lock size={14} />
                        Unlock to Select
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Checkout Block below grid */}
          <AnimatePresence>
            {isRegistered && selectedPackages.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="mt-16 p-8 lg:p-12 rounded-[40px] bg-slate-50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto"
              >
                <div className="text-left">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold tracking-wider uppercase">
                    Ready to Proceed?
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-serif font-bold text-blue-900 mt-3 mb-2">
                    Confirm Selected Plans
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedPackages.map(name => (
                      <span key={name} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs font-bold leading-none">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        {name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto shrink-0 min-w-[240px]">
                  <button 
                    onClick={handleOpenCheckoutModal}
                    className="w-full h-14 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/15 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Proceed to Checkout
                    <ChevronRight size={18} />
                  </button>
                  <button 
                    onClick={() => setSelectedPackages([])}
                    className="text-xs text-slate-400 hover:text-red-500 font-bold transition-all cursor-pointer underline text-center"
                  >
                    Clear All Selections
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* WhatsApp Floating Slide-in Auto-response Toast */}
      <AnimatePresence>
        {whatsappToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[9999] max-w-sm w-full bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden"
          >
            <div className="bg-[#075E54] text-white p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#128C7E] flex items-center justify-center text-lg font-bold">
                I
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm">Infovisory Support</h4>
                <p className="text-[10px] text-emerald-100 font-medium">Auto-Response System</p>
              </div>
              <button 
                onClick={() => setWhatsappToast(null)}
                className="ml-auto text-white/70 hover:text-white transition-colors p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-[#ece5dd] min-h-[110px] flex flex-col justify-between text-left">
              {/* WhatsApp Message Bubble */}
              <div className="bg-[#e2f7cb] p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[90%] relative self-end text-left">
                <p className="text-xs text-gray-800 leading-normal">
                  Hello <strong>{whatsappToast.name}</strong>, thank you for registering with Infovisory! How can we help you today?
                </p>
                <span className="text-[9px] text-gray-400 block text-right mt-1 font-mono">
                  Just now • Sent ✓✓
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-dashed border-gray-300 flex items-center justify-between text-[11px]">
                <span className="text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md font-bold font-mono">
                  Sent to {whatsappToast.phone}
                </span>
                <a 
                  href={`https://wa.me/919587582221?text=${encodeURIComponent(`Hi Infovisory! My name is ${whatsappToast.name}. Please help me with my business formation.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-black text-[#128C7E] hover:underline"
                >
                  Need help? Chat Live →
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Bottom Checkout Alert Bar */}
      <AnimatePresence>
        {isRegistered && selectedPackages.length > 0 && !isCheckoutModalOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[2000] w-[calc(100%-2rem)] max-w-3xl bg-white border border-blue-100 p-4 sm:p-5 rounded-3xl shadow-2xl flex items-center justify-between gap-4"
          >
            <div className="text-left pl-2 hidden sm:block">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Active Selection</p>
              <h4 className="font-bold text-blue-950 text-sm">
                {selectedPackages.length} {selectedPackages.length === 1 ? 'Plan' : 'Plans'} chosen ({selectedPackages.join(', ')})
              </h4>
            </div>
            <div className="text-left pl-2 sm:hidden">
              <h4 className="font-bold text-blue-950 text-sm">
                🛒 {selectedPackages.length} Plan Selected
              </h4>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedPackages([])}
                className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={handleOpenCheckoutModal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-600/10 flex items-center gap-1 cursor-pointer"
              >
                Checkout Now
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isCheckingOut) setIsCheckoutModalOpen(false);
              }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] border border-blue-50 w-full max-w-lg p-8 sm:p-10 shadow-2xl relative z-10 overflow-hidden"
            >
              {checkoutSuccessState ? (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-md">
                    <CheckCircle2 size={42} />
                  </div>
                  
                  <h3 className="text-3xl font-serif font-bold text-blue-900 mb-4">Request Submitted!</h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">
                    Our compliance experts have received your selection for <strong className="text-blue-900">{service.name}</strong>. Thanks for choosing this plan, we will contact you soon!
                  </p>

                  <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 border border-slate-100">
                    <p className="text-[11px] font-black uppercase text-gray-400 tracking-wider mb-3">Selected Plans</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {selectedPackages.map(pkg => (
                        <span key={pkg} className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-blue-950">
                          {pkg}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1.5 font-medium border-t border-slate-100 pt-3">
                      <p>👤 <strong>Representative:</strong> {checkoutName}</p>
                      <p>📞 <strong>Phone Contact:</strong> {checkoutPhone}</p>
                      <p>✉️ <strong>Email Address:</strong> {checkoutEmail}</p>
                    </div>
                  </div>

                  <p className="text-gray-500 text-xs font-semibold mb-8">
                    Our designated experts will reach out to you within the next 2-4 business hours on your registered contact details.
                  </p>

                  <button
                    onClick={() => {
                      setIsCheckoutModalOpen(false);
                      setSelectedPackages([]); // Clear selections
                    }}
                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold font-sans shadow-lg shadow-emerald-500/15 cursor-pointer"
                  >
                    Close & Continue
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-3xl font-serif font-bold text-blue-900 mb-2">Finalize Checkout</h3>
                  <p className="text-gray-400 text-sm mb-8 font-medium">Verify your profile detail keys to coordinate onboarding</p>

                  <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-400 pl-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input 
                          type="text" 
                          required
                          className="w-full h-12 pl-12 pr-4 bg-blue-50/20 border border-blue-150 rounded-xl focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold text-blue-900"
                          value={checkoutName}
                          onChange={e => setCheckoutName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-400 pl-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input 
                          type="email" 
                          required
                          className="w-full h-12 pl-12 pr-4 bg-blue-50/20 border border-blue-150 rounded-xl focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold text-blue-900"
                          value={checkoutEmail}
                          onChange={e => setCheckoutEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-400 pl-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input 
                          type="tel" 
                          required
                          className="w-full h-12 pl-12 pr-4 bg-blue-50/20 border border-blue-150 rounded-xl focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold text-blue-900"
                          value={checkoutPhone}
                          onChange={e => setCheckoutPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 text-left border border-slate-100 pb-6">
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2">Checkout Balance Itemization</h4>
                      <p className="text-xs font-semibold text-blue-900 mb-1">
                        📦 service: <strong>{service.name}</strong>
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        📋 selected plans: <strong>{selectedPackages.join(', ')}</strong>
                      </p>
                    </div>

                    <div className="pt-2 flex items-center gap-4">
                      <button 
                        type="button" 
                        disabled={isCheckingOut}
                        onClick={() => setIsCheckoutModalOpen(false)}
                        className="flex-1 h-12 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={isCheckingOut}
                        className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/15 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isCheckingOut ? 'Processing...' : 'Confirm Selection'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
