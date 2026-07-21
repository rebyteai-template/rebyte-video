import { Composition } from "remotion";
import {
  UserScenarioTaskAssignment,
  USER_SCENARIO_TASK_ASSIGNMENT_TOTAL_FRAMES,
} from "./UserScenarioTaskAssignment";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="UserScenarioTaskAssignment"
        component={UserScenarioTaskAssignment}
        durationInFrames={USER_SCENARIO_TASK_ASSIGNMENT_TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
