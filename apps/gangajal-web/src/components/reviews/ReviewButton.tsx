"use client";

import { useState } from "react";
import { X, Star, Loader2 } from "lucide-react";

export default function ReviewButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [rating, setRating] = useState(5);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    text: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3005/api/v1';
      const res = await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, rating })
      });
      
      if (res.ok) {
        setIsSuccess(true);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit review");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-8 py-4 bg-saffron/10 hover:bg-saffron/20 border border-saffron/30 text-saffron rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-saffron/5"
      >
        <span>Share Your Experience</span>
        <span className="text-lg">✨</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
            >
              <X size={20} />
            </button>

            {isSuccess ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-saffron/20 text-saffron rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🌿</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-serif">Thank You</h3>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  Your devotion means the world to us. Your review has been submitted for verification.
                </p>
                <button 
                  onClick={() => { setIsOpen(false); setIsSuccess(false); }}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-2 font-serif">Write a Review</h3>
                <p className="text-slate-400 text-sm mb-6">Share your experience with Hridganga.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-1 transition-colors ${rating >= star ? 'text-saffron' : 'text-slate-700 hover:text-slate-500'}`}
                        >
                          <Star size={28} fill={rating >= star ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-saffron/50 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-saffron/50 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Location</label>
                      <input 
                        required
                        type="text" 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-saffron/50 transition-colors"
                        placeholder="London, UK"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Experience</label>
                    <textarea 
                      required
                      value={formData.text}
                      onChange={(e) => setFormData({...formData, text: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-saffron/50 transition-colors min-h-[120px] resize-none"
                      placeholder="Tell us about the packaging, purity, and your spiritual experience..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-saffron hover:bg-saffron/90 text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-saffron/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                  >
                    {isSubmitting ? <><Loader2 size={18} className="animate-spin"/> Submitting...</> : "Submit Review"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
