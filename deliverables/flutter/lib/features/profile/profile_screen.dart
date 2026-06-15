import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import '../../main.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/haptic_button.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  bool _kycVerified = false;
  bool _pushNotifications = true;
  String _kycStatusDetail = 'Unsubmitted'; // 'Pending' | 'Verified'

  @override
  Widget build(BuildContext context) {
    final language = ref.watch(languageProvider);
    final isHindi = language == 'hi';

    return Scaffold(
      appBar: AppBar(title: Text(isHindi ? 'प्रोफाइल और सेटिंग्स 👤' : 'My Elite Profile')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Header Profile details helper
          Card(
            color: AppTheme.darkCard,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: const Padding(
              padding: EdgeInsets.all(24.0),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: AppTheme.primaryPurple,
                    child: Icon(Icons.person_rounded, size: 40, color: Colors.white),
                  ),
                  SizedBox(height: 12),
                  Text('Premium_Earner_99', style: TextStyle(fontWeight: FontWeight.black, fontSize: 18)),
                  SizedBox(height: 4),
                  Text('Level 5 Champion Earner', style: TextStyle(color: AppTheme.accentMint, fontSize: 11, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          // KYC verification module section
          _buildKYCSection(isHindi),
          const SizedBox(height: 16),

          // Main Preferences toggles
          const Text('PREFERENCES SETTINGS', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),

          Card(
            color: AppTheme.darkCard,
            child: Column(
              children: [
                // Language select toggle
                ListTile(
                  leading: const Icon(Icons.g_translate_rounded, color: AppTheme.primaryPurple),
                  title: Text(isHindi ? 'भाषा (Language)' : 'bilingual Toggle'),
                  trailing: Switch(
                    activeColor: AppTheme.accentMint,
                    activeTrackColor: AppTheme.primaryPurple.withOpacity(0.5),
                    value: isHindi,
                    onChanged: (val) {
                      ref.read(languageProvider.notifier).state = val ? 'hi' : 'en';
                    },
                  ),
                ),
                // Notification center Preferences Toggle
                ListTile(
                  leading: const Icon(Icons.notifications_active, color: AppTheme.secondaryCoral),
                  title: Text(isHindi ? 'पुश नोटिफिकेशन' : 'Push Notifications'),
                  trailing: Switch(
                    value: _pushNotifications,
                    onChanged: (val) {
                      setState(() {
                        _pushNotifications = val;
                      });
                    },
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Support FAQs
          _buildSupportFAQSection(isHindi),
          const SizedBox(height: 24),

          // Logout Action CTA
          HapticButton(
            color: Colors.redAccent.withOpacity(0.12),
            onPressed: () {
              ref.read(authStateProvider.notifier).state = false;
            },
            child: const Text('LOG OUT SECURELY', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildKYCSection(bool isHindi) {
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
                Text(isHindi ? 'केवाईसी वेरिफिकेशन (PAN/Aadhaar) 🪪' : 'SECURE KYC DOCUMENTS 🪪', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.grey)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _kycVerified ? AppTheme.successGreen.withOpacity(0.12) : Colors.orangeAccent.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    _kycStatusDetail.toUpperCase(),
                    style: TextStyle(color: _kycVerified ? AppTheme.successGreen : Colors.orangeAccent, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                )
              ],
            ),
            const SizedBox(height: 12),
            const Text(
              'Government approved KYC is legally required in India before withdrawals are processed to guarantee transparent transaction auditing.',
              style: TextStyle(color: Colors.grey, fontSize: 11),
            ),
            const SizedBox(height: 16),
            if (!_kycVerified)
              HapticButton(
                padding: const EdgeInsets.symmetric(vertical: 12),
                onPressed: () => _uploadDocuments(),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.upload_file_rounded),
                    SizedBox(width: 8),
                    Text('UPLOAD PAN OR AADHAAR CARD SCREENSHOT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  void _uploadDocuments() async {
    final picker = ImagePicker();
    final file = await picker.pickImage(source: ImageSource.gallery);
    if (file != null) {
      setState(() {
        _kycStatusDetail = 'Pending';
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('KYC documents submitted. Approval will carry out in 24 hours.')),
      );
    }
  }

  Widget _buildSupportFAQSection(bool isHindi) {
    return Card(
      color: AppTheme.darkCard,
      child: ExpansionTile(
        leading: const Icon(Icons.help_center_rounded, color: AppTheme.accentMint),
        title: Text(isHindi ? 'मदद और सहायता (FAQ)' : 'Help & Support Chat FAQ'),
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildFAQRow('What is the minimum withdrawal sum?', 'The absolute minimum withdrawal amount is ₹50.'),
                const Divider(color: Colors.white10),
                _buildFAQRow('How long do UPI withdraw approvals take?', 'We payout instantly via Razorpay. It maximum takes up to 4 hours in case of network traffic congestions.'),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildFAQRow(String q, String a) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(q, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          const SizedBox(height: 2),
          Text(a, style: const TextStyle(fontSize: 11, color: Colors.grey)),
        ],
      ),
    );
  }
}
