import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
    products: Product[];
    title?: string;
    id?: string;
}

export function ProductGrid({ products, title, id }: ProductGridProps) {
    return (
        <section className="py-12" id={id}>
            <div className="container mx-auto px-4">
                {title && (
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                        {title}
                    </h2>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
