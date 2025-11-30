import { NextRequest, NextResponse } from 'next/server';
import { getProductVariantId } from '@/lib/shopify';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        const variantId = await getProductVariantId(productId);

        if (!variantId) {
            return NextResponse.json(
                { error: 'No se pudo obtener el variantId para este producto' },
                { status: 404 }
            );
        }

        return NextResponse.json({ variantId });
    } catch (error: any) {
        console.error('Error en API variant:', error);
        return NextResponse.json(
            { error: error?.message || 'Error al obtener el variantId' },
            { status: 500 }
        );
    }
}

