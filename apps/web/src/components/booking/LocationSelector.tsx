"use client";

import { useEffect, useState } from "react";
import { ServiceKey, SERVICE_LABELS, MultiLocationResponse } from "@pinddaan/shared";
import { LocationService } from "@/services/location.service";
import { MapPin, CheckCircle2, AlertCircle, Info } from "lucide-react";

export type SelectionData = {
  type: "common" | "individual";
  commonLocationId?: string;
  individualSelections?: Record<ServiceKey, string>;
};

interface LocationSelectorProps {
  selectedServices: ServiceKey[];
  onSelectionChange: (selection: SelectionData | null) => void;
}

export default function LocationSelector({ selectedServices, onSelectionChange }: LocationSelectorProps) {
  const [data, setData] = useState<MultiLocationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectionType, setSelectionType] = useState<"common" | "individual" | null>(null);
  const [commonLocationId, setCommonLocationId] = useState<string>("");
  const [individualSelections, setIndividualSelections] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedServices.length > 0) {
      fetchLocations();
    }
  }, [selectedServices]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await LocationService.getMultiServiceLocations(selectedServices);
      setData(res.data);
      
      // Reset selections when services change
      setSelectionType(null);
      setCommonLocationId("");
      setIndividualSelections({});
      onSelectionChange(null);
    } catch (err: any) {
      setError(err.message || "Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCommon = (id: string) => {
    setSelectionType("common");
    setCommonLocationId(id);
    setIndividualSelections({});
    onSelectionChange({ type: "common", commonLocationId: id });
  };

  const handleSelectIndividual = (service: ServiceKey, locationId: string) => {
    setSelectionType("individual");
    setCommonLocationId("");
    const newSelections = { ...individualSelections, [service]: locationId };
    setIndividualSelections(newSelections);
    
    // Validate if all services have a location selected
    const allSelected = selectedServices.every(sk => sk === service || !!individualSelections[sk]);
    if (allSelected) {
      onSelectionChange({ type: "individual", individualSelections: newSelections as Record<ServiceKey, string> });
    } else {
      onSelectionChange(null);
    }
  };

  if (selectedServices.length === 0) return null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-4">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-medium">Finding best locations for your rituals...</p>
        </div>
      ) : error ? (
        <div className="p-5 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-3">
          <AlertCircle size={22} className="shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      ) : (
        <>
          {/* Debug Info in Console */}
          {(() => {
            console.log("[DEBUG] LocationSelector - Selected Services:", selectedServices);
            console.log("[DEBUG] LocationSelector - API Response Data:", data);
            return null;
          })()}

          {/* Fallback if no locations found at all */}
          {(!data || ((data.commonLocations?.length === 0) && Object.values(data.serviceLocations || {}).every((arr: any) => !arr || arr.length === 0))) && (
            <div className="flex flex-col items-center justify-center p-12 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200 text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="text-zinc-300" size={32} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">No sacred locations available</h3>
              <p className="text-zinc-500 max-w-xs mt-2">
                We couldn't find any locations matching your selected rituals. Please try a different combination or contact support.
              </p>
            </div>
          )}

          {/* Section 1: Common Locations (Only for multiple services) */}
          {data?.commonLocations && data.commonLocations.length > 0 && selectedServices.length > 1 && (
            <div className={`space-y-6 transition-all duration-300 ${selectionType === 'individual' ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="text-amber-600" size={24} />
                  <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">
                    Perform All Rituals in One City
                  </h3>
                </div>
                <p className="text-zinc-500 max-w-2xl">
                  Save time and travel. These cities are fully equipped to handle all your selected rituals consecutively.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.commonLocations.map((loc: any) => (
                  <button
                    key={loc.id}
                    onClick={() => handleSelectCommon(loc.id)}
                    className={`group relative p-6 text-left rounded-3xl border-2 transition-all duration-300 hover:shadow-lg active:scale-[0.98] ${
                      commonLocationId === loc.id
                        ? "border-amber-500 bg-amber-50/30 ring-4 ring-amber-500/10"
                        : "border-zinc-100 bg-white hover:border-amber-200"
                    }`}
                  >
                    <div className={`absolute top-5 right-5 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                      commonLocationId === loc.id ? 'bg-amber-500 border-amber-500' : 'border-zinc-200 group-hover:border-amber-300'
                    }`}>
                      {commonLocationId === loc.id && <CheckCircle2 className="text-white" size={18} />}
                    </div>
                    
                    <h4 className="text-xl font-extrabold text-zinc-900 mb-1">{loc.name}</h4>
                    <span className="inline-block px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                      {loc.state}
                    </span>
                  </button>
                ))}
              </div>

              {selectionType === 'common' && (
                <div className="p-4 bg-amber-100/50 rounded-2xl border border-amber-200 flex items-start gap-4">
                  <div className="p-2 bg-amber-500 rounded-full text-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-amber-900 font-bold">Smart Selection Locked</p>
                    <p className="text-sm text-amber-800/80">
                      All selected rituals will be performed at <span className="font-bold">
                        {data.commonLocations.find((l: any) => l.id === commonLocationId)?.name}
                      </span>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Divider if both sections present */}
          {data?.commonLocations && data.commonLocations.length > 0 && selectedServices.length > 1 && (
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-zinc-100"></div>
              <span className="flex-shrink mx-4 text-zinc-400 font-bold text-xs uppercase tracking-widest bg-white px-2">OR SELECT INDIVIDUALLY</span>
              <div className="flex-grow border-t border-zinc-100"></div>
            </div>
          )}

          {/* Section 2: Individual Selection */}
          <div className={`space-y-12 transition-all duration-300 ${selectionType === 'common' ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            {selectedServices.map((sk) => (
              <div key={sk} className="space-y-5">
                <div className="space-y-1">
                  <h4 className="text-lg font-extrabold text-zinc-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center text-sm">
                      {selectedServices.indexOf(sk) + 1}
                    </span>
                    Location for {SERVICE_LABELS[sk]}
                  </h4>
                  <p className="text-sm text-zinc-500">Select where you want to perform this specific ritual.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data?.serviceLocations[sk]?.map((loc: any) => (
                    <button
                      key={loc.id}
                      onClick={() => handleSelectIndividual(sk, loc.id)}
                      className={`relative p-5 text-left rounded-2xl border-2 transition-all duration-300 active:scale-[0.98] ${
                        individualSelections[sk] === loc.id
                          ? "border-zinc-900 bg-zinc-900 shadow-xl shadow-zinc-900/20 translate-y-[-2px]"
                          : "border-zinc-100 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <h5 className={`font-bold text-base ${individualSelections[sk] === loc.id ? 'text-white' : 'text-zinc-900'}`}>
                        {loc.name}
                      </h5>
                      <p className={`text-xs mt-0.5 ${individualSelections[sk] === loc.id ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {loc.state}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {selectionType === 'individual' && (
              <div className="p-4 bg-zinc-900 text-white rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-full">
                  <Info size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold">Individual Itinerary Selection</p>
                  <p className="text-sm text-zinc-400">
                    Each ritual will be performed at its respective chosen location.
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
