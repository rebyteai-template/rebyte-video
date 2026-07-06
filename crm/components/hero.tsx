import { Section, Text } from "@react-email/components";
import * as React from "react";

interface HeroProps {
  title: string;
  ctaText: string;
  ctaHref: string;
}

export function Hero({ title, ctaText, ctaHref }: HeroProps) {
  return (
    <Section style={hero}>
      <Text style={heroBrand}>Rebyte</Text>
      <Text style={heroTitle}>{title}</Text>
      <table
        role="presentation"
        cellPadding="0"
        cellSpacing="0"
        style={{ margin: "0 auto" }}
      >
        <tr>
          <td align="center">
            <a href={ctaHref} style={heroCta}>
              {ctaText}&nbsp;&nbsp;&rarr;
            </a>
          </td>
        </tr>
      </table>
    </Section>
  );
}

const hero: React.CSSProperties = {
  background: "linear-gradient(180deg, #93DBFB 0%, #F5A962 100%)",
  borderRadius: "12px",
  padding: "52px 40px",
  textAlign: "center" as const,
};

const heroBrand: React.CSSProperties = {
  fontSize: "13px",
  lineHeight: "18px",
  fontWeight: "600",
  color: "#1a1a1a",
  letterSpacing: "2px",
  margin: "0 auto 16px",
  textTransform: "uppercase" as const,
};

const heroTitle: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0 0 28px",
  letterSpacing: "-0.5px",
  lineHeight: "38px",
};

const heroCta: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#ffffff",
  color: "#1a1a1a",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  borderRadius: "999px",
  padding: "12px 28px",
};
