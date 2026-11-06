"use client";
import { useEffect, useState } from "react";
import Shell from "../components/Shell";

export default function Admin() {
  const [rows, setRows] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalPayments: 0, moneyReceived: 0, waiting: 0 });
  const [notes, setNotes] = useState({});
  const [err, setErr] = useState("");

  async function load() {
    try {
      const r = await fetch("/api/admin/payments");
      const data = await r.json();
      const payments = Array.isArray(data) ? data : data.payments || [];
      if (Array.isArray(payments)) setRows(payments);

      const ro2 = await fetch("/api/admin/orders");
      let orderList = [];
      if (ro2.ok) orderList = await ro2.json();
      if (Array.isArray(orderList)) setOrders(orderList);

      const totalPayments = Array.isArray(payments) ? payments.length : 0;
      const moneyReceived = Array.isArray(payments) ? payments.filter((p) => p.status === "confirmed" || p.status === "approved").reduce((s, p) => s + (Number(p.amount) || 0), 0) : 0;
      const waiting = Array.isArray(payments) ? payments.filter((p) => !p.status || p.status === "pending" || p.status === "submitted").length : 0;

      setStats({
        totalOrders: Array.isArray(orderList) ? orderList.length : 0,
        totalPayments,
        moneyReceived,
        waiting,
      });
    } catch (e) {}
  }

  useEffect(() => { load(); }, []);

  async function act(id, action) {
    setErr("");
    const r = await fetch("/api/admin/payment/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, adminNote: notes[id] || "" }),
    });
    if (!r.ok) setErr((await r.json()).error);
    load();
  }

  return (
    <Shell title="Admin Dashboard">
      {err && <p className="mb-3 text-sm text-red-700" role="alert">{err}</p>}

      {/* TOP NUMBERS - 4 BOXES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="card p-4"><p className="text-sm text-slate-500">Total Orders</p><p className="text-2xl font-bold">{stats.totalOrders}</p></div>
        <div className="card p-4"><p className="text-sm text-slate-500">Total Payments</p><p className="text-2xl font-bold">{stats.totalPayments}</p></div>
        <div className="card p-4"><p className="text-sm text-slate-500">Money Received</p><p className="text-2xl font-bold">₦{stats.moneyReceived?.toLocaleString()}</p></div>
        <div className="card p-4"><p className="text-sm text-slate-500">Payments Waiting</p><p className="text-2xl font-bold">{stats.waiting}</p></div>
      </div>

      <h2 className="font-bold mb-2">Payment review</h2>
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-50 text-navy">
            <tr>{["Vendor", "Order", "Amount", "Method", "Reference", "Submitted", "Note", "Action"].map((h) => (<th key={h} className="px-4 py-3 font-medium">{h}</th>))}</tr>
          </thead>
          <tbody>
            {rows.length === 0 && (<tr><td colSpan={8} className="px-4 py-6 text-slate-600">No payments waiting for review.</td></tr>)}
            {rows.map((r) => (
              <tr key={r._id} className="border-t border-slate-200">
                <td className="px-4 py-3">{r.vendor?.name || r.vendor?.email}</td>
                <td className="px-4 py-3">{r.item}</td>
                <td className="px-4 py-3">₦{r.amount?.toLocaleString()}</td>
                <td className="px-4 py-3">{r.paymentMethod?.replace("_", " ")}</td>
                <td className="px-4 py-3">{r.paymentReference}</td>
                <td className="px-4 py-3">{new Date(r.paymentSubmittedAt).toLocaleString()}</td>
                <td className="px-4 py-3"><input className="input w-40" placeholder="Optional note" value={notes[r._id] || ""} onChange={(e) => setNotes({ ...notes, [r._id]: e.target.value })} /></td>
                <td className="px-4 py-3"><div className="flex gap-2"><button className="btn-primary" onClick={() => act(r._id, "confirm")}>Confirm</button><button className="btn-ghost" onClick={() => act(r._id, "reject")}>Reject</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}