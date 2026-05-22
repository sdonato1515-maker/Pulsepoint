import express from 'express'
import cors from 'cors'
import intelligenceRouter from './routes/intelligence.js'
import competitorsRouter from './routes/competitors.js'
import marketPulseRouter from './routes/marketPulse.js'
import innovationRouter from './routes/innovation.js'
import digestRouter from './routes/digest.js'
import { initStore } from './store.js'

const app = express()
const PORT = process.env.PORT || 3001

// Allow both local dev and any Vercel preview/production deployment
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman) and any allowed origin
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true)
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`))
    }
  },
  credentials: true,
}))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1.0', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/intelligence', intelligenceRouter)
app.use('/api/competitors', competitorsRouter)
app.use('/api/market-pulse', marketPulseRouter)
app.use('/api/innovation', innovationRouter)
app.use('/api/digest', digestRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

// Start listening immediately, then load Supabase data in background
app.listen(PORT, () => {
  console.log(`PulsePoint API running on http://localhost:${PORT}`)
  console.log(`Health: http://localhost:${PORT}/api/health`)
  initStore().catch(err => console.error('Store init error:', err))
})
