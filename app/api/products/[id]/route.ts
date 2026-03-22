import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await queryOne<any>(
      'SELECT * FROM products WHERE id = ?',
      [params.id]
    );

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const parsedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      features: product.features ? JSON.parse(product.features) : [],
      tags: product.tags ? JSON.parse(product.tags) : [],
    };

    return NextResponse.json({ product: parsedProduct });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Failed to get product' },
      { status: 500 }
    );
  }
}
