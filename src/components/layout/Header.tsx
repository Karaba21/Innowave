'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X, Phone } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import logo from '@/assets/logocuadrado.png';

import { Suspense } from 'react';
import { Search as SearchInput } from './Search';

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
                        className="md:hidden p-2 text-blue-900"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                        <Image src={logo} alt="Innowave Logo" width={50} height={50} className="object-contain" />
                        <div className="font-bold text-2xl text-blue-900 tracking-tighter">INNOWAVE</div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 font-medium text-gray-700">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Tienda</Link>
                        <Link href="/productos" className="hover:text-blue-600 transition-colors">Productos</Link>

                        <div className="relative group">
                            <button className="hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer">
                                Categorías
                            </button>
                            <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-xl py-3 hidden group-hover:block border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                                <Link href="/coleccion/electronicos" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">Electronicos</Link>
                                <Link href="/coleccion/bazar" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">Bazar</Link>
                                <Link href="/coleccion/electrodomesticos" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">Electrodomesticos</Link>
                                <Link href="/coleccion/movilidad" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">Movilidad</Link>
                                <Link href="/coleccion/telefonia" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">Telefonia</Link>
                            </div>
                        </div>

                        <Link href="/#ofertas" className="hover:text-blue-600 transition-colors">Ofertas</Link>
                        <Link href="#contacto" className="hover:text-blue-600 transition-colors">Contacto</Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Suspense fallback={<div className="w-64 h-10 bg-gray-100 rounded-full animate-pulse hidden md:block" />}>
                            <SearchInput className="hidden md:flex w-64" />
                        </Suspense>

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
                <Suspense fallback={<div className="w-full h-10 bg-gray-100 rounded-full animate-pulse md:hidden mt-4" />}>
                    <SearchInput
                        className="md:hidden mt-4"
                        onSearch={() => setIsMobileMenuOpen(false)}
                    />
                </Suspense>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t shadow-lg py-4 px-4 flex flex-col gap-4">
                    <Link href="/" className="py-2 text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Tienda</Link>
                    <Link href="/productos" className="py-2 text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Productos</Link>
                    <div className="py-2 flex flex-col gap-2">
                        <span className="font-semibold text-gray-700 text-sm">Categorías</span>
                        <Link href="/coleccion/electronicos" className="pl-4 py-1 text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Electronicos</Link>
                        <Link href="/coleccion/bazar" className="pl-4 py-1 text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Bazar</Link>
                        <Link href="/coleccion/electrodomesticos" className="pl-4 py-1 text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Electrodomesticos</Link>
                        <Link href="/coleccion/movilidad" className="pl-4 py-1 text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Movilidad</Link>
                        <Link href="/coleccion/telefonia" className="pl-4 py-1 text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Telefonia</Link>
                    </div>
                    <Link href="/#ofertas" className="py-2 text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Ofertas</Link>
                    <Link href="#contacto" className="py-2 text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contacto</Link>
                </div>
            )}
        </header>
    );
}
