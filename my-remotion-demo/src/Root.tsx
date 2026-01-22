import { Composition } from "remotion";
import { RebyteIntro } from "./RebyteIntro";

export const RemotionRoot = () => {
  return (
    <Composition
      id="RebyteIntro"
      component={RebyteIntro}
      durationInFrames={3294}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
