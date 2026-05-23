import express from "express";
import upload from "../middleware/file.middleware.js";
import { fileController } from "../controllers/fileController.js";
const fileRouter = express.Router()
fileRouter.post("/",upload.single("projectZip"),fileController)
export default fileRouter