"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminScansChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="adminScans" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-light)" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} allowDecimals={false} />
        <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "var(--shadow-md)" }} itemStyle={{ color: "var(--color-primary)", fontWeight: 600 }} />
        <Area type="monotone" dataKey="scans" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#adminScans)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}