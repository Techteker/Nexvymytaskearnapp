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
import { SEO } from '../components/SEO';

export const getOfferBanner = (offer: any) => {
  if (offer?.bannerUrl && offer.bannerUrl.startsWith('http')) {
    return offer.bannerUrl;
  }
  // Guess based on Title, Brand or Category
  const searchStr = `${offer?.title || ''} ${offer?.partnerName || ''} ${offer?.category || ''}`.toLowerCase();
  
  if (searchStr.includes('survey') || searchStr.includes('cpx') || searchStr.includes('poll') || searchStr.includes('opinion') || searchStr.includes('feedback')) {
    return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80';
  }
  if (searchStr.includes('myntra') || searchStr.includes('ajio') || searchStr.includes('nykaa') || searchStr.includes('fashion') || searchStr.includes('clothes') || searchStr.includes('clothing') || searchStr.includes('apparel')) {
    return 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80';
  }
  if (searchStr.includes('adidas') || searchStr.includes('nike') || searchStr.includes('sport') || searchStr.includes('sports') || searchStr.includes('running') || searchStr.includes('shoes') || searchStr.includes('puma') || searchStr.includes('reebok')) {
    return 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80';
  }
  if (searchStr.includes('amazon') || searchStr.includes('flipkart') || searchStr.includes('shop') || searchStr.includes('store') || searchStr.includes('purchase') || searchStr.includes('shopping') || searchStr.includes('deals') || searchStr.includes('coupon') || searchStr.includes('voucher')) {
    return 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80';
  }
  if (searchStr.includes('credit card') || searchStr.includes('bank') || searchStr.includes('fiat') || searchStr.includes('onecard') || searchStr.includes('onescore') || searchStr.includes('fi money') || searchStr.includes('hdfc') || searchStr.includes('sbi') || searchStr.includes('axis') || searchStr.includes('kotak') || searchStr.includes('icici') || searchStr.includes('loan') || searchStr.includes('salary')) {
    return 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80';
  }
  if (searchStr.includes('finance') || searchStr.includes('invest') || searchStr.includes('trading') || searchStr.includes('stocks') || searchStr.includes('demat') || searchStr.includes('groww') || searchStr.includes('zerodha') || searchStr.includes('angelone')) {
    return 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80';
  }
  if (searchStr.includes('crypto') || searchStr.includes('bitcoin') || searchStr.includes('binance') || searchStr.includes('wazirx') || searchStr.includes('coin-switch') || searchStr.includes('blockchain')) {
    return 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80';
  }
  if (searchStr.includes('game') || searchStr.includes('gaming') || searchStr.includes('play') || searchStr.includes('rummy') || searchStr.includes('poker') || searchStr.includes('console') || searchStr.includes('winzo') || searchStr.includes('mpl')) {
    return 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80';
  }
  if (searchStr.includes('swiggy') || searchStr.includes('zomato') || searchStr.includes('dominos') || searchStr.includes('pizza') || searchStr.includes('food') || searchStr.includes('restaurant') || searchStr.includes('delivery') || searchStr.includes('grocery') || searchStr.includes('blinkit') || searchStr.includes('zepto')) {
    return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';
  }
  if (searchStr.includes('hostinger') || searchStr.includes('domain') || searchStr.includes('server') || searchStr.includes('hosting') || searchStr.includes('web') || searchStr.includes('cloud') || searchStr.includes('aws') || searchStr.includes('vps')) {
    return 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80';
  }
  if (searchStr.includes('netflix') || searchStr.includes('hotstar') || searchStr.includes('prime') || searchStr.includes('movie') || searchStr.includes('entertainment') || searchStr.includes('cinema') || searchStr.includes('music') || searchStr.includes('spotify')) {
    return 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800&q=80';
  }
  if (searchStr.includes('travel') || searchStr.includes('makemytrip') || searchStr.includes('cleartrip') || searchStr.includes('ixigo') || searchStr.includes('flight') || searchStr.includes('hotel') || searchStr.includes('tour') || searchStr.includes('booking')) {
    return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80';
  }
  if (searchStr.includes('health') || searchStr.includes('gym') || searchStr.includes('workout') || searchStr.includes('fitness') || searchStr.includes('supplement') || searchStr.includes('proteins') || searchStr.includes('pharmacy')) {
    return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80';
  }
  if (searchStr.includes('education') || searchStr.includes('course') || searchStr.includes('learn') || searchStr.includes('study') || searchStr.includes('udemy') || searchStr.includes('coursera') || searchStr.includes('book') || searchStr.includes('unacademy')) {
    return 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80';
  }
  if (searchStr.includes('app') || searchStr.includes('install') || searchStr.includes('download') || searchStr.includes('register') || searchStr.includes('signup') || searchStr.includes('account') || searchStr.includes('apk')) {
    return 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80';
  }
  // Ultimate default slate premium pattern fallback
  return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
};

export const OfferDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [offer, setOffer] = React.useState<AffiliateOffer | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [trackingLoading, setTrackingLoading] = React.useState(false);
  const [showClaimModal, setShowClaimModal] = React.useState(false);
  const [partnerLogoUrl, setPartnerLogoUrl] = React.useState<string | null>(null);
  
  // Claim data state
  const [transactionId, setTransactionId] = React.useState('');
  const [orderAmount, setOrderAmount] = React.useState('');
  const [screenshot, setScreenshot] = React.useState<File | null>(null);
  const [uploadingScreen, setUploadingScreen] = React.useState(false);

  const parsedRequirements = React.useMemo(() => {
    if (!offer) {
      return [
        'Click on "Open Offer" button below.',
        'Purchase from the opened website.',
        'Come back and submit your order details.',
        'Coins will be credited after verification.'
      ];
    }
    const reqs = offer.requirements;
    if (!reqs) {
      return [
        'Click on "Open Offer" button below.',
        'Purchase from the opened website.',
        'Come back and submit your order details.',
        'Coins will be credited after verification.'
      ];
    }
    if (Array.isArray(reqs)) {
      return reqs.filter(Boolean);
    }
    if (typeof reqs === 'string') {
      try {
        const parsed = JSON.parse(reqs);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean);
        }
      } catch (err) {
        // Not JSON
      }
      if (reqs.includes('\r\n') || reqs.includes('\n')) {
        return reqs.split(/\r?\n/).map(s => s.replace(/^[-\s*•\d+.]\s*/, '').trim()).filter(Boolean);
      }
      if (reqs.includes(',')) {
        return reqs.split(',').map(s => s.trim()).filter(Boolean);
      }
      return [reqs.trim()].filter(Boolean);
    }
    return [
      'Click on "Open Offer" button below.',
      'Purchase from the opened website.',
      'Come back and submit your order details.',
      'Coins will be credited after verification.'
    ];
  }, [offer]);

  React.useEffect(() => {
    if (id) {
      affiliateService.getOfferById(id).then(async (res) => {
        setOffer(res);
        if (res) {
          try {
            const partnersList = await affiliateService.getPartners();
            const matchedPartner = partnersList.find(p => 
              p.id === res.partnerId || 
              ((p as any).$id && (p as any).$id === res.partnerId) ||
              p.name.toLowerCase() === res.partnerName.toLowerCase()
            );
            if (matchedPartner && matchedPartner.logoUrl) {
              setPartnerLogoUrl(matchedPartner.logoUrl);
            }
          } catch (err) {
            console.error('Error fetching partner logo', err);
          }
        }
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

  if (!offer) return <div className="text-black text-center py-20 font-bold uppercase tracking-widest opacity-40">Offer not found</div>;

  return (
    <>
      <SEO 
        title={`${offer.partnerName} Cash Offer: Earn ${offer.rewardCoins.toLocaleString()} Coins`} 
        description={`Complete the ${offer.title} offer from ${offer.partnerName} on Nexvy to earn ${offer.rewardCoins.toLocaleString()} coins. Follow simple step guidelines and get verified rewards.`}
        keywords={`nexvy cashback, earn rewards, ${offer.partnerName} offer, cashback india, complete online deal, shopping rewards app, nexvy app`}
      />
      <div className="flex flex-col gap-6 pb-24">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-black/5 border border-black/10 rounded-xl flex items-center justify-center text-black/60 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-black/5 border border-black/10 rounded-xl flex items-center justify-center text-black/60 hover:text-black transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Premium Graphic Banner */}
        <div className="relative h-44 w-full bg-slate-900 rounded-[32px] overflow-hidden shadow-lg border border-white/10 group">
          <img 
            src={getOfferBanner(offer)} 
            alt={offer.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 flex flex-col justify-between p-5">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-black tracking-widest text-[#eceff1] bg-emerald-500/80 px-2.5 py-1 rounded-full shadow-lg border border-emerald-400">
                ACTIVE DEAL
              </span>
              <span className="text-[9px] font-black tracking-wide text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded uppercase font-mono">
                🚀 VERIFIED PREMIUM
              </span>
            </div>
            <div>
              <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wide mb-1">Nexvy Affiliate Campaign</p>
              <h2 className="text-lg font-display font-black text-white italic tracking-tight line-clamp-1 uppercase leading-none">{offer.title}</h2>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="gaming-card p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border-black/10">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center p-4 shadow-2xl">
              {offer.partnerLogo || partnerLogoUrl ? (
                <img src={offer.partnerLogo || partnerLogoUrl!} alt={offer.partnerName} className="w-full h-full object-contain" />
              ) : (
                <ShoppingBasket className="w-12 h-12 text-emerald-950" />
              )}
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">{offer.partnerName}</span>
                <span className="w-1 h-1 bg-black/20 rounded-full"></span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-[10px] text-black/40 font-bold">4.8</span>
                </div>
              </div>
              <h1 className="text-2xl font-display font-black text-black italic tracking-tighter leading-tight">{offer.title}</h1>
            </div>
            
            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col items-center gap-1">
                <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">Reward</p>
                <div className="flex items-center gap-1">
                  <CoinIcon size={20} />
                  <span className="text-xl font-display font-black text-black italic tracking-tighter">+{offer.rewardCoins}</span>
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex flex-col items-center gap-1">
                <p className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest">Cashback</p>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-display font-black text-black italic tracking-tighter">{offer.cashbackPercentage || 0}%</span>
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
            className="bg-black/5 border border-black/10 rounded-2xl py-4 font-black text-black text-xs uppercase hover:bg-black/10 transition-all flex items-center justify-center gap-2"
          >
            <History className="w-4 h-4" />
            SUBMIT CLAIM
          </button>
        </div>

        {/* Process Box */}
        <div className="bg-blue-100/60 border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-500 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-black text-black uppercase tracking-tight">How to earn rewards</h3>
            </div>
            
            <div className="space-y-4">
              {parsedRequirements.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-black text-blue-500">
                    {idx + 1}
                  </span>
                  <p className="text-[11px] text-blue-900/60 font-bold leading-relaxed">{step}</p>
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
             <div className="flex items-center gap-2 text-black/40">
                <Clock className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">Reward Time</span>
             </div>
             <p className="text-xs font-black text-black uppercase tracking-tighter leading-snug">{offer.estimatedRewardTime}</p>
          </div>
          <div className="gaming-card p-4 flex flex-col gap-3">
             <div className="flex items-center gap-2 text-black/40">
                <ShieldCheck className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">Verification</span>
             </div>
             <p className="text-xs font-black text-black uppercase tracking-tighter leading-snug">{offer.verificationDays} Days</p>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-black text-black uppercase px-2">Important Terms</h3>
          <div className="gaming-card p-6 bg-black/5 border-black/10">
            <p className="text-[11px] text-black/60 font-bold leading-relaxed whitespace-pre-wrap">
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
              className="absolute inset-0 bg-slate-950/85"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative w-full max-w-lg bg-white border border-black/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl p-8"
            >
               <div className="flex flex-col items-center text-center gap-2 mb-8">
                  <div className="w-12 h-1 bg-black/10 rounded-full mb-4 sm:hidden"></div>
                  <h3 className="text-xl font-display font-black text-black italic uppercase tracking-tighter">Submit Your Claim</h3>
                  <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Verify your purchase to earn {(offer.rewardCoins).toLocaleString()} coins</p>
               </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-black/40 uppercase ml-2">Order / Transaction ID</label>
                    <input 
                      type="text" 
                      placeholder="Enter ID from your receipt"
                      className="w-full bg-black/5 border border-black/10 rounded-2xl py-4 px-6 text-sm text-black font-bold focus:outline-none focus:border-emerald-500/50"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-black/40 uppercase ml-2">Order Amount ($)</label>
                    <input 
                      type="number" 
                      placeholder="Total purchase value"
                      className="w-full bg-black/5 border border-black/10 rounded-2xl py-4 px-6 text-sm text-black font-bold focus:outline-none focus:border-emerald-500/50"
                      value={orderAmount}
                      onChange={(e) => setOrderAmount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-black/40 uppercase ml-2">Proof (Screenshot)</label>
                    <div className="relative group">
                       <input 
                         type="file" 
                         accept="image/*"
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                         onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                       />
                       <div className={`w-full border-2 border-dashed rounded-3xl py-6 flex flex-col items-center justify-center gap-2 transition-all ${screenshot ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-black/10 bg-black/5 group-hover:border-black/20'}`}>
                          {screenshot ? (
                             <>
                               <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                               <p className="text-xs font-black text-emerald-400 uppercase">{screenshot.name.slice(0, 20)}...</p>
                               <p className="text-[9px] font-bold text-emerald-400/60 uppercase">Click to change</p>
                             </>
                          ) : (
                             <>
                               <ImageIcon className="w-8 h-8 text-black/20" />
                               <p className="text-[10px] font-black text-black/40 uppercase">Upload Bill / Receipt</p>
                             </>
                          )}
                       </div>
                    </div>
                  </div>

                  <button 
                    disabled={uploadingScreen}
                    onClick={handleSubmitClaim}
                    className="w-full gaming-button-yellow py-5 flex items-center justify-center gap-2"
                  >
                    {uploadingScreen ? (
                       <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-sm">CLAIM REWARD</span>
                      </>
                    )}
                  </button>

                  <button 
                    disabled={uploadingScreen}
                    onClick={() => setShowClaimModal(false)}
                    className="w-full text-[10px] font-black text-black/20 uppercase hover:text-black transition-colors py-2"
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
