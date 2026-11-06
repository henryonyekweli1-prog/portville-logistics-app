const C={pending:"bg-amber-100 text-amber-800",confirmed:"bg-emerald-100 text-emerald-800",rejected:"bg-red-100 text-red-800"};
export default function StatusBadge({s}){return <span className={`rounded px-2 py-0.5 text-xs font-medium ${C[s]||"bg-navy-50 text-navy"}`}>{s.replace("_"," ")}</span>}
