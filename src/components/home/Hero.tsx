import Link from 'next/link';
import { Truck, ShieldCheck, Clock } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative">
            {/* Hero Banner */}
            <div className="relative h-[500px] w-full bg-gray-900 flex items-center">
                {/* Background Image Placeholder */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2000&auto=format&fit=crop")' }}
                ></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl text-white">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Todo para tu hogar y tecnología en un solo lugar
                        </h1>
                        <p className="text-xl mb-8 text-gray-200">
                            Descubre nuestra selección premium de productos con la mejor garantía del mercado.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/#ofertas"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors text-center"
                            >
                                Ver ofertas
                            </Link>
                            <Link
                                href="/#categorias"
                                className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-full font-semibold transition-colors text-center"
                            >
                                Ver categorías
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Strip */}
            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <Truck size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Envíos Express</h3>
                            <p className="text-sm text-gray-500">Recibí tu pedido en el día</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Garantía Total</h3>
                            <p className="text-sm text-gray-500">Devolución asegurada</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Atención Rápida</h3>
                            <p className="text-sm text-gray-500">Soporte 24/7</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
