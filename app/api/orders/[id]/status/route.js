import { NextResponse } from "next/server"; import { connect } from "@/lib/db"; import Order,{DELIVERY_STEPS} from "@/models/Order"; import { requireRole } from "@/lib/auth";
// Rider advances their own order one step: accepted -> picked_up -> in_transit -> delivered
export async function PATCH(_req,{params}){
  const {user,res}=await requireRole("rider");if(res)return res;await connect();
  const o=await Order.findOne({_id:params.id,rider:user._id});
  if(!o)return NextResponse.json({error:"Order not found"},{status:404});
  if(o.paymentStatus!=="confirmed")return NextResponse.json({error:"Payment not confirmed"},{status:403});
  const i=DELIVERY_STEPS.indexOf(o.deliveryStatus);
  if(i<1||i>=DELIVERY_STEPS.length-1)return NextResponse.json({error:"No further step"},{status:409});
  o.deliveryStatus=DELIVERY_STEPS[i+1];await o.save();return NextResponse.json(o)}
