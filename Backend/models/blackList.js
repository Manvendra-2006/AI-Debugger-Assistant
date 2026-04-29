import mongoose from "mongoose";
const BlackListData = mongoose.Schema({
    token:{
        type:String,
        required:true
    }
},{
    timestamps:true
})
export default mongoose.model("blacklist",BlackListData)