import { NextResponse } from "next/server"; import { connect } from "@/lib/db"; import Order from "@/models/Order"; import { requireRole } from "@/lib/auth";
export async function POST(req,{params}){
  const {user,res}=await requireRole("vendor");if(res)return res;
  const {paymentMethod,paymentReference}=await req.json();
  if(!["bank_transfer","pos_debit"].includes(paymentMethod))return NextResponse.json({error:"paymentMethod must be bank_transfer or pos_debit"},{status:400});
  if(!paymentReference||paymentReference.trim().length<4)return NextResponse.json({error:"Enter the payment reference"},{status:400});
  await connect();
  const o=await Order.findOne({_id:params.id,vendor:user._id});
  if(!o)return NextResponse.json({error:"Order not found"},{status:404});
  if(o.paymentStatus==="confirmed")return NextResponse.json({error:"Payment already confirmed"},{status:409});
  o.paymentMethod=paymentMethod;o.paymentReference=paymentReference.trim();o.paymentSubmittedAt=new Date();
  o.paymentStatus="pending";o.adminNote="";   // vendors can never set "confirmed"
  await o.save();return NextResponse.json(o)}
