import { Scale, Mail, MapPin, Phone, Linkedin, Twitter, Facebook, ArrowRight, Instagram, Search, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState } from 'react';
import { getSelectedPosts } from '../blogData';
import { useServices } from '../context/ServicesContext';

/**
 * Footer Component
 * 
 * Provides an feature-rich visual footer with structured links, active Indian corporate blogs summaries, 
 * interactive smart services search explorer logic with live auto-suggestions, and brand details.
 */
export default function Footer() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { services } = useServices();

  const allServices = services.flatMap(c => 
    (c.subServices || []).map(s => ({ ...s, categoryId: c.id }))
  );

  /**
   * live auto-suggestion lookup string helper
   * @param query - Input typed characters
   * @returns array of up to 5 filtered matching services
   */
  const filteredSuggestions = query => {
    if (!query) return [];
    return allServices.filter(s => 
      s.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  };

  /**
   * handleExplore Helper
   * 
   * Main search engine routing function. Parses text query parameters, locates
   * exact or relative matching category and sub-service document models, and routes the user there.
   * @param id - Optional target identifier override from selection suggestions
   */
  const handleExplore = (id?: string) => {
    const targetId = id || searchQuery;
    if (!targetId) return;
    
    const query = targetId.toLowerCase();
    
    // Check if it's a direct ID from suggestion
    const directSub = allServices.find(s => s.id === targetId);
    if (directSub) {
      navigate(`/service/${directSub.id}`);
      setSearchQuery('');
      setShowSuggestions(false);
      return;
    }

    // Search in categories
    const category = services.find(c => 
      c.name.toLowerCase().includes(query) || c.id.toLowerCase() === query
    );
    if (category) {
      navigate(`/category/${category.id}`);
      setSearchQuery('');
      setShowSuggestions(false);
      return;
    }

    // Search in sub-services
    const sub = allServices.find(s => 
      s.name.toLowerCase().includes(query)
    );
    if (sub) {
      navigate(`/service/${sub.id}`);
      setSearchQuery('');
      setShowSuggestions(false);
      return;
    }

    alert('No matching service found. Try "Private Limited" or "GST".');
  };

  const activeBlogs = getSelectedPosts();
  const topReads = activeBlogs.map(blog => ({
    title: blog.title,
    desc: blog.excerpt,
    img: blog.image,
    date: blog.date,
    link: `/blog/${blog.slug}`
  }));


  const footerLinks = {
    home: [
      { name: 'About Us', path: '/info/about' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Affiliate With Us', path: '/info/affiliate' },
      { name: 'Career', path: '/info/career' },
      { name: 'Blog', path: '/blog' },
      { name: 'Read Client Reviews', path: '/info/reviews' }
    ],
    policy: [
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Terms & Conditions', path: '/terms-and-conditions' },
      { name: 'Disclaimer Policy', path: '/disclaimer-policy' },
      { name: 'Security Policy', path: '/security-policy' },
      { name: 'Cancellation Refund Policy', path: '/cancellation-refund-policy' }
    ],
    related: [
      { name: 'Income Tax Return Filings', path: '/service/income-tax-returns-reg' },
      { name: 'Payroll Solutions', path: '/service/payroll-service' },
      { name: 'Company Annual Filing', path: '/service/pvt-ltd-filing' },
      { name: 'GST Registration', path: '/service/gst-registration' },
      { name: 'TDS Returns', path: '/service/tds-returns' }
    ]
  };

  return (
    <footer className="bg-[#f8f9fa] pt-24 pb-8 border-t border-gray-200 relative z-20" id="footer">
      {/* Search / Explore Bar Overlay - Creating the elevation effect */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent -translate-y-full pointer-events-none" />
      
      {/* Search / Explore Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 relative">
        <div className="flex shadow-[0_30px_100px_-20px_rgba(30,58,138,0.15)] rounded-2xl overflow-visible max-w-4xl mx-auto border border-gray-100 relative bg-white -mt-32">
          <div className="flex-grow flex items-center px-6 py-4 relative">
            <Search className="text-gray-400 mr-3" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => e.key === 'Enter' && handleExplore()}
              placeholder="services (e.g. private limited company)" 
              className="w-full outline-none text-gray-600 placeholder:text-gray-300 font-medium italic"
            />
            {/* Suggestions Dropdown */}
            {showSuggestions && searchQuery && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-2xl rounded-b-xl border-x border-b border-gray-100 z-50 overflow-hidden">
                {filteredSuggestions(searchQuery).map((s) => (
                  <button 
                    key={s.id}
                    onClick={() => handleExplore(s.id)}
                    className="w-full text-left px-6 py-4 hover:bg-orange-50 border-b border-gray-50 last:border-0 flex items-center justify-between group"
                  >
                    <span className="text-gray-700 font-medium group-hover:text-[#ff6122] transition-colors">{s.name}</span>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-[#ff6122] transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={() => handleExplore()}
            className="bg-[#ff6122] text-white px-10 font-bold uppercase tracking-wider hover:bg-[#e5561e] transition-colors rounded-r-xl"
          >
            Explore
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Home Links */}
          <div className="lg:col-span-2">
            <h4 className="text-[#ff6122] font-black uppercase text-sm mb-6 tracking-tight">Home</h4>
            <ul className="space-y-3">
              {footerLinks.home.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-500 hover:text-[#ff6122] transition-colors text-sm font-medium">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Links */}
          <div className="lg:col-span-2">
            <h4 className="text-[#ff6122] font-black uppercase text-sm mb-6 tracking-tight">Policy</h4>
            <ul className="space-y-3">
              {footerLinks.policy.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-500 hover:text-[#ff6122] transition-colors text-sm font-medium">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Links */}
          <div className="lg:col-span-2">
            <h4 className="text-[#ff6122] font-black uppercase text-sm mb-6 tracking-tight">Related Links</h4>
            <ul className="space-y-3">
              {footerLinks.related.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-500 hover:text-[#ff6122] transition-colors text-sm font-medium">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top 3 Reads */}
          <div className="lg:col-span-6">
            <h4 className="text-[#ff6122] font-black uppercase text-sm mb-6 tracking-tight">Top 3 Reads</h4>
            <div className="space-y-4">
              {topReads.map((read, idx) => (
                <Link 
                  key={idx} 
                  to={read.link}
                  className="bg-white p-3 rounded-xl border border-gray-100 flex gap-4 group hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                    <img 
                      src={read.img} 
                      alt={read.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h5 className="text-sm font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-[#ff6122] transition-colors">{read.title}</h5>
                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed mb-1">{read.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-300 font-bold uppercase">{read.date}</span>
                      <ArrowRight size={14} className="text-gray-300 group-hover:text-[#ff6122] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-gray-200 mb-12">
          <div className="lg:col-span-12">
            <h4 className="text-[#ff6122] font-black uppercase text-sm mb-4 tracking-tight">Subscribe</h4>
            <p className="text-gray-500 text-sm mb-6 font-medium">Get the latest updates via email.</p>
            <div className="flex shadow-lg rounded-xl overflow-hidden border border-gray-100 max-w-md">
              <input 
                type="email" 
                placeholder="Enter Your Email" 
                className="flex-grow bg-white px-6 py-4 outline-none text-sm text-gray-600"
              />
              <button className="bg-[#ff6122] text-white px-8 font-bold text-sm uppercase hover:bg-[#e5561e] transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left w-full">
              <p className="text-gray-400 text-[11px] mb-2 font-medium">
                By continuing past this page, you agree to our <Link to="/terms-and-conditions" className="text-[#ff6122] hover:underline">Terms of Service</Link>, <Link to="/cookie-policy" className="text-[#ff6122] hover:underline">Cookie Policy</Link>, <Link to="/privacy-policy" className="text-[#ff6122] hover:underline">Privacy Policy</Link>, <Link to="/cancellation-refund-policy" className="text-[#ff6122] hover:underline">Refund Policy</Link> and Content Policies.
              </p>
              <p className="text-gray-400 text-[11px] font-bold">
                © 2018-{new Date().getFullYear()} Infovisory India Private Limited All rights reserved.
              </p>
              <p className="text-gray-300 text-[10px] mt-1 italic">Last updated on 1st May, 2026</p>
            </div>
          </div>
        </div>
      </div>

      <a 
        href="https://wa.me/919587582221?text=Hi%20Infovisory%2C%20I%20am%20interested%20in%20your%20financial%20services!" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 group"
        title="Chat with us on WhatsApp"
      >
        <svg 
          viewBox="0 0 24 24" 
          width="32" 
          height="32" 
          fill="currentColor" 
          className="w-8 h-8"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="absolute right-20 bg-white text-gray-800 px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
          How can we help?
        </span>
      </a>
    </footer>
  );
}
