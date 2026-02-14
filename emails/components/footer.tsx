import { Hr, Text, Link, Section } from "@react-email/components";
import * as React from "react";

export function Footer() {
  return (
    <Section style={footerSection}>
      <Hr style={hr} />
      <Text style={footerText}>
        Rebyte AI • 123 AI Way, San Francisco, CA 94107
      </Text>
      <Text style={footerText}>
        You're receiving this because you signed up for Rebyte.
        <br />
        <Link href="https://rebyte.ai/unsubscribe" style={link}>
          Unsubscribe
        </Link>
      </Text>
    </Section>
  );
}

const footerSection: React.CSSProperties = {
  padding: "0 40px 40px",
};

const hr: React.CSSProperties = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const footerText: React.CSSProperties = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "18px",
  textAlign: "center" as const,
  margin: "4px 0",
};

const link: React.CSSProperties = {
  color: "#8898aa",
  textDecoration: "underline",
};
