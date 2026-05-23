import express from 'express'
import authRouter from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import debugRouter from './routes/debugRoutes.js'
import path from 'path'
import fileRouter from './routes/fileroutes.js'
const app = express()
const _dirname = path.resolve()

app.use(cookieParser())
app.use(cors({
   origin: [
        "http://localhost:5173",
        "https://ai-debugger-assistant-geyf.vercel.app"  
    ],
    credentials:true
}))
app.use(express.json())
app.use("/api/auth",authRouter)
app.use("/api/debug",debugRouter)
app.use("/api/files",fileRouter)
app.use(express.static(path.join(_dirname,"/Frontend/Debugger/dist")))
app.get('/*splat',(req,resp)=>{
    resp.sendFile(path.resolve(_dirname,"Frontend","Debugger","dist","index.html"))
})
export default app