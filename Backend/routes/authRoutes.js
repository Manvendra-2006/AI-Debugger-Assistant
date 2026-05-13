import express from 'express'
import { getMe, googleAuthController, Login, LogoutController, SignUp } from '../controllers/authControllers.js'
import { authUser } from '../middleware/auth.middleware.js'
const authRouter = express.Router()
authRouter.post("/signup",SignUp)
authRouter.post("/login",Login)
authRouter.get("/logout",LogoutController)
authRouter.post("/google", googleAuthController)
authRouter.get("/get-me",authUser,getMe)
export default authRouter