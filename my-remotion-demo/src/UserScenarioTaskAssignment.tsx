import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

const KAMI = {
  parchment: "#f5f4ed",
  ivory: "#faf9f5",
  sand: "#e8e6dc",
  pressed: "#dfddd2",
  ink: "#141413",
  charcoal: "#4d4c48",
  olive: "#5e5d59",
  stone: "#87867f",
  silver: "#b0aea5",
  border: "#e8e5da",
  border2: "#dedbd0",
  brand: "#1B365D",
  brandDeep: "#11233F",
  brandPale: "#E8EEF6",
  brandWash: "#F0F3F7",
  brandBorder: "#cfdce9",
  rose: "#b9837d",
  serif:
    "Newsreader, TsangerJinKai02, Source Serif 4, Charter, Georgia, 'Times New Roman', serif",
  sans:
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  mono: "JetBrains Mono, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
};

const INTRO = 150;
const CONFIG = 270;
const ASSIGN = 300;
const RUN = 330;
const API = 270;
const RESULT = 270;
const OUTRO = 120;

export const USER_SCENARIO_TASK_ASSIGNMENT_TOTAL_FRAMES =
  INTRO + CONFIG + ASSIGN + RUN + API + RESULT + OUTRO;

const clamp = (value: number) => Math.max(0, Math.min(1, value));

const progress = (frame: number, start: number, end: number) =>
  clamp(
    interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  );

const fadeOut = (frame: number, duration: number) =>
  interpolate(frame, [duration - 24, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const enter = (frame: number, fps: number, delay = 0, duration = 30) =>
  clamp(
    spring({
      frame: frame - delay,
      fps,
      durationInFrames: duration,
      config: { damping: 210 },
    })
  );

const lift = (value: number, from = 22) =>
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
  const [handle] = useState(() => delayRender("Loading Kami fonts"));

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

const Page = ({
  children,
  opacity = 1,
  label,
}: {
  children: ReactNode;
  opacity?: number;
  label?: string;
}) => (
  <AbsoluteFill
    style={{
      background: KAMI.parchment,
      color: KAMI.ink,
      fontFamily: KAMI.sans,
      opacity,
      overflow: "hidden",
    }}
  >
    <FontFaces />
    <PaperTexture />
    <Masthead label={label} />
    {children}
  </AbsoluteFill>
);

const PaperTexture = () => (
  <>
    <div
      style={{
        position: "absolute",
        inset: "64px 86px",
        borderTop: `1px solid ${KAMI.border}`,
        borderBottom: `1px solid ${KAMI.border}`,
      }}
    />
    {Array.from({ length: 7 }).map((_, index) => (
      <div
        key={`rule-${index}`}
        style={{
          position: "absolute",
          left: 86,
          right: 86,
          top: 190 + index * 118,
          borderTop: `1px solid rgba(224, 221, 210, ${0.24 - index * 0.015})`,
        }}
      />
    ))}
    <div
      style={{
        position: "absolute",
        width: 620,
        height: 620,
        border: `1px solid ${KAMI.border}`,
        borderRadius: "50%",
        right: -190,
        top: 78,
      }}
    />
    <div
      style={{
        position: "absolute",
        width: 980,
        height: 980,
        border: `1px solid rgba(224, 221, 210, 0.72)`,
        borderRadius: "50%",
        right: -420,
        top: -80,
      }}
    />
    <div
      style={{
        position: "absolute",
        width: 520,
        height: 520,
        border: `1px solid rgba(224, 221, 210, 0.72)`,
        borderRadius: "50%",
        left: -260,
        bottom: -210,
      }}
    />
  </>
);

const LogoMark = ({ size = 32 }: { size?: number }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      background: KAMI.ivory,
      border: `1px solid ${KAMI.border2}`,
      boxShadow: "0 4px 20px rgba(20, 20, 19, 0.06)",
      flex: "0 0 auto",
    }}
  >
    <Img
      src={staticFile("rebyte-mark.png")}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    />
  </div>
);

const Masthead = ({ label }: { label?: string }) => (
  <div
    style={{
      position: "absolute",
      top: 64,
      left: 86,
      right: 86,
      height: 72,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      zIndex: 20,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <LogoMark size={34} />
      <div
        style={{
          fontFamily: KAMI.serif,
          fontSize: 30,
          fontWeight: 500,
          color: KAMI.ink,
          letterSpacing: 0,
        }}
      >
        rebyte.ai
      </div>
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        color: KAMI.olive,
        fontSize: 12,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      <span>{label ?? "Agent Computers"}</span>
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: KAMI.silver }} />
      <span>Skills</span>
      <span>API</span>
    </div>
  </div>
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      color: KAMI.brand,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
    }}
  >
    <span style={{ width: 24, height: 1, background: KAMI.brand }} />
    {children}
  </div>
);

const TinyTag = ({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "sand" | "rose";
}) => {
  const palette = {
    neutral: { bg: KAMI.ivory, color: KAMI.olive, border: KAMI.border2 },
    brand: { bg: KAMI.brandPale, color: KAMI.brand, border: KAMI.brandBorder },
    sand: { bg: KAMI.sand, color: KAMI.charcoal, border: KAMI.border2 },
    rose: { bg: "#F1E8E4", color: "#7c504d", border: "#decac4" },
  }[tone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 26,
        padding: "0 9px",
        borderRadius: 6,
        border: `1px solid ${palette.border}`,
        background: palette.bg,
        color: palette.color,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};

const Panel = ({
  title,
  kicker,
  children,
  style,
  frame,
  delay = 0,
  dense = false,
}: {
  title?: string;
  kicker?: string;
  children: ReactNode;
  style?: CSSProperties;
  frame: number;
  delay?: number;
  dense?: boolean;
}) => {
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, delay);

  return (
    <div
      style={{
        opacity: p,
        transform: lift(p, 16),
        background: KAMI.ivory,
        border: `1px solid ${KAMI.border2}`,
        borderRadius: 12,
        boxShadow: "0 4px 24px rgba(20, 20, 19, 0.05)",
        overflow: "hidden",
        ...style,
      }}
    >
      {(title || kicker) && (
        <div
          style={{
            height: dense ? 46 : 54,
            padding: dense ? "0 14px" : "0 18px",
            borderBottom: `1px solid ${KAMI.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            {kicker && (
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: KAMI.stone,
                  letterSpacing: "0.11em",
                  textTransform: "uppercase",
                  marginBottom: title ? 3 : 0,
                }}
              >
                {kicker}
              </div>
            )}
            {title && (
              <div
                style={{
                  fontSize: dense ? 13 : 15,
                  fontWeight: 600,
                  color: KAMI.ink,
                  lineHeight: 1.15,
                }}
              >
                {title}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            <span style={windowDotStyle} />
            <span style={windowDotStyle} />
            <span style={windowDotStyle} />
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

const windowDotStyle: CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: "50%",
  background: KAMI.pressed,
  border: `1px solid ${KAMI.border2}`,
};

const ProductShell = ({
  frame,
  activeTab,
  title,
  subtitle,
  children,
}: {
  frame: number;
  activeTab: "Tasks" | "Messages" | "Schedules" | "Connect" | "Sync";
  title: string;
  subtitle: string;
  children: ReactNode;
}) => {
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, 4, 34);

  return (
    <div
      style={{
        position: "absolute",
        left: 88,
        right: 88,
        top: 148,
        bottom: 64,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [28, 0])}px) scale(${interpolate(
          p,
          [0, 1],
          [0.985, 1]
        )})`,
        background: KAMI.ivory,
        border: `1px solid ${KAMI.border2}`,
        borderRadius: 12,
        boxShadow: "0 4px 28px rgba(20, 20, 19, 0.06)",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "62px 1fr",
        zIndex: 5,
      }}
    >
      <div
        style={{
          borderBottom: `1px solid ${KAMI.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          background: KAMI.ivory,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <LogoMark size={28} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: KAMI.ink }}>{title}</div>
            <div style={{ fontSize: 11, color: KAMI.stone, marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <TinyTag tone="brand">workspace live</TinyTag>
          <TinyTag>ws_prospecting</TinyTag>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: `1px solid ${KAMI.border2}`,
              background: KAMI.sand,
              display: "grid",
              placeItems: "center",
              color: KAMI.brand,
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            CJ
          </div>
        </div>
      </div>
      <div
        style={{
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "78px 282px minmax(0, 1fr)",
          background: KAMI.parchment,
        }}
      >
        <Rail activeTab={activeTab} />
        <WorkspaceSidebar frame={frame} />
        <div
          style={{
            minWidth: 0,
            minHeight: 0,
            padding: 16,
            background: KAMI.parchment,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const Rail = ({ activeTab }: { activeTab: string }) => {
  const items = ["Tasks", "Messages", "Schedules", "Connect", "Sync"];

  return (
    <div
      style={{
        borderRight: `1px solid ${KAMI.border}`,
        padding: "14px 10px",
        background: KAMI.ivory,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {items.map((item) => {
        const active = item === activeTab;
        return (
          <div
            key={item}
            style={{
              position: "relative",
              height: 60,
              borderRadius: 8,
              background: active ? KAMI.brandPale : "transparent",
              border: `1px solid ${active ? KAMI.brandBorder : "transparent"}`,
              display: "grid",
              placeItems: "center",
              color: active ? KAMI.brand : KAMI.stone,
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {active && (
              <span
                style={{
                  position: "absolute",
                  left: -8,
                  top: 12,
                  bottom: 12,
                  width: 3,
                  borderRadius: 2,
                  background: KAMI.brand,
                }}
              />
            )}
            <div
              style={{
                width: 25,
                height: 18,
                border: `1px solid ${active ? KAMI.brandBorder : KAMI.border2}`,
                borderRadius: 5,
                background: active ? KAMI.ivory : KAMI.sand,
                marginBottom: 3,
              }}
            />
            {item}
          </div>
        );
      })}
    </div>
  );
};

const WorkspaceSidebar = ({ frame }: { frame: number }) => {
  const rows = [
    ["Maya", "Research Agent", "running", "brand"],
    ["CJ", "Signup Feedback", "scheduled", "sand"],
    ["Rex", "Support Weekly", "shared", "rose"],
    ["Fin", "Billing QA", "private", "neutral"],
  ] as const;

  return (
    <div
      style={{
        borderRight: `1px solid ${KAMI.border}`,
        padding: 14,
        background: KAMI.ivory,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 38,
          borderRadius: 8,
          background: KAMI.sand,
          border: `1px solid ${KAMI.border2}`,
          display: "flex",
          alignItems: "center",
          padding: "0 11px",
          color: KAMI.stone,
          fontSize: 12,
          marginBottom: 14,
        }}
      >
        Search agent computers
      </div>
      <div
        style={{
          fontSize: 11,
          color: KAMI.stone,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          margin: "4px 0 10px",
        }}
      >
        Agent Computers
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {rows.map(([name, role, status, tone], index) => {
          const p = progress(frame, 14 + index * 5, 46 + index * 5);
          return (
            <div
              key={name}
              style={{
                opacity: p,
                transform: lift(p, 10),
                borderRadius: 8,
                border: `1px solid ${index === 0 ? KAMI.brandBorder : KAMI.border2}`,
                background: index === 0 ? KAMI.brandWash : KAMI.ivory,
                padding: 10,
                display: "grid",
                gridTemplateColumns: "34px 1fr",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: index === 0 ? KAMI.brandPale : KAMI.sand,
                  border: `1px solid ${index === 0 ? KAMI.brandBorder : KAMI.border2}`,
                  display: "grid",
                  placeItems: "center",
                  color: index === 0 ? KAMI.brand : KAMI.olive,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {name.slice(0, 1)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: KAMI.ink }}>{name}</div>
                  <TinyTag tone={tone as "neutral" | "brand" | "sand" | "rose"}>{status}</TinyTag>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: KAMI.stone,
                    marginTop: 4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {role}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 14,
          borderRadius: 10,
          border: `1px solid ${KAMI.border2}`,
          background: KAMI.sand,
          padding: 12,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: KAMI.ink }}>Team access</div>
        <div style={{ color: KAMI.olive, fontSize: 11, lineHeight: 1.45, marginTop: 7 }}>
          Private until shared with teammates. Permissions travel with the employee.
        </div>
      </div>
    </div>
  );
};

const IntroScene = ({ duration }: { duration: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleP = enter(frame, fps, 8, 38);
  const sideP = enter(frame, fps, 28, 40);
  const lineP = progress(frame, 44, 90);

  return (
    <Page opacity={fadeOut(frame, duration)} label="Product OS">
      <div
        style={{
          position: "absolute",
          left: 142,
          top: 214,
          width: 770,
          opacity: titleP,
          transform: lift(titleP, 28),
          zIndex: 4,
        }}
      >
        <Eyebrow>Rebyte Agent Computers</Eyebrow>
        <div
          style={{
            marginTop: 30,
            fontFamily: KAMI.serif,
            fontSize: 94,
            lineHeight: 0.98,
            letterSpacing: 0,
            color: KAMI.ink,
            fontWeight: 500,
          }}
        >
          Hire a team of
          <span style={{ color: KAMI.brand }}> agent computers </span>
          for real work.
        </div>
        <div
          style={{
            marginTop: 28,
            width: 660,
            fontSize: 22,
            lineHeight: 1.45,
            color: KAMI.charcoal,
          }}
        >
          Configure an employee with prompt, MCP servers, skills, and permissions.
          Then assign work from chat, schedules, or API.
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
          <TinyTag tone="brand">Prompt</TinyTag>
          <TinyTag tone="brand">MCP</TinyTag>
          <TinyTag tone="brand">Skills</TinyTag>
          <TinyTag tone="brand">API</TinyTag>
          <TinyTag tone="brand">Review</TinyTag>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 145,
          top: 852,
          width: interpolate(lineP, [0, 1], [0, 540]),
          height: 2,
          background: KAMI.brand,
          opacity: 0.9,
        }}
      />
      <IntroDeck frame={frame} opacity={sideP} />
    </Page>
  );
};

const IntroDeck = ({ frame, opacity }: { frame: number; opacity: number }) => {
  const cardA = progress(frame, 24, 72);
  const cardB = progress(frame, 38, 86);
  const cardC = progress(frame, 52, 102);

  return (
    <div
      style={{
        position: "absolute",
        right: 118,
        top: 180,
        width: 760,
        height: 760,
        opacity,
        zIndex: 3,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 640,
          height: 640,
          borderRadius: "50%",
          border: `1px solid ${KAMI.border2}`,
          right: 34,
          top: 44,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: `1px solid ${KAMI.border}`,
          right: 104,
          top: 114,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 310,
          top: 250,
          width: 122,
          height: 122,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: KAMI.ivory,
          border: `1px solid ${KAMI.border2}`,
          boxShadow: "0 4px 26px rgba(20, 20, 19, 0.06)",
          zIndex: 5,
        }}
      >
        <LogoMark size={88} />
      </div>
      <PreviewCard
        frame={frame}
        p={cardA}
        style={{ right: 12, top: 60, width: 482, height: 232, zIndex: 2 }}
        title="Configure the employee"
        rows={["Prompt and behavior", "Mounted MCP servers", "Private or shared"]}
      />
      <PreviewCard
        frame={frame}
        p={cardB}
        style={{ left: 26, top: 344, width: 520, height: 246, zIndex: 4 }}
        title="Assign any task"
        rows={["Use a skill", "Run browser work", "Return an artifact"]}
      />
      <PreviewCard
        frame={frame}
        p={cardC}
        style={{ right: 44, top: 506, width: 430, height: 198, zIndex: 3 }}
        title="Operate by API"
        rows={["POST /v1/tasks", "Hourly schedules", "Review before send"]}
      />
    </div>
  );
};

const PreviewCard = ({
  p,
  title,
  rows,
  style,
}: {
  frame: number;
  p: number;
  title: string;
  rows: string[];
  style: CSSProperties;
}) => (
  <div
    style={{
      position: "absolute",
      opacity: p,
      transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px) rotate(${interpolate(
        p,
        [0, 1],
        [-1.5, 0]
      )}deg)`,
      background: KAMI.ivory,
      border: `1px solid ${KAMI.border2}`,
      borderRadius: 12,
      boxShadow: "0 4px 28px rgba(20, 20, 19, 0.06)",
      padding: 18,
      ...style,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <LogoMark size={30} />
      <div style={{ fontSize: 15, fontWeight: 600, color: KAMI.ink }}>{title}</div>
    </div>
    <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
      {rows.map((row, index) => (
        <div
          key={row}
          style={{
            display: "grid",
            gridTemplateColumns: "28px 1fr 58px",
            alignItems: "center",
            gap: 10,
            height: 34,
          }}
        >
          <div
            style={{
              width: 28,
              height: 24,
              borderRadius: 6,
              border: `1px solid ${KAMI.border2}`,
              background: index === 0 ? KAMI.brandPale : KAMI.sand,
            }}
          />
          <div style={{ fontSize: 13, color: KAMI.charcoal }}>{row}</div>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: index === 0 ? KAMI.brand : KAMI.border2,
              width: `${72 - index * 14}%`,
            }}
          />
        </div>
      ))}
    </div>
  </div>
);

const ConfigScene = ({ duration }: { duration: number }) => {
  const frame = useCurrentFrame();
  return (
    <Page opacity={fadeOut(frame, duration)} label="Configure">
      <ProductShell
        frame={frame}
        activeTab="Tasks"
        title="Maya - Research Agent"
        subtitle="Employee setup with prompt, MCP, skills, model, and access"
      >
        <div
          style={{
            height: "100%",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 386px",
            gap: 14,
          }}
        >
          <div style={{ display: "grid", gridTemplateRows: "378px 1fr", gap: 14, minHeight: 0 }}>
            <Panel frame={frame} delay={14} title="Employee instructions" kicker="Prompt">
              <div style={{ padding: 18, height: "100%", display: "grid", gap: 14 }}>
                <PromptEditor frame={frame} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <ConfigTile
                    frame={frame}
                    delay={28}
                    title="Behavior"
                    value="Ask before sending"
                    note="Autonomous research, human approval for external actions."
                  />
                  <ConfigTile
                    frame={frame}
                    delay={36}
                    title="Visibility"
                    value="Private"
                    note="Can be shared with real teammates when ready."
                  />
                  <ConfigTile
                    frame={frame}
                    delay={44}
                    title="Model"
                    value="Auto"
                    note="Large reasoning model for planning, fast model for routine steps."
                  />
                </div>
              </div>
            </Panel>
            <Panel frame={frame} delay={34} title="Skill library" kicker="/home/user/.skills">
              <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  ["research/SKILL.md", "Find sources, extract evidence, keep citations"],
                  ["crm-enrichment/SKILL.md", "Use signup data, company domains, and lifecycle stage"],
                  ["email-draft/SKILL.md", "Write native founder-style outreach drafts"],
                  ["qa-browser/SKILL.md", "Open product, reproduce flow, capture notes"],
                ].map(([name, note], index) => (
                  <SkillFile key={name} name={name} note={note} frame={frame} delay={42 + index * 6} />
                ))}
              </div>
            </Panel>
          </div>
          <div style={{ display: "grid", gridTemplateRows: "350px 1fr", gap: 14, minHeight: 0 }}>
            <Panel frame={frame} delay={24} title="Mounted MCP servers" kicker="Tools">
              <div style={{ padding: 16, display: "grid", gap: 10 }}>
                {[
                  ["Browser", "Open pages, click, scrape", "12 tools"],
                  ["CRM", "Read users, cohorts, events", "8 tools"],
                  ["Mail", "Draft and send after approval", "5 tools"],
                  ["Sheets", "Export packets for the team", "6 tools"],
                ].map(([name, note, count], index) => (
                  <ToolMount
                    key={name}
                    name={name}
                    note={note}
                    count={count}
                    frame={frame}
                    delay={28 + index * 6}
                  />
                ))}
              </div>
            </Panel>
            <Panel frame={frame} delay={42} title="Permission map" kicker="Guardrails">
              <div style={{ padding: 16, display: "grid", gap: 13 }}>
                <PermissionRow label="Read CRM users" value="Allowed" percent={0.96} frame={frame} delay={50} />
                <PermissionRow label="Visit public web" value="Allowed" percent={0.9} frame={frame} delay={58} />
                <PermissionRow label="Send external email" value="Review" percent={0.54} frame={frame} delay={66} />
                <PermissionRow label="Edit billing records" value="Blocked" percent={0.22} frame={frame} delay={74} />
                <div
                  style={{
                    marginTop: 4,
                    borderRadius: 8,
                    background: KAMI.brandWash,
                    border: `1px solid ${KAMI.brandBorder}`,
                    padding: 13,
                    color: KAMI.brandDeep,
                    fontSize: 12,
                    lineHeight: 1.45,
                  }}
                >
                  Permissions are part of the employee, so tasks, schedules, and API calls
                  run with the same policy.
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </ProductShell>
    </Page>
  );
};

const PromptEditor = ({ frame }: { frame: number }) => {
  const text =
    "You are Maya, a Rebyte employee for growth research. When a user signs up, inspect their company, identify likely use cases, draft a concise founder-style note, and wait for approval before sending.";
  const typed = text.slice(0, Math.floor(interpolate(progress(frame, 24, 122), [0, 1], [0, text.length])));

  return (
    <div
      style={{
        minHeight: 140,
        borderRadius: 10,
        border: `1px solid ${KAMI.border2}`,
        background: KAMI.parchment,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <TinyTag tone="sand">agent_instructions</TinyTag>
        <TinyTag tone="brand">saved</TinyTag>
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily: KAMI.serif,
          fontSize: 20,
          lineHeight: 1.34,
          color: KAMI.ink,
                  minHeight: 76,
        }}
      >
        {typed}
        <span style={{ color: KAMI.brand }}>|</span>
      </div>
    </div>
  );
};

const ConfigTile = ({
  title,
  value,
  note,
  frame,
  delay,
}: {
  title: string;
  value: string;
  note: string;
  frame: number;
  delay: number;
}) => {
  const p = progress(frame, delay, delay + 34);
  return (
    <div
      style={{
        opacity: p,
        transform: lift(p, 12),
        minHeight: 88,
        borderRadius: 10,
        border: `1px solid ${KAMI.border2}`,
        background: KAMI.ivory,
        padding: 13,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 600, color: KAMI.stone, textTransform: "uppercase" }}>
        {title}
      </div>
      <div style={{ marginTop: 8, fontSize: 18, fontWeight: 600, color: KAMI.ink }}>{value}</div>
      <div style={{ marginTop: 6, fontSize: 10, lineHeight: 1.3, color: KAMI.olive }}>{note}</div>
    </div>
  );
};

const SkillFile = ({
  name,
  note,
  frame,
  delay,
}: {
  name: string;
  note: string;
  frame: number;
  delay: number;
}) => {
  const p = progress(frame, delay, delay + 32);
  return (
    <div
      style={{
        opacity: p,
        transform: lift(p, 12),
        borderRadius: 9,
        border: `1px solid ${KAMI.border2}`,
        background: KAMI.parchment,
        padding: 13,
        minHeight: 86,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            border: `1px solid ${KAMI.brandBorder}`,
            background: KAMI.brandPale,
            color: KAMI.brand,
            display: "grid",
            placeItems: "center",
            fontFamily: KAMI.mono,
            fontSize: 10,
          }}
        >
          SK
        </div>
        <div style={{ fontFamily: KAMI.mono, fontSize: 12, color: KAMI.ink }}>{name}</div>
      </div>
      <div style={{ marginTop: 9, color: KAMI.olive, fontSize: 11, lineHeight: 1.42 }}>{note}</div>
    </div>
  );
};

const ToolMount = ({
  name,
  note,
  count,
  frame,
  delay,
}: {
  name: string;
  note: string;
  count: string;
  frame: number;
  delay: number;
}) => {
  const p = progress(frame, delay, delay + 34);
  return (
    <div
      style={{
        opacity: p,
        transform: lift(p, 10),
        display: "grid",
        gridTemplateColumns: "34px 1fr auto",
        alignItems: "center",
        gap: 10,
        padding: 8,
        borderRadius: 8,
        border: `1px solid ${KAMI.border2}`,
        background: KAMI.parchment,
      }}
    >
      <div
        style={{
          width: 30,
          height: 26,
          borderRadius: 7,
          background: name === "Browser" ? KAMI.brandPale : KAMI.sand,
          border: `1px solid ${name === "Browser" ? KAMI.brandBorder : KAMI.border2}`,
        }}
      />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: KAMI.ink }}>{name}</div>
        <div style={{ fontSize: 10, color: KAMI.stone, marginTop: 2 }}>{note}</div>
      </div>
      <TinyTag tone={name === "Browser" ? "brand" : "neutral"}>{count}</TinyTag>
    </div>
  );
};

const PermissionRow = ({
  label,
  value,
  percent,
  frame,
  delay,
}: {
  label: string;
  value: string;
  percent: number;
  frame: number;
  delay: number;
}) => {
  const p = progress(frame, delay, delay + 34);
  return (
    <div style={{ opacity: p, transform: lift(p, 8) }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: KAMI.charcoal, fontSize: 12 }}>{label}</span>
        <span
          style={{
            color: value === "Blocked" ? "#7c504d" : value === "Review" ? KAMI.brand : KAMI.olive,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {value}
        </span>
      </div>
      <div
        style={{
          marginTop: 7,
          height: 7,
          borderRadius: 4,
          background: KAMI.sand,
          border: `1px solid ${KAMI.border2}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${interpolate(p, [0, 1], [0, percent * 100])}%`,
            height: "100%",
            background: value === "Blocked" ? "#c9a5a0" : KAMI.brand,
          }}
        />
      </div>
    </div>
  );
};

const AssignScene = ({ duration }: { duration: number }) => {
  const frame = useCurrentFrame();
  return (
    <Page opacity={fadeOut(frame, duration)} label="Assign">
      <ProductShell
        frame={frame}
        activeTab="Tasks"
        title="Task inbox"
        subtitle="Give the employee work like a teammate, with skills attached"
      >
        <div
          style={{
            height: "100%",
            display: "grid",
            gridTemplateColumns: "350px minmax(0, 1fr) 330px",
            gap: 14,
            minHeight: 0,
          }}
        >
          <Panel frame={frame} delay={12} title="Today" kicker="Task Queue">
            <div style={{ padding: 14, display: "grid", gap: 9 }}>
              {[
                ["Find signup use cases", "Maya", "Running"],
                ["Draft activation email", "CJ", "Ready"],
                ["Update weekly CRM report", "Rex", "Queued"],
                ["QA billing checkout", "Fin", "Blocked"],
                ["Summarize Gong calls", "Maya", "Done"],
              ].map(([title, owner, status], index) => (
                <TaskListRow
                  key={title}
                  title={title}
                  owner={owner}
                  status={status}
                  active={index === 0}
                  frame={frame}
                  delay={20 + index * 6}
                />
              ))}
            </div>
          </Panel>
          <div style={{ display: "grid", gridTemplateRows: "1fr 190px", gap: 14, minHeight: 0 }}>
            <Panel frame={frame} delay={20} title="Assign task to Maya" kicker="Composer">
              <TaskBrief frame={frame} />
            </Panel>
            <Panel frame={frame} delay={42} dense>
              <Composer frame={frame} />
            </Panel>
          </div>
          <Panel frame={frame} delay={28} title="Skill executor" kicker="Playbooks">
            <div style={{ padding: 15, display: "grid", gap: 12 }}>
              {[
                ["research", "Search web, collect citations, extract claims"],
                ["crm-enrichment", "Read signup account, events, company domain"],
                ["email-draft", "Write a founder note and keep it native"],
                ["review-gate", "Ask for approval before external send"],
              ].map(([skill, note], index) => (
                <PlaybookRow
                  key={skill}
                  skill={skill}
                  note={note}
                  active={index < 3}
                  frame={frame}
                  delay={38 + index * 8}
                />
              ))}
              <div
                style={{
                  marginTop: 8,
                  borderRadius: 10,
                  border: `1px solid ${KAMI.brandBorder}`,
                  background: KAMI.brandWash,
                  padding: 13,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: KAMI.brandDeep }}>
                  Any task on the internet
                </div>
                <div style={{ marginTop: 7, color: KAMI.brandDeep, fontSize: 12, lineHeight: 1.45 }}>
                  The employee chooses tools, runs the right skill, and turns the work into a
                  reviewable packet.
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </ProductShell>
    </Page>
  );
};

const TaskListRow = ({
  title,
  owner,
  status,
  active,
  frame,
  delay,
}: {
  title: string;
  owner: string;
  status: string;
  active?: boolean;
  frame: number;
  delay: number;
}) => {
  const p = progress(frame, delay, delay + 34);
  return (
    <div
      style={{
        opacity: p,
        transform: lift(p, 9),
        borderRadius: 9,
        border: `1px solid ${active ? KAMI.brandBorder : KAMI.border2}`,
        background: active ? KAMI.brandWash : KAMI.parchment,
        padding: 11,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: KAMI.ink }}>{title}</div>
        <TinyTag tone={active ? "brand" : "neutral"}>{status}</TinyTag>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: 7,
            background: active ? KAMI.brandPale : KAMI.sand,
            border: `1px solid ${active ? KAMI.brandBorder : KAMI.border2}`,
            color: active ? KAMI.brand : KAMI.olive,
            display: "grid",
            placeItems: "center",
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {owner.slice(0, 1)}
        </span>
        <span style={{ color: KAMI.stone, fontSize: 11 }}>Assigned to {owner}</span>
      </div>
    </div>
  );
};

const TaskBrief = ({ frame }: { frame: number }) => {
  const noteP = progress(frame, 32, 86);
  const sourceP = progress(frame, 62, 126);

  return (
    <div style={{ padding: 18, height: "100%", display: "grid", gridTemplateRows: "auto 1fr" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: KAMI.serif, fontSize: 34, fontWeight: 500, color: KAMI.ink }}>
            Research last week's signup cohort
          </div>
          <div style={{ marginTop: 7, color: KAMI.olive, fontSize: 14 }}>
            Turn raw registrations into customer context, use cases, and email drafts.
          </div>
        </div>
        <TinyTag tone="brand">new task</TinyTag>
      </div>
      <div
        style={{
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: "1fr 290px",
          gap: 14,
          minHeight: 0,
        }}
      >
        <div
          style={{
            borderRadius: 10,
            background: KAMI.parchment,
            border: `1px solid ${KAMI.border2}`,
            padding: 15,
            display: "grid",
            gap: 12,
          }}
        >
          {[
            ["Goal", "Find 20 high-intent accounts and identify why Rebyte fits."],
            ["Output", "A table of accounts, use cases, evidence, and a draft founder note."],
            ["Constraint", "Do not send external email. Stop at review packet."],
          ].map(([label, value], index) => {
            const p = progress(frame, 40 + index * 12, 74 + index * 12);
            return (
              <div
                key={label}
                style={{
                  opacity: p,
                  transform: lift(p, 8),
                  display: "grid",
                  gridTemplateColumns: "78px 1fr",
                  gap: 12,
                  alignItems: "start",
                }}
              >
                <TinyTag tone={index === 0 ? "brand" : "sand"}>{label}</TinyTag>
                <div style={{ fontSize: 14, lineHeight: 1.42, color: KAMI.charcoal }}>{value}</div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            opacity: sourceP,
            transform: lift(sourceP, 12),
            borderRadius: 10,
            border: `1px solid ${KAMI.border2}`,
            background: KAMI.ivory,
            padding: 14,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: KAMI.ink }}>Attached context</div>
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            <SourceChip label="signups_last_7_days.csv" meta="CRM export" />
            <SourceChip label="@Maya" meta="Research Agent" />
            <SourceChip label="skill: email-draft" meta="native copy" />
            <SourceChip label="skill: crm-enrichment" meta="events + company" />
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 32,
          right: 32,
          bottom: 26,
          height: 2,
          background: KAMI.sand,
          overflow: "hidden",
          opacity: noteP,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${interpolate(progress(frame, 50, 150), [0, 1], [0, 78])}%`,
            background: KAMI.brand,
          }}
        />
      </div>
    </div>
  );
};

const SourceChip = ({ label, meta }: { label: string; meta: string }) => (
  <div
    style={{
      borderRadius: 8,
      border: `1px solid ${KAMI.border2}`,
      background: KAMI.parchment,
      padding: 10,
      display: "grid",
      gap: 4,
    }}
  >
    <div style={{ color: KAMI.ink, fontSize: 12, fontFamily: KAMI.mono }}>{label}</div>
    <div style={{ color: KAMI.stone, fontSize: 11 }}>{meta}</div>
  </div>
);

const Composer = ({ frame }: { frame: number }) => {
  const message =
    "Maya, research the newest signups, identify promising use cases, and prepare a founder-style email draft for review.";
  const typed = message.slice(
    0,
    Math.floor(interpolate(progress(frame, 58, 178), [0, 1], [0, message.length]))
  );

  return (
    <div
      style={{
        padding: 16,
        height: "100%",
        display: "grid",
        gridTemplateRows: "1fr auto",
        gap: 12,
      }}
    >
      <div
        style={{
          borderRadius: 10,
          border: `1px solid ${KAMI.border2}`,
          background: KAMI.parchment,
          padding: 14,
          fontSize: 16,
          color: KAMI.ink,
          lineHeight: 1.42,
        }}
      >
        {typed}
        <span style={{ color: KAMI.brand }}>|</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <TinyTag tone="brand">@Maya</TinyTag>
          <TinyTag tone="sand">skill: research</TinyTag>
          <TinyTag tone="sand">skill: email-draft</TinyTag>
        </div>
        <div
          style={{
            width: 104,
            height: 36,
            borderRadius: 8,
            display: "grid",
            placeItems: "center",
            background: KAMI.brand,
            color: KAMI.ivory,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Assign
        </div>
      </div>
    </div>
  );
};

const PlaybookRow = ({
  skill,
  note,
  active,
  frame,
  delay,
}: {
  skill: string;
  note: string;
  active: boolean;
  frame: number;
  delay: number;
}) => {
  const p = progress(frame, delay, delay + 34);
  return (
    <div
      style={{
        opacity: p,
        transform: lift(p, 9),
        borderRadius: 9,
        border: `1px solid ${active ? KAMI.brandBorder : KAMI.border2}`,
        background: active ? KAMI.brandWash : KAMI.parchment,
        padding: 11,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: KAMI.mono, fontSize: 12, color: active ? KAMI.brand : KAMI.ink }}>
          {skill}
        </span>
        <TinyTag tone={active ? "brand" : "neutral"}>{active ? "enabled" : "idle"}</TinyTag>
      </div>
      <div style={{ marginTop: 7, color: KAMI.olive, fontSize: 11, lineHeight: 1.42 }}>{note}</div>
    </div>
  );
};

const RunScene = ({ duration }: { duration: number }) => {
  const frame = useCurrentFrame();
  return (
    <Page opacity={fadeOut(frame, duration)} label="Run">
      <ProductShell
        frame={frame}
        activeTab="Messages"
        title="Live run"
        subtitle="The employee plans, browses, executes skills, and writes artifacts"
      >
        <div
          style={{
            height: "100%",
            display: "grid",
            gridTemplateColumns: "390px minmax(0, 1fr) 330px",
            gap: 14,
            minHeight: 0,
          }}
        >
          <Panel frame={frame} delay={12} title="Run timeline" kicker="Maya">
            <div style={{ padding: 15, display: "grid", gap: 11 }}>
              {[
                ["Plan", "Break cohort into company, role, and activation signals", "00:02"],
                ["CRM", "Fetch 30 new signups and workspace activity", "00:08"],
                ["Browser", "Research company pages and docs", "00:19"],
                ["Skill", "Run crm-enrichment and email-draft", "00:42"],
                ["Artifact", "Build review packet with sources", "01:11"],
              ].map(([step, note, time], index) => (
                <TimelineRow
                  key={step}
                  step={step}
                  note={note}
                  time={time}
                  active={index === Math.min(4, Math.floor(progress(frame, 28, 210) * 5))}
                  frame={frame}
                  delay={26 + index * 14}
                />
              ))}
            </div>
          </Panel>
          <div style={{ display: "grid", gridTemplateRows: "1fr 224px", gap: 14, minHeight: 0 }}>
            <Panel frame={frame} delay={24} title="Agent computer" kicker="Browser + files">
              <WorkSurface frame={frame} />
            </Panel>
            <Panel frame={frame} delay={50} title="Terminal" kicker="/code">
              <TerminalSurface frame={frame} />
            </Panel>
          </div>
          <Panel frame={frame} delay={34} title="Live state" kicker="Execution">
            <div style={{ padding: 16, display: "grid", gap: 14 }}>
              <LiveMeter label="Cohort loaded" value={0.94} frame={frame} delay={48} />
              <LiveMeter label="Evidence collected" value={0.72} frame={frame} delay={72} />
              <LiveMeter label="Drafts prepared" value={0.48} frame={frame} delay={96} />
              <div
                style={{
                  borderRadius: 10,
                  border: `1px solid ${KAMI.border2}`,
                  background: KAMI.parchment,
                  padding: 12,
                }}
              >
                <div style={{ color: KAMI.stone, fontSize: 11, fontWeight: 600 }}>CURRENT STEP</div>
                <div style={{ color: KAMI.ink, fontSize: 18, fontFamily: KAMI.serif, marginTop: 8 }}>
                  Checking whether the account has invited teammates.
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <StatTile label="Sources" value="84" frame={frame} delay={114} />
                <StatTile label="Drafts" value="12" frame={frame} delay={122} />
                <StatTile label="Needs review" value="3" frame={frame} delay={130} />
                <StatTile label="Blocked" value="0" frame={frame} delay={138} />
              </div>
            </div>
          </Panel>
        </div>
      </ProductShell>
    </Page>
  );
};

const TimelineRow = ({
  step,
  note,
  time,
  active,
  frame,
  delay,
}: {
  step: string;
  note: string;
  time: string;
  active: boolean;
  frame: number;
  delay: number;
}) => {
  const p = progress(frame, delay, delay + 36);
  return (
    <div
      style={{
        opacity: p,
        transform: lift(p, 10),
        display: "grid",
        gridTemplateColumns: "42px 1fr auto",
        gap: 11,
        alignItems: "start",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          border: `1px solid ${active ? KAMI.brandBorder : KAMI.border2}`,
          background: active ? KAMI.brandPale : KAMI.sand,
          display: "grid",
          placeItems: "center",
          color: active ? KAMI.brand : KAMI.olive,
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        {step.slice(0, 2).toUpperCase()}
      </div>
      <div>
        <div style={{ color: active ? KAMI.brandDeep : KAMI.ink, fontWeight: 600, fontSize: 13 }}>
          {step}
        </div>
        <div style={{ color: KAMI.olive, fontSize: 11, lineHeight: 1.42, marginTop: 5 }}>{note}</div>
      </div>
      <div style={{ color: KAMI.stone, fontSize: 11, fontFamily: KAMI.mono }}>{time}</div>
    </div>
  );
};

const WorkSurface = ({ frame }: { frame: number }) => {
  const cursorX = interpolate(progress(frame, 72, 178), [0, 1], [78, 512]);
  const cursorY = interpolate(progress(frame, 72, 178), [0, 1], [86, 286]);

  return (
    <div style={{ padding: 16, height: "100%", display: "grid", gridTemplateColumns: "1fr 250px", gap: 14 }}>
      <div
        style={{
          position: "relative",
          borderRadius: 10,
          border: `1px solid ${KAMI.border2}`,
          background: KAMI.parchment,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 42,
            borderBottom: `1px solid ${KAMI.border}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 12px",
          }}
        >
          <TinyTag tone="sand">browser</TinyTag>
          <div
            style={{
              flex: 1,
              height: 24,
              borderRadius: 6,
              border: `1px solid ${KAMI.border2}`,
              background: KAMI.ivory,
              color: KAMI.stone,
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              paddingLeft: 10,
            }}
          >
            https://company.example/customers/platform
          </div>
        </div>
        <div style={{ padding: 18, display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16 }}>
          <div>
            <div style={{ fontFamily: KAMI.serif, fontSize: 30, color: KAMI.ink }}>
              Internal tools for operations teams
            </div>
            <div style={{ marginTop: 12, height: 8, width: 320, background: KAMI.border2, borderRadius: 4 }} />
            <div style={{ marginTop: 8, height: 8, width: 260, background: KAMI.border2, borderRadius: 4 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 24 }}>
              {["CRM sync", "Usage events", "Team invites", "API docs"].map((label, index) => (
                <div
                  key={label}
                  style={{
                    opacity: progress(frame, 48 + index * 10, 82 + index * 10),
                    borderRadius: 9,
                    border: `1px solid ${index === 2 ? KAMI.brandBorder : KAMI.border2}`,
                    background: index === 2 ? KAMI.brandWash : KAMI.ivory,
                    padding: 12,
                    minHeight: 74,
                  }}
                >
                  <div style={{ color: index === 2 ? KAMI.brand : KAMI.ink, fontWeight: 600, fontSize: 13 }}>
                    {label}
                  </div>
                  <div style={{ marginTop: 8, height: 6, width: "72%", background: KAMI.border2, borderRadius: 4 }} />
                  <div style={{ marginTop: 6, height: 6, width: "48%", background: KAMI.border2, borderRadius: 4 }} />
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              borderRadius: 10,
              border: `1px solid ${KAMI.border2}`,
              background: KAMI.ivory,
              padding: 13,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: KAMI.ink }}>Extracted evidence</div>
            {["Uses internal admin apps", "Integrates with Postgres", "Invited 4 teammates"].map(
              (item, index) => (
                <div
                  key={item}
                  style={{
                    opacity: progress(frame, 90 + index * 16, 122 + index * 16),
                    marginTop: 12,
                    padding: 10,
                    borderRadius: 8,
                    background: index === 2 ? KAMI.brandWash : KAMI.parchment,
                    border: `1px solid ${index === 2 ? KAMI.brandBorder : KAMI.border2}`,
                    color: index === 2 ? KAMI.brandDeep : KAMI.charcoal,
                    fontSize: 12,
                    lineHeight: 1.35,
                  }}
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: cursorX,
            top: cursorY,
            width: 17,
            height: 17,
            borderRadius: "50%",
            border: `2px solid ${KAMI.brand}`,
            background: KAMI.ivory,
            boxShadow: "0 4px 18px rgba(27, 54, 93, 0.18)",
          }}
        />
      </div>
      <div
        style={{
          borderRadius: 10,
          border: `1px solid ${KAMI.border2}`,
          background: KAMI.ivory,
          padding: 12,
          display: "grid",
          gridTemplateRows: "auto 1fr",
          minHeight: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: KAMI.ink }}>Files</div>
          <TinyTag tone="brand">artifact</TinyTag>
        </div>
        <div style={{ display: "grid", gap: 8, marginTop: 12, alignContent: "start" }}>
          {[
            "cohort.csv",
            "evidence.md",
            "company_notes.json",
            "email_drafts.md",
            "review_packet.html",
          ].map((file, index) => (
            <div
              key={file}
              style={{
                opacity: progress(frame, 74 + index * 12, 104 + index * 12),
                borderRadius: 7,
                border: `1px solid ${index === 4 ? KAMI.brandBorder : KAMI.border2}`,
                background: index === 4 ? KAMI.brandWash : KAMI.parchment,
                padding: "9px 10px",
                fontFamily: KAMI.mono,
                color: index === 4 ? KAMI.brand : KAMI.charcoal,
                fontSize: 11,
              }}
            >
              {file}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TerminalSurface = ({ frame }: { frame: number }) => {
  const lines = [
    "$ rebyte run skill crm-enrichment --cohort signups_last_7_days.csv",
    "Loaded 30 users from CRM, grouped by workspace domain",
    "Opened 18 public pages, captured 84 source snippets",
    "Generated review_packet.html and email_drafts.md",
  ];

  return (
    <div
      style={{
        padding: 16,
        fontFamily: KAMI.mono,
        fontSize: 12,
        color: KAMI.charcoal,
        lineHeight: 1.65,
      }}
    >
      {lines.map((line, index) => {
        const p = progress(frame, 62 + index * 24, 92 + index * 24);
        return (
          <div
            key={line}
            style={{
              opacity: p,
              color: index === 0 ? KAMI.brand : KAMI.charcoal,
              whiteSpace: "nowrap",
            }}
          >
            {line.slice(0, Math.floor(interpolate(p, [0, 1], [0, line.length])))}
          </div>
        );
      })}
    </div>
  );
};

const LiveMeter = ({
  label,
  value,
  frame,
  delay,
}: {
  label: string;
  value: number;
  frame: number;
  delay: number;
}) => {
  const p = progress(frame, delay, delay + 40);
  return (
    <div style={{ opacity: p, transform: lift(p, 8) }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: KAMI.charcoal }}>{label}</span>
        <span style={{ fontSize: 11, color: KAMI.stone, fontFamily: KAMI.mono }}>
          {Math.round(interpolate(p, [0, 1], [0, value * 100]))}%
        </span>
      </div>
      <div
        style={{
          marginTop: 7,
          height: 8,
          borderRadius: 5,
          background: KAMI.sand,
          border: `1px solid ${KAMI.border2}`,
          overflow: "hidden",
        }}
      >
        <div style={{ height: "100%", width: `${interpolate(p, [0, 1], [0, value * 100])}%`, background: KAMI.brand }} />
      </div>
    </div>
  );
};

const StatTile = ({
  label,
  value,
  frame,
  delay,
}: {
  label: string;
  value: string;
  frame: number;
  delay: number;
}) => {
  const p = progress(frame, delay, delay + 34);
  return (
    <div
      style={{
        opacity: p,
        transform: lift(p, 8),
        borderRadius: 9,
        border: `1px solid ${KAMI.border2}`,
        background: KAMI.parchment,
        padding: 12,
      }}
    >
      <div style={{ color: KAMI.brand, fontFamily: KAMI.serif, fontSize: 28, lineHeight: 1 }}>{value}</div>
      <div style={{ marginTop: 7, color: KAMI.stone, fontSize: 11, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
};

const ApiScene = ({ duration }: { duration: number }) => {
  const frame = useCurrentFrame();
  return (
    <Page opacity={fadeOut(frame, duration)} label="Operate">
      <ProductShell
        frame={frame}
        activeTab="Schedules"
        title="Operate without chat"
        subtitle="Trigger employees through API, schedules, and connected channels"
      >
        <div
          style={{
            height: "100%",
            display: "grid",
            gridTemplateColumns: "390px minmax(0, 1fr) 340px",
            gap: 14,
            minHeight: 0,
          }}
        >
          <Panel frame={frame} delay={12} title="Schedules" kicker="Automation">
            <div style={{ padding: 15, display: "grid", gap: 11 }}>
              <ScheduleRow
                title="Hourly signup cohort"
                note="Find users registered in the previous hour, draft onboarding follow-up."
                active
                frame={frame}
                delay={24}
              />
              <ScheduleRow
                title="Weekly active users"
                note="Compare DAU and WAU, summarize changes for the team."
                frame={frame}
                delay={40}
              />
              <ScheduleRow
                title="Support digest"
                note="Read open tickets, cluster themes, propose fixes."
                frame={frame}
                delay={56}
              />
              <div
                style={{
                  marginTop: 8,
                  borderRadius: 10,
                  border: `1px solid ${KAMI.brandBorder}`,
                  background: KAMI.brandWash,
                  padding: 13,
                  color: KAMI.brandDeep,
                  fontSize: 12,
                  lineHeight: 1.45,
                }}
              >
                If the worker is offline, queued runs catch up when it reconnects.
              </div>
            </div>
          </Panel>
          <Panel frame={frame} delay={22} title="API request" kicker="POST /v1/tasks">
            <CodePanel frame={frame} />
          </Panel>
          <Panel frame={frame} delay={34} title="Connect" kicker="Channels">
            <div style={{ padding: 15, display: "grid", gap: 12 }}>
              {[
                ["Slack", "Mention @Maya in a channel", "connected"],
                ["Email", "Forward tasks into an inbox", "review"],
                ["Webhook", "Trigger from product events", "live"],
                ["CRM Sync", "Read users, traits, and usage", "live"],
                ["X / Discord", "Share updates and community notes", "manual"],
              ].map(([name, note, status], index) => (
                <ChannelRow
                  key={name}
                  name={name}
                  note={note}
                  status={status}
                  frame={frame}
                  delay={48 + index * 8}
                />
              ))}
            </div>
          </Panel>
        </div>
      </ProductShell>
    </Page>
  );
};

const ScheduleRow = ({
  title,
  note,
  active,
  frame,
  delay,
}: {
  title: string;
  note: string;
  active?: boolean;
  frame: number;
  delay: number;
}) => {
  const p = progress(frame, delay, delay + 34);
  return (
    <div
      style={{
        opacity: p,
        transform: lift(p, 9),
        borderRadius: 10,
        border: `1px solid ${active ? KAMI.brandBorder : KAMI.border2}`,
        background: active ? KAMI.brandWash : KAMI.parchment,
        padding: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: active ? KAMI.brand : KAMI.ink }}>{title}</div>
        <TinyTag tone={active ? "brand" : "neutral"}>{active ? "every hour" : "saved"}</TinyTag>
      </div>
      <div style={{ marginTop: 8, color: KAMI.olive, fontSize: 11, lineHeight: 1.42 }}>{note}</div>
    </div>
  );
};

const CodePanel = ({ frame }: { frame: number }) => {
  const code = [
    "curl https://api.rebyte.ai/v1/tasks \\",
    "  -H 'Authorization: Bearer rb_live_...' \\",
    "  -d '{",
    '    "employee": "maya",',
    '    "skill": "crm-enrichment",',
    '    "input": "research users created in the previous hour",',
    '    "approval": "required_before_external_send"',
    "  }'",
  ];

  return (
    <div style={{ padding: 18, height: "100%", display: "grid", gridTemplateRows: "1fr 136px", gap: 14 }}>
      <div
        style={{
          borderRadius: 10,
          border: `1px solid ${KAMI.border2}`,
          background: KAMI.parchment,
          padding: 18,
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          fontFamily: KAMI.mono,
          fontSize: 14,
          lineHeight: 1.72,
          color: KAMI.charcoal,
          overflow: "hidden",
        }}
      >
        <div>
          {code.map((line, index) => {
            const p = progress(frame, 40 + index * 10, 68 + index * 10);
            return (
              <div
                key={`${line}-${index}`}
                style={{ opacity: p, color: index === 0 ? KAMI.brand : KAMI.charcoal }}
              >
                {line.slice(0, Math.floor(interpolate(p, [0, 1], [0, line.length])))}
              </div>
            );
          })}
        </div>
        <div />
        <div
          style={{
            opacity: progress(frame, 128, 168),
            borderTop: `1px solid ${KAMI.border2}`,
            paddingTop: 14,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
            fontFamily: KAMI.sans,
            lineHeight: 1.2,
          }}
        >
          <ResponseMini label="Task" value="task_8F4 created" />
          <ResponseMini label="Queue" value="temporal: hourly" />
          <ResponseMini label="Policy" value="approval required" />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <ApiMetric label="Latency" value="2.4s" frame={frame} delay={110} />
        <ApiMetric label="Queued runs" value="0" frame={frame} delay={118} />
        <ApiMetric label="Review gates" value="1" frame={frame} delay={126} />
      </div>
    </div>
  );
};

const ResponseMini = ({ label, value }: { label: string; value: string }) => (
  <div
    style={{
      borderRadius: 8,
      border: `1px solid ${KAMI.border2}`,
      background: KAMI.ivory,
      padding: 11,
    }}
  >
    <div
      style={{
        color: KAMI.stone,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
    <div style={{ marginTop: 7, color: KAMI.brandDeep, fontSize: 12, fontWeight: 600 }}>{value}</div>
  </div>
);

const ApiMetric = ({
  label,
  value,
  frame,
  delay,
}: {
  label: string;
  value: string;
  frame: number;
  delay: number;
}) => {
  const p = progress(frame, delay, delay + 34);
  return (
    <div
      style={{
        opacity: p,
        transform: lift(p, 8),
        borderRadius: 10,
        border: `1px solid ${KAMI.border2}`,
        background: KAMI.ivory,
        padding: 13,
      }}
    >
      <div style={{ fontFamily: KAMI.serif, color: KAMI.brand, fontSize: 30, lineHeight: 1 }}>{value}</div>
      <div style={{ color: KAMI.stone, fontSize: 11, marginTop: 7, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
};

const ChannelRow = ({
  name,
  note,
  status,
  frame,
  delay,
}: {
  name: string;
  note: string;
  status: string;
  frame: number;
  delay: number;
}) => {
  const p = progress(frame, delay, delay + 32);
  return (
    <div
      style={{
        opacity: p,
        transform: lift(p, 8),
        display: "grid",
        gridTemplateColumns: "34px 1fr auto",
        gap: 10,
        alignItems: "center",
        borderRadius: 9,
        border: `1px solid ${KAMI.border2}`,
        background: KAMI.parchment,
        padding: 10,
      }}
    >
      <div
        style={{
          width: 34,
          height: 30,
          borderRadius: 7,
          background: name === "Webhook" ? KAMI.brandPale : KAMI.sand,
          border: `1px solid ${name === "Webhook" ? KAMI.brandBorder : KAMI.border2}`,
        }}
      />
      <div>
        <div style={{ color: KAMI.ink, fontWeight: 600, fontSize: 13 }}>{name}</div>
        <div style={{ color: KAMI.stone, fontSize: 11, marginTop: 3 }}>{note}</div>
      </div>
      <TinyTag tone={status === "live" ? "brand" : "neutral"}>{status}</TinyTag>
    </div>
  );
};

const ResultScene = ({ duration }: { duration: number }) => {
  const frame = useCurrentFrame();
  return (
    <Page opacity={fadeOut(frame, duration)} label="Review">
      <ProductShell
        frame={frame}
        activeTab="Tasks"
        title="Review packet"
        subtitle="Every result comes back with evidence, drafts, and approval controls"
      >
        <div
          style={{
            height: "100%",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.16fr) minmax(0, 0.84fr)",
            gap: 14,
            minHeight: 0,
          }}
        >
          <div style={{ display: "grid", gridTemplateRows: "356px 1fr", gap: 14, minHeight: 0 }}>
            <Panel frame={frame} delay={12} title="High-intent accounts" kicker="Evidence table">
              <EvidenceTable frame={frame} />
            </Panel>
            <Panel frame={frame} delay={38} title="Source notes" kicker="Citations">
              <div style={{ padding: 15, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[
                  ["Acme Ops", "Hiring revops, connected Postgres, invited teammates."],
                  ["Northstar AI", "Built internal dashboards, needs role permissions."],
                  ["Fielddesk", "Runs support workflows and imports CSV data weekly."],
                ].map(([name, note], index) => (
                  <SourceNote key={name} name={name} note={note} frame={frame} delay={48 + index * 10} />
                ))}
              </div>
            </Panel>
          </div>
          <div style={{ display: "grid", gridTemplateRows: "1fr 166px", gap: 14, minHeight: 0 }}>
            <Panel frame={frame} delay={24} title="Founder-style draft" kicker="Email">
              <EmailDraft frame={frame} />
            </Panel>
            <Panel frame={frame} delay={54} dense>
              <ReviewActions frame={frame} />
            </Panel>
          </div>
        </div>
      </ProductShell>
    </Page>
  );
};

const EvidenceTable = ({ frame }: { frame: number }) => {
  const rows = [
    ["Acme Ops", "Ops platform", "Team invite + API docs", "Founder email"],
    ["Northstar AI", "Internal tools", "Role permissions page", "Founder email"],
    ["Fielddesk", "Support workflow", "CSV import docs", "Product guide"],
    ["Orbit CRM", "Revenue ops", "CRM sync events", "Case study"],
    ["Mineral Labs", "Data review", "Warehouse connector", "API follow-up"],
  ];

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1.2fr 0.9fr",
          gap: 10,
          padding: "0 10px 10px",
          color: KAMI.stone,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        <div>Account</div>
        <div>Likely use case</div>
        <div>Evidence</div>
        <div>Next action</div>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {rows.map((row, index) => {
          const p = progress(frame, 28 + index * 10, 60 + index * 10);
          return (
            <div
              key={row[0]}
              style={{
                opacity: p,
                transform: lift(p, 8),
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1.2fr 0.9fr",
                gap: 10,
                alignItems: "center",
                minHeight: 42,
                padding: "0 10px",
                borderRadius: 8,
                border: `1px solid ${index < 2 ? KAMI.brandBorder : KAMI.border2}`,
                background: index < 2 ? KAMI.brandWash : KAMI.parchment,
                color: KAMI.charcoal,
                fontSize: 12,
              }}
            >
              {row.map((cell, cellIndex) => (
                <div
                  key={cell}
                  style={{
                    color: cellIndex === 0 && index < 2 ? KAMI.brand : KAMI.charcoal,
                    fontWeight: cellIndex === 0 ? 600 : 400,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {cell}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SourceNote = ({
  name,
  note,
  frame,
  delay,
}: {
  name: string;
  note: string;
  frame: number;
  delay: number;
}) => {
  const p = progress(frame, delay, delay + 34);
  return (
    <div
      style={{
        opacity: p,
        transform: lift(p, 10),
        borderRadius: 10,
        border: `1px solid ${KAMI.border2}`,
        background: KAMI.parchment,
        padding: 13,
        minHeight: 124,
      }}
    >
      <div style={{ color: KAMI.brand, fontSize: 13, fontWeight: 600 }}>{name}</div>
      <div style={{ marginTop: 9, color: KAMI.olive, fontSize: 12, lineHeight: 1.45 }}>{note}</div>
      <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
        <TinyTag tone="sand">crm</TinyTag>
        <TinyTag tone="sand">web</TinyTag>
      </div>
    </div>
  );
};

const EmailDraft = ({ frame }: { frame: number }) => {
  const text =
    "Hi Alex - thanks for trying Rebyte. I noticed your team is building internal ops tools and already connected a database. If anything feels confusing or if you hit a product issue, just reply here and I will take a look. A few links that may help: docs, API guide, and Rebyte Blocks notes on how we build.";
  const typed = text.slice(
    0,
    Math.floor(interpolate(progress(frame, 58, 198), [0, 1], [0, text.length]))
  );

  return (
    <div style={{ padding: 18, height: "100%", display: "grid", gridTemplateRows: "auto 1fr" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12, color: KAMI.stone }}>From</div>
          <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 10 }}>
            <LogoMark size={30} />
            <div style={{ color: KAMI.ink, fontSize: 14, fontWeight: 600 }}>CJ from Rebyte</div>
          </div>
        </div>
        <TinyTag tone="brand">needs approval</TinyTag>
      </div>
      <div
        style={{
          marginTop: 16,
          borderRadius: 10,
          border: `1px solid ${KAMI.border2}`,
          background: KAMI.parchment,
          padding: 17,
          fontSize: 16,
          lineHeight: 1.55,
          color: KAMI.charcoal,
        }}
      >
        {typed}
        <span style={{ color: KAMI.brand }}>|</span>
      </div>
    </div>
  );
};

const ReviewActions = ({ frame }: { frame: number }) => {
  const p = progress(frame, 68, 118);
  return (
    <div style={{ padding: 16, height: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
      {[
        ["Approve", "Send 12 emails"],
        ["Edit", "Open draft packet"],
        ["Export", "Share with team"],
      ].map(([label, note], index) => (
        <div
          key={label}
          style={{
            opacity: p,
            transform: lift(progress(frame, 70 + index * 8, 108 + index * 8), 8),
            borderRadius: 10,
            border: `1px solid ${index === 0 ? KAMI.brandBorder : KAMI.border2}`,
            background: index === 0 ? KAMI.brand : KAMI.parchment,
            color: index === 0 ? KAMI.ivory : KAMI.ink,
            padding: 14,
            display: "grid",
            alignContent: "center",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 15 }}>{label}</div>
          <div style={{ marginTop: 7, fontSize: 11, color: index === 0 ? KAMI.brandPale : KAMI.olive }}>
            {note}
          </div>
        </div>
      ))}
    </div>
  );
};

const OutroScene = ({ duration }: { duration: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enter(frame, fps, 10, 42);
  const tagsP = progress(frame, 42, 92);

  return (
    <Page opacity={fadeOut(frame, duration)} label="rebyte.ai">
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          zIndex: 4,
        }}
      >
        <div style={{ width: 1080, textAlign: "center", opacity: p, transform: lift(p, 24) }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <LogoMark size={118} />
          </div>
          <div
            style={{
              marginTop: 32,
              fontFamily: KAMI.serif,
              fontSize: 82,
              lineHeight: 1.02,
              fontWeight: 500,
              color: KAMI.ink,
            }}
          >
            Build, run, and review work with Rebyte.
          </div>
          <div
            style={{
              margin: "26px auto 0",
              width: 760,
              color: KAMI.charcoal,
              fontSize: 22,
              lineHeight: 1.45,
            }}
          >
            Agent computers configured with your context, connected to your tools, and reachable
            from chat, schedules, or API.
          </div>
          <div
            style={{
              marginTop: 34,
              display: "flex",
              justifyContent: "center",
              gap: 10,
              opacity: tagsP,
              transform: lift(tagsP, 10),
            }}
          >
            <TinyTag tone="brand">app.rebyte.ai</TinyTag>
            <TinyTag tone="brand">api.rebyte.ai/v1</TinyTag>
            <TinyTag tone="brand">Rebyte Blocks</TinyTag>
          </div>
        </div>
      </div>
    </Page>
  );
};

export const UserScenarioTaskAssignment = () => {
  useKamiFonts();

  return (
    <AbsoluteFill style={{ background: KAMI.parchment }}>
      <Sequence from={0} durationInFrames={INTRO}>
        <IntroScene duration={INTRO} />
      </Sequence>
      <Sequence from={INTRO} durationInFrames={CONFIG}>
        <ConfigScene duration={CONFIG} />
      </Sequence>
      <Sequence from={INTRO + CONFIG} durationInFrames={ASSIGN}>
        <AssignScene duration={ASSIGN} />
      </Sequence>
      <Sequence from={INTRO + CONFIG + ASSIGN} durationInFrames={RUN}>
        <RunScene duration={RUN} />
      </Sequence>
      <Sequence from={INTRO + CONFIG + ASSIGN + RUN} durationInFrames={API}>
        <ApiScene duration={API} />
      </Sequence>
      <Sequence from={INTRO + CONFIG + ASSIGN + RUN + API} durationInFrames={RESULT}>
        <ResultScene duration={RESULT} />
      </Sequence>
      <Sequence from={INTRO + CONFIG + ASSIGN + RUN + API + RESULT} durationInFrames={OUTRO}>
        <OutroScene duration={OUTRO} />
      </Sequence>
    </AbsoluteFill>
  );
};
