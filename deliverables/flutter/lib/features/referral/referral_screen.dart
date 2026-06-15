import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:share_plus/share_plus.dart';
import '../../main.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/haptic_button.dart';

class ReferralScreen extends ConsumerWidget {
  const ReferralScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    const referralCode = 'NEXVY77';
    final language = ref.watch(languageProvider);
    final isHindi = language == 'hi';

    return Scaffold(
      appBar: AppBar(title: Text(isHindi ? 'रेफ़रल प्रोग्राम 🤝' : 'Referral Commissions')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Prominent banner
            Card(
              color: AppTheme.darkCard,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    const Icon(Icons.stars_rounded, size: 60, color: AppTheme.goldCoins),
                    const SizedBox(height: 16),
                    Text(
                      isHindi ? 'हर रेफ़रल पर ₹50 कमाएं!' : 'EARN ₹50 PER REFERRAL!',
                      style: const TextStyle(fontWeight: FontWeight.black, fontSize: 18, color: Colors.white, letterSpacing: 1.1),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Your friend gets ₹10 welcome gift, you get ₹50 when they complete their first survey.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey, fontSize: 11),
                    ),
                    const SizedBox(height: 24),

                    // Copyable code container
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.04),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white12),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          const Text(
                            referralCode,
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.black, letterSpacing: 3, color: AppTheme.primaryPurple, fontFamily: 'RobotoMono'),
                          ),
                          IconButton(
                            onPressed: () {
                              Clipboard.setData(const ClipboardData(text: referralCode));
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Referral code copied to clipboard!')),
                              );
                            },
                            icon: const Icon(Icons.copy_all_rounded, color: Colors.white60),
                          )
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Native Share CTAs
                    HapticButton(
                      color: AppTheme.successGreen,
                      onPressed: () {
                        Share.share(
                          'Join Nexvy - India\'s topmost rewards app. Use my elite code "$referralCode" and unlock ₹10 welcome cash plus ₹500 monthly Thar access draw! Download now: https://nexvy.in/?ref=$referralCode',
                          subject: 'Nexvy - Rewards app download',
                        );
                      },
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.whatsapp_rounded, size: 20),
                          SizedBox(width: 8),
                          Text('INVITE FRIENDS VIA WHATSAPP', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.1)),
                        ],
                      ),
                    )
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Milestones Tracker progress
            _buildMilestonesSection(isHindi),
            const SizedBox(height: 24),

            // Referred users lists view
            _buildReferredUsersList(isHindi),
          ],
        ),
      ),
    );
  }

  Widget _buildMilestonesSection(bool isHindi) {
    return Card(
      color: AppTheme.darkCard,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              isHindi ? 'रेफ़रल मील के पत्थर 🏆' : 'REFERRAL MILESTONES 🏆',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.grey),
            ),
            const SizedBox(height: 16),
            _buildMilestoneRow('Refer 5 Friends', 'Get extra ₹100 bonus', true),
            _buildMilestoneRow('Refer 10 Friends', 'Get extra ₹250 bonus', false),
            _buildMilestoneRow('Refer 25 Friends', 'Get extra ₹1,000 bonus', false),
          ],
        ),
      ),
    );
  }

  Widget _buildMilestoneRow(String title, String reward, bool isCompleted) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              Text(reward, style: const TextStyle(color: Colors.grey, fontSize: 10)),
            ],
          ),
          isCompleted 
              ? const Icon(Icons.check_circle_rounded, color: AppTheme.accentMint) 
              : const Icon(Icons.hourglass_empty_rounded, color: Colors.grey, size: 20),
        ],
      ),
    );
  }

  Widget _buildReferredUsersList(bool isHindi) {
    final referrals = [
      {'name': 'Vikram Patel', 'status': 'Survey Completed', 'earned': '+₹50.00'},
      {'name': 'Anjali Sharma', 'status': 'Pending Verification', 'earned': '₹0.00'}
    ];

    return Card(
      color: AppTheme.darkCard,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              isHindi ? 'आपके आमंत्रित मित्र 👥' : 'REFERRED FRIENDS (TREE SIGHT) 👥',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.grey),
            ),
            const SizedBox(height: 16),
            ...referrals.map((friend) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 8.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      CircleAvatar(backgroundColor: Colors.white12, child: Text(friend['name']![0])),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(friend['name']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                          Text(friend['status']!, style: TextStyle(color: friend['status'] == 'Survey Completed' ? AppTheme.accentMint : Colors.grey, fontSize: 10)),
                        ],
                      )
                    ],
                  ),
                  Text(friend['earned']!, style: const TextStyle(fontFamily: 'RobotoMono', fontWeight: FontWeight.bold, color: AppTheme.accentMint)),
                ],
              ),
            )),
          ],
        ),
      ),
    );
  }
}
