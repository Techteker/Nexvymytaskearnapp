# Nexvy - India's Smart Rewards Earning Platform 🇮🇳

Nexvy is a high-performance, production-ready Indian rewards application. Users earn real money (withdrawable via UPI, Paytm, or Bank Transfer) by completing simple surveys, tasks, watching rewarded ads, referring friends, and claiming shopping cashback.

This repository contains the complete delivery files requested for **App Store / Google Play Store compliance** and highly optimized backend routines.

---

## 📁 Repository Structure

```
deliverables/
├── flutter/                        # Complete Cross-Platform Flutter Mobile Code
│   ├── pubspec.yaml                # Standard pubspec file with perfect packages dependencies
│   └── lib/
│       ├── main.dart               # App Init, Riverpod State, & Navigation Routing Route
│       ├── core/
│       │   ├── theme/              # Typography pairing, Dark style, & Color definition
│       │   │   └── app_theme.dart
│       │   └── widgets/            # Reusable widgets (Coin counter, Haptic Button, Shimmer skeleton)
│       │       ├── coin_counter.dart
│       │       └── haptic_button.dart
│       └── features/               # Clean Architecture Feature modules
│           ├── onboarding/         # Onboarding with 3 Slides & Language selector
│           │   └── onboarding_screen.dart
│           ├── auth/               # OTP firebase sign in with Google support
│           │   └── login_screen.dart
│           ├── home/               # Featured carousel, Quick actions, Daily streaks
│           │   └── home_screen.dart
│           ├── earn/               # Tabs for Survey modal, Tasks verification, Cooldown video ADS
│           │   └── earn_screen.dart
│           ├── wallet/             # Instant UPI validation, transaction histories
│           │   └── wallet_screen.dart
│           ├── referral/           # UTM links, milestone rewards tree visualizer
│           │   └── referral_screen.dart
│           ├── profile/            # KYC documents Aadhaar/PAN, Theme selector, In-app chat support
│           │   └── profile_screen.dart
│           ├── notifications/      # Firebase Cloud Messaging target pages with categories
│           │   └── notification_screen.dart
│           └── leaderboard/        # Animated ranks, prizes badges for top earners
│               └── leaderboard_screen.dart
├── firebase/                       # Backend Cloud Functions & Database structures
│   ├── index.js                    # Functions for streaks validation, referrals, & Razorpay payouts
│   └── firestore.rules             # Secure, secure-hardened Firestore Security Rules
└── nextjs/                         # Companion modern PWA Web dashboard
    ├── index.tsx                   # Responsive marketing landing page
    └── dashboard.tsx               # Sidebar desktop-friendly layout
```

---

## ⚙️ How to Run & Configure

### 1. Flutter Mobile App
1. Verify Flutter is installed: `flutter --version`.
2. Navigate to directory: `cd deliverables/flutter`.
3. Get packages: `flutter pub get`.
4. Run the app: `flutter run` (or open the `/ios` or `/android` subdirectories in Xcode/Android Studio).
5. For Firebase configuration: Place your `google-services.json` inside `android/app/` and `GoogleService-Info.plist` inside `ios/Runner/`.

### 2. Firebase Cloud Functions
1. Change directory to Firebase Functions: `cd deliverables/firebase`.
2. run `npm install` inside the functions directory.
3. Deploy functions using Firebase CLI: `firebase deploy --only functions`.

### 3. Companion Next.js Web Landing & Dashboard
1. Place the landing page code inside `/pages/index.tsx` inside a standard Next.js 14 template or app directory path.
2. Ensure Tailwind CSS is configured to pull design accents.
3. Custom Razorpay & Firebase environment keys can be configured inside `.env.local`.
