/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceSection from './components/ServiceSection';
import ProcessSection from './components/ProcessSection';
import ReviewSlider from './components/ReviewSlider';
import Footer from './components/Footer';
import ServicePage from './components/ServicePage';
import CategoryPage from './components/CategoryPage';
import ConsultationPage from './components/ConsultationPage';
import LeadDashboard from './components/LeadDashboard';
import PolicyPage from './components/PolicyPage';
import InformationPage from './components/InformationPage';
import BlogPage from './components/BlogPage';
import BlogPostPage from './components/BlogPostPage';
import { useSEO } from './utils/seo';
import { ServicesProvider } from './context/ServicesContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function HomePage() {
  useSEO(
    'Infovisory: Tax. Compliance. Growth | CA & Legal Advisors in Jaipur',
    'Infovisory provides premium company registration, GST filing, trademark registration, tax compliance, and corporate legal advisory services in Jaipur and across India.',
    '/'
  );

  return (
    <>
      <Hero />
      <ServiceSection />
      <ProcessSection />
      <ReviewSlider />
      {/* Call to Action Section */}
      <section className="py-20 md:py-32 bg-white" id="cta-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-900 rounded-[32px] sm:rounded-[60px] p-8 sm:p-16 md:p-24 shadow-[0_40px_100px_-20px_rgba(30,58,138,0.3)] relative overflow-hidden text-white text-center">
             <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px]" />
             <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-[80px]" />
             
             <h3 className="text-3xl sm:text-5xl md:text-7xl font-serif font-bold mb-6 md:mb-10 relative z-10 leading-tight">
                Build your <br/><span className="text-blue-400 italic underline decoration-blue-500/30 underline-offset-8">business legacy.</span>
             </h3>
             <p className="text-blue-100 text-base sm:text-xl md:text-2xl mb-8 md:mb-14 max-w-2xl mx-auto relative z-10 font-medium leading-relaxed opacity-80">
                Join 10,000+ Indian entrepreneurs who trusted Infovisory to turn their dreams into compliant realities.
             </p>
             <Link to="/contact" className="inline-block bg-white text-blue-900 px-8 py-4 sm:px-14 sm:py-6 rounded-xl sm:rounded-2xl font-black text-sm sm:text-xl hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-2xl relative z-10 group">
                Get Your Free Consultation
                <span className="block h-1 w-0 group-hover:w-full bg-blue-600 transition-all duration-500 mt-1" />
             </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ServicesProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden selection:bg-blue-100 selection:text-blue-900 relative flex flex-col" id="infovisory-app">
          <Navbar />
          <div 
            className="relative z-10 bg-white flex-grow pb-16" 
            id="content-boundary"
          >
            <Routes>
              <Route path="/" element={<main><HomePage /></main>} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/service/:serviceId" element={<ServicePage />} />
              <Route path="/contact" element={<ConsultationPage />} />
              <Route path="/leads-hub" element={<LeadDashboard />} />
              <Route path="/info/:slug" element={<InformationPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/:slug" element={<PolicyPage />} />
              {/* Fallback */}
              <Route path="*" element={<div className="p-20 text-center">404 - Not Found <br/><Link to="/" className="text-blue-600 font-bold">Go Home</Link></div>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </ServicesProvider>
    </Router>
  );
}
