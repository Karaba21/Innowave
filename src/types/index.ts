export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  images: string[];
  handle: string;
  isFeatured: boolean;
  sectionTag?: 'los-mas-elegidos' | 'esenciales' | 'producto-del-mes' | 'hogar' | 'tecnologia';
  variantId?: string; // ID de la variante de Shopify
}

export interface CartItem extends Product {
  quantity: number;
}
