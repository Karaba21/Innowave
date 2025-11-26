import { Hero } from '@/components/home/Hero';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getFeaturedProducts, getProductsByCollection } from '@/lib/shopify';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const essentialProducts = await getProductsByCollection('esenciales');
  const productOfMonth = (await getProductsByCollection('producto-del-mes'))[0];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <Hero />

      <ProductGrid
        title="Los más elegidos"
        products={featuredProducts}
        id="ofertas"
      />

      {/* Product of the Month */}
      {productOfMonth && (
        <section className="container mx-auto px-4 py-8">
          <div className="bg-gray-900 rounded-2xl overflow-hidden text-white shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="text-blue-400 font-bold tracking-wider uppercase mb-2">Producto del Mes</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{productOfMonth.title}</h2>
                <p className="text-gray-300 mb-8 text-lg">{productOfMonth.description}</p>
                <div className="flex items-center gap-6">
                  <span className="text-3xl font-bold">
                    ${productOfMonth.price.toLocaleString('es-UY')}
                  </span>
                  <Link
                    href={`/producto/${productOfMonth.handle}`}
                    className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                  >
                    Ver detalle <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
              <div
                className="h-64 md:h-auto bg-cover bg-center"
                style={{ backgroundImage: `url(${productOfMonth.image})` }}
              ></div>
            </div>
          </div>
        </section>
      )}

      <ProductGrid
        title="Esenciales para tu hogar"
        products={essentialProducts}
      />

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-12" id="categorias">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
          Explora por Categoría
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="#" className="group relative h-64 rounded-xl overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop")' }}
            ></div>
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-3xl font-bold">Tecnología</h3>
            </div>
          </Link>
          <Link href="#" className="group relative h-64 rounded-xl overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop")' }}
            ></div>
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-3xl font-bold">Hogar</h3>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
