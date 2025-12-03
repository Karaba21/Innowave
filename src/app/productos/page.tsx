import { ProductGrid } from '@/components/product/ProductGrid';
import { getAllProducts } from '@/lib/shopify';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://innowaveuy.com';

export const metadata: Metadata = {
    title: 'Productos | Innowave',
    description: 'Explora todos nuestros productos. Encuentra los mejores artículos con envío gratis a todo el país en Innowave.',
    keywords: ['productos', 'tecnología', 'hogar', 'Uruguay', 'compras online'],
    openGraph: {
        type: 'website',
        url: `${siteUrl}/productos`,
        title: 'Productos | Innowave',
        description: 'Explora todos nuestros productos. Encuentra los mejores artículos con envío gratis a todo el país en Innowave.',
        siteName: 'Innowave',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Productos Innowave',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Productos | Innowave',
        description: 'Explora todos nuestros productos. Encuentra los mejores artículos con envío gratis a todo el país en Innowave.',
        images: ['/logo.png'],
    },
    alternates: {
        canonical: `${siteUrl}/productos`,
    },
};

export default async function ProductosPage() {
    const products = await getAllProducts();

    // Structured Data (JSON-LD) para página de productos
    const structuredData = {
        '@context': 'https://schema.org/',
        '@type': 'CollectionPage',
        name: 'Productos',
        description: 'Todos los productos disponibles en Innowave',
        url: `${siteUrl}/productos`,
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
                    title="Todos los Productos"
                    products={products}
                />
                {products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No se encontraron productos.</p>
                    </div>
                )}
            </div>
        </>
    );
}

