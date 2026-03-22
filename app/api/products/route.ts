import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'active';

    let sql = 'SELECT * FROM products WHERE status = ?';
    const params: (string | number)[] = [status];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY sort_order ASC, created_at DESC';

    const products = await query<any>(sql, params);

    // Parse JSON fields
    const parsedProducts = products.map((p: any) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
      features: p.features ? JSON.parse(p.features) : [],
      tags: p.tags ? JSON.parse(p.tags) : [],
    }));

    return NextResponse.json({ products: parsedProducts });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to get products' },
      { status: 500 }
    );
  }
}
