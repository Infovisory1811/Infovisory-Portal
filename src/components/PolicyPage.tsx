import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ArrowLeft, Clock, FileText, ChevronRight, Share2, Printer, Copy, MessageSquare, Mail, Download, Check, X } from 'lucide-react';
import { useSEO } from '../utils/seo';

interface PolicyData {
  title: string;
  content: string;
  lastUpdated: string;
}

const POLICY_CONTENT: Record<string, PolicyData> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    lastUpdated: 'May 27, 2026',
    content: `Infovisory holds the privacy and absolute confidentiality of your personal and professional credentials in the highest regard. This Privacy Policy details how we compile, utilize, disclose, and guard the information you share with us through our website and during the course of our dedicated consultancy services. By accessing our platform or engaging our consultancy firm, you acknowledge that you have read, understood, and consented to the guidelines and practices described in this Privacy Policy.

1. INFORMATION WE AMASS AND COLLECT

To deliver bespoke, high-quality consultative services, Infovisory may compile various forms of personal identifiers and professional parameters, including but not limited to the following categories:
- Contact Details: We collect identifiers such as your full name, primary email address, direct phone number, and physical mailing addresses.
- Professional Profiles: We record specific commercial details including your active job title, legal company name, and industry vertical.
- Financial & Billing Information: We utilize secure payment solutions to collect transaction particulars, billing details, and related metadata.
- Communication Preferences: We register your specific choices concerning legal circulars, service updates, and preferred communication pathways.
- Voluntary Data Submissions: We reference any additional documents, files, or information you voluntarily supply during consultations or inquiries.

2. HOW WE CONSUME AND PROCESS YOUR DATA

The personal databases amassed by Infovisory serve strictly to optimize our corporate solutions and refine your consultant experiences. Specifically, we process your information for these core objectives:
- Bespoke Solution Delivery: Facilitating, optimizing, and executing our legal corporate, tax, regulatory, and general consultancy services.
- Direct Client Relations: Maintaining open channels of communication, responding to expert inquiries, and providing continuous live support.
- Custom User Experiences: Personalizing, elevating, and tracking-optimizing your relative navigation quality across our web services.
- Secure Billing & Finances: Managing invoice creations, billing, standard accounting, and secure transaction recording.
- Strategic Industry Communications: Sending vital notifications, regulatory compliance newsletters, and promotional briefs related to our firm.
- Regulatory Compliance & Decency: Meeting standard legal duties, public filings, relevant statutory rules, and regulatory compliance audits.

3. SECURE DISCLOSURE AND INFORMATION SHARING

Infovisory guarantees that your personal data is never sold, leased, or rented to any third-party brokers for advertising or marketing campaigns. We share your information exclusively under these strict boundaries:
- Trusted Operational Assistants: Sharing credentials with secure cloud networks and external operators who directly help us execute assignments.
- Legal & Statutory Obligations: Complying with verified government mandates, active judicial decrees, legal proceedings, or audit parameters.
- Corporate Restructuring: Transferring essential legal data in connection with a business merger, consolidation, asset sale, or acquisition.
- Explicit Authorizations: Disclosing specific elements to third parties only after receiving your express, written, or explicit consent.

4. RIGOROUS DATA SECURITY MEASURES

Our safety teams deploy top-tier administrative, technical, and organizational security measures to prevent risks of unauthorized access, damage, alteration, or disclosure of your personal parameters. This contains secure database networks, modern firewalls, and data encryption. Even with these best-in-class defenses, no storage system or internet-facing transfer vector can be declared 100% impenetrable, and we cannot guarantee absolute security for your files.

5. YOUR STATUTORY PRIVACY RIGHTS AND CHOICES

As a valued associate of Infovisory, you retain total command over your information credentials. You find several direct privacy paths available to you:
- Record Corrections and Deletions: You can review, update, edit, or request the completely permanent deletion of your personal records at any time.
- Communication Opt-Outs: You can instantly unsubscribe from our promotional circulars and newsletters by clicking the active unsubscribe link.

6. REFLECTING REVISIONS AND FUTURE UPDATES

Infovisory reserves the right to revise, update, or entirely rewrite this Privacy Policy as statutory requirements and consultative standards evolve. When any changes take place, we will update the 'Last Updated' timestamp at the top of this policy page. We encourage you to visit this document periodically to remain updated on how we protect your confidential records.

7. CONNECT WITH OUR DATA COMPLIANCE CENTER

If you have any questions, compliance concerns, or formal feedback regarding your personal data or this Privacy Policy, please reach out to our team:
- Direct Email Support: Send your detail requests directly to Hey@infovisory.com.
- Telephone Helpline: Call our compliance officers at +91 9587582221 for live support.`
  },
  'terms-and-conditions': {
    title: 'Terms & Conditions',
    lastUpdated: 'May 14, 2024',
    content: `Welcome to Infovisory. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Infovisory relationship with you in relation to this website.

The term 'Infovisory' or 'us' or 'we' refers to the owner of the website. The term 'you' refers to the user or viewer of our website.

1. USE OF THE WEBSITE

The content of the pages of this website is for your general information and use only. It is subject to change without notice.

2. ACCURACY OF INFORMATION

Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose.

3. INTELLECTUAL PROPERTY

This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.

4. USER CONDUCT

Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.

5. LIMITATION OF LIABILITY

In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.`
  },
  'disclaimer-policy': {
    title: 'Disclaimer Policy',
    lastUpdated: 'May 14, 2024',
    content: `The information contained in this website is for general information purposes only. The information is provided by Infovisory and while we endeavour to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.

Any reliance you place on such information is therefore strictly at your own risk. In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.

Through this website you are able to link to other websites which are not under the control of Infovisory. We have no control over the nature, content and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.

Every effort is made to keep the website up and running smoothly. However, Infovisory takes no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control.`
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    lastUpdated: 'June 25, 2026',
    content: `Infovisory is committed to transparency in how we gather and handle data. This Cookie Policy explains how cookies, tracking pixels, and similar web tracking technologies are utilized across our website and administrative portals. By using our website, you consent to the placement and utilization of cookies as described in this policy.

1. INTRODUCTION AND SCOPE

Our website uses cookies and other tracing technologies to differentiate your browser from other visitors. This helps us ensure you have an optimized experience when navigating our tax, corporate compliance, and legal consultation pages. It also allows us to continuously monitor and improve page load metrics and platform performance.

2. WHAT ARE COOKIES

Cookies are small text files containing alphanumeric strings that are downloaded and stored on your computer, tablet, or mobile device by your web browser when you visit a website. They are returned to the originating website on subsequent visits, or to another website that recognizes them. Cookies serve numerous functional purposes, such as keeping you logged into secure portals, retaining user preferences, and facilitating analytics trackers.

3. TYPES OF COOKIES WE USE

Infovisory deploys both persistent and session-based cookies divided into the following functional categories:
- Essential & Necessary Cookies: These are crucial for core site navigation, secure portal log-ins, and standard page rendering. Without these, secure services like the Lead CRM Queue or Consultation Booking forms cannot function properly.
- Analytics & Performance Cookies: These help us count page visits, determine traffic sources, measure which services are popular, and spot user flow bottlenecks. We use these metrics purely to improve performance.
- Preference & Functionality Cookies: These enable our pages to remember choice parameters you make, such as selected states or preferences, to provide localized services.
- Marketing & Advertising Pixels: These track your browsing patterns to help third-party ad networks deliver relevant marketing campaigns, such as company registration briefs or GST advisory alerts.

4. MANAGING YOUR COOKIE PREFERENCES

You retain complete control over cookies on your devices. Most modern browsers let you customize your cookie configurations. You can adjust your browser settings to:
- Completely block all third-party cookies.
- Prompt you before accepting any new cookies.
- Clear all stored cookies upon closing your browser window.
Please note that if you choose to disable essential cookies, certain features, forms, or authenticated zones of our site (such as the Leads CRM Portal) may become inaccessible.

5. THIRD-PARTY ANALYTICS SERVICES

We integrate trustworthy, third-party analytics scripts like Google Analytics (GA4) on our website. These partners employ cookies to compile anonymous statistical aggregates regarding your interactions with our site. This tracking is governed entirely by their respective privacy standards.

6. CHANGES TO THIS COOKIE POLICY

Infovisory reserves the right to update this Cookie Policy at any time to reflect changing browser requirements, statutory updates, or internal tracking upgrades. We will post any amendments here and update the 'Last Updated' timestamp at the top of this document.

7. CONTACT US FOR COOKIE INQUIRIES

For any formal questions, requests, or concerns related to our use of cookie tracking technologies, please feel free to reach out to our technical team:
- Technical Support Email: Hey@infovisory.com
- Customer Support Line: +91 9587582221`
  },
  'security-policy': {
    title: 'Security Policy',
    lastUpdated: 'June 25, 2026',
    content: `Infovisory prioritizes the absolute security and integrity of your corporate records, billing transactions, and personal consultation documents. This Security Policy outlines the technical, physical, and administrative guardrails we maintain to defend our corporate-grade database infrastructure against modern threats and unauthorized access.

1. EXECUTIVE SECURITY COMMITMENT

We handle sensitive legal, corporate, and financial records for thousands of entrepreneurs. Our security systems are designed with defense-in-depth principles, ensuring multiple layers of protection cover your client data from intake to archival storage.

2. ENCRYPTION PROTOCOLS & SSL

All data exchanged between your browser and our servers is protected using Secure Sockets Layer (SSL) and Transport Layer Security (TLS 1.3) encryption in transit. Our database networks employ Advanced Encryption Standard (AES-256) encryption at rest. This ensures that even in the unlikely event of physical network interception, your private identifiers remain entirely secure and unreadable.

3. DATA ACCESS RESTRICTIONS & CONTROLS

We enforce a strict policy of least-privileged access for all internal staff:
- Only authorized corporate advisors and designated accountants can view incoming leads and consultation request details.
- Access to administrative dashboards, customer databases, and pricing configs requires Multi-Factor Authentication (MFA) via Firebase Authentication.
- All administrative operations, edits, and deletions are fully logged in our audit logs to trace authorized actions.

4. INFRASTRUCTURE & PHYSICAL SECURITY

Our applications and databases run on highly secure, enterprise-grade cloud environments managed by Google Cloud Platform (GCP). This infrastructure is housed in state-of-the-art data centers that maintain rigorous physical security measures, including biometric entry scanners, round-the-clock physical security guards, and automated threat detection sensors.

5. BACKUPS AND DISASTER RECOVERY

To prevent data loss from accidental deletion, physical hardware failure, or natural disasters, we maintain real-time database replication and automated daily backups:
- Customer leads and compliance checkout logs are backed up automatically to redundant, geographically isolated cloud servers.
- Disaster recovery playbooks are tested quarterly to ensure rapid service restoration with minimal Downtime.

6. SECURITY AUDITS & VULNERABILITY TESTING

We perform continuous automated scans of our application dependencies to spot and patch software vulnerabilities. We also schedule annual security reviews of our Firestore rules, authentication gateways, and API routes to ensure no open pathways remain.

7. REPORTING A SECURITY VULNERABILITY

If you are a security researcher or customer and believe you have discovered a potential security vulnerability in our platform, please report it to us immediately:
- Secure Vulnerability Intake: Hey@infovisory.com
- Dedicated Security Hotline: +91 9587582221
Please provide detailed replication steps and allow our response teams reasonable time to remediate the issue before public disclosure.`
  },
  'cancellation-refund-policy': {
    title: 'Cancellation & Refund Policy',
    lastUpdated: 'June 25, 2026',
    content: `Thank you for choosing Infovisory for your corporate registration, compliance management, and legal advisory services. We strive to deliver pristine, highly professional consultation solutions. Because our services involve immediate statutory applications, state filings, and direct expert labor, we maintain a clear policy regarding cancellations and refund eligibility.

1. COMPLIANCE & CONSULTANCY RETAINERS

All professional service retainers and compliance package fees paid to Infovisory are earned upon receipt, as they immediately trigger resource allocations, legal document preparation, and corporate advisor scheduling.

2. CANCELLATION REQUEST PROTOCOL

If you wish to cancel an active order, service ticket, or professional consultation retainer, you must submit a formal request:
- Submission Route: Write directly to our accounts team at Hey@infovisory.com.
- Mandatory Details: You must include your unique transaction ID, registered business name, company email, and a detailed reason for cancellation.
- Cut-off Window: Cancellation requests must be filed within 24 hours of checkout to be eligible for any partial or full fee reversal.

3. REFUND ELIGIBILITY & WINDOWS

Refund approvals are assessed strictly under these boundaries:
- Complete Refunds: Eligible only if no professional labor has been expended, no statutory forms have been prepared, and the cancellation request was submitted within the 24-hour cut-off window.
- Partial Refunds: If work has already been initiated (such as company name search, DSC drafting, or initial charter preparation) but not completed, we may offer a partial refund minus a processing fee of 20% of the package cost.
- No Refunds: Once statutory applications have been filed with government departments (including MCA, Income Tax Department, or GST Network), or after 24 hours from checkout, no refunds can be processed.

4. DEDUCTIONS AND STATUTORY GOVERNMENT FEES

Under all circumstances, any statutory fees paid directly to government portals (including but not limited to MCA filing fees, stamp duty, digital signature token costs, pan card processing fees, or tax portal charges) are entirely non-refundable. These fees are cleared directly to state authorities and cannot be recovered.

5. DISPUTE RESOLUTION MECHANISM

In the event of a dispute regarding refund amounts or service delivery milestones, our administrative committee will review your ticket history. Our primary goal is client satisfaction, and we will work with you to reach an equitable resolution, including offering store credit for alternative compliance services.

6. PROCESSING TIMELINES

Once a refund request is formally approved by our financial directors, the reversed amount will be credited back to your original payment method (credit card, bank account, or digital wallet) within 7 to 10 business days, depending on banking channel clear times.

7. CUSTOMER COMPLIANCE HELPLINE

For any immediate inquiries, questions, or clarification regarding our Cancellation & Refund Policy, please reach out to our finance desk:
- Direct Billing Support: Hey@infovisory.com
- Telephone Line: +91 9587582221`
  }
};

export default function PolicyPage() {
  const { slug } = useParams<{ slug: string }>();
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [showDownloadModal, setShowDownloadModal] = React.useState(false);
  const [toast, setToast] = React.useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showToastMsg = (msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };
  
  // Debug Log for Policy Page Route Loading
  React.useEffect(() => {
    console.log(`[DEBUG] PolicyPage: Route loaded with slug: "${slug}"`);
    if (slug) {
      if (POLICY_CONTENT[slug]) {
        console.log(`[DEBUG] PolicyPage: Successfully retrieved content for "${slug}"`);
      } else {
        console.error(`[DEBUG] PolicyPage ERROR: Content not found for slug "${slug}"`);
      }
    }
  }, [slug]);

  const policy = slug ? POLICY_CONTENT[slug] : null;

  useSEO(
    policy ? policy.title : 'Legal Policy',
    policy ? `${policy.title} details for Infovisory India Private Limited. Learn more about our statutory commitments, client data safety, and compliance rules.` : 'Infovisory legal policies, terms, disclaimer, and data privacy protocols.',
    slug ? `/${slug}` : '/policy'
  );

  // Extract sections for TOC
  const sections = useMemo(() => {
    if (!policy) return [];
    try {
      const splitContent = policy.content.split(/\r?\n\r?\n/);
      const extracted = splitContent
        .filter(p => /^\d+\./.test(p.trim()))
        .map(p => {
          const text = p.trim().split('\n')[0];
          return {
            id: text.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            title: text
          };
        });
      console.log(`[DEBUG] PolicyPage: Successfully parsed ${extracted.length} Table of Contents sections`);
      return extracted;
    } catch (err) {
      console.error(`[DEBUG] PolicyPage ERROR: Failed to parse Table of Contents sections`, err);
      return [];
    }
  }, [policy]);

  if (!policy) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] font-sans">
        <div className="pt-40 pb-20 max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-serif font-bold text-gray-900 mb-6 italic">Policy Not Found</h1>
            <p className="text-gray-500 mb-10 text-lg">The document you are looking for doesn't exist or has been moved.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-4 rounded-full font-medium hover:bg-blue-800 transition-all shadow-lg hover:shadow-blue-900/20">
              <ArrowLeft size={20} />
              Return Home
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f6] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Hero Section */}
      <section className="relative pt-44 pb-24 overflow-hidden border-b border-gray-100 bg-white">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            <Link 
              to="/" 
              className="group flex items-center gap-2 text-gray-400 hover:text-blue-900 font-medium text-sm mb-12 py-2 px-4 rounded-full bg-gray-50 border border-gray-100 transition-all hover:border-blue-100 hover:bg-blue-50/30"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold uppercase tracking-widest mb-6"
            >
              <FileText size={14} />
              Legal Document
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-8 tracking-tight leading-[1.1]">
              {policy.title}
            </h1>
            
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-gray-400 font-medium">
              <span className="flex items-center gap-2">
                <Clock size={16} />
                Last updated: <span className="text-gray-900">{policy.lastUpdated}</span>
              </span>
              <span className="h-4 w-[1px] bg-gray-200 hidden md:block"></span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                Status: <span className="text-gray-900">Effective</span>
              </span>
            </div>
          </motion.div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-100 rounded-full blur-[120px] opacity-20 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-100 rounded-full blur-[120px] opacity-20 translate-x-1/3 translate-y-1/3"></div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
          
          {/* Sidebar Navigation */}
          <aside className="sticky top-32 hidden lg:block">
            <div className="space-y-12">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-4">Contents</h3>
                <nav className="flex flex-col gap-1">
                  {sections.map((section, idx) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="group flex items-center justify-between text-sm py-2.5 px-4 rounded-xl text-gray-500 hover:text-blue-900 hover:bg-white border border-transparent hover:border-gray-100 transition-all font-medium"
                    >
                      <span className="truncate">{section.title}</span>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                    </a>
                  ))}
                </nav>
              </div>

              <div className="p-6 rounded-3xl bg-blue-900 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8"></div>
                <h4 className="text-lg font-serif font-bold mb-3 relative z-10 italic">Need assistance?</h4>
                <p className="text-blue-100/70 text-sm mb-6 relative z-10 leading-relaxed">Our compliance team is here to help you understand our policies better.</p>
                <div className="space-y-4 relative z-10">
                  <button 
                    onClick={() => setShowShareModal(true)} 
                    className="w-full flex items-center justify-center gap-2 bg-white text-blue-900 py-3 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <Share2 size={16} />
                    Share Policy
                  </button>
                  <button 
                    onClick={() => setShowDownloadModal(true)} 
                    className="w-full flex items-center justify-center gap-2 bg-blue-800 text-blue-50 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <Download size={16} />
                    Download Policy
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Policy Text */}
          <motion.article 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-none"
          >
            {policy.content.split(/\r?\n\r?\n/).map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              
              // Handle Section Headers (e.g., 1. WHAT INFORMATION...)
              if (/^\d+\./.test(trimmed)) {
                const sectionId = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '-');
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    id={sectionId}
                    className="scroll-mt-32 group"
                  >
                    <div className="flex items-center gap-4 mb-8 mt-16 first:mt-0">
                      <span className="w-10 h-10 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-700 font-bold text-base font-serif italic border border-blue-100">
                        {trimmed.split('.')[0]}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
                        {trimmed.split('.').slice(1).join('.').trim()}
                      </h2>
                    </div>
                  </motion.div>
                );
              }

              // Handle Sub-headers (All caps)
              if (/^[A-Z\s\?]+$/.test(trimmed) && trimmed.length > 3) {
                  return <h3 key={idx} className="text-xl font-serif font-bold text-blue-800 mt-12 mb-6 border-l-4 border-blue-600 pl-6">{trimmed}</h3>;
              }

              // If it's a regular paragraph block, parse its lines for embedded list items starting with "- "
              const lines = trimmed.split(/\r?\n/);
              const renderedElements: React.ReactNode[] = [];
              let currentList: string[] = [];

              const flushList = (key: string) => {
                if (currentList.length > 0) {
                  renderedElements.push(
                    <ul key={key} className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 list-none p-0 w-full animate-fadeIn">
                      {currentList.map((item, i) => (
                        <li key={i} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                          <div className="min-w-[8px] h-[8px] rounded-full bg-blue-400 mt-2.5 transition-all group-hover:scale-125 group-hover:bg-emerald-500"></div>
                          <span className="text-gray-600 font-medium leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  );
                  currentList = [];
                }
              };

              lines.forEach((line, lineIdx) => {
                const lineTrimmed = line.trim();
                if (lineTrimmed.startsWith('- ')) {
                  currentList.push(lineTrimmed.replace('- ', ''));
                } else {
                  flushList(`list-${idx}-${lineIdx}`);
                  if (lineTrimmed) {
                    renderedElements.push(
                      <p 
                        key={`p-${idx}-${lineIdx}`} 
                        className={`mb-8 text-base text-gray-500 font-medium leading-[1.8] whitespace-pre-line ${idx === 0 && lineIdx === 0 ? 'first-letter:text-4xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-blue-900 first-letter:font-bold' : ''}`}
                      >
                        {lineTrimmed}
                      </p>
                    );
                  }
                }
              });
              flushList(`list-${idx}-final`);

              return <div key={idx} className="w-full">{renderedElements}</div>;
            })}

            {/* Final Contact Card */}
            <div className="mt-20 p-10 md:p-16 rounded-[40px] bg-white border border-blue-50 shadow-2xl shadow-blue-900/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full translate-x-1/2 -translate-y-1/2 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
               <div className="relative z-10">
                 <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6 italic">Got more questions?</h2>
                 <p className="text-lg text-gray-500 font-medium mb-10 max-w-2xl leading-relaxed">
                   Transparency is our priority. If any section of this policy is unclear, our compliance officers are ready to clarify them for you.
                 </p>
                 <div className="flex flex-wrap gap-4">
                   <a href="mailto:Hey@infovisory.com" className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg hover:shadow-blue-900/20">
                     Contact Compliance Office
                   </a>
                   <button 
                     onClick={() => setShowDownloadModal(true)} 
                     className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 hover:text-blue-950 transition-all border border-gray-200 inline-flex items-center gap-2 shadow-sm cursor-pointer"
                   >
                     <Download size={18} className="text-blue-900 animate-pulse" />
                     Download Policy Document
                   </button>
                   <button 
                     onClick={() => setShowShareModal(true)} 
                     className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 hover:text-blue-950 transition-all border border-gray-200 inline-flex items-center gap-2 shadow-sm cursor-pointer"
                   >
                     <Share2 size={18} className="text-emerald-500" />
                     Share This Policy
                   </button>
                 </div>
               </div>
            </div>
          </motion.article>

        </div>
      </main>

      {/* Embedded print stylesheets for immaculate printing as PDF */}
      <style>{`
        @media print {
          /* General Print Settings */
          body, html {
            background: white !important;
            color: #111827 !important;
            font-family: system-ui, -apple-system, sans-serif !important;
            font-size: 11pt !important;
            line-height: 1.6 !important;
          }
          
          /* Omit extraneous UI elements completely to resemble formal legal briefs */
          header, #main-nav, nav, footer, #footer, aside, .no-print, button, a[href^="mailto"], .absolute, .blur-[120px], .blur-[80px] {
            display: none !important;
          }
          
          /* Full printable sheet bounds */
          main {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          article {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }

          h1 {
            font-size: 28pt !important;
            line-clamp: none !important;
            text-align: center !important;
            margin-bottom: 20px !important;
          }

          h2 {
            font-size: 16pt !important;
            margin-top: 30px !important;
            margin-bottom: 15px !important;
            page-break-after: avoid !important;
          }

          p {
            font-size: 11pt !important;
            margin-bottom: 12px !important;
            color: #374151 !important;
          }

          ul {
            grid-template-columns: 1fr !important;
            display: block !important;
            margin-top: 15px !important;
            margin-bottom: 15px !important;
          }

          li {
            page-break-inside: avoid !important;
            background: white !important;
            border: 1px solid #e5e7eb !important;
            padding: 12px !important;
            margin-bottom: 8px !important;
            display: block !important;
          }
        }
      `}</style>

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] w-full max-w-md p-8 relative z-50 shadow-2xl border border-gray-100 font-sans"
            >
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#ff6122] flex items-center justify-center">
                  <Share2 size={20} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 italic">Share Policy</h3>
              </div>
              <p className="text-gray-500 text-sm mb-6 font-medium leading-relaxed">
                Send "{policy.title}" directly to your staff, partners, or legal registry coordinates.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {/* Copy link */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToastMsg('Policy link copied to clipboard!');
                    setShowShareModal(false);
                  }}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 bg-gray-50/40 hover:bg-blue-50/30 hover:border-blue-100 transition-all font-medium text-gray-700 text-sm gap-2 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Copy size={18} />
                  </div>
                  Copy Link
                </button>

                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Hi, please review the official ' + policy.title + ' of Infovisory here: ' + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowShareModal(false)}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 bg-gray-50/40 hover:bg-green-50/30 hover:border-green-100 transition-all font-medium text-gray-700 text-sm gap-2 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare size={18} />
                  </div>
                  WhatsApp
                </a>

                {/* Email link */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(policy.title + ' | Infovisory')}&body=${encodeURIComponent('Please find the official statement regarding ' + policy.title + ' online here: ' + window.location.href)}`}
                  onClick={() => setShowShareModal(false)}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 bg-gray-50/40 hover:bg-orange-50/30 hover:border-orange-100 transition-all font-medium text-gray-700 text-sm gap-2 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-[#ff6122] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail size={18} />
                  </div>
                  Email Client
                </a>

                {/* Native OS share option */}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: policy.title,
                        text: `Review the official ${policy.title} of Infovisory`,
                        url: window.location.href,
                      }).catch(err => console.log('Error sharing:', err));
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      showToastMsg('Policy link copied to clipboard!');
                    }
                    setShowShareModal(false);
                  }}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 bg-gray-50/40 hover:bg-purple-50/30 hover:border-purple-100 transition-all font-medium text-gray-700 text-sm gap-2 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Share2 size={18} />
                  </div>
                  System Share
                </button>
              </div>

              {/* URL Preview */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-mono truncate mr-4 max-w-[220px]">{window.location.href}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToastMsg('Link copied!');
                    setShowShareModal(false);
                  }}
                  className="text-xs font-black text-blue-900 hover:text-blue-700 transition-colors uppercase tracking-wider whitespace-nowrap cursor-pointer"
                >
                  Copy URL
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Download and Print Options Dialogue */}
      <AnimatePresence>
        {showDownloadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDownloadModal(false)}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] w-full max-w-lg p-8 relative z-50 shadow-2xl border border-gray-100 font-sans"
            >
              <button
                onClick={() => setShowDownloadModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center">
                  <Download size={20} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 italic">Download Choices</h3>
              </div>
              <p className="text-gray-500 text-sm mb-6 font-medium">Export "{policy.title}" in your preferred structured format for offline convenience.</p>

              <div className="space-y-3.5 mb-6">
                {/* Print/Save to PDF */}
                <button
                  onClick={() => {
                    setShowDownloadModal(false);
                    setTimeout(() => {
                      window.print();
                    }, 400);
                  }}
                  className="w-full flex items-center gap-4 p-4.5 rounded-2xl border border-gray-100 bg-gray-50/40 hover:bg-blue-50/40 hover:border-blue-100 transition-all text-left group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Printer size={18} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-gray-900 text-base leading-tight mb-1 flex items-center gap-2">
                      Print or Print-Save to PDF
                      <span className="text-[9px] uppercase bg-emerald-500 text-white px-1.5 py-0.5 rounded font-sans font-bold tracking-wider">Pristine PDF</span>
                    </h4>
                    <p className="text-xs text-gray-400 font-medium">Summons browser printable view. Select 'Save as PDF' inside your printable layout targets.</p>
                  </div>
                </button>

                {/* Plain Text transcript */}
                <button
                  onClick={() => {
                    const cleanContent = policy.content;
                    const date = policy.lastUpdated;
                    const title = policy.title;
                    const textContent = `${title}\nLast Updated: ${date}\n${'='.repeat(title.length)}\n\n${cleanContent}`;
                    
                    const element = document.createElement("a");
                    const fileBlob = new Blob([textContent], {type: 'text/plain;charset=utf-8'});
                    element.href = URL.createObjectURL(fileBlob);
                    element.download = `${slug}-policy-framework.txt`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);

                    showToastMsg('Plain Text (.txt) downloaded successfully!');
                    setShowDownloadModal(false);
                  }}
                  className="w-full flex items-center gap-4 p-4.5 rounded-2xl border border-gray-100 bg-gray-50/40 hover:bg-orange-50/40 hover:border-orange-100 transition-all text-left group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-orange-50 text-[#ff6122] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Download size={18} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-gray-900 text-base leading-tight mb-1">Download Plain Text (.txt)</h4>
                    <p className="text-xs text-gray-400 font-medium font-sans">Saves complete legal brief as clean plain text. Recommended for general filing.</p>
                  </div>
                </button>

                {/* Rich format doc offline */}
                <button
                  onClick={() => {
                    const formattedBody = policy.content.replace(/\r?\n\r?\n/g, '<br/><br/>').replace(/\r?\n/g, '<br/>');
                    const wordDocumentHtml = `
                      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                      <head><title>${policy.title}</title><style>body {font-family: Arial, sans-serif; line-height: 1.6; color: #333333; padding: 20px;} h1{color:#1e3a8a;}</style></head>
                      <body>
                        <h1>${policy.title}</h1>
                        <p><strong>Last Updated:</strong> ${policy.lastUpdated}</p>
                        <p><strong>Status:</strong> Effective Statement</p>
                        <hr/>
                        <div style="margin-top:20px;">${formattedBody}</div>
                      </body>
                      </html>
                    `;
                    
                    const element = document.createElement("a");
                    const fileBlob = new Blob([wordDocumentHtml], {type: 'application/msword;charset=utf-8'});
                    element.href = URL.createObjectURL(fileBlob);
                    element.download = `${slug}-policy-statement.doc`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);

                    showToastMsg('MS Word (.doc) briefing exported successfully!');
                    setShowDownloadModal(false);
                  }}
                  className="w-full flex items-center gap-4 p-4.5 rounded-2xl border border-gray-100 bg-gray-50/40 hover:bg-emerald-50/40 hover:border-emerald-100 transition-all text-left group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-gray-900 text-base leading-tight mb-1">Download Word Document (.doc)</h4>
                    <p className="text-xs text-gray-400 font-medium">Export to rich document compatible offline with corporate word software suite processors.</p>
                  </div>
                </button>
              </div>

              <div className="bg-blue-50/45 rounded-2xl p-4 border border-blue-105 flex items-start gap-3">
                <span className="text-xs text-blue-900 font-semibold leading-relaxed">
                  💡 Note: The generated print structure utilizes dedicated stylesheets that automatically strip navigation grids, aside cards, and footers to present a professional legal layout of "{policy.title}".
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Interactive Notification Toast */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-10 right-6 md:right-10 z-50 flex items-center gap-3.5 bg-gray-950 text-white px-5 py-4 rounded-[20px] shadow-3xl text-sm font-semibold max-w-sm border border-gray-800"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Check size={14} className="stroke-[3]" />
            </div>
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

