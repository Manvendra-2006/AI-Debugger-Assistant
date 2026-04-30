// import express from 'express'
// import { debugController } from '../controllers/debugController.js'
// const debugRouter = express.Router()
// debugRouter.post("/code",debugController)
// export default debugRouter
import express from 'express'
import debugController from '../controllers/debugController.js'
const debugRouter = express.Router()
debugRouter.post("/code",debugController)
export default debugRouter