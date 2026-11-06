"use client";
import { useEffect,useState } from "react"; import Shell from "@/components/Shell"; import StatusBadge from "@/components/StatusBadge";
const NEXT={accepted:"Mark picked up",picked_up:"Mark in transit",in_transit:"Mark delivered"};
export default function Rider(){
  const [d,setD]=useState({open:[],mine:[]});const [err,setErr]=useState("");
  const load=async()=>{const r=await fetch("/api/rider/orders");if(r.status===401||r.status===403)return location.href="/";setD(await r.json())};
  useEffect(()=>{load()},[]);
  async function call(url,m){setErr("");const r=await fetch(url,{method:m});if(!r.ok)setErr((await r.json()).error);load()}
  return(<Shell title="Rider dashboard">{err&&<p className="mb-3 text-sm text-red-700" role="alert">{err}</p>}
    <h2 className="mb-2 font-semibold">Available orders</h2>
    <div className="mb-8 space-y-3">{d.open.length===0&&<p className="text-sm text-slate-600">No open orders right now.</p>}
      {d.open.map(x=><div key={x._id} className="card flex flex-wrap items-center justify-between gap-2">
        <div><p className="font-medium">{x.item}</p><p className="text-sm text-slate-600">{x.pickupAddress} to {x.dropoffAddress}</p></div>
        <div className="flex items-center gap-2"><StatusBadge s={x.paymentStatus}/>
          {/* Button state is a UI hint only; the API enforces the 403 */}
          <button className="btn-primary" disabled={x.paymentStatus!=="confirmed"} onClick={()=>call(`/api/rider/orders/${x._id}/accept`,"POST")}>
            {x.paymentStatus==="confirmed"?"Accept":"Awaiting payment"}</button></div></div>)}</div>
    <h2 className="mb-2 font-semibold">My deliveries</h2>
    <div className="space-y-3">{d.mine.map(x=><div key={x._id} className="card flex flex-wrap items-center justify-between gap-2">
      <div><p className="font-medium">{x.item}</p><p className="text-sm text-slate-600">{x.pickupAddress} to {x.dropoffAddress}</p></div>
      <div className="flex items-center gap-2"><StatusBadge s={x.deliveryStatus}/>
        {NEXT[x.deliveryStatus]&&<button className="btn-primary" onClick={()=>call(`/api/orders/${x._id}/status`,"PATCH")}>{NEXT[x.deliveryStatus]}</button>}</div></div>)}</div></Shell>)}
