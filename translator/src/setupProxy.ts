import proxy, { createProxyMiddleware } from 'http-proxy-middleware'
import express from 'express'

const app: express.Express = express()

 export const Proxy = () => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
    })
  );
}