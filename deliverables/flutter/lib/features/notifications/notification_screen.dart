import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class NotificationScreen extends StatelessWidget {
  const NotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final alerts = [
      {'title': '₹50.00 Referral Bonus Credited 🎉', 'message': 'Your friend Saurabh_99 completed their first task. Check your wallet balance now.', 'time': '2 hours ago', 'cat': 'Referrals'},
      {'title': 'High Payout surveys unlocked', 'message': 'New Premium CPX Opinions surveys are available. Earn up to ₹350.00 inside.', 'time': '5 hours ago', 'cat': 'Earnings'},
      {'title': 'Day 3 Streak claimed ✅', 'message': 'You successfully completed checked-in today. Streak level is at 5 consecutive days.', 'time': '1 day ago', 'cat': 'System'}
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications Hub'),
        actions: [
          IconButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('All alerts marked as read!')),
              );
            },
            icon: const Icon(Icons.done_all_rounded, color: AppTheme.accentMint),
          )
        ],
      ),
      body: ListView.separated(
        itemCount: alerts.length,
        padding: const EdgeInsets.all(16),
        separatorBuilder: (context, index) => const SizedBox(height: 12),
        itemBuilder: (context, idx) {
          final alert = alerts[idx];
          return Card(
            color: AppTheme.darkCard,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryPurple.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          alert['cat']!.toUpperCase(),
                          style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryPurple, fontSize: 8),
                        ),
                      ),
                      Text(alert['time']!, style: const TextStyle(color: Colors.grey, fontSize: 10)),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(alert['title']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white)),
                  const SizedBox(height: 4),
                  Text(alert['message']!, style: const TextStyle(color: Colors.grey, fontSize: 11, height: 1.4)),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
