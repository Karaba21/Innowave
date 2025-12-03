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
    console.error('Error fetching from Shopify:', JSON.stringify(e, null, 2));
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
    images(first: 10) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 1) {
      edges {
        node {
          id
          price {
            amount
            currencyCode
          }
        }
      }
    }
    marca: metafield(namespace: "custom", key: "marca") {
      value
    }
    color: metafield(namespace: "custom", key: "color") {
      value
    }
    tecnologia_bateria: metafield(namespace: "custom", key: "tecnologia_bateria") {
      value
    }
    tecnologia_de_la_bateria: metafield(namespace: "custom", key: "tecnologia_de_la_bateria") {
      value
    }
    estado_estetico: metafield(namespace: "custom", key: "estado_estetico") {
      value
    }
    red_de_datos: metafield(namespace: "custom", key: "red_de_datos") {
      value
    }
    sistema_operativo: metafield(namespace: "custom", key: "sistema_operativo") {
      value
    }
    capacidad_tarjeta_sim: metafield(namespace: "custom", key: "capacidad_tarjeta_sim") {
      value
    }
    capacidad_de_tarjeta_sim: metafield(namespace: "custom", key: "capacidad_de_tarjeta_sim") {
      value
    }
    tipo_suscripcion: metafield(namespace: "custom", key: "tipo_suscripcion") {
      value
    }
    tipo_de_suscripcion: metafield(namespace: "custom", key: "tipo_de_suscripcion") {
      value
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

export async function getAllProducts(): Promise<Product[]> {
  const query = `
    ${PRODUCTS_FRAGMENT}
    query getAllProducts {
      products(first: 250, sortKey: CREATED_AT, reverse: true) {
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

  if (response?.body?.data?.products?.edges?.length) {
    // Debug log removed
  }

  return response?.body?.data?.products?.edges.map(({ node }: any) => reshapeProduct(node)) || [];
}

export async function getAllCollections(): Promise<string[]> {
  const query = `
    query getAllCollections {
      collections(first: 50) {
        edges {
          node {
            handle
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{
    data: { collections: { edges: { node: { handle: string } }[] } };
  }>({ query });

  return response?.body?.data?.collections?.edges.map(({ node }) => node.handle) || [];
}

export async function searchProducts(query: string): Promise<Product[]> {
  const searchQuery = `
    ${PRODUCTS_FRAGMENT}
    query searchProducts($query: String!) {
      products(first: 8, sortKey: RELEVANCE, query: $query) {
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
  }>({
    query: searchQuery,
    variables: { query }
  });

  return response?.body?.data?.products?.edges.map(({ node }: any) => reshapeProduct(node)) || [];
}

// Función helper para obtener el variantId de un producto por su ID de Shopify
export async function getProductVariantId(productId: string): Promise<string | undefined> {
  // El productId viene en formato "gid://shopify/Product/123456"
  // Necesitamos extraer el ID numérico o usar el handle
  const query = `
    query getProductVariant($id: ID!) {
      product(id: $id) {
        variants(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch<{
      data: { product: { variants: { edges: { node: { id: string } }[] } } | null };
    }>({
      query,
      variables: { id: productId }
    });

    const product = response?.body?.data?.product;
    return product?.variants?.edges?.[0]?.node?.id;
  } catch (error) {
    console.error('Error obteniendo variantId:', error);
    return undefined;
  }
}

function reshapeProduct(shopifyProduct: any): Product {
  const firstVariant = shopifyProduct.variants?.edges?.[0]?.node;

  return {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    description: shopifyProduct.description,
    price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
    category: 'Shopify', // Placeholder as category logic might differ
    images: shopifyProduct.images?.edges.map((edge: any) => edge.node.url) || [],
    handle: shopifyProduct.handle,
    isFeatured: false, // Logic to determine this can be added
    variantId: firstVariant?.id || undefined, // Agregar el variantId
    metafields: {
      marca: shopifyProduct.marca?.value,
      color: shopifyProduct.color?.value,
      tecnologia_bateria: shopifyProduct.tecnologia_bateria?.value || shopifyProduct.tecnologia_de_la_bateria?.value,
      estado_estetico: shopifyProduct.estado_estetico?.value,
      red_de_datos: shopifyProduct.red_de_datos?.value,
      sistema_operativo: shopifyProduct.sistema_operativo?.value,
      capacidad_tarjeta_sim: shopifyProduct.capacidad_tarjeta_sim?.value || shopifyProduct.capacidad_de_tarjeta_sim?.value,
      tipo_suscripcion: shopifyProduct.tipo_suscripcion?.value || shopifyProduct.tipo_de_suscripcion?.value,
    }
  };
}

export async function createCheckout(lineItems: { variantId: string; quantity: number }[]) {
  // Validar que todos los items tengan variantId
  const invalidItems = lineItems.filter(item => !item.variantId || item.quantity <= 0);
  if (invalidItems.length > 0) {
    throw new Error('Algunos productos no tienen una variante válida o cantidad inválida');
  }

  // Paso 1: Crear el carrito
  const createCartMutation = `
        mutation cartCreate($input: CartInput!) {
            cartCreate(input: $input) {
                cart {
                    id
                    checkoutUrl
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;

  const cartVariables = {
    input: {
      lines: lineItems.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity
      }))
    }
  };

  try {
    // Crear el carrito
    const cartResponse = await shopifyFetch<{
      data: {
        cartCreate: {
          cart: {
            id: string;
            checkoutUrl: string;
          } | null;
          userErrors: Array<{
            field: string[];
            message: string;
          }>;
        };
      };
    }>({
      query: createCartMutation,
      variables: cartVariables
    });

    if (!cartResponse) {
      throw new Error('No se recibió respuesta de Shopify');
    }

    if (!cartResponse.body) {
      throw new Error('El cuerpo de la respuesta está vacío');
    }

    if (!cartResponse.body.data) {
      // Si hay errores en el nivel superior
      if ((cartResponse.body as any).errors) {
        const errors = (cartResponse.body as any).errors;
        const errorMessages = Array.isArray(errors)
          ? errors.map((err: any) => err.message || JSON.stringify(err)).join(', ')
          : JSON.stringify(errors);
        throw new Error(`Error de Shopify: ${errorMessages}`);
      }
      throw new Error('No se recibieron datos de Shopify');
    }

    const { cart, userErrors } = cartResponse.body.data.cartCreate;

    if (userErrors && userErrors.length > 0) {
      const errorMessages = userErrors.map(err => err.message).join(', ');
      throw new Error(`Error al crear el carrito: ${errorMessages}`);
    }

    if (!cart) {
      throw new Error('No se pudo crear el carrito');
    }

    if (!cart.checkoutUrl) {
      throw new Error('El carrito no tiene una URL de checkout válida');
    }

    return {
      id: cart.id,
      webUrl: cart.checkoutUrl
    };
  } catch (error: any) {
    console.error('Error creating checkout:', error);
    // Proporcionar un mensaje más útil
    const errorMessage = error?.message || error?.error?.message || 'Error desconocido al crear el checkout';
    throw new Error(errorMessage);
  }
}
