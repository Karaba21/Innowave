export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
  handle: string;
  isFeatured: boolean;
  sectionTag?: 'los-mas-elegidos' | 'esenciales' | 'producto-del-mes' | 'hogar' | 'tecnologia';
}

export interface CartItem extends Product {
  quantity: number;
}
