import { NextResponse } from "next/server"; import { connect } from "@/lib/db"; import Order from "@/models/Order"; import { isAdmin } from "@/lib/auth";
export async function PATCH(req,{params}){
  const {user,res}=await isAdmin();if(res)return res;
  const {action,adminNote}=await req.json();
  if(!["confirm","reject"].includes(action))return NextResponse.json({error:"action must be confirm or reject"},{status:400});
  await connect();const o=await Order.findById(params.id);
  if(!o)return NextResponse.json({error:"Order not found"},{status:404});
  if(o.paymentStatus!=="pending"||!o.paymentReference)return NextResponse.json({error:"Only submitted, pending payments can be reviewed"},{status:409});
  o.paymentStatus=action==="confirm"?"confirmed":"rejected";
  o.adminNote=(adminNote||"").slice(0,300);o.reviewedBy=user._id;o.reviewedAt=new Date();
  await o.save();return NextResponse.json(o)}
