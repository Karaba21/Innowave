import { ProductGrid } from '@/components/product/ProductGrid';
import { searchProducts } from '@/lib/shopify';

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
            <h1 className="text-3xl font-bold mb-8">
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
