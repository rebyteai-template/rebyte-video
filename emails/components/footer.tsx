import { Hr, Text } from "@react-email/components";
import * as React from "react";

export function Footer() {
  return (
    <>
      <Hr style={hr} />
      <Text style={footer}>Rebyte AI</Text>
    </>
  );
}

const hr: React.CSSProperties = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const footer: React.CSSProperties = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
};
