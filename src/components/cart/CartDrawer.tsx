'use client';

import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

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
        // Intentar obtener variantId para items que no lo tengan
        const itemsWithVariants = await Promise.all(
            items.map(async (item) => {
                if (item.variantId) {
                    return item;
                }
                // Intentar obtener el variantId desde la API
                try {
                    const response = await fetch('/api/variant', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ productId: item.id })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        return { ...item, variantId: data.variantId };
                    }
                } catch (error) {
                    console.error('Error obteniendo variantId:', error);
                }
                return item;
            })
        );

        // Filtrar items que tengan variantId válido
        const validItems = itemsWithVariants.filter(item => item.variantId);
        
        if (validItems.length === 0) {
            alert('No hay productos válidos en el carrito. Por favor, elimina los productos del carrito y vuelve a agregarlos desde la página del producto.');
            console.error('Items sin variantId después de intentar obtenerlos:', itemsWithVariants.map(item => ({ title: item.title, id: item.id, variantId: item.variantId })));
            return;
        }

        const lineItems = validItems.map(item => ({
            variantId: item.variantId!,
            quantity: item.quantity
        }));

        try {
            console.log('Creando checkout con items:', lineItems);
            
            // Llamar a la API route para crear el checkout
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ lineItems })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear el checkout');
            }

            const checkout = await response.json();
            
            // Redirigir a la URL de checkout de Shopify
            if (checkout.webUrl) {
                window.location.href = checkout.webUrl;
            } else {
                throw new Error('No se recibió URL de checkout');
            }
        } catch (error: any) {
            console.error('Error al crear checkout:', error);
            const errorMessage = error?.message || 'Error desconocido';
            alert(`Error al procesar el checkout: ${errorMessage}`);
        }
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
