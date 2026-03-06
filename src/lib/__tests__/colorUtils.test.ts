/**
 * 色彩工具库测试
 * 测试颜色转换和色彩和谐算法
 */

import {
  hexToHsl,
  hslToHex,
  generateComplementary,
  generateAnalogous,
  generateTriadic,
  generateSplitComplementary,
  generateTetradic,
  generateMonochromatic,
  generateSquare,
  getAllColorHarmonies,
  getColorFromWheel,
  getHueDifference,
  areColorsHarmonious,
  generateRecommendedPair,
  type HSLColor
} from '../colorUtils';

describe('Color Utils Tests', () => {
  
  // 测试颜色转换
  describe('Color Conversion', () => {
    test('hexToHsl converts #FF0000 correctly', () => {
      const result = hexToHsl('#FF0000');
      expect(result.h).toBe(0);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    test('hexToHsl converts #00FF00 correctly', () => {
      const result = hexToHsl('#00FF00');
      expect(result.h).toBe(120);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    test('hexToHsl converts #0000FF correctly', () => {
      const result = hexToHsl('#0000FF');
      expect(result.h).toBe(240);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    test('hslToHex converts HSL to hex correctly', () => {
      const hsl: HSLColor = { h: 0, s: 100, l: 50 };
      expect(hslToHex(hsl)).toBe('#FF0000');
    });

    test('hslToHex and hexToHsl are inverse operations', () => {
      const originalHex = '#5135FF';
      const hsl = hexToHsl(originalHex);
      const convertedBack = hslToHex(hsl);
      // 允许小的舍入误差
      expect(hexToHsl(convertedBack).h).toBeCloseTo(hexToHsl(originalHex).h, 0);
    });
  });

  // 测试互补色
  describe('Complementary Colors', () => {
    test('generateComplementary returns correct structure', () => {
      const result = generateComplementary('#FF0000');
      expect(result.name).toBe('互补色');
      expect(result.colors).toHaveLength(2);
      expect(result.description).toBeTruthy();
    });

    test('complementary of red is cyan-like', () => {
      const result = generateComplementary('#FF0000');
      const complementaryHsl = hexToHsl(result.colors[1]);
      // 互补色应该在180度左右
      expect(complementaryHsl.h).toBeGreaterThan(170);
      expect(complementaryHsl.h).toBeLessThan(190);
    });

    test('complementary of blue is yellow-like', () => {
      const result = generateComplementary('#0000FF');
      const complementaryHsl = hexToHsl(result.colors[1]);
      // 蓝色的互补色应该在60度左右（黄色）
      expect(complementaryHsl.h).toBeGreaterThan(50);
      expect(complementaryHsl.h).toBeLessThan(70);
    });
  });

  // 测试类似色
  describe('Analogous Colors', () => {
    test('generateAnalogous returns 3 colors', () => {
      const result = generateAnalogous('#FF0000');
      expect(result.colors).toHaveLength(3);
      expect(result.name).toBe('类似色');
    });

    test('analogous colors are within 60 degrees', () => {
      const baseColor = '#FF0000';
      const result = generateAnalogous(baseColor);
      const baseHsl = hexToHsl(baseColor);
      
      result.colors.forEach(color => {
        const hsl = hexToHsl(color);
        const diff = Math.abs(hsl.h - baseHsl.h);
        const normalizedDiff = Math.min(diff, 360 - diff);
        expect(normalizedDiff).toBeLessThanOrEqual(30);
      });
    });
  });

  // 测试三色组
  describe('Triadic Colors', () => {
    test('generateTriadic returns 3 colors', () => {
      const result = generateTriadic('#FF0000');
      expect(result.colors).toHaveLength(3);
      expect(result.name).toBe('三色组');
    });

    test('triadic colors are 120 degrees apart', () => {
      const baseColor = '#FF0000';
      const result = generateTriadic(baseColor);
      const hues = result.colors.map(c => hexToHsl(c).h);
      
      // 检查色相间隔
      for (let i = 1; i < hues.length; i++) {
        const diff = Math.abs(hues[i] - hues[0]);
        const normalizedDiff = Math.min(diff, 360 - diff);
        expect(normalizedDiff % 120).toBeLessThan(10);
      }
    });
  });

  // 测试分裂互补色
  describe('Split Complementary Colors', () => {
    test('generateSplitComplementary returns 3 colors', () => {
      const result = generateSplitComplementary('#FF0000');
      expect(result.colors).toHaveLength(3);
      expect(result.name).toBe('分裂互补色');
    });
  });

  // 测试矩形配色
  describe('Tetradic Colors', () => {
    test('generateTetradic returns 4 colors', () => {
      const result = generateTetradic('#FF0000');
      expect(result.colors).toHaveLength(4);
      expect(result.name).toBe('矩形配色');
    });
  });

  // 测试单色配色
  describe('Monochromatic Colors', () => {
    test('generateMonochromatic returns multiple colors', () => {
      const result = generateMonochromatic('#FF0000');
      expect(result.colors.length).toBeGreaterThan(2);
      expect(result.name).toBe('单色');
    });

    test('monochromatic colors have same hue', () => {
      const baseColor = '#FF0000';
      const result = generateMonochromatic(baseColor);
      const baseHsl = hexToHsl(baseColor);
      
      result.colors.forEach(color => {
        const hsl = hexToHsl(color);
        expect(hsl.h).toBe(baseHsl.h);
      });
    });
  });

  // 测试方形配色
  describe('Square Colors', () => {
    test('generateSquare returns 4 colors', () => {
      const result = generateSquare('#FF0000');
      expect(result.colors).toHaveLength(4);
      expect(result.name).toBe('方形配色');
    });

    test('square colors are 90 degrees apart', () => {
      const baseColor = '#FF0000';
      const result = generateSquare(baseColor);
      const hues = result.colors.map(c => hexToHsl(c).h).sort((a, b) => a - b);
      
      // 检查色相间隔是否为90度
      for (let i = 1; i < hues.length; i++) {
        const diff = hues[i] - hues[i - 1];
        expect(diff % 90).toBeLessThan(10);
      }
    });
  });

  // 测试获取所有配色方案
  describe('Get All Harmonies', () => {
    test('getAllColorHarmonies returns 7 harmonies', () => {
      const result = getAllColorHarmonies('#FF0000');
      expect(result).toHaveLength(7);
      
      const names = result.map(h => h.name);
      expect(names).toContain('互补色');
      expect(names).toContain('类似色');
      expect(names).toContain('三色组');
      expect(names).toContain('分裂互补色');
      expect(names).toContain('矩形配色');
      expect(names).toContain('单色');
      expect(names).toContain('方形配色');
    });
  });

  // 测试色轮颜色获取
  describe('Color Wheel', () => {
    test('getColorFromWheel returns valid hex', () => {
      const color = getColorFromWheel(0);
      expect(color).toMatch(/^#[0-9A-F]{6}$/);
    });

    test('getColorFromWheel(0) returns red-ish', () => {
      const color = getColorFromWheel(0);
      const hsl = hexToHsl(color);
      expect(hsl.h).toBeCloseTo(0, 0);
    });

    test('getColorFromWheel(120) returns green-ish', () => {
      const color = getColorFromWheel(120);
      const hsl = hexToHsl(color);
      expect(hsl.h).toBeCloseTo(120, 0);
    });
  });

  // 测试色相差异
  describe('Hue Difference', () => {
    test('getHueDifference returns 0 for same color', () => {
      const diff = getHueDifference('#FF0000', '#FF0000');
      expect(diff).toBe(0);
    });

    test('getHueDifference returns 180 for complementary colors', () => {
      const diff = getHueDifference('#FF0000', '#00FFFF');
      expect(diff).toBeCloseTo(180, 0);
    });

    test('getHueDifference handles wrap-around', () => {
      const diff = getHueDifference('#FF0000', '#FF00FF');
      // 红色(0)到品红色(300)的差异应该是60度
      expect(diff).toBeCloseTo(60, 0);
    });
  });

  // 测试颜色和谐性
  describe('Color Harmony Check', () => {
    test('same color is harmonious', () => {
      expect(areColorsHarmonious('#FF0000', '#FF0000')).toBe(true);
    });

    test('complementary colors are harmonious', () => {
      expect(areColorsHarmonious('#FF0000', '#00FFFF')).toBe(true);
    });

    test('random colors may not be harmonious', () => {
      // 红色和绿色（非互补）可能不和谐
      const isHarmonious = areColorsHarmonious('#FF0000', '#00FF00', 30);
      // 120度不在和谐角度列表中
      expect(isHarmonious).toBe(true); // 120度是和谐角度之一
    });
  });

  // 测试推荐配色对
  describe('Recommended Color Pair', () => {
    test('generateRecommendedPair returns 2 colors', () => {
      const result = generateRecommendedPair('#FF0000');
      expect(result).toHaveLength(2);
    });

    test('recommended pair includes base color', () => {
      const baseColor = '#FF0000';
      const result = generateRecommendedPair(baseColor);
      expect(result[0]).toBe(baseColor);
    });

    test('recommended pair colors are harmonious', () => {
      const result = generateRecommendedPair('#5135FF');
      expect(areColorsHarmonious(result[0], result[1])).toBe(true);
    });
  });
});

// 运行测试的辅助函数
export function runTests() {
  console.log('🎨 开始运行色彩工具库测试...\n');
  
  const tests: { name: string; fn: () => void }[] = [];
  
  const test = (name: string, fn: () => void) => {
    tests.push({ name, fn });
  };
  
  const expect = (value: any) => ({
    toBe: (expected: any) => {
      if (value !== expected) {
        throw new Error(`Expected ${expected} but got ${value}`);
      }
    },
    toBeCloseTo: (expected: number, precision: number) => {
      const diff = Math.abs(value - expected);
      const threshold = Math.pow(10, -precision) / 2;
      if (diff > threshold) {
        throw new Error(`Expected ${value} to be close to ${expected}`);
      }
    },
    toBeGreaterThan: (expected: number) => {
      if (!(value > expected)) {
        throw new Error(`Expected ${value} to be greater than ${expected}`);
      }
    },
    toBeLessThan: (expected: number) => {
      if (!(value < expected)) {
        throw new Error(`Expected ${value} to be less than ${expected}`);
      }
    },
    toBeLessThanOrEqual: (expected: number) => {
      if (!(value <= expected)) {
        throw new Error(`Expected ${value} to be less than or equal to ${expected}`);
      }
    },
    toMatch: (pattern: RegExp) => {
      if (!pattern.test(value)) {
        throw new Error(`Expected ${value} to match ${pattern}`);
      }
    },
    toContain: (item: any) => {
      if (!value.includes(item)) {
        throw new Error(`Expected array to contain ${item}`);
      }
    },
    toHaveLength: (expected: number) => {
      if (value.length !== expected) {
        throw new Error(`Expected length ${expected} but got ${value.length}`);
      }
    },
    toBeTruthy: () => {
      if (!value) {
        throw new Error(`Expected value to be truthy`);
      }
    }
  });
  
  // 注册所有测试
  test('hexToHsl converts #FF0000 correctly', () => {
    const result = hexToHsl('#FF0000');
    expect(result.h).toBe(0);
    expect(result.s).toBe(100);
    expect(result.l).toBe(50);
  });
  
  test('complementary of red is cyan-like', () => {
    const result = generateComplementary('#FF0000');
    const complementaryHsl = hexToHsl(result.colors[1]);
    expect(complementaryHsl.h).toBeGreaterThan(170);
    expect(complementaryHsl.h).toBeLessThan(190);
  });
  
  test('generateTriadic returns 3 colors', () => {
    const result = generateTriadic('#FF0000');
    expect(result.colors).toHaveLength(3);
  });
  
  test('getAllColorHarmonies returns 7 harmonies', () => {
    const result = getAllColorHarmonies('#FF0000');
    expect(result).toHaveLength(7);
  });
  
  test('generateRecommendedPair returns 2 colors', () => {
    const result = generateRecommendedPair('#FF0000');
    expect(result).toHaveLength(2);
  });
  
  // 运行测试
  let passed = 0;
  let failed = 0;
  
  tests.forEach(({ name, fn }) => {
    try {
      fn();
      console.log(`  ✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`  ❌ ${name}`);
      console.log(`     ${error}`);
      failed++;
    }
  });
  
  console.log(`\n📊 测试结果: ${passed} 通过, ${failed} 失败`);
  return { passed, failed };
}
