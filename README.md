# NAS 动态重定向中间件

这是一个基于 Next.js 的中间件项目，通过 DNS TXT 记录动态获取端口号，实现灵活的 NAS 服务器重定向。

## 功能特性

- 🔄 动态端口解析：通过 DNS TXT 记录获取最新端口号
- ⚡ 智能缓存：可配置的 DNS 查询缓存时间
- 🛡️ 错误处理：完整的错误处理机制和备用重定向
- 🔧 环境配置：支持环境变量配置，便于部署
- ⏱️ 超时控制：可配置的 DNS 查询超时时间

## 项目结构

```
├── app/
│   ├── layout.tsx          # 根布局组件
│   └── page.tsx           # 首页组件
├── middleware.ts          # 核心重定向中间件
├── package.json          # 项目依赖配置
├── tsconfig.json         # TypeScript 配置
├── next.config.js        # Next.js 配置
├── .env.example          # 环境变量模板
└── README.md            # 项目文档
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env.local` 并修改配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件：

```env
NAS_DOMAIN=your-nas-domain.com
TXT_RECORD_DOMAIN=nas-target.yourdomain.com
FALLBACK_URL=https://your-fallback-url.com
DNS_CACHE_TIME=60
DNS_TIMEOUT=5000
```

### 3. 运行项目

```bash
npm run dev
```

## 配置说明

| 环境变量 | 说明 | 默认值 |
|---------|------|--------|
| `NAS_DOMAIN` | NAS 服务器域名 | `sub.stun.040726.xyz` |
| `TXT_RECORD_DOMAIN` | 存储端口号的 TXT 记录域名 | `nas-target.yourdomain.com` |
| `FALLBACK_URL` | 解析失败时的备用 URL | Google 搜索页面 |
| `DNS_CACHE_TIME` | DNS 查询缓存时间（秒） | `60` |
| `DNS_TIMEOUT` | DNS 查询超时时间（毫秒） | `5000` |

## 工作原理

1. 用户访问部署的域名（如：`https://your-domain.com/path/to/file?param=value`）
2. 中间件查询指定域名的 TXT 记录获取端口号
3. 验证端口号有效性（1-65535）
4. 重定向到 `https://{NAS_DOMAIN}:{PORT}/path/to/file?param=value`
5. 如果任何步骤失败，显示美观的404错误页面

## 路径传递功能

✨ **新功能**：现在支持完整的路径和查询参数传递！

- **路径保持**：`/admin/dashboard` → `https://nas.domain.com:8080/admin/dashboard`
- **查询参数保持**：`/files?folder=docs` → `https://nas.domain.com:8080/files?folder=docs`
- **完整URL传递**：`/api/v1/data?id=123&type=json` → `https://nas.domain.com:8080/api/v1/data?id=123&type=json`

## 部署

项目可以部署到任何支持 Next.js 的平台，如 Vercel、Netlify 等。

确保在部署平台设置正确的环境变量。

## 许可证

MIT License