import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserLicenses, createLicense, generateLicenseKey } from '@/lib/license';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const licenses = await getUserLicenses(user.id);

    // Parse machine_ids JSON
    const parsedLicenses = licenses.map((l: any) => ({
      ...l,
      machine_ids: l.machine_ids ? JSON.parse(l.machine_ids) : [],
    }));

    return NextResponse.json({ licenses: parsedLicenses });
  } catch (error) {
    console.error('Get licenses error:', error);
    return NextResponse.json(
      { error: 'Failed to get licenses' },
      { status: 500 }
    );
  }
}

// For testing: create a license without payment
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, orderId } = await req.json();

    // In test mode, generate license directly
    const licenseKey = generateLicenseKey();

    return NextResponse.json({
      license: {
        license_key: licenseKey,
        product_id: productId,
        status: 'active',
        device_limit: 1,
      },
    });
  } catch (error) {
    console.error('Create license error:', error);
    return NextResponse.json(
      { error: 'Failed to create license' },
      { status: 500 }
    );
  }
}
