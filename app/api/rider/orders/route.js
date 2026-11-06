import { NextResponse } from "next/server"; import { connect } from "@/lib/db"; import Order from "@/models/Order"; import { requireRole } from "@/lib/auth";
export async function GET(){const {user,res}=await requireRole("rider");if(res)return res;await connect();
  const open=await Order.find({deliveryStatus:"pending",rider:null}).sort({createdAt:1}).lean();
  const mine=await Order.find({rider:user._id}).sort({updatedAt:-1}).lean();
  return NextResponse.json({open,mine})}
