import { useEffect, useRef, useState } from "react";
import {
  ARCHITECTURE_MAGIC,
  type MagicScenario,
} from "../../../../content/architectureExpertise";

// The simulated server: when each attempt to save answers (ms after the first try) and
// whether it succeeds. A failed attempt is retried after a short, growing wait.
const SERVER: Record<MagicScenario, readonly { at: number; ok: boolean }[]> = {
  slow: [{ at: 1200, ok: true }],
  blip: [
    { at: 400, ok: false },
    { at: 1100, ok: true },
  ],
  down: [
    { at: 400, ok: false },
    { at: 1000, ok: false },
    { at: 1700, ok: false },
  ],
};
const REQUEST_MS = 300; // each retry's own round trip
const BUDGET_MS = 300; // the response time the user should never feel
const SHOWN_TASKS = 3;

export type TaskStatus = "saving" | "saved" | "failed";

export interface DemoTask {
  id: number;
  text: string;
  status: TaskStatus;
}

export interface DemoLogLine {
  id: number;
  level: "info" | "warn" | "error";
  time: string; // "+0.4 s"
  text: string;
}

export interface DemoState {
  tasks: readonly DemoTask[];
  blocking: boolean; // naive: the screen is locked while the server answers
  error: string | null; // naive: the raw error, shown to the user
  log: readonly DemoLogLine[] | "silent" | null; // null: nothing sent yet
  waited: number | null; // how long the user waited, ms
  took: number | null; // how long the server took, ms
}

const INITIAL: DemoState = {
  tasks: [],
  blocking: false,
  error: null,
  log: null,
  waited: null,
  took: null,
};

// Plays the demo: saving a task against the simulated server, either naively (lock the
// screen, wait, show the raw error, tell nobody) or with the UX magic (show it at once,
// retry quietly, tell the user plainly only when it truly failed, and log everything
// for the team).
export function useMagicDemo(magic: boolean, scenario: MagicScenario) {
  const { tasks: taskNames, naiveErrors, log: logText } = ARCHITECTURE_MAGIC;
  const timers = useRef<number[]>([]);
  const nextTask = useRef(0);
  const nextId = useRef(0);
  const [state, setState] = useState<DemoState>(INITIAL);

  function clear() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }

  useEffect(() => clear, []);

  function reset() {
    clear();
    nextTask.current = 0;
    setState(INITIAL);
  }

  function at(ms: number, run: () => void) {
    timers.current.push(window.setTimeout(run, ms));
  }

  function line(level: DemoLogLine["level"], ms: number, text: string) {
    nextId.current += 1;
    return {
      id: nextId.current,
      level,
      time: `+${(ms / 1000).toFixed(1)} s`,
      text,
    };
  }

  function upsert(list: readonly DemoTask[], task: DemoTask) {
    const others = list.filter((item) => item.id !== task.id);
    return list.some((item) => item.id === task.id)
      ? list.map((item) => (item.id === task.id ? task : item))
      : [...others, task].slice(-SHOWN_TASKS);
  }

  function addLine(next: DemoLogLine) {
    setState((current) => ({
      ...current,
      log: [
        ...(current.log === null || current.log === "silent"
          ? []
          : current.log),
        next,
      ].slice(-4),
    }));
  }

  // Saves the next task, or tries a failed one again.
  function save(retry?: DemoTask) {
    // Naive locks the screen until its one save ends; saves with the magic run side
    // by side, each on its own timers.
    if (state.blocking) return;
    const plan = SERVER[scenario];
    let id = retry?.id;
    let text = retry?.text;
    if (!id || !text) {
      nextId.current += 1;
      id = nextId.current;
      text = taskNames[nextTask.current % taskNames.length];
      nextTask.current += 1;
    }
    const task = { id, text };

    if (!magic) {
      const first = plan[0];
      setState((current) => ({
        ...current,
        blocking: true,
        error: null,
        log: null,
        waited: null,
        took: null,
      }));
      at(first.at, () =>
        setState((current) => ({
          ...current,
          blocking: false,
          tasks: first.ok
            ? upsert(current.tasks, { ...task, status: "saved" })
            : current.tasks,
          error: first.ok
            ? null
            : naiveErrors[scenario === "slow" ? "blip" : scenario],
          log: "silent",
          waited: first.at,
          took: first.at,
        })),
      );
      return;
    }

    setState((current) => ({
      ...current,
      error: null,
      blocking: false,
      tasks: upsert(current.tasks, { ...task, status: "saving" }),
      log: [line("info", 0, logText.started)],
      waited: 0,
      took: null,
    }));
    plan.forEach((attempt, index) => {
      const last = index === plan.length - 1;
      at(attempt.at, () => {
        if (attempt.ok) {
          addLine(
            index > 0
              ? line("info", attempt.at, logText.recovered(index))
              : attempt.at > BUDGET_MS
                ? line("warn", attempt.at, logText.slow(attempt.at))
                : line("info", attempt.at, logText.started),
          );
        } else if (!last) {
          const wait = plan[index + 1].at - attempt.at - REQUEST_MS;
          addLine(line("warn", attempt.at, logText.retry(index + 1, wait)));
        } else {
          addLine(line("error", attempt.at, logText.failed(plan.length)));
        }
        if (attempt.ok || last) {
          setState((current) => ({
            ...current,
            tasks: upsert(current.tasks, {
              ...task,
              status: attempt.ok ? "saved" : "failed",
            }),
            took: attempt.at,
          }));
        }
      });
    });
  }

  return { state, save, reset };
}
