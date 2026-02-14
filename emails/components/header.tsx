import { Section, Text } from "@react-email/components";
import * as React from "react";

export function Header() {
  return (
    <Section style={header}>
      <Text style={logo}>Rebyte</Text>
    </Section>
  );
}

const header: React.CSSProperties = {
  padding: "24px 40px 0",
};

const logo: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0",
};
