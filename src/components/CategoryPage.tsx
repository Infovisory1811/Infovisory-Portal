import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useSEO } from '../utils/seo';
import { useServices, getIconComponent } from '../context/ServicesContext';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { services } = useServices();
  const category = services.find(c => c.id === categoryId);

  useSEO(
    category ? `${category.name} Services` : 'Corporate Services',
    category ? `Explore our comprehensive suite of ${category.name} services. Infovisory offers expert CA, registration, and tax compliance solutions.` : 'Infovisory corporate and legal compliance categories.',
    categoryId ? `/category/${categoryId}` : '/category'
  );

  if (!category) return <div className="p-20 text-center">Category not found. <Link to="/">Go back</Link></div>;

  const CatIcon = category.icon || getIconComponent(category.iconName);

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold text-sm mb-12 transition-colors" id="back-to-home">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="mb-16">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
            {CatIcon && <CatIcon size={32} />}
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-blue-900 mb-4">{category.name}</h1>
          <p className="text-xl text-gray-500 font-medium">Explore all our legal and compliance solutions for this category.</p>
        </div>

        {category.groups ? (
          <div className="space-y-20">
            {category.groups.map(group => (
              <div key={group.id} className="scroll-mt-32" id={`group-section-${group.id}`}>
                <div className="flex items-center gap-6 mb-12">
                  <h2 className="text-3xl font-bold text-orange-600 uppercase tracking-widest">{group.name}</h2>
                  <div className="h-0.5 bg-gray-100 flex-grow rounded-full" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.subServices
                    .filter(sub => sub.groupId === group.id)
                    .map((sub, index) => (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="p-8 rounded-[32px] border border-blue-50 bg-white hover:shadow-xl transition-all group flex flex-col"
                        id={`service-card-${sub.id}`}
                      >
                        <h3 className="text-2xl font-bold text-blue-900 mb-4">{sub.name}</h3>
                        <p className="text-gray-500 mb-8 font-medium leading-relaxed flex-grow">{sub.description}</p>
                        <div className="flex items-center justify-end mt-auto">
                          <Link to={`/service/${sub.id}`} className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all" id={`link-to-${sub.id}`}>
                            <ArrowRight size={20} />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.subServices.map((sub, index) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-8 rounded-[32px] border border-blue-50 bg-white hover:shadow-xl transition-all group flex flex-col"
                id={`service-card-${sub.id}`}
              >
                <h3 className="text-2xl font-bold text-blue-900 mb-4">{sub.name}</h3>
                <p className="text-gray-500 mb-8 font-medium leading-relaxed flex-grow">{sub.description}</p>
                <div className="flex items-center justify-end mt-auto">
                  <Link to={`/service/${sub.id}`} className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all" id={`link-to-${sub.id}`}>
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
