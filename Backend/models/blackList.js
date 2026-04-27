import mongoose from "mongoose";
const BlackListData = mongoose.Schema({
    token:{
        type:String,
        required:true
    }
},{
    timeStamps:true
})
export default mongoose.model("blacklist",BlackListData)