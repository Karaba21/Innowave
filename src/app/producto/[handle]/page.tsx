import { getProductByHandle, createCheckout } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ProductActions } from '@/components/product/ProductActions';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import type { Metadata } from 'next';

interface Props {
    params: Promise<{
        handle: string;
    }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://innowaveuy.com';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { handle } = await params;
    const product = await getProductByHandle(handle);

    if (!product) {
        return {
            title: 'Producto no encontrado',
        };
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-UY', {
            style: 'currency',
            currency: 'UYU',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const productUrl = `${siteUrl}/producto/${handle}`;
    const productImage = product.images[0] || '/logo.png';
    const price = formatPrice(product.price);
    const description = product.description || `Compra ${product.title} en Innowave. ${price}. Envío gratis a todo el país.`;

    return {
        title: product.title,
        description: description,
        keywords: [product.title, product.category, 'tecnología', 'hogar', 'Uruguay'],
        openGraph: {
            type: 'website',
            url: productUrl,
            title: product.title,
            description: description,
            images: [
                {
                    url: productImage,
                    width: 1200,
                    height: 630,
                    alt: product.title,
                },
            ],
            siteName: 'Innowave',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.title,
            description: description,
            images: [productImage],
        },
        alternates: {
            canonical: productUrl,
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { handle } = await params;
    const product = await getProductByHandle(handle);

    if (!product) {
        notFound();
    }

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

    // Structured Data (JSON-LD) para SEO
    const structuredData = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.images,
        brand: {
            '@type': 'Brand',
            name: 'Innowave',
        },
        offers: {
            '@type': 'Offer',
            url: `${siteUrl}/producto/${handle}`,
            priceCurrency: 'UYU',
            price: product.price,
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: 'Innowave',
            },
        },
        category: product.category,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <ProductImageGallery
                    images={product.images}
                    productTitle={product.title}
                    discount={discount}
                    showDiscount={!!product.oldPrice}
                />

                {/* Product Info */}
                <div className="flex flex-col">
                    <div className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-2">
                        {product.category}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {product.title}
                    </h1>

                    <div className="flex items-baseline gap-4 mb-6">
                        <span className="text-3xl font-bold text-gray-900">
                            {formatPrice(product.price)}
                        </span>
                        {product.oldPrice && (
                            <span className="text-xl text-gray-400 line-through">
                                {formatPrice(product.oldPrice)}
                            </span>
                        )}
                    </div>

                    <div className="mb-8">
                        <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    </div>

                    <div className="border-t border-b border-gray-100 py-6 mb-8">
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            <span className="font-medium">Stock disponible</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                            <span className="font-medium">Envío gratis a todo el país</span>
                        </div>
                    </div>

                    {/* Client Component for Actions (Add to Cart, Quantity) */}
                    <ProductActions product={product} />
                </div>
            </div>
        </div>
        </>
    );
}
