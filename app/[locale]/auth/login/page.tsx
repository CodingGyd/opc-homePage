'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

function LoginContent() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const router = useRouter();

  const redirect = searchParams.get('redirect') || `/${locale}/dashboard`;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('Login response:', res.status, data);

      if (res.ok) {
        // 等待 cookie 被保存后再跳转
        await new Promise(resolve => setTimeout(resolve, 100));
        // 使用 window.location 强制完全刷新页面
        window.location.href = redirect;
      } else {
        setError(data.error || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container py-12 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {locale === 'en' ? 'Sign In' : '登录'}
          </CardTitle>
          <CardDescription>
            {locale === 'en' ? 'Welcome back' : '欢迎回来'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {locale === 'en' ? 'Email' : '邮箱'}
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={locale === 'en' ? 'Enter your email' : '输入您的邮箱'}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {locale === 'en' ? 'Password' : '密码'}
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={locale === 'en' ? 'Enter your password' : '输入您的密码'}
                required
              />
            </div>

            {error && (
              <div className="text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {locale === 'en' ? 'Signing in...' : '登录中...'}
                </>
              ) : (
                locale === 'en' ? 'Sign In' : '登录'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {locale === 'en' ? "Don't have an account?" : '还没有账号？'}{' '}
            <button
              onClick={() => router.push(`/${locale}/auth/register?redirect=${redirect}`)}
              className="text-primary hover:underline"
            >
              {locale === 'en' ? 'Sign up' : '注册'}
            </button>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-2">
              {locale === 'en' ? 'Test Account:' : '测试账号：'}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                admin@opc.studio / admin123
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEmail('admin@opc.studio');
                  setPassword('admin123');
                }}
              >
                {locale === 'en' ? 'Fill' : '填充'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
