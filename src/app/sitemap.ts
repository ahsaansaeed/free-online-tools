import { MetadataRoute } from 'next';
import { tools } from '@/lib/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  // Replace with your actual domain when deploying
  const baseUrl = 'https://toolbox.example.com';

  const toolsUrls = tools.map((tool) => ({
    url: `${baseUrl}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...toolsUrls,
  ];
}
