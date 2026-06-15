import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../main.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/haptic_button.dart';
import '../home/home_screen.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> with SingleTickerProviderStateMixin {
  late AnimationController _logoController;
  late Animation<double> _logoScale;
  
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  
  bool _otpSent = false;
  bool _termsAgreed = false;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _logoController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    );
    _logoScale = CurvedAnimation(parent: _logoController, curve: Curves.elasticOut);
    _logoController.forward();
  }

  @override
  void dispose() {
    _logoController.dispose();
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final language = ref.watch(languageProvider);
    final isHindi = language == 'hi';

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 40),
              // Animated Logo Entrance Module
              ScaleTransition(
                scale: _logoScale,
                child: Hero(
                  tag: 'applogo',
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryPurple.withOpacity(0.12),
                      shape: BoxShape.circle,
                      border: Border.all(color: AppTheme.primaryPurple, width: 2),
                    ),
                    child: const Icon(
                      Icons.electric_bolt_rounded,
                      size: 64,
                      color: AppTheme.accentMint,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Nexvy',
                style: AppTheme.darkTheme.textTheme.displayLarge?.copyWith(
                  fontFamily: 'Poppins',
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.5,
                ),
              ),
              Text(
                isHindi ? 'भारत का प्रीमियम रिवॉर्ड्स ऐप 🇮🇳' : 'India\'s Premium Earnings Hub',
                style: TextStyle(
                  color: Colors.grey.shade400,
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 48),

              // Dynamic entry form
              if (!_otpSent) ...[
                TextFormField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                  decoration: InputDecoration(
                    prefixText: '+91 ',
                    labelText: isHindi ? 'मोबाइल नंबर दर्ज करें' : 'Verify Mobile Number',
                    hintText: '9999999999',
                    prefixIcon: const Icon(Icons.phone_iphone_rounded, color: AppTheme.primaryPurple),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppTheme.primaryPurple, width: 2),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
              ] else ...[
                TextFormField(
                  controller: _otpController,
                  keyboardType: TextInputType.number,
                  obscureText: true,
                  style: const TextStyle(fontFamily: 'RobotoMono', letterSpacing: 8, fontSize: 18),
                  decoration: InputDecoration(
                    labelText: isHindi ? 'अंकों का ओटीपी दर्ज करें' : 'Enter 6-digit OTP',
                    prefixIcon: const Icon(Icons.lock_outline_rounded, color: AppTheme.accentMint),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppTheme.accentMint, width: 2),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
              ],

              const SizedBox(height: 16),
              
              // Terms & Conditions approvals
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Checkbox(
                    value: _termsAgreed,
                    activeColor: AppTheme.primaryPurple,
                    onChanged: (val) {
                      setState(() {
                        _termsAgreed = val ?? false;
                      });
                    },
                  ),
                  Expanded(
                    child: Text(
                      isHindi 
                          ? 'मैं नियम, शर्तों और 18+ वित्तीय आयु सत्यापन से सहमत हूँ।' 
                          : 'I agree to the Indian Privacy terms and age limit policies (18+ only).',
                      style: const TextStyle(fontSize: 11, color: Colors.grey),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              if (_loading)
                const CircularProgressIndicator()
              else
                HapticButton(
                  onPressed: () => _handleMainAction(isHindi),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _otpSent 
                            ? (isHindi ? 'सत्यापन करें' : 'VERIFY OTP & LOG IN')
                            : (isHindi ? 'ओटीपी भेजें' : 'GET ONE-TIME OTP'),
                        style: const TextStyle(fontWeight: FontWeight.black, letterSpacing: 1.2),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.arrow_forward_rounded, size: 20),
                    ],
                  ),
                ),

              const SizedBox(height: 24),
              const Divider(color: Colors.white24, thickness: 1),
              const SizedBox(height: 24),

              // OAuth Social integration
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white10,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                onPressed: () {
                  if (!_termsAgreed) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(isHindi ? 'कृपया नियमों से सहमत हों' : 'Please check the terms first')),
                    );
                    return;
                  }
                  ref.read(authStateProvider.notifier).state = true;
                },
                icon: const Icon(Icons.g_mobiledata, size: 28, color: Colors.blue),
                label: Text(isHindi ? 'गूगल से लॉगिन करें' : 'Continue with Google Account'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _handleMainAction(bool isHindi) {
    if (!_termsAgreed) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(isHindi ? 'कृपया नियमों से सहमत हों' : 'Please check and accept the terms to proceed')),
      );
      return;
    }

    if (!_otpSent) {
      if (_phoneController.text.length < 10) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(isHindi ? 'सही मोबाइल नंबर दर्ज करें' : 'Enter a valid 10-digit phone number')),
        );
        return;
      }
      setState(() {
        _loading = true;
      });
      Future.delayed(const Duration(milliseconds: 800), () {
        setState(() {
          _loading = false;
          _otpSent = true;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(isHindi ? 'ओटीपी भेजा गया!' : 'OTP Sent successfully to +91 ${_phoneController.text}')),
        );
      });
    } else {
      if (_otpController.text.length < 4) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(isHindi ? 'कृपया सही ओटीपी दर्ज करें' : 'Enter valid OTP verification code')),
        );
        return;
      }
      setState(() {
        _loading = true;
      });
      Future.delayed(const Duration(milliseconds: 900), () {
        ref.read(authStateProvider.notifier).state = true;
      });
    }
  }
}
