import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class CoinCounter extends StatelessWidget {
  final int value;
  final double size;

  const CoinCounter({
    super.key,
    required this.value,
    this.size = 24.0,
  });

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0.0, end: value.toDouble()),
      duration: const Duration(milliseconds: 1200),
      curve: Curves.easeOutQuad,
      builder: (context, animatedValue, child) {
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.monetization_on,
              color: AppTheme.goldCoins,
              size: size,
            ),
            const SizedBox(width: 4),
            Text(
              animatedValue.toInt().toString(),
              style: TextStyle(
                fontFamily: 'RobotoMono',
                fontWeight: FontWeight.bold,
                fontSize: size * 0.85,
                color: AppTheme.goldCoins,
              ),
            ),
          ],
        );
      },
    );
  }
}
