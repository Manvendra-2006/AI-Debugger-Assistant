import mongoose from "mongoose";
const debugModel = mongoose.Schema({
    code:{
        type:String,
        required:true
    },
     IncorrectCode:{
        type:String
     }
},{
    timeStamps:true
})
export default mongoose.model("debugData",debugModel)