"use client";

import { useEffect, useState } from "react";
import { 
  Location, 
  SERVICE_LABELS, 
  SERVICE_KEYS, 
  ServiceKey, 
  CreateLocationDto 
} from "@pinddaan/shared";
import { LocationService } from "@/services/location.service";
import { Plus, Edit2, Trash2, Check, X, AlertCircle } from "lucide-react";

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    description: "",
    image: "",
    isActive: true,
    services: [] as { service: ServiceKey; isPrimary: boolean; notes: string }[],
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await LocationService.getLocations();
      setLocations(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        name: location.name,
        state: location.state,
        description: location.description || "",
        image: location.image || "",
        isActive: location.isActive,
        services: location.services.map(s => ({
          service: s.service,
          isPrimary: s.isPrimary,
          notes: s.notes || "",
        })),
      });
    } else {
      setEditingLocation(null);
      setFormData({
        name: "",
        state: "",
        description: "",
        image: "",
        isActive: true,
        services: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleToggleService = (service: ServiceKey) => {
    setFormData(prev => {
      const exists = prev.services.find(s => s.service === service);
      if (exists) {
        return {
          ...prev,
          services: prev.services.filter(s => s.service !== service),
        };
      } else {
        return {
          ...prev,
          services: [...prev.services, { service, isPrimary: false, notes: "" }],
        };
      }
    });
  };

  const handleSetPrimary = (service: ServiceKey) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map(s => ({
        ...s,
        isPrimary: s.service === service,
      })),
    }));
  };

  const handleNoteChange = (service: ServiceKey, notes: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map(s => (s.service === service ? { ...s, notes } : s)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.services.length === 0) {
      alert("At least one service must be selected");
      return;
    }
    
    if (formData.services.length > 0 && !formData.services.find(s => s.isPrimary)) {
       // Auto-set the first one as primary if none selected, or alert
       // Based on rules: "Only one primary service allowed". If user didn't select, we can pick one or ask.
       // Let's pick the first one as default if none selected.
       formData.services[0].isPrimary = true;
    }

    try {
      if (editingLocation) {
        await LocationService.updateLocation(editingLocation.id, formData);
      } else {
        await LocationService.createLocation(formData as CreateLocationDto);
      }
      setIsModalOpen(false);
      fetchLocations();
    } catch (err: any) {
      alert(err.message || "Failed to save location");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this location?")) return;
    try {
      await LocationService.deleteLocation(id);
      fetchLocations();
    } catch (err: any) {
      alert(err.message || "Failed to delete location");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Locations & Rituals</h1>
          <p className="text-zinc-500 mt-1 text-sm">Manage religious sites and their supported services worldwide.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-all shadow-md shadow-amber-600/20 font-medium"
        >
          <Plus size={20} /> Add Location
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-4 font-semibold text-zinc-700 dark:text-zinc-300">Name & State</th>
                <th className="px-6 py-4 font-semibold text-zinc-700 dark:text-zinc-300">Services</th>
                <th className="px-6 py-4 font-semibold text-zinc-700 dark:text-zinc-300">Status</th>
                <th className="px-6 py-4 font-semibold text-zinc-700 dark:text-zinc-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {locations.map((loc) => (
                <tr key={loc.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
                        {loc.image ? (
                          <img 
                            src={loc.image} 
                            alt={loc.name} 
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <AlertCircle size={16} className="text-zinc-300" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 dark:text-white leading-tight">{loc.name}</div>
                        <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">{loc.state}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {loc.services.map((s) => (
                        <span 
                          key={s.id} 
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            s.isPrimary 
                              ? "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-500" 
                              : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                          } border`}
                        >
                          {SERVICE_LABELS[s.service]}
                          {s.isPrimary && " ★"}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      loc.isActive 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                        : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${loc.isActive ? "bg-green-500" : "bg-red-500"}`}></span>
                      {loc.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(loc)}
                        className="p-2 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(loc.id)}
                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {locations.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    No locations found. Start by adding one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-900 z-10">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {editingLocation ? "Edit Location" : "Add New Location"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Name</label>
                  <input
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. Varanasi"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">State</label>
                  <input
                    required
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. Uttar Pradesh"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Image URL</label>
                <input
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g. /images/vashik.png"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={3}
                  placeholder="Tell something about this ritual site..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Visible to Public (Active)
                </label>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2">Service Mapping</h3>
                
                {Object.entries(SERVICE_KEYS).map(([key, value]) => {
                  const serviceState = formData.services.find(s => s.service === value);
                  return (
                    <div key={key} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50/50 dark:bg-zinc-950/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={!!serviceState}
                            onChange={() => handleToggleService(value as ServiceKey)}
                            className="w-5 h-5 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{SERVICE_LABELS[value as ServiceKey]}</span>
                        </div>
                        
                        {serviceState && (
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-zinc-500">Primary?</label>
                            <input
                              type="radio"
                              name="primaryService"
                              checked={serviceState.isPrimary}
                              onChange={() => handleSetPrimary(value as ServiceKey)}
                              className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                            />
                          </div>
                        )}
                      </div>
                      
                      {serviceState && (
                        <input
                          value={serviceState.notes}
                          onChange={e => handleNoteChange(value as ServiceKey, e.target.value)}
                          placeholder="Specific notes for this service here (e.g. price variation, best time)"
                          className="w-full text-sm px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 pt-4 sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                   className="flex-1 px-6 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2.5 bg-zinc-900 dark:bg-amber-600 dark:hover:bg-amber-700 text-white rounded-xl font-bold shadow-lg shadow-zinc-900/20 dark:shadow-amber-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {editingLocation ? "Update Location" : "Save Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
