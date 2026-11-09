import { NextResponse } from "next/server"; import { connect } from "@/lib/db"; import Order from "@/models/Order"; import "@/models/User"; import { isAdmin } from "@/lib/auth";
export async function GET(req){const {res}=await isAdmin();if(res)return res;await connect();
  const status=new URL(req.url).searchParams.get("status")||"pending";
  // only orders where a vendor actually submitted a reference
  return NextResponse.json(await Order.find({paymentStatus:status,paymentReference:{$exists:true,$ne:null}}).populate("vendor","name email").sort({paymentSubmittedAt:1}).lean())}
