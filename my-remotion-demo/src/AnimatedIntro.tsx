import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type AnimatedIntroProps = {
  title: string;
  subtitle: string;
};

export const AnimatedIntro = ({ title, subtitle }: AnimatedIntroProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation with spring
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const titleY = interpolate(titleScale, [0, 1], [50, 0]);

  // Subtitle fades in after title
  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [30, 60], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background gradient animation
  const gradientProgress = interpolate(frame, [0, 150], [0, 360]);

  // Decorative circles
  const circle1Scale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 8 },
  });

  const circle2Scale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 8 },
  });

  const circle3Scale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 8 },
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientProgress}deg, #667eea 0%, #764ba2 50%, #f093fb 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 100,
          width: 200,
          height: 200,
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          transform: `scale(${circle1Scale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: 150,
          width: 150,
          height: 150,
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          transform: `scale(${circle2Scale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 200,
          right: 100,
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          transform: `scale(${circle3Scale})`,
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <h1
          style={{
            fontFamily: "sans-serif",
            fontSize: 80,
            fontWeight: 700,
            color: "white",
            margin: 0,
            textShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
            transform: `scale(${titleScale}) translateY(${titleY}px)`,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: 32,
            color: "rgba(255, 255, 255, 0.9)",
            margin: 0,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Bottom bar animation */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div
          style={{
            width: interpolate(frame, [60, 100], [0, 300], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            height: 4,
            backgroundColor: "white",
            borderRadius: 2,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
