import { databases, APPWRITE_CONFIG, account } from '../lib/appwrite';
import { ID, Query, Permission, Role } from 'appwrite';
import { 
  AffiliatePartner, 
  AffiliateOffer, 
  AffiliateClick, 
  AffiliateClaim, 
  ClaimStatus,
  AffiliateCategory
} from '../types';

export const affiliateService = {
  async getPartners() {
    try {
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.affiliate_partners,
        [Query.equal('isActive', true)]
      );
      return res.documents.map(d => ({ ...d, id: d.$id })) as unknown as AffiliatePartner[];
    } catch (e) {
      return [];
    }
  },

  async getOffers(filters: { category?: string; trending?: boolean; featured?: boolean } = {}) {
    try {
      const queries = [];
      if (filters.category) queries.push(Query.equal('category', filters.category));
      if (filters.trending) queries.push(Query.equal('isTrending', true));
      if (filters.featured) queries.push(Query.equal('isFeatured', true));
      
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.affiliate_offers,
        queries
      );
      return res.documents
        .map(d => {
          const item = { ...d, id: d.$id } as any;
          item.rewardCoins = item.rewardCoins ?? item.reward ?? 0;
          return item;
        })
        .filter((item: any) => item.status !== 'inactive') as unknown as AffiliateOffer[];
    } catch (e) {
      return [];
    }
  },

  async getOfferById(id: string) {
    try {
      const res = await databases.getDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.affiliate_offers,
        id
      );
      const item = { ...res, id: res.$id } as any;
      item.rewardCoins = item.rewardCoins ?? item.reward ?? 0;
      return item as unknown as AffiliateOffer;
    } catch (e) {
      return null;
    }
  },

  async getCategories() {
    try {
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.affiliate_categories
      );
      return res.documents.map(d => ({ ...d, id: d.$id })) as unknown as AffiliateCategory[];
    } catch (e) {
      return [];
    }
  },

  async trackClick(offerId: string) {
    try {
      const user = await account.get();
      const clickId = ID.unique();
      
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.affiliate_clicks,
        clickId,
        {
          userId: user.$id,
          offerId,
          clickId,
          timestamp: new Date().toISOString(),
          ipAddress: 'detected_on_server', // placeholder
          deviceInfo: navigator.userAgent
        },
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id))
        ]
      );
      
      return clickId;
    } catch (e) {
      console.error('Click tracking failed', e);
      return null;
    }
  },

  async submitClaim(claimData: { 
    offerId: string; 
    clickId: string; 
    transactionId: string; 
    orderAmount: number; 
    screenshotUrl?: string;
    rewardAmount: number;
  }) {
    try {
      const user = await account.get();
      
      const res = await databases.createDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.affiliate_claims,
        ID.unique(),
        {
          ...claimData,
          userId: user.$id,
          status: ClaimStatus.PENDING,
          submittedAt: new Date().toISOString()
        },
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id))
        ]
      );
      
      return { success: true, claimId: res.$id };
    } catch (e: any) {
      return { error: e.message || 'Claim submission failed' };
    }
  },

  async getUserClaims() {
    try {
      const user = await account.get();
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.affiliate_claims,
        [Query.equal('userId', user.$id), Query.orderDesc('submittedAt')]
      );
      return res.documents.map(d => ({ ...d, id: d.$id })) as unknown as AffiliateClaim[];
    } catch (e) {
      return [];
    }
  }
};
