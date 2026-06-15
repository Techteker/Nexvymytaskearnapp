import React from 'react';
import Head from 'next/head';

export default function LandingPage() {
  const [bilingualLang, setBilingualLang] = React.useState<'en' | 'hi'>('en');

  const content = {
    en: {
      heroTitle: "Earn Extra Daily Cash with Nexvy 🇮🇳",
      heroDesc: "Join India's premier app-gigs network. Complete fast surveys, install hot games, refer friends, and withdraw instant earnings straight to UPI, Paytm, or Bank Accounts.",
      buttonDownload: "Download App App (Get ₹50 Welcome Bonus)",
      featureTitle: "How It Works",
      feat1: "1. Join Simple Tasks",
      feat1Desc: "Log in with phone number or Google and complete simple, audited questionnaires.",
      feat2: "2. Track Real Coins",
      feat2Desc: "See your balances accumulate immediately in the smart, responsive digital wallet index.",
      feat3: "3. Cash-out Instantly",
      feat3Desc: "Request withdraw of minimum ₹50. Funds arrive in minutes via Indian instant gateways.",
      trustTitle: "Why Indian Users Trust Nexvy",
      trustDesc: "No tricky limits. Zero hidden subscriptions. Fully compliant with App Store & Play Store protocols with absolute security.",
    },
    hi: {
      heroTitle: "नक्सवी ऐप से घर बैठे रोजाना पैसे कमाएं 🇮🇳",
      heroDesc: "भारत का प्रमुख रिवॉर्ड्स नेटवर्क। छोटे सर्वे पूरे करें, नए गेम इंस्टॉल करें, दोस्तों को आमंत्रित करें और तुरंत UPI, पेटीएम या सीधे बैंक खाते में भुगतान प्राप्त करें।",
      buttonDownload: "ऐप डाउनलोड करें (₹50 का वेलकम बोनस पाएं)",
      featureTitle: "काम कैसे करता है",
      feat1: "1. साधारण टास्क चुनें",
      feat1Desc: "अपने मोबाइल नंबर से लॉगिन करें और छोटे टास्क तथा सर्वेक्षणों को पूरा करें।",
      feat2: "2. तुरंत कॉइन कमाएं",
      feat2Desc: "आपकी कमाई का एक-एक कॉइन सुरक्षित नक्सवी डिजिटल वॉलेट में तुरंत जमा हो जाता है।",
      feat3: "3. तुरंत अकाउंट में ट्रांसफर",
      feat3Desc: "न्यूनतम ₹50 होते ही सुरक्षित विड्रॉ रिक्वेस्ट भेजें। भुगतान तुरंत आपके बैंक में ट्रांसफर होगा।",
      trustTitle: "भारत का भरोसेमंद प्लेटफार्म",
      trustDesc: "कोई छिपी हुई शर्ते नहीं। पूर्ण रूप से सुरक्षित और कानूनी। आपके डेटा की गोपनीयता ही हमारी सर्वोच्च प्राथमिकता है।",
    }
  };

  const selectedContent = content[bilingualLang];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      <Head>
        <title>Nexvy - India's Smart Rewards App | Extra Earnings Online</title>
        <meta name="description" content="Earn real money with surveys, task completions, watch ads, and share referral links. Direct payouts via UPI and Paytm." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            ⚡
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white italic">Nexvy</span>
        </div>

        {/* Bilingual selector controller */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setBilingualLang(bilingualLang === 'en' ? 'hi' : 'en')}
            className="px-4 py-1.5 border border-slate-800 rounded-full hover:border-indigo-500 hover:text-indigo-400 transition-all font-bold text-xs uppercase"
          >
            🌐 {bilingualLang === 'en' ? "हिंदी भाषा चुनें" : "Switch to English"}
          </button>
        </div>
      </header>

      {/* Hero Body Content */}
      <main className="max-w-7xl mx-auto px-6 py-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold mb-8 text-xs uppercase italic tracking-wider animate-bounce">
          🎉 Double Referral Rewards active this week!
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-white max-w-4xl mb-6">
          {selectedContent.heroTitle}
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 font-medium">
          {selectedContent.heroDesc}
        </p>

        {/* CTA */}
        <button
          onClick={() => alert("Downloading Nexvy Mobile App client...")}
          className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-sm rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all tracking-wider"
        >
          {selectedContent.buttonDownload}
        </button>

        {/* Features list */}
        <section className="mt-32 w-full max-w-5xl">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-slate-200 mb-16">
            {selectedContent.featureTitle}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-900 rounded-3xl text-left border border-slate-800/60 shadow-xl">
              <h3 className="font-bold text-lg text-white mb-3">{selectedContent.feat1}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{selectedContent.feat1Desc}</p>
            </div>
            <div className="p-8 bg-slate-900 rounded-3xl text-left border border-slate-800/60 shadow-xl">
              <h3 className="font-bold text-lg text-white mb-3">{selectedContent.feat2}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{selectedContent.feat2Desc}</p>
            </div>
            <div className="p-8 bg-slate-900 rounded-3xl text-left border border-slate-800/60 shadow-xl">
              <h3 className="font-bold text-lg text-white mb-3">{selectedContent.feat3}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{selectedContent.feat3Desc}</p>
            </div>
          </div>
        </section>

        {/* Trust block */}
        <section className="mt-32 border-t border-slate-900 pt-20 max-w-3xl">
          <span className="text-indigo-400 font-bold uppercase text-xs tracking-widest block mb-4">India's Compliant Platform</span>
          <h3 className="text-3xl font-bold text-white mb-6 uppercase tracking-tight">{selectedContent.trustTitle}</h3>
          <p className="text-slate-400 leading-relaxed text-base font-medium">{selectedContent.trustDesc}</p>
        </section>
      </main>

      {/* Footer copyright */}
      <footer className="mt-32 border-t border-slate-900 bg-slate-950/40 py-12 text-center text-slate-500 text-xs">
        &copy; {new Date().getFullYear()} Nexvy Rewards Networks Inc. Made proudly in India. All registered payouts processed via Razorpay.
      </footer>
    </div>
  );
}
