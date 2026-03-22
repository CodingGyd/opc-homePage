import { NextRequest, NextResponse } from 'next/server';
import { login, setAuthCookie, generateToken } from '@/lib/auth';

const testUsers: Record<string, { password: string; name: string; role: string }> = {
  'admin@opc.studio': { password: 'admin123', name: 'Admin', role: 'admin' },
  'test@opc.studio': { password: 'test123', name: 'Test User', role: 'user' },
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check test users first
    const testUser = testUsers[email.toLowerCase()];
    if (testUser && testUser.password === password) {
      const token = generateToken({
        userId: `test-${email}`,
        email: email.toLowerCase(),
        role: testUser.role as 'user' | 'admin',
      });

      await setAuthCookie(token);

      return NextResponse.json({
        user: {
          id: `test-${email}`,
          email: email.toLowerCase(),
          name: testUser.name,
          role: testUser.role,
        },
      });
    }

    // Try database login
    const result = await login(email, password);

    if (!result) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    await setAuthCookie(result.token);

    return NextResponse.json({ user: result.user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
