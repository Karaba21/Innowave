import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8" id="contacto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">INNOWAVE</h3>
                        <p className="text-sm leading-relaxed mb-6">
                            Tu tienda de confianza para tecnología y hogar.
                            Envíos a todo el país y la mejor garantía del mercado.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Enlaces Rápidos</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
                            <li><Link href="/#categorias" className="hover:text-white transition-colors">Categorías</Link></li>
                            <li><Link href="/#ofertas" className="hover:text-white transition-colors">Ofertas</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Categorías</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">Tecnología</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Hogar</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Electrodomésticos</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Audio</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contacto</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                                <span>Av. 18 de Julio 1234,<br />Montevideo, Uruguay</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="flex-shrink-0" />
                                <span>+598 99 123 456</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="flex-shrink-0" />
                                <span>contacto@innowave.uy</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-sm">
                    <p className="mb-2">
                        Pagina creada por <a href="https://savsolutionsuy.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Sav Solutions</a>
                    </p>
                    <p>&copy; {new Date().getFullYear()} Innowave. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
