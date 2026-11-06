import { NextResponse } from "next/server"; import { connect } from "@/lib/db"; import Order from "@/models/Order"; import { requireRole } from "@/lib/auth";
export async function POST(_req,{params}){
  const {user,res}=await requireRole("rider");if(res)return res;
  await connect();
  const o=await Order.findById(params.id);
  if(!o)return NextResponse.json({error:"Order not found"},{status:404});
  // RULE 3 (server-side): only confirmed payments can be accepted
  if(o.paymentStatus!=="confirmed")
    return NextResponse.json({error:"Payment not confirmed. This order cannot be accepted yet."},{status:403});
  // Atomic claim guards against two riders accepting at once
  const claimed=await Order.findOneAndUpdate(
    {_id:params.id,paymentStatus:"confirmed",deliveryStatus:"pending",rider:null},
    {rider:user._id,deliveryStatus:"accepted"},{new:true});
  if(!claimed)return NextResponse.json({error:"Order already taken"},{status:409});
  return NextResponse.json(claimed)}
