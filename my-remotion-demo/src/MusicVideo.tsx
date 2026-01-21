import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { Audio } from "@remotion/media";

// Using a royalty-free audio sample URL
const AUDIO_URL = "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3";

// Beat timing in frames (assuming 30fps, beat every ~0.5 seconds = 15 frames)
const BEAT_INTERVAL = 15;

export const MusicVideo = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Create pulsing effect synced to beats
  const beatPhase = (frame % BEAT_INTERVAL) / BEAT_INTERVAL;
  const pulse = Math.pow(1 - beatPhase, 3); // Sharp attack, smooth decay

  // Background color shift
  const hue = interpolate(frame, [0, durationInFrames], [200, 320]);

  // Central circle pulse
  const baseSize = 200;
  const pulseSize = baseSize + pulse * 80;

  // Ring animations
  const rings = [0, 1, 2, 3, 4];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: `hsl(${hue}, 30%, 10%)`,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Audio with fade in */}
      <Audio
        src={AUDIO_URL}
        volume={(f) =>
          interpolate(f, [0, fps], [0, 0.8], { extrapolateRight: "clamp" })
        }
      />

      {/* Expanding rings */}
      {rings.map((i) => {
        const ringFrame = (frame + i * (BEAT_INTERVAL / rings.length)) % (BEAT_INTERVAL * 3);
        const ringProgress = ringFrame / (BEAT_INTERVAL * 3);
        const ringSize = interpolate(ringProgress, [0, 1], [100, 600]);
        const ringOpacity = interpolate(ringProgress, [0, 0.2, 1], [0, 0.6, 0]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: ringSize,
              height: ringSize,
              borderRadius: "50%",
              border: `3px solid hsla(${hue + 60}, 80%, 60%, ${ringOpacity})`,
              boxShadow: `0 0 20px hsla(${hue + 60}, 80%, 60%, ${ringOpacity * 0.5})`,
            }}
          />
        );
      })}

      {/* Central pulsing circle */}
      <div
        style={{
          width: pulseSize,
          height: pulseSize,
          borderRadius: "50%",
          background: `radial-gradient(circle,
            hsla(${hue + 40}, 80%, 60%, 0.9) 0%,
            hsla(${hue}, 70%, 40%, 0.8) 50%,
            hsla(${hue - 20}, 60%, 20%, 0.6) 100%)`,
          boxShadow: `
            0 0 ${40 + pulse * 40}px hsla(${hue + 40}, 80%, 50%, ${0.5 + pulse * 0.3}),
            0 0 ${80 + pulse * 60}px hsla(${hue}, 70%, 40%, ${0.3 + pulse * 0.2})
          `,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Inner glow */}
        <div
          style={{
            width: pulseSize * 0.6,
            height: pulseSize * 0.6,
            borderRadius: "50%",
            backgroundColor: `hsla(${hue + 60}, 90%, 70%, ${0.2 + pulse * 0.3})`,
            filter: "blur(10px)",
          }}
        />
      </div>

      {/* Floating particles */}
      <Particles frame={frame} fps={fps} hue={hue} pulse={pulse} />

      {/* Text overlay */}
      <Sequence from={30}>
        <TextOverlay frame={frame - 30} fps={fps} />
      </Sequence>

      {/* Waveform bars */}
      <WaveformBars frame={frame} pulse={pulse} hue={hue} />
    </AbsoluteFill>
  );
};

const Particles = ({
  frame,
  fps,
  hue,
  pulse,
}: {
  frame: number;
  fps: number;
  hue: number;
  pulse: number;
}) => {
  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <>
      {particles.map((i) => {
        const angle = (i / 20) * Math.PI * 2 + frame * 0.02;
        const baseRadius = 250 + (i % 3) * 50;
        const radius = baseRadius + pulse * 30;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const size = 4 + (i % 4) * 2 + pulse * 3;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: `hsla(${hue + i * 10}, 80%, 70%, ${0.5 + pulse * 0.3})`,
              boxShadow: `0 0 ${size * 2}px hsla(${hue + i * 10}, 80%, 60%, 0.5)`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </>
  );
};

const TextOverlay = ({ frame, fps }: { frame: number; fps: number }) => {
  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const scale = interpolate(entrance, [0, 1], [0.5, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 100,
        fontFamily: "sans-serif",
        fontSize: 48,
        fontWeight: 700,
        color: "white",
        textShadow: "0 0 30px rgba(255, 255, 255, 0.5)",
        transform: `scale(${scale})`,
        opacity,
        letterSpacing: 8,
      }}
    >
      REMOTION
    </div>
  );
};

const WaveformBars = ({
  frame,
  pulse,
  hue,
}: {
  frame: number;
  pulse: number;
  hue: number;
}) => {
  const bars = Array.from({ length: 32 }, (_, i) => i);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        display: "flex",
        gap: 4,
        alignItems: "flex-end",
      }}
    >
      {bars.map((i) => {
        // Create pseudo-random but deterministic bar heights
        const phase = (i * 0.3 + frame * 0.1) % (Math.PI * 2);
        const baseHeight = 20 + Math.sin(phase) * 15;
        const height = baseHeight + pulse * 25 * Math.abs(Math.sin(i * 0.5));

        return (
          <div
            key={i}
            style={{
              width: 6,
              height,
              backgroundColor: `hsla(${hue + i * 5}, 70%, 60%, 0.8)`,
              borderRadius: 3,
              transition: "height 0.05s ease-out",
            }}
          />
        );
      })}
    </div>
  );
};
