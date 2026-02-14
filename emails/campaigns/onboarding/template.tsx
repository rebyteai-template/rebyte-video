import { Section, Text, Hr, Row, Column, Img } from "@react-email/components";
import * as React from "react";
import { Wrapper } from "../../components/wrapper";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";

interface OnboardingProps {
  name?: string;
  email?: string;
}

export default function Onboarding({ name }: OnboardingProps) {
  const displayName = name || "there";

  return (
    <Wrapper preview="Pro tips to master Rebyte">
      <Header />
      <Section style={section}>
        <Text style={heading}>Master the Rebyte Workspace</Text>
        <Text style={paragraph}>Hi {displayName},</Text>
        <Text style={paragraph}>
          Now that you've created your first task, we wanted to share a few pro tips to help you get the most out of your code agents.
        </Text>

        <Hr style={hr} />

        <Section style={tipSection}>
          <Text style={tipTitle}>💡 Tip #1: Use Skills for Consistency</Text>
          <Text style={tipDescription}>
            Don't repeat yourself. Create "Skills" for recurring tasks like code reviews, documentation updates, or data cleaning. Your agents will follow your exact best practices every time.
          </Text>
        </Section>

        <Section style={tipSection}>
          <Text style={tipTitle}>🔗 Tip #2: Connect Your Tech Stack</Text>
          <Text style={tipDescription}>
            Agents work best with context. Connect GitHub to let them submit PRs, or Google Drive so they can research your internal docs.
          </Text>
        </Section>

        <Section style={tipSection}>
          <Text style={tipTitle}>👥 Tip #3: Collaborative Debugging</Text>
          <Text style={tipDescription}>
            Shared agents mean shared context. Invite your teammates to a workspace so they can see agent logs, chat with the same instance, and ship faster together.
          </Text>
        </Section>

        <Button href="https://rebyte.ai/skills">Explore Skills</Button>
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
  margin: "16px 0",
};

const tipSection: React.CSSProperties = {
  marginBottom: "24px",
};

const tipTitle: React.CSSProperties = {
  fontSize: "17px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0 0 8px",
};

const tipDescription: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#666",
  margin: "0",
};

const hr: React.CSSProperties = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};
