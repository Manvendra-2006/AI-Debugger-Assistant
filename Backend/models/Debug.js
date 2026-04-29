import mongoose from "mongoose";
const debugModel = mongoose.Schema({
    code:{
        type:String,
        required:true
    }
},{
    timeStamps:true
})
export default mongoose.model("debugData",debugModel)