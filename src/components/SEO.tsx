import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title = "Nexvy - Earn Rewards & Complete Tasks",
  description = "Join Nexvy today to earn coins, play quizzes, and complete tasks. The ultimate platform for micro-earning and rewards.",
  keywords = "earn money, online rewards, microtasks, rewards app, nexvy, cryptocurrency rewards",
  canonical = "https://nexvy.com",
  ogType = "website",
  ogImage = "/og-image.png"
}) => {
  const siteTitle = title.includes("Nexvy") ? title : `${title} | Nexvy`;

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Nexvy" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Extra SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Nexvy Team" />
    </Helmet>
  );
};
