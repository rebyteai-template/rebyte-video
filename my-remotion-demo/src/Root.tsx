import { Composition, Folder } from "remotion";
import { AnimatedIntro } from "./AnimatedIntro";
import { TypewriterDemo } from "./TypewriterDemo";
import { SpringDemo } from "./SpringDemo";
import { MusicVideo } from "./MusicVideo";
import { ProductDemo } from "./ProductDemo";
import { RebyteDemo } from "./RebyteDemo";
import { RebyteIntro } from "./RebyteIntro";

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="Rebyte">
        <Composition
          id="RebyteIntro"
          component={RebyteIntro}
          durationInFrames={60 * 30}
          fps={30}
          width={1280}
          height={720}
        />
        <Composition
          id="RebyteDemo"
          component={RebyteDemo}
          durationInFrames={18 * 30}
          fps={30}
          width={1280}
          height={720}
        />
      </Folder>
      <Folder name="Demos">
        <Composition
          id="AnimatedIntro"
          component={AnimatedIntro}
          durationInFrames={150}
          fps={30}
          width={1280}
          height={720}
          defaultProps={{
            title: "Welcome to Remotion",
            subtitle: "Create videos programmatically",
          }}
        />
        <Composition
          id="TypewriterDemo"
          component={TypewriterDemo}
          durationInFrames={180}
          fps={30}
          width={1280}
          height={720}
        />
        <Composition
          id="SpringDemo"
          component={SpringDemo}
          durationInFrames={120}
          fps={30}
          width={1280}
          height={720}
        />
      </Folder>
      <Folder name="Audio">
        <Composition
          id="MusicVideo"
          component={MusicVideo}
          durationInFrames={300}
          fps={30}
          width={1280}
          height={720}
        />
      </Folder>
      <Folder name="ProductDemo">
        <Composition
          id="ProductDemo"
          component={ProductDemo}
          durationInFrames={21 * 30}
          fps={30}
          width={1280}
          height={720}
        />
      </Folder>
    </>
  );
};
