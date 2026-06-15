import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final topEarners = [
      {'name': 'Aarav_Singh', 'coins': '125,000 Coins', 'prize': '₹5,000 Cash', 'rank': 1},
      {'name': 'Saurabh_99', 'coins': '108,400 Coins', 'prize': '₹2,500 Cash', 'rank': 2},
      {'name': 'Preeti_Gamez', 'coins': '98,200 Coins', 'prize': '₹1,000 Cash', 'rank': 3},
      {'name': 'Raju_Kumar', 'coins': '89,900 Coins', 'prize': '₹500 Cash', 'rank': 4},
      {'name': 'Nisha_Verma', 'coins': '82,100 Coins', 'prize': '₹500 Cash', 'rank': 5},
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Top Weekly Earners 🏆')),
      body: Column(
        children: [
          // Banner layout describing the prize pool
          Container(
            width: double.infinity,
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppTheme.primaryPurple, AppTheme.secondaryCoral],
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Column(
              children: [
                Text(
                  '₹10,000 WEEKLY CASH POOL 🤑',
                  style: TextStyle(fontWeight: FontWeight.black, fontSize: 16, color: Colors.white, letterSpacing: 1.2),
                ),
                SizedBox(height: 6),
                Text(
                  'Top earners are rewarded with direct bank drafts immediately at Sunday midnight midnight.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 11, color: Colors.white70),
                )
              ],
            ),
          ),

          Expanded(
            child: ListView.separated(
              itemCount: topEarners.length,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              separatorBuilder: (context, idx) => const Divider(color: Colors.white10),
              itemBuilder: (context, idx) {
                final user = topEarners[idx];
                final rank = user['rank'] as int;

                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Row(
                        children: [
                          _buildRankMedal(rank),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(user['name'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                              Text(user['coins'] as String, style: const TextStyle(color: Colors.grey, fontSize: 10, fontFamily: 'RobotoMono')),
                            ],
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppTheme.accentMint.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          user['prize'] as String,
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.black, color: AppTheme.accentMint, fontFamily: 'RobotoMono'),
                        ),
                      )
                    ],
                  ),
                );
              },
            ),
          )
        ],
      ),
    );
  }

  Widget _buildRankMedal(int rank) {
    if (rank == 1) {
      return const CircleAvatar(radius: 14, backgroundColor: Colors.amber, child: Text('🥇', style: TextStyle(fontSize: 12)));
    } else if (rank == 2) {
      return const CircleAvatar(radius: 14, backgroundColor: Colors.grey, child: Text('🥈', style: TextStyle(fontSize: 12)));
    } else if (rank == 3) {
      return const CircleAvatar(radius: 14, backgroundColor: Colors.brown, child: Text('🥉', style: TextStyle(fontSize: 12)));
    }
    return CircleAvatar(
      radius: 14,
      backgroundColor: Colors.white12,
      child: Text(rank.toString(), style: const TextStyle(fontSize: 10, color: Colors.white70)),
    );
  }
}
