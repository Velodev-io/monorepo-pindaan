"use client";

import { useEffect, useState } from "react";
import { Star, Trash2, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface Review {
  id: string;
  name: string;
  email: string;
  location: string;
  rating: number;
  text: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const data = await apiClient("/reviews");
      setReviews(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    setIsDeleting(id);
    try {
      await apiClient(`/reviews/${id}`, {
        method: "DELETE"
      });
      setReviews(reviews.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsDeleting(null);
    }
  };

  const getSnippet = (text: string) => {
    const words = text.split(" ");
    if (words.length <= 10) return text;
    // Show start and end as requested by user
    return `${words.slice(0, 5).join(" ")} ... ${words.slice(-5).join(" ")}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-[#FF9933]" size={32} />
        <p className="text-zinc-500 font-medium">Loading testimonials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-8 rounded-3xl text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={40} />
        <h3 className="text-xl font-bold text-red-900 dark:text-red-400 mb-2">Error Loading Reviews</h3>
        <p className="text-red-700 dark:text-red-300/70 mb-6">{error}</p>
        <button 
          onClick={() => fetchReviews()}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition-colors font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white font-serif tracking-tight">Devotee Reviews</h1>
          <p className="text-zinc-500 mt-2 font-medium">Manage testimonials and sacred experiences shared by devotees.</p>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-2xl flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 shadow-sm">
          <MessageSquare className="text-zinc-400" size={18} />
          <span className="font-bold text-zinc-700 dark:text-zinc-300">{reviews.length} Reviews</span>
        </div>
      </div>

      <div className="grid gap-4">
        {reviews.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 p-12 rounded-[32px] border border-zinc-200 dark:border-zinc-800 text-center shadow-sm">
            <p className="text-zinc-400 font-medium">No reviews have been submitted yet.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div 
              key={review.id}
              className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-[#FF9933]/30 transition-all group flex flex-col md:flex-row gap-6 items-start md:items-center"
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1 text-[#FF9933]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-zinc-300 dark:text-zinc-700"} />
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-bold text-lg text-zinc-900 dark:text-white">{review.name}</h4>
                  <p className="text-xs text-[#FF9933] font-bold">{review.email} • {review.location}</p>
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 italic leading-relaxed">
                  "{getSnippet(review.text)}"
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                 <button
                  disabled={isDeleting === review.id}
                  onClick={() => handleDelete(review.id)}
                  className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                  title="Delete Review"
                >
                  {isDeleting === review.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
