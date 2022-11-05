import proxy, { createProxyMiddleware } from 'http-proxy-middleware'

module.exports = (app: any) => {
  app.use('/api/translate',createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
  }))
  app.use('/init', createProxyMiddleware({
    target: 'http://localhost:3001',
    xfwd: true,
    changeOrigin: true,
  }))
}