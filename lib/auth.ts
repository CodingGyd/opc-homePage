import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { query, queryOne } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  stripe_customer_id?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  // Handle test users (userId starts with 'test-')
  if (payload.userId.startsWith('test-')) {
    return {
      id: payload.userId,
      email: payload.email,
      name: payload.email.split('@')[0].charAt(0).toUpperCase() + payload.email.split('@')[0].slice(1),
      role: payload.role,
    };
  }

  // Look up real user in database
  const user = await queryOne<User>(
    'SELECT id, email, name, role, stripe_customer_id FROM users WHERE id = ?',
    [payload.userId]
  );

  return user;
}

export async function login(email: string, password: string): Promise<{ user: User; token: string } | null> {
  const user = await queryOne<User & { password_hash: string }>(
    'SELECT id, email, name, role, stripe_customer_id, password_hash FROM users WHERE email = ?',
    [email]
  );

  if (!user) return null;

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) return null;

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const { password_hash, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

export async function register(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
  const hashedPassword = await hashPassword(password);

  const result = await query(
    `INSERT INTO users (id, email, password_hash, name, role) VALUES (UUID(), ?, ?, ?, 'user')`,
    [email, hashedPassword, name]
  );

  const user = await queryOne<User>(
    'SELECT id, email, name, role, stripe_customer_id FROM users WHERE email = ?',
    [email]
  );

  if (!user) throw new Error('Failed to create user');

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}
