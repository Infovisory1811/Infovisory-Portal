import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, Star, Sparkles, MessageSquare } from 'lucide-react';
import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface Review {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar?: string;
}

const DEFAULT_REVIEWS: Review[] = [];

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0] ? parts[0][0].toUpperCase() : '?';
};

const getInitialsColor = (name: string) => {
  const colors = [
    'bg-blue-50 text-blue-700 border-blue-200',
    'bg-emerald-50 text-emerald-700 border-emerald-200',
    'bg-indigo-50 text-indigo-700 border-indigo-200',
    'bg-purple-50 text-purple-700 border-purple-200',
    'bg-amber-50 text-amber-700 border-amber-200',
    'bg-rose-50 text-rose-700 border-rose-200',
    'bg-sky-50 text-sky-700 border-sky-200',
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return colors[sum % colors.length];
};

export default function ReviewSlider() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [comment, setComment] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load reviews on mount
  useEffect(() => {
    console.log("[DEBUG] ReviewSlider: Configuring real-time snapshot subscription to 'reviews' database.");
    const reviewsCol = collection(db, 'reviews');
    const unsubscribe = onSnapshot(reviewsCol, (snapshot) => {
      const loaded: Review[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loaded.push({
          id: docSnap.id,
          name: data.name || '',
          role: data.role || '',
          comment: data.comment || '',
          rating: Number(data.rating) || 5,
          avatar: data.avatar || undefined,
        });
      });
      
      console.log(`[DEBUG] ReviewSlider: Snapshot update received. Loaded ${loaded.length} customized reviews.`);
      if (loaded.length > 0) {
        setReviews(loaded);
      } else {
        console.log("[DEBUG] ReviewSlider: Zero customized reviews returned. Displaying defaults.");
        setReviews(DEFAULT_REVIEWS);
      }
    }, (error) => {
      console.error("[DEBUG] ReviewSlider ERROR: Snapshot lookup failed on 'reviews'", error);
      handleFirestoreError(error, OperationType.LIST, 'reviews');
    });

    return () => {
      console.log("[DEBUG] ReviewSlider: Dismantling active snap trigger listener.");
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[DEBUG] ReviewSlider: Submitting a new review option.", { name, role, comment, rating, avatarUrl });

    if (!name.trim() || !role.trim() || !comment.trim()) {
      console.warn("[DEBUG] ReviewSlider: Validation empty properties checker warning context.");
      return;
    }

    const newId = `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newReview = {
      name: name.trim(),
      role: role.trim(),
      comment: comment.trim(),
      rating,
      avatar: avatarUrl.trim() || '',
      createdAt: new Date().toISOString()
    };

    try {
      console.log(`[DEBUG] ReviewSlider: Uploading lead review at ID: ${newId}.`);
      await setDoc(doc(db, 'reviews', newId), newReview);
      console.log("[DEBUG] ReviewSlider: Review details registered to Firestore successfully.");

      // Reset Form & Show Success Modal/Banner
      setName('');
      setRole('');
      setComment('');
      setAvatarUrl('');
      setRating(5);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3500);
    } catch (error) {
      console.error("[DEBUG] ReviewSlider ERROR: FireStore write request failed for reviews col", error);
      handleFirestoreError(error, OperationType.WRITE, 'reviews');
    }
  };

  // Show only 5-star reviews and list up to top 5
  const topFiveReviews = [...reviews]
    .filter(review => review.rating === 5)
    .slice(0, 5);

  return (
    <section className="py-24 bg-white" id="reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-4"
          >
            Founder Feedbacks
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 leading-tight">
            What founders say about us
          </h2>
          <p className="mt-4 text-gray-400 font-medium max-w-xl mx-auto text-sm">
            Read verified 5-star customer experiences below, or publish your own launch story.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Write a Review Frame */}
          <div className="lg:col-span-4 bg-white p-8 md:p-10 rounded-[32px] border border-blue-100 shadow-2xl shadow-blue-900/5 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/40 rounded-full blur-[40px] pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-6 pointer-events-none">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <MessageSquare size={18} />
              </div>
              <h3 className="text-lg font-bold text-blue-900">Share Your Experience</h3>
            </div>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="py-12 text-center"
                >
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Review Published!</h4>
                  <p className="text-sm text-gray-500 font-medium">
                    Thank you for contributing. If rated highly, your review will showcase on our home page feed.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="review-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6 relative z-10"
                >
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Full Name</label>
                    <input
                      required
                      type="text"
                      className="w-full border-b-2 border-gray-100 py-2.5 focus:border-blue-900 outline-none transition-all text-sm font-medium placeholder:text-gray-300 bg-transparent"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Role field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Company & Designation</label>
                    <input
                      required
                      type="text"
                      className="w-full border-b-2 border-gray-100 py-2.5 focus:border-blue-900 outline-none transition-all text-sm font-medium placeholder:text-gray-300 bg-transparent"
                      placeholder="e.g. Founder, Techflow"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>

                  {/* Profile Image URL field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Profile Image URL (Optional)</label>
                    <input
                      type="url"
                      className="w-full border-b-2 border-gray-100 py-2.5 focus:border-blue-900 outline-none transition-all text-sm font-medium placeholder:text-gray-300 bg-transparent"
                      placeholder="e.g. https://example.com/avatar.jpg"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                    />
                  </div>

                  {/* Rating selection field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((starValue) => (
                        <button
                          type="button"
                          key={starValue}
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="focus:outline-none transition-transform active:scale-90"
                        >
                          <Star
                             size={20}
                             className={`${
                               starValue <= (hoverRating ?? rating)
                                 ? 'fill-amber-400 text-amber-400'
                                 : 'text-gray-200'
                             } transition-colors cursor-pointer`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Review Message</label>
                    <textarea
                      required
                      rows={3}
                      className="w-full border-b-2 border-gray-100 py-2.5 focus:border-blue-900 outline-none transition-all text-sm font-medium placeholder:text-gray-300 resize-none bg-transparent"
                      placeholder="Share details of your experience working with us..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>

                  {/* Post button */}
                  <button
                    type="submit"
                    className="w-full bg-blue-900 hover:bg-blue-600 text-white py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all hover:shadow-lg active:scale-95 cursor-pointer"
                  >
                    Publish Review
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Active reviews feed list */}
          <div className="lg:col-span-8">
            <div className="max-h-[700px] overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-blue-100 scrollbar-track-transparent">
              <AnimatePresence initial={false}>
                {topFiveReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="p-8 md:p-10 rounded-[32px] bg-blue-50/50 border border-blue-50 flex flex-col items-start hover:shadow-xl hover:bg-white transition-all group relative overflow-hidden text-left"
                  >
                    <Quote className="text-blue-100/80 absolute top-8 right-8 pointer-events-none group-hover:opacity-20 transition-opacity" size={48} />
                    
                    {/* Stars visual */}
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={`${
                            i < review.rating 
                              ? 'fill-amber-400 text-amber-400' 
                              : 'text-gray-200'
                          }`} 
                        />
                      ))}
                    </div>

                    <p className="text-base text-gray-600 font-medium leading-relaxed mb-6 italic select-all">
                      "{review.comment}"
                    </p>

                    <div className="flex items-center gap-4 border-t border-blue-100/50 pt-6 w-full mt-auto">
                      {review.avatar ? (
                        <img 
                          src={review.avatar} 
                          alt={review.name} 
                          className="w-10 h-10 rounded-full border border-white shadow bg-gray-50 object-cover" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-xs select-none shadow-sm shrink-0 border-transparent ${getInitialsColor(review.name)}`}>
                          {getInitials(review.name)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-sm text-blue-900">{review.name}</div>
                        <div className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">{review.role}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {topFiveReviews.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-3xl">
                  <p className="text-gray-400 font-medium text-sm">No reviews yet. Be the first to share your workspace experience!</p>
                </div>
              )}
            </div>
            

          </div>

        </div>

      </div>
    </section>
  );
}
