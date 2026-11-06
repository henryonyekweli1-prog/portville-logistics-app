import mongoose from "mongoose";
const S=new mongoose.Schema({name:String,email:{type:String,unique:true,lowercase:true},password:String,
  role:{type:String,enum:["vendor","rider","admin"],default:"vendor"}},{timestamps:true});
export default mongoose.models.User||mongoose.model("User",S);
