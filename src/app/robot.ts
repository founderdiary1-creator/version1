import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.founderdiary.in';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Keeps your admin dashboard hidden from search results
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}