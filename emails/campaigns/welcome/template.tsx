import { Section, Text } from "@react-email/components";
import * as React from "react";
import { Wrapper } from "../../components/wrapper";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";

interface WelcomeProps {
  name?: string;
  email?: string;
}

export default function Welcome({ name }: WelcomeProps) {
  const displayName = name || "there";

  return (
    <Wrapper preview="Welcome to Rebyte">
      <Header />
      <Section style={section}>
        <Text style={heading}>Welcome to Rebyte</Text>
        <Text style={paragraph}>Hi {displayName},</Text>
        <Text style={paragraph}>
          Thanks for joining Rebyte — the shared agent workspace where your team and AI agents collaborate in one place.
        </Text>
        <Button href="https://rebyte.ai">Get Started</Button>
      </Section>
      <Footer />
    </Wrapper>
  );
}

const section: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  padding: "40px",
};

const heading: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1a1a1a",
  marginBottom: "24px",
};

const paragraph: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#484848",
};
