import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useServices, getIconComponent } from '../context/ServicesContext';

export default function ServiceSection() {
  const { services } = useServices();

  return (
    <section className="py-32 bg-blue-50/30" id="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-blue-600 font-bold uppercase tracking-[0.2em] text-xs mb-4"
            >
              Enterprise Legal Suite
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-blue-900 leading-tight">
              One platform, <br/>
              <span className="text-gray-400">Total compliance.</span>
            </h2>
          </div>
          <p className="text-gray-500 text-lg max-w-sm font-medium pb-2">
            Seamlessly navigate Indian laws with our curated legal solutions for modern businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.filter(c => c.subServices && c.subServices.length > 0).map((category, index) => {
            const CatIcon = category.icon || getIconComponent(category.iconName);
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-[32px] p-8 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 bg-white border border-blue-100/40 hover:border-blue-300 flex flex-col justify-between"
              >
                {/* Abstract decorative background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900 rounded-2xl flex items-center justify-center mb-8 border border-blue-100/60 group-hover:from-blue-600 group-hover:to-blue-800 group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-blue-600/20 transition-all duration-500">
                      {CatIcon && <CatIcon size={26} />}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-blue-950 group-hover:text-blue-900 mb-6 transition-colors">{category.name}</h3>
                    
                    <div className="space-y-2 mb-8">
                      {category.subServices.slice(0, 3).map(sub => (
                        <Link 
                          key={sub.id} 
                          to={`/service/${sub.id}`}
                          className="flex items-center justify-between py-3 px-4 rounded-2xl text-gray-600 font-semibold hover:text-blue-950 hover:bg-blue-50/70 transition-all border border-transparent hover:border-blue-100/40 group/sublink"
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80 group-hover/sublink:bg-blue-600 group-hover/sublink:scale-125 transition-all" />
                            {sub.name}
                          </span>
                          <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/sublink:opacity-100 group-hover/sublink:translate-x-0 transition-all text-blue-600" />
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <Link to={`/category/${category.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-900 transition-colors group/link mt-auto pt-2">
                    View all services
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="font-sans">
                      &rarr;
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
