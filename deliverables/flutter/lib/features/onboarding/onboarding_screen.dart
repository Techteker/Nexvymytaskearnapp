import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../main.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/haptic_button.dart';
import '../auth/login_screen.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  Widget build(BuildContext context) {
    final language = ref.watch(languageProvider);
    final isHindi = language == 'hi';

    final slides = [
      {
        'title': isHindi ? 'हैलो! पैसे कमाना शुरू करें 💰' : 'Earn Daily Coins & Rewards',
        'desc': isHindi
            ? 'सर्वेक्षण और साधारण टास्क पूरे करके ₹500 तक का वेलकम बोनस जीतें।'
            : 'Complete simple micro-gigs, custom offers, and watch exciting short ads to earn coins.',
        'image': Icons.monetization_on,
      },
      {
        'title': isHindi ? 'तुरंत सुरक्षित निकासी ⚡' : 'Instant & Bulletproof Payouts',
        'desc': isHindi
            ? 'अपने बैंक खाते, Paytm या UPI (GPay/PhonePe) पर सीधे पैसे ट्रांसफर करें।'
            : 'Convert your coins and instantly withdraw straight to UPI, Paytm, or secure Bank Transfer.',
        'image': Icons.account_balance_wallet,
      },
      {
        'title': isHindi ? 'अपने दोस्तों को भेजें 🤝' : 'Refer Friends & Double Income',
        'desc': isHindi
            ? 'हर नए दोस्त के जुड़ने पर आपको मिलेगा ₹50 का अतिरिक्त बोनस। बोनस कमाना बेहद आसान!'
            : 'Share your personal referral link with UTM markers to earn ₹50 commission on every signup.',
        'image': Icons.people_alt,
      }
    ];

    return Scaffold(
      appBar: AppBar(
        actions: [
          // Elegant Language selector hook
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10),
            decoration: BoxDecoration(
              border: Border.all(color: AppTheme.primaryPurple.withOpacity(0.5)),
              borderRadius: BorderRadius.circular(20),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: language,
                dropdownColor: AppTheme.darkCard,
                items: const [
                  DropdownMenuItem(value: 'en', child: Text('English', style: TextStyle(fontSize: 12))),
                  DropdownMenuItem(value: 'hi', child: Text('हिंदी', style: TextStyle(fontSize: 12))),
                ],
                onChanged: (val) {
                  if (val != null) {
                    ref.read(languageProvider.notifier).state = val;
                  }
                },
              ),
            ),
          ),
          TextButton(
            onPressed: () => _goToLogin(context),
            child: Text(
              isHindi ? 'छोड़ें' : 'Skip',
              style: const TextStyle(color: Colors.grey, fontWeight: FontWeight.bold),
            ),
          )
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                itemCount: slides.length,
                onPageChanged: (idx) {
                  setState(() {
                    _currentPage = idx;
                  });
                },
                itemBuilder: (context, idx) {
                  final slide = slides[idx];
                  return Padding(
                    padding: const EdgeInsets.all(32.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircleAvatar(
                          radius: 70,
                          backgroundColor: AppTheme.primaryPurple.withOpacity(0.1),
                          child: Icon(
                            slide['image'] as IconData,
                            size: 70,
                            color: AppTheme.primaryPurple,
                          ),
                        ),
                        const SizedBox(height: 48),
                        Text(
                          slide['title'] as String,
                          textAlign: TextAlign.center,
                          style: AppTheme.darkTheme.textTheme.titleLarge?.copyWith(fontSize: 24),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          slide['desc'] as String,
                          textAlign: TextAlign.center,
                          style: AppTheme.darkTheme.textTheme.bodyMedium?.copyWith(height: 1.5),
                        ),
                      ],
                    );
                  },
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                slides.length,
                (index) => AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: _currentPage == index ? 24 : 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: _currentPage == index ? AppTheme.primaryPurple : Colors.grey,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 40),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32.0),
              child: HapticButton(
                onPressed: () {
                  if (_currentPage < slides.length - 1) {
                    _pageController.nextPage(
                      duration: const Duration(milliseconds: 450),
                      curve: Curves.easeOutCubic,
                    );
                  } else {
                    _goToLogin(context);
                  }
                },
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      _currentPage == slides.length - 1 
                        ? (isHindi ? 'शुरू करें (गेट ₹500)' : 'GET ₹500 WELCOME BONUS')
                        : (isHindi ? 'आगे बढ़ें' : 'CONTINUE'),
                      style: const TextStyle(fontWeight: FontWeight.black, letterSpacing: 1.2),
                    ),
                    const SizedBox(width: 8),
                    const Icon(Icons.arrow_forward_rounded),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }

  void _goToLogin(BuildContext context) {
    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        pageBuilder: (context, anim, sec) => const LoginScreen(),
        transitionsBuilder: (context, anim, sec, child) {
          return FadeTransition(opacity: anim, child: child);
        },
      ),
    );
  }
}
