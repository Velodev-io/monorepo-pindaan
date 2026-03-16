"use client"

import { useEffect, useState } from "react";

export const Confetti = () => {
    const [pieces, setPieces] = useState<any[]>([]);

    useEffect(() => {
        const p = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: -10,
            size: Math.random() * 10 + 5,
            color: ['#FB923C', '#FACC15', '#22D3EE', '#FFFFFF'][Math.floor(Math.random() * 4)],
            delay: Math.random() * 5,
            duration: Math.random() * 3 + 2,
            rotation: Math.random() * 360
        }));
        setPieces(p);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            {pieces.map(p => (
                <div 
                    key={p.id}
                    className="absolute rounded-sm opacity-60"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}px`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        transform: `rotate(${p.rotation}deg)`,
                        animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards`
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes confetti-fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
};
