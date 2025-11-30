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

    const handleBuyNow = async () => {
        if (!product.variantId) {
            alert('Este producto no está disponible para compra directa. Por favor, recarga la página.');
            console.error('Producto sin variantId:', { title: product.title, id: product.id, variantId: product.variantId });
            return;
        }

        try {
            console.log('Creando checkout directo para:', { variantId: product.variantId, quantity });
            
            // Llamar a la API route para crear el checkout
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    lineItems: [{
                        variantId: product.variantId,
                        quantity: quantity
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear el checkout');
            }

            const checkout = await response.json();
            
            if (checkout.webUrl) {
                window.location.href = checkout.webUrl;
            } else {
                throw new Error('No se recibió URL de checkout');
            }
        } catch (error: any) {
            console.error('Error al crear checkout:', error);
            const errorMessage = error?.message || 'Error desconocido';
            alert(`Error al procesar la compra: ${errorMessage}`);
        }
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
