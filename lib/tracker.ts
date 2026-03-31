/**
 * OPC 官网埋点工具
 * 轻量级客户端统计，发送访问和下载事件到后台 API
 */

// TODO: 替换为实际的后台 API 域名
const TRACK_API_BASE = process.env.NEXT_PUBLIC_TRACK_API || 'https://www.gydblog.com/prod-api';

/** 访客指纹：持久化在 localStorage */
function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let vid = localStorage.getItem('_opc_vid');
  if (!vid) {
    vid = crypto.randomUUID();
    localStorage.setItem('_opc_vid', vid);
  }
  return vid;
}

/** 会话 ID：存储在 sessionStorage */
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sid = sessionStorage.getItem('_opc_sid');
  if (!sid) {
    sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('_opc_sid', sid);
  }
  return sid;
}

/** 根据来源 URL 判断流量类型 */
function classifySource(referrer: string): string {
  if (!referrer) return 'direct';
  const r = referrer.toLowerCase();
  if (/google|bing|baidu|yahoo|duckduckgo|sogou|so\.com|360/.test(r)) return 'search';
  if (/facebook|twitter|x\.com|linkedin|weibo|zhihu|douyin|tiktok/.test(r)) return 'social';
  return 'external';
}

/** 检测设备类型 */
function detectDeviceType(): string {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/Mobi|Android.*Mobile|iPhone|iPod/.test(ua)) return 'mobile';
  if (/iPad|Android(?!.*Mobile)|Tablet/.test(ua)) return 'tablet';
  return 'desktop';
}

/** 提取浏览器名称和版本 */
function detectBrowser(): { name: string; version: string } {
  if (typeof window === 'undefined') return { name: '', version: '' };
  const ua = navigator.userAgent;
  let name = '', version = '';

  if (ua.includes('Edg/')) {
    name = 'Edge';
    version = ua.match(/Edg\/([\d.]+)/)?.[1] || '';
  } else if (ua.includes('Chrome/')) {
    name = 'Chrome';
    version = ua.match(/Chrome\/([\d.]+)/)?.[1] || '';
  } else if (ua.includes('Firefox/')) {
    name = 'Firefox';
    version = ua.match(/Firefox\/([\d.]+)/)?.[1] || '';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    name = 'Safari';
    version = ua.match(/Version\/([\d.]+)/)?.[1] || '';
  } else if (ua.includes('MSIE') || ua.includes('Trident/')) {
    name = 'IE';
    version = ua.match(/(?:MSIE |rv:)([\d.]+)/)?.[1] || '';
  }
  return { name, version };
}

/** 提取操作系统名称和版本 */
function detectOS(): { name: string; version: string } {
  if (typeof window === 'undefined') return { name: '', version: '' };
  const ua = navigator.userAgent;
  let name = '', version = '';

  if (ua.includes('Windows NT 10')) {
    name = 'Windows'; version = '10/11';
  } else if (ua.includes('Windows NT 6.3')) {
    name = 'Windows'; version = '8.1';
  } else if (ua.includes('Windows NT 6.1')) {
    name = 'Windows'; version = '7';
  } else if (ua.includes('Windows')) {
    name = 'Windows';
  } else if (ua.includes('Mac OS X')) {
    name = 'macOS';
    version = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, '.') || '';
  } else if (ua.includes('Linux')) {
    name = 'Linux';
    version = ua.match(/Linux ([\d.]+)/)?.[1] || '';
  } else if (ua.includes('Android')) {
    name = 'Android';
    version = ua.match(/Android ([\d.]+)/)?.[1] || '';
  } else if (/iPhone|iPad/.test(ua)) {
    name = 'iOS';
    version = ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, '.') || '';
  }
  return { name, version };
}

/** 发送埋点数据到后台 */
async function sendTrack(endpoint: string, data: object): Promise<void> {
  if (!TRACK_API_BASE) return;
  try {
    await fetch(`${TRACK_API_BASE}/opc/track/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true,
    });
  } catch {
    // 静默失败，埋点不应影响网站功能
  }
}

/** 获取当前站点语言 */
function getLocale(): string {
  if (typeof window === 'undefined') return 'en';
  const path = window.location.pathname;
  const firstSeg = path.split('/')[1];
  return firstSeg === 'zh' ? 'zh' : 'en';
}

/**
 * 发送页面访问事件
 */
export function trackPageView(): void {
  if (typeof window === 'undefined') return;
  const browser = detectBrowser();
  const os = detectOS();
  sendTrack('visit', {
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    pageUrl: window.location.pathname,
    pageTitle: document.title,
    referrer: document.referrer,
    sourceType: classifySource(document.referrer),
    deviceType: detectDeviceType(),
    browser: browser.name,
    browserVer: browser.version,
    os: os.name,
    osVer: os.version,
    language: navigator.language,
    locale: getLocale(),
    userAgent: navigator.userAgent,
    durationMs: null,
  });
}

/**
 * 发送下载事件
 */
export function trackDownload(params: {
  productId: string;
  productName: string;
  version: string;
  platform: string;
  format: string;
}): void {
  if (typeof window === 'undefined') return;
  const browser = detectBrowser();
  const os = detectOS();
  sendTrack('download', {
    visitorId: getVisitorId(),
    productId: params.productId,
    productName: params.productName,
    version: params.version,
    platform: params.platform,
    format: params.format,
    deviceType: detectDeviceType(),
    browser: browser.name,
    os: os.name,
    userAgent: navigator.userAgent,
    locale: getLocale(),
  });
}

/**
 * 初始化页面停留时长追踪
 * 在用户离开页面时发送停留时长
 */
export function initDurationTracking(): void {
  if (typeof window === 'undefined') return;
  const startTime = Date.now();
  const handler = () => {
    if (document.visibilityState === 'hidden') {
      const duration = Date.now() - startTime;
      // 只记录停留超过1秒的
      if (duration > 1000) {
        const browser = detectBrowser();
        const os = detectOS();
        sendTrack('visit', {
          visitorId: getVisitorId(),
          sessionId: getSessionId(),
          pageUrl: window.location.pathname,
          pageTitle: document.title,
          referrer: document.referrer,
          sourceType: classifySource(document.referrer),
          deviceType: detectDeviceType(),
          browser: browser.name,
          browserVer: browser.version,
          os: os.name,
          osVer: os.version,
          language: navigator.language,
          locale: getLocale(),
          userAgent: navigator.userAgent,
          durationMs: duration,
        });
      }
    }
  };
  document.addEventListener('visibilitychange', handler);
}
