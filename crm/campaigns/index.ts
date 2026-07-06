import Welcome from "./welcome/template";
import Reengagement from "./reengagement/template";
import Onboarding from "./onboarding/template";
import ProductUpdate202603 from "./product-update-2026-03/template";
import ProductUpdate20260308 from "./product-update-2026-03-08/template";
import ProductUpdate20260318 from "./product-update-2026-03-18/template";
import ProductUpdate20260324 from "./product-update-2026-03-24/template";
import ProductUpdate20260329 from "./product-update-2026-03-29/template";
import ProductUpdate20260407 from "./product-update-2026-04-07/template";
import ProductUpdate20260417 from "./product-update-2026-04-17/template";
import ProductUpdate20260421 from "./product-update-2026-04-21/template";
import ProductUpdate20260504 from "./product-update-2026-05-04/template";
import ProductUpdate20260616 from "./product-update-2026-06-16/template";
import AgentManagementApi from "./agent-management-api/template";
import RecentSignupFeedback from "./recent-signup-feedback/template";

interface EmailCampaign {
  channel: "email";
  component: React.FC<any>;
  sampleProps: Record<string, string>;
  description: string;
  subject: string;
}

interface SmsCampaign {
  channel: "sms";
  message: string;
  description: string;
}

type Campaign = EmailCampaign | SmsCampaign;

export const campaigns: Record<string, Campaign> = {
  welcome: {
    channel: "email",
    component: Welcome,
    sampleProps: { name: "Jane", email: "jane@example.com" },
    description: "Welcome email for new workspace members",
    subject: "Welcome to Rebyte",
  },
  onboarding: {
    channel: "email",
    component: Onboarding,
    sampleProps: { name: "Jane", email: "jane@example.com" },
    description: "Pro tips for new users after registration",
    subject: "3 Pro Tips for your new Rebyte Workspace",
  },
  reengagement: {
    channel: "email",
    component: Reengagement,
    sampleProps: { name: "Jane", email: "jane@example.com" },
    description: "Re-engage existing users",
    subject: "Skill-powered code agent running in the cloud",
  },
  "product-update-2026-03": {
    channel: "email",
    component: ProductUpdate202603,
    sampleProps: { name: "Jane", email: "jane@example.com" },
    description: "Weekly product update — 4 agents, 2s boot, Anthropic professional skills",
    subject: "Weekly Update: 4 agents, 2-second boot, professional skills",
  },
  "product-update-2026-03-08": {
    channel: "email",
    component: ProductUpdate20260308,
    sampleProps: { name: "Jane", email: "jane@example.com" },
    description: "Weekly update — Go Mobile + Why Every Agent Needs a Box blog",
    subject: "Weekly Update: Rebyte goes mobile + why every agent needs a box",
  },
  "product-update-2026-03-18": {
    channel: "email",
    component: ProductUpdate20260318,
    sampleProps: { name: "Jane", email: "jane@example.com" },
    description: "Weekly update — Serverless agents, recommendations, scheduled tasks, mobile",
    subject: "Weekly Update: Serverless Claw, Scheduled Tasks and More",
  },
  "product-update-2026-03-24": {
    channel: "email",
    component: ProductUpdate20260324,
    sampleProps: { name: "Jane", email: "jane@example.com" },
    description: "Weekly update — Unlimited agent computers, channel support, stock analysis",
    subject: "Weekly Update: Unlimited Agent Computers, Channel Support, Stock Analysis",
  },
  "product-update-2026-03-29": {
    channel: "email",
    component: ProductUpdate20260329,
    sampleProps: { name: "Jane", email: "jane@example.com" },
    description: "Weekly update — Agent Context for enterprise data, embeddable skills",
    subject: "Weekly Update: Agent Context + Run Skills From Any Website",
  },
  "product-update-2026-04-07": {
    channel: "email",
    component: ProductUpdate20260407,
    sampleProps: { name: "Jane", email: "jane@example.com" },
    description: "Weekly update — Run any skill from anywhere + Microsoft Office chip + Show Me How widgets",
    subject: "Weekly Update: Run Any Skill From a URL + Office + Show Me How",
  },
  "product-update-2026-04-17": {
    channel: "email",
    component: ProductUpdate20260417,
    sampleProps: { name: "Jane", email: "jane@example.com" },
    description: "Weekly update — Slides: 16 designer templates, two rendering modes, visual click-to-edit",
    subject: "Weekly Update: Make Exceptional Slides Effortlessly",
  },
  "product-update-2026-04-21": {
    channel: "email",
    component: ProductUpdate20260421,
    sampleProps: { name: "Jane", email: "jane@example.com" },
    description: "Weekly update — Bring Your Own Subscription or API Key, or use Rebyte credits with transparent per-task usage",
    subject: "Rebyte Now Can Use Your Own Key / Subscription",
  },
  "product-update-2026-05-04": {
    channel: "email",
    component: ProductUpdate20260504,
    sampleProps: { name: "Jane", email: "jane@example.com" },
    description: "Weekly update — Phone as remote control: PWA install + mouth-in/ear-out voice + scheduled skills (the unseen half), tied to the 'A Month on My Phone' essay",
    subject: "Control Your Agents From The Pocket",
  },
  "product-update-2026-06-16": {
    channel: "email",
    component: ProductUpdate20260616,
    sampleProps: { name: "Jane", email: "jane@example.com" },
    description: "Product update — Agents become configurable coworkers: per-workspace system prompt + tools, MCP tool catalog, and ask-before-acting (blocked actions + ask_user_question). Plus Opus 4.8 + DeepSeek V4 Pro.",
    subject: "Your Agents Are Now Configurable Coworkers",
  },
  "agent-management-api": {
    channel: "email",
    component: AgentManagementApi,
    sampleProps: { name: "Jane", email: "jane@example.com" },
    description: "Launch — Agent Management API: one rbk_ key runs a fleet of agents (POST /v1/tasks), steer/monitor via prompts + workspace reuse + status, integrate via signed webhooks + Files API. A model-agnostic drop-in for Claude Code / single-vendor managed-agent APIs (run Claude Code, Codex, Gemini, opencode).",
    subject: "One API for Claude Code, Codex, and Any Agent",
  },
  "recent-signup-feedback": {
    channel: "email",
    component: RecentSignupFeedback,
    sampleProps: { name: "Jane", email: "jane@example.com" },
    description: "New user guide and feedback request for recently registered users",
    subject: "A short guide to getting started with Rebyte",
  },
  "sms-welcome": {
    channel: "sms",
    message:
      "Hi {name}, welcome to Rebyte! Reply HELP for help or STOP to unsubscribe.",
    description: "Welcome SMS for new phone users",
  },
};
