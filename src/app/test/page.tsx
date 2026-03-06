'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  hexToHsl, 
  hslToHex, 
  generateComplementary, 
  generateAnalogous, 
  generateTriadic,
  generateSplitComplementary,
  generateMonochromatic,
  generateSquare,
  getAllColorHarmonies,
  generateRecommendedPair,
  areColorsHarmonious,
  type ColorHarmony
} from '@/lib/colorUtils';
import { CheckCircle, XCircle, Play, RefreshCw, Beaker } from 'lucide-react';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

export default function TestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [harmonies, setHarmonies] = useState<ColorHarmony[]>([]);
  const [testColor, setTestColor] = useState('#5135FF');

  useEffect(() => {
    setHarmonies(getAllColorHarmonies(testColor));
  }, [testColor]);

  const runTests = () => {
    setIsRunning(true);
    const testResults: TestResult[] = [];

    // 辅助函数
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const expect = (value: unknown) => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toBe: (expected: any) => {
        if (value !== expected) {
          throw new Error(`Expected ${expected} but got ${value}`);
        }
      },
      toBeCloseTo: (expected: number, precision: number = 0) => {
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
      },
      toBeTrue: () => {
        if (value !== true) {
          throw new Error(`Expected true but got ${value}`);
        }
      }
    });

    const test = (name: string, fn: () => void) => {
      try {
        fn();
        testResults.push({ name, passed: true });
      } catch (error: any) {
        testResults.push({ name, passed: false, error: error.message });
      }
    };

    // 运行所有测试
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
      const result = hslToHex({ h: 0, s: 100, l: 50 });
      expect(result).toBe('#FF0000');
    });

    test('hslToHex and hexToHsl are inverse operations', () => {
      const originalHex = '#5135FF';
      const hsl = hexToHsl(originalHex);
      const convertedBack = hslToHex(hsl);
      expect(hexToHsl(convertedBack).h).toBeCloseTo(hexToHsl(originalHex).h, 0);
    });

    test('generateComplementary returns correct structure', () => {
      const result = generateComplementary('#FF0000');
      expect(result.name).toBe('互补色');
      expect(result.colors).toHaveLength(2);
      expect(result.description).toBeTruthy();
    });

    test('complementary of red is cyan-like', () => {
      const result = generateComplementary('#FF0000');
      const complementaryHsl = hexToHsl(result.colors[1]);
      expect(complementaryHsl.h).toBeGreaterThan(170);
      expect(complementaryHsl.h).toBeLessThan(190);
    });

    test('complementary of blue is yellow-like', () => {
      const result = generateComplementary('#0000FF');
      const complementaryHsl = hexToHsl(result.colors[1]);
      expect(complementaryHsl.h).toBeGreaterThan(50);
      expect(complementaryHsl.h).toBeLessThan(70);
    });

    test('generateAnalogous returns 3 colors', () => {
      const result = generateAnalogous('#FF0000');
      expect(result.colors).toHaveLength(3);
      expect(result.name).toBe('类似色');
    });

    test('analogous colors are within 60 degrees', () => {
      const baseColor = '#FF0000';
      const result = generateAnalogous(baseColor);
      const baseHsl = hexToHsl(baseColor);
      
      result.colors.forEach((color: string) => {
        const hsl = hexToHsl(color);
        const diff = Math.abs(hsl.h - baseHsl.h);
        const normalizedDiff = Math.min(diff, 360 - diff);
        expect(normalizedDiff).toBeLessThanOrEqual(30);
      });
    });

    test('generateTriadic returns 3 colors', () => {
      const result = generateTriadic('#FF0000');
      expect(result.colors).toHaveLength(3);
      expect(result.name).toBe('三色组');
    });

    test('generateSplitComplementary returns 3 colors', () => {
      const result = generateSplitComplementary('#FF0000');
      expect(result.colors).toHaveLength(3);
      expect(result.name).toBe('分裂互补色');
    });

    test('generateMonochromatic returns multiple colors', () => {
      const result = generateMonochromatic('#FF0000');
      expect(result.colors.length).toBeGreaterThan(2);
      expect(result.name).toBe('单色');
    });

    test('monochromatic colors have same hue', () => {
      const baseColor = '#FF0000';
      const result = generateMonochromatic(baseColor);
      const baseHsl = hexToHsl(baseColor);
      
      result.colors.forEach((color: string) => {
        const hsl = hexToHsl(color);
        expect(hsl.h).toBe(baseHsl.h);
      });
    });

    test('generateSquare returns 4 colors', () => {
      const result = generateSquare('#FF0000');
      expect(result.colors).toHaveLength(4);
      expect(result.name).toBe('方形配色');
    });

    test('getAllColorHarmonies returns 7 harmonies', () => {
      const result = getAllColorHarmonies('#FF0000');
      expect(result).toHaveLength(7);
      
      const names = result.map((h: ColorHarmony) => h.name);
      expect(names).toContain('互补色');
      expect(names).toContain('类似色');
      expect(names).toContain('三色组');
      expect(names).toContain('分裂互补色');
      expect(names).toContain('矩形配色');
      expect(names).toContain('单色');
      expect(names).toContain('方形配色');
    });

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
      expect(areColorsHarmonious(result[0], result[1])).toBeTrue();
    });

    test('same color is harmonious', () => {
      expect(areColorsHarmonious('#FF0000', '#FF0000')).toBeTrue();
    });

    test('complementary colors are harmonious', () => {
      expect(areColorsHarmonious('#FF0000', '#00FFFF')).toBeTrue();
    });

    setResults(testResults);
    setIsRunning(false);
  };

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl">
            <Beaker className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground">
            Color Utils Test Suite
          </h1>
          <p className="text-lg text-muted-foreground">
            测试色彩工具库的各项功能
          </p>
        </div>

        {/* Test Controls */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="min-w-[140px]"
              >
                {isRunning ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isRunning ? 'Running...' : 'Run Tests'}
              </Button>
              
              {results.length > 0 && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    {passedCount} passed
                  </span>
                  <span className="flex items-center gap-1 text-red-600">
                    <XCircle className="w-4 h-4" />
                    {failedCount} failed
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm text-muted-foreground">Test Color:</label>
              <input
                type="color"
                value={testColor}
                onChange={(e) => setTestColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-border"
              />
              <span className="text-sm font-mono">{testColor}</span>
            </div>
          </div>
        </Card>

        {/* Test Results */}
        {results.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Test Results</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    result.passed ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20'
                  }`}
                >
                  {result.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${
                      result.passed ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                    }`}>
                      {result.name}
                    </div>
                    {result.error && (
                      <div className="text-xs text-red-600 mt-1">
                        {result.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Color Harmonies Preview */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Color Harmonies Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {harmonies.map((harmony) => (
              <div
                key={harmony.name}
                className="p-4 rounded-xl border border-border bg-muted/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{harmony.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    {harmony.colors.length} colors
                  </span>
                </div>
                <div className="flex gap-2 mb-3">
                  {harmony.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-12 rounded-lg shadow-sm border border-white/20"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{harmony.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Algorithm Documentation */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">色彩算法说明</h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground mb-1">互补色 (Complementary)</h3>
              <p>色轮上相对的两个颜色，相差180度。对比强烈，视觉冲击力强。</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">类似色 (Analogous)</h3>
              <p>色轮上相邻的颜色，相差约30度。和谐统一，适合营造柔和氛围。</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">三色组 (Triadic)</h3>
              <p>色轮上均匀分布的三种颜色，相差120度。丰富而平衡。</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">分裂互补色 (Split Complementary)</h3>
              <p>基色加上互补色两侧的颜色。对比强烈但不刺眼。</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">矩形配色 (Tetradic)</h3>
              <p>两组互补色组成的矩形配色，丰富多样。</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">单色 (Monochromatic)</h3>
              <p>同一色相的不同明度，简洁统一。</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">方形配色 (Square)</h3>
              <p>四种颜色在色轮上均匀分布，相差90度。丰富而均衡。</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
