import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { useReducedMotion } from "../../../../hooks/useReducedMotion";
import {
  buildCircuit,
  type Circuit,
  type Rect,
  type Trace,
} from "./circuitLayout";
import styles from "./HeaderCircuitBoard.module.scss";

interface HeaderCircuitBoardProps {
  containerRef: RefObject<HTMLElement | null>;
  // The portrait area; the round frame inside it is the CPU.
  cpuRef: RefObject<HTMLElement | null>;
  columnRef: RefObject<HTMLElement | null>;
  hireRef: RefObject<HTMLElement | null>;
  cardRef: RefObject<HTMLElement | null>;
}

const SVG_NS = "http://www.w3.org/2000/svg";
const PULSE_LENGTH = 36; // px of lit trace per pulse
const PULSE_SPEED = 520; // px per second
const MAX_PULSES = 24;
const HIT_RADIUS = 70; // how close the pointer must be to a trace
const MOVE_THROTTLE_MS = 70;
const RESPAWN_MS = 280; // per trace, so one trace does not flood
const CPU_COOLDOWN_MS = 800;

// Decorative SVG circuit board behind the main body. The portrait is the CPU, and buses
// wire it to the profile column, Hire me and the skill card. Moving the pointer (or
// touching) sends current along the nearest trace toward its sink; current reaching the
// CPU lights it and flows out along the buses to the components.
// Reduced motion: no moving current; the trace nearest the pointer lights up in place.
// Hidden from assistive technology and never takes clicks.
function HeaderCircuitBoard({
  containerRef,
  cpuRef,
  columnRef,
  hireRef,
  cardRef,
}: HeaderCircuitBoardProps) {
  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [activeTraceId, setActiveTraceId] = useState<string | null>(null);
  const pulseLayerRef = useRef<SVGGElement>(null);
  const cpuRingRef = useRef<SVGCircleElement>(null);
  const reducedMotion = useReducedMotion();
  const glowId = `${useId().replace(/[^a-zA-Z0-9_-]/g, "")}-cpu-glow`;

  // Measure the layout and rebuild the board whenever anything resizes.
  useEffect(() => {
    const container = containerRef.current;
    const cpuArea = cpuRef.current;
    if (!container || !cpuArea) return;

    function measure() {
      if (!container || !cpuArea) return;
      // While the header shrinks on scroll the board is fading out; rebuild once it is
      // back to full size, not on every frame.
      if (container.closest("header")?.hasAttribute("data-shrinking")) return;
      const box = container.getBoundingClientRect();
      const relative = (element: HTMLElement | null): Rect | null => {
        if (!element) return null;
        const r = element.getBoundingClientRect();
        return {
          left: r.left - box.left,
          top: r.top - box.top,
          right: r.right - box.left,
          bottom: r.bottom - box.top,
        };
      };
      const frame = cpuArea.querySelector("img")?.parentElement ?? cpuArea;
      const cpuRect = relative(frame);
      if (!cpuRect) return;
      setCircuit(
        buildCircuit({
          width: box.width,
          height: box.height,
          cpu: {
            x: (cpuRect.left + cpuRect.right) / 2,
            y: (cpuRect.top + cpuRect.bottom) / 2,
            r: (cpuRect.right - cpuRect.left) / 2,
          },
          column: relative(columnRef.current),
          hire: relative(hireRef.current),
          card: relative(cardRef.current),
        }),
      );
    }

    const observer = new ResizeObserver(measure);
    for (const element of [
      container,
      cpuArea,
      columnRef.current,
      hireRef.current,
      cardRef.current,
    ]) {
      if (element) observer.observe(element);
    }
    measure();
    return () => observer.disconnect();
  }, [containerRef, cpuRef, columnRef, hireRef, cardRef]);

  // Pointer-driven current.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !circuit) return;
    const board = circuit;
    const pulseLayer = pulseLayerRef.current;
    const lastSpawn = new Map<string, number>();
    let lastMove = 0;
    let lastCpuFire = 0;
    let activePulses = 0;

    function nearestTrace(x: number, y: number) {
      let best: { trace: Trace; s: number } | null = null;
      let bestDistance = HIT_RADIUS * HIT_RADIUS;
      for (const trace of board.traces) {
        for (const sample of trace.samples) {
          const distance = (sample.x - x) ** 2 + (sample.y - y) ** 2;
          if (distance < bestDistance) {
            bestDistance = distance;
            best = { trace, s: sample.s };
          }
        }
      }
      return best;
    }

    // A pulse is one dash on a copy of the trace. A dash covering [p, p + L] needs
    // stroke-dashoffset = -p, so animating p moves the lit section along the trace.
    function pulse(
      trace: Trace,
      fromP: number,
      toP: number,
      onArrive?: () => void,
    ) {
      if (!pulseLayer || activePulses >= MAX_PULSES) return;
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", trace.d);
      path.setAttribute("class", styles.pulse);
      path.style.strokeDasharray = `${PULSE_LENGTH} ${trace.length + PULSE_LENGTH * 2}`;
      pulseLayer.appendChild(path);
      activePulses++;
      const animation = path.animate(
        [{ strokeDashoffset: -fromP }, { strokeDashoffset: -toP }],
        {
          duration: (Math.abs(fromP - toP) / PULSE_SPEED) * 1000,
          easing: "linear",
        },
      );
      const finish = () => {
        path.remove();
        activePulses--;
      };
      animation.onfinish = () => {
        finish();
        onArrive?.();
      };
      animation.oncancel = finish;
    }

    // Current reached the CPU: flash it and send current out along every bus.
    function fireCpu() {
      const now = performance.now();
      if (now - lastCpuFire < CPU_COOLDOWN_MS) return;
      lastCpuFire = now;
      cpuRingRef.current?.animate(
        [
          { opacity: 0.9, strokeWidth: 4 },
          { opacity: 0, strokeWidth: 1 },
        ],
        { duration: 700, easing: "ease-out" },
      );
      for (const trace of board.traces) {
        if (trace.role === "bus") pulse(trace, -PULSE_LENGTH, trace.length);
      }
    }

    function handleAt(clientX: number, clientY: number) {
      if (!container) return;
      const box = container.getBoundingClientRect();
      const hit = nearestTrace(clientX - box.left, clientY - box.top);
      if (reducedMotion) {
        setActiveTraceId(hit?.trace.id ?? null);
        return;
      }
      if (!hit) return;
      const now = performance.now();
      if (now - (lastSpawn.get(hit.trace.id) ?? 0) < RESPAWN_MS) return;
      lastSpawn.set(hit.trace.id, now);
      // Flow from the pointer's spot toward the sink (the start of the trace).
      pulse(
        hit.trace,
        Math.max(hit.s - PULSE_LENGTH / 2, 0),
        -PULSE_LENGTH,
        hit.trace.sink === "cpu" ? fireCpu : undefined,
      );
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return; // touch and pen use pointerdown
      const now = performance.now();
      if (now - lastMove < MOVE_THROTTLE_MS) return;
      lastMove = now;
      handleAt(event.clientX, event.clientY);
    }

    function handlePointerDown(event: PointerEvent) {
      handleAt(event.clientX, event.clientY);
    }

    function handlePointerLeave() {
      setActiveTraceId(null);
    }

    container.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    container.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });
    container.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointerleave", handlePointerLeave);
      for (const animation of pulseLayer?.getAnimations({ subtree: true }) ??
        []) {
        animation.cancel();
      }
    };
  }, [containerRef, circuit, reducedMotion]);

  return (
    <svg
      className={styles.board}
      viewBox={circuit ? `0 0 ${circuit.width} ${circuit.height}` : undefined}
      aria-hidden="true"
      focusable="false"
    >
      {circuit && (
        <>
          <defs>
            <radialGradient id={glowId}>
              <stop className={styles.glowInner} offset="0" />
              <stop className={styles.glowOuter} offset="1" />
            </radialGradient>
          </defs>
          {/* Soft glow around the CPU. */}
          <circle
            cx={circuit.cpu.x}
            cy={circuit.cpu.y}
            r={circuit.cpu.r * 2.2}
            fill={`url(#${glowId})`}
          />
          <g>
            {circuit.traces.map((trace) => (
              <path
                key={trace.id}
                className={styles.trace}
                d={trace.d}
                data-active={trace.id === activeTraceId ? "" : undefined}
              />
            ))}
          </g>
          <g>
            {circuit.traces.map((trace) =>
              trace.endCap === "via" ? (
                <circle
                  key={trace.id}
                  className={styles.via}
                  cx={trace.end.x}
                  cy={trace.end.y}
                  r={3.5}
                />
              ) : trace.endCap === "pin" ? (
                <rect
                  key={trace.id}
                  className={styles.pin}
                  x={trace.end.x - 3}
                  y={trace.end.y - 3}
                  width={6}
                  height={6}
                  rx={1}
                />
              ) : null,
            )}
          </g>
          <circle
            ref={cpuRingRef}
            className={styles.cpuRing}
            cx={circuit.cpu.x}
            cy={circuit.cpu.y}
            r={circuit.cpu.r + 6}
          />
          <g ref={pulseLayerRef} />
        </>
      )}
    </svg>
  );
}

export default HeaderCircuitBoard;
