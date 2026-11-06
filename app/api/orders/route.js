import { NextResponse } from "next/server"; import { connect } from "@/lib/db"; import Order from "@/models/Order"; import { requireRole } from "@/lib/auth";
export async function GET(){const {user,res}=await requireRole("vendor");if(res)return res;await connect();
  return NextResponse.json(await Order.find({vendor:user._id}).sort({createdAt:-1}).lean())}
export async function POST(req){const {user,res}=await requireRole("vendor");if(res)return res;
  const b=await req.json();await connect();
  const o=await Order.create({vendor:user._id,pickupAddress:b.pickupAddress,dropoffAddress:b.dropoffAddress,item:b.item,amount:Number(b.amount)||0});
  return NextResponse.json(o,{status:201})}
