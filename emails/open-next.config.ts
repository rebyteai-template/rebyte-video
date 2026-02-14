import type { OpenNextConfig } from "@opennextjs/aws/types/open-next";

const config: OpenNextConfig = {
  buildCommand: "npx next build",
  default: {
    override: {
      wrapper: "aws-lambda",
      converter: "aws-apigw-v2",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
};

export default config;
