'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, Phone } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

export function Header() {
    const { cartCount, setIsCartOpen } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
            {/* Top Bar */}
            <div className="bg-blue-900 text-white text-xs py-2 px-4 text-center hidden md:block">
                <div className="container mx-auto flex justify-between items-center">
                    <span>Envío gratis a partir de $2000</span>
                    <span>Envíos express en el día</span>
                    <span>Garantía de devolución 100%</span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        {/* Placeholder for logo if file doesn't exist, but user said it's in src/assets */}
                        <div className="font-bold text-2xl text-blue-900 tracking-tighter">INNOWAVE</div>
                        {/* Uncomment below when logo is confirmed */}
                        {/* <Image src="/assets/logo.png" alt="Innowave" width={150} height={40} className="h-10 w-auto object-contain" /> */}
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 font-medium text-gray-700">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Tienda</Link>
                        <Link href="/#categorias" className="hover:text-blue-600 transition-colors">Categorías</Link>
                        <Link href="/#ofertas" className="hover:text-blue-600 transition-colors">Ofertas</Link>
                        <Link href="#contacto" className="hover:text-blue-600 transition-colors">Contacto</Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex relative w-64">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                className="w-full pl-4 pr-10 py-2 border rounded-full text-sm focus:outline-none focus:border-blue-500 placeholder:text-gray-500"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
                                <Search size={18} />
                            </button>
                        </div>

                        <button
                            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingCart size={24} className="text-gray-700" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Search - Visible only on mobile */}
                <div className="md:hidden mt-4 relative">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        className="w-full pl-4 pr-10 py-2 border rounded-full text-sm focus:outline-none focus:border-blue-500 placeholder:text-gray-500"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search size={18} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t shadow-lg py-4 px-4 flex flex-col gap-4">
                    <Link href="/" className="py-2 border-b" onClick={() => setIsMobileMenuOpen(false)}>Tienda</Link>
                    <Link href="/#categorias" className="py-2 border-b" onClick={() => setIsMobileMenuOpen(false)}>Categorías</Link>
                    <Link href="/#ofertas" className="py-2 border-b" onClick={() => setIsMobileMenuOpen(false)}>Ofertas</Link>
                    <Link href="#contacto" className="py-2" onClick={() => setIsMobileMenuOpen(false)}>Contacto</Link>
                </div>
            )}
        </header>
    );
}
