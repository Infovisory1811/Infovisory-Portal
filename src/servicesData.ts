import { 
  Rocket, 
  ClipboardCheck, 
  FileText, 
  ShieldAlert, 
  Receipt, 
  Calculator, 
  BookOpen, 
  LucideIcon 
} from 'lucide-react';

/**
 * SubService Interface
 * 
 * Represents a specific corporate solution, tax filing, or legal registration.
 * Includes unique identifiers, names, and user-facing content descriptions.
 */
export interface SubService {
  id: string;
  name: string;
  description: string;
  groupId?: string; // Optional field for sub-categorized registrations
}

/**
 * CategoryGroup Interface
 * 
 * Defines subset clusters (e.g. Tax Registrations vs. Other Registrations) 
 * inside a larger category namespace to organize long indexes naturally.
 */
export interface CategoryGroup {
  id: string;
  name: string;
}

/**
 * ServiceCategory Interface
 * 
 * Binds a top-level category node to a representative 
 * Lucide visual icon, sub-services list, and optional presentation groupings.
 */
export interface ServiceCategory {
  id: string;
  name: string;
  shortName?: string;
  icon: LucideIcon;
  subServices: SubService[];
  groups?: CategoryGroup[];
}

/**
 * SERVICES_DATA Global Catalog
 * 
 * The single source of truth for Infovisory's compliance categories and listings.
 */
export const SERVICES_DATA: ServiceCategory[] = [
  {
    id: 'entrepreneur',
    name: 'Be an Entrepreneur',
    shortName: 'Entrepreneur',
    icon: Rocket,
    subServices: [
      { id: 'pvt-ltd', name: 'Private Limited Company', description: 'The most popular legal structure for high-growth startups and tech firms.' },
      { id: 'public-ltd', name: 'Public Limited Company', description: 'For corporate enterprises desiring to raise public financial capital.' },
      { id: 'llp', name: 'Limited Liability Partnership', description: 'Combined operational flexibility of a partnership with corporate protection.' },
      { id: 'opc', name: 'One Person Company (OPC)', description: 'Ideal legal structure for high-prestige sole founders seeking corporate status.' },
      { id: 'sole-proprietorship', name: 'Sole Proprietorship', description: 'The simplest option for retail merchants and freelance practitioners.' },
      { id: 'partnership', name: 'Partnership', description: 'Optimal legal vehicle for multi-owner co-founded small businesses.' },
      { id: 'huf', name: 'Hindu Undivided Family (HUF), HUF Deed', description: 'Complete HUF registration and formal deed drafting for legal recognition.' },
      { id: 'ecommerce', name: 'E-Commerce Business', description: 'Comprehensive legal structuring, gateway readiness, and compliance setup.' },
    ]
  },
  {
    id: 'registrations',
    name: 'Registrations',
    shortName: 'Registrations',
    icon: ClipboardCheck,
    groups: [
      { id: 'tax-reg', name: 'Tax Registrations' },
      { id: 'other-reg', name: 'Other Registrations' }
    ],
    subServices: [
      { id: 'gst-registration', name: 'GST Registration', description: 'Mandatory indirect tax registration for businesses crossing turnover limits.', groupId: 'tax-reg' },
      { id: 'gst-modification', name: 'GST Modification', description: 'Seamlessly update fields, addresses, or partners in your GST data.', groupId: 'tax-reg' },
      { id: 'pan-application', name: 'PAN Application', description: 'Acquire Permanent Account Number registration for individuals or businesses.', groupId: 'tax-reg' },
      { id: 'tan-application', name: 'TAN Application', description: 'Tax Deduction and Collection Account Number for corporate payroll handlers.', groupId: 'tax-reg' },
      { id: 'professional-tax', name: 'Professional Tax', description: 'State-level tax registration mandatory for employers and professionals.', groupId: 'tax-reg' },
      { id: 'pan-tan-registration', name: 'PAN & TAN Registration', description: 'Combined application for both corporate PAN and TAN coordinates.', groupId: 'tax-reg' },
      
      { id: 'income-tax-returns-reg', name: 'Income Tax Return Filings', description: 'File your annual incomes, balance sheets, and deductions seamlessly.', groupId: 'other-reg' },
      { id: 'msme-registration', name: 'SSI/MSME/Udyog Aadhar Registration', description: 'Gain collateral-free loans and subsidies under governmental frameworks.', groupId: 'other-reg' },
      { id: 'iec-registration', name: 'IEC Registration', description: 'Import Export Code mandatory for carrying international transactions.', groupId: 'other-reg' },
      { id: 'iec-modification', name: 'IEC Modification', description: 'Seamlessly update licenses, PAN linkage, and addresses on the DGFT portal.', groupId: 'other-reg' },
      { id: 'fssai-registration', name: 'FSSAI Registration', description: 'Food safety license mandatory for all food business operators.', groupId: 'other-reg' },
      { id: 'shop-establishment', name: 'Shop & Establishment', description: 'Commercial establishment license required by local labor departments.', groupId: 'other-reg' },
      { id: 'startup-india', name: 'Startup India', description: 'Accredit under DPIIT to access tax holidays and regulatory relaxations.', groupId: 'other-reg' },
      { id: 'esi-registration', name: 'ESIC Registration', description: 'Employee State Insurance for ensuring healthcare and social security.', groupId: 'other-reg' },
      { id: 'epf-registration', name: 'EPF Registration', description: 'Provident fund registry mandatory for firms having 20+ active workforce.', groupId: 'other-reg' },
      { id: 'esi-pf-registration', name: 'ESI & PF Registration', description: 'Combined ESIC & PF setup to ensure employee welfare and benefits.', groupId: 'other-reg' },
      { id: 'digital-signature', name: 'Digital Signature', description: 'Secure digital sign certificate generation for e-filings and online bids.', groupId: 'other-reg' },
      { id: 'din-application', name: 'DIN Application', description: 'Obtain a unique Director Identification Number to hold corporate offices.', groupId: 'other-reg' },
    ]
  },
  {
    id: 'returns',
    name: 'Returns',
    shortName: 'Returns',
    icon: FileText,
    subServices: [
      { id: 'gst-returns', name: 'GST Returns', description: 'Periodic online return filing to maintain indirect tax credit pipelines.' },
      { id: 'income-tax-returns', name: 'Income Tax Returns', description: 'File annual returns to report earnings, claim refunds, and carry forward losses.' },
      { id: 'tds-returns', name: 'TDS Returns', description: 'Quarterly filing for tax deducted at source to secure compliance credits.' },
      { id: 'pf-returns', name: 'PF Returns', description: 'Monthly provident fund return filing to keep workforce benefits active.' },
      { id: 'tds-returns-revision', name: 'TDS Returns Revision', description: 'Systematic correction of errors/demands in historical TDS returns.' },
      { id: 'esi-returns', name: 'ESI Returns', description: 'Filing of quarterly health insurance contributions for workers.' },
    ]
  },
  {
    id: 'compliances',
    name: 'Compliances',
    shortName: 'Compliances',
    icon: ShieldAlert,
    groups: [
      { id: 'corp-changes', name: 'Corporate Changes' },
      { id: 'closure', name: 'Closure' },
      { id: 'legal-drafting', name: 'Legal Drafting' },
      { id: 'special-compliance', name: 'Special' }
    ],
    subServices: [
      { id: 'add-director', name: 'Add A Director', description: 'Seamlessly add a new director or partner to your business entity.', groupId: 'corp-changes' },
      { id: 'removal-resignation-director', name: 'Removal/Resignation of Director', description: 'Process formal retirement or termination filings with MCA support.', groupId: 'corp-changes' },
      { id: 'add-remove-partner-llp', name: 'Add/Remove a Partner in LLP', description: 'Incorporate new LLP partners or process partner departures legally.', groupId: 'corp-changes' },
      { id: 'change-llp-agreement', name: 'Change in LLP Agreement', description: 'File supplementary LLP deeds reflecting updated commercial clauses.', groupId: 'corp-changes' },
      { id: 'change-registered-office-address', name: 'Change of Registered Office Address', description: 'Formally transition your legal operating address coordinates under MCA rules.', groupId: 'corp-changes' },
      { id: 'increase-authorized-capital', name: 'Increase in Authorized Capital', description: 'Expand capital ceilings to accommodate fresh funding rounds and equity issuances.', groupId: 'corp-changes' },
      { id: 'change-din', name: 'Change in DIN', description: 'Seamless update of director biographical credentials with MCA registry.', groupId: 'corp-changes' },
      { id: 'surrender-your-din', name: 'Surrender Your DIN', description: 'Formally request deletion of redundant or unused credentials.', groupId: 'corp-changes' },
      { id: 'appointment-of-auditors', name: 'Appointment of Auditors', description: 'Initiate filing of ADT-1 to comply with statutory audit guidelines.', groupId: 'corp-changes' },
      { id: 'share-transfer-transmission', name: 'Share Transfer & Transmission', description: 'Structured execution of equity shares transfers among founders, promoters, or heirs.', groupId: 'corp-changes' },
      { id: 'company-name-change', name: 'Company Name Change', description: 'Modify your brand legal title by amending the Memorandum of Association.', groupId: 'corp-changes' },
      { id: 'llp-name-change', name: 'LLP Name Change', description: 'Official rebranding process specifically tuned for LLPs.', groupId: 'corp-changes' },
      { id: 'moa-aoa-amendment', name: 'MOA/AOA Amendment', description: 'Revamp corporate policies, business objects, or operational rules.', groupId: 'corp-changes' },
      { id: 'moa-aoa-printing', name: 'MOA/AOA Printing', description: 'Secure professionally printed and bound MCA-certified constitutional documents.', groupId: 'corp-changes' },

      { id: 'strike-off-company', name: 'Strike Off Company', description: 'Officially strike off non-operative Private Limited companies from MCA records.', groupId: 'closure' },
      { id: 'strike-off-llp', name: 'Strike Off LLP', description: 'Clear liabilities and seamlessly shut down your LLP entity on MCA.', groupId: 'closure' },
      { id: 'dissolution-of-firms', name: 'Dissolution of Firms', description: 'Settle partnerships and officially file certificates of dissolution.', groupId: 'closure' },
      { id: 'strike-off-opc', name: 'Strike Off OPC', description: 'Cleanly shut down business affairs for non-operative One Person Companies.', groupId: 'closure' },

      { id: 'download-library', name: 'Download Library', description: 'Instant access to legal structures, agreements, contracts, and business checklists.', groupId: 'legal-drafting' },
      { id: 'customized-drafting', name: 'Customized Drafting', description: 'Acquire tailored contracts and business structures drafted by legal professionals.', groupId: 'legal-drafting' },

      { id: 'gst-lut-letter', name: 'GST LUT Letter of Undertaking New', description: 'Exempt your services or products exports from IGST payments.', groupId: 'special-compliance' },
      { id: 'gst-cancellation', name: 'GST Cancellation', description: 'Legally surrender and cancel non-operative active GST registrations.', groupId: 'special-compliance' },
      { id: 'dir-3-kyc-special', name: 'DIR 3 KYC', description: 'Mandatory annual kyc confirmation for all DIN-bearing directors.', groupId: 'special-compliance' },
      { id: 'roc-search-report', name: 'ROC Search Report New', description: 'Acquire statutory details about active charges, credit history, and MCA reports.', groupId: 'special-compliance' },
      { id: 'commencement-of-business', name: 'Commencement of Business (INC 20A) Filing', description: 'File equity funding proofs with MCA within 180 days of incorporation.', groupId: 'special-compliance' },
    ]
  },
  {
    id: 'income-tax-return-filings',
    name: 'Income Tax Return Filings',
    shortName: 'Income Tax',
    icon: Receipt,
    subServices: [
      { id: 'salaried-itr', name: 'Salaried Individual ITR Filings', description: 'ITR e-filing (Form ITR-1/2) optimized for employees with salary, house prop, and investments.' },
      { id: 'business-itr', name: 'Business & Professional ITR Filings', description: 'Navigate presumptive taxes (44AD/44ADA), custom business balance sheets, and audit filings.' },
      { id: 'capital-gains-itr', name: 'Capital Gains Income Filing', description: 'Report profits from sales of shares, mutual funds, gold, or property.' },
      { id: 'fno-trader-itr', name: 'Future & Options (F&O) Trader Filing', description: 'Custom tax balance sheets, turnover computation, and business losses carryover.' },
      { id: 'nri-itr', name: 'NRI Income Tax Filing', description: 'DTAA claims, global earnings structure, and foreign asset registrations.' }
    ]
  },
  {
    id: 'accounting-payroll',
    name: 'Accounting and Payroll',
    shortName: 'Accounting',
    icon: Calculator,
    subServices: [
      { id: 'accounting-service', name: 'Accounting Services', description: 'End-to-end cloud bookkeeping, invoice recording, bank reconciliation, and cashflow monitoring.' },
      { id: 'payroll-service', name: 'Payroll Solutions', description: 'Wage calculation, automatic payslips, professional tax filing, and PF/ESI compliance.' }
    ]
  },
  {
    id: 'blog',
    name: 'Blogs',
    shortName: 'Blogs',
    icon: BookOpen,
    subServices: []
  }
];
