import { NextResponse } from "next/server"; import { connect } from "@/lib/db"; import Order from "@/models/Order"; import { requireRole } from "@/lib/auth";
export async function GET(){const {user,res}=await requireRole("admin");if(res)return res;await connect();
return NextResponse.json(await Order.find({}).sort({createdAt:-1}).lean())}