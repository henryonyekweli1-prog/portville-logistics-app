import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Order from "@/models/Order";
import "@/models/User";
import { isAdmin } from "@/lib/auth";

export async function GET(req) {
 const { res } = await isAdmin();
 if (res) return res;
 await connect();

 const { searchParams } = new URL(req.url);
 const dateStr = searchParams.get("date") || new Date().toISOString().slice(0, 10);
 const start = new Date(dateStr + "T00:00:00.000Z");
 const end = new Date(dateStr + "T23:59:59.999Z");

 const orders = await Order.find({
 $or: [
 { createdAt: { $gte: start, $lte: end } },
 { paymentSubmittedAt: { $gte: start, $lte: end } },
 { updatedAt: { $gte: start, $lte: end } }
 ]
 }).populate("vendor", "name email").sort({ createdAt: -1 }).lean();

 const stats = {
 totalOrders: orders.length,
 totalAmount: orders.reduce((s, o) => s + (o.amount || 0), 0),
 pending: orders.filter(o => o.paymentStatus === "pending").length,
 confirmed: orders.filter(o => o.paymentStatus === "confirmed").length,
 rejected: orders.filter(o => o.paymentStatus === "rejected").length,
 delivered: orders.filter(o => o.status === "delivered" || o.status === "received").length,
 confirmedAmount: orders.filter(o => o.paymentStatus === "confirmed").reduce((s, o) => s + (o.amount || 0), 0),
 };

 return NextResponse.json({ date: dateStr, stats, orders });
}