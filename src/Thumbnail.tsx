import React from "react";
import { AbsoluteFill } from "remotion";

// Rebyte Logo Component (same as in RebyteIntro)
const RebyteLogo = ({ size = 60, color = "#1f2937", innerColor = "#f8fafc" }: { size?: number; color?: string; innerColor?: string }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} aria-label="Rebyte">
    <circle cx="8" cy="16" r="8" fill={color} />
    <path d="M19 8 H24 C28.418 8 32 11.582 32 16 C32 20.418 28.418 24 24 24 H19 V8 Z" fill={color} />
    <rect x="4" y="14.5" width="12" height="3" fill={innerColor} />
    <rect x="19" y="14.5" width="10" height="3" fill={innerColor} />
  </svg>
);

export const Thumbnail = () => {
  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 60,
    }}>
      {/* Main content */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 30,
      }}>
        {/* Logo and brand */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}>
          <RebyteLogo size={100} color="#1f2937" />
          <span style={{
            fontFamily: "system-ui",
            fontSize: 72,
            fontWeight: 700,
            color: "#1f2937",
          }}>
            Rebyte
          </span>
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: "system-ui",
          fontSize: 36,
          fontWeight: 500,
          color: "#6b7280",
          textAlign: "center",
          margin: 0,
          maxWidth: 800,
        }}>
          Vibe working with skilled code agents
        </p>

        {/* Capability pills - two rows */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "center",
          marginTop: 20,
        }}>
          {/* Row 1 */}
          <div style={{ display: "flex", gap: 12 }}>
            {[
              "Create Apps",
              "Build Forms",
              "Data Analysis",
              "Deep Research",
              "Code Review",
            ].map((label) => (
              <div key={label} style={{
                padding: "10px 20px",
                backgroundColor: "white",
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}>
                <span style={{
                  fontFamily: "system-ui",
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#374151",
                }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          {/* Row 2 - Coding focused */}
          <div style={{ display: "flex", gap: 12 }}>
            {[
              "Chrome Extension",
              "Desktop App",
              "Security Review",
              "YouTube Transcripts",
            ].map((label) => (
              <div key={label} style={{
                padding: "10px 20px",
                backgroundColor: "white",
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}>
                <span style={{
                  fontFamily: "system-ui",
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#374151",
                }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
