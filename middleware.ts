import { NextRequest, NextResponse } from 'next/server';

// --- 配置项 ---

// 1. 【固定】你的 NAS 域名，我们将其硬编码在这里。
const NAS_DOMAIN = 'sub.stun.040726.xyz';

// 2. 【动态】用于存储端口号的 TXT 记录所在的域名。
const TXT_RECORD_DOMAIN = 'nas-target.yourdomain.com'; // 例如 nas-target.040726.xyz

// 3. 如果解析失败，跳转到的备用 URL。
const FALLBACK_URL = 'https://www.google.com/search?q=Error:NAS+port+not+found'; 

export const config = {
  matcher: '/:path*',
};

export async function middleware(request: NextRequest) {
  try {
    // 查询存储着端口号的 TXT 记录
    const dnsQueryUrl = `https://cloudflare-dns.com/dns-query?name=${TXT_RECORD_DOMAIN}&type=TXT`;
    
    const response = await fetch(dnsQueryUrl, {
      headers: {
        'accept': 'application/dns-json',
      },
      next: { revalidate: 60 } // 缓存结果 60 秒
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
        
        // 使用硬编码的域名和动态获取的端口，构建最终 URL
        const redirectToUrl = `https://${NAS_DOMAIN}:${port}`;
        
        // 返回 307 临时重定向
        return NextResponse.redirect(redirectToUrl, 307);
      }
    }

    throw new Error('Valid port not found in TXT record.');

  } catch (error) {
    console.error('Redirect middleware error:', error);
    // 如果发生任何错误，重定向到备用 URL
    return NextResponse.redirect(FALLBACK_URL, 307);
  }
}
