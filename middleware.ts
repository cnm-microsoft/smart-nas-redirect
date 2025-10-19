import { NextRequest, NextResponse } from 'next/server';

// --- 配置项 ---

// 从环境变量读取配置，提供默认值作为备用
const NAS_DOMAIN = process.env.NAS_DOMAIN || 'your-nas-domain.com';
const TXT_RECORD_DOMAIN = process.env.TXT_RECORD_DOMAIN || 'nas-target.yourdomain.com';
const DNS_CACHE_TIME = parseInt(process.env.DNS_CACHE_TIME || '60', 10);
const DNS_TIMEOUT = parseInt(process.env.DNS_TIMEOUT || '5000', 10);

export const config = {
  matcher: '/:path*',
};

export async function middleware(request: NextRequest) {
  try {
    // 获取请求的路径和查询参数
    const url = new URL(request.url);
    const pathname = url.pathname;
    const searchParams = url.search;
    
    // 查询存储着端口号的 TXT 记录
    const dnsQueryUrl = `https://cloudflare-dns.com/dns-query?name=${TXT_RECORD_DOMAIN}&type=TXT`;

    const response = await fetch(dnsQueryUrl, {
      headers: {
        'accept': 'application/dns-json',
      },
      signal: AbortSignal.timeout(DNS_TIMEOUT), // 动态超时设置
      cache: 'default' // 使用浏览器默认缓存策略
    });

    if (!response.ok) {
      throw new Error(`DNS query failed for port with status: ${response.status}`);
    }

    const dnsResult = await response.json();
    const answers = dnsResult.Answer || [];
    const txtRecord = answers.find((ans: { type: number }) => ans.type === 16);

    if (txtRecord && txtRecord.data) {
      // 从 TXT 记录中获取端口字符串，并去除引号
      const portStr = txtRecord.data.replace(/"/g, '');

      // --- 核心修改点 ---
      // 验证获取到的是否是有效的端口号
      const port = parseInt(portStr, 10);
      if (!isNaN(port) && port > 0 && port <= 65535) {

        // 构建完整的重定向URL，包含路径和查询参数
        const redirectToUrl = `https://${NAS_DOMAIN}:${port}${pathname}${searchParams}`;

        // 返回 302 临时重定向
        return NextResponse.redirect(redirectToUrl, 302);
      }
    }

    throw new Error('Valid port not found in TXT record.');

  } catch (error) {
    console.error('Redirect middleware error:', error);
    // 如果发生任何错误，返回美观的404页面
    const errorHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>服务暂时不可用 - 404</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 500px;
            margin: 0 auto;
        }
        .error-code {
            font-size: 6rem;
            font-weight: bold;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .error-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        .error-message {
            font-size: 1rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            line-height: 1.6;
        }
        .retry-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        .retry-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        .icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🔧</div>
        <div class="error-code">404</div>
        <div class="error-title">NAS 服务暂时不可用</div>
        <div class="error-message">
            很抱歉，我们无法连接到 NAS 服务器。<br>
            这可能是由于网络问题或服务器维护导致的。<br>
            请稍后再试或联系管理员。
        </div>
        <button class="retry-btn" onclick="window.location.reload()">
            🔄 重新尝试
        </button>
    </div>
</body>
</html>`;

    return new NextResponse(errorHtml, {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  }
}
