import {
  Html,
  Head,
  Body,
  Container,
  Preview,
} from "@react-email/components";
import * as React from "react";

interface WrapperProps {
  preview: string;
  children: React.ReactNode;
}

export function Wrapper({ preview, children }: WrapperProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>{children}</Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container: React.CSSProperties = {
  margin: "0 auto",
  padding: "40px 0",
  maxWidth: "560px",
};
