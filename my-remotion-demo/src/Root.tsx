import { Composition } from "remotion";
import { RebyteIntro } from "./RebyteIntro";
import { Thumbnail } from "./Thumbnail";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="RebyteIntro"
        component={RebyteIntro}
        durationInFrames={3435}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Thumbnail"
        component={Thumbnail}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
