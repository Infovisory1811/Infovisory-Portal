export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  quote: string;
  intro: string;
  sections: {
    heading?: string;
    paragraphs: string[];
  }[];
  stepsTitle?: string;
  steps?: string[];
  conclusion: string;
  createdAt?: string;
}

export const POOL_OF_BLOG_POSTS: BlogPost[] = [
  {
    slug: 'llp-compliance-2025',
    title: 'Annual Compliance Calendar of LLP 2025-26',
    excerpt: 'Stay ahead of your statutory requirements with our comprehensive LLP compliance calendar for the upcoming financial year. Avoid heavy late filing penalties.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    date: 'May 28, 2026',
    author: 'Adv. Sharma',
    category: 'LLP Compliance',
    readTime: '6 min read',
    quote: 'Compliance is not an overhead expense; it is the ultimate shield that protects your business from statutory friction and financial strain.',
    intro: 'As the new financial year 2025-26 gets fully underway, Limited Liability Partnerships (LLPs) registered in India must align with the Ministry of Corporate Affairs (MCA) to file mandatory statutory returns. Unlike traditional companies, the penalty for delayed filings in LLPs can be steep, compounding daily.',
    sections: [
      {
        heading: 'Why Timely LLP Filings are Non-Negotiable',
        paragraphs: [
          'Under the LLP Act, there is an absolute obligation to maintain books of accounts and file statutory records annually. Any lapse in submitting mandatory forms attracts an additional fee. While the structure offers immense operational flexibility, the MCA takes delays seriously to prevent the registration of shell enterprises.',
          'The two core pillars of annual compliance for any LLP are Form 11 (Annual Return) and Form 8 (Statement of Accounts & Solvency). These must be carefully prepared and digitally signed by designated partners and verified by a practicing professional (CA, CS, or CMA) depending on the turnover threshold.'
        ]
      },
      {
        heading: 'Form 11 vs Form 8: Understanding the Difference',
        paragraphs: [
          'Form 11 is essentially the Annual Return of the LLP. It contains details of all partners, their contributions, and any changes in the management structure during the financial year. It must be filed within 60 days of the closure of the financial year (typically by 30th May).',
          'Form 8 is the Statement of Account and Solvency. This is a declaration of the financial health of your partnership, confirming whether it has sufficient liquid assets to pay off its outstanding debts. This form must be filed within 30 days from the end of six months of the close of the financial year (typically by 30th October).'
        ]
      }
    ],
    stepsTitle: 'Critical Statutory Deadlines for LLPs (FY 2025-26)',
    steps: [
      'Form 11 (Annual Return) – Mandatory filing on the MCA portal by 30th May 2026.',
      'Form 8 (Statement of Accounts) – Operational solvency declaration due by 30th October 2026.',
      'ITR-5 (Income Tax Return) – Annual tax return filing due by 31st July 2026 (or 31st October if audit required).',
      'DIR-3 KYC – Verification of Designated Partner Identification Numbers (DPIN) due by 30th September 2026.'
    ],
    conclusion: 'At Infovisory, we handle end-to-end accounting, tax calculations, and digital signature uploads to make sure your LLP stays perfectly clean in the eyes of the law. Contact our compliance experts today to schedule your consultation.'
  },
  {
    slug: 'role-of-iec',
    title: 'Role of IEC in International Trade: Future Trends',
    excerpt: 'Explore how the Import Export Code is evolving in the era of digital trade and global supply chain shifts, and what regulations you need to know.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    date: 'May 25, 2026',
    author: 'Legal Research Team',
    category: 'Import Export',
    readTime: '5 min read',
    quote: 'An Import Export Code is not merely a custom registration key—it is your ticket to scaling your Indian product into a global household name.',
    intro: 'The landscape of global trade is shifting rapidly with cross-border e-commerce, trade alliances, and digital clearances. In India, the absolute first step for any business intending to engage in import or export activities is securing an Import Export Code (IEC) issued by the Directorate General of Foreign Trade (DGFT).',
    sections: [
      {
        heading: 'What is the Import Export Code (IEC)?',
        paragraphs: [
          'The IEC is a unique 10-digit code that is mandatory for importing or exporting goods and services from Indian territories. Without this code, customs authorities will not clear shipment parcels at ports, and banks will block outward or inward international business transactions.',
          'Historically, getting an IEC required submitting physically signed application sheaves at regional DGFT portals. Today, under the Digital India campaign, the entire system has been moved online. The IEC is now mapped directly to the business’s Permanent Account Number (PAN), streamlining corporate compliance.'
        ]
      },
      {
        heading: 'Strategic Advantages of Registering an IEC',
        paragraphs: [
          'Possessing a valid IEC opens up the entire global marketplace for your local goods. Additionally, the Indian government offers several export promotion schemes, such as Duty Drawback, MEIS/SEIS incentives, and GST refunds on export of services, which can only be availed of with an active IEC.',
          'Importantly, once obtained, the IEC is valid for the lifetime of the business entity, meaning there are no recurrent annual renewal fees. However, the DGFT has recently mandated that every IEC holder must update their details annually on the portal between April and June.'
        ]
      }
    ],
    stepsTitle: 'Your Checklist for Securing an IEC Online',
    steps: [
      'Formulate your legal structure (Proprietorship, LLP, or Private Limited).',
      'Obtain an active corporate PAN card and digital signatures (DSC) for partners/directors.',
      'Open a dedicated current account with a registered commercial bank.',
      'Submit the online ANF-2A form on the official DGFT portal with bank certificate details.'
    ],
    conclusion: 'Infovisory bridges the gap between local enterprise and global expansion. Our foreign trade consultants expedite DGFT verification and ensure your import-export registrations are completed hassle-free.'
  },
  {
    slug: 'llc-vs-inc',
    title: 'LLC vs INC: Difference between LLC and INC',
    excerpt: 'A detailed comparison between Limited Liability Companies and Incorporations to help global founders choose the right entity structure.',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800',
    date: 'May 23, 2026',
    author: 'Infovisory Expert',
    category: 'Global Incorporation',
    readTime: '7 min read',
    quote: 'Choosing between an LLC and a C-Corp is a fundamental decision that dictates your taxation pathway, equity dynamics, and fundraising ceiling.',
    intro: 'For founders in India looking to build a global business, setting up an entity in the United States is an increasingly popular path. It provides friction-free access to global customers, payment gateways like Stripe, and Silicon Valley venture capital. However, many struggle on day one: should you register a US LLC or a Delaware C-Corporation (INC)?',
    sections: [
      {
        heading: 'The US Limited Liability Company (LLC) Explained',
        paragraphs: [
          'An LLC is a hybrid entity that combines the asset protection of a corporation with the operational and tax pass-through flexibility of a partnership. By default, profits and losses of an LLC flow directly to the founders’ personal tax returns, avoiding double taxation at the corporate level.',
          'This is ideal for bootstrapped software startups, consulting firms, e-commerce storefronts, and independent developers who do not intend to raise Venture Capital. LLCs also require much simpler corporate overhead, with no strict board meetings or minute books mandated.'
        ]
      },
      {
        heading: 'The US C-Corporation (INC) Explained',
        paragraphs: [
          'A C-Corporation, typically registered in the state of Delaware, is a completely independent legal entity owned by shareholders. It is the gold standard for high-growth tech companies. Because C-Corps have a very structured share system, they can easily issue stock options (ESOPs) to attract stellar talent and distribute shares to external investors.',
          'Venture Capitalists and Angel Synics almost exclusively invest in US C-Corporations. They will not invest in LLCs because of the tax complexities associated with partnership structures.'
        ]
      }
    ],
    stepsTitle: 'Comparison Breakdown at a Glance',
    steps: [
      'Fundraising: LLC is not VC-friendly; C-Corp (INC) is the industry standard for VC investment.',
      'Taxation: LLC has pass-through tax flexibility; C-Corp is subject to default US corporate taxes.',
      'Ownership: LLC uses percentage membership interest; C-Corp issues specific quantities of common/preferred shares.',
      'Formality level: LLC has minimal structural maintenance; C-Corp requires strict board bylaws and annual shareholder votes.'
    ],
    conclusion: 'Whether you need a Delaware C-Corp with a flip-on transfer structure or a simple Wyoming LLC, Infovisory takes care of registered agent fees, EIN processing, and US bank integrations.'
  },
  {
    slug: 'gst-itc-rules',
    title: 'Decoding GST Input Tax Credit (ITC) Rules for Startups',
    excerpt: 'Minimize leaks in your operating cashflow by understanding the stringent rules of GST Input Tax Credit reconciliation under Sections 16 & 17.',
    image: 'https://images.unsplash.com/photo-1444653389962-8149286c578a?auto=format&fit=crop&q=80&w=800',
    date: 'May 20, 2026',
    author: 'CA R. Singhania',
    category: 'GST Compliance',
    readTime: '5 min read',
    quote: 'Input Tax Credit is real money lying on your balance sheet. Poor invoice compliance is the leading cause of capital leaks for early-stage companies.',
    intro: 'The Goods and Services Tax (GST) system in India is highly standardized. One of its greatest strengths is the Input Tax Credit (ITC), which allows you to offset the GST you pay on purchase invoices against the GST you collect on sales. However, if your suppliers fail to upload their invoices on time, your capital can get stuck indefinitely.',
    sections: [
      {
        heading: 'The 100% Reconciliation Rule under GSTR-2B',
        paragraphs: [
          'A startup can only claim ITC if the underlying supplier has declared the transaction and uploaded the invoices in their GSTR-1. This data populates your GSTR-2B, which is a static monthly auto-drafted ITC statement.',
          'If a supplier is lazy or defaults on their filings, you cannot claim the credit, regardless of whether you have an active Tax Invoice and have made full payment. Doing so anyway leads to auto-generated tax discrepancy notices from GST officers.'
        ]
      },
      {
        heading: 'What Eligible vs Invisible Credit Expenses Mean',
        paragraphs: [
          'Not all business expenses qualify for ITC. Section 17(5) of the CGST Act blocks credit on items like motor cars, catering, food & beverages, and employee insurance unless they are legally compulsory or are inputs for your core service.',
          'Eligible expenses include SaaS subscriptions, cloud server bills, office rent, laptops, software development equipment, marketing agency invoices, and general corporate legal fees.'
        ]
      }
    ],
    stepsTitle: 'Strategies to Maximize Your GST ITC Recovery',
    steps: [
      'Mandate that all primary suppliers submit invoices by the 11th of every month.',
      'Run periodic reconciliation scripts matching your purchase ledger against GSTR-2B datasets.',
      'Establish a strict vendor onboarding protocol to verify their past compliance history.',
      'Immediately isolate invoices where suppliers have mistakenly filled standard B2C rather than B2B GSTIN blocks.'
    ],
    conclusion: 'We set up automated bookkeeping reconciliations at Infovisory to safeguard your cashflow. We cross-verify every single GST transaction so your startup never loses its hard-earned input credits.'
  },
  {
    slug: 'pvt-ltd-vc-funding',
    title: 'Why Private Limited is Still Key to VC Funding in India',
    excerpt: 'If you plan to raise venture capital, an LLP or Sole Proprietorship won\'t work. Learn why institutional investors mandate 100% Private Limited setups.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    date: 'May 17, 2026',
    author: 'Legal Expert',
    category: 'Corp Structuring',
    readTime: '6 min read',
    quote: 'A startup with global ambitions needs to speak the language of institutional capital. In India, that language is built exclusively on Private Limited shares.',
    intro: 'When launching a new business, it is tempting to go for the path of least resistance: a Sole Proprietorship or an LLP. They have lower setup costs and fewer administrative requirements. However, if your long-term roadmap involves venture capitals and scaling rapidly, starting as anything other than a Private Limited Company is a costly mistake.',
    sections: [
      {
        heading: 'The Investor Mandate: It is All About Shares',
        paragraphs: [
          'When venture capitalists invest in your business, they do so in exchange for equity. A Private Limited company structure is governed by the Companies Act, 2103, which explicitly permits the issuance of secondary shares (Equity, Compulsorily Convertible Preference Shares - CCPS).',
          'LLPs, on the other hand, do not have shares; they have partnership stakes. Transferring stake or modifying profit-sharing ratios requires amending the partnership deed and obtaining approval from all partners, which is extremely slow and rigid.'
        ]
      },
      {
        heading: 'Attracting Stellar Talent with ESOPs',
        paragraphs: [
          'High-growth startups rely heavily on sweat equity and Employee Stock Option Plans (ESOPs) to attract top-tier engineering and executive talent. You can easily pool and reserve a portion of Authorized Share Capital for employee options.',
          'There is no clean, tax-efficient or legally compliant equivalent for LLPs or partnerships in India, making it nearly impossible to hire senior veterans who demand equity stakes.'
        ]
      }
    ],
    stepsTitle: 'Why Founders Overwhelmingly Prefer Pvt Ltd',
    steps: [
      'Complete and clean separation of management (Directors) and ownership (Shareholders).',
      'The highest standard of corporate credibility in the eyes of public banks and suppliers.',
      'Limited liability protection ensuring founders’ personal assets remain 100% secure.',
      'The ability to raise foreign investment through the Foreign Direct Investment (FDI) route.'
    ],
    conclusion: 'Don\'t let a quick and cheap setup block your fundraising future. Infovisory incorporates your Private Limited Company correctly from the start, drafting robust articles of association ready for VC term sheets.'
  },
  {
    slug: 'trademark-registration-strategy',
    title: 'Trademark Registration Strategy for Digital Brands',
    excerpt: 'A trademark protects your logo and brand name from competitors. Discover the class selection blueprint and search methodology before filing.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    date: 'May 14, 2026',
    author: 'Adv. Sneha Sen',
    category: 'Intellectual Property',
    readTime: '6 min read',
    quote: 'Your brand name is your most valuable intellectual asset. Filing a trademark protects your hard-built reputation from marketplace copycats.',
    intro: 'For digital-first e-commerce brands and SaaS platforms, reputation is everything. Investing heavily in marketing, ad campaigns, and SEO only to receive a cease-and-desist letter from a competitor who owns a similar trademark is a nightmare scenario.',
    sections: [
      {
        heading: 'The Importance of a Pre-Filing Search',
        paragraphs: [
          'Before submitting your trademark application, you must perform a comprehensive look-up in the IP India public search register. This searches for not just exact matches, but phonetic similarities across your chosen classes.',
          'Many founders choose common or highly descriptive words for their brands, which are routinely rejected by trademark examiners. The more arbitrary or suggestive your brand name is, the stronger its legal protection will be.'
        ]
      },
      {
        heading: 'Selecting the Correct Nice Classes',
        paragraphs: [
          'Trademarks are filed under specific classifications known as the Nice Classification, consisting of 45 distinct classes (Classes 1 to 34 for goods, and Classes 35 to 45 for services).',
          'For example, a software-as-a-service (SaaS) startup must register under Class 42 (technical services) and potentially Class 9 (downloadable computer software), whereas an e-commerce platform relies on Class 35 (retail/merchant services).'
        ]
      }
    ],
    stepsTitle: 'A Structured Path to Your ® Symbol',
    steps: [
      'Establish a completely unique, non-descriptive brand name and associated visual logo.',
      'Perform a deep search in the IP India registry database across all relevant classes.',
      'Prepare and file Form TM-A with proof of prior usage if claiming a past date.',
      'Monitor application status for examination reports or third-party oppositions.'
    ],
    conclusion: 'At Infovisory, our intellectual property division handles everything from prior-art searches to drafting comprehensive responses to trademark objections. Secure your digital real estate with us today.'
  }
];

export function getSelectedPosts(): BlogPost[] {
  // Rotate the blogs once every 2 days
  const millisecondsInTwoDays = 1000 * 60 * 60 * 24 * 2;
  const rotationIndex = Math.floor(Date.now() / millisecondsInTwoDays);
  
  const posts: BlogPost[] = [];
  for (let i = 0; i < 3; i++) {
    const postIndex = (rotationIndex + i) % POOL_OF_BLOG_POSTS.length;
    posts.push(POOL_OF_BLOG_POSTS[postIndex]);
  }
  return posts;
}
