import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../main.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/haptic_button.dart';

class EarnScreen extends ConsumerStatefulWidget {
  const EarnScreen({super.key});

  @override
  ConsumerState<EarnScreen> createState() => _EarnScreenState();
}

class _EarnScreenState extends ConsumerState<EarnScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  int _dailyAdsWatched = 4;
  int _cooldownSeconds = 0;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    final language = ref.watch(languageProvider);
    final isHindi = language == 'hi';

    return Scaffold(
      appBar: AppBar(
        title: Text(isHindi ? 'पैसे कमाएं 🪙' : 'Earn Rewards Hub'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          labelColor: AppTheme.primaryPurple,
          unselectedLabelColor: Colors.grey,
          indicatorColor: AppTheme.primaryPurple,
          tabs: [
            Tab(text: isHindi ? 'सर्वेक्षण' : 'Surveys'),
            Tab(text: isHindi ? 'कार्य' : 'Tasks'),
            Tab(text: isHindi ? 'वीडियो' : 'Watch & Earn'),
            Tab(text: isHindi ? 'ऑफर' : 'Offers'),
            Tab(text: isHindi ? 'चेक-इन' : 'Daily Check-in'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildSurveysTab(isHindi),
          _buildTasksTab(isHindi),
          _buildWatchTab(isHindi),
          _buildOffersTab(isHindi),
          _buildCheckInTab(isHindi),
        ],
      ),
    );
  }

  Widget _buildSurveysTab(bool isHindi) {
    final surveys = [
      {'title': 'Finance App Feedback', 'reward': '₹25.00', 'time': '5 min', 'rate': '92%'},
      {'title': 'Shopping Patterns Survey', 'reward': '₹60.00', 'time': '12 min', 'rate': '65%'},
      {'title': 'Indian Digital Banking Survey', 'reward': '₹40.00', 'time': '8 min', 'rate': '85%'}
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: surveys.length,
      itemBuilder: (context, idx) {
        final survey = surveys[idx];
        return Card(
          color: AppTheme.darkCard,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            contentPadding: const EdgeInsets.all(16),
            leading: CircleAvatar(
              backgroundColor: AppTheme.primaryPurple.withOpacity(0.12),
              child: const Icon(Icons.question_answer_rounded, color: AppTheme.primaryPurple),
            ),
            title: Text(survey['title']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            subtitle: Row(
              children: [
                Icon(Icons.access_time_rounded, size: 12, color: Colors.grey.shade400),
                const SizedBox(width: 4),
                Text(survey['time']!, style: const TextStyle(fontSize: 10, color: Colors.grey)),
                const SizedBox(width: 16),
                Icon(Icons.thumb_up_alt_rounded, size: 12, color: AppTheme.accentMint.withOpacity(0.8)),
                const SizedBox(width: 4),
                Text(survey['rate']!, style: const TextStyle(fontSize: 10, color: Colors.grey)),
              ],
            ),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  survey['reward']!,
                  style: const TextStyle(
                    fontFamily: 'RobotoMono',
                    color: AppTheme.accentMint,
                    fontWeight: FontWeight.black,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 4),
                const Icon(Icons.chevron_right, size: 16, color: Colors.grey)
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildTasksTab(bool isHindi) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildTaskItem('Google Pay Install', 'Install and sign up of account', '₹50.00', Icons.download_rounded),
        _buildTaskItem('Telegram Group Entry', 'Join Nexvy announcements group', '₹5.00', Icons.send_rounded),
        _buildTaskItem('YouTube Video Share', 'Like & post review video link', '₹15.00', Icons.video_call_rounded),
      ],
    );
  }

  Widget _buildTaskItem(String title, String desc, String reward, IconData icon) {
    return Card(
      color: AppTheme.darkCard,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            CircleAvatar(backgroundColor: Colors.white12, child: Icon(icon, color: Colors.white54)),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  const SizedBox(height: 4),
                  Text(desc, style: const TextStyle(color: Colors.grey, fontSize: 10)),
                ],
              ),
            ),
            HapticButton(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              onPressed: () {},
              child: Text(reward, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'RobotoMono')),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildWatchTab(bool isHindi) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.video_collection_rounded, size: 80, color: AppTheme.secondaryCoral.withOpacity(0.8)),
          const SizedBox(height: 24),
          Text(
            isHindi 
                ? 'अड्मॉब रिवॉर्डेड विज्ञापन देखकर कमाएं 📺' 
                : 'Watch Short Videos & Earn Cash',
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            isHindi 
                ? 'प्रति 30 सेकंड के विज्ञापन पर ₹0.50 तुरंत पाएं।' 
                : 'Earn ₹0.50 cash instantly upon watching a 30s marketing video.',
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.grey, fontSize: 12),
          ),
          const SizedBox(height: 32),
          Text(
            isHindi ? 'आज के बचे हुए विज्ञापन: $Constants/20' : 'Daily Limit: $_dailyAdsWatched / 20 watched today',
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 24),
          HapticButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Loading AdMob Rewarded Video... Credit will arrive in 30s.')),
              );
            },
            child: Text(isHindi ? 'विज्ञापन देखें और कमाएं' : 'WATCH VIDEO NOW'),
          )
        ],
      ),
    );
  }

  Widget _buildOffersTab(bool isHindi) {
    return const Center(
      child: Text('Partner Offerwalls coming soon (CPA Lead & AdGate Media).'),
    );
  }

  Widget _buildCheckInTab(bool isHindi) {
    final dailyRewards = [100, 200, 300, 400, 500, 600, 1000];

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const SizedBox(height: 16),
          Text(
            isHindi ? '7-दिवसीय दैनिक चेक-इन कैलेंडर 📅' : '7-Day Check-in Routine Calendar 📅',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 8),
          const Text('Check in consecutively to increase your coin streak multipliers.', style: TextStyle(color: Colors.grey, fontSize: 11)),
          const SizedBox(height: 24),

          // Grid View for Calendar days
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 7,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 4,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
            ),
            itemBuilder: (context, idx) {
              final day = idx + 1;
              final coins = dailyRewards[idx];
              final isClaimed = day < 4; // Simulated claim index
              final isToday = day == 4;

              return Card(
                color: isToday 
                    ? AppTheme.primaryPurple 
                    : (isClaimed ? AppTheme.accentMint.withOpacity(0.12) : AppTheme.darkCard),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(
                    color: isToday ? AppTheme.primaryPurple : Colors.white10,
                    width: 2,
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Day $day', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(
                      '₹${(coins / 10).toStringAsFixed(0)}',
                      style: const TextStyle(fontWeight: FontWeight.black, color: AppTheme.goldCoins, fontSize: 14),
                    ),
                    const SizedBox(height: 4),
                    if (isClaimed)
                      const Icon(Icons.check_circle_rounded, color: AppTheme.accentMint, size: 14),
                  ],
                ),
              );
            },
          ),
          const SizedBox(height: 32),
          HapticButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  backgroundColor: AppTheme.successGreen,
                  content: const Text('Check-in submitted! ₹4.00 credited!', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              );
            },
            child: Text(isHindi ? 'चेक-इन करें' : 'CLAIM TODAY\'S PROGRESSIVE GIFT'),
          )
        ],
      ),
    );
  }
}

class Constants {
  static const String dailyAdsWatched = '6';
}
