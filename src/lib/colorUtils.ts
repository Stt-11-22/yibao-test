/**
 * 色彩工具库 - 提供颜色转换和色彩和谐算法
 * 基于HSL色彩模型和色彩理论
 */

export interface HSLColor {
  h: number; // 色相: 0-360
  s: number; // 饱和度: 0-100
  l: number; // 亮度: 0-100
}

export interface ColorHarmony {
  name: string;
  colors: string[];
  description: string;
}

/**
 * 将Hex颜色转换为HSL
 */
export function hexToHsl(hex: string): HSLColor {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * 将HSL颜色转换为Hex
 */
export function hslToHex(hsl: HSLColor): string {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * 规范化色相值到0-360范围
 */
function normalizeHue(hue: number): number {
  while (hue < 0) hue += 360;
  while (hue >= 360) hue -= 360;
  return hue;
}

/**
 * 生成互补色配色方案
 * 互补色在色轮上相对 (相差180度)
 */
export function generateComplementary(baseColor: string): ColorHarmony {
  const hsl = hexToHsl(baseColor);
  const complementaryHsl = { ...hsl, h: normalizeHue(hsl.h + 180) };

  return {
    name: '互补色',
    colors: [baseColor, hslToHex(complementaryHsl)],
    description: '色轮上相对的两个颜色，对比强烈，视觉冲击力强'
  };
}

/**
 * 生成类似色配色方案
 * 类似色在色轮上相邻 (相差30-60度)
 */
export function generateAnalogous(baseColor: string): ColorHarmony {
  const hsl = hexToHsl(baseColor);
  const color1 = { ...hsl, h: normalizeHue(hsl.h - 30) };
  const color2 = { ...hsl, h: normalizeHue(hsl.h + 30) };

  return {
    name: '类似色',
    colors: [hslToHex(color1), baseColor, hslToHex(color2)],
    description: '色轮上相邻的颜色，和谐统一，适合营造柔和氛围'
  };
}

/**
 * 生成三色配色方案
 * 三色在色轮上均匀分布 (相差120度)
 */
export function generateTriadic(baseColor: string): ColorHarmony {
  const hsl = hexToHsl(baseColor);
  const color1 = { ...hsl, h: normalizeHue(hsl.h + 120) };
  const color2 = { ...hsl, h: normalizeHue(hsl.h + 240) };

  return {
    name: '三色组',
    colors: [baseColor, hslToHex(color1), hslToHex(color2)],
    description: '色轮上均匀分布的三种颜色，丰富而平衡'
  };
}

/**
 * 生成分裂互补色配色方案
 * 基色 + 互补色两侧的颜色
 */
export function generateSplitComplementary(baseColor: string): ColorHarmony {
  const hsl = hexToHsl(baseColor);
  const color1 = { ...hsl, h: normalizeHue(hsl.h + 150) };
  const color2 = { ...hsl, h: normalizeHue(hsl.h + 210) };

  return {
    name: '分裂互补色',
    colors: [baseColor, hslToHex(color1), hslToHex(color2)],
    description: '基色加上互补色两侧的颜色，对比强烈但不刺眼'
  };
}

/**
 * 生成矩形配色方案 (四色)
 * 两组互补色组成
 */
export function generateTetradic(baseColor: string): ColorHarmony {
  const hsl = hexToHsl(baseColor);
  const color1 = { ...hsl, h: normalizeHue(hsl.h + 60) };
  const color2 = { ...hsl, h: normalizeHue(hsl.h + 180) };
  const color3 = { ...hsl, h: normalizeHue(hsl.h + 240) };

  return {
    name: '矩形配色',
    colors: [baseColor, hslToHex(color1), hslToHex(color2), hslToHex(color3)],
    description: '两组互补色组成的矩形配色，丰富多样'
  };
}

/**
 * 生成单色配色方案
 * 同一色相的不同明度和饱和度
 */
export function generateMonochromatic(baseColor: string): ColorHarmony {
  const hsl = hexToHsl(baseColor);

  const colors = [
    { ...hsl, l: Math.max(20, hsl.l - 30) },
    { ...hsl, l: Math.max(40, hsl.l - 15) },
    hsl,
    { ...hsl, l: Math.min(80, hsl.l + 15) },
    { ...hsl, l: Math.min(95, hsl.l + 30) }
  ];

  return {
    name: '单色',
    colors: colors.map(hslToHex),
    description: '同一色相的不同明度，简洁统一'
  };
}

/**
 * 生成方形配色方案
 * 四种颜色在色轮上均匀分布 (相差90度)
 */
export function generateSquare(baseColor: string): ColorHarmony {
  const hsl = hexToHsl(baseColor);
  const color1 = { ...hsl, h: normalizeHue(hsl.h + 90) };
  const color2 = { ...hsl, h: normalizeHue(hsl.h + 180) };
  const color3 = { ...hsl, h: normalizeHue(hsl.h + 270) };

  return {
    name: '方形配色',
    colors: [baseColor, hslToHex(color1), hslToHex(color2), hslToHex(color3)],
    description: '四种颜色在色轮上均匀分布，丰富而均衡'
  };
}

/**
 * 获取所有配色方案
 */
export function getAllColorHarmonies(baseColor: string): ColorHarmony[] {
  return [
    generateComplementary(baseColor),
    generateAnalogous(baseColor),
    generateTriadic(baseColor),
    generateSplitComplementary(baseColor),
    generateTetradic(baseColor),
    generateMonochromatic(baseColor),
    generateSquare(baseColor)
  ];
}

/**
 * 根据色轮位置计算颜色
 * @param angle 角度 (0-360)
 * @param saturation 饱和度 (0-100)
 * @param lightness 亮度 (0-100)
 */
export function getColorFromWheel(
  angle: number,
  saturation: number = 85,
  lightness: number = 50
): string {
  const hsl: HSLColor = {
    h: normalizeHue(angle),
    s: saturation,
    l: lightness
  };
  return hslToHex(hsl);
}

/**
 * 计算两个颜色在色轮上的角度差
 */
export function getHueDifference(color1: string, color2: string): number {
  const hsl1 = hexToHsl(color1);
  const hsl2 = hexToHsl(color2);
  const diff = Math.abs(hsl1.h - hsl2.h);
  return Math.min(diff, 360 - diff);
}

/**
 * 判断两个颜色是否和谐 (基于色彩理论)
 * @param threshold 角度阈值，默认30度
 */
export function areColorsHarmonious(
  color1: string,
  color2: string,
  threshold: number = 30
): boolean {
  const diff = getHueDifference(color1, color2);
  // 和谐的角度: 0(同色), 30(类似), 60(相邻), 90, 120(三色), 150, 180(互补)
  const harmoniousAngles = [0, 30, 60, 90, 120, 150, 180];
  return harmoniousAngles.some(angle => Math.abs(diff - angle) <= threshold);
}

/**
 * 生成推荐的双色组合
 * 基于色彩和谐理论，为基色推荐最佳搭配色
 */
export function generateRecommendedPair(baseColor: string): string[] {
  const harmonies = getAllColorHarmonies(baseColor);

  // 优先推荐互补色和分裂互补色，它们通常产生最好的视觉效果
  const complementary = harmonies.find(h => h.name === '互补色');
  const splitComp = harmonies.find(h => h.name === '分裂互补色');
  const analogous = harmonies.find(h => h.name === '类似色');

  if (complementary) {
    return complementary.colors.slice(0, 2);
  }

  if (splitComp) {
    return [splitComp.colors[0], splitComp.colors[1]];
  }

  if (analogous) {
    return [analogous.colors[0], analogous.colors[2]];
  }

  return [baseColor, generateComplementary(baseColor).colors[1]];
}
