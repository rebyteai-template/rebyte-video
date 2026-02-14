import { render } from "@react-email/render";
import * as fs from "fs";
import * as path from "path";
import { createElement } from "react";
import Onboarding from "./campaigns/onboarding/template";

async function main() {
  const html = await render(
    createElement(Onboarding, { name: "Jane", email: "jane@example.com" })
  );
  fs.writeFileSync(path.join(__dirname, "preview.html"), html);
  console.log("Preview generated at preview.html");
}

main().catch(console.error);
