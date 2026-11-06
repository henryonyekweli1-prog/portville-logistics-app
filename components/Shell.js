"use client";
export default function Shell({title,children}){
  async function out(){await fetch("/api/auth/logout",{method:"POST"});location.href="/"}
  return(<div className="min-h-screen">
    <header className="bg-white border-b border-slate-300">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3"><img src="/logo.png" alt="Portville Logistics" className="h-10 w-auto"/>
          <span className="font-semibold text-navy">Portville Logistics Limited</span></div>
        <button onClick={out} className="btn-ghost">Sign out</button></div></header>
    <main className="mx-auto max-w-5xl px-4 py-6"><h1 className="mb-5 text-xl font-semibold text-navy">{title}</h1>{children}</main></div>)}
