import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { ArrowLeft, Clock, User, Share2 } from 'lucide-react';
import { BlogPost } from '../blogData';
import { getBlogBySlug } from '../lib/blogService';
import { useSEO } from '../utils/seo';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useSEO(
    post ? post.title : 'Business Insight Guide',
    post ? post.excerpt : 'Read detailed compliance guides, corporate filings, and regulatory updates from Infovisory.',
    slug ? `/blog/${slug}` : '/blog'
  );

  useEffect(() => {
    if (slug) {
      getBlogBySlug(slug).then(res => {
        setPost(res);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" id="blog-post-spinner"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold text-blue-900 mb-6">Insight Not Found</h2>
          <p className="text-gray-500 mb-8 font-medium">The requested business insight article does not exist or may have been rotated.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
            <ArrowLeft size={18} /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 animate-fadeIn">
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold text-sm mb-12 transition-colors">
          <ArrowLeft size={18} />
          Back to Blog
        </Link>
        
        <header className="mb-12">
          <div className="flex items-center gap-6 text-gray-400 text-sm mb-6 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2"><Clock size={16} /> {post.date}</span>
            <span className="flex items-center gap-2"><User size={16} /> {post.author}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-blue-900 mb-8 leading-tight">{post.title}</h1>
        </header>

        <div className="aspect-video rounded-[60px] overflow-hidden mb-16 shadow-2xl">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer" 
          />
        </div>

        <article className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium">
          <p className="text-2xl text-blue-900 font-serif italic mb-12 border-l-4 border-blue-600 pl-8">"{post.quote}"</p>
          
          <p className="mb-8">{post.intro}</p>
          
          {post.sections.map((section, idx) => (
            <div key={idx} className="mb-12">
              {section.heading && (
                <h2 className="text-3xl font-serif font-bold text-blue-900 mt-16 mb-8">{section.heading}</h2>
              )}
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="mb-6">{p}</p>
              ))}
            </div>
          ))}

          {post.steps && post.steps.length > 0 && (
            <div className="my-12">
              {post.stepsTitle && (
                <h3 className="text-2xl font-serif font-bold text-blue-900 mt-12 mb-8">{post.stepsTitle}</h3>
              )}
              <ul className="space-y-4 mb-12 list-none p-0">
                {post.steps.map((step, i) => (
                  <li key={i} className="flex gap-4 items-start bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">{i+1}</span>
                    <span className="text-blue-900 font-bold">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mb-12 font-semibold text-blue-900">{post.conclusion}</p>
        </article>

        <div className="border-t border-gray-100 pt-12 mt-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">IF</div>
            <div>
              <div className="font-bold text-blue-900">Infovisory Editorial</div>
              <div className="text-sm text-gray-400">Legal & Compliance Insights</div>
            </div>
          </div>
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: post.title,
                  text: post.excerpt,
                  url: window.location.href,
                }).catch(err => console.log(err));
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Article Link copied to clipboard!');
              }
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold transition-colors"
          >
            Share this Article <Share2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

