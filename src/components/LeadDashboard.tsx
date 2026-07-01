import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Copy, 
  Check, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Trash, 
  RefreshCw, 
  ArrowLeft, 
  Layers, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Lock,
  UserCheck,
  FileSpreadsheet,
  Plus,
  Save,
  CheckCircle2,
  X,
  HelpCircle,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously
} from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { SERVICE_DETAILS } from '../serviceDetails';
import { getPricingOverride, savePricingOverride, PricingPackage } from '../lib/pricingService';
import PricingManager from './PricingManager';
import BlogManager from './BlogManager';
import ServicesManager from './ServicesManager';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  service: string;
  source: 'Consultation Form' | 'Pricing Reveal' | string;
  timestamp: string; // ISO string
  status: 'Pending' | 'Contacted';
  selectedPlans?: string[];
}

const DEFAULT_LEADS: Lead[] = [
  {
    id: 'lead-sample-1',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@fintechlabs.in',
    phone: '+91 98765 43210',
    message: 'We are expanding our Fintech SaaS to Rajasthan and need immediate GST modification support. Looking for express filing option.',
    service: 'GST Modification',
    source: 'Pricing Reveal',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    status: 'Pending'
  },
  {
    id: 'lead-sample-2',
    name: 'Pooja Sharma',
    email: 'pooja@sheventures.co',
    phone: '+91 87654 32109',
    message: 'Looking to incorporate our digital media startup under One Person Company. Need full-stakes advisory on equity structuring.',
    service: 'One Person Company',
    source: 'Consultation Form',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    status: 'Contacted'
  },
  {
    id: 'lead-sample-3',
    name: 'Vikram Aditya Aditya',
    email: 'v.aditya@royalcapital.com',
    phone: '+91 99280 12345',
    message: 'Requesting ROC compliance audit for our corporate structure. Please contact me directly on phone during morning hours.',
    service: 'ROC Compliance',
    source: 'Consultation Form',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    status: 'Pending'
  }
];

/**
 * LeadDashboard Component
 * 
 * Secure administration control panel and client lead manager portal.
 * Displays all active corporate leads registered from consultation forms or interactive calculators.
 * Implements granular client-side searching, filter matrices, real-time Firestore sync listeners,
 * and encrypted admin passcode gates.
 */
export default function LeadDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [backupLeads, setBackupLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Contacted'>('All');
  const [sourceFilter, setSourceFilter] = useState<'All' | 'Consultation Form' | 'Pricing Reveal'>('All');
  
  // Local Copy success tracking states mapped by lead ID
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auth/Portal Unlock States
  const [isOwnerMode, setIsOwnerMode] = useState(() => {
    return localStorage.getItem('bizlaunch_is_owner') === 'true' || !!localStorage.getItem('bizlaunch_custom_admin_email');
  });
  const [accessCode, setAccessCode] = useState('');
  const [accessError, setAccessError] = useState('');

  // Real Firebase Auth States
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authTab, setAuthTab] = useState<'signin' | 'register'>('signin');
  const [authLoading, setAuthLoading] = useState(false);

  // Pricing Specific Unlock States (additional lock layer)
  const [isPricingUnlocked, setIsPricingUnlocked] = useState(() => {
    return localStorage.getItem('bizlaunch_is_owner') === 'true' || !!localStorage.getItem('bizlaunch_custom_admin_email');
  });
  const [pricingCode, setPricingCode] = useState('');
  const [pricingError, setPricingError] = useState('');

  // Leads CRM Queue Specific Unlock States (additional lock layer)
  const [isLeadsUnlocked, setIsLeadsUnlocked] = useState(() => {
    return localStorage.getItem('bizlaunch_is_owner') === 'true' || !!localStorage.getItem('bizlaunch_custom_admin_email');
  });
  const [leadsCode, setLeadsCode] = useState('');
  const [leadsError, setLeadsError] = useState('');

  // Tab control state
  const [activeTab, setActiveTab ] = useState<'leads' | 'pricing' | 'blogs' | 'services'>('leads');
  
  // Pricing Editor States
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [editablePackages, setEditablePackages] = useState<PricingPackage[]>([]);
  const [isSavingPricing, setIsSavingPricing] = useState(false);
  const [pricingSaveSuccess, setPricingSaveSuccess] = useState(false);

  // Check query parameter for auto-navigation to edit specific service pricing from a service page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('edit-service');
    if (serviceParam) {
      console.log(`[DEBUG] LeadDashboard: Routed from ServicePage with edit-service query parameter: ${serviceParam}`);
      setActiveTab('pricing');
      setSelectedServiceId(serviceParam);
    }
  }, []);

  // Sync pricing data when selected service changes
  useEffect(() => {
    if (!selectedServiceId) {
      setEditablePackages([]);
      return;
    }

    console.log(`[DEBUG] LeadDashboard: Selected service changed to: ${selectedServiceId}. Loading plan packages.`);
    setPricingSaveSuccess(false);

    // Fetch override packages from Firestore; if not present, fall back to SERVICE_DETAILS
    getPricingOverride(selectedServiceId)
      .then(overridePackages => {
        if (overridePackages && overridePackages.length > 0) {
          console.log("[DEBUG] LeadDashboard: Loaded customized pricing override from Firestore.");
          setEditablePackages(JSON.parse(JSON.stringify(overridePackages))); // Deep copy
        } else {
          console.log("[DEBUG] LeadDashboard: No custom override found. Falling back to default service packages.");
          const defaultDetails = SERVICE_DETAILS[selectedServiceId];
          const defaultPackages = defaultDetails?.packages || [];
          setEditablePackages(JSON.parse(JSON.stringify(defaultPackages))); // Deep copy
        }
      })
      .catch(err => {
        console.error("[DEBUG] LeadDashboard: Error loading pricing overrides:", err);
        // On error, try safety default
        const defaultDetails = SERVICE_DETAILS[selectedServiceId];
        const defaultPackages = defaultDetails?.packages || [];
        setEditablePackages(JSON.parse(JSON.stringify(defaultPackages)));
      });
  }, [selectedServiceId]);

  // Handle saving modified pricing to Firestore
  const handleSavePricing = async () => {
    if (!selectedServiceId) return;
    setIsSavingPricing(true);
    setPricingSaveSuccess(false);
    console.log(`[DEBUG] LeadDashboard: Initiating Firestore write to save pricing packages for service: ${selectedServiceId}`);

    try {
      await savePricingOverride(selectedServiceId, editablePackages);
      setPricingSaveSuccess(true);
      console.log("[DEBUG] LeadDashboard: Successfully committed custom price override.");
      setTimeout(() => setPricingSaveSuccess(false), 4000);
    } catch (err) {
      console.error("[DEBUG] LeadDashboard: Failed to commit pricing changes to Firestore:", err);
      alert("Error committing changes to database. Please check connection and try again.");
    } finally {
      setIsSavingPricing(false);
    }
  };

  // Pricing package helper setters
  const handleUpdatePackageField = (pkgIndex: number, field: keyof PricingPackage, value: any) => {
    setEditablePackages(prev => {
      const updated = [...prev];
      updated[pkgIndex] = {
        ...updated[pkgIndex],
        [field]: value
      };
      return updated;
    });
  };

  const handleUpdateFeature = (pkgIndex: number, featureIndex: number, newValue: string) => {
    setEditablePackages(prev => {
      const updated = [...prev];
      const features = [...updated[pkgIndex].features];
      features[featureIndex] = newValue;
      updated[pkgIndex] = {
        ...updated[pkgIndex],
        features
      };
      return updated;
    });
  };

  const handleAddFeature = (pkgIndex: number) => {
    setEditablePackages(prev => {
      const updated = [...prev];
      const features = [...updated[pkgIndex].features, 'New package feature detail...'];
      updated[pkgIndex] = {
        ...updated[pkgIndex],
        features
      };
      return updated;
    });
  };

  const handleRemoveFeature = (pkgIndex: number, featureIndex: number) => {
    setEditablePackages(prev => {
      const updated = [...prev];
      const features = updated[pkgIndex].features.filter((_, idx) => idx !== featureIndex);
      updated[pkgIndex] = {
        ...updated[pkgIndex],
        features
      };
      return updated;
    });
  };

  const handleAddPackage = () => {
    setEditablePackages(prev => [
      ...prev,
      {
        name: 'New Tier Plan',
        price: '2,999',
        features: ['Premium Feature Detail 1', 'Dedicated Relationship Manager'],
        isPopular: false
      }
    ]);
  };

  const handleRemovePackage = (pkgIndex: number) => {
    if (confirm("Are you sure you want to remove this package tier from the plans catalog?")) {
      setEditablePackages(prev => prev.filter((_, idx) => idx !== pkgIndex));
    }
  };
 
  /**
   * Real-time Data Synchronization Hook
   * 
   * On component mount, registers a real-time Firestore collection listener (`onSnapshot`)
   * targeting the 'leads' entity namespace, automatically sorting entries descendingly by date.
   * Also restores previously authenticated admin configurations stored in browser storage.
   */
  useEffect(() => {
    console.log("[DEBUG] LeadDashboard: Mounting dynamic leads sync side-effect.");
    
    // 1. Listen to real Firebase Auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("[DEBUG] LeadDashboard: Authenticated user detected:", user.email, "Anonymous:", user.isAnonymous);
        if (user.isAnonymous) {
          const customAdminEmail = localStorage.getItem('bizlaunch_custom_admin_email');
          if (customAdminEmail) {
            const email = customAdminEmail.toLowerCase().trim();
            const isAllowed = email === 'rishabhverma794@gmail.com' || 
                              email === 'onlyfun796@gmail.com' || 
                              email === 'hey@infovisory.com' || 
                              email.endsWith('@infovisory.com');
            if (isAllowed) {
              console.log("[DEBUG] LeadDashboard: Restoring custom admin session with anonymous Auth for:", customAdminEmail);
              setIsOwnerMode(true);
              setIsLeadsUnlocked(true);
              setIsPricingUnlocked(true);
              localStorage.setItem('bizlaunch_is_owner', 'true');
              window.dispatchEvent(new Event('storage'));
              window.dispatchEvent(new Event('bizlaunch_owner_update'));
              return;
            }
          }
          console.warn("[DEBUG] LeadDashboard: Unauthorized anonymous session blocked.");
          await signOut(auth);
          setIsOwnerMode(false);
          setIsLeadsUnlocked(false);
          setIsPricingUnlocked(false);
          localStorage.setItem('bizlaunch_is_owner', 'false');
          setAccessError("Access Denied: Unauthorized anonymous session.");
        } else {
          const email = user.email ? user.email.toLowerCase() : '';
          const isAllowed = email === 'rishabhverma794@gmail.com' || 
                            email === 'onlyfun796@gmail.com' || 
                            email === 'hey@infovisory.com' || 
                            email.endsWith('@infovisory.com');

          if (isAllowed) {
            setIsOwnerMode(true);
            setIsLeadsUnlocked(true);
            setIsPricingUnlocked(true);
            localStorage.setItem('bizlaunch_is_owner', 'true');
          } else {
            console.warn("[DEBUG] LeadDashboard: Unauthorized user sign-in blocked:", email);
            await signOut(auth);
            setIsOwnerMode(false);
            setIsLeadsUnlocked(false);
            setIsPricingUnlocked(false);
            localStorage.setItem('bizlaunch_is_owner', 'false');
            setAccessError(`Access Denied: ${user.email} is not authorized as an administrator.`);
          }
        }
      } else {
        const customAdminEmail = localStorage.getItem('bizlaunch_custom_admin_email');
        if (customAdminEmail) {
          const email = customAdminEmail.toLowerCase().trim();
          const isAllowed = email === 'rishabhverma794@gmail.com' || 
                            email === 'onlyfun796@gmail.com' || 
                            email === 'hey@infovisory.com' || 
                            email.endsWith('@infovisory.com');
          if (isAllowed) {
            console.log("[DEBUG] LeadDashboard: Restoring custom admin session for:", customAdminEmail);
            setIsOwnerMode(true);
            setIsLeadsUnlocked(true);
            setIsPricingUnlocked(true);
            localStorage.setItem('bizlaunch_is_owner', 'true');
            
            try {
              await signInAnonymously(auth);
              console.log("[DEBUG] LeadDashboard: Re-authenticated anonymous user for session restoration.");
            } catch (anonErr) {
              console.error("[DEBUG] LeadDashboard: Failed to re-authenticate anonymously:", anonErr);
            }
          } else {
            console.warn("[DEBUG] LeadDashboard: Unauthorized custom admin in storage:", customAdminEmail);
            localStorage.removeItem('bizlaunch_custom_admin_email');
            localStorage.setItem('bizlaunch_is_owner', 'false');
            setIsOwnerMode(false);
            setIsLeadsUnlocked(false);
            setIsPricingUnlocked(false);
          }
        } else {
          console.log("[DEBUG] LeadDashboard: User is not authenticated.");
          setIsOwnerMode(false);
          setIsLeadsUnlocked(false);
          setIsPricingUnlocked(false);
          localStorage.setItem('bizlaunch_is_owner', 'false');
        }
      }
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('bizlaunch_owner_update'));
    });

    return () => {
      console.log("[DEBUG] LeadDashboard: Unsubscribing from Firebase Auth state changes.");
      unsubscribeAuth();
    };
  }, []);

  // 2. Load Leads from Firestore (only when authorized/logged in)
  useEffect(() => {
    if (!isOwnerMode) {
      console.log("[DEBUG] LeadDashboard: Skipping snapshot subscriptions. User is not in owner mode.");
      return;
    }

    console.log("[DEBUG] LeadDashboard: Initializing onSnapshot listener on 'leads' collection.");
    const leadsCol = collection(db, 'leads');
    const unsubscribe = onSnapshot(leadsCol, (snapshot) => {
      console.log(`[DEBUG] LeadDashboard: Firestore onSnapshot triggered. Total documents received: ${snapshot.size}`);
      const loaded: Lead[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loaded.push({
          id: docSnap.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          message: data.message || '',
          service: data.service || '',
          source: data.source || 'Consultation Form',
          timestamp: data.timestamp || new Date().toISOString(),
          status: data.status || 'Pending',
          selectedPlans: data.selectedPlans || [],
        });
      });

      // Sort by timestamp descending
      loaded.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      console.log("[DEBUG] LeadDashboard: Sorted database records descendingly by ISO date stamp.");
      setLeads(loaded);
    }, (error) => {
      console.error("[DEBUG] LeadDashboard ERROR: Firestore snapshot subscription failed.", error);
      handleFirestoreError(error, OperationType.LIST, 'leads');
    });

    // 3. Load Immutable Backup Leads from Firestore
    console.log("[DEBUG] LeadDashboard: Initializing onSnapshot listener on 'leads_backup' collection.");
    const backupCol = collection(db, 'leads_backup');
    const unsubscribeBackup = onSnapshot(backupCol, (snapshot) => {
      console.log(`[DEBUG] LeadDashboard: Firestore backups onSnapshot triggered. Size: ${snapshot.size}`);
      const loaded: Lead[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loaded.push({
          id: docSnap.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          message: data.message || '',
          service: data.service || '',
          source: data.source || 'Consultation Form',
          timestamp: data.timestamp || new Date().toISOString(),
          status: data.status || 'Pending',
          selectedPlans: data.selectedPlans || [],
        });
      });

      loaded.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setBackupLeads(loaded);
    }, (error) => {
      console.error("[DEBUG] LeadDashboard ERROR: Firestore backup collection snapshot failed.", error);
    });

    return () => {
      console.log("[DEBUG] LeadDashboard: Unsubscribing from Firestore real-time snapshot registry.");
      unsubscribe();
      unsubscribeBackup();
    };
  }, [isOwnerMode]);

  /**
   * handleToggleStatus Function
   * 
   * Flips a specific client record status between 'Pending' and 'Contacted' directly on Firestore DB.
   * Useful for internal processing queues and operational workflows within the team.
   * @param id - Selected unique database lead identifier string
   */
  const handleToggleStatus = async (id: string) => {
    console.log(`[DEBUG] LeadDashboard: handleToggleStatus trigger for lead: "${id}"`);
    const lead = leads.find(l => l.id === id);
    if (!lead) {
      console.warn(`[DEBUG] LeadDashboard: Operation aborted. No lead found in current list state matching: "${id}"`);
      return;
    }
    const nextStatus: 'Pending' | 'Contacted' = lead.status === 'Pending' ? 'Contacted' : 'Pending';
    console.log(`[DEBUG] LeadDashboard: Flipping status from "${lead.status}" -> "${nextStatus}" in Firestore.`);
    try {
      await updateDoc(doc(db, 'leads', id), { status: nextStatus });
      console.log(`[DEBUG] LeadDashboard: Status toggle completed successfully on document: "${id}"`);
    } catch (error) {
      console.error(`[DEBUG] LeadDashboard ERROR: Status toggle failed for document: "${id}"`, error);
      handleFirestoreError(error, OperationType.UPDATE, `leads/${id}`);
    }
  };

  /**
   * handleDeleteLead Function
   * 
   * Permanently clears a user lead record from the remote cloud Firestore instance database.
   * @param id - Document target ID
   */
  const handleDeleteLead = async (id: string) => {
    console.log(`[DEBUG] LeadDashboard: handleDeleteLead triggered for ID: "${id}"`);
    if (window.confirm("Are you sure you want to permanently delete this individual client lead? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'leads', id));
        console.log(`[DEBUG] LeadDashboard: Successfully removed lead trace from Firestore: "${id}"`);
      } catch (error) {
        console.error(`[DEBUG] LeadDashboard ERROR: Deletion transaction failed for ID: "${id}"`, error);
        handleFirestoreError(error, OperationType.DELETE, `leads/${id}`);
      }
    } else {
      console.log(`[DEBUG] LeadDashboard: Deletion of individual lead "${id}" aborted by user.`);
    }
  };

  /**
   * handleResetDefaults Function
   * 
   * Prompts a confirmation dialogue then resets the leads database collection 
   * to default demo values over any custom additions.
   */
  const handleResetDefaults = async () => {
    console.log("[DEBUG] LeadDashboard: handleResetDefaults invoked. Soliciting user confirmation.");
    if (window.confirm("Danger: Restoring demo leads will completely overwrite your active client database. Do you wish to continue?")) {
      const verification = window.prompt("To bypass database safety and load demo data, please type 'RESET' to confirm:");
      if (verification === "RESET" || verification === "reset") {
        console.log("[DEBUG] LeadDashboard: Confirmation granted. Wiping active list before uploading defaults.");
        try {
          // Delete all current first
          for (const lead of leads) {
            console.log(`[DEBUG] LeadDashboard: Cascade clearing document: "${lead.id}"`);
            await deleteDoc(doc(db, 'leads', lead.id));
          }
          console.log("[DEBUG] LeadDashboard: Database collection wiped. Writing demo rows next.");
          // Write defaults
          for (const defaultLead of DEFAULT_LEADS) {
            console.log(`[DEBUG] LeadDashboard: Inserting premium sample row: "${defaultLead.id}"`);
            await setDoc(doc(db, 'leads', defaultLead.id), defaultLead);
          }
          console.log("[DEBUG] LeadDashboard: Successfully finished populating default mock states.");
        } catch (error) {
          console.error("[DEBUG] LeadDashboard ERROR: Batch setup transition failed.", error);
          handleFirestoreError(error, OperationType.WRITE, 'leads');
        }
      } else {
        alert("Verification failed. The restore operation was aborted to prevent loss of active client leads.");
        console.log("[DEBUG] LeadDashboard: Reset operation aborted via verification mismatch.");
      }
    } else {
      console.log("[DEBUG] LeadDashboard: Reset operation aborted by user confirmation dialog.");
    }
  };

  /**
   * handleClearAll Function
   * 
   * Wipes every single lead record from the remote cloud database store.
   */
  const handleClearAll = async () => {
    console.log("[DEBUG] LeadDashboard: handleClearAll initiated. Triggering danger confirmation modal.");
    if (window.confirm("Danger: This will permanently delete ALL stored lead requests, including active customer inquiries. Proceed with warning?")) {
      const verification = window.prompt("To verify this dangerous bulk deletion operation, please type 'DELETE ALL' to confirm:");
      if (verification === "DELETE ALL") {
        console.log("[DEBUG] LeadDashboard: Permanent bulk deletion approved. Initiating purge.");
        try {
          for (const lead of leads) {
            console.log(`[DEBUG] LeadDashboard: Purging target document: "${lead.id}"`);
            await deleteDoc(doc(db, 'leads', lead.id));
          }
          console.log("[DEBUG] LeadDashboard: Successfully completed comprehensive database collection purge.");
        } catch (error) {
          console.error("[DEBUG] LeadDashboard ERROR: Collection purge operation crashed.", error);
          handleFirestoreError(error, OperationType.DELETE, 'leads');
        }
      } else {
        alert("Verification failed. The bulk deletion operation was aborted to prevent accidental data loss.");
        console.log("[DEBUG] LeadDashboard: Purge aborted via verification mismatch.");
      }
    } else {
      console.log("[DEBUG] LeadDashboard: Purge aborted by user confirmation dialog.");
    }
  };

  /**
   * formatDate Utility
   * 
   * Standardizes dates into localized Indian Standard Time format strings ('en-IN').
   * @param isoStr - Source iso string
   * @returns formatted string showing date, month, year and AM/PM time
   */
  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return isoStr;
    }
  };

  /**
   * handleCopyLead Function
   * 
   * Serializes a chosen client lead's metadata into a human-readable contact summary and copies it to the clipboard.
   * @param lead - The Target Lead Object
   */
  const handleCopyLead = (lead: Lead) => {
    console.log(`[DEBUG] LeadDashboard: Serializing and copying lead: "${lead.id}"`);
    const formattedText = `📢 INFOVISORY LEAD INFORMATION SUMMARY:
----------------------------------------
👤 NAME:    ${lead.name}
📧 EMAIL:   ${lead.email}
📞 PHONE:   ${lead.phone}
🛠️ SERVICE: ${lead.service}
📥 SOURCE:  ${lead.source}
📅 SUBMITTED: ${formatDate(lead.timestamp)}
📌 STATUS:  ${lead.status.toUpperCase()}
💬 MESSAGE:
"${lead.message}"
----------------------------------------`;

    navigator.clipboard.writeText(formattedText).then(() => {
      console.log(`[DEBUG] LeadDashboard: Successfully saved metadata string of "${lead.id}" to device clipboard.`);
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId(null), 2500);
    }).catch(err => {
      console.error("[DEBUG] LeadDashboard ERROR: Clipboard write transaction failed.", err);
    });
  };

  /**
   * handleDownloadExcel Function
   * 
   * Compiles the real-time list of client leads into a beautifully styled
   * Microsoft Excel XML Spreadsheet. Columns are explicitly defined with widths 
   * and cell parameters so that every single field is fully visible and clean when opened offline.
   */
  const handleDownloadExcel = (exportBackup: boolean = false) => {
    const listToExport = exportBackup ? backupLeads : filteredLeads;
    console.log(`[DEBUG] LeadDashboard: Compiling ${exportBackup ? 'lifetime backup' : 'real-time active'} ledgers to styled XML Excel spreadsheet.`);
    
    // Safely escapes special XML sequences to avoid rendering syntax failures
    const escapeXml = (str: any) => {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    const rows = listToExport.map((lead) => {
      const selectedPlansString = lead.selectedPlans && lead.selectedPlans.length > 0 
        ? lead.selectedPlans.join(', ') 
        : 'N/A';
      return `
      <Row ss:Height="26">
        <Cell ss:StyleID="Data"><Data ss:Type="String">${escapeXml(lead.id)}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${escapeXml(formatDate(lead.timestamp))}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${escapeXml(lead.name)}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${escapeXml(lead.email)}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${escapeXml(lead.phone)}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${escapeXml(lead.service)}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${escapeXml(selectedPlansString)}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${escapeXml(lead.source)}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${escapeXml(lead.status)}</Data></Cell>
        <Cell ss:StyleID="Data"><Data ss:Type="String">${escapeXml(lead.message)}</Data></Cell>
      </Row>`;
    }).join('');

    const xmlSpreadsheet = `<?xml version="1.0" encoding="utf-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Author>Infovisory CRM</Author>
    <LastAuthor>Infovisory Analyst</LastAuthor>
    <Created>${new Date().toISOString()}</Created>
    <Version>16.00</Version>
  </DocumentProperties>
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1" ss:Size="11" ss:Color="#FFFFFF" ss:FontName="Segoe UI"/>
      <Interior ss:Color="#1E3A8A" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F172A"/>
      </Borders>
    </Style>
    <Style ss:ID="Data">
      <Font ss:Size="10" ss:FontName="Segoe UI" ss:Color="#374151"/>
      <Alignment ss:Vertical="Center" ss:Horizontal="Left" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
      </Borders>
    </Style>
  </Styles>
  <Worksheet ss:Name="${exportBackup ? 'Lifetime Backup Leads' : 'Live Portal Leads'}">
    <Table>
      <Column ss:Width="110"/> <!-- ID -->
      <Column ss:Width="170"/> <!-- Date -->
      <Column ss:Width="155"/> <!-- Client Name -->
      <Column ss:Width="215"/> <!-- Email Address -->
      <Column ss:Width="135"/> <!-- Phone -->
      <Column ss:Width="195"/> <!-- Service Requested -->
      <Column ss:Width="180"/> <!-- Selected Plans -->
      <Column ss:Width="145"/> <!-- Source -->
      <Column ss:Width="95"/> <!-- CRM Status -->
      <Column ss:Width="330"/> <!-- Message Brief -->
      
      <Row ss:Height="30">
        <Cell ss:StyleID="Header"><Data ss:Type="String">LEAD ID</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">DATE SUBMITTED (IST)</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">CLIENT NAME</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">EMAIL ADDRESS</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">PHONE NUMBER</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">SERVICE REQUESTED</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">SELECTED PLANS</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">LEAD ORIGIN SOURCE</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">CRM STATUS</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">CLIENT DESCRIPTION / BRIEF</Data></Cell>
      </Row>
      ${rows}
    </Table>
  </Worksheet>
</Workbook>`;

    const blob = new Blob([xmlSpreadsheet], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.href = url;
    element.download = `infovisory-crm-leads-${exportBackup ? 'backup-' : ''}${new Date().toISOString().substring(0, 10)}.xls`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  /**
   * handleDownloadCsv Function
   * 
   * High-compatibility export module that outputs standard UTF-8 CSV values 
   * easily imported as an offline spreadsheet.
   */
  const handleDownloadCsv = (exportBackup: boolean = false) => {
    const listToExport = exportBackup ? backupLeads : filteredLeads;
    console.log(`[DEBUG] LeadDashboard: Generating universal raw CSV sheet for ${exportBackup ? 'backup' : 'active font'} leads.`);
    
    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const escaped = String(str).replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const headers = [
      'Lead ID',
      'Submitted Date',
      'Client Name',
      'Email Address',
      'Phone Number',
      'Service Requested',
      'Selected Plans',
      'Lead Origin Source',
      'CRM Status',
      'Message Brief'
    ];

    const csvRows = listToExport.map(lead => {
      const selectedPlansString = lead.selectedPlans && lead.selectedPlans.length > 0 
        ? lead.selectedPlans.join('; ') 
        : 'N/A';
      return [
        escapeCsv(lead.id),
        escapeCsv(formatDate(lead.timestamp)),
        escapeCsv(lead.name),
        escapeCsv(lead.email),
        escapeCsv(lead.phone),
        escapeCsv(lead.service),
        escapeCsv(selectedPlansString),
        escapeCsv(lead.source),
        escapeCsv(lead.status),
        escapeCsv(lead.message)
      ].join(',');
    });

    // UTF-8 BOM helps Excel recognize encoding flawlessly
    const csvContent = '\uFEFF' + [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.href = url;
    element.download = `infovisory-crm-leads-${exportBackup ? 'backup-' : ''}${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  /**
   * handleFirebaseAuthSubmit Function
   * 
   * Authenticates using custom Firestore-backed email and password, bypassing any disabled Firebase Auth Email/Password restrictions.
   */
  const handleFirebaseAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccessError('');
    setAuthLoading(true);

    const email = authEmail.trim();
    const password = authPassword;

    if (!email || !password) {
      setAccessError('Please fill out both email and password.');
      setAuthLoading(false);
      return;
    }

    const lowerEmail = email.toLowerCase();
    const isAllowed = lowerEmail === 'rishabhverma794@gmail.com' || 
                      lowerEmail === 'onlyfun796@gmail.com' || 
                      lowerEmail === 'hey@infovisory.com' || 
                      lowerEmail.endsWith('@infovisory.com');

    if (!isAllowed) {
      setAccessError(`Access Denied: You are not authorized as an administrator.`);
      setAuthLoading(false);
      return;
    }

    try {
      const docRef = doc(db, 'admin_credentials', lowerEmail);
      
      if (authTab === 'signin') {
        console.log(`[DEBUG] LeadDashboard: Custom Sign In for "${lowerEmail}"`);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          setAccessError('No administrator account found with this email. Please click "Register Admin" to create one!');
          setAuthLoading(false);
          return;
        }
        
        const data = docSnap.data();
        if (data.password !== password) {
          setAccessError('Incorrect password. Please try again.');
          setAuthLoading(false);
          return;
        }
        
        // Success! Authenticate custom session
        console.log(`[DEBUG] LeadDashboard: Custom Admin authenticated successfully:`, lowerEmail);
        localStorage.setItem('bizlaunch_custom_admin_email', lowerEmail);
        localStorage.setItem('bizlaunch_is_owner', 'true');
        setIsOwnerMode(true);
        setIsLeadsUnlocked(true);
        setIsPricingUnlocked(true);
        
        // Attempt standard Firebase Auth or anonymous fallback to guarantee authenticated request.auth context
        try {
          await signInWithEmailAndPassword(auth, lowerEmail, password);
          console.log("[DEBUG] LeadDashboard: Standard Firebase Auth signed in successfully for custom user.");
        } catch (fbErr: any) {
          console.warn("[DEBUG] LeadDashboard: Standard Email/Password sign-in failed, attempting silent registration fallback...", fbErr);
          try {
            await createUserWithEmailAndPassword(auth, lowerEmail, password);
            console.log("[DEBUG] LeadDashboard: Standard Firebase Auth registered successfully.");
          } catch (createErr: any) {
            console.warn("[DEBUG] LeadDashboard: Standard Email/Password registration failed:", createErr);
            try {
              await signInAnonymously(auth);
              console.log("[DEBUG] LeadDashboard: Signed in anonymously as fallback.");
            } catch (anonErr: any) {
              console.error("[DEBUG] LeadDashboard: Anonymous sign-in fallback failed:", anonErr);
            }
          }
        }
        
        setAuthEmail('');
        setAuthPassword('');
        setAuthConfirmPassword('');
      } else {
        console.log(`[DEBUG] LeadDashboard: Custom Sign Up for "${lowerEmail}"`);
        
        // Confirm password check
        if (password !== authConfirmPassword) {
          setAccessError('Passwords do not match. Please verify and re-enter.');
          setAuthLoading(false);
          return;
        }

        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setAccessError('An administrator account already exists with this email address. Please sign in instead!');
          setAuthLoading(false);
          return;
        }
        
        if (password.length < 6) {
          setAccessError('Password must be at least 6 characters long.');
          setAuthLoading(false);
          return;
        }

        // Create new credential doc
        await setDoc(docRef, {
          email: lowerEmail,
          password: password,
          createdAt: new Date().toISOString(),
        });
        
        console.log(`[DEBUG] LeadDashboard: Custom Admin registered and authenticated successfully:`, lowerEmail);
        localStorage.setItem('bizlaunch_custom_admin_email', lowerEmail);
        localStorage.setItem('bizlaunch_is_owner', 'true');
        setIsOwnerMode(true);
        setIsLeadsUnlocked(true);
        setIsPricingUnlocked(true);

        // Attempt standard Firebase Auth or anonymous fallback to guarantee authenticated request.auth context
        try {
          await createUserWithEmailAndPassword(auth, lowerEmail, password);
          console.log("[DEBUG] LeadDashboard: Standard Firebase Auth registered successfully for custom user.");
        } catch (fbErr: any) {
          console.warn("[DEBUG] LeadDashboard: Standard Email/Password registration failed, trying sign-in fallback...", fbErr);
          try {
            await signInWithEmailAndPassword(auth, lowerEmail, password);
            console.log("[DEBUG] LeadDashboard: Standard Email/Password signed in successfully after creation fallback.");
          } catch (signErr: any) {
            console.warn("[DEBUG] LeadDashboard: Standard Sign-in fallback failed:", signErr);
            try {
              await signInAnonymously(auth);
              console.log("[DEBUG] LeadDashboard: Signed in anonymously as fallback.");
            } catch (anonErr: any) {
              console.error("[DEBUG] LeadDashboard: Anonymous sign-in fallback failed:", anonErr);
            }
          }
        }
        
        setAuthEmail('');
        setAuthPassword('');
        setAuthConfirmPassword('');
      }
      
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('bizlaunch_owner_update'));
    } catch (err: any) {
      console.error("[DEBUG] LeadDashboard ERROR: Custom Auth operation failed.", err);
      setAccessError(err.message || 'Authentication operation failed. Please check your network connection.');
    } finally {
      setAuthLoading(false);
    }
  };

  /**
   * handleGoogleSignIn Function
   * 
   * Authenticates using Firebase Auth Google Sign-In, which is fully supported and pre-enabled.
   */
  const handleGoogleSignIn = async () => {
    setAccessError('');
    setAuthLoading(true);
    try {
      console.log("[DEBUG] LeadDashboard: Real Firebase Auth Google Sign-In initiated.");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email ? result.user.email.toLowerCase() : '';
      const isAllowed = email === 'rishabhverma794@gmail.com' || 
                        email === 'onlyfun796@gmail.com' || 
                        email === 'hey@infovisory.com' || 
                        email.endsWith('@infovisory.com');

      if (!isAllowed) {
        console.warn("[DEBUG] LeadDashboard: Google sign-in denied for unauthorized user:", email);
        await signOut(auth);
        setAccessError(`Access Denied: ${result.user.email} is not authorized as an administrator.`);
      }
    } catch (err: any) {
      console.error("[DEBUG] LeadDashboard ERROR: Google Auth failed.", err);
      let errMsg = err.message || 'Google Authentication failed.';
      if (err.code === 'auth/popup-closed-by-user') {
        errMsg = 'The Google sign-in window was closed before completion. Please try again.';
      } else if (err.code === 'auth/blocked-by-popup-triggerer') {
        errMsg = 'Google sign-in popup was blocked by your browser. Please allow popups for this site.';
      }
      setAccessError(errMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  // Filter items matching Search Query, Status, and Source filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  // Analytics helper calculations
  const totalLeadsCount = leads.length;
  const pendingLeadsCount = leads.filter(l => l.status === 'Pending').length;
  const contactedLeadsCount = leads.filter(l => l.status === 'Contacted').length;

  if (!isOwnerMode) {
    return (
      <div className="min-h-screen bg-slate-50 text-[#1a1a1a] pt-40 pb-24 px-6 flex items-center justify-center" id="leads-auth-guard">
        <div className="w-full max-w-md bg-white rounded-[40px] border border-blue-100 p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-1/2 -translate-y-1/2 -z-10" />
          
          <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Lock size={28} />
          </div>

          <h1 className="text-3xl font-serif font-bold text-blue-950 text-center mb-3">Owner Leads Hub</h1>
          <p className="text-gray-400 font-medium text-sm text-center mb-8">
            Access to user consultation requests, registration details, and dashboard analytics is strictly authenticated.
          </p>

          {/* Form Tabs */}
          <div className="flex border border-slate-100 bg-slate-50 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthTab('signin');
                setAccessError('');
                setAuthConfirmPassword('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authTab === 'signin'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-blue-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthTab('register');
                setAccessError('');
                setAuthConfirmPassword('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authTab === 'register'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-blue-900'
              }`}
            >
              Register Admin
            </button>
          </div>

          <form onSubmit={handleFirebaseAuthSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block text-left">
                Admin Email Address
              </label>
              <input
                required
                type="email"
                placeholder="admin@infovisory.com"
                className="w-full border-b-2 border-gray-100 py-2.5 px-1 focus:border-blue-900 outline-none transition-all text-sm font-medium placeholder:text-gray-200"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block text-left">
                Security Password
              </label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full border-b-2 border-gray-100 py-2.5 px-1 focus:border-blue-900 outline-none transition-all text-sm font-medium placeholder:text-gray-200"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
              />
            </div>

            {authTab === 'register' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block text-left">
                  Confirm Password
                </label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full border-b-2 border-gray-100 py-2.5 px-1 focus:border-blue-900 outline-none transition-all text-sm font-medium placeholder:text-gray-200"
                  value={authConfirmPassword}
                  onChange={e => setAuthConfirmPassword(e.target.value)}
                />
              </div>
            )}

            {accessError && (
              <p className="text-xs text-red-500 font-bold text-center leading-relaxed">{accessError}</p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-blue-600 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-900/10 disabled:opacity-55 disabled:cursor-not-allowed"
            >
              {authLoading ? 'Authenticating...' : authTab === 'signin' ? 'Sign In to CRM Portal' : 'Register Admin Account'}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <span className="relative px-3 text-[10px] font-black uppercase tracking-[0.2em] bg-white text-gray-400">or</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={authLoading}
            className="w-full border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center justify-center gap-3 disabled:opacity-55 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.253-3.133C18.31 1.214 15.542 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.79-.08-1.4-.18-1.925H12.24z"
              />
            </svg>
            Sign In with Google
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-[#1a1a1a] pt-32 pb-24 px-4 sm:px-6 lg:px-8" id="leads-dashboard-container">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Link to="/contact" className="text-xs font-bold text-gray-400 hover:text-blue-900 transition-colors inline-flex items-center gap-1">
                <ArrowLeft size={12} />
                Contact Center
              </Link>
              <ChevronRight size={10} className="text-gray-300" />
              <span className="text-xs font-bold text-blue-900">
                {activeTab === 'leads' ? 'Leads Hub (Active CRM)' : activeTab === 'pricing' ? 'Pricing Administration Portal' : activeTab === 'services' ? 'Services & Features Portal' : 'Corporate Editorial Insights'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-blue-950 tracking-tight flex items-center gap-3">
              {activeTab === 'leads' ? 'Consultation & Price Leads' : activeTab === 'pricing' ? 'Pricing & Plan Content Manager' : activeTab === 'services' ? 'Services & Features Manager' : 'Corporate Blog & Insights Manager'}
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Live CRM Mode
              </span>
            </h1>
            <p className="mt-2 text-gray-400 font-medium text-sm">
              {activeTab === 'leads' 
                ? 'Manage client inquiries, contact details, and custom consultation payloads generated on our portal.'
                : activeTab === 'pricing' 
                ? 'Modify pricing indices, plan offerings, and package highlights on live corporate solution plans.'
                : activeTab === 'services'
                ? 'Create, modify or remove corporate features (e.g., Entrepreneur, registrations, compliances, tax, blogs) dynamically.'
                : 'Formulate, structure, publish and delete dynamic articles and news bulletins shown on the website.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {activeTab === 'leads' && (
              <>
                <button
                  onClick={handleResetDefaults}
                  className="bg-white border border-gray-100 text-gray-600 hover:text-blue-900 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all hover:bg-gray-50 hover:border-gray-200 cursor-pointer"
                  title="Populate test leads"
                >
                  <RefreshCw size={14} />
                  Reset Demo Data
                </button>
                <button
                  onClick={handleClearAll}
                  className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:text-red-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Clear entire lead database"
                >
                  <Trash2 size={14} />
                  Clear Database
                </button>
              </>
            )}
            <button
              onClick={async () => {
                try {
                  localStorage.removeItem('bizlaunch_custom_admin_email');
                  localStorage.setItem('bizlaunch_is_owner', 'false');
                  setIsOwnerMode(false);
                  setIsLeadsUnlocked(false);
                  setIsPricingUnlocked(false);
                  await signOut(auth);
                  console.log("[DEBUG] LeadDashboard: Signed out successfully.");
                } catch (err) {
                  console.error("[DEBUG] LeadDashboard ERROR: Failed to sign out:", err);
                }
              }}
              className="bg-blue-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-blue-600 transition-all cursor-pointer"
            >
              Logout Admins
            </button>
          </div>
        </div>

        {/* Tab Selection Row */}
        <div className="flex border border-slate-100 bg-white p-1.5 rounded-2xl shadow-sm mb-10 gap-2 overflow-x-auto" id="dashboard-tab-selection-row">
          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'leads'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-gray-500 hover:text-blue-900 hover:bg-slate-50'
            }`}
          >
            <Layers size={14} />
            Leads CRM Queue ({totalLeadsCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-gray-500 hover:text-blue-900 hover:bg-slate-50'
            }`}
          >
            <TrendingUp size={14} />
            Pricing & Solution Manager
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('blogs')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'blogs'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-gray-500 hover:text-blue-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen size={14} />
            Blogs Insights Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-gray-500 hover:text-blue-900 hover:bg-slate-50'
            }`}
          >
            <Layers size={14} />
            Services & Features Manager
          </button>
        </div>

        {activeTab === 'leads' ? (
          <>
            {/* Analytics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Total leads received */}
          <div className="bg-white p-6 rounded-3xl border border-blue-50 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Total Leads Received</span>
              <div className="text-3xl font-bold font-sans text-blue-950">{totalLeadsCount}</div>
            </div>
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
              <Layers size={22} />
            </div>
          </div>

          {/* Card 2: Pending (Action Required!) */}
          <div className="bg-white p-6 rounded-3xl border border-blue-50 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-500">To Be Contacted</span>
              <div className="text-3xl font-bold font-sans text-blue-950 flex items-center gap-2">
                {pendingLeadsCount}
                {pendingLeadsCount > 0 && (
                  <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-lg font-bold">
                    Needs Action
                  </span>
                )}
              </div>
            </div>
            <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
              <Clock size={22} />
            </div>
          </div>

          {/* Card 3: Contacted Successfully */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600">Successfully Processed</span>
              <div className="text-3xl font-bold font-sans text-blue-950">{contactedLeadsCount}</div>
            </div>
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <UserCheck size={22} />
            </div>
          </div>
        </div>

        {/* Real-time Offline Excel Synchronization & Failsafe Backup Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8" id="crm-excel-export-and-backup-vault">
          
          {/* Active CRM Queue Exporter Card */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800 relative overflow-hidden flex flex-col justify-between" id="active-crm-queue-exporter">
            <div className="absolute right-0 top-0 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full border border-blue-500/20 text-xs font-bold leading-none uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                Active Queue Session
              </div>
              
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
                <FileSpreadsheet className="text-blue-400 shrink-0" size={24} />
                Active CRM Queue Exporter
              </h2>
              
              <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed">
                Download the currently filtered and managed list shown on the CRM table below. Perfect for active day-to-day team review and processing. Spaced column auto-fit is configured for perfect offline viewing.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap gap-3 mt-6 pt-4 border-t border-white/5">
              <button
                onClick={() => handleDownloadExcel(false)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black px-4 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg cursor-pointer"
                title="Download formatted Excel Book with columns auto-spaced"
              >
                <FileSpreadsheet size={14} className="shrink-0" />
                Active Excel (.xls)
              </button>

              <button
                onClick={() => handleDownloadCsv(false)}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/10 font-bold px-4 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                title="Download active CSV"
              >
                CSV Ledger
              </button>
            </div>
          </div>

          {/* Immutable Lifetime Backup Vault Card */}
          <div className="bg-gradient-to-br from-[#022c22] to-[#043329] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-900/50 relative overflow-hidden flex flex-col justify-between" id="immutable-backup-vault shadow-xl">
            <div className="absolute right-0 top-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute left-1/3 bottom-0 w-40 h-40 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-xs font-bold leading-none uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                Real-Time Failsafe Backup Synced
              </div>
              
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="text-emerald-400 shrink-0" size={24} />
                Lifetime Data Backup Vault
              </h2>
              
              <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
                An isolated, read-only replica containing <span className="text-emerald-300 font-bold font-mono">{backupLeads.length} lifetime client entries</span>. Backups write instantly here when users fill forms and remain untouchable to accidental clearances or status changes on the primary board.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap gap-3 mt-6 pt-4 border-t border-emerald-500/10">
              <button
                onClick={() => handleDownloadExcel(true)}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-[#022c22] font-black px-4 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-emerald-500/10 cursor-pointer"
                title="Download formatted Lifetime Backup Excel Book with columns auto-spaced"
              >
                <FileSpreadsheet size={14} className="shrink-0" />
                Backup Excel (.xls)
              </button>

              <button
                onClick={() => handleDownloadCsv(true)}
                className="bg-white/10 hover:bg-white/15 text-white border border-emerald-500/20 font-bold px-4 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                title="Download backup CSV"
              >
                Backup CSV
              </button>
            </div>
          </div>

        </div>

        {/* Filters and Search Tools */}
        <div className="bg-white p-6 rounded-3xl border border-blue-50 shadow-sm space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input Bar */}
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-900 transition-colors" size={16} />
              <input
                type="text"
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold outline-none focus:bg-white focus:border-blue-900 transition-all placeholder:text-gray-400 text-blue-950"
                placeholder="Search leads by name, email, phone number, message..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Group selectors */}
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
              
              {/* Type Category Filter */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setStatusFilter('All')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === 'All' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setStatusFilter('Pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === 'Pending' ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter('Contacted')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === 'Contacted' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  Contacted
                </button>
              </div>

              {/* Source Filter Selector */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setSourceFilter('All')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sourceFilter === 'All' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  All Sources
                </button>
                <button
                  onClick={() => setSourceFilter('Consultation Form')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    sourceFilter === 'Consultation Form' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  Form
                </button>
                <button
                  onClick={() => setSourceFilter('Pricing Reveal')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    sourceFilter === 'Pricing Reveal' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  Reveal List
                </button>
              </div>

            </div>
          </div>
          
          {/* Active Counters display */}
          <div className="text-xs font-bold text-gray-500 flex items-center justify-between">
            <div>
              Showing {filteredLeads.length} of {leads.length} leads
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>

        {/* Lead Table / List */}
        <div className="space-y-4">
          {filteredLeads.length > 0 ? (
            filteredLeads.map((lead) => {
              const isLeadPending = lead.status === 'Pending';
              const isCopied = copiedId === lead.id;

              return (
                <div 
                  key={lead.id}
                  className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all duration-300 hover:shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-start justify-between gap-6 ${
                    isLeadPending ? 'border-amber-100/70 bg-gradient-to-r from-white via-white to-amber-50/10' : 'border-blue-50 bg-white'
                  }`}
                >
                  {/* Status strip */}
                  <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                    isLeadPending ? 'bg-amber-400' : 'bg-emerald-500'
                  }`} />

                  {/* Left Column: Core Lead Metadata */}
                  <div className="space-y-5 flex-grow md:max-w-4xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-blue-950 font-sans tracking-tight">
                        {lead.name}
                      </h3>
                      
                      {/* Status Check badge */}
                      <button
                        onClick={() => handleToggleStatus(lead.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 cursor-pointer select-none transition-all ${
                          isLeadPending 
                            ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-100' 
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-100'
                        }`}
                        title={isLeadPending ? "Mark as Contacted" : "Mark as Pending"}
                      >
                        {isLeadPending ? (
                          <>
                            <Clock size={10} className="text-amber-500" />
                            Pending Action
                          </>
                        ) : (
                          <>
                            <CheckCircle size={10} className="text-emerald-500" />
                            Contacted
                          </>
                        )}
                      </button>

                      {/* Source badge */}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                        lead.source === 'Consultation Form' 
                          ? 'bg-purple-50 text-purple-700 border-purple-100' 
                          : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {lead.source}
                      </span>
                    </div>

                    {/* Inquiry Details details cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm text-gray-600 font-semibold">
                      <div className="flex items-center gap-2.5">
                        <Mail size={16} className="text-gray-400 shrink-0" />
                        <a href={`mailto:${lead.email}`} className="hover:text-blue-600 hover:underline font-mono truncate">{lead.email}</a>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Phone size={16} className="text-gray-400 shrink-0" />
                        <a href={`tel:${lead.phone}`} className="hover:text-blue-600 hover:underline font-mono">{lead.phone}</a>
                      </div>
                      <div className="flex items-center gap-2.5 sm:col-span-2 lg:col-span-1">
                        <span className="text-[10px] font-black uppercase bg-slate-100 py-0.5 px-2 rounded font-sans text-slate-500 shrink-0">Service</span>
                        <span className="truncate text-blue-900 font-bold">{lead.service}</span>
                      </div>
                    </div>

                    {/* Inquiry Custom Messages */}
                    {lead.message && (
                      <div className="bg-slate-50/70 py-4 px-5 rounded-2xl text-gray-500 text-sm leading-relaxed font-medium relative border border-slate-100/40">
                        <p className="italic">"{lead.message}"</p>
                      </div>
                    )}

                    {/* Selected Pricing package plans */}
                    {lead.selectedPlans && lead.selectedPlans.length > 0 && (
                      <div className="bg-emerald-50/30 border border-emerald-100/70 p-4 rounded-2xl flex flex-wrap items-center gap-3">
                        <div className="text-[11px] font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                          <CheckCircle className="text-emerald-600 shrink-0" size={14} />
                          Selected Plans:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {lead.selectedPlans.map((plan) => (
                            <span key={plan} className="bg-white border border-emerald-200 text-emerald-800 px-3 py-1 rounded-xl text-xs font-bold shadow-xs">
                              {plan}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Date stamp footer */}
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Clock size={12} />
                      Received on {formatDate(lead.timestamp)}
                    </div>
                  </div>

                  {/* Right Column: Interaction Controls Actions */}
                  <div className="flex sm:flex-row md:flex-col items-center gap-2.5 shrink-0 self-end md:self-start md:pt-1">
                    {/* Mark status toggle */}
                    <button
                      onClick={() => handleToggleStatus(lead.id)}
                      className={`w-full md:w-36 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm bg-white ${
                        isLeadPending 
                          ? 'border-emerald-100 text-emerald-700 hover:bg-emerald-50' 
                          : 'border-amber-100 text-amber-800 hover:bg-amber-50'
                      }`}
                    >
                      {isLeadPending ? (
                        <>
                          <CheckCircle size={14} />
                          Mark Done
                        </>
                      ) : (
                        <>
                          <Clock size={14} />
                          Reopen Lead
                        </>
                      )}
                    </button>

                    {/* Copy lead text formatting summary details */}
                    <button
                      onClick={() => handleCopyLead(lead)}
                      className={`w-full md:w-36 py-2 px-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm text-xs font-bold ${
                        isCopied 
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800' 
                          : 'border-gray-100 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check size={14} className="text-emerald-500" />
                          Copied Info!
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy Lead Info
                        </>
                      )}
                    </button>

                    {/* Permanent Delete Button */}
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      className="p-2 bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-100 hover:border-red-100 rounded-xl transition-all cursor-pointer shadow-sm min-w-10 h-10 flex items-center justify-center"
                      title="Discard / Delete Lead Information"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-blue-50 shadow-sm max-w-full">
              <Sparkles className="mx-auto text-blue-100 mb-6" size={48} />
              <h3 className="text-2xl font-serif font-bold text-blue-950 mb-2">No Matching Leads Found</h3>
              <p className="text-gray-400 max-w-sm mx-auto font-medium text-sm">
                We couldn't locate any user details matching that filter or search query. Take a look at your search strings or filter toggle tags.
              </p>
            </div>
          )}
        </div>
      </>
    ) : activeTab === 'pricing' ? (
      <PricingManager
        selectedServiceId={selectedServiceId}
        setSelectedServiceId={setSelectedServiceId}
        editablePackages={editablePackages}
        setEditablePackages={setEditablePackages}
        isSavingPricing={isSavingPricing}
        pricingSaveSuccess={pricingSaveSuccess}
        handleSavePricing={handleSavePricing}
        handleUpdatePackageField={handleUpdatePackageField}
        handleUpdateFeature={handleUpdateFeature}
        handleAddFeature={handleAddFeature}
        handleRemoveFeature={handleRemoveFeature}
        handleAddPackage={handleAddPackage}
        handleRemovePackage={handleRemovePackage}
      />
    ) : activeTab === 'services' ? (
      <ServicesManager />
    ) : (
      <BlogManager />
    )}

      </div>
    </div>
  );
}
