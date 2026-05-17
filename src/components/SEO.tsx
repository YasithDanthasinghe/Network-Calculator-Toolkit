import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  type?: string;
  schema?: object;
}

export default function SEO({ 
  title = "IP Subnet Calculator — Free Online CIDR & VLSM Toolkit", 
  description = "Calculate IPv4 address ranges, VLSM hierarchies, and CIDR route summaries with our professional online IP calculator tool.",
  keywords = "IP calculator, subnet calculator, CIDR calculator, VLSM calculator, network calculator",
  canonical = "https://network-calculator-toolkit.web.app/",
  type = "website",
  schema
}: SeoProps) {
  const siteTitle = "Network Calculator Toolkit";
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;

  const finalCanonical = canonical.startsWith('http') 
    ? canonical 
    : `https://network-calculator-toolkit.web.app${canonical.startsWith('/') ? '' : '/'}${canonical}`;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="google-site-verification" content="iZ_xWzgqyfdP2ZiMyBzGbkKfzDnI7sZsVr4aT9UYIGg" />
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* Dynamic Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
