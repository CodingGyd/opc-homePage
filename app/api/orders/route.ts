import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await query<any>(
      `SELECT
        o.id,
        o.order_number,
        o.product_id,
        o.type,
        o.status,
        o.amount,
        o.currency,
        o.paid_at,
        o.created_at,
        p.name as product_name,
        p.download_url
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC`,
      [user.id]
    );

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to get orders' },
      { status: 500 }
    );
  }
}
