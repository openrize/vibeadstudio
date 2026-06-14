"use client";
import { useEffect, useRef } from "react";

export default function ApiTerminal({ logs, onClear }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className="card p-5 border border-slate-200 bg-white space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 text-cyan-400 font-mono text-[10px] font-bold">
            &gt;_
          </span>
          Studio API Server Console
        </h4>
        <button
          onClick={onClear}
          className="text-[10px] text-slate-400 hover:text-slate-600 font-bold uppercase tracking-wider focus:outline-none"
        >
          Clear Terminal
        </button>
      </div>

      {/* Monospace terminal box */}
      <div className="h-48 bg-slate-950 rounded-xl p-4 overflow-y-auto font-mono text-[11px] leading-relaxed shadow-inner border border-slate-900">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic">No API traffic logged. Scrape a site or toggle roles to trigger server events.</div>
        ) : (
          <div className="space-y-1.5">
            {logs.map((log, idx) => {
              const dateStr = new Date(log.timestamp).toLocaleTimeString();
              return (
                <div key={idx} className="flex items-start gap-2 border-b border-slate-900 pb-1 last:border-0 last:pb-0">
                  <span className="text-slate-550 shrink-0 select-none">[{dateStr}]</span>
                  <div className="flex-1 space-y-0.5">
                    {/* Log status prefix */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                        log.status === "success" ? "bg-emerald-950 text-emerald-400 border border-emerald-900" :
                        log.status === "error" ? "bg-rose-950 text-rose-400 border border-rose-900" :
                        "bg-cyan-950 text-cyan-400 border border-cyan-900"
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-slate-400 font-bold">HTTP 200 / API v1</span>
                    </div>
                    {/* Log description */}
                    <p className="text-slate-350">{log.details}</p>
                    {/* SQL query mock */}
                    {log.sql && (
                      <p className="text-amber-500/80 text-[10px] bg-slate-900/60 p-1.5 rounded border border-slate-900 select-all">
                        <span className="text-amber-600 font-bold">SQL: </span> {log.sql}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="text-[10px] text-slate-400 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
        <span>Authorization Mode: JWT Session cookie</span>
        <span className="font-semibold text-slate-650">Rate limit: 100 req / 15m</span>
      </div>
    </div>
  );
}
