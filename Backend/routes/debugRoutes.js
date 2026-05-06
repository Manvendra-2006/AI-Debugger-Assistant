// import express from 'express'
// import { debugController } from '../controllers/debugController.js'
// const debugRouter = express.Router()
// debugRouter.post("/code",debugController)
// export default debugRouter
import express from 'express'
import { authUser } from '../middleware/auth.middleware.js'
import debugController, { getUserDebugHistory } from '../controllers/debugController.js'
const debugRouter = express.Router()
debugRouter.post("/code", authUser, debugController)
debugRouter.get("/history", authUser, getUserDebugHistory)
export default debugRouter