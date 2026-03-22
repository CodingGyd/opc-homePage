'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Package, CreditCard, ExternalLink, Key, Copy, CheckCircle } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  product_id: string;
  type: 'one_time' | 'subscription';
  status: string;
  amount: number;
  currency: string;
  paid_at: string;
  product_name?: string;
  product_type?: 'download' | 'online';
  download_url?: string;
  license_key?: string;
  access_url?: string;
}

// Demo orders for testing
const demoOrders: Order[] = [
  {
    id: '1',
    order_number: 'OPC-20260322-0001',
    product_id: '1',
    type: 'one_time',
    status: 'paid',
    amount: 49,
    currency: 'USD',
    paid_at: new Date().toISOString(),
    product_name: 'DataQuery Pro',
    product_type: 'download',
    license_key: 'A1B2-C3D4-E5F6-G7H8',
  },
  {
    id: '2',
    order_number: 'OPC-20260322-0002',
    product_id: '3',
    type: 'subscription',
    status: 'paid',
    amount: 19.99,
    currency: 'USD',
    paid_at: new Date().toISOString(),
    product_name: 'CloudDev Studio',
    product_type: 'online',
    access_url: 'https://clouddev.opc.studio',
  },
];

export default function OrdersPage() {
  const locale = useLocale();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders && data.orders.length > 0) {
          setOrders(data.orders);
          return;
        }
      }
      // Use demo orders if no real orders
      setOrders(demoOrders);
    } catch (err) {
      // Use demo orders on error
      setOrders(demoOrders);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      refunded: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    };

    const labels: Record<string, string> = {
      paid: locale === 'en' ? 'Paid' : '已支付',
      pending: locale === 'en' ? 'Pending' : '待支付',
      failed: locale === 'en' ? 'Failed' : '支付失败',
      refunded: locale === 'en' ? 'Refunded' : '已退款',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const handleCopy = (orderId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleDownload = (order: Order) => {
    alert(locale === 'en'
      ? `Download started for ${order.product_name}`
      : `${order.product_name} 下载已开始`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {locale === 'en' ? 'My Orders' : '我的订单'}
      </h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {locale === 'en' ? 'No orders yet' : '暂无订单'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">#{order.order_number}</span>
                      {getStatusBadge(order.status)}
                      {order.type === 'subscription' && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CreditCard className="w-3 h-3" />
                          {locale === 'en' ? 'Subscription' : '订阅'}
                        </span>
                      )}
                    </div>
                    <span className="text-lg font-bold">
                      ${order.amount} {order.currency.toUpperCase()}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div>
                    <p className="font-medium">{order.product_name || `Product #${order.product_id}`}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.paid_at
                        ? new Date(order.paid_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'zh-CN')
                        : '-'}
                    </p>
                  </div>

                  {/* License Key (for download products) */}
                  {order.status === 'paid' && order.product_type === 'download' && order.license_key && (
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Key className="w-4 h-4" />
                        {locale === 'en' ? 'License Key:' : '许可证密钥：'}
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <code className="font-mono text-sm">{order.license_key}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(order.id, order.license_key!)}
                        >
                          {copiedOrderId === order.id ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Access URL (for online products) */}
                  {order.status === 'paid' && order.product_type === 'online' && order.access_url && (
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <ExternalLink className="w-4 h-4" />
                        {locale === 'en' ? 'Access URL:' : '访问地址：'}
                      </div>
                      <a
                        href={order.access_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm break-all"
                      >
                        {order.access_url}
                      </a>
                    </div>
                  )}

                  {/* Actions */}
                  {order.status === 'paid' && (
                    <div className="flex gap-2">
                      {order.product_type === 'download' && (
                        <Button size="sm" className="gap-2" onClick={() => handleDownload(order)}>
                          <Download className="w-4 h-4" />
                          {locale === 'en' ? 'Download' : '下载'}
                        </Button>
                      )}
                      {order.product_type === 'online' && order.access_url && (
                        <Button
                          size="sm"
                          className="gap-2"
                          onClick={() => window.open(order.access_url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                          {locale === 'en' ? 'Open' : '打开'}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
