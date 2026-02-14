import { Section, Text, Hr, Img, Row, Column } from "@react-email/components";
import * as React from "react";
import { Wrapper } from "../../components/wrapper";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";

interface ReengagementProps {
  name?: string;
  email?: string;
}

export default function Reengagement({ name }: ReengagementProps) {
  const displayName = name || "there";

  return (
    <Wrapper preview="Rebyte — Vibe working with skilled code agents">
      {/* Hero banner */}
      <Section style={hero}>
        <Text style={heroBrand}>Rebyte</Text>
        <Text style={heroTitle}>Vibe working with skilled code agents</Text>
        <Text style={heroSubtitle}>Parallel, async code agents in the cloud.</Text>
        <table role="presentation" cellPadding="0" cellSpacing="0" style={{ margin: "0 auto" }}>
          <tr>
            <td align="center">
              <a href="https://rebyte.ai" style={heroCta}>
                Try it now&nbsp;&nbsp;&rarr;
              </a>
            </td>
          </tr>
        </table>
      </Section>

      {/* Body */}
      <Section style={section}>
        <Text style={paragraph}>Hey {displayName},</Text>
        <Text style={paragraph}>
          Rebyte has changed a lot since you last visited. We rebuilt it from the ground up as a cloud workspace for AI coding agents.
        </Text>
        
        <Img
          src="https://rebyte.ai/assets/rebyte-task-full.png"
          width="480"
          alt="Rebyte Task Interface"
          style={productImage}
        />

        <Text style={paragraph}>
          Here&apos;s the idea: every task is a software task. You describe what you need, and a code agent builds it — a full-stack app, a data pipeline, a research report, whatever.
        </Text>

        <Hr style={hr} />

        <Text style={subheading}>What&apos;s new</Text>

        <Section style={featureSection}>
          <Row>
            <Column style={featureIconColumn}>
              <div style={featureIcon}>☁️</div>
            </Column>
            <Column>
              <Text style={featureTitle}>Cloud sandboxes that persist</Text>
              <Text style={featureDescription}>
                Each agent gets its own isolated VM that lives forever. Close your laptop, come back tomorrow — everything is exactly where you left it.
              </Text>
            </Column>
          </Row>
        </Section>

        <Section style={featureSection}>
          <Row>
            <Column style={featureIconColumn}>
              <div style={featureIcon}>⚡</div>
            </Column>
            <Column>
              <Text style={featureTitle}>Run agents in parallel</Text>
              <Text style={featureDescription}>
                Kick off 5 tasks at once across Claude Code, Gemini CLI, Codex, or Amp. They all run independently in separate VMs.
              </Text>
            </Column>
          </Row>
        </Section>

        <Section style={featureSection}>
          <Row>
            <Column style={featureIconColumn}>
              <div style={featureIcon}>🚀</div>
            </Column>
            <Column>
              <Text style={featureTitle}>From prompt to live URL</Text>
              <Text style={featureDescription}>
                Agents don&apos;t just write code — they deploy it. You get a working app with a URL, not a pull request to review.
              </Text>
            </Column>
          </Row>
        </Section>

        <Button href="https://rebyte.ai">Open Rebyte</Button>
      </Section>

      <Footer />
    </Wrapper>
  );
}

const hero: React.CSSProperties = {
  background: "linear-gradient(180deg, #93DBFB 0%, #F5A962 100%)",
  borderRadius: "12px",
  padding: "48px 40px",
  textAlign: "center" as const,
};

const heroBrand: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0 0 12px",
  letterSpacing: "0.5px",
  textTransform: "uppercase" as const,
};

const heroTitle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0 0 8px",
  letterSpacing: "-0.5px",
  lineHeight: "34px",
};

const heroSubtitle: React.CSSProperties = {
  fontSize: "16px",
  color: "#444",
  margin: "0 0 24px",
};

const heroCta: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#ffffff",
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "500",
  textDecoration: "none",
  borderRadius: "999px",
  padding: "12px 28px",
  border: "1px solid #e0e0e0",
};

const section: React.CSSProperties = {
  padding: "32px 40px",
};

const subheading: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0 0 24px",
};

const paragraph: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#484848",
  margin: "16px 0",
};

const productImage: React.CSSProperties = {
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
  margin: "24px 0",
};

const featureSection: React.CSSProperties = {
  marginBottom: "24px",
};

const featureIconColumn: React.CSSProperties = {
  width: "48px",
  verticalAlign: "top",
};

const featureIcon: React.CSSProperties = {
  fontSize: "24px",
  marginTop: "4px",
};

const featureTitle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0 0 4px",
};

const featureDescription: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#666",
  margin: "0",
};

const hr: React.CSSProperties = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};
