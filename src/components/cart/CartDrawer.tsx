'use client';

import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { createCheckout } from '@/lib/shopify';

export function CartDrawer() {
    const {
        isCartOpen,
        setIsCartOpen,
        items,
        removeItem,
        updateQuantity,
        subtotal
    } = useCart();

    if (!isCartOpen) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-UY', {
            style: 'currency',
            currency: 'UYU',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleCheckout = async () => {
        const lineItems = items.map(item => ({
            variantId: item.id, // En realidad usaríamos el variantId real de Shopify
            quantity: item.quantity
        }));

        // Simulación de checkout
        alert('Redirigiendo a checkout de Shopify...');
        const checkout = await createCheckout(lineItems);
        console.log('Checkout URL:', checkout.webUrl);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            ></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Tu Carrito</h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                            <p>Tu carrito está vacío</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Continuar comprando
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 border-b pb-4">
                                <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.images?.[0] || '/placeholder.jpg'}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900 line-clamp-2">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center border rounded-md">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:bg-gray-100"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="px-2 text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:bg-gray-100"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-4 border-t bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-medium text-gray-600">Subtotal</span>
                            <span className="text-xl font-bold text-gray-900">{formatPrice(subtotal)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4 text-center">
                            Impuestos y envío calculados en el checkout
                        </p>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-bold transition-colors shadow-lg hover:shadow-xl"
                        >
                            Ir al pago
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
