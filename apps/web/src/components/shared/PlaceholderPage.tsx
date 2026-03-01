"use client"

import BackButton from "@/components/shared/BackButton"

interface PlaceholderPageProps {
  title: string
  subtitle: string
  content: string
}

export default function PlaceholderPage({ title, subtitle, content }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="bg-white border-b border-orange-100 py-16 mb-12">
        <div className="container mx-auto px-4 md:px-6">
          <BackButton className="mb-6" />
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-orange-950 mb-4 tracking-tight">{title}</h1>
          <p className="text-xl text-orange-900/60 font-medium max-w-2xl">{subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-white p-8 md:p-12 rounded-[40px] border border-orange-100 shadow-xl shadow-orange-900/5 max-w-4xl mx-auto">
          <div className="prose prose-orange lg:prose-xl">
            <p className="text-orange-900/80 leading-relaxed text-lg whitespace-pre-wrap">
              {content || "We are currently finalizing the sacred documentation for this section. Thank you for your patience as we prepare this resource for our global NRI community."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
