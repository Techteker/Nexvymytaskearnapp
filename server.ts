import express from "express";
import path from "path";
import fs from "fs";
import compression from "compression";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment.");
  }
  if (!ai) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Response Compression for high performance (gzip)
  app.use(compression());

  // Parser for JSON/urlencoded request bodies with generous limits for base64 logo/proof images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // CPX Research Server-to-Server (S2S) Postback Endpoint for secure instant coin rewards
  app.get("/cpx-postback", async (req, res) => {
    try {
      const status = req.query.status ? String(req.query.status) : "";
      const trans_id = req.query.trans_id ? String(req.query.trans_id) : "";
      const user_id = req.query.user_id ? String(req.query.user_id) : "";
      const amount_local = req.query.amount_local ? Number(req.query.amount_local) : 0;
      const amount_usd = req.query.amount_usd ? String(req.query.amount_usd) : "";
      const hash = req.query.hash ? String(req.query.hash) : "";

      console.log(`[CPX-S2S] Postback call received:`, { status, trans_id, user_id, amount_local, amount_usd, hash });

      if (!user_id || !amount_local) {
        console.warn(`[CPX-S2S] Warning: Missing user_id or amount_local.`);
        return res.status(400).send("No user_id or amount_local provided");
      }

      // Verifying Secure Hash (optional/recommended fallback)
      const SECURITY_HASH = "0cU7Ej7svIbERoJI9Z76AGYrgBudV0Y2";
      const crypto = await import("crypto");
      
      const md5One = crypto.createHash("md5").update(`${trans_id}-${SECURITY_HASH}`).digest("hex");
      const md5Two = crypto.createHash("md5").update(`${user_id}-${SECURITY_HASH}`).digest("hex");

      const isVerified = (hash === md5One) || (hash === md5Two);
      if (!isVerified && hash) {
        console.warn(`[CPX-S2S] Warning: Hash mismatch. Expected formulas to yield either ${md5One} or ${md5Two}, received: ${hash}`);
      }

      // Read values from environment or fallback values
      const endpoint = process.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
      const projectId = process.env.VITE_APPWRITE_PROJECT_ID || "6a016eac001c0af48909";
      const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || "67d163d8000b08051772";
      const apiKey = process.env.APPWRITE_API_KEY;

      if (!apiKey) {
        console.error(`[CPX-S2S] APPWRITE_API_KEY is not defined in environment variables. S2S updates disabled.`);
        return res.status(500).send("Server configured incorrectly (missing APPWRITE_API_KEY)");
      }

      // Query standard Appwrite Document Endpoint
      const userDocUrl = `${endpoint}/databases/${databaseId}/collections/users/documents/${user_id}`;
      
      const userSearchRes = await fetch(userDocUrl, {
        method: "GET",
        headers: {
          "X-Appwrite-Project": projectId,
          "X-Appwrite-Key": apiKey,
          "Content-Type": "application/json"
        }
      });

      if (!userSearchRes.ok) {
        const errDesc = await userSearchRes.text();
        console.error(`[CPX-S2S] User profile not found or read error: ${errDesc}`);
        return res.status(404).send(`User not found: ${errDesc}`);
      }

      const userProfile: any = await userSearchRes.json();
      const currentCoins = Number(userProfile.coins || 0);
      const newCoinsSum = currentCoins + amount_local;

      // Update User coins balance in Appwrite
      const pRes = await fetch(userDocUrl, {
        method: "PATCH",
        headers: {
          "X-Appwrite-Project": projectId,
          "X-Appwrite-Key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: {
            coins: newCoinsSum
          }
        })
      });

      if (!pRes.ok) {
        const errorDesc = await pRes.text();
        console.error(`[CPX-S2S] Appwrite profile coin update failed: ${errorDesc}`);
        return res.status(500).send(`Appwrite update failed: ${errorDesc}`);
      }

      // Create Document in Transactions collection
      try {
        const newTransId = trans_id || `s2s_${Date.now()}`;
        const transactionUrl = `${endpoint}/databases/${databaseId}/collections/transactions/documents`;
        await fetch(transactionUrl, {
          method: "POST",
          headers: {
            "X-Appwrite-Project": projectId,
            "X-Appwrite-Key": apiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            documentId: `cpx_${newTransId}`,
            data: {
              userId: user_id,
              amount: amount_local,
              type: "cpx_survey",
              description: `CPX Research Survey Reward (Trans: ${trans_id || 'N/A'})`,
              status: "completed",
              createdAt: new Date().toISOString()
            },
            permissions: [
              `read("any")`
            ]
          })
        });
        console.log(`[CPX-S2S] Transaction record successfully written: cpx_${newTransId}`);
      } catch (transErr: any) {
        console.warn(`[CPX-S2S] Balanced updated but transaction logging warning: ${transErr.message}`);
      }

      console.log(`[CPX-S2S] Successfully added ${amount_local} coins to user ${user_id}.`);
      return res.status(200).send("OK_POSTBACK");
    } catch (error: any) {
      console.error(`[CPX-S2S] Critical processing error:`, error.message || error);
      return res.status(500).send("Internal server S2S error");
    }
  });

  // Brand Logo APIs (Persistent branding configuration inside files)
  app.get("/api/get-logo", (req, res) => {
    try {
      const configPath = path.resolve(process.cwd(), "logo_config.json");
      if (fs.existsSync(configPath)) {
        const raw = fs.readFileSync(configPath, "utf-8");
        const data = JSON.parse(raw);
        return res.json({ logoUrl: data.logoUrl || "/input_file_0.png" });
      }
    } catch (e) {
      console.warn("[LOGO-SERVER] Failed to read logo config:", e);
    }
    return res.json({ logoUrl: "/input_file_0.png" });
  });

  app.post("/api/save-logo", (req, res) => {
    try {
      const { logoUrl } = req.body;
      const configPath = path.resolve(process.cwd(), "logo_config.json");
      fs.writeFileSync(configPath, JSON.stringify({ logoUrl }, null, 2), "utf-8");
      return res.json({ success: true, logoUrl });
    } catch (e: any) {
      console.error("[LOGO-SERVER] Failed to save logo config:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  // Server-side AI Quiz Generation Endpoint
  app.post("/api/generate-quiz", async (req, res) => {
    try {
      const { topic, category, count, difficulty, language } = req.body;
      const finalTopic = topic || category || "General Knowledge";
      const finalCount = Number(count) || 5;
      const finalDifficulty = difficulty || "medium";
      const finalLanguage = language || "en";

      const client = getGenAI();
      const prompt = `
        Generate a quiz about "${finalTopic}" with ${finalCount} multiple choice questions.
        Difficulty level: ${finalDifficulty}.
        Language: ${finalLanguage === 'hi' ? 'Hindi' : 'English'}.
        Return as a JSON array of objects with:
        - 'question': the quiz question
        - 'options': an array of exactly 4 strings
        - 'correctAnswer': index of the correct option (0, 1, 2, or 3)
      `;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                correctAnswer: { type: Type.INTEGER }
              },
              required: ["question", "options", "correctAnswer"]
            }
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini source model");
      }

      const quizList = JSON.parse(text);
      // Clean and standardize fields for ultimate client screen compatibility
      const standardizedQuiz = quizList.map((q: any, idx: number) => {
        const correctIdx = q.correctAnswer !== undefined ? q.correctAnswer : (q.correct !== undefined ? q.correct : 0);
        return {
          id: idx + 1,
          question: q.question,
          options: Array.isArray(q.options) ? q.options : ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: correctIdx,
          correct: correctIdx
        };
      });

      return res.status(200).json(standardizedQuiz);
    } catch (error: any) {
      console.error("[GEMINI-SERVER-QUIZ] Error generating quiz:", error);
      return res.status(500).json({ error: error.message || "Failed to generate quiz with AI." });
    }
  });

  // 2. Performance SEO: Response time monitoring logger (TTFB tracing)
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      if (duration > 500) {
        console.warn(`[SEO-PERF] Slow response detected: ${req.method} ${req.url} took ${duration}ms`);
      }
    });
    next();
  });

  // 3. Security SEO & Clean URLs (Redirect double slashes, force clean paths)
  app.use((req, res, next) => {
    // Basic Security Headers to boost SEO rating (HSTS and Mime sniff prevention)
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    if (process.env.NODE_ENV === "production" && req.headers["x-forwarded-proto"] === "http") {
      // Force HTTPS redirect on production to avoid duplicate HTTP/HTTPS index
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });

  // 4. XML Sitemap Generator
  app.get("/sitemap.xml", (req, res) => {
    const siteUrl = process.env.VITE_SITE_URL || `https://${req.headers.host || "www.nexvy.in"}`;
    const currentDate = new Date().toISOString().split("T")[0];

    // Priority site pages
    const routes = [
      { path: "/", priority: "1.0", changefreq: "daily" },
      { path: "/tasks", priority: "0.9", changefreq: "daily" },
      { path: "/quizzes", priority: "0.8", changefreq: "daily" },
      { path: "/shop-earn", priority: "0.8", changefreq: "daily" },
      { path: "/spinner", priority: "0.7", changefreq: "weekly" },
      { path: "/daily-gift", priority: "0.7", changefreq: "weekly" },
      { path: "/leaderboard", priority: "0.6", changefreq: "daily" },
      { path: "/referral", priority: "0.7", changefreq: "weekly" },
      { path: "/privacy-policy", priority: "0.5", changefreq: "monthly" },
      { path: "/about", priority: "0.5", changefreq: "monthly" },
      { path: "/about-us", priority: "0.5", changefreq: "monthly" },
      { path: "/terms", priority: "0.5", changefreq: "monthly" },
      { path: "/terms-and-conditions", priority: "0.5", changefreq: "monthly" },
      { path: "/refund-policy", priority: "0.5", changefreq: "monthly" },
      { path: "/contact", priority: "0.5", changefreq: "monthly" },
      { path: "/contact-us", priority: "0.5", changefreq: "monthly" },
      { path: "/download", priority: "0.8", changefreq: "weekly" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    routes.forEach((route) => {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}${route.path}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml; charset=utf-8");
    res.header("Cache-Control", "public, max-age=86400"); // 24 hours client/edge cache
    res.send(xml);
  });

  // 5. Robots.txt Router
  app.get("/robots.txt", (req, res) => {
    const siteUrl = process.env.VITE_SITE_URL || `https://${req.headers.host || "www.nexvy.in"}`;
    const robots = [
      "User-agent: *",
      "Allow: /",
      "Allow: /tasks",
      "Allow: /quizzes",
      "Allow: /shop-earn",
      "Allow: /spinner",
      "Allow: /daily-gift",
      "Allow: /leaderboard",
      "Allow: /referral",
      "Allow: /privacy-policy",
      "Allow: /about",
      "Allow: /about-us",
      "Allow: /terms",
      "Allow: /terms-and-conditions",
      "Allow: /refund-policy",
      "Allow: /contact",
      "Allow: /contact-us",
      "Allow: /download",
      "",
      "# Block admin area, private user panels, search duplication and APIs",
      "Disallow: /admin",
      "Disallow: /admin/*",
      "Disallow: /profile",
      "Disallow: /withdraw",
      "Disallow: /api/*",
      "Disallow: /*?*", // Avoid query-string-based duplicate index issues
      "",
      `Sitemap: ${siteUrl}/sitemap.xml`,
    ].join("\n");

    res.header("Content-Type", "text/plain");
    res.send(robots);
  });

  // 6. Hook for Search Console site verification file serving dynamically
  app.get(/\/google.*\.html$/, (req, res) => {
    const filename = path.basename(req.path);
    const configuredVerification = process.env.GOOGLE_SEARCH_CONSOLE_ID;
    
    if (configuredVerification && filename.includes(configuredVerification)) {
      res.send(`google-site-verification: ${filename}`);
    } else {
      res.status(404).send("Verification file not found");
    }
  });

  // 7. Dynamic SEO Tag Pre-rendering middleware for index.html
  const injectSEOTags = (html: string, originalUrl: string, host: string) => {
    const siteUrl = process.env.VITE_SITE_URL || `https://${host}`;
    const canonicalUrl = `${siteUrl}${originalUrl.split("?")[0]}`;
    
    // Meta mappings to cover all pages dynamically
    let seo: any = {
      title: "Nexvy - Earn Money Online, Surveys, Cashback & Reward App India",
      description: "Nexvy is an all-in-one earning platform where users can complete surveys, do tasks, refer friends, and get cashback rewards. Start earning real money online with instant payouts and simple activities designed for everyone.",
      keywords: "Nexvy, earn money online, surveys app, cashback India, reward app, refer friends, complete tasks, instant payouts",
      robots: "index, follow",
      ogType: "website",
      ogImage: `${siteUrl}/input_file_0.png`,
    };

    const pathPart = originalUrl.split("?")[0].toLowerCase();

    // Map specific paths to unique metadata
    if (pathPart === "/") {
      seo.title = "Nexvy - Earn Money Online, Surveys, Cashback & Reward App India";
      seo.description = "Nexvy is an all-in-one earning platform where users can complete surveys, do tasks, refer friends, and get cashback rewards. Start earning real money online with instant payouts and simple activities designed for everyone.";
      seo.ogTitle = "Nexvy - Earn Money Online, Surveys, Cashback & Reward App India";
      seo.ogDescription = "Complete surveys, do tasks, refer friends, and get cashback rewards. Start earning real money online with instant payouts and simple activities on Nexvy.";
      seo.twitterTitle = "Nexvy - Earn Money Online, Surveys, Cashback & Reward App India";
      seo.twitterDescription = "Nexvy is an all-in-one earning platform where users can complete surveys, do tasks, refer friends, and get cashback rewards. Start earning real money online with instant payouts and simple activities.";
    } else if (pathPart === "/tasks") {
      seo.title = "Explore Earning Tasks | Nexvy App";
      seo.description = "Dozens of micro-tasks are active. Complete surveys, watch short videos, play games and get instant Nexvy coins directly into your digital wallet.";
    } else if (pathPart.startsWith("/task/")) {
      seo.title = "Complete Micro-Task for Rewards | Nexvy";
      seo.description = "View specific task guidelines, submit required verification credentials, and track your wallet coins payout online on Nexvy.";
    } else if (pathPart === "/quizzes") {
      seo.title = "Play Daily AI Quizzes & Trivia Games | Nexvy";
      seo.description = "Boost your knowledge and secure payouts by taking our daily trivia quizzes. Play mathematics, history, sci-tech, and custom general knowledge tests.";
    } else if (pathPart.startsWith("/quiz/")) {
      seo.title = "Active AI Trivia Contest | Nexvy";
      seo.description = "Complete this trivia round honestly. Get perfect scores and unlock massive multiplayer coin multiplier levels!";
    } else if (pathPart === "/shop-earn") {
      seo.title = "Shop & Earn Persistent Cashbacks | Nexvy Partners";
      seo.description = "Discover amazing discount codes and shop-to-earn cashback links from premium brands. Receive cashback directly in your Nexvy wallet.";
    } else if (pathPart === "/spinner") {
      seo.title = "Lucky Wheel Spin - Unlock Daily Multipliers | Nexvy";
      seo.description = "Feeling lucky? Give the wheel a turn today and win awesome coin packages and progressive multipliers absolutely free!";
    } else if (pathPart === "/daily-gift") {
      seo.title = "Daily Gift Login Rewards & Multi-Day Streak Boosts | Nexvy";
      seo.description = "Log in every 24 hours to secure consecutive check-in bonuses. Retain a daily streak multiplier to boost active challenge gains!";
    } else if (pathPart === "/leaderboard") {
      seo.title = "Nexvy Global Hall of Fame - Top Earners Leaderboard";
      seo.description = "Discover the top achievers, weekly microtask experts, and highest rewarding creators on the Nexvy platform.";
    } else if (pathPart === "/referral") {
      seo.title = "Invite Friends, Earn Lifetime Commissions | Nexvy Refer & Earn";
      seo.description = "Get instant welcome rewards for every active referred user. Enjoy lifetime referral percentage bonuses on their completed microtasks.";
    } else if (pathPart === "/about" || pathPart === "/about-us") {
      seo.title = "About Us - Discover India's Premium Rewarding Hub | Nexvy";
      seo.description = "Learn more about Nexvy, our mission to build India's most secure and user-friendly rewards dashboard, and our commitment to transparency.";
    } else if (pathPart === "/privacy-policy") {
      seo.title = "Privacy Policy & Safe Auditing - Nexvy Security Shield";
      seo.description = "Read the official Nexvy Privacy Shield Policy. Learn how your data credentials, profile information, and account coin ledgers are encoded securely.";
    } else if (pathPart === "/terms" || pathPart === "/terms-and-conditions") {
      seo.title = "Terms and Conditions - Nexvy Platform Guidelines";
      seo.description = "Review Nexvy's terms and conditions. Learn about the single account policy, device verification guidelines, task rules, and secure coins redemption terms.";
    } else if (pathPart === "/contact" || pathPart === "/contact-us") {
      seo.title = "Contact Us - 24/7 Nexvy Support Desk";
      seo.description = "Get in touch with the Nexvy reward network team. Open an inquiry about coin postbacks, withdrawal review status, or brand affiliate setups.";
    } else if (pathPart === "/refund-policy") {
      seo.title = "Refund Policy - Coin & Redemption Guidelines | Nexvy";
      seo.description = "Learn about Nexvy's coin redemption adjustments. Read about campaign reversals, sponsor audits, failed proof procedures, and transaction processing guidelines.";
    } else if (pathPart === "/download") {
      seo.title = "Download Nexvy Premium APK - Secure Android Earning App";
      seo.description = "Download the official Nexvy Android APK file. Easily take microtasks, daily trivia quizzes, play lucky spins, and claim instant Paytm/UPI coins directly on the native app.";
    } else if (
      pathPart.startsWith("/admin") ||
      pathPart === "/profile" ||
      pathPart === "/withdraw"
    ) {
      // Add noindex to private portals and dashboards to protect indexing structure
      seo.title = "Security Portal | Nexvy";
      seo.robots = "noindex, nofollow";
    }

    // JSON-LD Structured Data Schema implementation
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Nexvy",
      "url": siteUrl,
      "logo": `${siteUrl}/input_file_0.png`,
      "description": "Premium social earning, gamified tasks, and rewards platform.",
      "sameAs": [
        "https://twitter.com/nexvy",
        "https://facebook.com/nexvy"
      ]
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Nexvy",
      "url": siteUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/tasks?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    const breadcrumbs: any[] = [{ "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl }];
    if (pathPart !== "/") {
      const segmentName = pathPart.split("/")[1].replace("-", " ");
      const capitalizedStr = segmentName.charAt(0).toUpperCase() + segmentName.slice(1);
      breadcrumbs.push({
        "@type": "ListItem",
        "position": 2,
        "name": capitalizedStr,
        "item": `${siteUrl}${pathPart}`
      });
    }

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs
    };

    const pageSchemas = [organizationSchema, websiteSchema, breadcrumbSchema];

    // FAQ schema for support pages
    if (pathPart === "/daily-gift" || pathPart === "/tasks") {
      pageSchemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How can I earn rewards on Nexvy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can earn coins by completing microtasks, solving AI quizzes, claiming daily gifts, and spinning the lucky wheel. Coins are redeemable for real rewards."
            }
          },
          {
            "@type": "Question",
            "name": "What are Daily Login Streaks?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "By checking in every single day on Nexvy, you build a continuous daily streak that boosts your active coin bonuses on consecutive login days."
            }
          }
        ]
      } as any);
    }

    const compiledSchemaMarkup = pageSchemas.map(s => 
      `<script type="application/ld+json">${JSON.stringify(s)}</script>`
    ).join("\n    ");

    // Replace or insert Title
    let modifiedHtml = html;
    if (modifiedHtml.includes("<title>")) {
      modifiedHtml = modifiedHtml.replace(/<title>.*?<\/title>/gi, `<title>${seo.title}</title>`);
    } else {
      modifiedHtml = modifiedHtml.replace("</head>", `  <title>${seo.title}</title>\n  </head>`);
    }

    // Dynamic Meta Replace/Injection Helper
    const replaceOrInsertMeta = (nameOrProperty: string, value: string, attrName = "name") => {
      const regex = new RegExp(`<meta\\s+${attrName}=["']${nameOrProperty}["']\\s+content=".*?"\\s*\\/?>|<meta\\s+content=".*?"\\s+${attrName}=["']${nameOrProperty}["']\\s*\\/?>`, "i");
      const tagContent = `<meta ${attrName}="${nameOrProperty}" content="${value.replace(/"/g, '&quot;')}" />`;
      if (regex.test(modifiedHtml)) {
        modifiedHtml = modifiedHtml.replace(regex, tagContent);
      } else {
        modifiedHtml = modifiedHtml.replace("</head>", `  ${tagContent}\n  </head>`);
      }
    };

    // Replace static values
    replaceOrInsertMeta("description", seo.description);
    replaceOrInsertMeta("keywords", seo.keywords);
    replaceOrInsertMeta("robots", seo.robots);
    replaceOrInsertMeta("author", "Nexvy Network");

    // Open Graph
    replaceOrInsertMeta("og:title", seo.ogTitle || seo.title, "property");
    replaceOrInsertMeta("og:description", seo.ogDescription || seo.description, "property");
    replaceOrInsertMeta("og:type", seo.ogType, "property");
    replaceOrInsertMeta("og:url", canonicalUrl, "property");
    replaceOrInsertMeta("og:image", seo.ogImage, "property");
    replaceOrInsertMeta("og:site_name", "Nexvy", "property");

    // Twitter Cards
    replaceOrInsertMeta("twitter:card", "summary_large_image");
    replaceOrInsertMeta("twitter:title", seo.twitterTitle || seo.title);
    replaceOrInsertMeta("twitter:description", seo.twitterDescription || seo.description);
    replaceOrInsertMeta("twitter:image", seo.ogImage);
    replaceOrInsertMeta("twitter:url", canonicalUrl);

    // Canonical link
    if (modifiedHtml.includes('rel="canonical"')) {
      modifiedHtml = modifiedHtml.replace(/<link\s+rel=["']canonical["']\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
    } else {
      modifiedHtml = modifiedHtml.replace("</head>", `  <link rel="canonical" href="${canonicalUrl}" />\n  </head>`);
    }

    // Search console meta validation verification injection
    const verificationId = process.env.GOOGLE_SEARCH_CONSOLE_ID;
    if (verificationId) {
      modifiedHtml = modifiedHtml.replace("</head>", `  <meta name="google-site-verification" content="${verificationId}" />\n  </head>`);
    }

    // Schema structure insertion
    modifiedHtml = modifiedHtml.replace("</head>", `  ${compiledSchemaMarkup}\n  </head>`);

    return modifiedHtml;
  };

  // 8. Setup Serve & Pre-rendering Mode
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    app.use(vite.middlewares);

    app.get("*all", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let html = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        html = await vite.transformIndexHtml(url, html);
        
        const optimizedHtml = injectSEOTags(html, url, req.headers.host || "localhost");
        res.status(200).set({ "Content-Type": "text/html" }).end(optimizedHtml);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production mode caching options (Cache static assets up to 1 year)
    const distPath = path.join(process.cwd(), "dist");
    
    app.use(express.static(distPath, {
      maxAge: "1d",
      setHeaders: (res, path) => {
        if (path.includes("/assets/")) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      }
    }));

    app.get("*all", (req, res) => {
      try {
        const url = req.originalUrl;
        const html = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
        const optimizedHtml = injectSEOTags(html, url, req.headers.host || "www.nexvy.in");
        res.status(200).set({ "Content-Type": "text/html" }).end(optimizedHtml);
      } catch (e) {
        res.sendFile(path.join(distPath, "index.html"));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SEO-SERVER] Server running on http://localhost:${PORT}`);
  });
}

startServer();
