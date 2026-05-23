import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,   
        unique:true     
    },
    email:{
        type:String,
        required:true,
        unique:[true,"Account already exists with this email"]
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
})
export default mongoose.model("User",userSchema)