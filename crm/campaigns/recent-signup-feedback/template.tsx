import {
  Column,
  Link,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { Wrapper } from "../../components/wrapper";

interface RecentSignupFeedbackProps {
  name?: string;
  email?: string;
}

function firstNameOf(name?: string) {
  const trimmed = name?.trim();
  if (!trimmed) return "there";
  return trimmed.split(/\s+/)[0] || "there";
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <Row style={bulletRow}>
      <Column style={bulletMarkerCell}>
        <Text style={bulletMarker}>&bull;</Text>
      </Column>
      <Column>
        <Text style={bulletText}>{children}</Text>
      </Column>
    </Row>
  );
}

export default function RecentSignupFeedback({
  name,
}: RecentSignupFeedbackProps) {
  const displayName = firstNameOf(name);

  return (
    <Wrapper preview="A short guide to getting started with Rebyte">
      <Section style={brandHeader}>
        <Text style={brandName}>Rebyte</Text>
      </Section>

      <Section style={card}>
        <Text style={paragraph}>Hi {displayName},</Text>

        <Text style={paragraph}>
          Thanks for trying Rebyte. A Rebyte Agent is more than a chat
          window: you can configure it, give it tools, assign work, and call it
          from your own product.
        </Text>

        <Text style={heading}>New user guide</Text>

        <Section style={bullets}>
          <BulletItem>
            <Link href="https://app.rebyte.ai" style={link}>
              Configure your Rebyte Agent
            </Link>{" "}
            with a system prompt, MCP tools, and permission settings. Keep it
            private while you experiment, or share it with human teammates when
            it is ready.
          </BulletItem>
          <BulletItem>
            <Link href="https://app.rebyte.ai/new" style={link}>
              Assign any task
            </Link>{" "}
            to your agent, from researching something on the internet
            to working with your files or connected apps.
          </BulletItem>
          <BulletItem>
            <Link href="https://app.rebyte.ai/skills" style={link}>
              Give it skills to run
            </Link>{" "}
            so repeatable workflows become real execution, not another
            one-off chat.
          </BulletItem>
          <BulletItem>
            <Link href="https://rebyte.ai/docs" style={link}>
              Access your agent through the API
            </Link>{" "}
            when you do not want a chat interface, or when your own product
            needs to trigger and manage agent work directly.
          </BulletItem>
        </Section>

        <Text style={heading}>Help us make Rebyte better</Text>

        <Section style={bullets}>
          <BulletItem>
            Reply with the first task you tried, whether it worked, and what
            got in the way
          </BulletItem>
          <BulletItem>
            Tell us if there is a skill, integration, or API feature you
            expected but could not find
          </BulletItem>
          <BulletItem>
            Join{" "}
            <Link href="https://discord.gg/gUuzjeu69C" style={link}>
              Discord
            </Link>{" "}
            or{" "}
            <Link href="https://x.com/rebyteai" style={link}>
              X
            </Link>{" "}
            to follow updates, share use cases, and tell us what should exist
            next
          </BulletItem>
          <BulletItem>
            Read the{" "}
            <Link href="https://rebyte.ai/blog" style={link}>
              Rebyte Blog
            </Link>{" "}
            for occasional notes on why we build Rebyte Agents, how we build
            them, and the building blocks we think agents should be built from
          </BulletItem>
          <BulletItem>
            If you run into a bug or have a question, reply here - we read
            these emails directly
          </BulletItem>
        </Section>

        <Text style={signature}>
          Happy building,
          <br />
          The Rebyte Team
        </Text>
      </Section>

      <Section style={footer}>
        <Text style={footerLinks}>
          <Link href="https://rebyte.ai/privacy" style={footerLink}>
            Privacy Policy
          </Link>
          <Link href="https://rebyte.ai/terms" style={footerLinkMiddle}>
            Terms of Use
          </Link>
          <Link href="https://rebyte.ai/unsubscribe" style={footerLink}>
            Unsubscribe
          </Link>
        </Text>
        <Text style={footerText}>
          &copy; 2026 Rebyte. All rights reserved.
        </Text>
      </Section>
    </Wrapper>
  );
}

const brandHeader: React.CSSProperties = {
  padding: "20px 0 36px",
  textAlign: "center" as const,
};

const brandName: React.CSSProperties = {
  color: "#17191c",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "36px",
  margin: "0",
};

const card: React.CSSProperties = {
  backgroundColor: "#fffefc",
  border: "1px solid #dedbd5",
  borderRadius: "14px",
  padding: "54px 58px",
};

const paragraph: React.CSSProperties = {
  fontSize: "17px",
  lineHeight: "29px",
  color: "#52565d",
  margin: "0 0 24px",
};

const heading: React.CSSProperties = {
  color: "#17191c",
  fontSize: "21px",
  fontWeight: "700",
  lineHeight: "29px",
  margin: "38px 0 18px",
};

const bullets: React.CSSProperties = {
  margin: "0 0 30px",
};

const bulletRow: React.CSSProperties = {
  margin: "0 0 12px",
};

const bulletMarkerCell: React.CSSProperties = {
  width: "28px",
  verticalAlign: "top",
};

const bulletMarker: React.CSSProperties = {
  color: "#545961",
  fontSize: "18px",
  lineHeight: "29px",
  margin: "0",
};

const bulletText: React.CSSProperties = {
  color: "#52565d",
  fontSize: "17px",
  lineHeight: "29px",
  margin: "0",
};

const link: React.CSSProperties = {
  color: "#1194ff",
  textDecoration: "underline",
};

const signature: React.CSSProperties = {
  color: "#52565d",
  fontSize: "17px",
  lineHeight: "29px",
  margin: "34px 0 0",
};

const footer: React.CSSProperties = {
  padding: "36px 20px 0",
};

const footerLinks: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 18px",
  textAlign: "center" as const,
};

const footerText: React.CSSProperties = {
  color: "#8a8f98",
  fontSize: "13px",
  lineHeight: "20px",
  textAlign: "center" as const,
  margin: "0",
};

const footerLink: React.CSSProperties = {
  color: "#7a808a",
  textDecoration: "none",
};

const footerLinkMiddle: React.CSSProperties = {
  ...footerLink,
  margin: "0 28px",
};
