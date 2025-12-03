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
  sectionTag?: string;
  variantId?: string;
  metafields?: {
    marca?: string;
    color?: string;
    tecnologia_bateria?: string;
    estado_estetico?: string;
    red_de_datos?: string;
    sistema_operativo?: string;
    capacidad_tarjeta_sim?: string;
    tipo_suscripcion?: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}
