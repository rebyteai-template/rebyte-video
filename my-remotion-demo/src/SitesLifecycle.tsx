import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const KAMI = {
  parchment: "#f5f4ed",
  ivory: "#faf9f5",
  sand: "#e8e6dc",
  pressed: "#dfddd2",
  ink: "#141413",
  charcoal: "#4d4c48",
  olive: "#5e5d59",
  stone: "#87867f",
  border: "#e8e5da",
  border2: "#dedbd0",
  brand: "#1B365D",
  brandDeep: "#11233F",
  brandPale: "#E8EEF6",
  brandBorder: "#cfdce9",
  success: "#466b52",
  rose: "#b9837d",
  serif:
    "Newsreader, TsangerJinKai02, Source Serif 4, Charter, Georgia, Times New Roman, serif",
  sans: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif",
  mono: "JetBrains Mono, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
};

export const SITES_LIFECYCLE_TOTAL_FRAMES = 300;

const clamp = (value: number) => Math.max(0, Math.min(1, value));

const progress = (frame: number, start: number, end: number) =>
  clamp(
    interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  );

const fadeInOut = (frame: number, start: number, end: number) => {
  const fadeIn = progress(frame, start, start + 20);
  const fadeOut = interpolate(frame, [end - 18, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.min(fadeIn, fadeOut);
};

const enter = (frame: number, fps: number, delay = 0, duration = 30) =>
  clamp(
    spring({
      frame: frame - delay,
      fps,
      durationInFrames: duration,
      config: { damping: 210 },
    })
  );

const lift = (value: number, from = 20) =>
  `translateY(${interpolate(value, [0, 1], [from, 0])}px)`;

const fontFaceDefinitions = `
  @font-face {
    font-family: 'TsangerJinKai02';
    src: url('${staticFile("fonts/TsangerJinKai02-Latin.woff2")}') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Newsreader';
    src: url('${staticFile("fonts/Newsreader.woff2")}') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Inter';
    src: url('${staticFile("fonts/Inter-400.woff2")}') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Inter';
    src: url('${staticFile("fonts/Inter-500.woff2")}') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Inter';
    src: url('${staticFile("fonts/Inter-600.woff2")}') format('woff2');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'JetBrains Mono';
    src: url('${staticFile("fonts/JetBrainsMono.woff2")}') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
`;

const useKamiFonts = () => {
  const [handle] = useState(() => delayRender("Loading Sites lifecycle fonts"));

  useEffect(() => {
    const fonts = [
      new FontFace(
        "TsangerJinKai02",
        `url('${staticFile("fonts/TsangerJinKai02-Latin.woff2")}')`,
        { weight: "500", style: "normal" }
      ),
      new FontFace("Newsreader", `url('${staticFile("fonts/Newsreader.woff2")}')`, {
        weight: "500",
        style: "normal",
      }),
      new FontFace("Inter", `url('${staticFile("fonts/Inter-400.woff2")}')`, {
        weight: "400",
        style: "normal",
      }),
      new FontFace("Inter", `url('${staticFile("fonts/Inter-500.woff2")}')`, {
        weight: "500",
        style: "normal",
      }),
      new FontFace("Inter", `url('${staticFile("fonts/Inter-600.woff2")}')`, {
        weight: "600",
        style: "normal",
      }),
      new FontFace(
        "JetBrains Mono",
        `url('${staticFile("fonts/JetBrainsMono.woff2")}')`,
        { weight: "400", style: "normal" }
      ),
    ];

    Promise.all(fonts.map((font) => font.load()))
      .then((loadedFonts) => {
        loadedFonts.forEach((font) => document.fonts.add(font));
        return document.fonts.ready;
      })
      .then(() => continueRender(handle))
      .catch((error) => cancelRender(error));
  }, [handle]);
};

const FontFaces = () => <style>{fontFaceDefinitions}</style>;

const PaperTexture = () => (
  <>
    <div
      style={{
        position: "absolute",
        inset: "52px 70px",
        borderTop: `1px solid ${KAMI.border}`,
        borderBottom: `1px solid ${KAMI.border}`,
      }}
    />
    {Array.from({ length: 7 }).map((_, index) => (
      <div
        key={index}
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 174 + index * 118,
          borderTop: `1px solid rgba(224, 221, 210, ${0.23 - index * 0.015})`,
        }}
      />
    ))}
    <div
      style={{
        position: "absolute",
        width: 760,
        height: 760,
        right: -240,
        top: -130,
        borderRadius: "50%",
        border: `1px solid rgba(222, 219, 208, 0.9)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        width: 560,
        height: 560,
        left: -280,
        bottom: -250,
        borderRadius: "50%",
        border: `1px solid rgba(222, 219, 208, 0.72)`,
      }}
    />
  </>
);

const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        overflow: "hidden",
        border: `1px solid ${KAMI.border2}`,
        background: KAMI.ivory,
      }}
    >
      <Img
        src={staticFile("rebyte-mark.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
    <div
      style={{
        fontFamily: KAMI.serif,
        fontSize: 31,
        fontWeight: 500,
        color: KAMI.ink,
      }}
    >
      rebyte.ai
    </div>
  </div>
);

const Header = () => (
  <div
    style={{
      position: "absolute",
      top: 50,
      left: 70,
      right: 70,
      height: 66,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      zIndex: 20,
    }}
  >
    <Logo />
    <div
      style={{
        color: KAMI.olive,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      Sites lifecycle
    </div>
  </div>
);

const BrowserChrome = ({
  children,
  label,
  style,
}: {
  children: ReactNode;
  label: string;
  style?: CSSProperties;
}) => (
  <div
    style={{
      background: KAMI.ivory,
      border: `1px solid ${KAMI.border2}`,
      borderRadius: 14,
      boxShadow: "0 22px 70px rgba(20, 20, 19, 0.12)",
      overflow: "hidden",
      ...style,
    }}
  >
    <div
      style={{
        height: 46,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 16px",
        borderBottom: `1px solid ${KAMI.border}`,
        background: KAMI.ivory,
      }}
    >
      <span style={dotStyle} />
      <span style={dotStyle} />
      <span style={dotStyle} />
      <div
        style={{
          marginLeft: 8,
          height: 26,
          flex: 1,
          border: `1px solid ${KAMI.border}`,
          background: KAMI.parchment,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          color: KAMI.olive,
          fontSize: 12,
          fontFamily: KAMI.mono,
        }}
      >
        {label}
      </div>
    </div>
    {children}
  </div>
);

const dotStyle: CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: KAMI.pressed,
  border: `1px solid ${KAMI.border2}`,
};

const Tag = ({
  children,
  active,
  tone = "neutral",
}: {
  children: ReactNode;
  active?: boolean;
  tone?: "neutral" | "brand" | "success";
}) => {
  const colors = {
    neutral: { bg: KAMI.ivory, border: KAMI.border2, color: KAMI.olive },
    brand: { bg: KAMI.brandPale, border: KAMI.brandBorder, color: KAMI.brand },
    success: { bg: "#E8F0E9", border: "#C8D9CD", color: KAMI.success },
  }[tone];
  return (
    <div
      style={{
        height: 30,
        padding: "0 11px",
        borderRadius: 6,
        border: `1px solid ${colors.border}`,
        background: active ? colors.bg : KAMI.ivory,
        color: colors.color,
        display: "inline-flex",
        alignItems: "center",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

const PromptCard = ({ frame }: { frame: number }) => {
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, 16);
  const typed = Math.floor(progress(frame, 26, 72) * 73);
  const prompt = "Generate an AI industry report as a shareable page.";

  return (
    <div
      style={{
        opacity: p,
        transform: lift(p, 18),
        position: "absolute",
        left: 118,
        top: 424,
        width: 500,
        background: KAMI.ivory,
        border: `1px solid ${KAMI.border2}`,
        borderRadius: 12,
        padding: 22,
        boxShadow: "0 10px 40px rgba(20, 20, 19, 0.08)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <Tag tone="brand" active>
          Ask
        </Tag>
        <Tag>Employee</Tag>
      </div>
      <div
        style={{
          minHeight: 96,
          color: KAMI.ink,
          fontSize: 25,
          lineHeight: 1.25,
          fontFamily: KAMI.serif,
        }}
      >
        {prompt.slice(0, typed)}
        <span style={{ color: KAMI.brand }}>|</span>
      </div>
    </div>
  );
};

const EmployeeCard = ({ frame }: { frame: number }) => {
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, 54);
  const scan = interpolate(frame, [72, 124], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const steps = ["Research", "Structure", "Design", "Publish"];

  return (
    <div
      style={{
        opacity: p,
        transform: lift(p, 16),
        position: "absolute",
        left: 118,
        top: 634,
        width: 500,
        background: KAMI.ivory,
        border: `1px solid ${KAMI.border2}`,
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 10px 40px rgba(20, 20, 19, 0.07)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 9,
            background: KAMI.brand,
            color: KAMI.ivory,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontFamily: KAMI.serif,
          }}
        >
          R
        </div>
        <div>
          <div style={{ color: KAMI.ink, fontWeight: 600, fontSize: 15 }}>
            Rebyte employee
          </div>
          <div style={{ color: KAMI.stone, fontSize: 12 }}>Generating Sites artifact</div>
        </div>
      </div>
      <div style={{ display: "grid", gap: 9 }}>
        {steps.map((step, index) => {
          const active = scan > index / steps.length;
          return (
            <div
              key={step}
              style={{
                height: 34,
                borderRadius: 7,
                border: `1px solid ${active ? KAMI.brandBorder : KAMI.border}`,
                background: active ? KAMI.brandPale : KAMI.parchment,
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                gap: 10,
                color: active ? KAMI.brand : KAMI.olive,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: active ? KAMI.brand : KAMI.pressed,
                }}
              />
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ScreenshotPane = ({ frame }: { frame: number }) => {
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, 76, 40);
  const edit = progress(frame, 152, 190);
  const save = progress(frame, 206, 238);
  const share = progress(frame, 238, 276);
  const zoom = interpolate(progress(frame, 96, 132), [0, 1], [0.96, 1]);

  return (
    <BrowserChrome
      label="sites.rebyte.ai/report"
      style={{
        position: "absolute",
        right: 98,
        top: 176,
        width: 1090,
        height: 704,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${zoom})`,
      }}
    >
      <div style={{ position: "relative", height: 658, overflow: "hidden", background: "#20201f" }}>
        <Img
          src={staticFile("sites-report-read.png")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            opacity: 1,
            transform: `scale(${interpolate(edit, [0, 1], [1, 1.012])})`,
          }}
        />
        <Img
          src={staticFile("sites-report-edit.png")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            opacity: edit,
            clipPath: "inset(0 0 calc(100% - 58px) 0)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 232,
            top: 104,
            width: 650,
            height: 124,
            border: `2px solid ${KAMI.brandBorder}`,
            borderRadius: 10,
            boxShadow: "0 0 0 999px rgba(20, 20, 19, 0.18)",
            opacity: edit,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 836,
            top: 132,
            width: 2,
            height: 58,
            background: KAMI.brandBorder,
            opacity: edit,
          }}
        />
        <Callout
          frame={frame}
          start={118}
          end={160}
          x={700}
          y={68}
          label="Open live page"
        />
        <Callout frame={frame} start={160} end={206} x={925} y={18} label="Edit" />
        <Callout frame={frame} start={208} end={250} x={850} y={18} label="Save revision" />
        <div
          style={{
            position: "absolute",
            right: 38,
            bottom: 38,
            width: 286,
            borderRadius: 12,
            border: `1px solid ${KAMI.brandBorder}`,
            background: KAMI.ivory,
            boxShadow: "0 16px 44px rgba(20, 20, 19, 0.18)",
            padding: 18,
            opacity: share,
            transform: `translateY(${interpolate(share, [0, 1], [18, 0])}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Tag tone="success" active>
              Shared
            </Tag>
            <div style={{ display: "flex", marginRight: 4 }}>
              {["CJ", "PM", "ENG"].map((item, index) => (
                <div
                  key={item}
                  style={{
                    width: 32,
                    height: 32,
                    marginLeft: index === 0 ? 0 : -8,
                    borderRadius: "50%",
                    border: `2px solid ${KAMI.ivory}`,
                    background: [KAMI.brand, KAMI.rose, KAMI.success][index],
                    color: KAMI.ivory,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: 15,
              fontFamily: KAMI.mono,
              color: KAMI.brand,
              fontSize: 13,
              background: KAMI.brandPale,
              border: `1px solid ${KAMI.brandBorder}`,
              borderRadius: 7,
              padding: "10px 11px",
            }}
          >
            rebyte.space/site
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 38,
            bottom: 38,
            borderRadius: 10,
            padding: "12px 15px",
            background: KAMI.ivory,
            border: `1px solid ${KAMI.border2}`,
            boxShadow: "0 14px 40px rgba(20, 20, 19, 0.16)",
            opacity: save,
            color: KAMI.ink,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Revision 3 saved
        </div>
      </div>
    </BrowserChrome>
  );
};

const Callout = ({
  frame,
  start,
  end,
  x,
  y,
  label,
}: {
  frame: number;
  start: number;
  end: number;
  x: number;
  y: number;
  label: string;
}) => {
  const p = fadeInOut(frame, start, end);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [10, 0])}px)`,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 8,
        background: KAMI.brand,
        color: KAMI.ivory,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        boxShadow: "0 10px 28px rgba(17, 35, 63, 0.28)",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: KAMI.ivory,
        }}
      />
      {label}
    </div>
  );
};

const StepRail = ({ frame }: { frame: number }) => {
  const steps = [
    { label: "Ask", at: 0 },
    { label: "Generate", at: 54 },
    { label: "Open", at: 112 },
    { label: "Edit", at: 158 },
    { label: "Save", at: 210 },
    { label: "Share", at: 246 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: 118,
        right: 118,
        bottom: 78,
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: 10,
        zIndex: 20,
      }}
    >
      {steps.map((step, index) => {
        const active = frame >= step.at;
        const fill = progress(frame, step.at, step.at + 26);
        return (
          <div key={step.label}>
            <div
              style={{
                height: 5,
                borderRadius: 999,
                background: KAMI.pressed,
                overflow: "hidden",
                marginBottom: 9,
              }}
            >
              <div
                style={{
                  width: `${fill * 100}%`,
                  height: "100%",
                  background: active ? KAMI.brand : KAMI.pressed,
                }}
              />
            </div>
            <div
              style={{
                color: active ? KAMI.brand : KAMI.stone,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {index + 1}. {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Headline = ({ frame }: { frame: number }) => {
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, 0);
  const final = progress(frame, 238, 280);
  return (
    <div
      style={{
        position: "absolute",
        left: 118,
        top: 142,
        width: 560,
        opacity: p,
        transform: lift(p, 16),
        zIndex: 12,
      }}
    >
      <div
        style={{
          color: KAMI.brand,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 18,
        }}
      >
        Sites in Rebyte
      </div>
      <div
        style={{
          fontFamily: KAMI.serif,
          color: KAMI.ink,
          fontSize: 54,
          lineHeight: 1.04,
          letterSpacing: 0,
        }}
      >
        Agent output becomes a live page.
      </div>
      <div
        style={{
          marginTop: 20,
          color: KAMI.charcoal,
          fontSize: 19,
          lineHeight: 1.42,
          width: 500,
        }}
      >
        Generate it, edit it, save a revision, and share it with your team.
      </div>
      <div
        style={{
          marginTop: 28,
          display: "flex",
          gap: 10,
          opacity: final,
          transform: `translateY(${interpolate(final, [0, 1], [14, 0])}px)`,
        }}
      >
        <Tag tone="brand" active>
          Live artifact
        </Tag>
        <Tag tone="success" active>
          Team-ready
        </Tag>
      </div>
    </div>
  );
};

export const SitesLifecycle = () => {
  useKamiFonts();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: KAMI.parchment,
        color: KAMI.ink,
        fontFamily: KAMI.sans,
        overflow: "hidden",
      }}
    >
      <FontFaces />
      <PaperTexture />
      <Header />
      <Headline frame={frame} />
      <PromptCard frame={frame} />
      <EmployeeCard frame={frame} />
      <ScreenshotPane frame={frame} />
      <StepRail frame={frame} />
    </AbsoluteFill>
  );
};
