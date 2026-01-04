import { Hero } from '@/components/home/Hero';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getFeaturedProducts, getProductsByCollection } from '@/lib/shopify';
import Link from 'next/link';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://innowaveuy.com';

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Bienvenido a Innowave. Todo para tu hogar y tecnología en un solo lugar. Encuentra los mejores productos de electrónicos, bazar, electrodomésticos, movilidad y telefonía con envío gratis a todo el país.',
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Innowave - Tecnología y Hogar',
    description: 'Todo para tu hogar y tecnología en un solo lugar. Encuentra los mejores productos con envío gratis a todo el país.',
    siteName: 'Innowave',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Innowave - Tecnología y Hogar',
      },
    ],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const essentialProducts = await getProductsByCollection('esenciales');

  // Structured Data (JSON-LD) para la página principal
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'WebSite',
    name: 'Innowave',
    description: 'Todo para tu hogar y tecnología en un solo lugar',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Innowave',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="flex flex-col gap-8 pb-12">
        <Hero />

        <ProductGrid
          title="Los más elegidos"
          products={featuredProducts}
          id="ofertas"
        />

        <ProductGrid
          title="Esenciales para tu hogar"
          products={essentialProducts}
        />

        {/* Categories Grid */}
        <section className="container mx-auto px-4 py-12" id="categorias">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Explora por Categoría
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Electrónicos',
                handle: 'electronicos',
                image: '/electronicos.png'
              },
              {
                title: 'Bazar',
                handle: 'bazar',
                image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800'
              },
              {
                title: 'Electrodomésticos',
                handle: 'electrodomesticos',
                image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800'
              },
              {
                title: 'Movilidad',
                handle: 'movilidad',
                image: '/movilidad.png'
              },
              {
                title: 'Telefonía',
                handle: 'telefonia',
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800'
              }
            ].map((category) => (
              <Link
                key={category.handle}
                href={`/coleccion/${category.handle}`}
                className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url("${category.image}")` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors"></div>
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="w-full">
                    <h3 className="text-white text-2xl font-bold mb-2 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                      {category.title}
                    </h3>
                    <div className="h-1 w-12 bg-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
