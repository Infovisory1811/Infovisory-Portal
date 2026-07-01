import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Layers, 
  FolderPlus, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle, 
  HelpCircle,
  FolderOpen,
  PlusCircle,
  Check,
  ChevronRight,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import { useServices, ServiceCategory, SubService, CategoryGroup, ICON_MAP } from '../context/ServicesContext';

export default function ServicesManager() {
  const { services, saveCategory, deleteCategory, seedDefaultData } = useServices();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('entrepreneur');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states for creating/editing a Category
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [catId, setCatId] = useState('');
  const [catName, setCatName] = useState('');
  const [catShortName, setCatShortName] = useState('');
  const [catIcon, setCatIcon] = useState('Rocket');
  const [catOrder, setCatOrder] = useState(1);
  const [catGroups, setCatGroups] = useState<CategoryGroup[]>([]);
  const [catSubServices, setCatSubServices] = useState<SubService[]>([]);

  // Auto-load selected category details when the services catalog is loaded
  useEffect(() => {
    if (services.length > 0 && !catId && !isCreatingNew) {
      const defaultCat = services.find(c => c.id === selectedCategoryId) || services[0];
      if (defaultCat) {
        setSelectedCategoryId(defaultCat.id);
        loadCategoryForEdit(defaultCat);
      }
    }
  }, [services, selectedCategoryId, catId, isCreatingNew]);

  // Sub-Service Inline editor states
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [subId, setSubId] = useState('');
  const [subName, setSubName] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subGroupId, setSubGroupId] = useState('');

  // Group Inline Editor states
  const [groupEditingId, setGroupEditingId] = useState<string | null>(null);
  const [groupIdVal, setGroupIdVal] = useState('');
  const [groupNameVal, setGroupNameVal] = useState('');

  const selectedCategory = services.find(c => c.id === selectedCategoryId);

  // Load category details into states for editing
  const loadCategoryForEdit = (category: ServiceCategory) => {
    setIsCreatingNew(false);
    setCatId(category.id);
    setCatName(category.name);
    setCatShortName(category.shortName || '');
    setCatIcon(category.iconName || 'Rocket');
    setCatOrder(category.order || 1);
    setCatGroups(category.groups || []);
    setCatSubServices(category.subServices || []);
    setEditingSubId(null);
    setGroupEditingId(null);
  };

  // Switch category selection
  const handleSelectCategory = (id: string) => {
    setSelectedCategoryId(id);
    const cat = services.find(c => c.id === id);
    if (cat) {
      loadCategoryForEdit(cat);
    }
  };

  // Start creating new Category
  const handleStartNewCategory = () => {
    setIsCreatingNew(true);
    setCatId('');
    setCatName('');
    setCatShortName('');
    setCatIcon('Rocket');
    setCatOrder(services.length + 1);
    setCatGroups([]);
    setCatSubServices([]);
    setEditingSubId(null);
    setGroupEditingId(null);
  };

  // Add a group to current working category
  const handleAddGroup = () => {
    if (!groupIdVal.trim() || !groupNameVal.trim()) {
      alert('Please fill in both Group ID (slug) and Group Name.');
      return;
    }
    const cleanId = groupIdVal.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (catGroups.some(g => g.id === cleanId)) {
      alert('A group with this ID already exists.');
      return;
    }
    setCatGroups([...catGroups, { id: cleanId, name: groupNameVal.trim() }]);
    setGroupIdVal('');
    setGroupNameVal('');
  };

  // Remove group
  const handleRemoveGroup = (id: string) => {
    setCatGroups(catGroups.filter(g => g.id !== id));
    // Reset group associations on sub-services
    setCatSubServices(catSubServices.map(s => s.groupId === id ? { ...s, groupId: '' } : s));
  };

  // Add or Edit a Sub-Service (Feature) & Auto-save directly to live database
  const handleSaveSubService = async () => {
    if (!subId.trim() || !subName.trim() || !subDesc.trim()) {
      alert('Please fill in Sub-Service ID, Name, and Description.');
      return;
    }
    const cleanId = subId.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    let updatedSubServices = [...catSubServices];

    if (editingSubId === 'new') {
      // Create new sub-service
      if (catSubServices.some(s => s.id === cleanId)) {
        alert('A sub-service with this ID already exists in this category.');
        return;
      }
      const newSub: SubService = {
        id: cleanId,
        name: subName.trim(),
        description: subDesc.trim(),
        groupId: subGroupId || undefined
      };
      updatedSubServices = [...catSubServices, newSub];
    } else {
      // Edit existing
      updatedSubServices = catSubServices.map(s => s.id === editingSubId ? {
        id: editingSubId,
        name: subName.trim(),
        description: subDesc.trim(),
        groupId: subGroupId || undefined
      } : s);
    }

    setCatSubServices(updatedSubServices);

    // Reset inline sub-service form
    setEditingSubId(null);
    setSubId('');
    setSubName('');
    setSubDesc('');
    setSubGroupId('');

    // If editing existing category, auto-sync directly to live Firestore
    if (!isCreatingNew && catId) {
      setIsSaving(true);
      try {
        const updatedCategory: ServiceCategory = {
          id: catId,
          name: catName.trim(),
          shortName: catShortName.trim() || undefined,
          iconName: catIcon,
          order: Number(catOrder) || 1,
          groups: catGroups.length > 0 ? catGroups : undefined,
          subServices: updatedSubServices
        };
        await saveCategory(updatedCategory);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } catch (err) {
        console.error('Failed to sync feature details to live database:', err);
        alert('Saved locally. Click "Save Category" at the top to commit changes to the live database.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Start new sub-service creation mode
  const handleStartNewSubService = () => {
    setEditingSubId('new');
    setSubId('');
    setSubName('');
    setSubDesc('');
    setSubGroupId(catGroups[0]?.id || '');
  };

  // Start editing existing sub-service
  const handleStartEditSubService = (sub: SubService) => {
    setEditingSubId(sub.id);
    setSubId(sub.id);
    setSubName(sub.name);
    setSubDesc(sub.description);
    setSubGroupId(sub.groupId || '');
  };

  // Delete sub-service (Feature) completely & Auto-save to live database
  const handleDeleteSubService = async (id: string) => {
    const targetFeature = catSubServices.find(s => s.id === id);
    const featureName = targetFeature ? targetFeature.name : 'this feature';
    
    if (!window.confirm(`Are you absolutely sure you want to completely remove the feature "${featureName}"? This will delete it completely and sync live.`)) {
      return;
    }

    const updatedSubServices = catSubServices.filter(s => s.id !== id);
    setCatSubServices(updatedSubServices);

    // If editing existing category, auto-sync directly to live Firestore
    if (!isCreatingNew && catId) {
      setIsSaving(true);
      try {
        const updatedCategory: ServiceCategory = {
          id: catId,
          name: catName.trim(),
          shortName: catShortName.trim() || undefined,
          iconName: catIcon,
          order: Number(catOrder) || 1,
          groups: catGroups.length > 0 ? catGroups : undefined,
          subServices: updatedSubServices
        };
        await saveCategory(updatedCategory);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } catch (err) {
        console.error('Failed to sync deletion to live database:', err);
        alert('Could not synchronize to live database automatically. Click "Save Category" at the top to force sync.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Save the complete Category to Firestore
  const handleSaveCompleteCategory = async () => {
    if (!catId.trim() || !catName.trim()) {
      alert('Please fill in Category ID and Category Name.');
      return;
    }

    const cleanId = catId.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    const updatedCategory: ServiceCategory = {
      id: cleanId,
      name: catName.trim(),
      shortName: catShortName.trim() || undefined,
      iconName: catIcon,
      order: Number(catOrder) || 1,
      groups: catGroups.length > 0 ? catGroups : undefined,
      subServices: catSubServices
    };

    setIsSaving(true);
    try {
      await saveCategory(updatedCategory);
      setSaveSuccess(true);
      setIsCreatingNew(false);
      setSelectedCategoryId(cleanId);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save category:', err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      alert(`An error occurred while saving. Details: ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete category from Firestore
  const handleDeleteCategoryClick = async (id: string) => {
    try {
      await deleteCategory(id);
      // Select first remaining category
      const remaining = services.filter(c => c.id !== id);
      if (remaining.length > 0) {
        handleSelectCategory(remaining[0].id);
      } else {
        handleStartNewCategory();
      }
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete category:', err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      alert(`Failed to delete category. Details: ${errorMsg}`);
    }
  };

  // Rearrange order helpers
  const handleMoveUp = async (category: ServiceCategory) => {
    const idx = services.findIndex(c => c.id === category.id);
    if (idx <= 0) return;
    
    const prevCat = services[idx - 1];
    const prevOrder = prevCat.order || 0;
    const currOrder = category.order || 0;

    // Swap order
    await saveCategory({ ...category, order: prevOrder });
    await saveCategory({ ...prevCat, order: currOrder });
  };

  const handleMoveDown = async (category: ServiceCategory) => {
    const idx = services.findIndex(c => c.id === category.id);
    if (idx < 0 || idx >= services.length - 1) return;

    const nextCat = services[idx + 1];
    const nextOrder = nextCat.order || 0;
    const currOrder = category.order || 0;

    // Swap order
    await saveCategory({ ...category, order: nextOrder });
    await saveCategory({ ...nextCat, order: currOrder });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="services-manager-root">
      
      {/* Left Rail: List of Categories */}
      <div className="lg:col-span-1 bg-white p-6 rounded-[32px] border border-blue-50 shadow-sm flex flex-col min-h-[600px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-serif font-bold text-blue-950 flex items-center gap-2">
            <Layers size={18} className="text-blue-900" />
            Website Features
          </h3>
          <button
            onClick={handleStartNewCategory}
            className="p-2 bg-blue-50 text-blue-900 hover:bg-blue-600 hover:text-white transition-all rounded-xl"
            title="Create New Feature Category"
          >
            <FolderPlus size={18} />
          </button>
        </div>

        <div className="space-y-2 flex-grow overflow-y-auto max-h-[500px] pr-1">
          {services.map((cat, idx) => {
            const isSelected = !isCreatingNew && cat.id === selectedCategoryId;
            return (
              <div 
                key={cat.id} 
                className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isSelected 
                    ? 'bg-blue-900/5 border-blue-200 text-blue-950 font-black shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-100 text-gray-700'
                }`}
              >
                <button
                  onClick={() => handleSelectCategory(cat.id)}
                  className="flex-grow text-left text-sm font-bold truncate cursor-pointer uppercase tracking-wider"
                >
                  {cat.name}
                </button>

                <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveUp(cat)}
                    className="p-1 text-gray-400 hover:text-blue-900 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    disabled={idx === services.length - 1}
                    onClick={() => handleMoveDown(cat)}
                    className="p-1 text-gray-400 hover:text-blue-900 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown size={13} />
                  </button>
                  
                  {deleteConfirmId === cat.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDeleteCategoryClick(cat.id)}
                        className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded text-[10px]"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(cat.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete category"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset / Seeder Button */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to restore the default features list? This will overwrite existing customized modifications.')) {
                await seedDefaultData();
                alert('Website default compliance features reset and seeded successfully.');
              }
            }}
            className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
          >
            Reset to Standard Data
          </button>
        </div>
      </div>

      {/* Right Column: Category & Nested Sub-Services editor */}
      <div className="lg:col-span-3 space-y-8">
        
        {/* SECTION 1: Category core configuration */}
        <div className="bg-white p-8 rounded-[32px] border border-blue-50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-serif font-bold text-blue-950 flex items-center gap-2">
              <Edit3 size={20} className="text-blue-900" />
              {isCreatingNew ? 'Create Website Category' : `Configure Category: ${catName}`}
            </h3>
            
            <button
              onClick={handleSaveCompleteCategory}
              disabled={isSaving}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save size={15} />
                  Save Category
                </>
              )}
            </button>
          </div>

          {saveSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center gap-2 text-sm font-bold">
              <CheckCircle size={18} className="text-emerald-600 animate-bounce" />
              Category details and sub-services successfully saved to live database.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Category ID (Unique slug)</label>
              <input
                type="text"
                disabled={!isCreatingNew}
                value={catId}
                onChange={(e) => setCatId(e.target.value)}
                placeholder="e.g. registrations, return-filings"
                className="w-full px-4.5 py-3 border border-slate-200 rounded-2xl text-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900/30 font-semibold text-gray-800 disabled:bg-slate-50 disabled:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Category Name (Publicly displayed)</label>
              <input
                type="text"
                value={catName}
                onChange={(e) => {
                  setCatName(e.target.value);
                  if (isCreatingNew && !catId) {
                    setCatId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                  }
                }}
                placeholder="e.g. Income Tax Returns"
                className="w-full px-4.5 py-3 border border-slate-200 rounded-2xl text-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900/30 font-semibold text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Short/Navbar Name (Optional)</label>
              <input
                type="text"
                value={catShortName}
                onChange={(e) => setCatShortName(e.target.value)}
                placeholder="e.g. Income Tax"
                className="w-full px-4.5 py-3 border border-slate-200 rounded-2xl text-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900/30 font-semibold text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Menu Icon Type</label>
              <select
                value={catIcon}
                onChange={(e) => setCatIcon(e.target.value)}
                className="w-full px-4.5 py-3 border border-slate-200 bg-white rounded-2xl text-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900/30 font-semibold text-gray-800"
              >
                {Object.keys(ICON_MAP).map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: Sub-Groups Headers Layout */}
        <div className="bg-white p-8 rounded-[32px] border border-blue-50 shadow-sm">
          <h3 className="text-xl font-serif font-bold text-blue-950 mb-2 flex items-center gap-2">
            <Layers size={18} className="text-blue-900" />
            Dropdown Mega-Menu Headers (Groups)
          </h3>
          <p className="text-sm text-gray-400 mb-6 font-medium">
            For large categories (like Registrations and Compliances), create group headers to render sub-services in multiple organized columns.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
            <div className="md:col-span-4">
              <input
                type="text"
                placeholder="Group ID (slug, e.g. tax-reg)"
                value={groupIdVal}
                onChange={(e) => setGroupIdVal(e.target.value)}
                className="w-full px-4.5 py-3 border border-slate-200 rounded-2xl text-sm font-semibold text-gray-800"
              />
            </div>
            <div className="md:col-span-5">
              <input
                type="text"
                placeholder="Group Display Name (e.g. Tax Registrations)"
                value={groupNameVal}
                onChange={(e) => setGroupNameVal(e.target.value)}
                className="w-full px-4.5 py-3 border border-slate-200 rounded-2xl text-sm font-semibold text-gray-800"
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="button"
                onClick={handleAddGroup}
                className="w-full h-full py-3 bg-blue-50 text-blue-900 hover:bg-blue-900 hover:text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                Add Header
              </button>
            </div>
          </div>

          {catGroups.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {catGroups.map((g) => (
                <div key={g.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700">
                  <span>{g.name} <span className="text-gray-300">({g.id})</span></span>
                  <button
                    onClick={() => handleRemoveGroup(g.id)}
                    className="text-gray-400 hover:text-red-600 ml-1"
                    title="Remove Header"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs font-medium text-gray-400">
              No custom headers configured. Nested sub-services will display as a single unified vertical layout.
            </div>
          )}
        </div>

        {/* SECTION 3: Sub-Services / Features List & Form */}
        <div className="bg-white p-8 rounded-[32px] border border-blue-50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-serif font-bold text-blue-950 flex items-center gap-2">
              <FolderOpen size={18} className="text-blue-900" />
              Nested Sub-Services / Features List ({catSubServices.length})
            </h3>
            
            {editingSubId === null && (
              <button
                type="button"
                onClick={handleStartNewSubService}
                className="py-2 px-4.5 bg-blue-50 text-blue-900 hover:bg-blue-900 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle size={15} />
                Add New Sub-Service
              </button>
            )}
          </div>

          {/* Sub-Service Creator/Editor Form */}
          {editingSubId !== null && (
            <div className="p-6 bg-blue-50/30 rounded-3xl border border-blue-100/50 mb-8 space-y-4">
              <h4 className="text-sm font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5 mb-2">
                <Sparkles size={14} />
                {editingSubId === 'new' ? 'New Sub-Service Configuration' : `Edit Sub-Service: ${subName}`}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1.5">ID (Unique slug)</label>
                  <input
                    type="text"
                    disabled={editingSubId !== 'new'}
                    value={subId}
                    onChange={(e) => setSubId(e.target.value)}
                    placeholder="e.g. pvt-ltd-registration"
                    className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-xs font-bold text-gray-700 disabled:bg-slate-100 disabled:text-gray-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1.5">Public Display Title</label>
                  <input
                    type="text"
                    value={subName}
                    onChange={(e) => {
                      setSubName(e.target.value);
                      if (editingSubId === 'new' && !subId) {
                        setSubId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                      }
                    }}
                    placeholder="e.g. Private Limited Company Incorporation"
                    className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-xs font-bold text-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1.5">Brief Summary Description</label>
                <textarea
                  value={subDesc}
                  onChange={(e) => setSubDesc(e.target.value)}
                  placeholder="e.g. The most secure legal vehicle for modern startup founders seeking private capital seed rounds."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-xs font-bold text-gray-700"
                />
              </div>

              {catGroups.length > 0 && (
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1.5">Menu Header Group Association</label>
                  <select
                    value={subGroupId}
                    onChange={(e) => setSubGroupId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-xs font-bold text-gray-700"
                  >
                    <option value="">-- No Group (Unassigned) --</option>
                    {catGroups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSubId(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSubService}
                  className="px-5 py-2 bg-blue-900 text-white hover:bg-blue-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1"
                >
                  <Check size={14} />
                  Keep Changes
                </button>
              </div>
            </div>
          )}

          {/* Sub-Services List */}
          <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
            {catSubServices.map((sub) => {
              const matchingGroup = catGroups.find(g => g.id === sub.groupId);
              return (
                <div 
                  key={sub.id} 
                  className="flex flex-col md:flex-row md:items-center justify-between p-4.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl gap-4 transition-all"
                >
                  <div className="space-y-1 min-w-0 flex-grow">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-blue-950">{sub.name}</span>
                      <span className="text-[10px] bg-white border border-slate-200 text-slate-400 font-bold px-2 py-0.5 rounded-lg font-mono">{sub.id}</span>
                      
                      {matchingGroup && (
                        <span className="text-[9px] bg-orange-50 border border-orange-100 text-orange-700 font-extrabold px-2 py-0.5 rounded-lg uppercase tracking-wider">
                          Header: {matchingGroup.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-medium">{sub.description}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => handleStartEditSubService(sub)}
                      className="p-2 bg-white text-gray-500 hover:text-blue-900 hover:border-blue-100 border border-slate-200 rounded-xl transition-all shadow-sm"
                      title="Edit details"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubService(sub.id)}
                      className="p-2 bg-white text-gray-500 hover:text-red-600 hover:border-red-100 border border-slate-200 rounded-xl transition-all shadow-sm"
                      title="Remove sub-service"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}

            {catSubServices.length === 0 && (
              <div className="p-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-[32px]">
                <Info size={28} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-semibold">No nested sub-services / features added to this category yet.</p>
                <p className="text-xs mt-1 text-slate-400">Click &quot;Add New Sub-Service&quot; to populate your dropdown list elements.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
