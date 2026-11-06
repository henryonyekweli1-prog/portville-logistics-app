"use client";
import { useState } from "react";
export default function Home(){
  const [mode,setMode]=useState("login");const [f,setF]=useState({name:"",email:"",password:"",role:"vendor"});const [err,setErr]=useState("");
  const set=k=>e=>setF({...f,[k]:e.target.value});
  async function go(e){e.preventDefault();setErr("");
    const r=await fetch(`/api/auth/${mode}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)});
    const d=await r.json();if(!r.ok)return setErr(d.error);location.href="/"+d.role}
  return(<main className="grid min-h-screen place-items-center px-4"><div className="w-full max-w-sm">
    <img src="/logo.png" alt="Portville Logistics" className="mx-auto mb-4 h-24 w-auto"/>
    <h1 className="mb-6 text-center text-lg font-semibold text-navy">Portville Logistics Limited</h1>
    <form onSubmit={go} className="card space-y-3">
      {mode==="register"&&<><input className="input" placeholder="Full name" value={f.name} onChange={set("name")}/>
        <select className="input" value={f.role} onChange={set("role")}><option value="vendor">Vendor</option><option value="rider">Rider</option></select></>}
      <input className="input" type="email" placeholder="Email" value={f.email} onChange={set("email")} required/>
      <input className="input" type="password" placeholder="Password" value={f.password} onChange={set("password")} required/>
      {err&&<p className="text-sm text-red-700" role="alert">{err}</p>}
      <button className="btn-primary w-full">{mode==="login"?"Sign in":"Create account"}</button>
      <button type="button" className="w-full text-sm text-navy underline" onClick={()=>setMode(mode==="login"?"register":"login")}>
        {mode==="login"?"Create an account":"I already have an account"}</button>
    </form></div></main>)}
