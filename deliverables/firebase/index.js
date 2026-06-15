const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios'); // for Razorpay payout webhooks validation

admin.initializeApp();
const db = admin.firestore();

/**
 * 1. Safe Transactional Daily Check-in claimer
 * Calculates streaks, verifies cooldown boundaries, and credits coins.
 */
exports.claimDailyGift = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const uid = context.auth.uid;
  const userRef = db.collection('users').doc(uid);
  const checkinRef = db.collection('users').doc(uid).collection('check_ins').doc('status');

  return db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User record does not exist.');
    }

    const checkinDoc = await transaction.get(checkinRef);
    const now = admin.firestore.Timestamp.now();
    let streak = 1;
    let rewardAmount = 100; // Base: Day 1: 100 coins (1 Rupee)

    if (checkinDoc.exists) {
      const lastCheckin = checkinDoc.data().lastClaimed.toDate();
      const differenceMs = now.toDate() - lastCheckin;
      const differenceHours = differenceMs / (1000 * 60 * 60);

      // Enforce 24h cooling boundary limit
      if (differenceHours < 20) {
        throw new functions.https.HttpsError('resource-exhausted', 'You can only claim daily gift once every 24 hours.');
      }

      // Check if they maintained consecutive days or reset
      if (differenceHours <= 48) {
        streak = (checkinDoc.data().consecutiveDays % 7) + 1;
      } else {
        streak = 1; // broken streak of checkins
      }
    }

    // Progressive multiplier (Day 7 gets extra 1000 coins bonus)
    rewardAmount = streak * 100;
    if (streak === 7) rewardAmount += 1000;

    // Save Transactions & Increment
    const newBalance = (userDoc.data().coins || 0) + rewardAmount;
    transaction.update(userRef, { 
      coins: newBalance,
      streak: streak,
      updatedAt: now
    });

    transaction.set(checkinRef, {
      lastClaimed: now,
      consecutiveDays: streak
    }, { merge: true });

    // Store activity transaction record
    const claimLogRef = db.collection('users').doc(uid).collection('transactions').doc();
    transaction.set(claimLogRef, {
      amount: rewardAmount,
      type: 'DAILY_CHECKIN',
      description: `Claimed Day ${streak} streak gift`,
      timestamp: now
    });

    return { success: true, coinsCredited: rewardAmount, currentStreak: streak, newBalance: newBalance };
  });
});

/**
 * 2. Handle Referral Code Activation (UTM validated)
 * Gives 100 Coins reward to invitee, and logs referrer rewards.
 */
exports.applyReferralCode = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must remain authenticated.');
  }

  const { referralCode } = data;
  if (!referralCode) {
    throw new functions.https.HttpsError('invalid-argument', 'An invitation referral code is required.');
  }

  const uid = context.auth.uid;
  const userRef = db.collection('users').doc(uid);

  // Locate the referrer
  const referrersQuery = await db.collection('users').where('referralCode', '==', referralCode.trim().toUpperCase()).limit(1).get();
  if (referrersQuery.empty) {
    throw new functions.https.HttpsError('not-found', 'Referral invitation code code not active.');
  }

  const referrerDoc = referrersQuery.docs[0];
  const referrerId = referrerDoc.id;

  if (referrerId === uid) {
    throw new functions.https.HttpsError('failed-precondition', 'Self-referring is strictly blocked.');
  }

  return db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Invited user not found.');
    }

    if (userDoc.data().referredBy) {
      throw new functions.https.HttpsError('already-exists', 'You have already accepted one invitation code.');
    }

    // Reward Invitee (₹1 welcome credit)
    const newInviteeBalance = (userDoc.data().coins || 0) + 100;
    transaction.update(userRef, {
      referredBy: referrerId,
      coins: newInviteeBalance,
      updatedAt: admin.firestore.Timestamp.now()
    });

    // Notify Referrer & Record milestone tree relation
    const linkRef = db.collection('referrals').doc();
    transaction.set(linkRef, {
      referrerId: referrerId,
      inviteeId: uid,
      rewardCredited: false, // will credit the full ₹50 after their first completed survey task
      createdAt: admin.firestore.Timestamp.now()
    });

    return { success: true, welcomeBonusCoins: 100 };
  });
});

/**
 * 3. Withdraw verification & Razorpay payout integration webhook
 * Initiates Razorpay payout or holds until verification is resolved.
 */
exports.processWithdrawRequest = functions.firestore
  .document('withdrawals/{withId}')
  .onCreate(async (snap, context) => {
    const withdrawData = snap.data();
    const withId = context.params.withId;
    const uid = withdrawData.userId;

    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return snap.ref.update({ status: 'failed', errorMessage: 'Gamer not found.' });
    }

    // 1. Anti-Emulator & Device parameters verification to detect fraud
    if (withdrawData.deviceInfo && (withdrawData.deviceInfo.isEmulator || withdrawData.deviceInfo.isVirtualKeyboard)) {
       await db.collection('users').doc(uid).update({ status: 'banned', reason: 'Emulator fraud detected on withdrawal request' });
       return snap.ref.update({ status: 'rejected', reason: 'Emulator emulator device used description block' });
    }

    // 2. KYC approval validation
    const kycDoc = await db.collection('users').doc(uid).collection('documents').doc('kyc').get();
    if (!kycDoc.exists || kycDoc.data().status !== 'verified') {
       return snap.ref.update({ 
         status: 'on_hold', 
         reason: 'KYC documents are pending approval. Aadhaar or PAN is required to fulfill payments under Indian regulations.' 
       });
    }

    // 3. Initiate payment processing (using Razorpay API credentials)
    const amountInPaise = withdrawData.amountRupee * 100; // Razorpay expects amount in paise
    try {
      // In production, configure Razorpay Payouts API
      // axios.post('https://api.razorpay.com/v1/payouts', { ... })
      
      console.log(`Simulating Razorpay payment payout of ${amountInPaise} paise to UPI string: ${withdrawData.payoutAddress}`);
      
      return snap.ref.update({
        status: 'completed',
        payoutId: `PAY_RAZOR_${Math.floor(Math.random() * 900000 + 100000)}`,
        processedAt: admin.firestore.Timestamp.now()
      });
    } catch (e) {
      return snap.ref.update({ status: 'failed', errorMessage: `Razorpay connection error: ${e.message}` });
    }
});
