import "dotenv/config"
import app from "./app.js";
import connectDb from "./config/db.js";
import invokeGrokII from "./services/ai.service.js";
import { code } from "./services/temp.js";

connectDb()
invokeGrokII(code)
app.listen(process.env.PORT,()=>{
    console.log("Server is running on port 3000")
})