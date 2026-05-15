import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  Share2, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  ChevronRight,
  ShoppingBasket,
  History,
  CheckCircle2,
  Star,
  Image as ImageIcon
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { affiliateService } from '../services/affiliateService';
import { AffiliateOffer, ClaimStatus } from '../types';
import { CoinIcon } from '../components/CoinIcon';
import { useToast } from '../context/ToastContext';
import { Skeleton } from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

export const OfferDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [offer, setOffer] = React.useState<AffiliateOffer | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [trackingLoading, setTrackingLoading] = React.useState(false);
  const [showClaimModal, setShowClaimModal] = React.useState(false);
  
  // Claim data state
  const [transactionId, setTransactionId] = React.useState('');
  const [orderAmount, setOrderAmount] = React.useState('');
  const [screenshot, setScreenshot] = React.useState<File | null>(null);
  const [uploadingScreen, setUploadingScreen] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      affiliateService.getOfferById(id).then(res => {
        setOffer(res);
        setLoading(false);
      });
    }
  }, [id]);

  const handleOpenOffer = async () => {
    if (!offer) return;
    setTrackingLoading(true);
    
    const clickId = await affiliateService.trackClick(offer.id);
    setTrackingLoading(false);
    
    if (clickId) {
      // Small delay for psychological "tracking" effect
      showToast('Tracking enabled! Redirection started...', 'success');
      setTimeout(() => {
        window.open(offer.externalLink, '_blank');
      }, 1500);
    } else {
      showToast('Tracking failed. Please try again.', 'error');
    }
  };

  const handleSubmitClaim = async () => {
    if (!offer || !transactionId || !orderAmount) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setUploadingScreen(true);
    let screenshotUrl = '';
    
    if (screenshot) {
      try {
        screenshotUrl = await apiService.uploadFile(screenshot);
      } catch (e) {
        showToast('Image upload failed', 'error');
        setUploadingScreen(false);
        return;
      }
    }

    const clickId = `CL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`; // In real world, we'd fetch this from click history
    
    const res = await affiliateService.submitClaim({
      offerId: offer.id,
      clickId,
      transactionId,
      orderAmount: parseFloat(orderAmount),
      screenshotUrl,
      rewardAmount: offer.rewardCoins
    });

    setUploadingScreen(false);
    
    if (res.success) {
      showToast('Claim submitted successfully!', 'success');
      setShowClaimModal(false);
      // Reset form
      setTransactionId('');
      setOrderAmount('');
      setScreenshot(null);
    } else {
      showToast(res.error || 'Failed to submit claim', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!offer) return <div className="text-white text-center py-20 font-bold uppercase tracking-widest opacity-40">Offer not found</div>;

  return (
    <>
      <div className="flex flex-col gap-6 pb-24">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="gaming-card p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center p-4 shadow-2xl">
              {offer.partnerLogo ? (
                <img src={offer.partnerLogo} alt={offer.partnerName} className="w-full h-full object-contain" />
              ) : (
                <ShoppingBasket className="w-12 h-12 text-emerald-900" />
              )}
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">{offer.partnerName}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-[10px] text-white/40 font-bold">4.8</span>
                </div>
              </div>
              <h1 className="text-2xl font-display font-black text-white italic tracking-tighter leading-tight">{offer.title}</h1>
            </div>
            
            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col items-center gap-1">
                <p className="text-[10px] font-black text-emerald-100/40 uppercase tracking-widest">Reward</p>
                <div className="flex items-center gap-1">
                  <CoinIcon size={20} />
                  <span className="text-xl font-display font-black text-white italic tracking-tighter">+{offer.rewardCoins}</span>
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex flex-col items-center gap-1">
                <p className="text-[10px] font-black text-blue-100/40 uppercase tracking-widest">Cashback</p>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-display font-black text-white italic tracking-tighter">{offer.cashbackPercentage || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar (Sticky conceptually but inline here) */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            disabled={trackingLoading}
            onClick={handleOpenOffer}
            className="gaming-button-yellow py-4 flex items-center justify-center gap-2 relative"
          >
            {trackingLoading ? (
               <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-900 border-t-transparent"></div>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">OPEN OFFER</span>
              </>
            )}
          </button>
          <button 
            onClick={() => setShowClaimModal(true)}
            className="bg-white/5 border border-white/10 rounded-2xl py-4 font-black text-white text-xs uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <History className="w-4 h-4" />
            SUBMIT CLAIM
          </button>
        </div>

        {/* Process Box */}
        <div className="bg-blue-900/40 border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-500 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-tight">How to earn rewards</h3>
            </div>
            
            <div className="space-y-4">
              {(offer.requirements || [
                'Click on "Open Offer" button below.',
                'Purchase from the opened website.',
                'Come back and submit your order details.',
                'Coins will be credited after verification.'
              ]).map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-black text-blue-400">
                    {idx + 1}
                  </span>
                  <p className="text-[11px] text-blue-100/60 font-bold leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 text-blue-500/5 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-700">
            <ShieldCheck size={120} />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="gaming-card p-4 flex flex-col gap-3">
             <div className="flex items-center gap-2 text-white/40">
                <Clock className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">Reward Time</span>
             </div>
             <p className="text-xs font-black text-white uppercase tracking-tighter leading-snug">{offer.estimatedRewardTime}</p>
          </div>
          <div className="gaming-card p-4 flex flex-col gap-3">
             <div className="flex items-center gap-2 text-white/40">
                <ShieldCheck className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">Verification</span>
             </div>
             <p className="text-xs font-black text-white uppercase tracking-tighter leading-snug">{offer.verificationDays} Days</p>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-black text-white uppercase px-2">Important Terms</h3>
          <div className="gaming-card p-6 bg-white/5 border-white/10">
            <p className="text-[11px] text-white/60 font-bold leading-relaxed whitespace-pre-wrap">
              {offer.longDescription || "Standard affiliate terms apply. Please ensure you do not have an ad-blocker enabled and you complete the purchase in one session after clicking our link. Self-orders or returns will disqualify rewards."}
            </p>
          </div>
        </div>

        {/* Fraud Warning */}
        <div className="bg-amber-900/20 border border-amber-500/20 rounded-2xl p-4 flex gap-4">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-[10px] text-amber-200/60 font-bold leading-relaxed">
            <span className="text-amber-500 uppercase">Warning:</span> Fraudulent claims or multiple accounts will result in an immediate permanent ban and forfeiture of all earnings.
          </p>
        </div>
      </div>

      {/* Claim Submission Modal */}
      <AnimatePresence>
        {showClaimModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !uploadingScreen && setShowClaimModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl p-8"
            >
               <div className="flex flex-col items-center text-center gap-2 mb-8">
                  <div className="w-12 h-1 bg-white/10 rounded-full mb-4 sm:hidden"></div>
                  <h3 className="text-xl font-display font-black text-white italic uppercase tracking-tighter">Submit Your Claim</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Verify your purchase to earn {(offer.rewardCoins).toLocaleString()} coins</p>
               </div>

               <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase ml-2">Order / Transaction ID</label>
                    <input 
                      type="text" 
                      placeholder="Enter ID from your receipt"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white font-bold focus:outline-none focus:border-emerald-500/50"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase ml-2">Order Amount ($)</label>
                    <input 
                      type="number" 
                      placeholder="Total purchase value"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white font-bold focus:outline-none focus:border-emerald-500/50"
                      value={orderAmount}
                      onChange={(e) => setOrderAmount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase ml-2">Proof (Screenshot)</label>
                    <div className="relative group">
                       <input 
                         type="file" 
                         accept="image/*"
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                         onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                       />
                       <div className={`w-full border-2 border-dashed rounded-3xl py-6 flex flex-col items-center justify-center gap-2 transition-all ${screenshot ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-white/5 group-hover:border-white/20'}`}>
                          {screenshot ? (
                             <>
                               <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                               <p className="text-xs font-black text-emerald-400 uppercase">{screenshot.name.slice(0, 20)}...</p>
                               <p className="text-[9px] font-bold text-emerald-400/60 uppercase">Click to change</p>
                             </>
                          ) : (
                             <>
                               <ImageIcon className="w-8 h-8 text-white/20" />
                               <p className="text-[10px] font-black text-white/40 uppercase">Upload Bill / Receipt</p>
                             </>
                          )}
                       </div>
                    </div>
                  </div>

                  <button 
                    disabled={uploadingScreen}
                    onClick={handleSubmitClaim}
                    className="w-full gaming-button-emerald py-5 flex items-center justify-center gap-2"
                  >
                    {uploadingScreen ? (
                       <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-sm">SUBMIT FOR VERIFICATION</span>
                      </>
                    )}
                  </button>

                  <button 
                    disabled={uploadingScreen}
                    onClick={() => setShowClaimModal(false)}
                    className="w-full text-[10px] font-black text-white/20 uppercase hover:text-white transition-colors py-2"
                  >
                    Cancel
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
