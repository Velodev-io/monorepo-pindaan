"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "../ui/Button"

interface BackButtonProps {
    className?: string;
    variant?: "default" | "outline" | "ghost" | "link";
    label?: string;
}

export default function BackButton({ className, variant = "ghost", label = "Back" }: BackButtonProps) {
    const router = useRouter();

    return (
        <Button 
            variant={variant} 
            size="sm"
            onClick={() => router.back()}
            className={`flex items-center gap-2 group transition-all text-orange-950/70 hover:text-orange-950 ${className}`}
        >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">{label}</span>
        </Button>
    )
}
