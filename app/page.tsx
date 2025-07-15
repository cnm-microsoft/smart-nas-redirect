export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: 'white'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '500px'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '600' }}>
          NAS 重定向服务
        </h1>
        <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: 1.6 }}>
          此页面用于动态重定向到 NAS 服务器。<br/>
          访问任何路径都会自动重定向到配置的 NAS 地址。
        </p>
      </div>
    </div>
  )
}