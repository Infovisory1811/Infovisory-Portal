import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronRight, ShieldCheck, Users, Clock, ArrowUpRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  // Automatically looks for your image in the public folder.
  // Using string paths avoids compiler errors on local machines when the physical file is missing!
  const [heroImage, setHeroImage] = useState('/homepage-photo.jpg');
  const [imageAttempts, setImageAttempts] = useState(0);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <section ref={containerRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-white" id="hero-section">
      {/* Dynamic Background Elements */}
      <motion.div 
        style={{ y: y2, rotate }}
        className="absolute top-20 right-[-10%] -z-10 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] opacity-60" 
      />
      <motion.div 
        style={{ y: y1 }}
        className="absolute bottom-40 left-[-5%] -z-10 w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px] opacity-40" 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100/50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Trusted by 10,000+ Entrepreneurs
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-blue-900 leading-[1.15] mb-8 tracking-tight">
              Build your <br className="hidden sm:block" /> 
              <span className="relative inline-block text-blue-600 font-serif">
                Infovisory
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="absolute border-b-8 border-blue-100 bottom-2 left-0 w-full -z-10"
                />
              </span>
              <br className="hidden sm:block" />
              Legacy.
            </h1>
            
            <p className="text-xl text-gray-500 mb-12 max-w-lg leading-relaxed font-medium">
              India's premier digital-first firm for legal, tax, and compliance. We transform complex bureaucracy into elegant business solutions for your legacy.
            </p>
            
            <div className="flex flex-wrap gap-4 items-center">
              <Link
                to="/contact" 
                className="bg-blue-900 text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 shadow-2xl shadow-blue-900/20 group overflow-hidden relative"
              >
                <span className="relative z-10">Launch Your Vision</span>
                <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              
              <button 
                onClick={() => {
                  const el = document.getElementById('services-section');
                  if (el) {
                    const offset = 100;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = el.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="flex items-center gap-2 text-blue-900 font-bold px-6 py-4 hover:gap-4 transition-all group cursor-pointer"
              >
                Browse Services <ArrowUpRight size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <div className="lg:col-span-6 relative mt-12 lg:mt-0 w-full max-w-2xl mx-auto lg:max-w-none z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring" }}
              className="relative z-10"
            >
              <div className="aspect-[4/5] rounded-tl-[80px] sm:rounded-tl-[110px] rounded-br-[80px] sm:rounded-br-[110px] rounded-tr-[32px] rounded-bl-[32px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(30,58,138,0.25)] border-[6px] sm:border-[10px] border-white bg-blue-950/5 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
                   <ShieldCheck className="text-blue-100/80" size={120} />
                </div>
                <img 
                  src={heroImage} 
                  alt="Business Professional" 
                  className="w-full h-full object-cover relative z-10"
                  loading="eager"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    // Graceful file format fallbacks on local computer when copy-pasting code
                    if (imageAttempts === 0) {
                      setImageAttempts(1);
                      setHeroImage('/homepage-photo.jpg');
                    } else if (imageAttempts === 1) {
                      setImageAttempts(2);
                      setHeroImage('/homepage-photo.jpeg');
                    } else if (imageAttempts === 2) {
                      setImageAttempts(3);
                      // High-quality online fallback: professional portrait of an Indian corporate leader
                      setHeroImage('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1200');
                    } else if (imageAttempts === 3) {
                      setImageAttempts(4);
                      // Backup fallback
                      setHeroImage('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1200');
                    }
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/30 via-transparent to-blue-950/20 pointer-events-none z-20" />
                
                {/* Brand visual overlay to preserve user assets style */}
                <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-30 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  <div className="text-white/95 text-[10px] font-black uppercase tracking-[0.35em] mb-1">Infovisory</div>
                  <div className="text-white text-2.5xl sm:text-3.5xl font-serif font-black leading-none tracking-tight">Excellence</div>
                </div>
              </div>

              {/* Floaties */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute -top-4 -right-2 sm:-top-8 sm:-right-4 bg-white/95 backdrop-blur-md p-4.5 sm:p-5 rounded-3xl shadow-[0_20px_50px_rgba(30,58,138,0.15)] border border-blue-50/50 flex flex-col gap-2.5 min-w-[210px] z-20"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-600 tracking-widest leading-none">Status</span>
                    <span className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-widest leading-none">100% Verified</span>
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-black text-[#0d2c5c] leading-tight pl-0.5">100% Tax Compliant</div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-2 sm:-bottom-8 sm:-left-4 bg-white/95 backdrop-blur-md p-4 sm:p-4.5 rounded-3xl shadow-[0_20px_50px_rgba(30,58,138,0.15)] border border-blue-50/50 flex items-center gap-3.5 z-20"
              >
                <div className="flex -space-x-2.5">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8.5 h-8.5 rounded-full border-2 border-white bg-blue-100 overflow-hidden shadow-md">
                      <img src={`https://i.pravatar.cc/100?u=${i+105}`} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-xs font-black text-[#0d2c5c] leading-tight">Joined 5m ago</div>
                  <div className="inline-flex self-start px-2 py-0.5 bg-emerald-50 text-[8.5px] font-extrabold rounded-full text-emerald-700 uppercase tracking-wider mt-1 border border-emerald-100/50">
                    Active Registration
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}