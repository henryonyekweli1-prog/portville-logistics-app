import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connect } from "./db";
import User from "@/models/User";

export const signToken=(u)=>jwt.sign({id:String(u._id)},process.env.JWT_SECRET,{expiresIn:"7d"});
export const setCookie=(res,t)=>res.cookies.set("token",t,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:604800});

// Role is always re-read from the DB, never trusted from the client.
export async function getUser(){
  const t=cookies().get("token")?.value; if(!t)return null;
  try{const {id}=jwt.verify(t,process.env.JWT_SECRET);await connect();return await User.findById(id).lean()}catch{return null}}

const deny=(s,m)=>NextResponse.json({error:m},{status:s});
export async function requireUser(){const u=await getUser();return u?{user:u}:{res:deny(401,"Not signed in")}}
export async function requireRole(role){
  const {user,res}=await requireUser(); if(res)return{res};
  return user.role===role?{user}:{res:deny(403,`${role} access only`)}}
// isAdmin middleware for route handlers
export const isAdmin=()=>requireRole("admin");
