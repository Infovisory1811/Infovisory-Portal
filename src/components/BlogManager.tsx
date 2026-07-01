import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Edit3, 
  PlusCircle, 
  MinusCircle, 
  BookOpen, 
  ArrowLeft, 
  CheckCircle, 
  Globe, 
  Layers 
} from 'lucide-react';
import { BlogPost } from '../blogData';
import { getBlogs, saveBlog, deleteBlog } from '../lib/blogService';

export default function BlogManager() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Selected post to edit or create (null means list mode)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Load all blogs on mount
  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const posts = await getBlogs();
      setBlogs(posts);
      setErrorMessage('');
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to load blogs from database.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingPost({
      slug: '',
      title: '',
      excerpt: '',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: 'Infovisory Team',
      category: 'Business Guidance',
      readTime: '5 min read',
      quote: 'Excellent insights guide your path to scalable enterprise.',
      intro: '',
      sections: [{ heading: 'Getting Started', paragraphs: [''] }],
      stepsTitle: 'Important Operations Checklist',
      steps: [''],
      conclusion: 'Ready to take the next step? Get in touch with our expert advisors.'
    });
    setSuccessMessage('');
  };

  const handleStartEdit = (post: BlogPost) => {
    setIsCreating(false);
    // Deep copy current post details
    setEditingPost(JSON.parse(JSON.stringify(post)));
    setSuccessMessage('');
  };

  // Helper to sync title to slug during creation
  const handleTitleChange = (val: string) => {
    if (!editingPost) return;
    const newPost = { ...editingPost, title: val };
    if (isCreating) {
      newPost.slug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
    }
    setEditingPost(newPost);
  };

  // Handle saving the edited or new post to Firestore
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    if (!editingPost.slug.trim()) {
      setErrorMessage('Slug is required.');
      return;
    }

    try {
      setLoading(true);
      await saveBlog(editingPost);
      setSuccessMessage(`Insight "${editingPost.title}" saved successfully!`);
      setEditingPost(null);
      setIsCreating(false);
      await loadBlogs();
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not save post. Please ensure valid characters.');
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting from Firestore
  const handleDelete = async (slug: string, title: string) => {
    if (!window.confirm(`Are you absolutely sure you want to delete the blog post "${title}"?`)) {
      return;
    }
    try {
      setLoading(true);
      await deleteBlog(slug);
      setSuccessMessage('Post deleted successfully.');
      if (editingPost?.slug === slug) {
        setEditingPost(null);
      }
      await loadBlogs();
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to delete blog post.');
      setLoading(false);
    }
  };

  // Helper functions to manage deep fields (sections)
  const updateSectionHeading = (sIdx: number, val: string) => {
    if (!editingPost) return;
    const updated = { ...editingPost };
    updated.sections[sIdx].heading = val;
    setEditingPost(updated);
  };

  const updateSectionParagraph = (sIdx: number, pIdx: number, val: string) => {
    if (!editingPost) return;
    const updated = { ...editingPost };
    updated.sections[sIdx].paragraphs[pIdx] = val;
    setEditingPost(updated);
  };

  const addParagraph = (sIdx: number) => {
    if (!editingPost) return;
    const updated = { ...editingPost };
    updated.sections[sIdx].paragraphs.push('');
    setEditingPost(updated);
  };

  const removeParagraph = (sIdx: number, pIdx: number) => {
    if (!editingPost) return;
    const updated = { ...editingPost };
    updated.sections[sIdx].paragraphs.splice(pIdx, 1);
    setEditingPost(updated);
  };

  const addSection = () => {
    if (!editingPost) return;
    const updated = { ...editingPost };
    updated.sections.push({ heading: 'New Section', paragraphs: [''] });
    setEditingPost(updated);
  };

  const removeSection = (sIdx: number) => {
    if (!editingPost) return;
    const updated = { ...editingPost };
    updated.sections.splice(sIdx, 1);
    setEditingPost(updated);
  };

  // Helper functions to manage steps list
  const updateStep = (idx: number, val: string) => {
    if (!editingPost) return;
    const updated = { ...editingPost };
    if (!updated.steps) updated.steps = [];
    updated.steps[idx] = val;
    setEditingPost(updated);
  };

  const addStep = () => {
    if (!editingPost) return;
    const updated = { ...editingPost };
    if (!updated.steps) updated.steps = [];
    updated.steps.push('');
    setEditingPost(updated);
  };

  const removeStep = (idx: number) => {
    if (!editingPost) return;
    const updated = { ...editingPost };
    if (updated.steps) {
      updated.steps.splice(idx, 1);
    }
    setEditingPost(updated);
  };

  return (
    <div id="blog-manager-container" className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
      
      {/* Header and alerts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-blue-950 flex items-center gap-2">
            <BookOpen className="text-blue-900" size={24} />
            Corporate Insights & Editorial Blogs
          </h2>
          <p className="text-gray-400 font-medium text-xs mt-1">
            Author compliance notifications, startup guidelines, and business articles shown live to thousands of search users.
          </p>
        </div>
        
        {!editingPost && (
          <button
            onClick={handleStartCreate}
            className="bg-blue-900 text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-blue-600 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            Create Insights Article
          </button>
        )}
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 animate-bounce" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-100 rounded-2xl text-xs font-bold leading-relaxed">
          {errorMessage}
        </div>
      )}

      {/* Primary Loader */}
      {loading && !editingPost && (
        <div className="flex flex-col items-center justify-center py-20 gap-4" id="blog-manager-loading">
          <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Refreshing insights register...</p>
        </div>
      )}

      {/* Editor Panel Block */}
      {editingPost ? (
        <form onSubmit={handleSave} className="space-y-8 animate-fadeIn" id="blog-form">
          <div className="flex items-center gap-2 pb-6 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setEditingPost(null)}
              className="text-gray-400 hover:text-blue-900 bg-slate-50 p-2.5 rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#ff6122]">Editorial Workspace</span>
              <h3 className="text-lg font-bold text-blue-950 font-serif">
                {isCreating ? 'Drafting New Insight Article' : `Editing: ${editingPost.title}`}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Column 1: Core Meta Content */}
            <div className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block">Article Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Navigating Indian Patent Laws in 2026"
                  className="w-full border-b border-gray-200 py-2 focus:border-blue-900 outline-none transition-all font-semibold text-blue-950"
                  value={editingPost.title}
                  onChange={e => handleTitleChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block">URL Slug (Auto-generated/Unique)</label>
                <div className="flex items-center gap-1">
                  <span className="text-gray-300 font-mono text-xs">/blog/</span>
                  <input
                    required
                    type="text"
                    disabled={!isCreating}
                    placeholder="e.g. patents-guide-2026"
                    className="flex-1 border-b border-gray-200 py-2 focus:border-blue-900 outline-none transition-all font-mono text-xs text-blue-900 bg-transparent disabled:opacity-60"
                    value={editingPost.slug}
                    onChange={e => setEditingPost({ ...editingPost, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block">Category</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Compliance Guidance"
                    className="w-full border-b border-gray-200 py-2 focus:border-blue-900 outline-none transition-all text-xs font-bold text-gray-700"
                    value={editingPost.category}
                    onChange={e => setEditingPost({ ...editingPost, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block">Read Time</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 5 min read"
                    className="w-full border-b border-gray-200 py-2 focus:border-blue-900 outline-none transition-all text-xs font-bold text-gray-700"
                    value={editingPost.readTime}
                    onChange={e => setEditingPost({ ...editingPost, readTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block">Display Author</label>
                  <input
                    required
                    type="text"
                    className="w-full border-b border-gray-200 py-2 focus:border-blue-900 outline-none transition-all text-xs font-bold text-gray-700"
                    value={editingPost.author}
                    onChange={e => setEditingPost({ ...editingPost, author: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block">Publish Date</label>
                  <input
                    required
                    type="text"
                    className="w-full border-b border-gray-200 py-2 focus:border-blue-900 outline-none transition-all text-xs font-bold text-gray-700"
                    value={editingPost.date}
                    onChange={e => setEditingPost({ ...editingPost, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block">Cover Image URL</label>
                <input
                  required
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full border-b border-gray-200 py-2 focus:border-blue-900 outline-none transition-all text-xs font-mono text-gray-600"
                  value={editingPost.image}
                  onChange={e => setEditingPost({ ...editingPost, image: e.target.value })}
                />
                
                {/* Visual Image Preview */}
                {editingPost.image && (
                  <div className="relative aspect-video rounded-3xl overflow-hidden mt-2 border border-slate-100 bg-slate-50">
                    <img 
                      src={editingPost.image} 
                      alt="Thumbnail Preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block">Excerpt Paragraph</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Specify brief summaries displayed on listing pages..."
                  className="w-full border border-gray-200 rounded-2xl p-4 focus:border-blue-900 outline-none transition-all text-xs font-medium text-gray-600 leading-relaxed bg-slate-50/50"
                  value={editingPost.excerpt}
                  onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                />
              </div>

            </div>

            {/* Column 2: Article Intros and Body Quotes */}
            <div className="space-y-6 bg-slate-50/40 p-6 rounded-[32px] border border-slate-100/50">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block">Header Accent Quote</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Standout tagline quote highlighted in italics..."
                  className="w-full border border-gray-100 rounded-xl p-3 focus:border-blue-900 outline-none transition-all text-xs font-serif italic text-blue-900 bg-white"
                  value={editingPost.quote}
                  onChange={e => setEditingPost({ ...editingPost, quote: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block">Introduction Segment</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed layout introduction paragraphs..."
                  className="w-full border border-gray-100 rounded-xl p-3 focus:border-blue-900 outline-none transition-all text-xs font-medium text-gray-600 leading-relaxed bg-white"
                  value={editingPost.intro}
                  onChange={e => setEditingPost({ ...editingPost, intro: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block">Closing Summary Conclusion</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Wrap up call-to-actions, conclusions..."
                  className="w-full border border-gray-100 rounded-xl p-3 focus:border-blue-900 outline-none transition-all text-xs font-medium text-gray-650 leading-relaxed bg-white"
                  value={editingPost.conclusion}
                  onChange={e => setEditingPost({ ...editingPost, conclusion: e.target.value })}
                />
              </div>

            </div>
          </div>

          {/* Section 3: Article Sections and Dynamic Paragraph Arrays */}
          <div className="pt-8 border-t border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-blue-950">Article Core Sections</h4>
                <p className="text-[10px] text-gray-400">Add dynamic chapter highlights, paragraphs, and heading metrics.</p>
              </div>
              <button
                type="button"
                onClick={addSection}
                className="text-xs font-bold text-blue-900 hover:text-blue-600 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all cursor-pointer"
              >
                <PlusCircle size={14} />
                Add Chapter Section
              </button>
            </div>

            <div className="space-y-6">
              {editingPost.sections.map((sec, sIdx) => (
                <div key={sIdx} className="border border-slate-100 rounded-3xl p-6 bg-white shadow-sm hover:border-slate-200 transition-all space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-black flex items-center justify-center">
                      {sIdx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Key Legal Hurdles (Optional)"
                      className="flex-1 font-serif font-bold text-[#111] border-b border-gray-100 focus:border-blue-900 outline-none py-1.5"
                      value={sec.heading || ''}
                      onChange={e => updateSectionHeading(sIdx, e.target.value)}
                    />
                    <button
                      type="button"
                      disabled={editingPost.sections.length <= 1}
                      onClick={() => removeSection(sIdx)}
                      className="text-red-400 hover:text-red-600 disabled:opacity-35 transition-all p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Paragraph list of this section */}
                  <div className="space-y-3 pb-2 pl-4 border-l border-slate-50">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-gray-400">Paragraph Content</span>
                      <button
                        type="button"
                        onClick={() => addParagraph(sIdx)}
                        className="text-[10px] font-bold text-blue-600 flex items-center gap-1"
                      >
                        <PlusCircle size={12} />
                        Add Paragraph block
                      </button>
                    </div>

                    {sec.paragraphs.map((para, pIdx) => (
                      <div key={pIdx} className="flex gap-2 items-start">
                        <textarea
                          required
                          rows={2}
                          placeholder="Chapter text content body details..."
                          className="flex-1 text-xs font-medium text-gray-500 leading-relaxed border border-gray-150 rounded-xl p-2.5 bg-slate-50/20 focus:bg-white focus:border-blue-900 transition-all outline-none"
                          value={para}
                          onChange={e => updateSectionParagraph(sIdx, pIdx, e.target.value)}
                        />
                        <button
                          type="button"
                          disabled={sec.paragraphs.length <= 1}
                          onClick={() => removeParagraph(sIdx, pIdx)}
                          className="text-slate-300 hover:text-red-500 disabled:opacity-35 py-1.5"
                        >
                          <MinusCircle size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Dynamic Steps List Checklist */}
          <div className="pt-8 border-t border-slate-100">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-blue-950">Actionable Steps / Guideline Metrics (Optional)</h4>
                <p className="text-[10px] text-gray-400">Renders elegant numbered badges helpful for checklists.</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 block">Steps Section Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Your Checklist for Navigating Claims"
                    className="w-full border-b border-gray-200 py-1.5 focus:border-blue-900 outline-none transition-all font-semibold bg-transparent text-sm"
                    value={editingPost.stepsTitle || ''}
                    onChange={e => setEditingPost({ ...editingPost, stepsTitle: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-gray-400">Step Guideline Messages</span>
                    <button
                      type="button"
                      onClick={addStep}
                      className="text-[10px] font-bold text-blue-800 flex items-center gap-1"
                    >
                      <PlusCircle size={12} />
                      Add Step Badge
                    </button>
                  </div>

                  {(editingPost.steps || []).map((step, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        placeholder="Draft specific checklist action code or milestone..."
                        className="flex-1 text-xs font-bold text-blue-900 bg-white border border-gray-150 rounded-lg px-3 py-2 focus:border-blue-950 outline-none"
                        value={step}
                        onChange={e => updateStep(idx, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeStep(idx)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <MinusCircle size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions footer */}
          <div className="pt-8 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setEditingPost(null);
                setSuccessMessage('');
              }}
              className="px-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md hover:bg-blue-650 cursor-pointer"
            >
              <Save size={16} />
              Save Article Live
            </button>
          </div>

        </form>
      ) : (
        
        /* List Mode Grid */
        <div className="space-y-6">
          {blogs.length === 0 ? (
            <div className="text-center py-16 border rounded-[32px] border-dashed border-gray-100 bg-slate-50/30">
              <BookOpen size={40} className="mx-auto text-slate-300 mb-4" />
              <p className="text-sm font-serif font-semibold text-gray-500">No blog documents found</p>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 leading-relaxed">
                Database has been wiped. Click 'Create Insights Article' above or reset demo files.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((post) => (
                <div 
                  key={post.slug}
                  className="bg-slate-50/50 rounded-3xl border border-slate-100/80 overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-blue-100 transition-all group"
                >
                  <div>
                    {/* Cover image with info block overlay */}
                    <div className="aspect-video relative overflow-hidden bg-slate-200">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 left-3 bg-blue-900 text-white font-bold text-[9px] uppercase px-3 py-1 rounded-full shadow-sm tracking-wider">
                        {post.category}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>By {post.author}</span>
                      </div>
                      <h3 className="font-serif font-bold text-blue-950 text-base line-clamp-2 leading-snug group-hover:text-blue-900 transition-colors mb-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Actions footer wrapper */}
                  <div className="px-6 pb-6 pt-3 border-t border-slate-100/50 flex items-center justify-between bg-white/70">
                    <span className="font-mono text-[10px] text-gray-400 uppercase font-semibold">
                      {post.readTime}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <a 
                        href={`/blog/${post.slug}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 text-slate-400 hover:text-blue-950 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="View Published Link"
                      >
                        <Globe size={13} />
                      </a>
                      <button
                        onClick={() => handleStartEdit(post)}
                        className="p-2 text-slate-500 hover:text-amber-800 bg-amber-50/50 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Article Content"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.slug, post.title)}
                        className="p-2 text-slate-400 hover:text-red-700 bg-red-50/20 hover:bg-red-50 rounded-lg transition-colors cursor-pointer animate-none"
                        title="Delete Article"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      )}

    </div>
  );
}
