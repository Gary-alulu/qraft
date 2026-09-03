"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)'];

export default function DevicePieChart({ data }) {
  if (!data || data.length === 0) {
    return <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}>No device data</div>;
  }

  return (
    <div style={{ width: '100%', height: '200px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--color-surface)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
              color: 'var(--color-text)'
            }}
            itemStyle={{ color: 'var(--color-text)', fontWeight: 600 }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
