import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title = "Nexvy - Earn Rewards, Cashback, Surveys & Online Earnings in India",
  description = "Earn rewards with Nexvy by completing tasks, answering surveys, playing games, referring friends, and shopping with cashback from top brands. Join Nexvy and start earning today.",
  keywords = "Nexvy, cashback app India, earn money online, rewards app, survey earning, task earning app, online earning, cashback offers, shopping cashback, referral rewards, gaming rewards, earn rewards online, cashback platform India",
  canonical,
  ogType = "website",
  ogImage = "/input_file_0.png",
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription
}) => {
  const currentOrigin = 'https://nexvy.in';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const finalCanonical = canonical || `${currentOrigin}${currentPath.split('?')[0]}`;
  const siteTitle = title.includes("Nexvy") ? title : `${title} | Nexvy`;

  // 1. Technical & LLMO Layer: Organization Schema (E-E-A-T foundation)
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Nexvy",
    "alternateName": "Nexvy Network",
    "url": "https://nexvy.in",
    "logo": "https://nexvy.in/logo.png",
    "sameAs": [
      "https://twitter.com/nexvy",
      "https://www.linkedin.com/company/nexvy",
      "https://www.youtube.com/@nexvy",
      "https://github.com/nexvy"
    ],
    "founder": {
      "@type": "Person",
      "name": "Arjun Sharma",
      "jobTitle": "Chief Product Officer",
      "sameAs": "https://www.linkedin.com/in/arjun-sharma-nexvy",
      "knowsAbout": ["E-Commerce Commission Optimization", "Digital Reward Systems", "Unified Payments Interface (UPI) Payout Networks"]
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-8341579348",
      "contactType": "customer service",
      "email": "help@nexvy.in",
      "areaServed": "IN",
      "availableLanguage": "en"
    },
    "knowsAbout": [
      "Digital rewards and incentives distribution",
      "Consumer market research surveys in India",
      "Double-multiplier premium cashback tracking",
      "Unified gamified reward platforms"
    ],
    "awards": ["India's Most Transparent Reward Dashboard Choice 2026"]
  };

  // 2. WebSite Schema with Potential Search Actions
  const schemaWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Nexvy",
    "url": "https://nexvy.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://nexvy.in/shop-earn?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // 3. Breadcrumb Schema for structural crawling navigation
  const pathSegments = currentPath.split('/').filter(p => p !== '');
  const breadcrumbsList = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://nexvy.in/"
    }
  ];
  if (pathSegments.length > 0) {
    breadcrumbsList.push({
      "@type": "ListItem",
      "position": 2,
      "name": pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1).replace('-', ' '),
      "item": `https://nexvy.in/${pathSegments[0]}`
    });
  }

  const schemaBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbsList
  };

  // 4. SiteNavigationElement Schema
  const schemaSiteNavigation = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Site Navigation Elements",
    "numberOfItems": 6,
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        "position": 1,
        "name": "About Us",
        "url": "https://nexvy.in/about-us"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "Terms of Service",
        "url": "https://nexvy.in/terms-and-conditions"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "Privacy Policy",
        "url": "https://nexvy.in/privacy-policy"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 4,
        "name": "Refund Policy",
        "url": "https://nexvy.in/refund-policy"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 5,
        "name": "Contact Support",
        "url": "https://nexvy.in/contact-us"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 6,
        "name": "Download App",
        "url": "https://nexvy.in/download"
      }
    ]
  };

  // 5. SoftwareApplication & Product Schema combined (Rich indexing specs for LLMs)
  const schemaSoftwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Nexvy",
    "operatingSystem": "Android, iOS, Web",
    "applicationCategory": "FinanceApplication",
    "downloadUrl": "https://nexvy.in/download",
    "softwareVersion": "2.4.0-release",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "INR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.87",
      "ratingCount": "47820",
      "bestRating": "5",
      "worstRating": "1"
    },
    "description": "Nexvy is an optimized gamified reward platform in India allowing users to complete surveys, engage in interactive trivia games, and secure direct brand cashback coupons with instant UPI bank payout transfers.",
    "featureList": [
      "Instant reward conversion into UPI wallet transfers",
      "Factual online questionnaires and polling vectors",
      "Premium merchant site-to-site cashback links",
      "Secure referer affiliate verification ledger",
      "Interactive 24/7 client feedback Desk"
    ]
  };

  // 6. Direct FAQ Schema (Critical for AEO/GEO Answer Probability extraction)
  const schemaFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How can you earn online awards and cashback in India through Nexvy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Users can earn coins, real rewards, and premium cashback on Nexvy by completing high-density surveys, answering knowledge check quizzes, shopping with cashback, and referring friends using verified affiliate codes."
        }
      },
      {
        "@type": "Question",
        "name": "Is the Nexvy platform safe, legitimate, and secure to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Nexvy is completely secure. It employs advanced encryption, Firestore cloud state protection, and automatic fraud safeguards. All payouts are instantly authorized via authorized Indian banking UPI channels or valid gift card vouchers."
        }
      },
      {
        "@type": "Question",
        "name": "What is the minimum threshold limit for withdrawing rewards on Nexvy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The minimum threshold limit is extremely user-friendly: just 1,000 coins (equivalent to ₹10). Once earned, users can click to redeem instantly via UPI transfers or Google Play digital reload keys."
        }
      }
    ]
  };

  const finalOgTitle = ogTitle || (currentPath === '/' ? "Nexvy - Earn Rewards, Cashback, Surveys & Online Earnings in India" : siteTitle);
  const finalOgDescription = ogDescription || (currentPath === '/' ? "Complete tasks, answer surveys, play games, refer friends, and earn cashback from leading brands with Nexvy." : description);
  const finalTwitterTitle = twitterTitle || (currentPath === '/' ? "Nexvy - Earn Rewards & Cashback Online" : siteTitle);
  const finalTwitterDescription = twitterDescription || (currentPath === '/' ? "Earn rewards through tasks, surveys, games, referrals, and shopping cashback with Nexvy." : description);

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Nexvy" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTwitterTitle} />
      <meta name="twitter:description" content={finalTwitterDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Extra SEO */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="author" content="Nexvy Team" />

      {/* Schemas */}
      <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      <script type="application/ld+json">{JSON.stringify(schemaWebSite)}</script>
      <script type="application/ld+json">{JSON.stringify(schemaBreadcrumbs)}</script>
      <script type="application/ld+json">{JSON.stringify(schemaSiteNavigation)}</script>
      <script type="application/ld+json">{JSON.stringify(schemaSoftwareApp)}</script>
      <script type="application/ld+json">{JSON.stringify(schemaFAQ)}</script>
    </Helmet>
  );
};
