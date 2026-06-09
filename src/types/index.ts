export enum UserRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  USER = 'user'
}

export interface User {
  uid: string;
  username: string;
  email: string;
  photoURL?: string;
  coins: number;
  level: number;
  referralCode: string;
  referredBy?: string;
  role: UserRole;
  isBanned: boolean;
  streak: number;
  isPremium?: boolean;
  region?: string;
  createdAt: any;
  lastLogin: any;
}

export interface Admin {
  email: string;
  role: UserRole;
  createdAt: any;
}

export interface TaskCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  slug: string;
  isActive: boolean;
}

export enum TaskType {
  SURVEY = 'survey',
  QUIZ = 'quiz',
  GAME = 'game',
  CUSTOM = 'custom',
  APP_INSTALL = 'app_install',
  YOUTUBE = 'youtube',
  TELEGRAM = 'telegram',
  WEBSITE = 'website'
}

export enum TaskStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSE = 'pause',
  COMPLETED = 'completed'
}

export interface Task {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  type: TaskType;
  category: string; // Slug or ID of category
  difficulty: 'easy' | 'medium' | 'hard';
  rewardCoins: number;
  rewardXP: number;
  maxUsers?: number;
  usersJoined: number;
  completionRate?: number;
  startDate?: string;
  endDate?: string;
  status: TaskStatus;
  
  // Requirements
  requirements: {
    minTimeSeconds?: number;
    externalLink?: string;
    steps?: string[];
    requireScreenshot?: boolean;
    requireTextProof?: boolean;
    deviceType?: 'all' | 'android' | 'ios' | 'desktop';
    restrictedCountries?: string[];
  };

  // Visibility
  visibility: {
    allUsers: boolean;
    premiumOnly: boolean;
    selectedUserIds?: string[];
    regions?: string[];
  };

  // Type Specific Config
  quizConfig?: QuizConfig;
  surveyConfig?: SurveyConfig;
  gameConfig?: GameConfig;

  createdAt: any;
  updatedAt?: any;
}

export interface QuizConfig {
  questions: QuizQuestion[];
  timerSeconds: number;
  passPercentage: number;
  retryLimit: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface SurveyConfig {
  questions: SurveyQuestion[];
}

export interface SurveyQuestion {
  id: string;
  question: string;
  type: 'text' | 'radio' | 'checkbox' | 'rating' | 'dropdown';
  options?: string[];
  isRequired: boolean;
}

export interface GameConfig {
  gameId: string;
  minPlayTimeSeconds: number;
  externalGameUrl?: string;
  inAppGameKey?: string;
}

export interface UserTaskProgress {
  id: string;
  userId: string;
  taskId: string;
  status: 'started' | 'in_progress' | 'submitted' | 'completed' | 'failed';
  startedAt: string;
  lastActiveAt: string;
  timeSpentSeconds: number;
  progressData?: any;
}

export interface Submission {
  id: string;
  userId: string;
  taskId: string;
  status: SubmissionStatus;
  proofs: {
    screenshotUrl?: string;
    textProof?: string;
    quizResults?: any;
    surveyAnswers?: any;
  };
  rejectionReason?: string;
  submittedAt: any;
  reviewedAt?: any;
  rewardAmount: number;
}

export enum SubmissionStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  method: string;
  paymentDetails: string;
  status: WithdrawalStatus;
  createdAt: any;
  processedAt?: any;
}

export enum WithdrawalStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface AppSettings {
  maintenanceMode: boolean;
  minWithdrawal: number;
  referralCommission: number;
  dailyReward: number;
  appName: string;
  appLogo?: string;
  splashScreenUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface AdSettings {
  admobAppId?: string;
  bannerAdId?: string;
  rewardedAdId?: string;
  interstitialAdId?: string;
  nativeAdId?: string;
  enabled: boolean;
}

export enum ClaimStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CREDITED = 'credited'
}

export interface AffiliatePartner {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  websiteUrl: string;
  rating: number;
  isActive: boolean;
  category: string;
  createdAt: any;
}

export interface AffiliateOffer {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerLogo?: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  rewardCoins: number;
  cashbackPercentage?: number;
  estimatedRewardTime: string;
  verificationDays: number;
  requirements: string[];
  termsConditions: string;
  status: 'active' | 'paused' | 'expired';
  category: string;
  isTrending: boolean;
  isFeatured: boolean;
  externalLink: string;
  bannerUrl?: string;
  createdAt: any;
}

export interface AffiliateClick {
  id: string;
  userId: string;
  offerId: string;
  clickId: string; // Unique tracking ID
  ipAddress: string;
  deviceInfo: string;
  timestamp: any;
}

export interface AffiliateClaim {
  id: string;
  userId: string;
  offerId: string;
  clickId: string;
  transactionId: string;
  orderAmount: number;
  screenshotUrl?: string;
  status: ClaimStatus;
  rejectionReason?: string;
  rewardAmount: number;
  submittedAt: any;
  verifiedAt?: any;
}

export interface AffiliateCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}
