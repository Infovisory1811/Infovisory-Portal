import React, { useState } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  X, 
  Check, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Search, 
  Compass, 
  Layers,
  HelpCircle,
  HelpCircle as QuestionMark,
  CheckCircle2
} from 'lucide-react';
import { PricingPackage } from '../lib/pricingService';
import { useServices, ServiceCategory, SubService } from '../context/ServicesContext';

interface PricingManagerProps {
  selectedServiceId: string;
  setSelectedServiceId: (id: string) => void;
  editablePackages: PricingPackage[];
  setEditablePackages: React.Dispatch<React.SetStateAction<PricingPackage[]>>;
  isSavingPricing: boolean;
  pricingSaveSuccess: boolean;
  handleSavePricing: () => void;
  handleUpdatePackageField: (pkgIndex: number, field: keyof PricingPackage, value: any) => void;
  handleUpdateFeature: (pkgIndex: number, featureIndex: number, newValue: string) => void;
  handleAddFeature: (pkgIndex: number) => void;
  handleRemoveFeature: (pkgIndex: number, featureIndex: number) => void;
  handleAddPackage: () => void;
  handleRemovePackage: (pkgIndex: number) => void;
}

export default function PricingManager({
  selectedServiceId,
  setSelectedServiceId,
  editablePackages,
  isSavingPricing,
  pricingSaveSuccess,
  handleSavePricing,
  handleUpdatePackageField,
  handleUpdateFeature,
  handleAddFeature,
  handleRemoveFeature,
  handleAddPackage,
  handleRemovePackage
}: PricingManagerProps) {
  const [serviceSearch, setServiceSearch] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const { services, saveCategory } = useServices();
  const [isDeletingFeature, setIsDeletingFeature] = useState(false);

  // Completely delete a service (feature) and update database
  const handleDeleteServiceCompletelyById = async (subId: string, subName: string, category: ServiceCategory) => {
    const confirmDelete = window.confirm(
      `Are you absolutely sure you want to completely delete "${subName}" from the "${category.name}" category? This will remove this feature/form entirely and permanently across the platform.`
    );
    if (!confirmDelete) return;

    setIsDeletingFeature(true);
    try {
      const updatedSubServices = (category.subServices || []).filter(s => s.id !== subId);
      const updatedCategory: ServiceCategory = {
        ...category,
        subServices: updatedSubServices
      };
      
      await saveCategory(updatedCategory);
      
      // If the currently selected service is the one being deleted, select another one
      if (selectedServiceId === subId) {
        if (updatedSubServices.length > 0) {
          setSelectedServiceId(updatedSubServices[0].id);
        } else {
          const anyOtherService = services
            .flatMap(c => c.id === category.id ? updatedSubServices : (c.subServices || []))
            .find(s => s.id !== subId);
          if (anyOtherService) {
            setSelectedServiceId(anyOtherService.id);
          } else {
            setSelectedServiceId('');
          }
        }
      }
    } catch (err) {
      console.error("Failed to delete service completely: ", err);
      alert("Failed to delete service. Please check your network connection and try again.");
    } finally {
      setIsDeletingFeature(false);
    }
  };

  // Flattened lists of services for helper searching
  const categories = services;
  const activeCategory = categories.find(c => c.id === activeCategoryFilter);
  
  const filteredServices = categories.map(cat => {
    // Only return matching services
    const matchingSubs = (cat.subServices || []).filter(sub => 
      sub.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      sub.description.toLowerCase().includes(serviceSearch.toLowerCase())
    );
    return {
      ...cat,
      subServices: matchingSubs
    };
  }).filter(cat => cat.subServices.length > 0 && (activeCategoryFilter === 'All' || cat.id === activeCategoryFilter));

  const currentService = services.flatMap(c => c.subServices || []).find(s => s.id === selectedServiceId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[500px]" id="pricing-manager-root">
      {/* LEFT COLUMN: Service Catalog Selector and Searching Indexes */}
      <div className="lg:col-span-1 bg-white p-6 rounded-[32px] border border-blue-50 shadow-sm flex flex-col h-[700px] overflow-hidden" id="services-search-rail">
        <h3 className="text-xl font-serif font-bold text-blue-950 mb-4 flex items-center gap-2">
          <Compass size={20} className="text-blue-900" />
          Solutions Index
        </h3>

        {/* Search Bar input */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search service/forms..."
            className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-900"
            value={serviceSearch}
            onChange={e => setServiceSearch(e.target.value)}
          />
        </div>

        {/* Category Filter Chips scroll row */}
        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-3 scrollbar-thin flex-wrap">
          <button
            onClick={() => setActiveCategoryFilter('All')}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeCategoryFilter === 'All'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-50 text-gray-500 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeCategoryFilter === cat.id
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-slate-50 text-gray-500 hover:bg-slate-100'
              }`}
            >
              {cat.shortName || cat.name}
            </button>
          ))}
        </div>

        {/* Scrollable list of services */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mt-2">
          {filteredServices.length > 0 ? (
            filteredServices.map(cat => (
              <div key={cat.id} className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-900 pl-1 block">
                  {cat.name}
                </span>
                <div className="space-y-1">
                  {cat.subServices.map(sub => {
                    const isSelected = selectedServiceId === sub.id;
                    return (
                      <div
                        key={sub.id}
                        className={`w-full group flex items-center justify-between p-3 rounded-xl transition-all border ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-100 text-blue-900'
                            : 'hover:bg-slate-50 border-transparent text-gray-700'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedServiceId(sub.id)}
                          className="flex-grow text-left min-w-0 pr-2 cursor-pointer"
                        >
                          <p className="text-xs font-bold leading-tight truncate">{sub.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">{sub.description}</p>
                        </button>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteServiceCompletelyById(sub.id, sub.name, cat);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title={`Completely delete ${sub.name}`}
                          >
                            <Trash2 size={13} />
                          </button>
                          <ArrowRight size={12} className={`opacity-0 group-hover:opacity-100 transition-all ${isSelected ? 'opacity-100 text-blue-900' : 'text-gray-400'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-xs text-gray-400 font-medium">No corporate services matched.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Editor Sheet */}
      <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-[32px] border border-blue-50 shadow-sm flex flex-col h-[700px] overflow-hidden" id="pricing-editor-cabinet">
        {currentService ? (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header: Service Details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">{currentService.id} identifier</span>
                <h4 className="text-2xl font-serif font-bold text-blue-950 mt-1.5">{currentService.name}</h4>
                <p className="text-xs text-gray-400 mt-1 font-medium">{currentService.description}</p>
              </div>

              {/* Action controller: Save packages to Cloud DB */}
              <div className="flex gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  disabled={isDeletingFeature}
                  onClick={() => {
                    const cat = services.find(c => (c.subServices || []).some(s => s.id === currentService.id));
                    if (cat) {
                      handleDeleteServiceCompletelyById(currentService.id, currentService.name, cat);
                    }
                  }}
                  className="px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer hover:scale-[1.02]"
                  title="Completely delete this feature from the entire portal"
                >
                  {isDeletingFeature ? (
                    <>
                      <span className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-1" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Delete Feature
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isSavingPricing}
                  onClick={handleSavePricing}
                  className={`px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                    pricingSaveSuccess 
                      ? 'bg-emerald-600 text-white shadow-emerald-600/10'
                      : 'bg-blue-900 text-white hover:bg-blue-950 shadow-blue-900/10 hover:scale-[1.02]'
                  }`}
                >
                  {isSavingPricing ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                      Saving changes...
                    </>
                  ) : pricingSaveSuccess ? (
                    <>
                      <Check size={14} />
                      Saved Successfully!
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Save Pricing Layout
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Scrollable package columns cards panel */}
            <div className="flex-1 overflow-y-auto pt-6 pb-12 space-y-6 pr-1">
              {pricingSaveSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in shadow-sm">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  Prices have been synchronized. Customers searching or visiting the '{currentService.name}' service page will immediately see these updated plans listed live!
                </div>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {editablePackages.map((pkg, pIdx) => {
                  return (
                    <div 
                      key={pIdx} 
                      className={`relative p-6 rounded-3xl border flex flex-col transition-all ${
                        pkg.isPopular 
                          ? 'border-blue-300 ring-2 ring-blue-500/20 bg-blue-50/10' 
                          : 'border-slate-100 bg-white'
                      }`}
                    >
                      {/* Delete Package Layer */}
                      <button
                        type="button"
                        onClick={() => handleRemovePackage(pIdx)}
                        className="absolute top-4 right-4 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Entire Plan Column"
                      >
                        <Trash2 size={14} />
                      </button>

                      {/* Package Name Input */}
                      <div className="mb-4">
                        <label className="text-[9px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                          Tier Plan Header
                        </label>
                        <input
                          type="text"
                          value={pkg.name}
                          onChange={e => handleUpdatePackageField(pIdx, 'name', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-blue-950 focus:outline-none focus:border-blue-900"
                          placeholder="e.g. Starter Gold"
                        />
                      </div>

                      {/* Package Price Input */}
                      <div className="mb-4">
                        <label className="text-[9px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                          Price / Filing Charges (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">₹</span>
                          <input
                            type="text"
                            value={pkg.price}
                            onChange={e => handleUpdatePackageField(pIdx, 'price', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-7 pr-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-900"
                            placeholder="e.g. 4,999"
                          />
                        </div>
                        <span className="text-[9px] text-gray-400 mt-0.5 block font-medium">Exclude ₹ symbol. Write rates as '4,999' or 'Free'.</span>
                      </div>

                      {/* Toggle Most Popular Flag */}
                      <div className="mb-6 flex items-center justify-between bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider inline-flex items-center gap-1">
                          <Flame size={12} className={pkg.isPopular ? "text-amber-500" : "text-gray-300"} />
                          Recommend Best Value
                        </span>
                        <input
                          type="checkbox"
                          checked={!!pkg.isPopular}
                          onChange={e => handleUpdatePackageField(pIdx, 'isPopular', e.target.checked)}
                          className="w-4 h-4 rounded text-blue-900 focus:ring-blue-900 border-gray-300 cursor-pointer"
                        />
                      </div>

                      {/* Package Highlights Features Editor list */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                            Included Highlights List
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAddFeature(pIdx)}
                            className="text-[9px] text-blue-900 font-extrabold flex items-center gap-0.5 hover:underline cursor-pointer"
                          >
                            <Plus size={10} /> Add Feature Line
                          </button>
                        </div>

                        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                          {pkg.features && pkg.features.length > 0 ? (
                            pkg.features.map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={feat}
                                  onChange={e => handleUpdateFeature(pIdx, fIdx, e.target.value)}
                                  className="flex-1 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-[11px] text-gray-600 focus:outline-none focus:border-blue-900 font-medium"
                                  placeholder="Package feature details..."
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFeature(pIdx, fIdx)}
                                  className="text-gray-300 hover:text-red-500 p-1 cursor-pointer"
                                  title="Remove feature tag item"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-[10px] text-gray-300 italic py-2">No highlight features. Add one above.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Card Template: Click to append a Package Offer Column */}
                <button
                  type="button"
                  onClick={handleAddPackage}
                  className="p-6 rounded-3xl border border-dashed border-gray-200 bg-slate-50/50 hover:bg-blue-50/10 hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer min-h-[300px]"
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-gray-200 group-hover:border-blue-200 flex items-center justify-center text-blue-900 group-hover:bg-blue-50 transition-all mb-4 shadow-sm">
                    <Plus size={20} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-blue-950">Add Pricing Package</span>
                  <span className="text-[10px] text-gray-400 font-medium max-w-xs mt-1">Create an extra tiered package offering card for this specific filing solution.</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-12">
            <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
              <Compass size={28} />
            </div>
            <h4 className="text-2xl font-serif font-bold text-blue-950 mb-2">Service Pricing Portal</h4>
            <p className="text-gray-400 text-sm font-medium max-w-sm">
              Select any solution or corporate registration from the catalog index sidebar to modify its packages, filing charges, and core parameters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
