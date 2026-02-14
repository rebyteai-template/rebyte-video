import Welcome from "./welcome/template";
import Reengagement from "./reengagement/template";

export const campaigns: Record<
  string,
  {
    component: React.FC<any>;
    sampleProps: Record<string, string>;
    description: string;
    subject: string;
  }
> = {
  welcome: {
    component: Welcome,
    sampleProps: { name: "Jane", email: "jane@example.com" },
    description: "Welcome email for new workspace members",
    subject: "Welcome to Rebyte",
  },
  reengagement: {
    component: Reengagement,
    sampleProps: { name: "Jane", email: "jane@example.com" },
    description: "Re-engage existing users",
    subject: "Rebyte has changed — come see what's new",
  },
};
