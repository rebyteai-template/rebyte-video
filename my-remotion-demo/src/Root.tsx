import { Composition } from "remotion";
import {
  UserScenarioTaskAssignment,
  USER_SCENARIO_TASK_ASSIGNMENT_TOTAL_FRAMES,
} from "./UserScenarioTaskAssignment";
import {
  SitesLifecycle,
  SITES_LIFECYCLE_TOTAL_FRAMES,
} from "./SitesLifecycle";

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
      <Composition
        id="SitesLifecycle"
        component={SitesLifecycle}
        durationInFrames={SITES_LIFECYCLE_TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
