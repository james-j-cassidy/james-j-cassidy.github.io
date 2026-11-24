// WCAG contrast between two colors as the browser resolves them, measured live.

type Rgb = [number, number, number];

// Resolves a CSS color (a custom property, color-mix and so on) to sRGB through a
// probe element, so the reading is exactly what is on screen.
function resolve(color: string, probe: HTMLElement): Rgb {
  probe.style.color = color;
  const computed = getComputedStyle(probe).color;
  const match = computed.match(/[\d.]+/g);
  if (!match || match.length < 3) return [0, 0, 0];
  // rgb() is 0–255; color(srgb …), used for mixed colors, is 0–1.
  const scale = computed.startsWith("color(") ? 255 : 1;
  return [
    Number(match[0]) * scale,
    Number(match[1]) * scale,
    Number(match[2]) * scale,
  ];
}

function luminance([r, g, b]: Rgb): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

// Ratio of each foreground token against the page background, as currently themed.
export function measureContrast(
  pairs: Record<string, string>,
  background: string,
): Record<string, number> {
  const probe = document.createElement("span");
  probe.style.display = "none";
  document.body.append(probe);
  const back = resolve(background, probe);
  const result: Record<string, number> = {};
  for (const [key, color] of Object.entries(pairs)) {
    result[key] = contrastRatio(resolve(color, probe), back);
  }
  probe.remove();
  return result;
}
