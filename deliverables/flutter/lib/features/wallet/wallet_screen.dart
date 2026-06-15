import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../main.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/haptic_button.dart';

class WalletScreen extends ConsumerStatefulWidget {
  const WalletScreen({super.key});

  @override
  ConsumerState<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends ConsumerState<WalletScreen> {
  final _upiController = TextEditingController();
  final _paytmController = TextEditingController();
  final _bankAccountController = TextEditingController();
  final _ifscController = TextEditingController();

  String _payoutMethod = 'UPI'; // 'UPI' | 'Paytm' | 'Bank'
  int _amountToWithdraw = 50; // In Rupees

  @override
  void dispose() {
    _upiController.dispose();
    _paytmController.dispose();
    _bankAccountController.dispose();
    _ifscController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final language = ref.watch(languageProvider);
    final isHindi = language == 'hi';

    return Scaffold(
      appBar: AppBar(title: Text(isHindi ? 'बैलेंस व वॉलेट 👛' : 'Nexvy secure Wallet')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Earning statistics card
            Card(
              color: AppTheme.darkCard,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(isHindi ? 'कुल बैलेंस' : 'TOTAL REWARD BALANCE', style: const TextStyle(fontSize: 10, color: Colors.grey)),
                            const SizedBox(height: 6),
                            const Text(
                              '₹852.00',
                              style: TextStyle(fontSize: 32, fontWeight: FontWeight.black, color: AppTheme.accentMint),
                            ),
                          ],
                        ),
                        const Icon(Icons.account_balance_wallet_rounded, size: 40, color: AppTheme.accentMint)
                      ],
                    ),
                    const Divider(color: Colors.white12, height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildStat('Pending Coins', '₹152.00'),
                        _buildStat('Lifetime Earned', '₹2,450.00'),
                      ],
                    )
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Select payout options
            const Text('SELECT PAYMENT CHANNEL ⚡', style: TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Row(
              children: [
                _buildMethodSelector('UPI', Icons.phone_android_rounded),
                const SizedBox(width: 8),
                _buildMethodSelector('Paytm', Icons.payment_rounded),
                const SizedBox(width: 8),
                _buildMethodSelector('Bank', Icons.account_balance_rounded),
              ],
            ),
            const SizedBox(height: 20),

            // Dynamic Form based on selected payout channel
            if (_payoutMethod == 'UPI') ...[
              TextFormField(
                controller: _upiController,
                style: const TextStyle(fontWeight: FontWeight.bold),
                decoration: InputDecoration(
                  labelText: isHindi ? 'UPI आईडी दर्ज करें (जैसे index@oksbi)' : 'Enter Valid UPI ID (e.g. name@paytm)',
                  prefixIcon: const Icon(Icons.alternate_email_rounded, color: AppTheme.primaryPurple),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ] else if (_payoutMethod == 'Paytm') ...[
              TextFormField(
                controller: _paytmController,
                keyboardType: TextInputType.phone,
                style: const TextStyle(fontWeight: FontWeight.bold),
                decoration: InputDecoration(
                  labelText: isHindi ? 'पेटीएम नंबर' : 'Enter 10-digit Paytm Mobile Number',
                  prefixIcon: const Icon(Icons.phone_rounded, color: AppTheme.primaryPurple),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ] else ...[
              TextFormField(
                controller: _bankAccountController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: 'Account Number',
                  prefixIcon: const Icon(Icons.format_list_numbered_rounded),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _ifscController,
                textCapitalization: TextCapitalization.characters,
                decoration: InputDecoration(
                  labelText: '11-digit Bank IFSC Code',
                  prefixIcon: const Icon(Icons.domain_rounded),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],

            const SizedBox(height: 24),
            Text(isHindi ? 'निकासी राशि (न्यूनतम ₹50)' : 'WITHDRAWAL AMOUNT', style: const TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [50, 100, 200, 500].map((rupee) {
                final isSelected = _amountToWithdraw == rupee;
                return ChoiceChip(
                  label: Text('₹$rupee'),
                  selected: isSelected,
                  selectedColor: AppTheme.primaryPurple,
                  onSelected: (val) {
                    setState(() {
                      _amountToWithdraw = rupee;
                    });
                  },
                );
              }).toList(),
            ),

            const SizedBox(height: 32),
            HapticButton(
              onPressed: () => _triggerWithdrawal(isHindi),
              child: SizedBox(
                width: double.infinity,
                child: Text(
                  isHindi ? 'सत्यापन करके निकालें' : 'REQUEST INSTANT WITHDRAWAL',
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontWeight: FontWeight.black, letterSpacing: 1.2),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStat(String label, String val) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey)),
        const SizedBox(height: 4),
        Text(val, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white)),
      ],
    );
  }

  Widget _buildMethodSelector(String method, IconData icon) {
    final isSelected = _payoutMethod == method;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _payoutMethod = method;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? AppTheme.primaryPurple : AppTheme.darkCard,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: isSelected ? Colors.transparent : Colors.white24),
          ),
          child: Column(
            children: [
              Icon(icon, color: isSelected ? Colors.white : Colors.grey),
              const SizedBox(height: 6),
              Text(method, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }

  void _triggerWithdrawal(bool isHindi) {
    if (_payoutMethod == 'UPI' && _upiController.text.length < 5) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(isHindi ? 'कृपया सही यूज़र्स UPI आईडी भरें' : 'Enter a valid UPI address')),
      );
      return;
    }
    if (_payoutMethod == 'Paytm' && _paytmController.text.length < 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(isHindi ? 'कृपया 10-अंकीय पेटीएम नंबर दर्ज करें' : 'Enter 10-digit Paytm registered Mobile Number')),
      );
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: AppTheme.successGreen,
        content: Text(
          isHindi 
              ? 'निकासी अनुरोध सफल! ₹$_amountToWithdraw.00 आपके खाते में क्रेडिट कर दिया जाएगा।' 
              : 'Withdrawal of ₹$_amountToWithdraw.00 requested via $_payoutMethod! Track status in history.',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
