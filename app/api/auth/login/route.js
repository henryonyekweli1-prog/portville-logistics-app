import { NextResponse } from "next/server"; import bcrypt from "bcryptjs";
import { connect } from "@/lib/db"; import User from "@/models/User"; import { signToken,setCookie } from "@/lib/auth";
export async function POST(req){
  const {email,password}=await req.json(); await connect();
  const u=await User.findOne({email:(email||"").toLowerCase()});
  if(!u||!(await bcrypt.compare(password||"",u.password)))return NextResponse.json({error:"Wrong email or password"},{status:401});
  const res=NextResponse.json({role:u.role}); setCookie(res,signToken(u)); return res}
