import { ProductGrid } from '@/components/product/ProductGrid';
import { getProductsByCollection } from '@/lib/shopify';
import { notFound } from 'next/navigation';

interface CollectionPageProps {
    params: Promise<{
        handle: string;
    }>;
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
    const title = handle.charAt(0).toUpperCase() + handle.slice(1).replace(/-/g, ' ');

    return (
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
    );
}
