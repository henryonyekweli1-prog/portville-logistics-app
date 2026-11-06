"use client";
import { useEffect,useState } from "react"; import Shell from "@/components/Shell"; import StatusBadge from "@/components/StatusBadge";
const ACCOUNT={bank:"Access Bank Plc",name:"Portville Logistics",no:"1525671373"};
export default function Vendor(){
  const [orders,setOrders]=useState([]);const [o,setO]=useState({item:"",pickupAddress:"",dropoffAddress:"",amount:""});const [msg,setMsg]=useState("");
  const load=async()=>{const r=await fetch("/api/orders");if(r.status===401||r.status===403)return location.href="/";setOrders(await r.json())};
  useEffect(()=>{load()},[]);
  async function create(e){e.preventDefault();await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});setO({item:"",pickupAddress:"",dropoffAddress:"",amount:""});load()}
  return(<Shell title="Vendor dashboard">
    <section className="card mb-6 border-navy bg-navy-50" aria-label="Payment details">
      <h2 className="font-semibold text-navy">Pay for your delivery</h2>
      <dl className="mt-2 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-3">
        <div><dt className="text-slate-600">Bank</dt><dd className="font-medium">{ACCOUNT.bank}</dd></div>
        <div><dt className="text-slate-600">Account name</dt><dd className="font-medium">{ACCOUNT.name}</dd></div>
        <div><dt className="text-slate-600">Account number</dt><dd className="font-mono text-lg font-semibold">{ACCOUNT.no}</dd></div></dl>
      <p className="mt-2 text-sm text-slate-600">After paying, submit the method and reference on your order. Riders can only take your order once an admin confirms payment.</p></section>
    <form onSubmit={create} className="card mb-6 grid gap-3 sm:grid-cols-2">
      <input className="input" placeholder="Item" value={o.item} onChange={e=>setO({...o,item:e.target.value})} required/>
      <input className="input" type="number" placeholder="Amount (₦)" value={o.amount} onChange={e=>setO({...o,amount:e.target.value})} required/>
      <input className="input" placeholder="Pickup address" value={o.pickupAddress} onChange={e=>setO({...o,pickupAddress:e.target.value})} required/>
      <input className="input" placeholder="Drop-off address" value={o.dropoffAddress} onChange={e=>setO({...o,dropoffAddress:e.target.value})} required/>
      <button className="btn-primary sm:col-span-2">Create order</button></form>
    {msg&&<p className="mb-3 text-sm text-red-700" role="alert">{msg}</p>}
    <div className="space-y-3">{orders.length===0&&<p className="text-sm text-slate-600">No orders yet. Create your first order above.</p>}
      {orders.map(x=><OrderRow key={x._id} x={x} setMsg={setMsg} reload={load}/>)}</div></Shell>)}
function OrderRow({x,setMsg,reload}){
  const [method,setMethod]=useState("bank_transfer");const [ref,setRef]=useState("");
  async function pay(e){e.preventDefault();setMsg("");
    const r=await fetch(`/api/orders/${x._id}/payment`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({paymentMethod:method,paymentReference:ref})});
    if(!r.ok)setMsg((await r.json()).error);reload()}
  const canPay=!x.paymentReference||x.paymentStatus==="rejected";
  return(<div className="card"><div className="flex flex-wrap items-center justify-between gap-2">
    <div><p className="font-medium">{x.item} · ₦{x.amount?.toLocaleString()}</p><p className="text-sm text-slate-600">{x.pickupAddress} to {x.dropoffAddress}</p></div>
    <div className="flex gap-2"><StatusBadge s={x.paymentStatus}/><StatusBadge s={x.deliveryStatus}/></div></div>
    {x.paymentReference&&<p className="mt-2 text-sm text-slate-600">Submitted: {x.paymentMethod.replace("_"," ")}, ref {x.paymentReference}</p>}
    {x.paymentStatus==="rejected"&&<p className="mt-1 text-sm text-red-700">Payment was rejected.{x.adminNote?` Admin note: ${x.adminNote}.`:""} Check the reference and submit again.</p>}
    {canPay&&<form onSubmit={pay} className="mt-3 flex flex-wrap gap-2">
      <select className="input w-auto" value={method} onChange={e=>setMethod(e.target.value)}><option value="bank_transfer">Bank transfer</option><option value="pos_debit">POS debit</option></select>
      <input className="input w-auto flex-1" placeholder="Payment reference" value={ref} onChange={e=>setRef(e.target.value)} required/>
      <button className="btn-primary">Submit payment</button></form>}</div>)}
