import { ShieldCheck, Target, Zap, TrendingUp, Globe, Award } from 'lucide-react';

export interface DetailSection {
  title: string;
  content: string | string[] | { title: string, description: string }[];
  type: 'text' | 'list' | 'grid' | 'steps' | 'faqs';
}

export interface PricingPackage {
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export interface ServiceDetail {
  id: string;
  sections: DetailSection[];
  packages?: PricingPackage[];
}

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  'pvt-ltd': {
    id: 'pvt-ltd',
    sections: [
      {
        title: 'Advantages of a Private Limited Company',
        type: 'grid',
        content: [
          { title: 'Limited Liability', description: 'The personal assets of the directors and shareholders are safe in case of business losses or debts.' },
          { title: 'Separate Legal Entity', description: 'The company is considered a separate person in the eyes of law, distinct from its members.' },
          { title: 'No Minimum Capital', description: 'There is no minimum capital requirement to start a private limited company in India.' },
          { title: 'Fund Raising', description: 'It is easy to raise funds through equity shares, debentures, and venture capital.' },
          { title: 'FDI Allowed', description: 'Foreign Direct Investment is allowed in many sectors through the automatic route.' },
          { title: 'Builds Credibility', description: 'Being a registered corporate entity builds trust among customers, vendors, and investors.' }
        ]
      },
      {
        title: 'Documents Required',
        type: 'list',
        content: [
          'PAN Card of all Directors and Shareholders',
          'Aadhar Card / Voter ID / Driving License of all Directors',
          'Passport (Mandatory for Foreign Nationals)',
          'Latest Bank Statement / Electricity Bill / Telephone Bill (not older than 2 months)',
          'Registered Office Address Proof: Electricity Bill / Gas Bill',
          'No Objection Certificate (NOC) from the owner of the premise',
          'Passport size photographs of Directors'
        ]
      },
      {
        title: 'How to Incorporate Private Limited Company',
        type: 'steps',
        content: [
          { title: 'Information Collection', description: 'Fill out our simple checklist and provide the necessary documents.' },
          { title: 'DSC & Name Approval', description: 'We apply for the Digital Signature Certificate (DSC) and Name Approval (RUN).' },
          { title: 'Document Drafting', description: 'Preparation of MOA, AOA, and other necessary declarations (SPICe+).' },
          { title: 'PAN & TAN Application', description: 'PAN and TAN are applied for along with the incorporation application.' },
          { title: 'Certificate Issued', description: 'The Registrar of Companies (ROC) issues the Certificate of Incorporation.' }
        ]
      },
      {
        title: 'Frequently Asked Questions',
        type: 'faqs',
        content: [
          { title: 'What is a Private Limited Company?', description: 'A Private Limited Company is a privately held small business entity that limits the liability of its shareholders to their shares and restricts the transfer of shares.' },
          { title: 'How many directors are required?', description: 'A minimum of 2 directors and a maximum of 15 directors are required for a private limited company.' },
          { title: 'Is it mandatory to have a registered office?', description: 'Yes, every company must have a registered office address in India to receive any official communication from the MCA.' },
          { title: 'Can a foreigner be a director?', description: 'Yes, but at least one director must be a resident of India (stayed in India for not less than 182 days in the previous calendar year).' }
        ]
      }
    ],
    packages: [
      {
        name: 'Starter',
        price: '4,999',
        features: [
          '2 Digital Signature Certificates (DSC)',
          '2 Director Identification Numbers (DIN)',
          'Name Approval (RUN)',
          'Certificate of Incorporation',
          'PAN & TAN for the Company',
          'MOA & AOA Drafting',
          'Bank Account Opening Assistance',
          'Free Consultation'
        ]
      },
      {
        name: 'Standard',
        price: '8,499',
        isPopular: true,
        features: [
          'Everything in Starter Package',
          'GST Registration',
          'MSME (Udyam) Registration',
          'PF & ESI Registration (if applicable)',
          'Commencement of Business Certificate (INC-20A)',
          'Custom Legal Agreements Templates'
        ]
      },
      {
        name: 'Premium',
        price: '45,499',
        features: [
          'Everything in Standard Package',
          '1 Year Full Annual Compliance',
          'Income Tax Return Filing',
          'GST Filing for 1 Year',
          'Accounting & Bookkeeping Services',
          'TDS Compliance Support',
          'Personal Account Manager'
        ]
      }
    ]
  },
  'llp': {
    id: 'llp',
    sections: [
      {
        title: 'Advantages of Limited Liability Partnership',
        type: 'grid',
        content: [
          { title: 'Limited Liability Protection', description: 'The personal assets of the partners are protected from the liabilities of the LLP.' },
          { title: 'Separate Legal Identity', description: 'Like a company, an LLP has a distinct legal identity from its partners.' },
          { title: 'Low Compliance Cost', description: 'Compliance requirements for LLPs are generally lower and less expensive than private limited companies.' },
          { title: 'No Minimum Capital', description: 'LLPs can be started with any amount of contribution from partners.' },
          { title: 'Flexible Management', description: 'Partners have the freedom to manage the internal structure as per the LLP agreement.' },
          { title: 'Easy Formation', description: 'The registration process is simpler and requires fewer formalities compared to a company.' }
        ]
      },
      {
        title: 'Documents Required for LLP',
        type: 'list',
        content: [
          'PAN Card of all Partners',
          'Aadhar Card / Voter ID / Passport of all Partners',
          'Latest Bank Statement / Utility Bill of Partners (not older than 2 months)',
          'Registered Office Address Proof: Electricity / Gas / Telephone bill',
          'NOC from the owner of the premises',
          'Digital Signature Certificate (DSC) for designated partners'
        ]
      },
      {
        title: 'How to Incorporate LLP Online',
        type: 'steps',
        content: [
          { title: 'Information Collection', description: 'Share details and documents via our simple checklist.' },
          { title: 'DSC & Name Reservation', description: 'Obtain DSC and reserve the LLP name through the RUN-LLP service.' },
          { title: 'Form Filing (FiLLiP)', description: 'Drafting and filing the incorporation form with the MCA.' },
          { title: 'LLP Agreement', description: 'Drafting and filing the LLP Agreement within 30 days of incorporation.' },
          { title: 'Final Certification', description: 'Receiving the Certificate of Incorporation from the ROC.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Starter',
        price: '3,999',
        features: [
          '2 Digital Signature Certificates (DSC)',
          '2 DPINs (Designated Partner Identification Number)',
          'LLP Name Approval',
          'Certificate of Incorporation',
          'PAN & TAN Application',
          'Standard LLP Agreement',
          'Email Delivery for Certificates'
        ]
      },
      {
        name: 'Standard',
        price: '7,499',
        isPopular: true,
        features: [
          'Everything in Starter Package',
          'Customized LLP Agreement drafting',
          'GST Registration',
          'MSME (Udyam) Registration',
          'Bank Account Opening Support',
          'Dedicated Relationship Manager'
        ]
      },
      {
        name: 'Premium',
        price: '44,499',
        features: [
          'Everything in Standard Package',
          '1 Year Annual Filing (Form 8 & 11)',
          'GST Filing for 1 Year',
          'Income Tax Return Filing',
          'Bookkeeping and Accounting',
          'Statutory Audit Support',
          'Unlimited Legal Consultation'
        ]
      }
    ]
  },
  'opc': {
    id: 'opc',
    sections: [
      {
        title: 'Benefits of One Person Company (OPC)',
        type: 'grid',
        content: [
          { title: 'Single Ownership', description: 'Allows a single entrepreneur to own and manage the business with corporate status.' },
          { title: 'Limited Liability', description: 'Personal assets of the promoter are shielded from business debts.' },
          { title: 'Perpetual Succession', description: 'The company continues to exist even if the owner changes or passes away.' },
          { title: 'Easier Funding', description: 'OPCs find it easier to get bank loans and attract investors compared to proprietorships.' },
          { title: 'Legal Recognition', description: 'Being a registered private limited entity provides better brand image.' },
          { title: 'Small Company Benefits', description: 'OPCs enjoy several exemptions under the Companies Act.' }
        ]
      },
      {
        title: 'Documents for OPC Registration',
        type: 'list',
        content: [
          'PAN Card and Aadhar Card of the Promoter',
          'Address Proof of Promoter (Latest Statement/Bill)',
          'PAN/Aadhar of the Nominee Director',
          'Consent from the Nominee (Form INC-3)',
          'Registered Office Proof (Electricity bill + NOC)',
          'Photo of the Promoter'
        ]
      },
      {
        title: 'OPC Incorporation Process',
        type: 'steps',
        content: [
          { title: 'Select a Nominee', description: 'The owner must nominate a person who will take over in case of their absence.' },
          { title: 'Apply for DSC', description: 'Digital signatures are required for filing digital forms.' },
          { title: 'Name Approval', description: 'Reservation of name ending with (OPC) Private Limited.' },
          { title: 'Filing SPICe+', description: 'Submit the application for incorporation along with MOA and AOA.' },
          { title: 'Receive Certificate', description: 'ROD issues the certificate of incorporation, PAN, and TAN.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Starter',
        price: '4,999',
        features: [
          '1 Digital Signature Certificate (DSC)',
          '1 Director Identification Number (DIN)',
          'Company Name Approval',
          'Certificate of Incorporation',
          'PAN & TAN Cards',
          'MOA & AOA Drafting',
          'Nominee Appointment Filing'
        ]
      },
      {
        name: 'Standard',
        price: '8,499',
        isPopular: true,
        features: [
          'Everything in Starter Package',
          'GST Registration',
          'MSME (Udyam) Registration',
          'Commencement of Business Certificate',
          'Professional Tax Registration',
          'Bank Account Opening Help'
        ]
      },
      {
        name: 'Premium',
        price: '45,499',
        features: [
          'Everything in Standard Package',
          'Annual ROC Filing for 1 Year',
          'GST Return Filing (Quarterly/Monthly)',
          'Income Tax Return Filing',
          'Monthly Bookkeeping',
          'TDS Compliance Support',
          'Priority Customer Support'
        ]
      }
    ]
  },
  'sole-proprietorship': {
    id: 'sole-proprietorship',
    sections: [
      {
        title: 'Advantages of Sole Proprietorship',
        type: 'grid',
        content: [
          { title: 'Easy to Start', description: 'Requires minimal documentation and legal formalities to begin operations.' },
          { title: 'Total Control', description: 'The owner has absolute decision-making power over all business matters.' },
          { title: 'Minimal Compliance', description: 'Very few annual regulatory filings compared to companies or LLPs.' },
          { title: 'Tax Benefits', description: 'Business income is taxed as the personal income of the owner.' },
          { title: 'Prompt Decisions', description: 'No need for board meetings or partner consents for quick actions.' },
          { title: 'Low Cost', description: 'The most inexpensive way to get a formal business registration.' }
        ]
      },
      {
        title: 'Documents Needed',
        type: 'list',
        content: [
          'Aadhar Card of the Proprietor',
          'PAN Card of the Proprietor',
          'Personal Address Proof',
          'Business Address proof (Electricity Bill/Rent Agreement)',
          'Bank Account Details',
          'NOC from Landlord'
        ]
      },
      {
        title: 'Registration Steps',
        type: 'steps',
        content: [
          { title: 'Select Firm Name', description: 'Choose a unique name for your business.' },
          { title: 'MSME Registration', description: 'Register under Udyam to get formal recognition as a business.' },
          { title: 'GST Setup', description: 'Apply for GST if turnover exceeds limits or for voluntary registration.' },
          { title: 'Local Licenses', description: 'Apply for Shop and Establishment Act license if required locally.' },
          { title: 'Bank Account', description: 'Open a current account in the firm name using registration proofs.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Basic',
        price: '1,699',
        features: [
          'MSME (Udyam) Registration',
          'Business Identity Proof',
          'Current Account Opening Kit',
          'Consultation on Registrations',
          'Digital Delivery of Certificate'
        ]
      },
      {
        name: 'Standard',
        price: '3,299',
        isPopular: true,
        features: [
          'Everything in Basic Package',
          'GST Registration',
          'GST Portal Setup',
          'Professional Tax Enrollment (if applicable)',
          'Logo Design Basic',
          '24/7 Phone Support'
        ]
      },
      {
        name: 'Comprehensive',
        price: '23,499',
        features: [
          'Everything in Standard Package',
          'Full Year Accounting',
          'Income Tax Return Filing',
          'GST Filing for 12 months',
          'Trademark Filing (1 Class)',
          'Business Consultation'
        ]
      }
    ]
  },
  'partnership': {
    id: 'partnership',
    sections: [
      {
        title: 'Benefits of a Partnership Firm',
        type: 'grid',
        content: [
          { title: 'Shared Resources', description: 'Partners can pool their financial capital and professional expertise.' },
          { title: 'Ease of Formation', description: 'Can be started with a simple partnership deed without complex registrations.' },
          { title: 'Flexibility', description: 'Terms of operation can be easily modified by mutual consent of partners.' },
          { title: 'Better Tax Planning', description: 'Partnership profits are taxed at the firm level, and remuneration is deductible.' },
          { title: 'Scalability', description: 'Easier to expand by bringing in more partners with investment.' },
          { title: 'Sharing Risks', description: 'Business risks and losses are divided among the partners.' }
        ]
      },
      {
        title: 'Checklist for Partnership',
        type: 'list',
        content: [
          'PAN Cards of all Partners',
          'Identity Proofs (Aadhar, Voter ID, or DL)',
          'Address Proof of all partners',
          'Rental Agreement / Ownership Proof of Office',
          'Utility Bill for office address',
          'NOC from property owner'
        ]
      },
      {
        title: 'Partnership Registration Process',
        type: 'steps',
        content: [
          { title: 'Drafting Deed', description: 'Preparation of a comprehensive partnership deed on stamp paper.' },
          { title: 'Deed Execution', description: 'Signing of the deed by all partners in the presence of witnesses.' },
          { title: 'PAN Application', description: 'Applying for a permanent account number for the firm.' },
          { title: 'Deed Registration', description: 'Filing the deed with the Registrar of Firms (optional but recommended).' },
          { title: 'Obtain PAN & TAN', description: 'Receive tax identification numbers for official transactions.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Basic',
        price: '2,499',
        features: [
          'Professional Partnership Deed Drafting',
          'Firm PAN Card Application',
          'Stamp Paper Coordination (state specific)',
          'Digital Signature for one partner',
          'Consultation on Deed clauses'
        ]
      },
      {
        name: 'Standard',
        price: '4,399',
        isPopular: true,
        features: [
          'Everything in Basic Package',
          'Registration with Registrar of Firms (ROF)',
          'MSME (Udyam) Registration',
          'GST Registration',
          'TAN Application',
          'Bank Account opening kit'
        ]
      },
      {
        name: 'Full Setup',
        price: '28,799',
        features: [
          'Everything in Standard Package',
          'Bookkeeping and Accounting (1 Year)',
          'Income Tax Return Filing for firm',
          'GST Return Filing (12 months)',
          'TDS Compliance Support',
          'Trademark Registration'
        ]
      }
    ]
  },
  'huf': {
    id: 'huf',
    sections: [
      {
        title: 'Why Form a Hindu Undivided Family (HUF)?',
        type: 'grid',
        content: [
          { title: 'Tax Savings', description: 'HUF is treated as a separate taxpayer, providing an additional basic exemption limit.' },
          { title: 'Separate Legal Entity', description: 'It can hold assets, invest in property, and run a business independently.' },
          { title: 'Gift Benefits', description: 'HUF can receive gifts from family members under certain tax-exempt conditions.' },
          { title: 'Equal Rights', description: 'All family members (coparceners) have birthrights to the joint family property.' },
          { title: 'Legacy Management', description: 'Efficient way to manage and preserve ancestral wealth across generations.' },
          { title: 'Asset Protection', description: 'Provides a layer of separation between individual personal assets and family wealth.' }
        ]
      },
      {
        title: 'Documents Required for HUF',
        type: 'list',
        content: [
          'PAN Card of Karta',
          'Aadhar Card / Identity Proof of all members',
          'HUF Deed on Stamp Paper',
          'Declaration from Karta regarding the family structure',
          'Proof of HUF address (Utility bill / Rent agreement)',
          'List of members and their relationship with Karta'
        ]
      },
      {
        title: 'How to form an HUF',
        type: 'steps',
        content: [
          { title: 'Draft HUF Deed', description: 'Formalize family agreement to form an HUF on stamp paper.' },
          { title: 'Declaration by Karta', description: 'The Karta signs a formal declaration of family assets and members.' },
          { title: 'PAN Application', description: 'Apply for a permanent account number in the name of the HUF.' },
          { title: 'Bank Account', description: 'Open a formal bank account using the HUF PAN and Deed.' },
          { title: 'Start Operations', description: 'Transfer family assets or start business/investments.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Basic Deed',
        price: '3,999',
        features: [
          'HUF Deed Drafting',
          'Professional Consultation',
          'Declaration Templates',
          'Digital Delivery',
          'Guidance on Stamp Duty'
        ]
      },
      {
        name: 'HUF Registration',
        price: '5,799',
        isPopular: true,
        features: [
          'HUF Deed Drafting',
          'HUF PAN Card Application',
          'Notarization Assistance',
          'Bank Account Opening Kit',
          'Tax Saving Consultation'
        ]
      },
      {
        name: 'Comprehensive',
        price: '7,299',
        features: [
          'Everything in Registration Package',
          'Legal opinion on family assets',
          'First year tax filing guidance',
          'Dedicated support manager',
          'Gift Deed draft support'
        ]
      }
    ]
  },
  'public-ltd': {
    id: 'public-ltd',
    sections: [
      {
        title: 'Benefits of a Public Limited Company',
        type: 'grid',
        content: [
          { title: 'Access to Finance', description: 'Can raise huge capital from the general public through IPOs or bonds.' },
          { title: 'Limited Liability', description: 'Shareholders are only liable for the amount of shares they own.' },
          { title: 'Easy Transfer', description: 'Shares can be easily traded or transferred between individuals.' },
          { title: 'High Credibility', description: 'Stringent compliance makes it highly trusted by financial institutions.' },
          { title: 'Perpetual Succession', description: 'The entity continues to exist regardless of changes in directors/members.' },
          { title: 'Market Presence', description: 'Enhanced brand prestige compared to other business structures.' }
        ]
      },
      {
        title: 'Requirements for Public Limited',
        type: 'list',
        content: [
          'Minimum 7 Shareholders',
          'Minimum 3 Directors',
          'Digital Signature (DSC) for all directors',
          'Registered Office Address Proof',
          'Drafting of MOA and AOA',
          'No Minimum Capital Requirement (as per current laws)'
        ]
      },
      {
        title: 'Incorporation Stages',
        type: 'steps',
        content: [
          { title: 'Digital Signatures', description: 'Obtain DSC for the designated directors and shareholders.' },
          { title: 'Name Approval', description: 'Reserve a unique name with the Registrar of Companies.' },
          { title: 'Filing SPICe+', description: 'Detailed application including AOA, MOA, and declarations.' },
          { title: 'ROC Scrutiny', description: 'The Registrar reviews the application and documents.' },
          { title: 'Issuance of Certificate', description: 'The COI, PAN, and TAN are issued upon successful verification.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Starter',
        price: '24,999',
        features: [
          '3 DSC Registration',
          '3 DIN Application',
          'Name Reservation (RUN)',
          'Certificate of Incorporation',
          'PAN & TAN Application',
          'MOA & AOA Drafting',
          'Basic Statutory Records'
        ]
      },
      {
        name: 'Compliance Plus',
        price: '27,999',
        isPopular: true,
        features: [
          'Everything in Starter Package',
          'GST Registration',
          'MSME Registration',
          'Professional Tax Registration',
          'Commencement of Business filing',
          'Customized drafting for first Board Meeting'
        ]
      },
      {
        name: 'Premium Setup',
        price: '59,999',
        features: [
          'Everything in Compliance Plus',
          'Director Induction Training',
          'Secretarial Audit Readiness Check',
          'Trademark Registration (1 Class)',
          'Priority ROC Support',
          'Personal Corporate Advisor'
        ]
      }
    ]
  },
  'ecommerce': {
    id: 'ecommerce',
    sections: [
      {
        title: 'Benefits of E-commerce Registration',
        type: 'grid',
        content: [
          { title: 'Market Reach', description: 'Sell products throughout India and internationally without physical stores.' },
          { title: 'Brand Credibility', description: 'Proper registration allows you to sell on major platforms like Amazon and Flipkart.' },
          { title: 'Secure Payments', description: 'Easier to integrate with major payment gateways like Razorpay or Stripe.' },
          { title: 'Business Identity', description: 'Builds customer trust through formal legal recognition.' },
          { title: 'Tax Compliance', description: 'Ensure smooth GST compliance for interstate online sales.' },
          { title: 'Scalable Growth', description: 'Low overhead costs allow for rapid expansion compared to brick-and-mortar.' }
        ]
      },
      {
        title: 'E-commerce Documents',
        type: 'list',
        content: [
          'Business Entity Proof (COI/Partnership Deed)',
          'PAN Card of the Business',
          'GST Registration Certificate (Mandatory for E-com)',
          'Bank Account Statements/Cheque',
          'Identity Proof of owners',
          'Domain/Website details'
        ]
      },
      {
        title: 'Setup Workflow',
        type: 'steps',
        content: [
          { title: 'Entity Selection', description: 'Decide between Proprietorship, LLP, or Private Limited.' },
          { title: 'GST Registration', description: 'Obtain dedicated GST for online selling (mandatory for marketplace sellers).' },
          { title: 'Trademark Protection', description: 'Register your brand to prevent listing hijacks on marketplaces.' },
          { title: 'Marketplace Onboarding', description: 'Register as a seller on platforms like Amazon, Flipkart, or Myntree.' },
          { title: 'Gateway Integration', description: 'Setup online payment collection systems for your own website.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Quick Launch',
        price: '7,999',
        features: [
          'GST Registration',
          'MSME (Udyam) Registration',
          'Professional Tax (where applicable)',
          'Current Account Kit',
          'Consultation on Selling Platforms'
        ]
      },
      {
        name: 'Brand Protector',
        price: '10,799',
        isPopular: true,
        features: [
          'Everything in Quick Launch',
          'Trademark Filing (1 Class)',
          'Brand Name Search Report',
          'FSSAI Registration (if food related)',
          'Shop & Establishment license'
        ]
      },
      {
        name: 'Full E-Com Suite',
        price: '16,599',
        features: [
          'Everything in Brand Protector',
          'IEC Registration (for global sales)',
          'Drafting Terms of Service & Privacy Policy',
          'Vendor agreement templates',
          'Priority Customer Support'
        ]
      }
    ]
  },
  'gst-registration': {
    id: 'gst-registration',
    sections: [
      {
        title: 'Benefits of GST Registration',
        type: 'grid',
        content: [
          { title: 'Legal Recognition', description: 'Legally recognized as a supplier of goods or services.' },
          { title: 'Input Tax Credit', description: 'Proper accounting of taxes paid on inputs which can be used to pay GST.' },
          { title: 'Nationwide Reach', description: 'Ability to sell goods and services across India without barriers.' },
          { title: 'Ecommerce Access', description: 'Mandatory for selling on online platforms like Amazon, Flipkart, etc.' },
          { title: 'Builds Trust', description: 'Enhances business credibility with large corporations.' },
          { title: 'Avoiding Penalties', description: 'Avoid heavy penalties for conducting business without registration when required.' }
        ]
      },
      {
        title: 'Documents Required for GST',
        type: 'list',
        content: [
          'PAN Card of the Business / Individuals',
          'Identity and Address Proof of Promoters',
          'Business Address Proof (Electricity bill / Rent agreement)',
          'Bank Account Details (Cancelled cheque / Passbook)',
          'Digital Signature (for Companies/LLPs)',
          'Letter of Authorization / Board Resolution'
        ]
      },
      {
        title: 'GST Registration Process',
        type: 'steps',
        content: [
          { title: 'Information Sharing', description: 'Provide basic details and upload documents on our platform.' },
          { title: 'Application Processing', description: 'Our experts verify documents and file Form GST REG-01.' },
          { title: 'Acknowledgement (TRN)', description: 'Receive Temporary Reference Number for tracking.' },
          { title: 'Verification by Dept', description: 'GST officer reviews and approves the application.' },
          { title: 'GSTIN Issuance', description: 'Final GST certificate (Form GST REG-06) is issued.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Basic',
        price: '1,999',
        features: [
          'GST Registration for 1 Entity',
          'Document Verification',
          'Application Filing',
          'ARN Tracking',
          'GST Certificate Delivery'
        ]
      },
      {
        name: 'Standard',
        price: '3,299',
        isPopular: true,
        features: [
          'Everything in Basic Package',
          'MSME (Udyam) Registration',
          'HSR/SAC Code Finding',
          '1st Month GST Return Support',
          'Dedicated Tax Expert'
        ]
      },
      {
        name: 'Executive',
        price: '8,099',
        features: [
          'Everything in Standard Package',
          'Full Year GST Filing (GSTR-1 & 3B)',
          'ITC Reconciliation Support',
          'Lut Application (if required)',
          'Monthly Compliance Advisory'
        ]
      }
    ]
  },
  'trademark-registration': {
    id: 'trademark-registration',
    sections: [
      {
        title: 'Advantages of Trademark Registration',
        type: 'grid',
        content: [
          { title: 'Exclusive Rights', description: 'Ownership over the brand name, logo, or slogan in your industry.' },
          { title: 'Brand Identity', description: 'Creates a unique identity that distinguishes you from competitors.' },
          { title: 'Asset Value', description: 'A trademark is an intangible asset that can be sold, licensed, or franchised.' },
          { title: 'Legal Protection', description: 'Power to sue others for unauthorized use of your brand.' },
          { title: 'Global Coverage', description: 'Basis for filing trademarks in other countries using Madrid Protocol.' },
          { title: 'Validity period', description: 'Registered trademark is valid for 10 years and can be renewed indefinitely.' }
        ]
      },
      {
        title: 'Trademark Filing Checklist',
        type: 'list',
        content: [
          'Logo / Brand Name copy',
          'Identity/Address Proof of the applicant',
          'Partnership Deed / COI (for entities)',
          'Power of Attorney (signed)',
          'User Affidavit (if trademark is already in use)',
          'MSME/Startup Certificate (to get 50% govt fee discount)'
        ]
      },
      {
        title: 'Stages of Trademark Registration',
        type: 'steps',
        content: [
          { title: 'Trademark Search', description: 'Detailed search to ensure the name is unique and available.' },
          { title: 'Class Selection', description: 'Identifying the right classes (0-45) for your products/services.' },
          { title: 'Application Filing', description: 'Submission of Form TM-A with the Registry.' },
          { title: 'Examination Report', description: 'Addressing any objections raised by the TM examiner.' },
          { title: 'Journal Publication', description: 'The TM is published in the TM Journal for public opposition (4 months).' },
          { title: 'Registration', description: 'Issuance of the Trademark Certificate if no opposition is received.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Search & File',
        price: '1,499',
        features: [
          'TM Availability Search',
          'Class Selection Assistance',
          'Application Drafting',
          'Filing with TM Registry',
          'TM Journal Tracking'
        ]
      },
      {
        name: 'Standard',
        price: '3,999',
        isPopular: true,
        features: [
          'Everything in Search & File',
          'Drafting Reply to Examination Report',
          'Logo/Identity Design Protection',
          'MSME Certificate (to save ₹4500 govt fee)',
          'Priority Processing'
        ]
      },
      {
        name: 'Complete Protection',
        price: '4,999',
        features: [
          'Everything in Standard Package',
          'Opposition Monitoring (Trademark Watch)',
          'Renewal Reminders',
          'Legal opinion on brand strategy',
          'Affidavit Drafting'
        ]
      }
    ]
  },
  'msme-registration': {
    id: 'msme-registration',
    sections: [
      {
        title: 'Benefits of MSME (Udyam) Registration',
        type: 'grid',
        content: [
          { title: 'Government Subsidies', description: 'Access to various central and state government schemes and subsidies.' },
          { title: 'Collateral Free Loans', description: 'Easier access to credit with credit guarantee schemes.' },
          { title: 'Interest Rate Preference', description: 'Benefit of lower interest rates from banks on business loans.' },
          { title: 'ISO Reimbursement', description: 'Get refund of costs incurred for ISO certification.' },
          { title: 'Prompt Payments', description: 'Protection against delayed payments from buyers.' },
          { title: 'Tender Preference', description: 'Priority in government tenders and procurement.' }
        ]
      },
      {
        title: 'Udyam Documents',
        type: 'list',
        content: [
          'Aadhar Card of the Owner/Partner/Director',
          'PAN Card of the Business Entity',
          'Business Address Proof',
          'Bank Account Number & IFSC',
          'Social Category of the entrepreneur',
          'Number of employees and investment details'
        ]
      },
      {
        title: 'How to Get MSME Certificate',
        type: 'steps',
        content: [
          { title: 'Portal Login', description: 'Register on the Udyam Registration portal using Aadhar.' },
          { title: 'Personal Details', description: 'Provide name, social category, and contact info.' },
          { title: 'Business Details', description: 'Enter business name, address, and bank info.' },
          { title: 'Operations Info', description: 'Input investment in plant & machinery and turnover.' },
          { title: 'OTP Verification', description: 'Verify using Aadhar linked mobile number.' },
          { title: 'Download Certificate', description: 'Generate and download the e-certificate immediately.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Basic MSME',
        price: '1,699',
        features: [
          'Udyam Portal Filing',
          'Document Verification',
          'NIC Code Selection'
        ]
      },
      {
        name: 'Standard MSME',
        price: '2,199',
        isPopular: true,
        features: [
          'Everything in Basic Package',
          'Udyam e-Certificate delivery',
          'Bank Account Opening Advice'
        ]
      },
      {
        name: 'Premium MSME',
        price: '9,199',
        features: [
          'Everything in Standard Package',
          'Government Subsidies assistance advisory',
          'Collateral-free loan application support'
        ]
      }
    ]
  },
  'gst-modification': {
    id: 'gst-modification',
    sections: [
      {
        title: 'What is GST Modification?',
        type: 'grid',
        content: [
          { title: 'Update Details', description: 'Modify your core or non-core business details in the GST registry.' },
          { title: 'Change Address', description: 'Update your registered office or additional place of business.' },
          { title: 'Partner/Director Change', description: 'Add or remove designated partners/directors from your registration.' },
          { title: 'Correct Errors', description: 'Fix mistakes made during the initial registration process.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Basic Modification',
        price: '499',
        features: [
          'Request for Data Change',
          'Document Verification',
          'Form Filing (GST REG-14)'
        ]
      },
      {
        name: 'Standard Modification',
        price: '1,499',
        isPopular: true,
        features: [
          'Everything in Basic Package',
          'Additional Place of Business addition',
          'ARN Tracking & Officer follow up'
        ]
      },
      {
        name: 'Premium Modification',
        price: '1,799',
        features: [
          'Everything in Standard Package',
          'Core Fields Modification support',
          'Dedicated Tax Consultant review'
        ]
      }
    ]
  },
  'pan-application': {
    id: 'pan-application',
    sections: [
      {
        title: 'PAN Card Application',
        type: 'grid',
        content: [
          { title: 'Identity Proof', description: 'Acts as a primary nationwide photo identification for Indian citizens.' },
          { title: 'Income Tax', description: 'Mandatory for filing tax returns and claiming refunds.' },
          { title: 'High-Value Deals', description: 'Required for buying/selling property or high-value assets.' },
          { title: 'Bank Account', description: 'Essential for opening any type of bank account or wallet.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Express e-PAN',
        price: '499',
        features: [
          'Application Filing',
          'Document Sorting',
          'e-PAN digital delivery'
        ]
      },
      {
        name: 'Standard PAN',
        price: '999',
        isPopular: true,
        features: [
          'Everything in Express Package',
          'Physical Card Delivery',
          'Address Tracking support'
        ]
      },
      {
        name: 'Premium PAN (Corporate)',
        price: '2,499',
        features: [
          'Everything in Standard Package',
          'Corporate/Entity PAN registration',
          '1-on-1 advisor support'
        ]
      }
    ]
  },
  'tan-application': {
    id: 'tan-application',
    sections: [
      {
        title: 'TAN Registration',
        type: 'grid',
        content: [
          { title: 'TDS Deduction', description: 'Required for anyone who deducts tax at source from payments.' },
          { title: 'Legal Necessity', description: 'Mandatory under Section 203A of the Income Tax Act.' },
          { title: 'TDS Returns', description: 'Essential for filing quarterly TDS returns.' },
          { title: 'Quote in Documents', description: 'Must be quoted in all certificates and challans.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Basic TAN',
        price: '499',
        features: [
          'TAN Application Filing',
          'Verification Support',
          'Digital Copy Delivery'
        ]
      },
      {
        name: 'Standard TAN',
        price: '1,999',
        isPopular: true,
        features: [
          'Everything in Basic Package',
          'TAN Allotment Letter',
          'Post-Registration Guidance'
        ]
      },
      {
        name: 'Comprehensive TAN',
        price: '6,499',
        features: [
          'Everything in Standard Package',
          'TDS Return Filing Setup support',
          '1 Year Advisory support'
        ]
      }
    ]
  },
  'iec-modification': {
    id: 'iec-modification',
    sections: [
      {
        title: 'IEC License Modification',
        type: 'grid',
        content: [
          { title: 'Profile Update', description: 'Annually required profile update on DGFT portal.' },
          { title: 'Details Change', description: 'Change of address, partners, or bank account details.' },
          { title: 'Auto-Approval', description: 'Most IEC changes are now auto-approved on the portal.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Basic Modification',
        price: '2,399',
        features: [
          'DGFT Profile Login',
          'Update Particulars',
          'Document Upload'
        ]
      },
      {
        name: 'Standard Modification',
        price: '3,299',
        isPopular: true,
        features: [
          'Everything in Basic Package',
          'Fee Handling coordination',
          'Modified e-IEC Download'
        ]
      }
    ]
  },
  'esi-registration': {
    id: 'esi-registration',
    sections: [
      {
        title: 'ESIC Registration Benefits',
        type: 'grid',
        content: [
          { title: 'Medical Aid', description: 'Free medical treatment for employees and dependents.' },
          { title: 'Cash Benefits', description: 'Cash assistance during sickness or maternity.' },
          { title: 'Disability Benefits', description: 'Financial support in case of workplace injuries.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Basic ESIC',
        price: '5,999',
        features: [
          'ESI Entity Registration',
          'Portal Login Setup',
          'Compliance Support'
        ]
      },
      {
        name: 'Standard ESIC',
        price: '12,999',
        isPopular: true,
        features: [
          'Everything in Basic Package',
          'Employee Data Upload',
          'Monthly Return Advice'
        ]
      },
      {
        name: 'Premium ESIC',
        price: '19,999',
        features: [
          'Everything in Standard Package',
          'Annual ESIC compliance review',
          'Dedicated compliance manager'
        ]
      }
    ]
  },
  'epf-registration': {
    id: 'epf-registration',
    sections: [
      {
        title: 'EPF Registration Details',
        type: 'grid',
        content: [
          { title: 'Retirement Fund', description: 'Mandatory savings pool for employee retirement.' },
          { title: 'PFRDA/EPFO', description: 'Managed under the Employees Provident Fund Organization.' },
          { title: 'Universal Account', description: 'Generation of UAN for all registered employees.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Basic EPF',
        price: '5,999',
        features: [
          'EPF Registration Filing',
          'Employer Login Details',
          'DSC Linkage Support'
        ]
      },
      {
        name: 'Standard EPF',
        price: '12,999',
        isPopular: true,
        features: [
          'Everything in Basic Package',
          'UAN Generation Support',
          'ECR Return Guidance'
        ]
      },
      {
        name: 'Premium EPF',
        price: '19,999',
        features: [
          'Everything in Standard Package',
          'Annual EPF compliance audit dashboard',
          'Dedicated compliance specialist support'
        ]
      }
    ]
  },
  'digital-signature': {
    id: 'digital-signature',
    sections: [
      {
        title: 'Class 3 Digital Signature',
        type: 'list',
        content: [
          'High Level Security: Used for E-tenders, GST, and MCA filings.',
          'Assurance: Guarantees authenticity of the signer.',
          'Format: Usually provided in a secure USB Token.',
          'Validity: Options for 1 year, 2 years, or 3 years.'
        ]
      }
    ],
    packages: [
      {
        name: '1 Year DSC',
        price: '1,999',
        features: [
          'Class 3 Combo (Sign + Encrypt)',
          'USB Crypto Token included',
          'Video Verification support'
        ]
      },
      {
        name: '2 Year DSC',
        price: '2,499',
        isPopular: true,
        features: [
          'Everything in 1 Year plan',
          'Paperless processing support',
          '2 Years validity support'
        ]
      },
      {
        name: '3 Year DSC',
        price: '3,799',
        features: [
          'Everything in 2 Year plan',
          '3 Years validity support',
          'Express Courier priority delivery'
        ]
      }
    ]
  },
  'din-application': {
    id: 'din-application',
    sections: [
      {
        title: 'Director Identification Number (DIN)',
        type: 'grid',
        content: [
          { title: 'Unique ID', description: 'Lifetime identification number for existing or aspiring directors.' },
          { title: 'Legal Requirement', description: 'Mandatory for any person signing company documents.' },
          { title: 'Linked to PAN', description: 'Mapped to the individuals personal identity records.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Basic DIN',
        price: '2,499',
        features: [
          'Form DIR-3 Filing',
          'Verification Support',
          'Approval Coordination'
        ]
      },
      {
        name: 'Standard DIN',
        price: '2,999',
        isPopular: true,
        features: [
          'Everything in Basic Package',
          'Digital Intimation certificate',
          'Post-allotment compliance advisory'
        ]
      },
      {
        name: 'Comprehensive DIN',
        price: '3,999',
        features: [
          'Everything in Standard Package',
          'Dual DIN mapping configuration',
          '1-on-1 advisor desk consultation'
        ]
      }
    ]
  },
  'iec-registration': {
    id: 'iec-registration',
    sections: [
      {
        title: 'Advantages of Import Export Code (IEC)',
        type: 'grid',
        content: [
          { title: 'Global Business Expansion', description: 'Enables your business to participate in the international market.' },
          { title: 'Government Schemes', description: 'Eligibility for various export incentives and schemes from DGFT and Customs.' },
          { title: 'Lifetime Validity', description: 'Once issued, the IEC is valid for the lifetime of the business entity.' },
          { title: 'No Annual Filings', description: 'Requires no annual filing of returns once registered (except annual profile update).' },
          { title: 'Easy Compliance', description: 'Simplified registration process with DGFT portal.' },
          { title: 'Legal Recognition', description: 'Standard identifier for any business dealing with international trade.' }
        ]
      },
      {
        title: 'Documents Required for IEC',
        type: 'list',
        content: [
          'PAN Card of the Individual or Business',
          'Voter ID / Aadhar Card of the individual',
          'Cancelled Cheque of the current bank account',
          'Address Proof of the business establishment',
          'Digital Signature (Class 3) - mandatory for filing',
          'Photograph of the proprietor / partner'
        ]
      },
      {
        title: 'IEC Registration Process',
        type: 'steps',
        content: [
          { title: 'Registration on DGFT', description: 'Creating a user profile on the DGFT (Director General of Foreign Trade) portal.' },
          { title: 'IEC Application Filing', description: 'Filling out the online application link to your PAN.' },
          { title: 'Fee Payment', description: 'Payment of government fees for the application.' },
          { title: 'Auto-Certification', description: 'System-based verification of PAN and bank details.' },
          { title: 'e-IEC Issuance', description: 'Instant generation of the digital IEC certificate.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Basic IEC',
        price: '3,299',
        features: [
          'DGFT Portal Registration',
          'Application Filing',
          'PAN & Bank Linkage',
          'Digital IEC Certificate'
        ]
      },
      {
        name: 'Standard IEC',
        price: '4,299',
        isPopular: true,
        features: [
          'Everything in Basic Package',
          'Import-Export Consultation',
          'DSC Registration mapping'
        ]
      },
      {
        name: 'Premium IEC',
        price: '6,099',
        features: [
          'Everything in Standard Package',
          'Export Incentives Scheme advisory',
          'Dedicated Trade Advisor support'
        ]
      }
    ]
  },
  'fssai-registration': {
    id: 'fssai-registration',
    sections: [
      {
        title: 'Importance of FSSAI License',
        type: 'grid',
        content: [
          { title: 'Legal Status', description: 'Legally mandatory for any business dealing with food manufacturing or trading.' },
          { title: 'Quality Assurance', description: 'Assures consumers about the quality and safety of the food products.' },
          { title: 'Brand Visibility', description: 'FSSAI logo on products creates trust among customers.' },
          { title: 'Business Expansion', description: 'Mandatory for selling food items on platforms like Swiggy, Zomato, or retailers.' },
          { title: 'Health Safety', description: 'Ensures that food is produced under hygienic and safe conditions.' },
          { title: 'Penalty Avoidance', description: 'Avoid heavy fines and business closure for non-compliance with food safety laws.' }
        ]
      },
      {
        title: 'FSSAI Documents Checklist',
        type: 'list',
        content: [
          'Photo of the FBO (Food Business Operator)',
          'Identity Proof (Aadhar/Voter ID)',
          'Address Proof of the business premises',
          'List of food categories/items',
          'Blueprints/layout plan of the food unit',
          'NOC from the owner or Rental Agreement'
        ]
      },
      {
        title: 'FSSAI Registration Workflow',
        type: 'steps',
        content: [
          { title: 'Eligibility Check', description: 'Determining if you need Basic, State, or Central license based on turnover.' },
          { title: 'Filing Application', description: 'Submitting Form A or Form B on the FoSCoS portal.' },
          { title: 'Fee Payment', description: 'Online payment of government license fees (1 to 5 years).' },
          { title: 'Inspection', description: 'Food safety officer may inspect the premises (for State/Central).' },
          { title: 'Approval & Issuance', description: 'The FSSAI certificate is issued digitally.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Basic FSSAI',
        price: '1,499',
        features: [
          'FSSAI Registration for 1 Year',
          'Document Preparation',
          'FoSCoS Portal Filing',
          'Nomination Support',
          'Hygienic Guidance'
        ]
      },
      {
        name: 'FSSAI State License',
        price: '4,999',
        isPopular: true,
        features: [
          'State License Filing',
          'Technical Document Drafting',
          'Follow up with Authorities',
          'Audit Readiness Support',
          'License for up to 30 Lacs+ turnover'
        ]
      }
    ]
  },
  'shop-establishment': {
    id: 'shop-establishment',
    sections: [
      {
        title: 'Why Register under Shop & Establishment Act?',
        type: 'grid',
        content: [
          { title: 'Legal Entity Proof', description: 'Serves as proof of existence of the commercial establishment.' },
          { title: 'Bank Account Opening', description: 'Primary document required by banks to open a current account.' },
          { title: 'Govt Benefits', description: 'Benefit from various state government welfare schemes.' },
          { title: 'Peace of Mind', description: 'Ensures compliance with labor laws regarding work hours, holidays, etc.' },
          { title: 'Nuisance Check', description: 'Helps in maintaining regulated commercial activity in urban areas.' },
          { title: 'Mandatory License', description: 'Required for any business operating from a physical shop or office.' }
        ]
      },
      {
        title: 'Documents Checklist',
        type: 'list',
        content: [
          'Identity Proof of Proprietor',
          'Address Proof of Proprietor',
          'Business Address Proof (Property Documents / Rent Deed)',
          'NOC from Landlord',
          'Photograph of the Shop (Interior & Exterior)',
          'List of Employees'
        ]
      },
      {
        title: 'Registration Steps',
        type: 'steps',
        content: [
          { title: 'Application Form', description: 'Fill the specific form as per your state Labor Department rules.' },
          { title: 'Submission', description: 'Submit with all supporting documents online.' },
          { title: 'Inspection', description: 'Labor inspector may conduct a site visit if required.' },
          { title: 'Fee Payment', description: 'Payment of prescribed government registration fees.' },
          { title: 'Certificate Issued', description: 'Download the registration certificate from the portal.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Standard Registration',
        price: '2,499',
        features: [
          'State-wise Labor Dept Filing',
          'Document Verification',
          'Application Tracking',
          'Certificate Delivery',
          'Compliance Guidance'
        ]
      }
    ]
  },
  'professional-tax': {
    id: 'professional-tax',
    sections: [
      {
        title: 'Benefits of Professional Tax Registration',
        type: 'grid',
        content: [
          { title: 'Compliance with Law', description: 'Mandatory for employers and self-employed professionals in many states.' },
          { title: 'Avoiding Penalties', description: 'Stay safe from heavy fines imposed for non-registration.' },
          { title: 'Deduction Benefit', description: 'Professional tax paid is deductible from the taxable income of employees.' },
          { title: 'Contribution to State', description: 'The tax revenue is used for state welfare and development.' },
          { title: 'Smooth Operations', description: 'Avoid legal hurdles during audits or labor inspections.' },
          { title: 'Local Compliance', description: 'Meets the specific requirements of the state legislation.' }
        ]
      },
      {
        title: 'Required Documents',
        type: 'list',
        content: [
          'PAN Card of the Individual / Entity',
          'Address Proof of the business establishment',
          'Bank Account details',
          'Identity and Address Proof of all directors/partners',
          'Board Resolution for companies',
          'Memorandum & Articles of Association'
        ]
      }
    ],
    packages: [
      {
        name: 'Standard P-Tax',
        price: '1,499',
        features: [
          'State-wise P-Tax Enrollment',
          'Certificate of Enrollment',
          'Form Filing Assistance',
          'Tax Deduction Guidance',
          'Online Certificate Delivery'
        ]
      }
    ]
  },
  'startup-india': {
    id: 'startup-india',
    sections: [
      {
        title: 'Benefits of Startup India Recognition',
        type: 'grid',
        content: [
          { title: 'Self-Certification', description: 'Self-certify compliance under 9 labor and environmental laws.' },
          { title: 'Tax Exemption', description: 'Eligibility for 3-year income tax holiday under Section 80-IAC.' },
          { title: 'Easy Winding Up', description: 'Fast-track exit for startups within 90 days under Insolvency & Bankruptcy Code.' },
          { title: 'Public Procurement', description: 'Prior experience and turnover criteria relaxed in govt tenders.' },
          { title: 'IPR Benefits', description: 'Up to 80% rebate in patent filing and fast-tracked processing.' },
          { title: 'Fund of Funds', description: 'Access to easy capital through various government-backed funds.' }
        ]
      },
      {
        title: 'Eligibility for DPIIT Recognition',
        type: 'list',
        content: [
          'Entity must be a Pvt Ltd, LLP, or registered Partnership',
          'Incorporated for less than 10 years',
          'Annual turnover hasn\'t exceeded 100 Crore',
          'Must be working towards innovation or improvement',
          'Entity shouldn\'t be formed by splitting up an old business',
          'Supported by a recommendation letter or innovative project'
        ]
      }
    ],
    packages: [
      {
        name: 'DPIIT Recognition',
        price: '4,999',
        features: [
          'DPIIT Startup Recognition',
          'Innovative Project Description drafting',
          'Certificate of Recognition',
          'Tax Holiday Application Support',
          'Priority Government Benefits support'
        ]
      }
    ]
  },
  'esi-pf-registration': {
    id: 'esi-pf-registration',
    sections: [
      {
        title: 'Why Register for ESI & PF?',
        type: 'grid',
        content: [
          { title: 'Employee Welfare', description: 'Provides medical, pension, and insurance benefits to workers.' },
          { title: 'Legal Necessity', description: 'Mandatory for establishments with more than 10/20 employees.' },
          { title: 'Employer Brand', description: 'Attracts talent by offering formal social security benefits.' },
          { title: 'Avoid Penalties', description: 'Heavy fines and legal consequences for delaying mandatory registrations.' },
          { title: 'Financial Security', description: 'Helps employees save for retirement through PF contributions.' },
          { title: 'Insurance Coverage', description: 'ESI provides accidental and sickness coverage for employees.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Combined Setup',
        price: '3,499',
        features: [
          'ESI Entity Registration',
          'EPFO Entity Registration',
          'Initial Login Credentials',
          'Compliance Calendar Setup',
          'Support for First Month Returns'
        ]
      }
    ]
  },
  'pan-tan-registration': {
    id: 'pan-tan-registration',
    sections: [
      {
        title: 'Need for PAN & TAN',
        type: 'list',
        content: [
          'PAN: Required for all financial transactions and filing income tax returns.',
          'TAN: Mandatory for individuals/entities who are required to deduct tax at source (TDS).',
          'PAN: Serves as a primary identity proof for any business structure.',
          'TAN: Must be quoted in all TDS-related documents and returns.',
          'Compliance: Huge penalties for not quoting PAN/TAN when required by law.'
        ]
      }
    ],
    packages: [
      {
        name: 'Instant PAN & TAN',
        price: '999',
        features: [
          'PAN Card Application',
          'TAN Number Application',
          'Document Verification',
          'Digital Copy Delivery',
          'Physical Card Coordination'
        ]
      }
    ]
  },
  'gst-returns': {
    id: 'gst-returns',
    sections: [
      {
        title: 'Importance of GST Returns',
        type: 'grid',
        content: [
          { title: 'Accurate Filing', description: 'Expert review of your data to ensure error-free submission of GSTR-1 and GSTR-3B.' },
          { title: 'Timely Reminders', description: 'Automated alerts and dedicated follow-ups to ensure you never miss a deadline.' },
          { title: 'Full Compliance', description: 'Stay 100% compliant with the latest GST laws and notification updates.' },
          { title: 'Expert Guidance', description: 'Direct access to tax professionals for resolving complex GST queries.' },
          { title: 'Simple Process', description: 'Just upload your data and let our experts handle the technical filing.' },
          { title: 'Cost Effective', description: 'Affordable plans designed for startups and small business owners.' }
        ]
      },
      {
        title: 'GST Return Forms to be Filed',
        type: 'list',
        content: [
          'GSTR-1: Monthly/Quarterly return for outward supplies (Sales).',
          'GSTR-3B: Monthly summary return for tax payment and ITC claim.',
          'GSTR-9: Annual return for regular GST taxpayers.',
          'GSTR-9A: Annual return for composition scheme taxpayers.',
          'GSTR-9C: Reconciliation statement for taxpayers with turnover above a certain limit.',
          'GSTR-4: Annual return for composition scheme players.'
        ]
      },
      {
        title: 'Documents Required for GST Return',
        type: 'list',
        content: [
          'Purchase Invoices for the period',
          'Sales Invoices for the period',
          'GST Ledger balance for ITC verification',
          'Bank Statements for reconciliation',
          'GST Portal Credentials',
          'E-way bill details (if applicable)'
        ]
      }
    ],
    packages: [
      {
        name: 'Basic Filing',
        price: '599',
        features: [
          'Monthly GSTR-3B Filing',
          'Monthly GSTR-1 Filing',
          'Data Validation',
          'Quarterly ITC Reconciliation',
          'Email Support'
        ]
      },
      {
        name: 'Standard Compliance',
        price: '7,999',
        isPopular: true,
        features: [
          'Full Year Monthly/Quarterly Filings',
          'Reconciliation with GSTR-2B',
          'Annual Return (GSTR-9)',
          'Representation in case of minor notices',
          'Dedicated Tax Manager'
        ]
      },
      {
        name: 'Premium Advisory',
        price: '9,999',
        features: [
          'Everything in Standard Package',
          'Audit Support',
          'Advance Tax Planning',
          'Refund Application Support',
          'Unlimited Consultation'
        ]
      }
    ]
  },
  'income-tax-returns': {
    id: 'income-tax-returns',
    sections: [
      {
        title: 'Why You Should File Income Tax Returns',
        type: 'grid',
        content: [
          { title: 'Taxable Income Proof', description: 'Serves as an official document to verify your annual earnings.' },
          { title: 'Credibility', description: 'Essential for high-value transactions and improving financial standing.' },
          { title: 'Carry Forward Losses', description: 'Allows you to carry forward business or capital losses to future years.' },
          { title: 'Financial Strength', description: 'Key document required for business loan and mortgage approvals.' },
          { title: 'Tax Refunds', description: 'The only way to claim back excess tax deducted (TDS) from your income.' },
          { title: 'Avoiding Tax Notices', description: 'Compliance ensures peace of mind and protection from legal notices.' }
        ]
      },
      {
        title: 'Documents Checklist for ITR',
        type: 'list',
        content: [
          'PAN and Aadhar Card',
          'Form 16 / Form 16A / Form 26AS',
          'Bank Account Statements for the full year',
          'Investment Proofs under 80C, 80D, etc.',
          'Business P&L and Balance Sheet (for entrepreneurs)',
          'Capital Gains statements (for stock/property sales)'
        ]
      },
      {
        title: 'ITR Process Flow',
        type: 'steps',
        content: [
          { title: 'Data Gathering', description: 'Upload your financial documents through our secure portal.' },
          { title: 'Tax Computation', description: 'Our experts calculate your final tax liability and eligibility for deductions.' },
          { title: 'Draft Review', description: 'Review the prepared return draft for any corrections.' },
          { title: 'Online Filing', description: 'We submit your return to the Income Tax Department portal.' },
          { title: 'E-Verification', description: 'Assistance in e-verifying your return through Aadhar OTP or Net Banking.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Individual / Salaried',
        price: '1,199',
        features: [
          'Standard ITR Filing (ITR-1/2)',
          'Form 16 Analysis',
          'Deduction Optimization',
          'E-verification Support',
          'Income from Other Sources'
        ]
      },
      {
        name: 'Business / Professional',
        price: '1,999',
        isPopular: true,
        features: [
          'Business ITR Filing (ITR-3/4)',
          'Presumptive Taxation Support',
          'P&L Categorization',
          'Depreciation Calculation',
          'Tax Savings Consultation'
        ]
      },
      {
        name: 'Corporate / Trust',
        price: '3,499',
        features: [
          'ITR Filing for Companies/LLPs (ITR-5/6)',
          'Audit Report Integration',
          'Minimum Alternate Tax (MAT) handling',
          'Foreign Asset Reporting',
          'Priority Corporate Support'
        ]
      }
    ]
  },
  'tds-returns': {
    id: 'tds-returns',
    sections: [
      {
        title: 'Benefits of TDS Return Filing',
        type: 'grid',
        content: [
          { title: 'Timely Compliance', description: 'Meet statutory deadlines to ensure legal and financial regularity.' },
          { title: 'Avoid Penalties', description: 'Prevent heavy interest and penalties for delayed submissions.' },
          { title: 'Financial Credibility', description: 'Maintain a clean record with tax authorities for business growth.' },
          { title: 'Credit for Deductees', description: 'Ensure the vendors/employees receive credit for the tax deducted.' },
          { title: 'Smooth Processing', description: 'Efficient handling of data to ensure error-free reconciliation.' },
          { title: 'Error-Free Reporting', description: 'Validation using latest NSDL utilities before final submission.' }
        ]
      },
      {
        title: 'Checklist for TDS Returns',
        type: 'list',
        content: [
          'TAN Number of the Deductor',
          'PAN of the Deductor and all Deductees',
          'TDS Challan details (BSR code, date, amount)',
          'Details of payment to Deductees',
          'Reason for non-deduction or lower deduction (if any)',
          'Type of payment (Salary, Rent, Professional Fees, etc.)'
        ]
      }
    ],
    packages: [
      {
        name: 'Basic Filing',
        price: '999',
        features: [
          'Quarterly Form 24Q/26Q Filing',
          'Consolidated File Preparation',
          'FVU Generation',
          'Token Receipt Generation',
          'Help in Form 16/16A generation'
        ]
      },
      {
        name: 'Annual Support',
        price: '5,999',
        isPopular: true,
        features: [
          'Full Year TDS Compliance (All 4 Quarters)',
          'Correction Return Support (1 revision)',
          'Challan Reconciliation',
          'Justification Report Analysis',
          'Dedicated TDS Expert'
        ]
      },
      {
        name: 'Premium Support / Corporate',
        price: '8,999',
        features: [
          'Everything in Annual Support Package',
          'Unlimited Correction filings',
          'Notice & Default Resolution support',
          'Interest and Late Fees optimization',
          'Priority Call / Video consultation support'
        ]
      }
    ]
  },
  'pf-returns': {
    id: 'pf-returns',
    sections: [
      {
        title: 'Why Choose Expert PF Return Services?',
        type: 'grid',
        content: [
          { title: 'Regulatory Compliance', description: 'Stay compliant with the latest EPF rules and amendment notifications.' },
          { title: 'Penalty Avoidance', description: 'Avoid huge interest and damages for late or incorrect deposits.' },
          { title: 'Employee Trust', description: 'Timely deposits build confidence and loyalty among your workforce.' },
          { title: 'Audit Readiness', description: 'Maintain clean records that facilitate smooth statutory audits.' },
          { title: 'Employee Welfare', description: 'Ensure social security benefits are correctly mapped to each employee.' },
          { title: 'Legal Standing', description: 'Compliant PF records are often required for government tenders and licenses.' }
        ]
      },
      {
        title: 'Documents Required for PF Filing',
        type: 'list',
        content: [
          'Employees Attendance Register',
          'Salary/Wage Register for the month',
          'Details of new employees (Name, DOB, Date of Joining)',
          'PAN and Aadhar for UAN mapping',
          'Monthly Salary Disbursal proofs',
          'Bank statements showing payroll transactions'
        ]
      }
    ],
    packages: [
      {
        name: 'Monthly Filing',
        price: '999',
        features: [
          'Monthly ECR Generation',
          'Challan Preparation',
          'New Employee Registration',
          'UAN Activation Support',
          'Digital Signature Integration'
        ]
      },
      {
        name: 'Standard Year Support',
        price: '8,999',
        features: [
          'Everything in Monthly Filing for 1 Full Year',
          'Dedicated compliance check & audit readiness',
          'E-payslips and payroll-aligned mapping template support',
          'Queries and support helpline'
        ]
      },
      {
        name: 'Premium Compliance',
        price: '13,999',
        isPopular: true,
        features: [
          'Full Year Comprehensive Support',
          'Annual PF Account Statement assistance',
          'Help with Employee Transfers/Withdrawals',
          'PF Audit Support',
          'Dedicated HR Compliance Manager'
        ]
      }
    ]
  },
  'tds-returns-revision': {
    id: 'tds-returns-revision',
    sections: [
      {
        title: 'When is TDS Return Revision Required?',
        type: 'grid',
        content: [
          { title: 'Incorrect TAN/PAN', description: 'Correcting mistakes in the deductor or deductee identification details.' },
          { title: 'Challan Mismatch', description: 'Rectifying errors in challan amount or BSR code entries.' },
          { title: 'Omission of Entry', description: 'Adding any deductee record that was missed in the original filing.' },
          { title: 'Revised Amount', description: 'Changing the payment or deduction amount due to calculation errors.' },
          { title: 'Category Correction', description: 'Changing the section under which tax was deducted.' },
          { title: 'Justification File', description: 'Responding to defaults identified in the justification report from TRACES.' }
        ]
      },
      {
        title: 'TDS Revision Benefits',
        type: 'list',
        content: [
          'Penalty Mitigation: Addressing defaults quickly to stop interest accumulation.',
          'Credit Flow: Ensuring deductees get their rightful tax credits in Form 26AS.',
          'Compliance Score: Maintaining a healthy tax compliance profile for the business.',
          'Notice Resolution: Closing outstanding demands from the IT department.'
        ]
      }
    ],
    packages: [
      {
        name: 'Single Revision',
        price: '999',
        features: [
          'Correction Data Preparation',
          'TRACES Justification File Analysis',
          'Revised FVU Generation',
          'Submission Coordination',
          'Status Tracking'
        ]
      },
      {
        name: 'Standard Correction',
        price: '1,499',
        features: [
          'Up to 2 Quarters revisions',
          'Detailed TRACES Report Analysis',
          'Challan Correction and alignment',
          'Standard Support'
        ]
      },
      {
        name: 'Bulk Correction',
        price: '2,499',
        isPopular: true,
        features: [
          'Corrections for Multiple Quarters',
          'Detailed TRACES Query Resolution',
          'PAN Mismatch Bulk Fixes',
          'Interest Calculation Assistance',
          'Priority Resolution Support'
        ]
      }
    ]
  },
  'esi-returns': {
    id: 'esi-returns',
    sections: [
      {
        title: 'Benefits of Regular ESI Returns',
        type: 'grid',
        content: [
          { title: 'Legal Compliance', description: 'Strict adherence to the ESI Act, 1948 rules for registered units.' },
          { title: 'Employee Welfare', description: 'Secures continuous access to medical benefits for workers and families.' },
          { title: 'Avoids Penalties', description: 'Saves the business from heavy fines and legal prosecution for defaults.' },
          { title: 'Smooth Operations', description: 'Ensures no disruption in social security coverage for the staff.' },
          { title: 'Builds Employee Trust', description: 'Shows commitment to the social security needs of the employees.' },
          { title: 'Audit Ease', description: 'Organized records lead to hassle-free inspections by authorities.' }
        ]
      },
      {
        title: 'ESI Returns Documentation',
        type: 'list',
        content: [
          'Monthly Contribution Calculation Sheet',
          'Employee List with ESIC Insurance Numbers',
          'Wages/Salary Statement for the month',
          'Attendance register of all employees',
          'Details of any workplace accidents (if any)',
          'Bank statement of payment of contributions'
        ]
      }
    ],
    packages: [
      {
        name: 'Monthly Filing',
        price: '999',
        features: [
          'Monthly Data Upload',
          'ESI Challan Generation',
          'New Employee ID Generation',
          'TIC (Temporary Identity Card) Support',
          'Online Submission'
        ]
      },
      {
        name: 'Standard Year',
        price: '8,999',
        isPopular: true,
        features: [
          'Full Year Monthly Filings',
          'Half-Yearly Compliance Verification',
          'Employee Benefit Claims support',
          'Notice Handling Assistance',
          'Tax Expert Advisory'
        ]
      },
      {
        name: 'Premium Full Compliance',
        price: '13,999',
        features: [
          'Everything in Standard Year Package',
          'Unrestricted support on benefit cases and inspection',
          'Dedicated Compliance Expert assignment',
          'Full statutory coordination with ESIC officers'
        ]
      }
    ]
  },
  'salaried-itr': {
    id: 'salaried-itr',
    sections: [
      {
        title: 'Documents Required for Salaried ITR',
        type: 'list',
        content: [
          'Form 16 issued by your employer(s)',
          'Form 26AS & Annual Information Statement (AIS / TIS)',
          'PAN Card and Aadhaar Card linkage verification',
          'Bank accounts details (including all active bank accounts IFS codes)',
          'Investment proofs under Section 80C, 80D, 80G, etc.',
          'Home loan interest certificate (if applicable)'
        ]
      },
      {
        title: 'Filing Process Steps',
        type: 'steps',
        content: [
          'Document Upload: Submit Form 16 and AIS records through our fully encrypted dashboard.',
          'Tax Computation: Our Chartered Accountant analyses your TDS, tax brackets, and optimizes exemptions.',
          'Draft Review: We share optimized tax computation for approval to ensure complete clarity.',
          'e-Filing: Final submission on the Income Tax Department portal with e-verification help.'
        ]
      },
      {
        title: 'Frequently Asked Questions',
        type: 'faqs',
        content: [
          { title: 'Who needs to file Salaried ITR?', description: 'Any individual earning over ₹2.5 Lakhs (or ₹3/₹7 Lakhs depending on Old vs New tax regime) must file a return.' },
          { title: 'What is Form 16?', description: 'It is a certificate issued by employers showing TDS deducted on your salary and deposited with the Income Tax Department.' },
          { title: 'Can I claim tax deduction of house rent if Form 16 lacks it?', description: 'Yes, our CAs can assist you in calculating and claiming HRA manually during the ITR calculation phase.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Essential ITR',
        price: '499',
        features: [
          'Single Form 16 Filing',
          'Tax refund optimization',
          'HRA & interest calculation',
          'Aadhaar - PAN verification',
          'e-Verification support'
        ]
      },
      {
        name: 'Pro ITR (Multi-Employer)',
        price: '999',
        isPopular: true,
        features: [
          'Multiple Form 16s integrated',
          'Other sources income calculation',
          'Section 80D & capital losses checking',
          'Full CA audit support',
          '1 Year legal helpline'
        ]
      }
    ]
  },
  'business-itr': {
    id: 'business-itr',
    sections: [
      {
        title: 'ITR For Entrepreneurs & Professionals',
        type: 'grid',
        content: [
          { title: 'Presumptive Tax (Section 44AD/44ADA)', description: 'Declare a set profit rate (e.g. 6% or 8% of turnover, or 50% for professionals) without heavy accounts.' },
          { title: 'Regular Business Income', description: 'File computed revenues, ledger details, and claim direct business expense deductions.' },
          { title: 'Audit Compatibility', description: 'Fully scalable structure if turn-over exceeds statutory limit requiring detailed CA audit.' },
          { title: 'Carry Forward Loss', description: 'Cleanly offset current year business losses against future earnings for up to 8 years.' }
        ]
      },
      {
        title: 'Documents Checklist',
        type: 'list',
        content: [
          'Bank Statements for all business accounts',
          'Gross Revenue / Receipt statements',
          'GST return filings index (GSTR-1 & GSTR-3B matching records)',
          'Deduction receipts (Life/health insurance, home loans)',
          'PAN Card of Business entity / Individual Proprietor'
        ]
      }
    ],
    packages: [
      {
        name: 'Presumptive ITR (44AD/ADA)',
        price: '1,999',
        features: [
          'Specialist CA-assisted computation',
          'Form ITR-4 optimization',
          'Exemptions checking under latest regimes',
          'Reconciliation of revenue with GSTR records',
          'Support for freelancers, doctors, and coders'
        ]
      },
      {
        name: 'Standard Business ITR-3',
        price: '3,999',
        isPopular: true,
        features: [
          'Standard Balance Sheet & Profit-Loss setup',
          'Asset depreciation charts configuration',
          'Form ITR-3 advanced e-filing',
          'Previous years carrying losses configuration',
          'Priority CA consultation calls'
        ]
      }
    ]
  },
  'capital-gains-itr': {
    id: 'capital-gains-itr',
    sections: [
      {
        title: 'Advanced Capital Gains Reporting',
        type: 'steps',
        content: [
          'Broker Excel Download: Download custom tax statements from Zerodha, Groww, AngelOne etc.',
          'CA Mapping: Our experts bifurcate transaction history into Short Term (STCG) and Long Term (LTCG).',
          'Exemption Calculation: Leverage Section 54 benefits when reinvesting property sales.',
          'Loss Offsets: Carry forward equity losses for up to 8 years to trim future tax charges.'
        ]
      }
    ],
    packages: [
      {
        name: 'Securities ITR-2',
        price: '1,499',
        features: [
          'Equities, Mutual Funds, and Debt Gains',
          'STCG/LTCG matching with AIS data',
          'Tax exempt limits harvesting',
          'Loss carryover setup',
          '100% digital CA verification'
        ]
      },
      {
        name: 'Asset & Property ITR-2',
        price: '2,999',
        isPopular: true,
        features: [
          'Property, gold, or overseas assets transfers',
          'Indexation benefit calculations',
          'Section 54 reinvestment support',
          'Full drafting review with detailed report',
          'Year-round tax audit protection'
        ]
      }
    ]
  },
  'fno-trader-itr': {
    id: 'fno-trader-itr',
    sections: [
      {
        title: 'Futures & Options Tax Compliance',
        type: 'list',
        content: [
          'Turnover computation as per MCA and Income Tax guideline standards.',
          'Meticulous tracking of direct business expenses (broadband, brokerages, Advisory fees).',
          'Proper filing of F&O profits as Business Income (ITR-3 template syntax).',
          'Loss declaration to ensure seamless offsetting capability.'
        ]
      }
    ],
    packages: [
      {
        name: 'Standard F&O Filing',
        price: '2,999',
        features: [
          'CA allocation for custom F&O ledger setup',
          'Turnover & profit-loss reports drafting',
          'Expense optimization checks',
          'ITR-3 digital filing',
          'Tax planning tips'
        ]
      },
      {
        name: 'Trader Pro Audit',
        price: '4,999',
        isPopular: true,
        features: [
          'Everything in Standard F&O',
          'Comprehensive Tax Audit by a CA (if mandatory)',
          'Form 3CD preparing and loading',
          'Advanced multi-broker ledger reconciliation',
          'Exclusive premium support SLA'
        ]
      }
    ]
  },
  'nri-itr': {
    id: 'nri-itr',
    sections: [
      {
        title: 'Non-Resident Indian Tax Filing Solutions',
        type: 'faqs',
        content: [
          { title: 'Who is considered NRI?', description: 'If your cumulative stay in India during the previous financial year is below 182 days (and satisfies other secondary rules).' },
          { title: 'What is Double Tax Avoidance Agreement (DTAA)?', description: 'It prevents you from paying taxes twice over the same source of revenue across both your country of residence and India.' },
          { title: 'Do NRIs have to declare global earnings in India?', description: 'No, only income generated or accrued within Indian boundaries is taxable in India.' }
        ]
      }
    ],
    packages: [
      {
        name: 'NRI Essential',
        price: '3,999',
        features: [
          'DTAA relief calculation benefits',
          'NRE and NRO savings interest configuration',
          'Sovereign bond exemptions checking',
          'ITR preparation and verified filing',
          'Consultation call'
        ]
      }
    ]
  },
  'accounting-service': {
    id: 'accounting-service',
    sections: [
      {
        title: 'Full-Stack Business Bookkeeping Services',
        type: 'grid',
        content: [
          { title: 'Cloud Ledger sync', description: 'Daily management on Zoho, Tally, or QuickBooks platform frameworks.' },
          { title: 'Bank Reconciliation', description: 'Periodic checks to align banking balances with ledger records strictly.' },
          { title: 'GST Matching', description: 'Monthly input credit analysis to match with GSTR-2B compliance profiles.' },
          { title: 'Balance Sheets', description: 'Drafting of standard balance sheets and quarterly operational P&L summaries.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Basic Ledger',
        price: '3,499',
        features: [
          'Up to 50 transaction entries/month',
          'Monthly bank reconciliation (1 bank account)',
          'Ledger entry on Zoho or Tally cloud systems',
          'Monthly Trial Balance compilation & reports',
          'Standard web & email support channels'
        ]
      },
      {
        name: 'Standard Bookkeeping',
        price: '7,999',
        isPopular: true,
        features: [
          'Up to 200 transaction entries/month',
          'Reconciliation of up to 3 bank accounts',
          'Monthly Profit & Loss & Balance Sheet drafting',
          'GST input credit matching & reconciliation (GSTR-2B)',
          'Salary TDS calculations & filing support',
          'Dedicated accountant email & phone helpline'
        ]
      },
      {
        name: 'Premium Cloud Ledger',
        price: '9,999',
        features: [
          'Unlimited ledger entries checked by a senior CA',
          'Weekly real-time ledger updates on secure portals',
          'Advanced cashflow forecasting indices & dashboarding',
          'Continuous GSTR-2B and GSTR-1 matching audit support',
          'Unlimited corporate tax advisory calls with a CA',
          'Year-end financials preparation & tax filing package'
        ]
      }
    ]
  },
  'payroll-service': {
    id: 'payroll-service',
    sections: [
      {
        title: 'Corporate Payroll Processing & Compliance',
        type: 'list',
        content: [
          'Complete salary calculations (gross, deductions, net salary pay).',
          'Statutory structures mapping (PF, ESIC, Professional Tax, TDS on salary).',
          'Instant monthly verified payslip dispatching to workforce emails.',
          'Monthly payroll registry exports with compliance report packages.'
        ]
      }
    ],
    packages: [
      {
        name: 'Basic Team Payroll',
        price: '5,999',
        features: [
          'Teams up to 15 employees',
          'Monthly gross/net salary calculations',
          'Automatic E-payslip generation & email dispatch',
          'Salary transfer XLS bank template generation',
          'Standard digital chat & email technical support'
        ]
      },
      {
        name: 'Professional Payroll',
        price: '8,299',
        isPopular: true,
        features: [
          'Teams up to 50 employees',
          'PF, ESIC, & Professional Tax monthly return tracking',
          'Salary TDS audit computations and Form 16 support',
          'Custom salary components structure optimization',
          'Employee query resolution center linkage setup',
          'Dedicated payroll compliance manager hotline'
        ]
      },
      {
        name: 'Enterprise Compliance Suite',
        price: '23,999',
        features: [
          'Unlimited team members (custom bracket support)',
          'All statutory filings (PF, ESIC, LWF, PT, TDS)',
          'Native Zoho Payroll, RazorpayX, or Paybooks integration',
          'Comprehensive payroll tax audit & representation advisory',
          '24/7 dedicated lead manager with escalation bypass'
        ]
      }
    ]
  },
  'income-tax-returns-reg': {
    id: 'income-tax-returns-reg',
    sections: [
      {
        title: 'How Income Tax Returns Filing Works',
        type: 'steps',
        content: [
          'Platform Registration: Register securely with your simple contact coordinates.',
          'Secure Document Drop: Upload bank statements, Form 16, or previous returns.',
          'Expert Review: Our seasoned accounting managers construct trial records matching AIS files.',
          'Portal Filing: Upload is completed securely to official state portal servers with DSC.'
        ]
      }
    ],
    packages: [
      {
        name: 'Quick Filing Standard',
        price: '999',
        features: [
          'Taxpayer profile initialization',
          'Form 16 / bank calculations review',
          'Deductions claiming maximizing',
          'Verified return filing',
          '24/7 client helpline'
        ]
      }
    ]
  },
  'add-director': {
    id: 'add-director',
    sections: [
      {
        title: 'Key Reasons to Appoint an Additional Director',
        type: 'grid',
        content: [
          { title: 'Corporate Growth', description: 'Introduce seasoned leadership to steer the company into new markets.' },
          { title: 'Operational Speed', description: 'Enable board actions when the existing director is overseas or unavailable.' },
          { title: 'Statutory Compliance', description: 'Quickly fulfill the legal requirement of minimum directors (2 for Pvt Ltd, 3 for Pub Ltd).' },
          { title: 'Expert Oversight', description: 'Bring on specialists in finance, operations, technology or regulatory sectors.' }
        ]
      },
      {
        title: 'Documents Required to Add a Director',
        type: 'list',
        content: [
          'PAN Card and Aadhaar Card of the proposed director',
          'Biographic credentials proof (Voter ID, driving license, or passport)',
          'Latest utility bill or bank statement (not older than 2 months) showing the address',
          'Passport-sized photograph of the proposed director',
          'Signed Consent Letter (Form DIR-2) and qualification declaration (DIR-8)',
          'Board Resolution approving the appointment'
        ]
      },
      {
        title: 'Process to Appoint/Add a Director',
        type: 'steps',
        content: [
          { title: 'Apply for DSC', description: 'Obtain digital signatures (DSC) for the proposed director if they do not have one.' },
          { title: 'DIN Allocation', description: 'Filing of Form DIR-3 to request Director Identification Number (DIN).' },
          { title: 'Board Approval', description: 'Pass a standard Board Resolution to formalize the candidate nomination.' },
          { title: 'Form File (DIR-12)', description: 'Draft and upload DIR-12 compliance documents on MCA portal within 30 days.' }
        ]
      }
    ],
    packages: [
      {
        name: 'DPIN / DIN Allocation',
        price: '2,299',
        features: [
          'Digital Signature (DSC) support',
          'Form DIR-3 application prep',
          'PAN/Aadhaar integration check',
          'DPIN / DIN confirmation delivery',
          'Filing tracker credentials'
        ]
      },
      {
        name: 'Board Resolution / ROC Filing',
        price: '4,299',
        isPopular: true,
        features: [
          'Drafting Board Resolutions',
          'Form DIR-2 + Form DIR-8 checks',
          'Filing Form DIR-12 with ROC',
          'Govt portal fee reconciliation service',
          'Corporate filings archive update'
        ]
      },
      {
        name: 'Full Process Support (DIN + Filing)',
        price: '5,299',
        features: [
          'Everything in DPIN Allocation & ROC Filing',
          'Expedited end-to-end processing support',
          'Unlimited advisory on corporate amendments',
          'Dedicated Chartered Accountant advisory support'
        ]
      }
    ]
  },
  'removal-resignation-director': {
    id: 'removal-resignation-director',
    sections: [
      {
        title: 'Significance of Filing Director Resignation',
        type: 'grid',
        content: [
          { title: 'Official Removal of Liability', description: 'Isolates the departing director from future corporate actions/debts.' },
          { title: 'MCA Records Cleanliness', description: 'Ensure the public master data at ROC accurately represents active board members.' },
          { title: 'Avoid Default Blockade', description: 'Prevents standard company filings from being stalled due to inactive director profiles.' },
          { title: 'Legal Transparency', description: 'Maintains stakeholder confidence through proper documentation of board changes.' }
        ]
      },
      {
        title: 'Documents Required for Director Resignation',
        type: 'list',
        content: [
          'Resignation Letter stating the reasons and effective date',
          'Board Resolution accepting the resignation',
          'Proof of dispatch-receipt of resignation letter to the company',
          'Form DIR-11 filed by the resigning director (optional but recommended)',
          'Form DIR-12 filed by the company with the ROC (mandatory)'
        ]
      },
      {
        title: 'Resignation Process Flow',
        type: 'steps',
        content: [
          { title: 'Submit Resignation', description: 'The resigning director serves a formal resignation letter in writing.' },
          { title: 'Board Resolution', description: 'Company holds a board meeting and passes a resolution accepting the resignation.' },
          { title: 'Filing DIR-11', description: 'The director files DIR-11 along with professional verification (optional).' },
          { title: 'Filing DIR-12', description: 'Company submits Form DIR-12 with ROC confirming changes within 30 days.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Standard Resignation File',
        price: '2,299',
        features: [
          'Drafting Board Resolution',
          'Form DIR-11 preparation assist',
          'Department submission portal tracking',
          'Standard advisory and expert check'
        ]
      },
      {
        name: 'Removal / Multiple Filings',
        price: '3,799',
        isPopular: true,
        features: [
          'Form DIR-12 comprehensive ROC filing',
          'Official resignations deeds drafting support',
          'Resolving complex or disputed board exits',
          'Dedicated partner CA verification'
        ]
      }
    ]
  },
  'add-remove-partner-llp': {
    id: 'add-remove-partner-llp',
    sections: [
      {
        title: 'Designated Partners Change in LLP',
        type: 'grid',
        content: [
          { title: 'Liability Safety', description: 'Appropriately transition commercial responsibilities among partners.' },
          { title: 'Statutory Compliance', description: 'Keep the minimum mandatory 2 designated partners condition active.' },
          { title: 'Flexible Capitalization', description: 'Seamlessly shift equity contributions when welcoming new funding partners.' },
          { title: 'Commercial Operations', description: 'Update bank and govt authorities on signatories quickly.' }
        ]
      },
      {
        title: 'LLP Partner Checklist',
        type: 'list',
        content: [
          'PAN Card and Aadhar Card of the proposed partner',
          'Address proof of the proposed partner (bank statement/utility bill)',
          'Consent letter from the incoming partner and resignation letter from outgoing partner',
          'Board resolution/partner meeting minutes giving consent',
          'Supplementary LLP Agreement draft (Form 3)',
          'Form 4 for change in designated partners'
        ]
      }
    ],
    packages: [
      {
        name: 'DPIN Allocation',
        price: '1,299',
        features: [
          'DSC application support',
          'Form DPIN application preparation',
          'Identity verification alignment',
          'Designated Partner credentials delivered'
        ]
      },
      {
        name: 'Form 4 Filing Only',
        price: '2,299',
        features: [
          'Drafting partner resolutions',
          'Form 4 filing on MCA portal',
          'Resignation coordinates support',
          'Filing and fee tracking details'
        ]
      },
      {
        name: 'Complete Partner Change',
        price: '4,299',
        isPopular: true,
        features: [
          'Everything in DPIN Allocation & Form 4 Filing',
          'Filing Supplementary LLP Deed with ROC (Form 3)',
          'Drafting custom clauses and partner ratios agreements',
          'Dedicated CA counsel support'
        ]
      }
    ]
  },
  'change-llp-agreement': {
    id: 'change-llp-agreement',
    sections: [
      {
        title: 'Why Amend Your LLP Agreement?',
        type: 'grid',
        content: [
          { title: 'Profit Ratio Update', description: 'Change commercial splits as business contributions fluctuate.' },
          { title: 'Addition of Capital', description: 'Reflect fresh partner capital additions legally on MCA database.' },
          { title: 'Change in Object', description: 'Pivot your business direction into new sectors or software models.' },
          { title: 'Revised Management', description: 'Rebalance voting thresholds and operation powers among partners.' }
        ]
      },
      {
        title: 'LLP Agreement Amendment Flow',
        type: 'list',
        content: [
          'Detailed draft of Supplementary/Amended LLP Deed',
          'Consent signatures of all existing partner members',
          'Paying appropriate Stamp Duty based on state rules',
          'Filing ROC Form 3 within 30 days of executing the deed'
        ]
      }
    ],
    packages: [
      {
        name: 'Supplementary Deed Filing',
        price: '2,299',
        features: [
          'Drafting of supplementary clauses',
          'Stamp duty assistance guidance',
          'Form 3 filing on MCA site',
          'Unlimited expert check',
          'Approved deed copy delivery'
        ]
      }
    ]
  },
  'change-registered-office-address': {
    id: 'change-registered-office-address',
    sections: [
      {
        title: 'Office Address Move Safeguards',
        type: 'grid',
        content: [
          { title: 'Avoid Heavy Fines', description: 'Prevent punitive daily fines under section 12 of the Companies Act.' },
          { title: 'Clean Communications', description: 'Secure direct official mail delivery routes from tax and MCA channels.' },
          { title: 'Build Client Trust', description: 'A corrected corporate map footprint showcases modern, active status.' },
          { title: 'Bank Records Update', description: 'Align branch billing details with the official ROC database directly.' }
        ]
      },
      {
        title: 'Address Change Documentation',
        type: 'list',
        content: [
          'Registered Office Address Proof: Electricity Bill / Gas Bill of the premises',
          'No Objection Certificate (NOC) signed by the premise property owner',
          'Rent Agreement or Lease Deed of the property (if leased)',
          'Copy of Board Resolution authorizing office relocation',
          'For state-to-state: Special Resolution and Regional Director (RD) approval'
        ]
      }
    ],
    packages: [
      {
        name: 'Within Same ROC City/State',
        price: '4,299',
        features: [
          'Form INC-22 preparation',
          'NOC and landlord check template',
          'ROC file submission',
          'Address proof verification',
          'Approved status dashboard tracking'
        ]
      },
      {
        name: 'Within State, Different ROC',
        price: '5,299',
        features: [
          'Form INC-23 & INC-28 drafting support',
          'Board & Special resolutions preparation help',
          'Filing with the state ROC offices',
          'Liaison and tracking status'
        ]
      },
      {
        name: 'Different State Change',
        price: '19,299',
        isPopular: true,
        features: [
          'Full-scale National Regional Director petition preparation',
          'Advertisements drafting in regional and national papers',
          'Comprehensive state transfer support (INC-23, INC-28, INC-22, MGT-14)',
          'Dedicated senior advocate representing your case'
        ]
      }
    ]
  },
  'increase-authorized-capital': {
    id: 'increase-authorized-capital',
    sections: [
      {
        title: 'When to Increase Authorized Capital?',
        type: 'grid',
        content: [
          { title: 'Fresh Funding Rounds', description: 'Increase the nominal capital ceilings to allocate equity shares to investors.' },
          { title: 'Fresh Partner Allocation', description: 'Grant shares to co-founders, advisors, or employees via ESOPs easily.' },
          { title: 'Expanding Borrowing Lines', description: 'Firms can raise secure debentures and lines corresponding to capital scale.' },
          { title: 'Legal Compliance', description: 'Keep paid-up base aligned to statutory limits as required by specific licenses.' }
        ]
      },
      {
        title: 'Authorized Capital Checklist',
        type: 'list',
        content: [
          'Proposed allocation scale details',
          'Latest Memorandum of Association (MoA) copy',
          'Board Resolution and Extraordinary General Meeting (EGM) notice drafts',
          'Filing and stamp fee determination corresponding to regional limits',
          'Form SH-7 to be uploaded on MCA portal within 30 calendar days'
        ]
      }
    ],
    packages: [
      {
        name: 'Up to 5L Authorized Share Capital',
        price: '3,499',
        features: [
          'Drafting Board & Shareholder Resolutions',
          'Amending MOA Capital Clause',
          'Filing ROC Form SH-7',
          'Government Stamp Duty calculation help',
          'Status receipt delivery'
        ]
      },
      {
        name: '5L to 10L Share Capital',
        price: '4,499',
        isPopular: true,
        features: [
          'Everything in 5L Package',
          'Drafting Articles (AOA) alterations if needed',
          'Advanced EGM advisory assist',
          'Stamp duty reconciliations with state ROC'
        ]
      },
      {
        name: 'Above 10L Share Capital',
        price: '5,499',
        features: [
          'Comprehensive infinite size limits support',
          'MGT-14 preparation & file submission inclusion',
          'State stamp treasury coordination support',
          'Priority CA relationship manager'
        ]
      }
    ]
  },
  'change-din': {
    id: 'change-din',
    sections: [
      {
        title: 'DIN Credentials Updates',
        type: 'grid',
        content: [
          { title: 'Keep Records Current', description: 'Statutorily update your name, address, or email coordinates on file.' },
          { title: 'Avoid Penalties', description: 'Inaccurate details can result in heavy director disqualification hazards.' },
          { title: 'Smooth Sign-offs', description: 'Keep digital signature profiles perfectly aligned with MCA databases.' },
          { title: 'Verification Security', description: 'Maintain transparent audit trails with verified, current details.' }
        ]
      },
      {
        title: 'Required Documents for DIN Update',
        type: 'list',
        content: [
          'PAN Card / Aadhaar Card of the director with updated info',
          'Address proof: Utility bill/bank statement displaying correct details',
          'Professional certification by a CS/CA/CWA',
          'MCA Form DIR-6 upload'
        ]
      }
    ],
    packages: [
      {
        name: 'Single DIN Update',
        price: '1,499',
        features: [
          'Form DIR-6 drafting',
          'Document verification audit',
          'Professional CS signature registration',
          'Tracking status and update'
        ]
      },
      {
        name: 'Multiple DINs Updates',
        price: '2,999',
        isPopular: true,
        features: [
          'Re-aligning up to 3 individual directors DIN profiles',
          'Correcting complex structural discrepancies',
          'KYC history audit',
          'Priority status processing update'
        ]
      }
    ]
  },
  'surrender-your-din': {
    id: 'surrender-your-din',
    sections: [
      {
        title: 'Why Terminate/Surrender Redundant DINs?',
        type: 'grid',
        content: [
          { title: 'Clear Legal Penalties', description: 'Holding more than one active Director Identification Number is a serious offence.' },
          { title: 'Limit Compliance Burden', description: 'Saves directories from recurring penalty warnings or notices.' },
          { title: 'Consolidated Profiles', description: 'Fusing multiple records into one transparent MCA account profile.' },
          { title: 'Exit Board Duty Safely', description: 'Formally surrender credentials if you are no longer entering corporate fields.' }
        ]
      },
      {
        title: 'DIN Surrender Flow',
        type: 'list',
        content: [
          'Drafting and filing Form DIR-5 to the registrar',
          'Affidavit stating that the DIN was never utilized or has zero defaults',
          'Declaration on active companies linkage',
          'CA verification stamps'
        ]
      }
    ],
    packages: [
      {
        name: 'DIN Deactivation Filing (DIR-5)',
        price: '2,999',
        features: [
          'Form DIR-5 drafting and filing',
          'Indemnity and Affidavit templates',
          'Professional CS/CA certification sign-off',
          'Official deactivation report delivery'
        ]
      }
    ]
  },
  'appointment-of-auditors': {
    id: 'appointment-of-auditors',
    sections: [
      {
        title: 'Statutory Auditor Selection Mechanics',
        type: 'grid',
        content: [
          { title: 'Avoid MCA default status', description: 'ADT-1 must be filed within 15 days of AGM to evade deep late penalties.' },
          { title: 'Fulfill Companies Act Duty', description: 'Section 139 mandates appointing first auditor within 30 days of registration.' },
          { title: 'Unbiased Financial Review', description: 'Align with seasoned audits to secure balance sheet approvals.' },
          { title: 'Credit & Bank standing', description: 'Fuss-free formal statutory audits are requested during corporate loan approvals.' }
        ]
      },
      {
        title: 'Auditor Appointment Required Checklist',
        type: 'list',
        content: [
          'Adoption of formal board consent resolution copy',
          'Auditor consent letter and eligibility confirmation statement',
          'Form ADT-1 draft with accurate details',
          'CS/CA login verification coordinates to trigger MCA portals'
        ]
      }
    ],
    packages: [
      {
        name: 'Statutory ADT-1 Filing',
        price: '2,999',
        features: [
          'Resolution drafting assistance',
          'Auditor eligibility checklist evaluation',
          'Form ADT-1 compilation & file submission',
          'Fee reconciliation update',
          'Status tracking and final receipts'
        ]
      }
    ]
  },
  'share-transfer-transmission': {
    id: 'share-transfer-transmission',
    sections: [
      {
        title: 'Managing Ownership Shifts Professionally',
        type: 'grid',
        content: [
          { title: 'Transfer Deeds Clarity', description: 'Standardize custom clauses with zero compliance loopholes.' },
          { title: 'Stamp Duty Adherence', description: 'Facilitate correct state specific tax paychecks on transfer documents.' },
          { title: 'Transparent Register Sync', description: 'Update current cap-table shares structures on corporate database records.' },
          { title: 'Avoid Claims/Disputes', description: 'Ensure neat heir transitions or legal share transfers.' }
        ]
      },
      {
        title: 'Share Move Checklist',
        type: 'list',
        content: [
          'Share Certificates copies on file',
          'Signed Share Transfer Deed in Form SH-4',
          'Stamp duty verification details',
          'Board resolution executing and approving changes with registry'
        ]
      }
    ],
    packages: [
      {
        name: 'Drafting Share Transfer Deeds',
        price: '3,999',
        features: [
          'Form SH-4 drafting templates and alignment',
          'Shareholder certificate review',
          'Resolutions prep support',
          'Tax/stamps checklist guidelines'
        ]
      },
      {
        name: 'Full Transfer Filings and Stampings',
        price: '5,999',
        isPopular: true,
        features: [
          'Everything in Drafting Package',
          'Full stamp duty coordination with sub-registrars',
          'Comprehensive cap table update and registry record creation',
          'Board approval MGT filing verification'
        ]
      },
      {
        name: 'Premium Joint Transfer & Transmission',
        price: '8,999',
        features: [
          'Handling complex inheritance transitions & multi-party transfers',
          'Succession certificate and probate evaluation',
          'Dispute consultation with senior attorneys',
          'Dedicated CA assignment'
        ]
      }
    ]
  },
  'company-name-change': {
    id: 'company-name-change',
    sections: [
      {
        title: 'Corporate Legal Identity Shifts',
        type: 'grid',
        content: [
          { title: 'Complete Brand Alignment', description: 'Alter constitutional terms to correspond with modern marketing visions.' },
          { title: 'Object Extensions', description: 'Add new scopes easily without brand identity friction.' },
          { title: 'Clear Trademark Conflicts', description: 'Mitigate active legal disputes through corporate identity updates.' },
          { title: 'Public Credibility', description: 'Keep stakeholders aligned on your corporate identity changes.' }
        ]
      },
      {
        title: 'Company Rebranding Documents Required',
        type: 'list',
        content: [
          'Proposed name choices list (up to 2)',
          'Approved board and shareholder resolutions (MGT-14)',
          'Amended copy of MOA and AOA',
          'Form INC-24 (Application for approval of name change)',
          'Trademark consent / NOC if matching active brands'
        ]
      }
    ],
    packages: [
      {
        name: 'RUN Name Approval',
        price: '13,299',
        features: [
          'Trademark search checks',
          'Filing Form RUN for name reservation',
          'Board resolutions draft templates',
          'Government file check tracking'
        ]
      },
      {
        name: 'Complete Name Change Filing',
        price: '24,999',
        isPopular: true,
        features: [
          'Everything in RUN Name Approval Package',
          'Drafting amended MOA and AOA',
          'Filing Form MGT-14 with ROC within 30 days',
          'Filing Form INC-24 for final certificate',
          'Assistance with PAN, TAN and GST identity alignment'
        ]
      }
    ]
  },
  'llp-name-change': {
    id: 'llp-name-change',
    sections: [
      {
        title: 'LLP Rebranding Operations',
        type: 'grid',
        content: [
          { title: 'Incredible Rebranding Ease', description: 'Give your Limited Liability Partnership a new identity.' },
          { title: 'Commercial Alignment', description: 'Align partnership titles to software products or domains easily.' },
          { title: 'Protect Trademark Space', description: 'Stay clear of copyright infringements through unique name reservations.' },
          { title: 'Continuous Status Updates', description: 'Ensure MCA and ROC public tables display correct details.' }
        ]
      },
      {
        title: 'LLP Rebranding Documents Check',
        type: 'list',
        content: [
          'LLP agreement amended copy displays',
          'Partner resolutions authorizing change',
          'Form RUN-LLP (Reservation of Name)',
          'Form 15 (Notice of Change of Name filed with ROC)',
          'Supplementary LLP Agreement registered in Form 3'
        ]
      }
    ],
    packages: [
      {
        name: 'LLP-RUN Name Reservation',
        price: '4,299',
        features: [
          'NOC / Trademark search checks',
          'Filing LLP-RUN reservation',
          'Partner consent drafting templates',
          'Standard advisory track'
        ]
      },
      {
        name: 'Full Rebranding & Deed Filing',
        price: '8,299',
        isPopular: true,
        features: [
          'Everything in Name Reservation Package',
          'Filing Form 15 on MCA platform',
          'Drafting & filing Supplementary LLP Agreement (Form 3)',
          'Approved Certificate of Name Change delivery',
          'Bank update support coordinate'
        ]
      }
    ]
  },
  'moa-aoa-amendment': {
    id: 'moa-aoa-amendment',
    sections: [
      {
        title: 'Amending Charter Articles',
        type: 'grid',
        content: [
          { title: 'Change Business Objects', description: 'Add or modify the main business purpose clause legally.' },
          { title: 'Situation Clause Relocation', description: 'Shift corporate registration coordinates to a different state boundary.' },
          { title: 'Amend Capital Allocations', description: 'Add, split, or consolidate equity classes easily.' },
          { title: 'Operational Rules Update', description: 'Alter the operational and management rules in the Articles of Association.' }
        ]
      },
      {
        title: 'Amendment Compliance Flow',
        type: 'steps',
        content: [
          { title: 'Board Consent', description: 'Pass directory resolution to schedule an Extraordinary General Meeting (EGM).' },
          { title: 'Shareholders Approval', description: 'Hold EGM and pass a Special Resolution by 3/4th majority.' },
          { title: 'Filing MGT-14', description: 'File Special Resolution with the ROC within 30 days of the meeting.' },
          { title: 'ROC Approval', description: 'ROC verifies the amendments and registers the new charter.' }
        ]
      }
    ],
    packages: [
      {
        name: 'Charter Amendment Checklist',
        price: '5,999',
        features: [
          'Drafting Board and General Meeting notices',
          'Drafting Special Resolutions',
          'Detailed regulatory eligibility audit',
          'Standard Support'
        ]
      },
      {
        name: 'Complete MCA Filing',
        price: '10,999',
        isPopular: true,
        features: [
          'Everything in Checklist Package',
          'Form MGT-14 preparation & file submission',
          'Drafting altered MOA/AOA drafts',
          'Liaison with ROC departments',
          'Dedicated compliance CA manager'
        ]
      }
    ]
  },
  'moa-aoa-printing': {
    id: 'moa-aoa-printing',
    sections: [
      {
        title: 'MCA Certified Constitutional Document Printing',
        type: 'list',
        content: [
          'Complete formatting and layout design of the Memorandum of Association.',
          'Articles of Association drafted professionally conforming to Schedule I structures.',
          'High-density paper printing with certified ribbon binding layout formatting.',
          'Secure shipping to your registered corporate address.'
        ]
      }
    ],
    packages: [
      {
        name: 'Standard Print (2 Copies)',
        price: '2,999',
        features: [
          '2 professionally formatted copies of MOA and AOA',
          'Basic ribbon binding design formatting',
          'Postal delivery included',
          'Standard Turnaround'
        ]
      },
      {
        name: 'De Luxe Bound MCA Set (5 Copies)',
        price: '4,999',
        isPopular: true,
        features: [
          '5 premium copies of MOA and AOA',
          'Durable high-gloss structural bindings',
          'Includes digital pdf master file copy',
          'Dedicated executive processing'
        ]
      },
      {
        name: 'Premium certified Bound Set (10 Copies)',
        price: '7,999',
        features: [
          '10 deluxe copies of altered MOA and AOA',
          'Hardbound cover structures with golden letter stampings',
          'Company common seal and statutory registries templates folder pack',
          'Expedited courier shipping'
        ]
      }
    ]
  },
  'strike-off-company': {
    id: 'strike-off-company',
    sections: [
      {
        title: 'Benefits of Striking Off a Inactive Company',
        type: 'grid',
        content: [
          { title: 'End Recurring Audits', description: 'Stops annual audit fees and mandatory compliance costs.' },
          { title: 'Eliminate Late Penalties', description: 'Avoids heavy penalties for non-filing of ROC returns.' },
          { title: 'Free Up Directors', description: 'Releases directors from compliance obligations, preventing disqualification.' },
          { title: 'No Legal Defaulter Mark', description: 'Maintains clean credit records for future business ventures.' }
        ]
      },
      {
        title: 'Company Closure Requirements',
        type: 'list',
        content: [
          'Company must have ceased business operations for at least 2 years',
          'All assets and liabilities must be fully extinguished',
          'Statement of Accounts showing nil assets and liabilities certified by a Chartered Accountant',
          'Indemnity Bond (STK-3) and Affidavit (STK-4) signed by all active directors',
          'Special Resolution passed by 75% shareholders'
        ]
      }
    ],
    packages: [
      {
        name: 'Closure Statement Preparation',
        price: '15,999',
        features: [
          'Drafting Board Resolutions and EGM notice',
          'Nil Assets & Liabilities statement audit help',
          'Indemnity Bond and Affidavit templates',
          'Regulatory eligibility check'
        ]
      },
      {
        name: 'Board Resolution & STK-2 Filing',
        price: '18,999',
        features: [
          'Everything in Statement Prep Package',
          'Preparing Form STK-2 (Application for Strike Off)',
          'Chartered Accountant verification sign-off',
          'Submission upload to MCA portal'
        ]
      },
      {
        name: 'Full Company Closure Support',
        price: '24,999',
        isPopular: true,
        features: [
          'Everything in STK-2 Filing Package',
          'No-Objection tracking from Income Tax dept',
          'Public notice monitoring in English and vernac newspapers',
          'Dedicated senior advocate representing your case',
          'Approved Struck-off status notification delivery'
        ]
      }
    ]
  },
  'strike-off-llp': {
    id: 'strike-off-llp',
    sections: [
      {
        title: 'How to Legally Close an LLP',
        type: 'grid',
        content: [
          { title: 'No Compliance Duty', description: 'Stop filing annual Return Form 11 and Statement of Account Form 8.' },
          { title: 'Protection for Partners', description: 'Shield partner assets from future operational defaults.' },
          { title: 'Clean Registry Check', description: 'Maintains status profile cleanliness on MCA datasets.' },
          { title: 'Minimize Operational Overhead', description: 'Stop paying statutory accounting fees for non-operating business.' }
        ]
      },
      {
        title: 'LLP Closure Documents list',
        type: 'list',
        content: [
          'LLP must have ceased business operations for at least 1 year',
          'Consent of all partners to strike-off the LLP',
          'Statement of Accounts showing nil operations certified by a CA (not older than 30 days)',
          'Affidavit and Indemnity Bond signed by all designated partners',
          'Copy of bank statement showing account closure details'
        ]
      }
    ],
    packages: [
      {
        name: 'Voluntary Deed Prep',
        price: '9,999',
        features: [
          'Drafting partner resolutions & EGM minutes',
          'LLP closure statement templates',
          'No-Asset declaration audit assist',
          'Advisory consultations'
        ]
      },
      {
        name: 'Affidavits & Indemnity drafting',
        price: '10,999',
        features: [
          'Deed compilation',
          'State stamp checks helper',
          'CA certificate verification seals',
          'Standard Support'
        ]
      },
      {
        name: 'Full LLP Closure & Form 24',
        price: '22,599',
        isPopular: true,
        features: [
          'Everything in Deed Prep & Affidavits Package',
          'Filing MCA Form 24 for strike off',
          'Bank integration closure records tracking',
          'Assistance with all departmental notice queries',
          'ROC closing letter delivery'
        ]
      }
    ]
  },
  'dissolution-of-firms': {
    id: 'dissolution-of-firms',
    sections: [
      {
        title: 'Settle and Settle Partnership Firms Legally',
        type: 'grid',
        content: [
          { title: 'Settle Capital Claims', description: 'Formally split asset values and partnership accounts cleanly.' },
          { title: 'Prevent Personal Liability', description: 'Public notice shields partners from subsequent commercial actions.' },
          { title: 'Clear Business Name', description: 'Legally release the brand title for replacement ventures.' },
          { title: 'Official Dept Closure', description: 'Avoid tax demands through proper registry de-registration.' }
        ]
      },
      {
        title: 'Partnership Dissolution Checklist',
        type: 'list',
        content: [
          'Partnership dissolution agreement signed by all members',
          'Statutory public notice draft',
          'No Assets / Debt statement verification sheets',
          'Filing Form V (Form of Dissolution) with the Registrar of Firms'
        ]
      }
    ],
    packages: [
      {
        name: 'Dissolution Agreement drafting',
        price: '1,999',
        features: [
          'Drafting custom dissolution deed',
          'Partner ratios and split audits support',
          'Tax/compliance checklist guidelines',
          'Standard Support'
        ]
      },
      {
        name: 'Partner Settlements & Form V',
        price: '2,999',
        features: [
          'Everything in Agreement drafting Package',
          'Filing Form V with Registrar of Firms',
          'Govt portal fee processing assist',
          'Status tracking maps'
        ]
      },
      {
        name: 'Full Legal Closure',
        price: '7,999',
        isPopular: true,
        features: [
          'Everything in Settlements & Form V Package',
          'Arranging statutory public advertisements in vernac & main papers',
          'Complete closure of accounts support',
          'Priority CA relationship expert'
        ]
      }
    ]
  },
  'strike-off-opc': {
    id: 'strike-off-opc',
    sections: [
      {
        title: 'One Person Company Voluntary Closure Guidelines',
        type: 'grid',
        content: [
          { title: 'Compliance Elimination', description: 'Stop continuous statutory accounts audits and filings.' },
          { title: 'Clear Single Promoter Liability', description: 'Complete security for promoter family assets from business actions.' },
          { title: 'Incredible speed', description: 'We track and expedite your closure application.' },
          { title: 'Affordable Rates', description: 'Most cost-effective MCA compliant voluntary shutdown services.' }
        ]
      },
      {
        title: 'OPC Closure Checklist',
        type: 'list',
        content: [
          'OPC must have ceased operations for at least 2 years or never commenced',
          'Promotor & Nominee consent letters to strike-off the company',
          'Statement of Account displaying nil balances certified by a CA',
          'Indemnity Bond and Affidavits executed by the promoter',
          'Form STK-2 filing to the registrar'
        ]
      }
    ],
    packages: [
      {
        name: 'Closure Statement Prep',
        price: '15,999',
        features: [
          'Drafting EGM consent notice',
          'Nil Assets and Liabs workbook help',
          'Indemnity Bond templates',
          'Advisory checks'
        ]
      },
      {
        name: 'Resolution & Form STK-2',
        price: '16,999',
        features: [
          'Form STK-2 draft compiler',
          'MCA portal file submission assist',
          'CA verification registration seal',
          'Standard Support'
        ]
      },
      {
        name: 'Full Complete OPC Closure Support',
        price: '20,999',
        isPopular: true,
        features: [
          'Everything in STK-2 Package',
          'No Objection verification with tax dept',
          'Official Gazette and newspaper notices monitoring',
          'Active status notifications update',
          'Approved struck-off certificate delivery'
        ]
      }
    ]
  }
};

