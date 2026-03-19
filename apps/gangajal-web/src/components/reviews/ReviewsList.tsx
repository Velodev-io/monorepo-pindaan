"use client";

import { useEffect, useState } from "react";
import { Star, Loader2 } from "lucide-react";

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  createdAt: string;
}

export default function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3005/api/v1";
        const res = await fetch(`${apiUrl}/reviews/public`);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch reviews: ${res.status} ${errorText}`);
        }
        const data = await res.json();
        setReviews(data.data);
      } catch (err: any) {
        console.error("Error fetching public reviews:", err);
        setError(err.message || "Failed to fetch reviews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-saffron" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-900/10 rounded-[40px] border border-red-500/20">
        <p className="text-red-400 font-serif italic text-lg mb-2">Failed to load devotee experiences</p>
        <p className="text-slate-500 text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-xs text-saffron underline hover:text-saffron/80"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/20 rounded-[40px] border border-white/5">
        <p className="text-slate-400 font-serif italic text-lg">No devotee experiences shared yet. Be the first to share! ✨</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {reviews.map((review) => (
        <div 
          key={review.id}
          className="group bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-[40px] hover:border-saffron/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl flex flex-col justify-between h-full"
        >
          <div>
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  fill={i < review.rating ? "#FF9933" : "none"} 
                  className={i < review.rating ? "text-saffron" : "text-slate-700"} 
                />
              ))}
            </div>
            <p className="text-slate-300 text-lg leading-relaxed italic font-serif mb-8">
              "{review.text}"
            </p>
          </div>
          
          <div className="flex items-center gap-4 border-t border-white/5 pt-8">
            <div className="w-12 h-12 rounded-2xl bg-saffron/10 border border-saffron/20 flex items-center justify-center text-saffron font-bold text-sm">
              {getInitials(review.name)}
            </div>
            <div className="text-left">
              <p className="text-white font-bold tracking-tight">{review.name}</p>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em]">{review.location}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
