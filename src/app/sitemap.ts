import { MetadataRoute } from 'next';
import { getAllProducts, getAllCollections } from '@/lib/shopify';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://innowaveuy.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl;

  // Obtener todos los productos
  let products: { handle: string; updatedAt?: Date }[] = [];
  try {
    const allProducts = await getAllProducts();
    products = allProducts.map((product) => ({
      handle: product.handle,
      updatedAt: new Date(), // En producción, usar la fecha real de actualización del producto
    }));
  } catch (error) {
    console.error('Error obteniendo productos para sitemap:', error);
  }

  // Obtener todas las colecciones
  let collections: string[] = [];
  try {
    collections = await getAllCollections();
  } catch (error) {
    console.error('Error obteniendo colecciones para sitemap:', error);
  }

  // URLs estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // URLs de productos
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/producto/${product.handle}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // URLs de colecciones
  const collectionRoutes: MetadataRoute.Sitemap = collections.map((handle) => ({
    url: `${baseUrl}/coleccion/${handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes];
}

