import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Star, 
  TrendingUp, 
  ShoppingBag,
  Sparkles,
  ShoppingBasket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { affiliateService } from '../services/affiliateService';
import { AffiliateOffer, AffiliateCategory } from '../types';
import { CoinIcon } from '../components/CoinIcon';
import { Skeleton } from '../components/Skeleton';
import { SEO } from '../components/SEO';

export const ShopEarnHome = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = React.useState<AffiliateOffer[]>([]);
  const [categories, setCategories] = React.useState<AffiliateCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [offersData, catsData] = await Promise.all([
        affiliateService.getOffers(),
        affiliateService.getCategories()
      ]);
      setOffers(offersData);
      setCategories(catsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         offer.partnerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const trendingOffers = offers.filter(o => o.isTrending);

  return (
    <>
      <SEO title="Shop & Earn" description="Purchase from your favorite brands and earn Nexvy coins as rewards." />
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="relative overflow-hidden gaming-card p-6 bg-gradient-to-br from-emerald-600 to-teal-900 border-emerald-400/20">
          <div className="relative z-10">
            <h1 className="text-2xl font-display font-black text-white italic tracking-tighter">SHOP & EARN</h1>
            <p className="text-emerald-100/60 text-xs font-bold uppercase tracking-widest mt-1">Earn rewards on every purchase</p>
          </div>
          <ShoppingBag className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text"
              placeholder="Search brands or offers..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                selectedCategory === 'all' 
                ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20' 
                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
              }`}
            >
              All Brands
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                  selectedCategory === cat.slug 
                  ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Section */}
        {trendingOffers.length > 0 && selectedCategory === 'all' && !searchTerm && (
          <div>
            <div className="flex items-center gap-2 mb-4 px-2 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <h3 className="font-display font-black text-lg uppercase italic tracking-tight">Trending Offers</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {trendingOffers.map(offer => (
                <motion.div 
                  key={offer.id}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/shop-earn/${offer.id}`)}
                  className="min-w-[280px] gaming-card p-5 bg-white/5 border-white/10 relative overflow-hidden group cursor-pointer transition-all hover:border-emerald-500/30"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
                      {offer.partnerLogo ? (
                        <img src={offer.partnerLogo} alt={offer.partnerName} className="w-full h-full object-contain" />
                      ) : (
                        <ShoppingBasket className="w-6 h-6 text-emerald-900" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-1 rounded-lg border border-emerald-500/30">
                      <CoinIcon size={12} />
                      <span className="text-[10px] font-black text-emerald-400">+{offer.rewardCoins}</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-black text-white mb-1 line-clamp-1">{offer.title}</h4>
                  <p className="text-[10px] text-white/40 font-bold uppercase mb-4">{offer.partnerName}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[8px] font-black text-emerald-400 uppercase bg-emerald-400/10 px-2 py-0.5 rounded">
                      {offer.cashbackPercentage}% Cashback
                    </span>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-emerald-400 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Offers List */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-display font-black text-lg uppercase italic text-white/80 tracking-tight">
              {selectedCategory === 'all' ? 'Featured Partners' : categories.find(c => c.slug === selectedCategory)?.name}
            </h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="gaming-card p-4 flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-2xl" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-xl" />
                </div>
              ))
            ) : filteredOffers.length === 0 ? (
              <div className="gaming-card p-12 text-center flex flex-col items-center gap-4 bg-white/5 border-dashed">
                <ShoppingBag className="w-12 h-12 text-white/10" />
                <p className="text-white/40 font-bold uppercase text-xs tracking-widest">No matching partners found</p>
              </div>
            ) : (
              filteredOffers.map(offer => (
                <motion.div 
                  key={offer.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/shop-earn/${offer.id}`)}
                  className="gaming-card p-4 flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all border-white/5"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shadow-inner group-hover:scale-105 transition-transform">
                    {offer.partnerLogo ? (
                      <img src={offer.partnerLogo} alt={offer.partnerName} className="w-full h-full object-contain" />
                    ) : (
                      <ShoppingBasket className="w-8 h-8 text-emerald-900" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tight">{offer.partnerName}</span>
                      {offer.isFeatured && <Sparkles className="w-3 h-3 text-yellow-400" />}
                    </div>
                    <h4 className="text-sm font-black text-white leading-tight mb-1 line-clamp-1">{offer.title}</h4>
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-[10px] text-white/40 font-bold">4.8</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 text-right">
                    <div className="flex items-center gap-1">
                      <CoinIcon size={14} />
                      <span className="text-sm font-black text-white">+{offer.rewardCoins}</span>
                    </div>
                    <span className="text-[9px] font-black text-emerald-400 uppercase bg-emerald-400/10 px-2 py-0.5 rounded">
                      Details
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
