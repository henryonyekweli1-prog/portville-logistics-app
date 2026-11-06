"use client";
import { useEffect,useState } from "react"; import Shell from "@/components/Shell";
export default function Admin(){
  const [rows,setRows]=useState([]);const [err,setErr]=useState("");const [notes,setNotes]=useState({});
  const load=async()=>{const r=await fetch("/api/admin/payments");if(r.status===401||r.status===403)return location.href="/";setRows(await r.json())};
  useEffect(()=>{load()},[]);
  async function act(id,action){setErr("");const r=await fetch(`/api/admin/payments/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,adminNote:notes[id]||""})});
    if(!r.ok)setErr((await r.json()).error);load()}
  return(<Shell title="Payment review">{err&&<p className="mb-3 text-sm text-red-700" role="alert">{err}</p>}
    <div className="card overflow-x-auto p-0"><table className="w-full text-left text-sm">
      <thead className="bg-navy-50 text-navy"><tr>{["Vendor","Order","Amount","Method","Reference","Submitted","Note","Action"].map(h=><th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
      <tbody>{rows.length===0&&<tr><td colSpan={8} className="px-4 py-6 text-slate-600">No payments waiting for review.</td></tr>}
        {rows.map(r=><tr key={r._id} className="border-t border-slate-200">
          <td className="px-4 py-3">{r.vendor?.name||r.vendor?.email}</td><td className="px-4 py-3">{r.item}</td>
          <td className="px-4 py-3">₦{r.amount?.toLocaleString()}</td><td className="px-4 py-3">{r.paymentMethod?.replace("_"," ")}</td>
          <td className="px-4 py-3 font-mono">{r.paymentReference}</td><td className="px-4 py-3">{new Date(r.paymentSubmittedAt).toLocaleString()}</td>
          <td className="px-4 py-3"><input className="input w-40" placeholder="Optional note" value={notes[r._id]||""} onChange={e=>setNotes({...notes,[r._id]:e.target.value})}/></td><td className="flex gap-2 px-4 py-3"><button className="btn-primary" onClick={()=>act(r._id,"confirm")}>Confirm</button>
            <button className="btn-ghost" onClick={()=>act(r._id,"reject")}>Reject</button></td></tr>)}</tbody></table></div></Shell>)}
