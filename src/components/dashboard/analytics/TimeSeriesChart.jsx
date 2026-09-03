"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function TimeSeriesChart({ data }) {
  if (!data || data.length === 0) {
    return <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}>No scan data available</div>;
  }

  return (
    <div style={{ width: '100%', height: '260px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-light)" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} 
            dy={10}
            minTickGap={20}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--color-surface)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
              color: 'var(--color-text)'
            }}
            itemStyle={{ color: 'var(--color-primary)', fontWeight: 600 }}
          />
          <Area 
            type="monotone" 
            dataKey="scans" 
            stroke="var(--color-primary)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorScans)" 
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
