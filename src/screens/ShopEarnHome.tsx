import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronRight, 
  Star, 
  TrendingUp, 
  ShoppingBag,
  Sparkles,
  ShoppingBasket,
  X,
  ArrowRight,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { affiliateService } from '../services/affiliateService';
import { AffiliateOffer, AffiliateCategory, AffiliatePartner } from '../types';
import { CoinIcon } from '../components/CoinIcon';
import { Skeleton } from '../components/Skeleton';
import { SEO } from '../components/SEO';
import { client, APPWRITE_CONFIG } from '../lib/appwrite';

export const getOfferBanner = (offer: any) => {
  if (offer?.bannerUrl && offer.bannerUrl.startsWith('http')) {
    return offer.bannerUrl;
  }
  const searchStr = `${offer?.title || ''} ${offer?.partnerName || ''} ${offer?.category || ''}`.toLowerCase();
  
  if (searchStr.includes('survey') || searchStr.includes('cpx') || searchStr.includes('poll') || searchStr.includes('opinion') || searchStr.includes('feedback')) {
    return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80';
  }
  if (searchStr.includes('myntra') || searchStr.includes('ajio') || searchStr.includes('nykaa') || searchStr.includes('fashion') || searchStr.includes('clothes') || searchStr.includes('clothing') || searchStr.includes('apparel')) {
    return 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80';
  }
  if (searchStr.includes('adidas') || searchStr.includes('nike') || searchStr.includes('sport') || searchStr.includes('sports') || searchStr.includes('running') || searchStr.includes('shoes') || searchStr.includes('puma') || searchStr.includes('reebok')) {
    return 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80';
  }
  if (searchStr.includes('amazon') || searchStr.includes('flipkart') || searchStr.includes('shop') || searchStr.includes('store') || searchStr.includes('purchase') || searchStr.includes('shopping') || searchStr.includes('deals') || searchStr.includes('coupon') || searchStr.includes('voucher')) {
    return 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80';
  }
  if (searchStr.includes('credit card') || searchStr.includes('bank') || searchStr.includes('fiat') || searchStr.includes('onecard') || searchStr.includes('onescore') || searchStr.includes('fi money') || searchStr.includes('hdfc') || searchStr.includes('sbi') || searchStr.includes('axis') || searchStr.includes('kotak') || searchStr.includes('icici') || searchStr.includes('loan') || searchStr.includes('salary')) {
    return 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80';
  }
  if (searchStr.includes('finance') || searchStr.includes('invest') || searchStr.includes('trading') || searchStr.includes('stocks') || searchStr.includes('demat') || searchStr.includes('groww') || searchStr.includes('zerodha') || searchStr.includes('angelone')) {
    return 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80';
  }
  if (searchStr.includes('crypto') || searchStr.includes('bitcoin') || searchStr.includes('binance') || searchStr.includes('wazirx') || searchStr.includes('coin-switch') || searchStr.includes('blockchain')) {
    return 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=600&q=80';
  }
  if (searchStr.includes('game') || searchStr.includes('gaming') || searchStr.includes('play') || searchStr.includes('rummy') || searchStr.includes('poker') || searchStr.includes('console') || searchStr.includes('winzo') || searchStr.includes('mpl')) {
    return 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80';
  }
  if (searchStr.includes('swiggy') || searchStr.includes('zomato') || searchStr.includes('dominos') || searchStr.includes('pizza') || searchStr.includes('food') || searchStr.includes('restaurant') || searchStr.includes('delivery') || searchStr.includes('grocery') || searchStr.includes('blinkit') || searchStr.includes('zepto')) {
    return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80';
  }
  if (searchStr.includes('hostinger') || searchStr.includes('domain') || searchStr.includes('server') || searchStr.includes('hosting') || searchStr.includes('web') || searchStr.includes('cloud') || searchStr.includes('aws') || searchStr.includes('vps')) {
    return 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80';
  }
  if (searchStr.includes('netflix') || searchStr.includes('hotstar') || searchStr.includes('prime') || searchStr.includes('movie') || searchStr.includes('entertainment') || searchStr.includes('cinema') || searchStr.includes('music') || searchStr.includes('spotify')) {
    return 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=600&q=80';
  }
  if (searchStr.includes('travel') || searchStr.includes('makemytrip') || searchStr.includes('cleartrip') || searchStr.includes('ixigo') || searchStr.includes('flight') || searchStr.includes('hotel') || searchStr.includes('tour') || searchStr.includes('booking')) {
    return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80';
  }
  if (searchStr.includes('health') || searchStr.includes('gym') || searchStr.includes('workout') || searchStr.includes('fitness') || searchStr.includes('supplement') || searchStr.includes('proteins') || searchStr.includes('pharmacy')) {
    return 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80';
  }
  if (searchStr.includes('education') || searchStr.includes('course') || searchStr.includes('learn') || searchStr.includes('study') || searchStr.includes('udemy') || searchStr.includes('coursera') || searchStr.includes('book') || searchStr.includes('unacademy')) {
    return 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=600&q=80';
  }
  if (searchStr.includes('app') || searchStr.includes('install') || searchStr.includes('download') || searchStr.includes('register') || searchStr.includes('signup') || searchStr.includes('account') || searchStr.includes('apk')) {
    return 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80';
  }
  return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
};

export const ShopEarnHome = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = React.useState<AffiliateOffer[]>([]);
  const [partners, setPartners] = React.useState<AffiliatePartner[]>([]);
  const [categories, setCategories] = React.useState<AffiliateCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedTab, setSelectedTab] = React.useState<'offers' | 'brands'>('offers');
  
  // Brand selection modal
  const [selectedBrand, setSelectedBrand] = React.useState<AffiliatePartner | null>(null);

  React.useEffect(() => {
    let active = true;

    const fetchData = async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const [offersData, partnersData, catsData] = await Promise.all([
          affiliateService.getOffers(),
          affiliateService.getPartners(),
          affiliateService.getCategories()
        ]);
        if (active) {
          setOffers(offersData);
          setPartners(partnersData);
          setCategories(catsData);
        }
      } catch (err) {
        console.error('[REALTIME] Fetch failed:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData(true);

    // Appwrite Realtime Subscriptions
    const dbId = APPWRITE_CONFIG.databaseId;
    const offersColl = APPWRITE_CONFIG.collections.affiliate_offers;
    const partnersColl = APPWRITE_CONFIG.collections.affiliate_partners;
    const categoriesColl = APPWRITE_CONFIG.collections.affiliate_categories;

    const channels = [
      `databases.${dbId}.collections.${offersColl}.documents`,
      `databases.${dbId}.collections.${partnersColl}.documents`,
      `databases.${dbId}.collections.${categoriesColl}.documents`
    ];

    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = client.subscribe(channels, (response) => {
        if (import.meta.env.DEV) {
          console.log('[REALTIME] Affiliate entity modification detected:', response);
        }
        fetchData(false);
      });
    } catch (err) {
      console.warn('[REALTIME] Appwrite SDK sub error. Using local sync as core:', err);
    }

    const handleLocalRealtimeUpdate = () => {
      fetchData(false);
    };

    window.addEventListener('nexvy_realtime_update', handleLocalRealtimeUpdate);

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
      window.removeEventListener('nexvy_realtime_update', handleLocalRealtimeUpdate);
    };
  }, []);

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         offer.partnerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredPartners = partners.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const trendingOffers = offers.filter(o => o.isTrending);

  // Active brand specific offers in modal view
  const selectedBrandOffers = selectedBrand 
    ? offers.filter(o => o.partnerName.toLowerCase() === selectedBrand.name.toLowerCase() || o.partnerId === (selectedBrand.id || selectedBrand.$id))
    : [];

  const getOfferLogo = (offer: AffiliateOffer) => {
    if (offer.partnerLogo && offer.partnerLogo.startsWith('http')) {
      return offer.partnerLogo;
    }
    const matchedPartner = partners.find(p => 
      p.id === offer.partnerId || 
      (p.$id && p.$id === offer.partnerId) ||
      p.name.toLowerCase() === offer.partnerName.toLowerCase()
    );
    if (matchedPartner && matchedPartner.logoUrl && matchedPartner.logoUrl.startsWith('http')) {
      return matchedPartner.logoUrl;
    }
    return null;
  };

  return (
    <>
      <SEO 
        title="Shop & Earn Cashback: Online Shopping Rewards - Nexvy" 
        description="Earn massive cash rewards, promo discounts, and coins when you shop online through Nexvy. Discover best deals and cashback from top brand stores in India." 
        keywords="shop and earn, shopping rewards, best cashback online, shopping discounts india, promo offers nexvy, cashback coins deals, online cashback app"
      />
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="relative overflow-hidden gaming-card p-6 bg-gradient-to-br from-emerald-600 to-teal-900 border-emerald-400/20 rounded-[32px]">
          <div className="relative z-10">
            <h1 className="text-2xl font-display font-black text-white italic tracking-tighter">SHOP & EARN</h1>
            <p className="text-emerald-100/60 text-xs font-bold uppercase tracking-widest mt-1">Earn rewards on every purchase</p>
          </div>
          <ShoppingBag className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
            <input 
              type="text"
              placeholder={selectedTab === 'offers' ? "Search offers or brands..." : "Search partner brands..."}
              className="w-full bg-black/5 border border-black/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-black focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {/* All Offers Option - Placed to the Left of All Brands */}
            <button 
              onClick={() => {
                setSelectedTab('offers');
                setSelectedCategory('all');
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border cursor-pointer ${
                selectedTab === 'offers' && selectedCategory === 'all'
                ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20' 
                : 'bg-black/5 border-black/10 text-black/60 hover:border-black/20'
              }`}
            >
              All Offers
            </button>

            {/* All Brands Option */}
            <button 
              onClick={() => {
                setSelectedTab('brands');
                setSelectedCategory('all');
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border cursor-pointer ${
                selectedTab === 'brands' && selectedCategory === 'all'
                ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20' 
                : 'bg-black/5 border-black/10 text-black/60 hover:border-black/20'
              }`}
            >
              All Brands
            </button>

            {categories.map((cat, index) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button 
                  key={cat.id || cat.$id || `cat-${index}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border cursor-pointer ${
                    isSelected 
                    ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20' 
                    : 'bg-black/5 border-black/10 text-black/60 hover:border-black/20'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trending Section - Offers only */}
        {selectedTab === 'offers' && trendingOffers.length > 0 && selectedCategory === 'all' && !searchTerm && (
          <div>
            <div className="flex items-center gap-2 mb-4 px-2 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <h3 className="font-display font-black text-lg uppercase italic tracking-tight">Trending Offers</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {trendingOffers.map((offer, index) => (
                <motion.div 
                  key={offer.id || offer.$id || `trend-${index}`}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/shop-earn/${offer.id}`)}
                  className="min-w-[280px] max-w-[280px] gaming-card p-0 bg-white border border-black/10 relative overflow-hidden group cursor-pointer transition-all hover:border-emerald-500/30"
                >
                  {/* Premium Brand Banner Overlay */}
                  <div className="relative h-28 w-full bg-slate-900 overflow-hidden">
                    <img 
                      src={getOfferBanner(offer)} 
                      alt={offer.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Floating Brand Logo overlapping the banner */}
                    <div className="absolute bottom-2 left-3 w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-md">
                      {getOfferLogo(offer) ? (
                        <img src={getOfferLogo(offer)!} alt={offer.partnerName} className="w-full h-full object-contain" />
                      ) : (
                        <ShoppingBasket className="w-5 h-5 text-emerald-950" />
                      )}
                    </div>
                    
                    {/* Floating Reward Tag */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20">
                      <CoinIcon size={10} />
                      <span className="text-[9px] font-black text-emerald-400">+{offer.rewardCoins}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-wider block mb-0.5">{offer.partnerName}</span>
                    <h4 className="text-xs font-black text-black mb-1 line-clamp-1 leading-snug">{offer.title}</h4>
                    <p className="text-[9px] text-slate-500 font-medium line-clamp-1 mb-2">{offer.shortDescription || 'Verified hot rewarding offer'}</p>
                    
                    <div className="flex items-center justify-between mt-3 text-[10px]">
                      <span className="text-[8px] font-black text-emerald-600 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">
                        {offer.cashbackPercentage}% Cashback
                      </span>
                      <div className="flex items-center text-slate-400 group-hover:text-emerald-500 transition-colors font-black text-[9px] uppercase tracking-wider">
                        <span>Get Reward</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* List Content Section */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-display font-black text-lg uppercase italic text-black/80 tracking-tight">
              {selectedTab === 'offers' 
                ? (selectedCategory === 'all' ? 'Featured Offers' : `${categories.find(c => c.slug === selectedCategory)?.name || 'Filtered'} Offers`)
                : (selectedCategory === 'all' ? 'Partner Brands' : `${categories.find(c => c.slug === selectedCategory)?.name || 'Filtered'} Brands`)
              }
            </h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="gaming-card p-4 flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-2xl" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-xl" />
                </div>
              ))
            ) : selectedTab === 'offers' ? (
              filteredOffers.length === 0 ? (
                <div className="gaming-card p-12 text-center flex flex-col items-center gap-4 bg-black/5 border-dashed">
                  <ShoppingBag className="w-12 h-12 text-black/10" />
                  <p className="text-black/40 font-bold uppercase text-xs tracking-widest">No matching offers found</p>
                </div>
              ) : (
                filteredOffers.map((offer, index) => (
                  <motion.div 
                    key={offer.id || offer.$id || `offer-${index}`}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/shop-earn/${offer.id}`)}
                    className="gaming-card p-0 bg-white border border-black/10 relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all flex flex-col sm:flex-row items-stretch"
                  >
                    {/* Left banner side panel */}
                    <div className="relative w-full sm:w-40 h-28 sm:h-auto bg-slate-900 shrink-0 overflow-hidden">
                      <img 
                        src={getOfferBanner(offer)} 
                        alt={offer.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/80 sm:from-slate-950/20 to-black/20"></div>
                      
                      {/* Floating Brand Logo on the banner */}
                      <div className="absolute bottom-2 left-3 w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md">
                        {getOfferLogo(offer) ? (
                          <img src={getOfferLogo(offer)!} alt={offer.partnerName} className="w-full h-full object-contain" />
                        ) : (
                          <ShoppingBasket className="w-5 h-5 text-emerald-950" />
                        )}
                      </div>

                      {/* Featured Star */}
                      {offer.isFeatured && (
                        <div className="absolute top-2 left-2 bg-yellow-400 text-slate-950 p-1 rounded-lg shadow-md">
                          <Sparkles className="w-3 h-3 text-black fill-current" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div className="min-w-0 mb-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wider block">{offer.partnerName}</span>
                          <span className="text-[8px] font-black text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded uppercase block">{offer.category}</span>
                        </div>
                        <h4 className="text-sm font-black text-black leading-snug mb-1 line-clamp-1 group-hover:text-emerald-500 transition-colors">{offer.title}</h4>
                        <p className="text-[10px] text-slate-500 font-medium line-clamp-2 leading-relaxed">{offer.shortDescription || 'Earn verified rewards on this nexvy premium offer.'}</p>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-emerald-600 uppercase bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/15">
                            {offer.cashbackPercentage || 0}% Cashback
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/10 px-2.5 py-1 rounded-xl">
                            <CoinIcon size={14} />
                            <span className="text-sm font-black text-black">+{offer.rewardCoins}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )
            ) : (
              // Brands View Tab
              filteredPartners.length === 0 ? (
                <div className="gaming-card p-12 text-center flex flex-col items-center gap-4 bg-black/5 border-dashed">
                  <ShoppingBag className="w-12 h-12 text-black/10" />
                  <p className="text-black/40 font-bold uppercase text-xs tracking-widest">No matching brands found</p>
                </div>
              ) : (
                filteredPartners.map((partner, index) => {
                  const partnerOfferCount = offers.filter(o => o.partnerName.toLowerCase() === partner.name.toLowerCase() || o.partnerId === (partner.id || partner.$id)).length;
                  return (
                    <motion.div 
                      key={partner.id || partner.$id || `partner-${index}`}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedBrand(partner)}
                      className="gaming-card p-4 flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all border-white/5"
                    >
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shadow-inner group-hover:scale-105 transition-transform shrink-0">
                        {partner.logoUrl ? (
                          <img src={partner.logoUrl} alt={partner.name} className="w-full h-full object-contain" />
                        ) : (
                          <ShoppingBasket className="w-8 h-8 text-emerald-950" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tight">Vetted Partner</span>
                          <Star className="w-3 h-3 text-yellow-500 fill-current ml-1" />
                          <span className="text-[10px] text-black/40 font-bold">{partner.rating || 5.0}</span>
                        </div>
                        <h4 className="text-sm font-black text-black leading-tight mb-1 line-clamp-1">{partner.name}</h4>
                        <p className="text-[10px] text-black/50 line-clamp-1">{partner.description || 'Verified Affiliate Partner'}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 text-right shrink-0">
                        <span className="text-[9px] font-sans font-black text-black bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                          {partnerOfferCount} {partnerOfferCount === 1 ? 'Offer' : 'Offers'}
                        </span>
                        <span className="text-[8px] font-black uppercase text-slate-400 group-hover:text-emerald-400 transition-colors">
                          View details
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )
            )}
          </div>
        </div>
      </div>

      {/* Brand Dashboard Slide-up Drawer/Modal Details */}
      <AnimatePresence>
        {selectedBrand && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/90">
            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.5 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white border-t-4 sm:border-4 border-emerald-500 rounded-t-[32px] sm:rounded-[36px] w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh] shadow-2xl relative text-black"
            >
              {/* Drag bar for mobile */}
              <div className="w-12 h-1 bg-black/20 rounded-full mx-auto my-3 sm:hidden" />

              <div className="p-6 border-b border-black/5 relative flex items-start gap-4 pr-12">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-inner shrink-0 leading-none">
                  {selectedBrand.logoUrl ? (
                    <img src={selectedBrand.logoUrl} alt={selectedBrand.name} className="w-full h-full object-contain" />
                  ) : (
                    <ShoppingBasket className="w-8 h-8 text-emerald-950" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Verified Brand Partner</span>
                    <div className="flex items-center gap-0.5 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded text-[9px] font-bold text-yellow-400">
                      <Star size={8} className="fill-current" />
                      <span>{selectedBrand.rating || 5.0}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-display font-black text-black italic tracking-tighter uppercase leading-none">
                    {selectedBrand.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-1.5 leading-relaxed">
                    {selectedBrand.description || 'Verified Partner offering direct cashback and coin rewards on purchases.'}
                  </p>
                </div>

                <button 
                  onClick={() => setSelectedBrand(null)}
                  className="absolute right-4 top-4 p-2.5 bg-black/5 hover:bg-black/10 rounded-full text-slate-600 hover:text-black transition-colors border-0 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* brand content list */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest font-mono">
                    AVAILABLE DEALS & OFFERS ({selectedBrandOffers.length})
                  </span>
                  {selectedBrand.websiteUrl && (
                    <a 
                      href={selectedBrand.websiteUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase hover:underline"
                    >
                      <Globe size={10} />
                      <span>Main Site</span>
                    </a>
                  )}
                </div>

                {selectedBrandOffers.length === 0 ? (
                  <div className="p-8 text-center bg-black/5 rounded-2xl border border-black/5 flex flex-col items-center gap-3">
                    <ShoppingBag className="w-8 h-8 text-black/10" />
                    <p className="text-slate-600 text-xs font-bold uppercase tracking-wider">No active specials listed</p>
                    {selectedBrand.websiteUrl && (
                      <a 
                        href={selectedBrand.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="gaming-button-yellow py-2.5 px-6 text-2xs mt-1"
                      >
                        Visit Partner Site
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {selectedBrandOffers.map((offer, index) => (
                      <div 
                        key={offer.id || offer.$id || `brand-offer-${index}`}
                        onClick={() => {
                          setSelectedBrand(null);
                          navigate(`/shop-earn/${offer.id}`);
                        }}
                        className="p-4 bg-black/5 hover:bg-black/10 border border-black/5 hover:border-emerald-500/20 rounded-2xl transition-all cursor-pointer group flex items-center justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-black group-hover:text-emerald-600 transition-colors line-clamp-1">
                            {offer.title}
                          </h4>
                          <p className="text-[10px] text-slate-600 font-medium line-clamp-1 mt-0.5">
                            {offer.shortDescription || 'Earn instant rewards.'}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[8px] font-black px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded">
                              {offer.cashbackPercentage || 0}% Cashback
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex items-center gap-3">
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1">
                              <CoinIcon size={14} />
                              <span className="text-sm font-black text-black">+{offer.rewardCoins}</span>
                            </div>
                            <span className="text-[8px] text-slate-500 font-bold block mt-0.5">Coins Max</span>
                          </div>
                          <ArrowRight size={14} className="text-slate-500 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-slate-100 border-t border-black/5 flex gap-3">
                <button
                  onClick={() => setSelectedBrand(null)}
                  className="flex-1 py-4 bg-black/5 hover:bg-black/10 text-black rounded-2xl font-black uppercase text-xs tracking-wider transition-colors border-0 cursor-pointer text-center"
                >
                  Close Drawer
                </button>
                {selectedBrand.websiteUrl && (
                  <a
                    href={selectedBrand.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-white text-center rounded-2xl font-black uppercase text-xs tracking-wider transition-colors text-white shadow-xl shadow-emerald-500/10"
                  >
                    Direct Shop
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
export default ShopEarnHome;
