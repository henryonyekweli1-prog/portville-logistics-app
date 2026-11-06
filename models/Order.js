import mongoose from "mongoose";
// Delivery flow: pending -> accepted -> picked_up -> in_transit -> delivered
export const DELIVERY_STEPS=["pending","accepted","picked_up","in_transit","delivered"];
const S=new mongoose.Schema({
  vendor:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
  rider:{type:mongoose.Schema.Types.ObjectId,ref:"User",default:null},
  pickupAddress:String,dropoffAddress:String,item:String,amount:Number,
  deliveryStatus:{type:String,enum:DELIVERY_STEPS,default:"pending"},
  paymentMethod:{type:String,enum:["bank_transfer","pos_debit"]},
  paymentReference:String,
  paymentStatus:{type:String,enum:["pending","confirmed","rejected"],default:"pending"},
  adminNote:{type:String,default:""},
  paymentSubmittedAt:Date,reviewedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},reviewedAt:Date
},{timestamps:true});
export default mongoose.models.Order||mongoose.model("Order",S);
