import { ProductGrid } from '@/components/product/ProductGrid';
import { searchProducts } from '@/lib/shopify';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://innowaveuy.com';

export async function generateMetadata({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
    const { q } = await searchParams;
    const query = q || '';
    
    if (query) {
        return {
            title: `Buscar: ${query}`,
            description: `Resultados de búsqueda para "${query}" en Innowave. Encuentra los mejores productos de tecnología y hogar.`,
            robots: {
                index: true,
                follow: true,
            },
            openGraph: {
                type: 'website',
                url: `${siteUrl}/search?q=${encodeURIComponent(query)}`,
                title: `Buscar: ${query} | Innowave`,
                description: `Resultados de búsqueda para "${query}" en Innowave.`,
                siteName: 'Innowave',
            },
            alternates: {
                canonical: `${siteUrl}/search?q=${encodeURIComponent(query)}`,
            },
        };
    }

    return {
        title: 'Buscar productos',
        description: 'Busca productos de tecnología y hogar en Innowave. Envío gratis a todo el país.',
        robots: {
            index: false,
            follow: true,
        },
    };
}

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const query = q || '';
    const products = await searchProducts(query);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-blue-900">
                {query ? `Resultados para "${query}"` : 'Buscar productos'}
            </h1>

            {products.length > 0 ? (
                <ProductGrid
                    title=""
                    products={products}
                />
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        No se encontraron productos para "{query}"
                    </p>
                </div>
            )}
        </div>
    );
}
