import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Replace with your actual domain when deploying
  const baseUrl = 'https://toolbox.example.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // Disallow API routes from being crawled
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
