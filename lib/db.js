import mongoose from "mongoose";
let cached=global._mongo||(global._mongo={conn:null,p:null});
export async function connect(){
  if(cached.conn)return cached.conn;
  cached.p=cached.p||mongoose.connect(process.env.MONGODB_URI);
  return(cached.conn=await cached.p)}
