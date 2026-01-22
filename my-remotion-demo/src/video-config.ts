// Video Blueprint - RebyteIntro
// This file defines the structure, timing, and assets for the video

export const videoConfig = {
  id: "RebyteIntro",
  fps: 30,
  width: 1280,
  height: 720,

  sections: [
    {
      id: "01-intro",
      name: "The Problem",
      script: "Previously, only programmers could code. Everyone else had to use predefined software or, if you really needed customized software, ask a programmer for help.",
      frames: 294,
      duration: 9.8,
      start: 0,
      audio: "sections/01-intro/audio.mp3",
      assets: [],
    },
    {
      id: "02-change",
      name: "Code Agents Changed Everything",
      script: "Everything changed with code agents. Initially, it sounds like it's for programmers, but it's actually for everyone.",
      frames: 201,
      duration: 6.7,
      start: 294,
      audio: "sections/02-change/audio.mp3",
      assets: [],
    },
    {
      id: "03-rebyte",
      name: "Rebyte Mission",
      script: "Rebyte was born to bridge the gap. We took those state-of-the-art code agents and run them in the cloud, equipped those agents with highly specialized skills. Those code agents actually become generic problem solvers for every task.",
      frames: 437,
      duration: 14.6,
      start: 495,
      audio: "sections/03-rebyte/audio.mp3",
      assets: [],
    },
    {
      id: "04-survey-intro",
      name: "Survey Example Intro",
      script: "Let me show you. Say your marketing team needs a survey to understand how your customers use your product.",
      frames: 200,
      duration: 6.7,
      start: 932,
      audio: "sections/04-survey-intro/audio.mp3",
      assets: [],
    },
    {
      id: "05-old-way",
      name: "The Old Way",
      script: "The old way? Search Google, compare tools like Typeform or SurveyMonkey, sign up, learn the interface, pay monthly fees.",
      frames: 219,
      duration: 7.3,
      start: 1132,
      audio: "sections/05-old-way/audio.mp3",
      assets: [],
    },
    {
      id: "06-new-way",
      name: "The New Way",
      script: "The new way? Just combine a code agent with a skill that knows how to build world-class interactive forms, then tell the agent what you like, then wait for the magic to happen. The code agent will actually do research, build, deploy, and leverage the most expertise—and you get exactly what you needed. If it's not, ask the code agent to fix it.",
      frames: 614,
      duration: 20.5,
      start: 1351,
      audio: "sections/06-new-way/audio.mp3",
      assets: [
        "sections/06-new-way/assets/rebyte-form-task.png",
        "sections/06-new-way/assets/form-step0-intro.png",
        "sections/06-new-way/assets/form-step1-coverage.png",
        "sections/06-new-way/assets/form-step2-property.png",
        "sections/06-new-way/assets/form-step3-deductible.png",
        "sections/06-new-way/assets/form-step4-contact.png",
      ],
    },
    {
      id: "07-spreadsheet",
      name: "Spreadsheet Builder",
      script: "Say you need a spreadsheet to track your project timeline. Instead of building it manually, combine a code agent with the spreadsheet skill. The agent will write the necessary code, create the spreadsheet structure, and even fill in sample data for you. Done in seconds.",
      frames: 503,
      duration: 16.75,
      start: 1965,
      audio: "sections/07-spreadsheet/audio.mp3",
      assets: [
        "sections/07-spreadsheet/assets/rebyte-task-full.png",
        "sections/07-spreadsheet/assets/spreadsheet-result.png",
      ],
    },
    {
      id: "08-coding",
      name: "Back to Coding",
      script: "Back to coding. On your local machine, running multiple agents means complex setups—worktrees, separate environments—just to avoid conflicts. The new way? It's all in the cloud. Each task runs in complete isolation. Develop features, run unit tests, start servers—all independently.",
      frames: 516,
      duration: 17.2,
      start: 2468,
      audio: "sections/08-coding/audio.mp3",
      assets: [],
    },
    {
      id: "09-outro",
      name: "Outro",
      script: "These are just the beginning. Unleash your imagination with Rebyte, and unleash the full potential of code agents.",
      frames: 214,
      duration: 7.1,
      start: 2984,
      audio: "sections/09-outro/audio.mp3",
      assets: [],
    },
    {
      id: "10-tagline",
      name: "Tagline",
      script: "Rebyte. Vibe working with skilled code agents.",
      frames: 87,
      duration: 2.9,
      start: 3198,
      audio: "sections/10-tagline/audio.mp3",
      assets: [],
    },
  ],

  // Computed values
  get totalFrames() {
    return this.sections.reduce((sum, s) => sum + s.frames, 0);
  },

  get totalDuration() {
    return this.sections.reduce((sum, s) => sum + s.duration, 0);
  },
};

// Helper to get section by id
export const getSection = (id: string) =>
  videoConfig.sections.find(s => s.id === id);

// Helper to get section timing for Remotion
export const getSectionTiming = (id: string) => {
  const section = getSection(id);
  if (!section) throw new Error(`Section ${id} not found`);
  return { start: section.start, duration: section.frames };
};
