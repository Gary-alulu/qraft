"use client";

import { motion } from "motion/react";

const useCases = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M3.5 7H24.5V22.75C24.5 23.3 24.05 23.75 23.5 23.75H4.5C3.95 23.75 3.5 23.3 3.5 22.75V7Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3.5 7L14 15.75L24.5 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="8.75" y="3.5" width="10.5" height="5.25" rx="1" stroke="currentColor" strokeWidth="1.75"/>
      </svg>
    ),
    title: "Restaurants & Cafés",
    description: "Replace paper menus with dynamic QR codes. Update dishes, prices, and specials in real time — no reprinting needed.",
    example: "Digital menu, Wi-Fi login, review link, reservation booking",
    color: "var(--color-accent)",
    bgColor: "rgba(255, 107, 44, 0.08)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3.5" y="5.25" width="21" height="17.5" rx="2" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M3.5 10.5H24.5" stroke="currentColor" strokeWidth="1.75"/>
        <circle cx="7" cy="7.875" r="1.125" fill="currentColor"/>
        <circle cx="10.5" cy="7.875" r="1.125" fill="currentColor"/>
        <rect x="7" y="14" width="5.25" height="5.25" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M15.75 15.75H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15.75 18.375H19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Retail & E-commerce",
    description: "Add QR codes to product packaging, receipts, and store displays. Link to product info, loyalty programs, or reviews.",
    example: "Product details, warranty registration, loyalty rewards, reorder link",
    color: "var(--color-secondary)",
    bgColor: "rgba(0, 212, 255, 0.08)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="5.25" y="3.5" width="17.5" height="21" rx="2" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M9.625 8.75H18.375" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9.625 12.25H15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9.625 15.75H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12.25 19.25H15.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      </svg>
    ),
    title: "Events & Conferences",
    description: "Streamline check-ins, share schedules, and collect feedback. One scan does it all — from registration to post-event surveys.",
    example: "Ticket check-in, event schedule, speaker bios, feedback form",
    color: "#8B5CF6",
    bgColor: "rgba(139, 92, 246, 0.08)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3.5L24.5 8.75V19.25L14 24.5L3.5 19.25V8.75L14 3.5Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/>
        <path d="M14 13.125V24.5" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M3.5 8.75L14 13.125L24.5 8.75" stroke="currentColor" strokeWidth="1.75"/>
      </svg>
    ),
    title: "Marketing & Agencies",
    description: "Run multi-channel campaigns with trackable QR codes on print, packaging, and OOH. Measure ROI with real scan analytics.",
    example: "Campaign tracking, A/B testing, multi-channel attribution, lead capture",
    color: "var(--color-primary)",
    bgColor: "rgba(30, 58, 95, 0.08)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M3.5 21V10.5C3.5 9.395 4.395 8.5 5.5 8.5H22.5C23.605 8.5 24.5 9.395 24.5 10.5V21C24.5 22.105 23.605 23 22.5 23H5.5C4.395 23 3.5 22.105 3.5 21Z" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M8.75 8.5V6C8.75 4.895 9.645 4 10.75 4H17.25C18.355 4 19.25 4.895 19.25 6V8.5" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M14 14V18.375" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        <path d="M11.375 16.625H16.625" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      </svg>
    ),
    title: "Real Estate",
    description: "Place QR codes on for-sale signs, brochures, and open house materials. Instantly connect buyers to virtual tours and listings.",
    example: "Virtual tour, floor plans, agent contact, mortgage calculator",
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.08)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="10.5" r="3.5" stroke="currentColor" strokeWidth="1.75"/>
        <path d="M8.75 24.5V22.75C8.75 19.85 11.1 17.5 14 17.5C16.9 17.5 19.25 19.85 19.25 22.75V24.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        <rect x="3.5" y="3.5" width="21" height="21" rx="4" stroke="currentColor" strokeWidth="1.75"/>
      </svg>
    ),
    title: "Healthcare",
    description: "Share patient info securely, link to appointment booking, or provide medication instructions via scannable codes.",
    example: "Appointment booking, patient portal, medication guide, facility info",
    color: "#EC4899",
    bgColor: "rgba(236, 72, 153, 0.08)",
  },
];

export default function UseCases() {
  return (
    <section
      id="use-cases"
      className="section-padding"
      style={{ background: "var(--color-surface)", position: "relative" }}
    >
      <div className="container-qraft">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.375rem 1rem",
              borderRadius: "var(--radius-pill)",
              background: "rgba(30, 58, 95, 0.06)",
              color: "var(--color-primary)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--color-primary)",
              }}
            />
            Built for every industry
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "var(--color-text)",
              lineHeight: 1.15,
              marginBottom: "1rem",
            }}
          >
            QR codes for{" "}
            <span className="gradient-text">every use case</span>
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--color-text-secondary)",
              maxWidth: "540px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            From restaurant menus to real estate listings — see how businesses use Qraft to connect the physical and digital world.
          </p>
        </motion.div>

        {/* Grid */}
        <div
          className="use-cases-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
          }}
        >
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="card-hover"
              style={{
                background: "var(--color-bg)",
                borderRadius: "var(--radius-xl)",
                padding: "2rem",
                border: "1px solid var(--color-border-light)",
                display: "flex",
                flexDirection: "column",
                cursor: "default",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "var(--radius-lg)",
                  background: uc.bgColor,
                  color: uc.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                }}
              >
                {uc.icon}
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--color-text)",
                  marginBottom: "0.625rem",
                }}
              >
                {uc.title}
              </h3>

              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: "1.25rem",
                  flex: 1,
                }}
              >
                {uc.description}
              </p>

              {/* Example pill tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                {uc.example.split(", ").map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "0.25rem 0.625rem",
                      borderRadius: "var(--radius-pill)",
                      background: uc.bgColor,
                      color: uc.color,
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Responsive */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .use-cases-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .use-cases-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
