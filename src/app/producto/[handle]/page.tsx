import { getProductByHandle, createCheckout } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ProductActions } from '@/components/product/ProductActions';

interface Props {
    params: {
        handle: string;
    };
}

export default async function ProductPage({ params }: Props) {
    const { handle } = await params;
    const product = await getProductByHandle(handle);

    if (!product) {
        notFound();
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-UY', {
            style: 'currency',
            currency: 'UYU',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const discount = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : 0;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Gallery (Placeholder for single image) */}
                <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    {product.oldPrice && (
                        <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full z-10">
                            -{discount}% OFF
                        </span>
                    )}
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    <div className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-2">
                        {product.category}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {product.title}
                    </h1>

                    <div className="flex items-baseline gap-4 mb-6">
                        <span className="text-3xl font-bold text-gray-900">
                            {formatPrice(product.price)}
                        </span>
                        {product.oldPrice && (
                            <span className="text-xl text-gray-400 line-through">
                                {formatPrice(product.oldPrice)}
                            </span>
                        )}
                    </div>

                    <div className="mb-8">
                        <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    </div>

                    <div className="border-t border-b border-gray-100 py-6 mb-8">
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            <span className="font-medium">Stock disponible</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                            <span className="font-medium">Envío gratis a todo el país</span>
                        </div>
                    </div>

                    {/* Client Component for Actions (Add to Cart, Quantity) */}
                    <ProductActions product={product} />
                </div>
            </div>
        </div>
    );
}
