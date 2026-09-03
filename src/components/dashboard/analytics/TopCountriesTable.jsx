export default function TopCountriesTable({ data }) {
  if (!data || data.length === 0) {
    return <div style={{ height: "150px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}>No region data</div>;
  }

  const maxScans = Math.max(...data.map(d => d.scans));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {data.map((country, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "120px", fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {country.name}
          </div>
          
          <div style={{ flex: 1, height: "8px", background: "var(--color-bg)", borderRadius: "var(--radius-pill)", overflow: "hidden" }}>
             <div style={{ 
               height: "100%", 
               background: "var(--color-primary)", 
               width: `${(country.scans / maxScans) * 100}%`,
               borderRadius: "var(--radius-pill)"
             }} />
          </div>
          
          <div style={{ width: "40px", textAlign: "right", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text)" }}>
            {country.scans}
          </div>
        </div>
      ))}
    </div>
  );
}
