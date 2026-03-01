"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Video, HelpCircle } from "lucide-react"

export default function ProofsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-orange-950 mb-2">Witness Proofs</h1>
          <p className="text-orange-900/60 font-medium">Download and view high-quality edited videos of your rituals.</p>
        </div>
      </div>

      <Card className="p-20 text-center border-dashed border-orange-200 bg-orange-50/20">
        <div className="max-w-xs mx-auto space-y-4 flex flex-col items-center">
            <Video className="w-12 h-12 text-orange-200" />
            <h3 className="text-xl font-bold text-orange-950 underline decoration-amber-500/30">Gallery Processing</h3>
            <p className="text-orange-900/60 text-sm italic">
                You currently have no completed ritual proofs ready for download. Our video editors are working on your latest Sankalp footage.
            </p>
        </div>
      </Card>
    </div>
  )
}
