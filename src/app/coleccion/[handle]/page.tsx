import { ProductGrid } from '@/components/product/ProductGrid';
import { getProductsByCollection } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface CollectionPageProps {
    params: Promise<{
        handle: string;
    }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://innowaveuy.com';

const collectionNames: Record<string, string> = {
    'electronicos': 'Electrónicos',
    'bazar': 'Bazar',
    'electrodomesticos': 'Electrodomésticos',
    'movilidad': 'Movilidad',
    'telefonia': 'Telefonía',
    'esenciales': 'Esenciales para tu hogar',
};

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
    const { handle } = await params;
    const title = collectionNames[handle] || handle.charAt(0).toUpperCase() + handle.slice(1).replace(/-/g, ' ');
    const description = `Explora nuestra colección de ${title.toLowerCase()}. Encuentra los mejores productos con envío gratis a todo el país en Innowave.`;
    const collectionUrl = `${siteUrl}/coleccion/${handle}`;

    return {
        title: title,
        description: description,
        keywords: [title, 'tecnología', 'hogar', 'Uruguay', 'compras online'],
        openGraph: {
            type: 'website',
            url: collectionUrl,
            title: `${title} | Innowave`,
            description: description,
            siteName: 'Innowave',
            images: [
                {
                    url: '/logo.png',
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | Innowave`,
            description: description,
            images: ['/logo.png'],
        },
        alternates: {
            canonical: collectionUrl,
        },
    };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
    const { handle } = await params;
    const products = await getProductsByCollection(handle);

    if (!products || products.length === 0) {
        // Optional: You might want to show a "No products found" message instead of 404
        // for valid collections that just happen to be empty.
        // For now, if we can't find products (or the collection doesn't exist/fails), we show 404?
        // Actually, getProductsByCollection returns [] if error or empty.
        // Let's just show an empty grid or a message if empty.
    }

    // Capitalize handle for title display (simple version)
    const title = collectionNames[handle] || handle.charAt(0).toUpperCase() + handle.slice(1).replace(/-/g, ' ');

    // Structured Data (JSON-LD) para colección
    const structuredData = {
        '@context': 'https://schema.org/',
        '@type': 'CollectionPage',
        name: title,
        description: `Colección de ${title} en Innowave`,
        url: `${siteUrl}/coleccion/${handle}`,
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: products.length,
            itemListElement: products.map((product, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'Product',
                    name: product.title,
                    url: `${siteUrl}/producto/${product.handle}`,
                },
            })),
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        <div className="container mx-auto px-4 py-8">
            <ProductGrid
                title={title}
                products={products}
            />
            {products.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No se encontraron productos en esta colección.</p>
                </div>
            )}
        </div>
        </>
    );
}
