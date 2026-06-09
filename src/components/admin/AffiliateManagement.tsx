import React from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Tag, 
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Star,
  Check,
  X,
  PlusCircle,
  Briefcase,
  Image as ImageIcon,
  Camera,
  Loader2
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { apiService } from '../../services/api';
import { AffiliatePartner, AffiliateOffer, AffiliateCategory } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const AffiliateManagement = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [partners, setPartners] = React.useState<AffiliatePartner[]>([]);
  const [offers, setOffers] = React.useState<AffiliateOffer[]>([]);
  const [categories, setCategories] = React.useState<AffiliateCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  const [activeTab, setActiveTab] = React.useState<'partners' | 'offers' | 'categories'>('partners');
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Modal states
  const [showModal, setShowModal] = React.useState(false);
  const [modalType, setModalType] = React.useState<'partner' | 'offer' | 'category'>('partner');
  const [editItem, setEditItem] = React.useState<any>(null);
  const [submitting, setSubmitting] = React.useState(false);

  // File states
  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadedLogoUrl, setUploadedLogoUrl] = React.useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = React.useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [pData, oData, cData] = await Promise.all([
      adminService.getAffiliatePartners(),
      adminService.getAffiliateOffers(),
      adminService.getAffiliateCategories()
    ]);
    setPartners(pData);
    setOffers(oData);
    setCategories(cData);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Instant local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const url = await apiService.uploadFile(file);
      setUploadedLogoUrl(url);
      setLogoPreview(url);
      showToast('Image uploaded successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error uploading file', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, type: 'partner' | 'offer' | 'category') => {
    if (deletingItemId !== id) {
      setDeletingItemId(id);
      setTimeout(() => {
        setDeletingItemId(prev => prev === id ? null : prev);
      }, 3000);
      return;
    }

    setDeletingItemId(null);
    let success = false;
    if (type === 'partner') success = await adminService.deleteAffiliatePartner(id);
    else if (type === 'offer') success = await adminService.deleteAffiliateOffer(id);
    else success = await adminService.deleteAffiliateCategory(id);
    
    if (success) {
      showToast('Deleted successfully', 'success');
      fetchData();
    } else {
      showToast('Delete failed', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data: any = Object.fromEntries(formData.entries());
    
    try {
      // Use pre-uploaded URL if available
      if (uploadedLogoUrl) {
        data.logoUrl = uploadedLogoUrl;
      } else if (editItem?.logoUrl) {
        data.logoUrl = editItem.logoUrl;
      } else if (editItem?.partnerLogo) {
        data.logoUrl = editItem.partnerLogo;
      }

      // Handle specific fields
      if (modalType === 'offer') {
         data.rewardCoins = parseInt(data.rewardCoins);
         data.cashbackPercentage = parseFloat(data.cashbackPercentage);
         data.verificationDays = parseInt(data.verificationDays);
         data.isTrending = data.isTrending === 'on';
         data.isFeatured = data.isFeatured === 'on';
         if (data.requirements) {
            data.requirements = data.requirements.split('\n').filter((s: string) => s.trim());
         }
         
         const partner = partners.find(p => p.id === data.partnerId);
         if (partner) {
            data.partnerName = partner.name;
            data.partnerLogo = data.logoUrl || partner.logoUrl;
         }
      } else if (modalType === 'partner') {
         data.isActive = data.isActive === 'on';
         data.rating = parseFloat(data.rating);
      }

      let res: any;
      if (modalType === 'partner') res = await adminService.upsertAffiliatePartner({ ...editItem, ...data });
      else if (modalType === 'offer') res = await adminService.upsertAffiliateOffer({ ...editItem, ...data });
      else res = await adminService.upsertAffiliateCategory({ ...editItem, ...data });

      if (!res.error) {
        showToast('Saved successfully', 'success');
        setShowModal(false);
        fetchData();
      } else {
        showToast(res.error, 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = (type: 'partner' | 'offer' | 'category', item: any = null) => {
    setModalType(type);
    setEditItem(item);
    setLogoFile(null);
    const initialUrl = item?.logoUrl || item?.partnerLogo || null;
    setLogoPreview(initialUrl);
    setUploadedLogoUrl(initialUrl);
    setShowModal(true);
  };

  const filteredItems = () => {
    if (activeTab === 'partners') return partners.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (activeTab === 'offers') return offers.filter(o => o.title.toLowerCase().includes(searchTerm.toLowerCase()) || o.partnerName.toLowerCase().includes(searchTerm.toLowerCase()));
    return categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-display font-black text-white italic tracking-tight uppercase">Shop & Earn Manager</h2>
           <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Manage affiliate partners and reward offers</p>
        </div>
        <button 
          onClick={() => openModal(activeTab === 'partners' ? 'partner' : activeTab === 'offers' ? 'offer' : 'category')}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-black text-xs uppercase hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          Add {activeTab.slice(0, -1)}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-fit">
        {(['partners', 'offers', 'categories'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
              activeTab === tab ? 'bg-emerald-500 text-white shadow-md' : 'text-white/40 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input 
          type="text"
          placeholder={`Search ${activeTab}...`}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-48 bg-white/5 animate-pulse rounded-3xl border border-white/10"></div>
          ))
        ) : filteredItems().length === 0 ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 text-white/20">
            <ShoppingBag className="w-12 h-12" />
            <p className="font-black text-xs uppercase tracking-widest">No {activeTab} found</p>
          </div>
        ) : (
           filteredItems().map((item: any) => (
            <div 
              key={item.id || item.$id} 
              className="gaming-card p-5 group flex flex-col gap-4 border border-slate-150 hover:border-emerald-500/30 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-2 shadow-inner">
                  {item.logoUrl || item.partnerLogo ? (
                    <img src={item.logoUrl || item.partnerLogo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-emerald-900" />
                  )}
                </div>
                <div className="flex gap-2 items-center">
                   <button 
                     onClick={() => openModal(activeTab === 'partners' ? 'partner' : activeTab === 'offers' ? 'offer' : 'category', item)}
                     className="p-2 bg-slate-100 rounded-lg text-slate-550 hover:text-blue-600 hover:bg-blue-50 transition-all"
                     title="Edit"
                   >
                      <Edit2 className="w-4 h-4" />
                   </button>
                   <button 
                     onClick={() => handleDelete(item.id || item.$id, activeTab === 'partners' ? 'partner' : activeTab === 'offers' ? 'offer' : 'category')}
                     className={`p-2 rounded-lg transition-all flex items-center gap-1 ${
                       deletingItemId === (item.id || item.$id)
                         ? 'bg-red-500 text-white hover:bg-red-650'
                         : 'bg-slate-100 text-slate-550 hover:text-red-600 hover:bg-red-50'
                     }`}
                     title={deletingItemId === (item.id || item.$id) ? "Click again to confirm delete" : "Delete"}
                   >
                      <Trash2 className="w-4 h-4" />
                      {deletingItemId === (item.id || item.$id) && <span className="text-[10px] font-black uppercase px-0.5">Confirm?</span>}
                   </button>
                </div>
              </div>

              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-black font-black text-sm uppercase leading-tight line-clamp-1">{item.name || item.title}</h4>
                    {item.isActive && <Check className="w-3 h-3 text-emerald-600" />}
                    {item.isTrending && <TrendingUp className="w-3 h-3 text-amber-500" />}
                 </div>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                    {activeTab === 'offers' ? item.partnerName : item.category || 'Standard'}
                 </p>
              </div>

              {activeTab === 'offers' && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                   <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                      <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Reward</p>
                      <p className="text-xs font-black text-black">{item.rewardCoins} Coins</p>
                   </div>
                   <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                      <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Cashback</p>
                      <p className="text-xs font-black text-black">{item.cashbackPercentage}%</p>
                   </div>
                </div>
              )}

              <button className="w-full mt-auto py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase group-hover:bg-emerald-500 group-hover:text-white transition-all">
                 View Analytics
              </button>
            </div>
          ))
        )}
      </div>

      {/* Upsert Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-display font-black text-white italic uppercase">{editItem ? 'Edit' : 'Create'} {modalType}</h3>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modalType === 'partner' && (
                  <>
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Partner Logo</label>
                      <div className="relative group/upload flex items-center gap-6 p-4 bg-white/[0.04] border border-white/10 rounded-2xl hover:border-emerald-500/30 transition-all">
                        <label htmlFor="partner-logo-input" className="cursor-pointer shrink-0">
                          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner overflow-hidden relative group">
                            {uploading ? (
                              <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                            ) : logoPreview ? (
                              <img src={logoPreview} alt="Preview" className="w-full h-full object-contain" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-emerald-950/40" />
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Camera className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </label>

                        <div className="flex-1 space-y-1">
                          <p className="text-[10px] font-black text-white uppercase">Upload logo from gallery</p>
                          <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Select direct file or photo from your device</p>
                          
                          <div className="flex items-center gap-3 mt-1.5">
                            <label 
                              htmlFor="partner-logo-input" 
                              className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[9px] font-black text-emerald-400 uppercase tracking-widest cursor-pointer hover:bg-emerald-500/20 transition-all shadow-sm"
                            >
                              Choose photo / file
                            </label>
                            {uploading && (
                              <div className="flex items-center gap-1.5 text-emerald-400 text-[9px] font-black uppercase">
                                <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                              </div>
                            )}
                          </div>
                        </div>

                        <input 
                          id="partner-logo-input"
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          disabled={uploading}
                          className="hidden"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Partner Name</label>
                      <input name="name" defaultValue={editItem?.name} required className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-white font-bold focus:border-emerald-500/50 hover:border-white/20 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Website URL</label>
                      <input name="websiteUrl" defaultValue={editItem?.websiteUrl} required className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-white font-bold focus:border-emerald-500/50 hover:border-white/20 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Category</label>
                      <select name="category" defaultValue={editItem?.category} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-white font-bold focus:border-emerald-500/50 hover:border-white/20 transition-all appearance-none">
                         {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Rating</label>
                      <input type="number" step="0.1" name="rating" defaultValue={editItem?.rating || 5.0} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-white font-bold focus:border-emerald-500/50 hover:border-white/20 transition-all" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Partner Description</label>
                      <textarea name="description" defaultValue={editItem?.description || 'Verified Affiliate Partner'} placeholder="Enter brief partner description..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-white font-bold focus:border-emerald-500/50 hover:border-white/20 transition-all" rows={2}></textarea>
                    </div>
                    <div className="flex items-center gap-4 py-4 col-span-2">
                       <label className="text-[10px] font-black text-white/40 uppercase">Is Active?</label>
                       <input type="checkbox" name="isActive" defaultChecked={editItem?.isActive !== false} className="w-5 h-5 accent-emerald-500" />
                    </div>
                  </>
                )}

                {modalType === 'offer' && (
                  <>
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Override Offer Logo (Optional)</label>
                      <div className="relative group/upload flex items-center gap-6 p-4 bg-white/[0.04] border border-white/10 rounded-2xl hover:border-emerald-500/30 transition-all">
                        <label htmlFor="offer-logo-input" className="cursor-pointer shrink-0">
                          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner overflow-hidden relative group">
                            {uploading ? (
                              <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                            ) : logoPreview ? (
                              <img src={logoPreview} alt="Preview" className="w-full h-full object-contain" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-emerald-900/20" />
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Camera className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </label>

                        <div className="flex-1 space-y-1">
                          <p className="text-[10px] font-black text-white uppercase">Upload offer image from gallery</p>
                          <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Select photo/vector from your gallery or file manager</p>
                          
                          <div className="flex items-center gap-3 mt-1.5">
                            <label 
                              htmlFor="offer-logo-input" 
                              className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[9px] font-black text-emerald-400 uppercase tracking-widest cursor-pointer hover:bg-emerald-500/20 transition-all shadow-sm"
                            >
                              Choose photo / file
                            </label>
                            {uploading && (
                              <div className="flex items-center gap-1.5 text-emerald-400 text-[9px] font-black uppercase">
                                <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                              </div>
                            )}
                          </div>
                        </div>

                        <input 
                          id="offer-logo-input"
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          disabled={uploading}
                          className="hidden"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Offer Title</label>
                      <input name="title" defaultValue={editItem?.title} required placeholder="e.g. Flat 10% Cashback + 2000 Coins" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-white font-bold focus:border-emerald-500/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Partner</label>
                      <select name="partnerId" defaultValue={editItem?.partnerId} required className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-white font-bold focus:border-emerald-500/50 appearance-none">
                         <option value="">Select Partner</option>
                         {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Category</label>
                      <select name="category" defaultValue={editItem?.category} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-white font-bold focus:border-emerald-500/50 appearance-none">
                         {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Reward Coins</label>
                      <input type="number" name="rewardCoins" defaultValue={editItem?.rewardCoins} required className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-white font-bold focus:border-emerald-500/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Cashback %</label>
                      <input type="number" step="0.1" name="cashbackPercentage" defaultValue={editItem?.cashbackPercentage} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-white font-bold focus:border-emerald-500/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Reward Est. Time</label>
                      <input name="estimatedRewardTime" placeholder="e.g. 3-7 Days" defaultValue={editItem?.estimatedRewardTime} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-white font-bold focus:border-emerald-500/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Verification Days</label>
                      <input type="number" name="verificationDays" defaultValue={editItem?.verificationDays || 30} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-white font-bold focus:border-emerald-500/50" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Partner Affiliate Link</label>
                      <input name="externalLink" defaultValue={editItem?.externalLink} required className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-white font-bold focus:border-emerald-500/50" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Custom Offer Banner Image URL (Optional)</label>
                      <input name="bannerUrl" defaultValue={editItem?.bannerUrl} placeholder="e.g. https://images.unsplash.com/... or custom cdn image url" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-white font-bold focus:border-emerald-500/50 hover:border-white/20 transition-all font-mono" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Requirements (One per line)</label>
                      <textarea name="requirements" rows={3} defaultValue={editItem?.requirements ? (Array.isArray(editItem.requirements) ? editItem.requirements.join('\n') : editItem.requirements) : ''} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-white font-bold focus:border-emerald-500/50"></textarea>
                    </div>
                    <div className="flex gap-8 py-2">
                       <div className="flex items-center gap-2">
                          <label className="text-[10px] font-black text-white/40 uppercase">Trending?</label>
                          <input type="checkbox" name="isTrending" defaultChecked={editItem?.isTrending} className="accent-emerald-500" />
                       </div>
                       <div className="flex items-center gap-2">
                          <label className="text-[10px] font-black text-white/40 uppercase">Featured?</label>
                          <input type="checkbox" name="isFeatured" defaultChecked={editItem?.isFeatured} className="accent-emerald-500" />
                       </div>
                    </div>
                  </>
                )}

                {modalType === 'category' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Category Name</label>
                      <input name="name" defaultValue={editItem?.name} required className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-white font-bold focus:border-emerald-500/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2">Slug</label>
                      <input name="slug" defaultValue={editItem?.slug} required placeholder="e.g. electronics" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm text-white font-bold focus:border-emerald-500/50" />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 font-black text-xs text-white/40 uppercase">Cancel</button>
                <button type="submit" disabled={submitting} className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase hover:bg-emerald-600 transition-all disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
