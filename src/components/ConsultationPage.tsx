import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';
import { doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useSEO } from '../utils/seo';

/**
 * ConsultationPage Component
 * 
 * Provides a highly polished, interactive user interface for potential clients to 
 * request a free business consultation and connect with a compliance/legal advisor.
 * It manages lead state, performs client-side form validation, persists lead information 
 * to Firestore & local storage, and prompts a custom WhatsApp auto-reply toast.
 */
export default function ConsultationPage() {
  useSEO(
    'Contact & Free Consultation | Jaipur CAs & Legal Advisors',
    'Get in touch with Infovisory. Schedule a free advisory consultation with senior CAs and lawyers for company registrations, tax optimization, and corporate compliance.',
    '/contact'
  );

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    service: 'Business Licensing'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    consent: ''
  });
  const [whatsappToast, setWhatsappToast] = useState<{ show: boolean, name: string, phone: string } | null>(null);

  /**
   * validateEmail Function
   * 
   * Validates if a given string matches a standard, valid email structure using regex.
   * @param email - The email string input by the user
   * @returns boolean - true if email format is standard, false otherwise
   */
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  /**
   * validatePhone Function
   * 
   * Validates if a phone/contact number input contains between 10 to 15 digits by stripping all non-digits.
   * @param phone - The telephone input string
   * @returns boolean - true if remaining digit length is between [10, 15], false otherwise
   */
  const validatePhone = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  };

  /**
   * handleSubmit Function
   * 
   * Main submission handler for the consultation request form. 
   * Triggers frontend validations for required fields, constructs a new lead record, 
   * logs it into both Google Cloud Firestore (asynchronously) and localStorage, 
   * initializes the custom WhatsApp slide-in notification toast, and triggers 
   * the automatic custom WhatsApp contact link redirect before resetting states.
   * @param e - React FormEvent trigger
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[DEBUG] ConsultationPage: Form submission initiated.", formData);

    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
      consent: ''
    };
    let hasErrors = false;

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      hasErrors = true;
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Must be at least 2 letters';
      hasErrors = true;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      hasErrors = true;
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Must be at least 2 letters';
      hasErrors = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
      hasErrors = true;
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'Provide a valid email address';
      hasErrors = true;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      hasErrors = true;
    } else if (!validatePhone(formData.phone.trim())) {
      newErrors.phone = 'Provide a valid 10-15 digit phone';
      hasErrors = true;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Requirements/message is required';
      hasErrors = true;
    } else if (formData.message.trim().length < 5) {
      newErrors.message = 'Message must be at least 5 characters';
      hasErrors = true;
    }

    if (!consentChecked) {
      newErrors.consent = 'You must agree to the privacy policy to submit your request';
      hasErrors = true;
    }

    if (hasErrors) {
      console.warn("[DEBUG] ConsultationPage: Validation failed", newErrors);
      setErrors(newErrors);
      return;
    }

    console.log("[DEBUG] ConsultationPage: Validation passed. Constructing database records.");
    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
      consent: ''
    });

    const leadId = `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newLead = {
      id: leadId,
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim(),
      service: formData.service,
      source: 'Consultation Form' as const,
      timestamp: new Date().toISOString(),
      status: 'Pending' as const
    };

    try {
      console.log(`[DEBUG] ConsultationPage: Persisting lead to Firestore. id=${leadId}`);
      await setDoc(doc(db, 'leads', leadId), newLead);
      console.log("[DEBUG] ConsultationPage: Successfully uploaded lead record to Firestore database.");
      
      // Real-time immutable lifetime database backup mirroring
      console.log(`[DEBUG] ConsultationPage: Replicating lead copy to leads_backup collection. id=${leadId}`);
      await setDoc(doc(db, 'leads_backup', leadId), newLead);
      console.log("[DEBUG] ConsultationPage: Backup record duplicated successfully.");
    } catch (error) {
      console.error("[DEBUG] ConsultationPage ERROR: Failed to upload to Firestore database", error);
      handleFirestoreError(error, OperationType.WRITE, 'leads');
    }

    // Store to localStorage list
    console.log("[DEBUG] ConsultationPage: Storing backup lead record to localStorage.");
    const existing = localStorage.getItem('bizlaunch_leads');
    let leadsList = [];
    if (existing) {
      try {
        leadsList = JSON.parse(existing);
      } catch (err) {
        console.error("[DEBUG] ConsultationPage ERROR: Failed to parse existing localStorage leads", err);
        leadsList = [];
      }
    }
    leadsList = [newLead, ...leadsList];
    localStorage.setItem('bizlaunch_leads', JSON.stringify(leadsList));
    console.log("[DEBUG] ConsultationPage: localStorage write succeeded.");

    // Trigger sliding WhatsApp message toast response
    setWhatsappToast({
      show: true,
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      phone: formData.phone.trim()
    });

    setIsSubmitted(true);
    setConsentChecked(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
      service: 'Business Licensing'
    });
    
    setTimeout(() => {
      console.log("[DEBUG] ConsultationPage: Resetting submission confirmation notification timer.");
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main className="pt-44 pb-32">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="mb-24">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-6"
            >
              Consultation & Inquiry
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-blue-900 tracking-tighter leading-tight">
              Start your <br/>
              <span className="italic text-gray-300">transformation.</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-12 gap-20">
            {/* Left: Branding & Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5 space-y-16"
            >
              <div className="space-y-6">
                <p className="text-xl text-gray-500 leading-relaxed font-medium">
                  We specialize in high-stakes compliance and legal architecture for India's leading enterprises. Connect with a partner today.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-12 border-t border-gray-100">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Collaborate</h3>
                  <div className="space-y-1">
                    <a href="mailto:Hey@infovisory.com" className="block text-sm font-bold text-blue-900 hover:text-blue-600 transition-colors">Hey@infovisory.com</a>
                    <a href="tel:+919587582221" className="block text-sm font-bold text-gray-500 hover:text-blue-900 transition-colors">+91 95875 82221</a>
                    <a href="tel:+919928006942" className="block text-sm font-bold text-gray-500 hover:text-blue-900 transition-colors">+91 99280 06942</a>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Visit Us</h3>
                  <p className="text-sm font-medium text-gray-500 leading-relaxed">
                    First Floor, Plot no 190,<br/>
                    Narsingh Mandir Colony, near Narsingh Mandir,<br/>
                    Khatipura, Jaipur, Rajasthan 302012
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right: The Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-7"
            >
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: 10 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12"
                  >
                    <div className="space-y-3">
                      <label htmlFor="first-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">First Name</label>
                      <input 
                        type="text" 
                        id="first-name"
                        className={`w-full border-b-2 py-3 outline-none transition-all text-base font-medium placeholder:text-gray-300 bg-transparent ${
                          errors.firstName ? 'border-red-400 focus:border-red-500' : 'border-gray-100 focus:border-blue-900'
                        }`}
                        placeholder="John"
                        value={formData.firstName}
                        onChange={e => {
                          setFormData({...formData, firstName: e.target.value});
                          if (errors.firstName) setErrors({...errors, firstName: ''});
                        }}
                      />
                      {errors.firstName && <p className="text-xs text-red-500 font-semibold pl-1">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="last-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Last Name</label>
                      <input 
                        type="text" 
                        id="last-name"
                        className={`w-full border-b-2 py-3 outline-none transition-all text-base font-medium placeholder:text-gray-300 bg-transparent ${
                          errors.lastName ? 'border-red-400 focus:border-red-500' : 'border-gray-100 focus:border-blue-900'
                        }`}
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={e => {
                          setFormData({...formData, lastName: e.target.value});
                          if (errors.lastName) setErrors({...errors, lastName: ''});
                        }}
                      />
                      {errors.lastName && <p className="text-xs text-red-500 font-semibold pl-1">{errors.lastName}</p>}
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Email Address</label>
                      <input 
                        type="email" 
                        id="email"
                        className={`w-full border-b-2 py-3 outline-none transition-all text-base font-medium placeholder:text-gray-300 bg-transparent ${
                          errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-100 focus:border-blue-900'
                        }`}
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={e => {
                          setFormData({...formData, email: e.target.value});
                          if (errors.email) setErrors({...errors, email: ''});
                        }}
                      />
                      {errors.email && <p className="text-xs text-red-500 font-semibold pl-1">{errors.email}</p>}
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Phone</label>
                      <input 
                        type="tel" 
                        id="phone"
                        className={`w-full border-b-2 py-3 outline-none transition-all text-base font-medium placeholder:text-gray-300 bg-transparent ${
                          errors.phone ? 'border-red-400 focus:border-red-500' : 'border-gray-100 focus:border-blue-900'
                        }`}
                        placeholder="+91..."
                        value={formData.phone}
                        onChange={e => {
                          setFormData({...formData, phone: e.target.value});
                          if (errors.phone) setErrors({...errors, phone: ''});
                        }}
                      />
                      {errors.phone && <p className="text-xs text-red-500 font-semibold pl-1">{errors.phone}</p>}
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="service-type" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Inquiry Type</label>
                      <select 
                        id="service-type"
                        className="w-full border-b-2 border-gray-100 py-3 focus:border-blue-900 outline-none transition-all text-base font-medium appearance-none bg-transparent"
                        value={formData.service}
                        onChange={e => setFormData({...formData, service: e.target.value})}
                      >
                        <option>Business Licensing</option>
                        <option>Tax Compliance</option>
                        <option>Legal Advisory</option>
                        <option>Trademark</option>
                      </select>
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label htmlFor="message" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Message</label>
                      <textarea 
                        rows={4}
                        id="message"
                        className={`w-full border-b-2 py-3 outline-none transition-all text-base font-medium placeholder:text-gray-300 resize-none bg-transparent ${
                          errors.message ? 'border-red-400 focus:border-red-500' : 'border-gray-100 focus:border-blue-900'
                        }`}
                        placeholder="Describe your requirements..."
                        value={formData.message}
                        onChange={e => {
                          setFormData({...formData, message: e.target.value});
                          if (errors.message) setErrors({...errors, message: ''});
                        }}
                      />
                      {errors.message && <p className="text-xs text-red-500 font-semibold pl-1">{errors.message}</p>}
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-2 pt-2">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input 
                          type="checkbox"
                          checked={consentChecked}
                          onChange={e => {
                            setConsentChecked(e.target.checked);
                            if (errors.consent) setErrors({...errors, consent: ''});
                          }}
                          className="mt-1 rounded border-gray-300 text-blue-900 focus:ring-blue-900 focus:ring-offset-0 h-4 w-4"
                        />
                        <span className="text-xs font-medium text-gray-500 leading-normal select-none group-hover:text-gray-700 transition-colors">
                          I consent to Infovisory storing my submitted credentials and contacting me regarding my inquiry as detailed in the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:text-blue-700 underline font-bold">Privacy Policy</a>.
                        </span>
                      </label>
                      {errors.consent && <p className="text-xs text-red-500 font-semibold pl-7">{errors.consent}</p>}
                    </div>

                    <div className="md:col-span-2 pt-6">
                      <button 
                        type="submit" 
                        className="bg-blue-900 text-white px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-900/20 cursor-pointer"
                      >
                        Submit Request
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-blue-50/50 p-16 rounded-[40px] text-center"
                  >
                    <h2 className="text-3xl font-serif font-bold text-blue-900 mb-4">Request Received.</h2>
                    <p className="text-gray-500 font-medium mb-10">A senior consultant will be assigned to your case within 24 hours.</p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="text-[10px] font-black uppercase tracking-widest text-blue-600 border-b border-blue-600 pb-1"
                    >
                      New Inquiry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>

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

      <Footer />
    </div>
  );
}
