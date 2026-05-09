export enum UserRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  USER = 'user'
}

export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  coins: number;
  level: number;
  referralCode: string;
  referredBy?: string;
  createdAt: any;
  lastLogin: any;
  // Keep some legacy or extra if needed for UI, but prioritize requested ones
  isBanned?: boolean;
}

export interface Admin {
  email: string;
  role: UserRole;
  createdAt: any;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  rewardCoins: number;
  link: string;
  instructions: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expiryDate?: string;
  status: 'active' | 'inactive';
  imageUrl?: string;
  createdAt: any;
}

export enum TaskCategory {
  QUIZ = 'Quiz',
  GAME = 'Game',
  SURVEY = 'Survey',
  APP_INSTALL = 'App Install',
  OFFERWALL = 'Offerwall',
  DAILY = 'Daily Tasks',
  REFERRAL = 'Referral Tasks',
  SOCIAL = 'Social Media Tasks'
}

export interface Quiz {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
  rewardCoins: number;
  timer: number;
  createdAt: any;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Submission {
  id: string;
  userId: string;
  taskId: string;
  screenshotUrl: string;
  status: SubmissionStatus;
  rejectionReason?: string;
  submittedAt: any;
  reviewedAt?: any;
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
  SUCCESSFUL = 'successful',
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
