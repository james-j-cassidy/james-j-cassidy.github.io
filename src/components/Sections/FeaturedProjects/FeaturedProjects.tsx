import { useState } from "react";
import {
  FEATURED_PROJECTS_LABELS,
  PROJECTS,
  type ProjectId,
} from "../../../content/featuredProjects";
import { useDeepLink, type PartGoTo } from "../../../hooks/useDeepLink";
import { toSectionStart } from "../../../state/navigation";
import Story from "../Story/Story";
import Prologue from "../Prologue/Prologue";
import SubSections from "../SubSections/SubSections";
import SubTabs, { type SubTab } from "../SubSections/SubTabs/SubTabs";
import ProjectPart from "./ProjectPart/ProjectPart";

// Each project's sub-tab icon (24 × 24 strokes): Focus Frame's is a frame around a
// target.
const ICONS: Record<ProjectId, string> = {
  "focus-frame":
    "M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 11v2",
};

// The Featured Projects tab: one sub-section per project (the bar shows from the second
// project on), each a full article told as its own scroll story, one chapter per part (ProjectPart). Works like the Professional
// Journey: the bar never moves, and switching projects starts the new article from its
// beginning, without playing through parts.
function FeaturedProjects() {
  const { tabsLabel } = FEATURED_PROJECTS_LABELS;
  const [current, setCurrent] = useState<ProjectId>(PROJECTS[0].id);
  const [direction, setDirection] = useState<-1 | 0 | 1>(0);
  const project =
    PROJECTS.find((candidate) => candidate.id === current) ?? PROJECTS[0];
  const order = PROJECTS.map((candidate) => candidate.id);
  const tabs: readonly SubTab<ProjectId>[] = PROJECTS.map((candidate) => ({
    id: candidate.id,
    label: candidate.name,
    short: candidate.short,
    icon: ICONS[candidate.id],
  }));

  // Deep links: #featured-projects/<project>.<chapter> opens that project at that chapter.
  const [goTo, setGoTo] = useState<PartGoTo>();
  useDeepLink("featured-projects", (key) => {
    const [projectId, chapterId] = key.split(".");
    const target = PROJECTS.find((candidate) => candidate.id === projectId);
    const index =
      target?.chapters.findIndex((chapter) => chapter.id === chapterId) ?? -1;
    if (!target || index < 0) return;
    setDirection(0);
    setCurrent(target.id);
    setGoTo((now) => ({ index, request: (now?.request ?? 0) + 1 }));
  });

  function show(id: ProjectId) {
    if (id === current) return;
    toSectionStart();
    setGoTo(undefined);
    setDirection(order.indexOf(id) > order.indexOf(current) ? 1 : -1);
    setCurrent(id);
  }

  const story = (
    <Story
      key={project.id}
      goTo={goTo}
      prologue={<Prologue section="featured-projects" />}
    >
      {project.chapters.map((chapter, index) => (
        <ProjectPart
          key={chapter.id}
          index={index}
          project={project}
          chapter={chapter}
        />
      ))}
    </Story>
  );

  // One project: its article alone, without a bar of one tab.
  if (PROJECTS.length === 1) return story;

  return (
    <SubSections
      direction={direction}
      bar={
        <SubTabs
          label={tabsLabel}
          tabs={tabs}
          current={current}
          onShow={show}
        />
      }
    >
      {story}
    </SubSections>
  );
}

export default FeaturedProjects;
