"use client";

import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ScansChart({ data }) {
  // Mock data if none provided
  const chartData = data || [
    { name: "Mon", scans: 120 },
    { name: "Tue", scans: 250 },
    { name: "Wed", scans: 180 },
    { name: "Thu", scans: 400 },
    { name: "Fri", scans: 350 },
    { name: "Sat", scans: 480 },
    { name: "Sun", scans: 600 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      style={{
        background: "var(--color-surface)",
        padding: "1.5rem",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border-light)",
        boxShadow: "var(--shadow-sm)",
        height: "400px",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)" }}>Scans Over Time</h3>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>Last 7 days performance</p>
      </div>
      <div style={{ width: "100%", height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-light)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
            <Tooltip 
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "var(--shadow-md)" }}
              itemStyle={{ color: "var(--color-primary)", fontWeight: 600 }}
            />
            <Area type="monotone" dataKey="scans" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
