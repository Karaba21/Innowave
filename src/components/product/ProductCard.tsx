'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();

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
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                {product.oldPrice && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        -{discount}%
                    </span>
                )}
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                        onClick={() => addItem(product)}
                        className="bg-white text-gray-900 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                        title="Agregar al carrito"
                    >
                        <ShoppingCart size={20} />
                    </button>
                    <Link
                        href={`/producto/${product.handle}`}
                        className="bg-white text-gray-900 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                        title="Ver detalle"
                    >
                        <Eye size={20} />
                    </Link>
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">
                    {product.category}
                </div>
                <Link href={`/producto/${product.handle}`}>
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                        {product.title}
                    </h3>
                </Link>

                <div className="mt-auto">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">
                            {formatPrice(product.price)}
                        </span>
                        {product.oldPrice && (
                            <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.oldPrice)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
