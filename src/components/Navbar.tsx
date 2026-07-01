import { Scale, Menu, X, ChevronDown, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useServices, getIconComponent, ServiceCategory } from '../context/ServicesContext';

/**
 * Navbar Component
 * 
 * Provides an adaptive, responsive navigation bar with interactive services lists,
 * responsive mobile overlays, smooth transition logic on document page scroll,
 * and dynamically initialized admin login layout routes.
 */
export default function Navbar() {
  const { services } = useServices();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({ entrepreneur: true });

  /**
   * Admin Authentication Sync Hook
   * 
   * Detects if the current user possesses administrator permissions via local browser state events.
   */
  useEffect(() => {
    const checkAdmin = () => {
      setIsAdmin(localStorage.getItem('bizlaunch_is_owner') === 'true');
    };
    
    checkAdmin();
    
    window.addEventListener('storage', checkAdmin);
    window.addEventListener('bizlaunch_owner_update', checkAdmin);
    return () => {
      window.removeEventListener('storage', checkAdmin);
      window.removeEventListener('bizlaunch_owner_update', checkAdmin);
    };
  }, []);

  /**
   * Scroll Listener Hook
   * 
   * Shrinks navbar padding once page content scrolling crosses the Y-axis boundary limit (20px).
   */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  /**
   * Helper function to get correct absolute positioning class per category
   */
  const getDropdownPositionClass = (id: string) => {
    switch (id) {
      case 'entrepreneur':
        return 'absolute left-0 top-full mt-2';
      case 'registrations':
        return 'absolute left-1/2 -translate-x-[45%] top-full mt-2';
      case 'returns':
        return 'absolute left-1/2 -translate-x-1/2 top-full mt-2';
      case 'compliances':
        return 'absolute right-[-320px] xl:right-[-260px] top-full mt-2';
      case 'income-tax-return-filings':
        return 'absolute right-[-180px] top-full mt-2';
      case 'accounting-payroll':
        return 'absolute right-0 top-full mt-2';
      default:
        return 'absolute left-1/2 -translate-x-1/2 top-full mt-2';
    }
  };

  /**
   * Helper function to render a custom navigation item link with subtle hover animations
   */
  const renderLinkItem = (id: string, name: string, activeColor: 'orange' | 'blue' = 'blue') => {
    const hoverColor = activeColor === 'orange' ? 'hover:text-orange-600 hover:bg-orange-50/40' : 'hover:text-blue-900 hover:bg-blue-50/40';
    const dotColor = activeColor === 'orange' ? 'group-hover/item:bg-orange-500' : 'group-hover/item:bg-blue-600';
    
    return (
      <Link
        key={id}
        to={`/service/${id}`}
        className={`group/item flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] font-medium text-gray-600 transition-all duration-200 ${hoverColor}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full bg-gray-300 transition-colors flex-shrink-0 ${dotColor}`} />
        <span className="truncate leading-tight">{name}</span>
      </Link>
    );
  };

  /**
   * Helper function to render a fully styled, multi-column mega menu dropdown box
   */
  const renderDropdownContent = (category: ServiceCategory) => {
    if (category.id === 'registrations') {
      const taxRegs = category.subServices.filter(sub => sub.groupId === 'tax-reg');
      const otherRegs = category.subServices.filter(sub => sub.groupId === 'other-reg');

      return (
        <div className="grid grid-cols-12 gap-7 w-[840px] p-6 bg-white rounded-2xl shadow-3xl border border-blue-50/60 overflow-hidden">
          {/* Tax Registrations */}
          <div className="col-span-5 border-r border-gray-100/80 pr-5">
            <div className="text-[#e85a24] text-[13.5px] font-extrabold uppercase tracking-wider pb-2 border-b-2 border-[#e85a24]/20 mb-4 flex items-center">
              Tax Registrations
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {taxRegs.map(sub => renderLinkItem(sub.id, sub.name, 'orange'))}
            </div>
          </div>

          {/* Other Registrations */}
          <div className="col-span-7">
            <div className="text-[#e85a24] text-[13.5px] font-extrabold uppercase tracking-wider pb-2 border-b-2 border-[#e85a24]/20 mb-4 flex items-center">
              Other Registrations
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {otherRegs.map(sub => renderLinkItem(sub.id, sub.name, 'orange'))}
            </div>
          </div>
        </div>
      );
    }

    if (category.id === 'compliances') {
      const corpChanges = category.subServices.filter(sub => sub.groupId === 'corp-changes');
      const closures = category.subServices.filter(sub => sub.groupId === 'closure');
      const legalDrafting = category.subServices.filter(sub => sub.groupId === 'legal-drafting');
      const specials = category.subServices.filter(sub => sub.groupId === 'special-compliance');

      return (
        <div className="grid grid-cols-12 gap-7 w-[980px] p-6 bg-white rounded-2xl shadow-3xl border border-blue-50/60 overflow-hidden">
          {/* Corporate Changes Column */}
          <div className="col-span-7 border-r border-gray-100/80 pr-5">
            <div className="text-blue-900 text-[13.5px] font-extrabold uppercase tracking-wider pb-2 border-b-2 border-blue-900/20 mb-4 flex items-center">
              Corporate Changes
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {corpChanges.map(sub => renderLinkItem(sub.id, sub.name, 'blue'))}
            </div>
          </div>

          {/* Business Closures, Legal & Special Columns */}
          <div className="col-span-5 flex flex-col gap-5">
            <div>
              <div className="text-blue-900 text-[13.5px] font-extrabold uppercase tracking-wider pb-1.5 border-b border-blue-900/10 mb-2 flex items-center">
                Business Closure
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                {closures.map(sub => renderLinkItem(sub.id, sub.name, 'blue'))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <div className="text-blue-900 text-[11px] font-extrabold uppercase tracking-widest pb-1 border-b border-blue-900/10 mb-2 flex items-center">
                  Legal Drafting
                </div>
                <div className="flex flex-col gap-0.5">
                  {legalDrafting.map(sub => renderLinkItem(sub.id, sub.name, 'blue'))}
                </div>
              </div>

              <div>
                <div className="text-blue-900 text-[11px] font-extrabold uppercase tracking-widest pb-1 border-b border-blue-900/10 mb-2 flex items-center">
                  Special
                </div>
                <div className="flex flex-col gap-0.5">
                  {specials.map(sub => renderLinkItem(sub.id, sub.name, 'blue'))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (category.id === 'entrepreneur') {
      return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-[480px] p-5 bg-white rounded-2xl shadow-3xl border border-blue-50/60 overflow-hidden">
          {category.subServices.map(sub => renderLinkItem(sub.id, sub.name, 'blue'))}
        </div>
      );
    }

    if (category.id === 'returns') {
      return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-[420px] p-5 bg-white rounded-2xl shadow-3xl border border-blue-50/60 overflow-hidden">
          {category.subServices.map(sub => renderLinkItem(sub.id, sub.name, 'blue'))}
        </div>
      );
    }

    if (category.id === 'income-tax-return-filings') {
      return (
        <div className="flex flex-col gap-0.5 w-[320px] p-4 bg-white rounded-2xl shadow-3xl border border-blue-50/60 overflow-hidden">
          {category.subServices.map(sub => renderLinkItem(sub.id, sub.name, 'blue'))}
        </div>
      );
    }

    // Default simple single list
    return (
      <div className="flex flex-col gap-0.5 w-[260px] p-4 bg-white rounded-2xl shadow-3xl border border-blue-50/60 overflow-hidden">
        {category.subServices.map(sub => renderLinkItem(sub.id, sub.name, 'blue'))}
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-blue-100/40 shadow-sm" id="main-nav">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-2 xl:px-8">
        <div className="h-18 lg:h-20 flex justify-between items-center bg-transparent">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <Logo variant="horizontal" iconSize="md" showTagline={true} />
          </Link>

          {/* Desktop Nav (Centered to maximize horizontal space and balance, optimized for smaller laptops) */}
          <div className="hidden lg:flex flex-1 justify-center items-center space-x-0 lg:space-x-0.5 xl:space-x-1.5 px-0.5 xl:px-3">
            {services.map((category) => (
              category.subServices.length > 0 ? (
                <div 
                  key={category.id} 
                  className="relative group py-2"
                  onMouseEnter={() => setActiveDropdown(category.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-0.5 xl:gap-1 px-0.5 lg:px-0.5 xl:px-2.5 py-1.5 text-[9.5px] lg:text-[9.5px] xl:text-[12px] 2xl:text-[12.5px] font-bold text-gray-500 hover:text-blue-900 transition-colors uppercase tracking-normal lg:tracking-normal xl:tracking-wider whitespace-nowrap">
                    {category.shortName || category.name}
                    <ChevronDown size={11} className={`transition-transform duration-300 ${activeDropdown === category.id ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {activeDropdown === category.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={`${getDropdownPositionClass(category.id)} z-50`}
                      >
                        {renderDropdownContent(category)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={category.id}
                  to={`/${category.id}`}
                  className="px-0.5 lg:px-0.5 xl:px-2.5 py-1.5 text-[9.5px] lg:text-[9.5px] xl:text-[12px] 2xl:text-[12.5px] font-bold text-gray-500 hover:text-blue-900 transition-colors uppercase tracking-normal lg:tracking-normal xl:tracking-wider whitespace-nowrap"
                >
                  {category.shortName || category.name}
                </Link>
              )
            ))}
          </div>

          {/* Right Actions: Explicitly placed at the right of the desktop bar, shifted left on lg screens */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-3 flex-shrink-0 lg:mr-0.5 xl:mr-0">
            {isAdmin && location.pathname === '/leads-hub' && (
              <Link 
                to="/leads-hub"
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-amber-100 transition-all shadow-sm"
              >
                <ShieldCheck size={14} className="text-amber-600 animate-pulse" />
                Admin Hub
              </Link>
            )}
            <Link to="/contact" className="bg-blue-900 text-white px-2 lg:px-2.5 xl:px-6 py-1.5 lg:py-2 xl:py-3 rounded-lg lg:rounded-xl xl:rounded-2xl text-[9.5px] lg:text-[10px] xl:text-sm font-bold hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/20 whitespace-nowrap">
              Request a Consultation
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-blue-900"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-[72px] left-0 right-0 bottom-0 h-[calc(100vh-72px)] z-40 bg-white/98 backdrop-blur-xl lg:hidden p-6 overflow-y-auto"
          >
            <div className="space-y-4">
              {services.map((category) => {
                const isCatExpanded = !!mobileExpanded[category.id];
                const CatIcon = category.icon || getIconComponent(category.iconName);
                return (
                  <div key={category.id} className="bg-blue-50/20 p-4 rounded-2xl border border-blue-100/30">
                    <button
                      onClick={() => setMobileExpanded(prev => ({ ...prev, [category.id]: !prev[category.id] }))}
                      className="flex items-center justify-between w-full text-left py-1"
                    >
                      <span className="text-xs font-black text-[#0d2c5c] uppercase tracking-widest flex items-center gap-2">
                        {CatIcon && <CatIcon size={15} className="text-blue-500" />}
                        {category.name}
                      </span>
                      <ChevronDown 
                        size={15} 
                        className={`text-gray-400 transition-transform duration-300 ${isCatExpanded ? 'rotate-180 text-blue-600' : ''}`} 
                      />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isCatExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 gap-1.5 pl-3 border-l-2 border-blue-100/60 mt-3 mb-1">
                            {category.subServices.map((sub) => (
                              <Link
                                key={sub.id}
                                  to={`/service/${sub.id}`}
                                className="py-2.5 px-3 rounded-xl hover:bg-white text-gray-700 font-semibold text-[13.5px] transition-all hover:text-blue-900 border border-transparent hover:border-blue-100/30"
                              >
                                {sub.name}
                              </Link>
                            ))}
                            {category.subServices.length === 0 && (
                              <Link 
                                to={`/${category.id}`} 
                                className="py-2.5 px-3 rounded-xl hover:bg-white text-gray-700 font-semibold text-[13.5px] transition-all hover:text-blue-900 border border-transparent hover:border-blue-100/30"
                              >
                                View {category.name}
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 pt-12 border-t border-blue-50 space-y-4">
              {isAdmin && location.pathname === '/leads-hub' && (
                <Link 
                  to="/leads-hub" 
                  className="flex items-center justify-center gap-2 w-full bg-amber-50 text-amber-850 border border-amber-200 h-16 rounded-2xl font-black uppercase text-xs tracking-widest shadow-sm"
                >
                  <ShieldCheck size={18} className="text-amber-600 animate-pulse" />
                  Admin Portal Hub
                </Link>
              )}
              <Link to="/contact" className="flex items-center justify-center w-full bg-blue-600 text-white h-16 rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/20">
                Request a Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
