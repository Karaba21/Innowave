import { NextRequest, NextResponse } from 'next/server';
import { createCheckout } from '@/lib/shopify';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { lineItems } = body;

        if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
            return NextResponse.json(
                { error: 'Line items are required' },
                { status: 400 }
            );
        }

        // Validar que todos los items tengan variantId y quantity
        const invalidItems = lineItems.filter(
            (item: any) => !item.variantId || !item.quantity || item.quantity <= 0
        );
        
        if (invalidItems.length > 0) {
            return NextResponse.json(
                { error: 'Todos los items deben tener un variantId válido y cantidad mayor a 0' },
                { status: 400 }
            );
        }

        const checkout = await createCheckout(lineItems);

        return NextResponse.json(checkout);
    } catch (error: any) {
        console.error('Error en API checkout:', error);
        return NextResponse.json(
            { error: error?.message || 'Error al crear el checkout' },
            { status: 500 }
        );
    }
}

