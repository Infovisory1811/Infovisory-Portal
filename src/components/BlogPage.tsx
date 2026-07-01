import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'motion/react';
import { ArrowRight, Clock, User } from 'lucide-react';
import { BlogPost } from '../blogData';
import { getBlogs } from '../lib/blogService';
import { useSEO } from '../utils/seo';

export default function BlogPage() {
  useSEO(
    'Business Insights & Corporate Blog',
    'Read expert corporate tax guides, company registration checklists, GST updates, and legal compliance insights curated by Infovisory\'s senior CAs and legal advisors.',
    '/blog'
  );

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogs().then(posts => {
      setBlogPosts(posts);
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching blogs in BlogPage:', err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl lg:text-6xl font-serif font-bold text-blue-900 mb-4 text-center">Business Insights</h1>
        <p className="text-xl text-gray-500 mb-16 text-center max-w-2xl mx-auto font-medium">Expert advice on law, compliance, and growth for Indian startups.</p>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm space-y-4 animate-pulse">
                <div className="aspect-video bg-gray-100 rounded-3xl w-full" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
                <div className="h-6 bg-gray-100 rounded w-3/4" />
                <div className="h-12 bg-gray-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No business insights found. Check back later!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 text-gray-400 text-sm mb-4 font-medium">
                    <div className="flex items-center gap-1"><Clock size={16} /> {post.date}</div>
                    <div className="flex items-center gap-1"><User size={16} /> {post.author}</div>
                  </div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-4 line-clamp-2">{post.title}</h2>
                  <p className="text-gray-500 mb-8 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-blue-600 font-bold group">
                    Read More <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
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

