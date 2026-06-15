import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../main.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/coin_counter.dart';
import '../earn/earn_screen.dart';
import '../wallet/wallet_screen.dart';
import '../referral/referral_screen.dart';
import '../profile/profile_screen.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _currentIndex = 0;
  int _streakActiveDays = 4;
  int _currentBalance = 12500;

  final List<Widget> _tabs = [
    const HomeDashboard(),
    const EarnScreen(),
    const WalletScreen(),
    const ReferralScreen(),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _tabs[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_filled), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.monetization_on_rounded), label: 'Earn'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet_rounded), label: 'Wallet'),
          BottomNavigationBarItem(icon: Icon(Icons.people_alt_rounded), label: 'Refer'),
          BottomNavigationBarItem(icon: Icon(Icons.face_rounded), label: 'Profile'),
        ],
      ),
    );
  }
}

class HomeDashboard extends ConsumerWidget {
  const HomeDashboard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final language = ref.watch(languageProvider);
    final isHindi = language == 'hi';

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Row(
          children: [
            const CircleAvatar(
              radius: 18,
              backgroundImage: Network Olivia(
                  'https://api.dicebear.com/7.x/avataaars/svg?seed=VIP_Earn_User'),
            ),
            const SizedBox(width: 8),
            Text(
              isHindi ? 'नमस्ते, अर्नर्स! 👋' : 'Namaste, Earners! 👋',
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Badge(
              label: Text('3'),
              child: Icon(Icons.notifications_active_rounded, color: AppTheme.primaryPurple),
            ),
          )
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await Future.delayed(const Duration(seconds: 1));
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Balance Counter Widget card
              Card(
                color: AppTheme.darkCard,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            isHindi ? 'वर्तमान कॉइन बैलेंस' : 'CURRENT COIN BALANCE',
                            style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 8),
                          const CoinCounter(value: 85200, size: 28),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: AppTheme.accentMint.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '≈ ₹852.00',
                          style: const TextStyle(color: AppTheme.accentMint, fontWeight: FontWeight.bold, fontFamily: 'RobotoMono'),
                        ),
                      )
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Streak system + Today's budget milestones
              Row(
                children: [
                  Expanded(
                    child: Card(
                      color: AppTheme.darkCard,
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Row(
                          children: [
                            const Text('🔥  ', style: TextStyle(fontSize: 22)),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  isHindi ? 'दैनिक स्ट्रीक' : 'Daily Streak',
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                                ),
                                const Text('5 Days Active', style: TextStyle(color: Colors.grey, fontSize: 10)),
                              ],
                            )
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Card(
                      color: AppTheme.darkCard,
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Row(
                          children: [
                            const Icon(Icons.bolt_rounded, color: AppTheme.secondaryCoral),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    isHindi ? 'दैनिक लक्ष्य' : 'Today\'s Goal',
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                                  ),
                                  const ClipRRect(
                                    borderRadius: BorderRadius.all(Radius.circular(4)),
                                    child: LinearProgressIndicator(value: 0.65, color: AppTheme.primaryPurple, minHeight: 4),
                                  ),
                                ],
                              ),
                            )
                          ],
                        ),
                      ),
                    ),
                  )
                ],
              ),
              const SizedBox(height: 24),

              // Featured task carousels
              const Text('FEATURED QUESTS 🔥', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
              const SizedBox(height: 10),
              SizedBox(
                height: 140,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: [
                    _buildFeaturedCard('CPX Opinion Surveys', 'Earn up to ₹250 per survey', Colors.blue),
                    _buildFeaturedCard('Thar Monthly Challenge', 'Collect 10 task stars to enter', Colors.deepOrange),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Quick Actions Grid (4 Icons)
              const Text('QUICK EARNING PORTALS 🚀', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
              const SizedBox(height: 12),
              GridView.count(
                shrinkWrap: true,
                crossAxisCount: 2,
                childAspectRatio: 1.6,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                physics: const NeverScrollableScrollPhysics(),
                children: [
                  _buildQuickAction(context, Icons.question_answer_outlined, isHindi ? 'सर्वेक्षण' : 'Surveys', Colors.purple),
                  _buildQuickAction(context, Icons.task_alt_rounded, isHindi ? 'टास्क' : 'General Tasks', Colors.blue),
                  _buildQuickAction(context, Icons.play_circle_fill_rounded, isHindi ? 'वीडियो' : 'Watch Ads', Colors.amber),
                  _buildQuickAction(context, Icons.share_rounded, isHindi ? 'रेफ़र करें' : 'Refer & Earn', Colors.pink),
                ],
              ),
              const SizedBox(height: 24),

              // Mini Leaderboard widget
              Card(
                color: Colors.white.withOpacity(0.04),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          Text(
                            isHindi ? 'शीर्ष कमाई करने वाले' : 'WEEKLY LEADERBOARD 🏆',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.grey),
                          ),
                          const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: Colors.grey),
                        ],
                      ),
                      const Divider(color: Colors.white10, height: 16),
                      _buildLeaderboardRow(1, 'Saurabh_99', '8,500 Coins', Colors.amber),
                      _buildLeaderboardRow(2, 'Preeti_Gamez', '7,200 Coins', Colors.grey),
                      _buildLeaderboardRow(3, 'Raju_Kumar', '6,900 Coins', Colors.brown),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeaturedCard(String title, String desc, Color color) {
    return Container(
      width: 250,
      margin: const EdgeInsets.only(right: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [color.withOpacity(0.8), color]),
        borderRadius: BorderRadius.circular(16),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Icon(Icons.flash_on_rounded, color: Colors.white, size: 28),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 14)),
              const SizedBox(height: 4),
              Text(desc, style: const TextStyle(color: Colors.white70, fontSize: 11)),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildQuickAction(BuildContext context, IconData icon, String label, Color color) {
    return Card(
      color: AppTheme.darkCard,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {},
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              CircleAvatar(
                backgroundColor: color.withOpacity(0.2),
                child: Icon(icon, color: color, size: 20),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLeaderboardRow(int rank, String name, String coins, Color medalColor) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 10,
                backgroundColor: medalColor,
                child: Text(rank.toString(), style: const TextStyle(fontSize: 10, color: Colors.white)),
              ),
              const SizedBox(width: 8),
              Text(name, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
            ],
          ),
          Text(coins, style: const TextStyle(fontSize: 11, fontFamily: 'RobotoMono', color: Colors.amber)),
        ],
      ),
    );
  }
}

// Dummy mapping network Olivia
class Network {
  final String url;
  const Network(this.url);
}

extension on CircleAvatar {
  static CircleAvatar parse({required double radius, required Network image}) {
    return CircleAvatar(radius: radius, backgroundImage: NetworkImage(image.url));
  }
}
class Network Olivia extends NetworkImage {
  Network Olivia(String url) : super(url);
}
