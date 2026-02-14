import Welcome from "./welcome/template";
import Reengagement from "./reengagement/template";
import Onboarding from "./onboarding/template";

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
    subject: "Rebyte has changed — come see what's new",
  },
  "sms-welcome": {
    channel: "sms",
    message:
      "Hi {name}, welcome to Rebyte! Reply HELP for help or STOP to unsubscribe.",
    description: "Welcome SMS for new phone users",
  },
};
