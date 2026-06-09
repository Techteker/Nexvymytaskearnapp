export const EARNING_CONFIG = {
  COINS_PER_USD: 10000,
  MIN_WITHDRAWAL_USD: 5,
  MIN_WITHDRAWAL_COINS: 50000,
  
  // Daily limits
  MAX_DAILY_COINS: 100000, // 10 USD cap per day
  MAX_REFERRAL_COINS_TOTAL: 500000, // 50 USD cap from referrals
  
  // Reward amounts (Example defaults, can be overridden by admin)
  DAILY_REWARD_BASE: 50,
  STREAK_BONUS: 10,
  REFERRAL_REWARD_REFERRED: 100, // rewarded to the person who used the code
  REFERRAL_REWARD_REFERRER: 200, // rewarded to the owner of the code
  
  // Anti-fraud
  MIN_TIME_BETWEEN_SPINS_SEC: 10,
  MAX_SPINS_PER_DAY: 50,
};

export const formatCoins = (coins: number) => {
  const usd = coins / EARNING_CONFIG.COINS_PER_USD;
  return `${coins.toLocaleString()} Coins ($${usd.toFixed(2)})`;
};

export const coinsToUSD = (coins: number) => {
  return (coins / EARNING_CONFIG.COINS_PER_USD).toFixed(2);
};
