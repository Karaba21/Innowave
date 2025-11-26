import { products } from '@/data/products';
import { Product } from '@/types';

// Configuración base para la Storefront API
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'mock-store.myshopify.com';
const SHOPIFY_STOREFRONT_API_TOKEN = process.env.SHOPIFY_STOREFRONT_API_TOKEN || 'mock-token';

// Función helper para hacer fetch a la API (placeholder)
async function shopifyFetch<T>({ query, variables }: { query: string; variables?: any }): Promise<T | undefined> {
    // Aquí iría la implementación real del fetch a Shopify
    console.log('Fetching from Shopify:', query, variables);
    return undefined;
}

export async function getFeaturedProducts(): Promise<Product[]> {
    // TODO: Conectar con Shopify Storefront API
    // Query para obtener productos de una colección destacada
    return products.filter(p => p.isFeatured);
}

export async function getProductsByCollection(collectionHandle: string): Promise<Product[]> {
    // TODO: Conectar con Shopify Storefront API
    if (collectionHandle === 'all') return products;
    // Simulación de filtrado por categoría/colección
    return products.filter(p =>
        p.category.toLowerCase().includes(collectionHandle.toLowerCase()) ||
        p.sectionTag === collectionHandle
    );
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
    // TODO: Conectar con Shopify Storefront API
    return products.find(p => p.handle === handle);
}

export async function createCheckout(lineItems: { variantId: string; quantity: number }[]) {
    // TODO: Conectar con Shopify Storefront API
    // Mutation checkoutCreate
    console.log('Creating checkout for:', lineItems);

    // Retornar URL simulada
    return {
        webUrl: 'https://checkout.shopify.com/mock-checkout-url'
    };
}
