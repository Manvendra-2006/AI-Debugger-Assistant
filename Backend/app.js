import "dotenv/config"
import express from 'express'
import authRouter from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import debugRouter from './routes/debugRoutes.js'
import fileRouter from './routes/fileroutes.js'

const app = express()

app.use(cookieParser())
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}))
app.use(express.json())
app.use("/api/auth", authRouter)
app.use("/api/debug", debugRouter)
app.use("/api/files", fileRouter)

export default app