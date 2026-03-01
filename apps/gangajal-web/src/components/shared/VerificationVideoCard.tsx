"use client";

import { ProofVideo, Order } from "@pinddaan/types";
import { Play, Clock, AlertCircle, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";

interface VerificationVideoCardProps {
    order: Order;
}

export default function VerificationVideoCard({ order }: VerificationVideoCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const proof = order.proofVideo;

    if (!proof || proof.status === "NOT_AVAILABLE") {
        return (
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Clock className="text-slate-300" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Verification Video</h3>
                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Your verification video is not available yet. Our team will prepare your Gangajal with care and reverence, and upload the video once the filling is complete.
                </p>
            </div>
        );
    }

    if (proof.status === "PROCESSING") {
        return (
            <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Loader2 className="text-amber-500 animate-spin" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Preparing Verification</h3>
                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Your Gangajal is being prepared and sealed with care. The verification video will appear here as soon as it is processed.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 group shadow-2xl border border-slate-200">
                {!isPlaying ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        {proof.thumbnailUrl ? (
                            <img src={proof.thumbnailUrl} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Video Thumbnail" />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-80" />
                        )}
                        <button 
                            onClick={() => setIsPlaying(true)}
                            className="w-20 h-20 bg-saffron text-white rounded-full flex items-center justify-center shadow-2xl transform transition-all hover:scale-110 active:scale-95 z-20"
                        >
                            <Play size={32} fill="currentColor" />
                        </button>
                        <div className="mt-4 text-white font-bold tracking-widest uppercase text-xs z-20">Watch Verification Video</div>
                    </div>
                ) : (
                    <video 
                        src={proof.videoUrl} 
                        controls 
                        autoPlay 
                        className="w-full h-full object-contain"
                    />
                )}

                {/* Secure Watermark Overlay */}
                <div className="absolute bottom-6 left-6 z-30 pointer-events-none">
                    <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-[10px] md:text-xs text-white/90 font-medium">
                        <span className="opacity-60 mr-2">PREPARED FOR:</span>
                        <span className="font-bold">{order.shippingAddress.name}</span>
                        <span className="mx-2 opacity-30">|</span>
                        <span className="opacity-60 mr-2">ORDER:</span>
                        <span className="font-bold">#{order.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-saffron/10 rounded-2xl flex items-center justify-center shrink-0">
                        <ShieldCheck className="text-saffron" size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-slate-900">Proof of Filling (Transparency)</h4>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                            This video is provided as a transparency measure. Every order is sourced, handled, and sealed with deep spiritual devotion and care.
                        </p>
                        {proof.recordedAt && (
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <Clock size={12} /> Recorded on {new Date(proof.recordedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
