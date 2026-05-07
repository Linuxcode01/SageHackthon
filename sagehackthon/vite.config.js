import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // ── n8n Webhook Proxy ──────────────────────────────────
      // /n8n-webhook/... → https://greeshma96.app.n8n.cloud/...
      '/n8n-webhook': {
        target: 'https://greeshma96.app.n8n.cloud',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/n8n-webhook/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('\n[n8n proxy] ❌ Error:', err.message)
          })
          proxy.on('proxyReq', (_req, req) => {
            console.log(`\n[n8n proxy] → ${req.method} ${req.url}`)
          })
          proxy.on('proxyRes', (proxyRes, req) => {
            const s = proxyRes.statusCode
            const icon = s === 200 ? '✅' : s === 404 ? '❌ 404 — Is workflow ACTIVATED?' : '⚠️'
            console.log(`[n8n proxy] ← ${icon} ${s} ${req.url}`)
          })
        },
      },

      // ── Gemini API Proxy ───────────────────────────────────
      // /gemini-api/... → https://generativelanguage.googleapis.com/...
      // Avoids direct browser calls that can hit stricter rate limits
      '/gemini-api': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/gemini-api/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('\n[Gemini proxy] ❌ Error:', err.message)
          })
          proxy.on('proxyRes', (proxyRes, req) => {
            const s = proxyRes.statusCode
            if (s === 429) console.warn('[Gemini proxy] ⚠️ 429 Rate limit hit')
            else console.log(`[Gemini proxy] ← ${s} ${req.url}`)
          })
        },
      },
    },
  },
})
