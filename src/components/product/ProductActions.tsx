'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

interface ProductActionsProps {
    product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
    const [quantity, setQuantity] = useState(1);
    const { addItem, setIsCartOpen } = useCart();

    const handleAddToCart = () => {
        addItem(product, quantity);
        setIsCartOpen(true);
    };

    const handleBuyNow = () => {
        addItem(product, quantity);
        setIsCartOpen(true);
        // En un flujo real, aquí redirigiríamos directamente al checkout
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <span className="font-medium text-gray-900">Cantidad:</span>
                <div className="flex items-center border rounded-full">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-gray-100 rounded-l-full transition-colors text-gray-700"
                        disabled={quantity <= 1}
                    >
                        <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 hover:bg-gray-100 rounded-r-full transition-colors text-gray-700"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors"
                >
                    <ShoppingCart size={20} />
                    Agregar al carrito
                </button>
                <button
                    onClick={handleBuyNow}
                    className="bg-blue-600 text-white py-4 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                    Comprar ahora
                </button>
            </div>
        </div>
    );
}
