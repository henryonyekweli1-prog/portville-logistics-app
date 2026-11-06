"use client";
import { useEffect, useState } from "react";
import Shell from "@/components/Shell";

export default function Activity() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [data, setData] = useState(null);

  async function load(d) {
    const r = await fetch(/api/admin/activity?date=${d});
    if (r.status === 401 || r.status === 403) return location.href = "/";
    setData(await r.json());
  }
  useEffect(() => { load(date); }, [date]);

  const s = data?.stats;
  return (
    <Shell title="Daily Activity">
      <div className="flex gap-2 mb-4 items-center">
        <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} />
        <button className="btn-ghost" onClick={() => setDate(today)}>Today</button>
        <a href="/admin" className="btn-ghost">Back to Payments</a>
      </div>

      {s && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="card"><p className="text-sm text-slate-500">Total Orders</p><p className="text-2xl font-bold">{s.totalOrders}</p></div>
          <div className="card"><p className="text-sm text-slate-500">Confirmed Amount</p><p className="text-2xl font-bold">₦{s.confirmedAmount?.toLocaleString()}</p></div>
          <div className="card"><p className="text-sm text-slate-500">Confirmed / Pending / Rejected</p><p className="text-2xl font-bold">{s.confirmed} / {s.pending} / {s.rejected}</p></div>
          <div className="card"><p className="text-sm text-slate-500">Delivered</p><p className="text-2xl font-bold">{s.delivered}</p></div>
        </div>
      )}

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-50 text-navy"><tr>{["Vendor","Order","Amount","Payment","Status","Created"].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>
            {(!data?.orders?.length) && <tr><td colSpan={6} className="px-4 py-6 text-slate-600">No activities for this day.</td></tr>}
            {data?.orders?.map(r => (
              <tr key={r._id} className="border-t border-slate-200">
                <td className="px-4 py-3">{r.vendor?.name || r.vendor?.email}</td>
                <td className="px-4 py-3">{r.item}</td>
                <td className="px-4 py-3">₦{r.amount?.toLocaleString()}</td>
                <td className="px-4 py-3">{r.paymentMethod?.replace("_"," ")} - {r.paymentReference || "-"}</td>
                <td className="px-4 py-3">{r.paymentStatus || "-"} / {r.status || "-"}</td>
                <td className="px-4 py-3">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}