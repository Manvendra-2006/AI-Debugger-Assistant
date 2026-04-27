import express from 'express'
import { getMe, Login, LogoutController, SignUp } from '../controllers/authControllers.js'
import { authUser } from '../middleware/auth.middleware.js'
const authRouter = express.Router()
authRouter.post("/signup",SignUp)
authRouter.post("/login",Login)
authRouter.post("/logout",LogoutController)
authRouter.get("/get-me",authUser,getMe)
export default authRouter