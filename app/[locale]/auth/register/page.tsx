'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

function RegisterContent() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const router = useRouter();

  const redirect = searchParams.get('redirect') || `/${locale}/dashboard`;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError(locale === 'en' ? 'Password must be at least 6 characters' : '密码至少需要6个字符');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (res.ok) {
        // 等待 cookie 被保存后再跳转
        await new Promise(resolve => setTimeout(resolve, 100));
        // 使用 window.location 强制完全刷新页面
        window.location.href = redirect;
      } else {
        setError(data.error || 'Registration failed');
        setLoading(false);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container py-12 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {locale === 'en' ? 'Create Account' : '创建账号'}
          </CardTitle>
          <CardDescription>
            {locale === 'en' ? 'Get started with OPC' : '开始使用 OPC'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {locale === 'en' ? 'Name' : '姓名'}
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={locale === 'en' ? 'Enter your name' : '输入您的姓名'}
                required
              />
            </div>

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
                placeholder={locale === 'en' ? 'Create a password' : '创建密码'}
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
                  {locale === 'en' ? 'Creating account...' : '创建中...'}
                </>
              ) : (
                locale === 'en' ? 'Create Account' : '创建账号'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {locale === 'en' ? 'Already have an account?' : '已有账号？'}{' '}
            <button
              onClick={() => router.push(`/${locale}/auth/login?redirect=${redirect}`)}
              className="text-primary hover:underline"
            >
              {locale === 'en' ? 'Sign in' : '登录'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
