# 部署指南

本文档详细说明如何将 Smart NAS Redirect 部署到各种平台。

## 🚀 Vercel 部署（推荐）

Vercel 是部署 Next.js 应用的最佳选择，提供零配置部署。

### 步骤

1. **准备代码**
   ```bash
   git clone <your-repo-url>
   cd smart-nas-redirect
   ```

2. **连接 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 选择你的仓库

3. **配置环境变量**
   在 Vercel 项目设置中添加：
   ```
   NAS_DOMAIN=your-nas-domain.com
   TXT_RECORD_DOMAIN=nas-target.yourdomain.com
   DNS_CACHE_TIME=60
   DNS_TIMEOUT=5000
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成

### 自定义域名

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录

## 🌐 Netlify 部署

### 步骤

1. **连接仓库**
   - 登录 [netlify.com](https://netlify.com)
   - 点击 "New site from Git"
   - 选择你的 GitHub 仓库

2. **构建设置**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **环境变量**
   在 Site settings > Environment variables 中添加：
   ```
   NAS_DOMAIN=your-nas-domain.com
   TXT_RECORD_DOMAIN=nas-target.yourdomain.com
   DNS_CACHE_TIME=60
   DNS_TIMEOUT=5000
   ```

4. **部署**
   点击 "Deploy site"

## 🐳 Docker 部署

### Dockerfile

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 构建和运行

```bash
# 构建镜像
docker build -t smart-nas-redirect .

# 运行容器
docker run -p 3000:3000 \
  -e NAS_DOMAIN=your-nas-domain.com \
  -e TXT_RECORD_DOMAIN=nas-target.yourdomain.com \
  -e DNS_CACHE_TIME=60 \
  -e DNS_TIMEOUT=5000 \
  smart-nas-redirect
```

### Docker Compose

创建 `docker-compose.yml`：

```yaml
version: '3.8'
services:
  smart-nas-redirect:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NAS_DOMAIN=your-nas-domain.com
      - TXT_RECORD_DOMAIN=nas-target.yourdomain.com
      - DNS_CACHE_TIME=60
      - DNS_TIMEOUT=5000
    restart: unless-stopped
```

运行：
```bash
docker-compose up -d
```

## 🖥️ VPS 自托管

### 使用 PM2

1. **安装依赖**
   ```bash
   npm install -g pm2
   npm install
   npm run build
   ```

2. **创建 PM2 配置**
   创建 `ecosystem.config.js`：
   ```javascript
   module.exports = {
     apps: [{
       name: 'smart-nas-redirect',
       script: 'npm',
       args: 'start',
       env: {
         NODE_ENV: 'production',
         PORT: 3000,
         NAS_DOMAIN: 'your-nas-domain.com',
         TXT_RECORD_DOMAIN: 'nas-target.yourdomain.com',
         DNS_CACHE_TIME: '60',
         DNS_TIMEOUT: '5000'
       }
     }]
   }
   ```

3. **启动应用**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### 使用 Nginx 反向代理

创建 Nginx 配置 `/etc/nginx/sites-available/smart-nas-redirect`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/smart-nas-redirect /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 HTTPS 配置

### 使用 Certbot (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 📊 监控和日志

### PM2 监控

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs smart-nas-redirect

# 监控面板
pm2 monit
```

### Docker 日志

```bash
# 查看容器日志
docker logs smart-nas-redirect

# 实时日志
docker logs -f smart-nas-redirect
```

## 🔧 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本（需要 18+）
   - 清除缓存：`npm ci`

2. **环境变量不生效**
   - 确保变量名正确
   - 重启应用

3. **DNS 查询失败**
   - 检查网络连接
   - 验证 TXT 记录设置

### 性能优化

1. **启用缓存**
   - 配置适当的 `DNS_CACHE_TIME`
   - 使用 CDN

2. **监控资源使用**
   - 设置内存和 CPU 限制
   - 配置健康检查

---

如有问题，请查看 [故障排除文档](README.md#故障排除) 或创建 Issue。