import { NextResponse } from "next/server"; import bcrypt from "bcryptjs";
import { connect } from "@/lib/db"; import User from "@/models/User"; import { signToken,setCookie } from "@/lib/auth";
export async function POST(req){
  const {name,email,password,role}=await req.json();
  if(!email||!password||password.length<8)return NextResponse.json({error:"Email and a password of 8+ characters are required"},{status:400});
  await connect();
  if(await User.findOne({email:email.toLowerCase()}))return NextResponse.json({error:"Email already registered"},{status:409});
  // Public signup can only create vendor or rider. Admins are set directly in the database.
  const isAdmin = email.toLowerCase() === "portvillelogistics@gmail.com";
const finalRole = isAdmin ? "admin": role==="rider" ? "rider": "vendor";
const u=await User.create({name,email,password:await bcrypt.hash(password,10),role:finalRole});
  const res=NextResponse.json({role:u.role}); setCookie(res,signToken(u)); return res}
