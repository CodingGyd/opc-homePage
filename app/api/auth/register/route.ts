import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    console.log('Register attempt:', { email, name });

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    console.log('Checking existing user...');
    const existingUsers = await query<any>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Create user
    console.log('Creating user...');
    const hashedPassword = await hashPassword(password);

    await query(
      `INSERT INTO users (id, email, password_hash, name, role) VALUES (UUID(), ?, ?, ?, 'user')`,
      [email, hashedPassword, name]
    );

    // 获取新创建的用户
    const user = await queryOne<{ id: string; email: string; name: string; role: string }>(
      'SELECT id, email, name, role FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // 生成 token 并设置 cookie（自动登录）
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'user' | 'admin',
    });

    await setAuthCookie(token);

    console.log('User created and logged in successfully');
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error.message, error.code);
    return NextResponse.json(
      { error: 'Registration failed: ' + error.message },
      { status: 500 }
    );
  }
}
