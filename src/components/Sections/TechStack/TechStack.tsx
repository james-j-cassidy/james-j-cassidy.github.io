import { useEffect, useRef, useState } from "react";
import {
  STACK,
  TECH_STACK_LABELS,
  type StackKind,
  type StackSort,
} from "../../../content/techStack";
import { toSectionStart } from "../../../state/navigation";
import Story from "../Story/Story";
import Prologue from "../Prologue/Prologue";
import SortSelect from "../SubSections/SortSelect/SortSelect";
import SubSections from "../SubSections/SubSections";
import SubTabs, { type SubTab } from "../SubSections/SubTabs/SubTabs";
import TechPart from "./TechPart/TechPart";
import { sortStack } from "./sortStack";

const ICONS: Record<StackKind, string> = {
  technologies: "M8 6 2 12l6 6M16 6l6 6-6 6M14 4l-4 16",
  tools:
    "M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8V21h3.2l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.6-.6-2.4z",
};

// The order of the sub-sections, for the direction the new one slides in from.
const ORDER: readonly StackKind[] = ["technologies", "tools"];

// The item a #tech-stack/<id> link names, if any.
function itemFromHash() {
  const [section, id] = window.location.hash.slice(1).split("/");
  if (section !== "tech-stack" || !id) return null;
  return STACK.find((item) => item.id === id) ?? null;
}

// The Tech Stack tab: two sub-sections, Technologies and Tools, each its own scroll
// story with one section per item (TechPart), in the order chosen in the bar (most
// experience first by default). Works like the Professional Journey: the bar never
// moves; switching or sorting starts the new story from its beginning, without playing
// through parts.
//
// A link to #tech-stack/<id> (the header's skills link here) opens that item's
// sub-section and goes straight to its section.
function TechStack() {
  const { kindsLabel, kinds, kindsShort, sortLabel, sorts } = TECH_STACK_LABELS;
  const [kind, setKind] = useState<StackKind>("technologies");
  const [direction, setDirection] = useState<-1 | 0 | 1>(0);
  const [sort, setSort] = useState<StackSort>("roles");
  const [goTo, setGoTo] = useState<{ index: number; request: number }>();
  const sortRef = useRef(sort); // the order a deep link is placed in
  useEffect(() => {
    sortRef.current = sort;
  }, [sort]);
  const items = sortStack(kind, sort);
  const tabs: readonly SubTab<StackKind>[] = ORDER.map((id) => ({
    id,
    label: kinds[id],
    short: kindsShort[id],
    icon: ICONS[id],
  }));

  // Deep links: on load, and whenever the URL changes to name an item (not when the
  // visitor sorts or switches afterwards).
  useEffect(() => {
    function follow() {
      const item = itemFromHash();
      if (!item) return;
      setDirection(0);
      setKind(item.kind);
      const index = sortStack(item.kind, sortRef.current).indexOf(item);
      setGoTo((now) => ({ index, request: (now?.request ?? 0) + 1 }));
    }
    follow();
    window.addEventListener("hashchange", follow);
    return () => window.removeEventListener("hashchange", follow);
  }, []);

  function show(next: StackKind) {
    if (next === kind) return;
    toSectionStart();
    setGoTo(undefined);
    setDirection(ORDER.indexOf(next) > ORDER.indexOf(kind) ? 1 : -1);
    setKind(next);
  }

  function reorder(next: StackSort) {
    if (next === sort) return;
    toSectionStart();
    setGoTo(undefined);
    setDirection(0);
    setSort(next);
  }

  return (
    <SubSections
      direction={direction}
      bar={
        <>
          <SubTabs
            label={kindsLabel}
            tabs={tabs}
            current={kind}
            onShow={show}
          />
          <SortSelect
            label={sortLabel}
            sorts={sorts}
            sort={sort}
            onSort={reorder}
          />
        </>
      }
    >
      <Story
        key={`${kind}-${sort}`}
        goTo={goTo}
        prologue={<Prologue section="tech-stack" />}
      >
        {items.map((item, index) => (
          <TechPart key={item.id} index={index} item={item} items={items} />
        ))}
      </Story>
    </SubSections>
  );
}

export default TechStack;
