import { products } from '@/data/products';
import { Product } from '@/types';

// Configuración base para la Storefront API
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyFetch<T>({
    query,
    variables
}: {
    query: string;
    variables?: any;
}): Promise<{ status: number; body: T } | undefined> {
    if (!domain || !storefrontAccessToken) {
        throw new Error('Missing Shopify configuration variables');
    }

    try {
        const result = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': storefrontAccessToken
            },
            body: JSON.stringify({ query, variables })
        });

        const body = await result.json();

        if (body.errors) {
            throw body.errors[0];
        }

        return {
            status: result.status,
            body
        };
    } catch (e) {
        console.error('Error fetching from Shopify:', e);
        throw {
            error: e,
            query
        };
    }
}

const PRODUCTS_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    title
    handle
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      edges {
        node {
          url
          altText
        }
      }
    }
  }
`;

export async function getFeaturedProducts(): Promise<Product[]> {
    const query = `
    ${PRODUCTS_FRAGMENT}
    query getFeaturedProducts {
      products(first: 4, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  `;

    const response = await shopifyFetch<{
        data: { products: { edges: { node: any }[] } };
    }>({ query });

    return response?.body?.data?.products?.edges.map(({ node }: any) => reshapeProduct(node)) || [];
}

export async function getProductsByCollection(collectionHandle: string): Promise<Product[]> {
    const query = `
    ${PRODUCTS_FRAGMENT}
    query getProductsByCollection($handle: String!) {
      collection(handle: $handle) {
        products(first: 8, sortKey: BEST_SELLING) {
          edges {
            node {
              ...ProductFragment
            }
          }
        }
      }
    }
  `;

    const response = await shopifyFetch<{
        data: { collection: { products: { edges: { node: any }[] } } };
    }>({
        query,
        variables: { handle: collectionHandle }
    });

    return response?.body?.data?.collection?.products?.edges.map(({ node }: any) => reshapeProduct(node)) || [];
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
    const query = `
    ${PRODUCTS_FRAGMENT}
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ProductFragment
      }
    }
  `;

    const response = await shopifyFetch<{
        data: { product: any };
    }>({
        query,
        variables: { handle }
    });

    const product = response?.body?.data?.product;
    return product ? reshapeProduct(product) : undefined;
}

function reshapeProduct(shopifyProduct: any): Product {
    return {
        id: shopifyProduct.id,
        title: shopifyProduct.title,
        description: shopifyProduct.description,
        price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
        category: 'Shopify', // Placeholder as category logic might differ
        image: shopifyProduct.images?.edges[0]?.node?.url || '',
        handle: shopifyProduct.handle,
        isFeatured: false // Logic to determine this can be added
    };
}

export async function createCheckout(lineItems: { variantId: string; quantity: number }[]) {
    // TODO: Implement checkout creation
    console.log('Creating checkout for:', lineItems);
    return {
        webUrl: 'https://checkout.shopify.com/mock-checkout-url'
    };
}
