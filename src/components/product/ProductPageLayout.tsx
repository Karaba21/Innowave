'use client';

import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import { ProductGrid } from './ProductGrid';
import { ProductFilter } from './ProductFilter';

interface ProductPageLayoutProps {
    products: Product[];
    title: string;
}

export function ProductPageLayout({ products, title }: ProductPageLayoutProps) {
    const searchParams = useSearchParams();

    // Filter products based on search params
    const filteredProducts = products.filter(product => {
        for (const [key, value] of searchParams.entries()) {
            if (key === 'category') {
                if (product.category !== value) return false;
            } else {
                // Check metafields
                const metafieldValue = product.metafields?.[key as keyof typeof product.metafields];
                if (metafieldValue !== value) return false;
            }
        }
        return true;
    });

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-72 flex-shrink-0">
                <ProductFilter products={products} />
            </div>
            <div className="flex-1">
                <ProductGrid title={title} products={filteredProducts} />
                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No se encontraron productos con los filtros seleccionados.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
