import { Section, Text, Hr } from "@react-email/components";
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
        
        <Hr style={hr} />
        
        <Text style={subheading}>Get started in 3 steps:</Text>
        
        <Text style={step}>
          <strong>1. Create your first task.</strong> Just describe what you want to build or research.
        </Text>
        <Text style={step}>
          <strong>2. Connect your tools.</strong> Add GitHub, Slack, or Google Drive to give your agents context.
        </Text>
        <Text style={step}>
          <strong>3. Invite your team.</strong> Rebyte is better when you collaborate.
        </Text>

        <Button href="https://rebyte.ai/dashboard">Go to Dashboard</Button>
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

const subheading: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "24px 0 16px",
};

const paragraph: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#484848",
  margin: "16px 0",
};

const step: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#484848",
  margin: "12px 0",
};

const hr: React.CSSProperties = {
  borderColor: "#e6ebf1",
  margin: "24px 0",
};
