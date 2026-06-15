import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:hive_flutter/hive_flutter.dart';

import 'core/theme/app_theme.dart';
import 'features/onboarding/onboarding_screen.dart';
import 'features/home/home_screen.dart';

// Riverpod Local Authentication state provider
final authStateProvider = StateProvider<bool>((ref) => false);

// Riverpod Selected Language provider (Bilingual: English / Hindi)
final languageProvider = StateProvider<String>((ref) => 'en'); // 'en' or 'hi'

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set status bar styles elegantly for immersive mobile viewports
  SystemChrome.setSystemUIOverlayStyle(const SystemOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.light,
    systemNavigationBarColor: Color(0xFF0F0E17),
    systemNavigationBarIconBrightness: Brightness.light,
  ));

  // Initialize native local caching, Google Ads, and secure Firebase connection
  try {
    await Firebase.initializeApp();
    await MobileAds.instance.initialize();
    await Hive.initFlutter();
    await Hive.openBox('settings');
  } catch (e) {
    debugPrint("Background systems loading fallback state: $e");
  }

  runApp(
    const ProviderScope(
      child: NexvyApp(),
    ),
  );
}

class NexvyApp extends ConsumerWidget {
  const NexvyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isLoggedIn = ref.watch(authStateProvider);
    final language = ref.watch(languageProvider);

    return MaterialApp(
      title: 'Nexvy',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark, // Standard luxury Dark theme is preferred by default
      darkTheme: AppTheme.darkTheme,
      locale: Locale(language),
      home: isLoggedIn ? const HomeScreen() : const OnboardingScreen(),
    );
  }
}
