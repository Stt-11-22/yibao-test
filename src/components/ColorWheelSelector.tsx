'use client';

import React, { useState, useMemo } from 'react';
import { CirclePicker } from 'react-color';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ColorWheelSelectorProps {
  colors: string[];
  onColorsChange: (colors: string[]) => void;
}

export function ColorWheelSelector({ colors, onColorsChange }: ColorWheelSelectorProps) {
  const [mode, setMode] = useState<'free' | 'recommended'>('free');
  const [primaryColor, setPrimaryColor] = useState(colors[0] || '#5135FF');

  // 色彩推荐算法
  const recommendedColors = useMemo(() => {
    if (mode !== 'recommended') return colors;
    
    // 将十六进制颜色转换为HSL
    const hexToHsl = (hex: string): [number, number, number] => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return [0, 0, 0];
      
      let r = parseInt(result[1], 16) / 255;
      let g = parseInt(result[2], 16) / 255;
      let b = parseInt(result[3], 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      
      return [h * 360, s * 100, l * 100];
    };

    // 将HSL转换为十六进制
    const hslToHex = (h: number, s: number, l: number): string => {
      s /= 100;
      l /= 100;
      
      const k = (n: number) => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) => {
        const hue = k(n);
        const color = l - a * Math.max(-1, Math.min(hue - 3, Math.min(9 - hue, 1)));
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      
      return `#${f(0)}${f(8)}${f(4)}`;
    };

    const [h, s, l] = hexToHsl(primaryColor);
    
    // 生成互补色
    const complementaryHue = (h + 180) % 360;
    const complementaryColor = hslToHex(complementaryHue, s, l);
    
    // 生成类似色
    const analogousHue1 = (h + 30) % 360;
    const analogousHue2 = (h - 30) % 360;
    const analogousColor1 = hslToHex(analogousHue1, s, l);
    const analogousColor2 = hslToHex(analogousHue2, s, l);
    
    // 生成三元色
    const triadicHue1 = (h + 120) % 360;
    const triadicHue2 = (h + 240) % 360;
    const triadicColor1 = hslToHex(triadicHue1, s, l);
    const triadicColor2 = hslToHex(triadicHue2, s, l);
    
    // 生成分裂互补色
    const splitComplementaryHue1 = (h + 150) % 360;
    const splitComplementaryHue2 = (h + 210) % 360;
    const splitComplementaryColor1 = hslToHex(splitComplementaryHue1, s, l);
    const splitComplementaryColor2 = hslToHex(splitComplementaryHue2, s, l);
    
    // 生成四元色
    const tetradicHue1 = (h + 90) % 360;
    const tetradicHue2 = (h + 180) % 360;
    const tetradicHue3 = (h + 270) % 360;
    const tetradicColor1 = hslToHex(tetradicHue1, s, l);
    const tetradicColor2 = hslToHex(tetradicHue2, s, l);
    const tetradicColor3 = hslToHex(tetradicHue3, s, l);
    
    // 选择最佳的两种颜色组合
    // 这里简单返回互补色和类似色的组合
    return [primaryColor, complementaryColor, analogousColor1];
  }, [mode, primaryColor, colors]);

  const handleColorChange = (color: any) => {
    if (mode === 'free') {
      // 自由模式下，允许选择多个颜色
      const newColor = color.hex;
      if (!colors.includes(newColor) && colors.length < 8) {
        onColorsChange([...colors, newColor]);
      }
    } else {
      // 推荐模式下，只需要选择主颜色
      setPrimaryColor(color.hex);
      onColorsChange(recommendedColors);
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    if (mode === 'free') {
      const newColors = colors.filter(color => color !== colorToRemove);
      onColorsChange(newColors);
    }
  };

  return (
    <div className="space-y-6">
      {/* 模式选择 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Button
            variant={mode === 'free' ? 'default' : 'outline'}
            onClick={() => setMode('free')}
            className={cn(
              mode === 'free' 
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent'
            )}
          >
            自由选择
          </Button>
          <Button
            variant={mode === 'recommended' ? 'default' : 'outline'}
            onClick={() => setMode('recommended')}
            className={cn(
              mode === 'recommended' 
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent'
            )}
          >
            推荐选择
          </Button>
        </div>
        <span className="text-xs font-mono bg-muted px-2 py-1 rounded-md text-muted-foreground">
          {colors.length}/8
        </span>
      </div>

      {/* 色轮选择器 */}
      <div className="flex justify-center py-4">
        <CirclePicker
          color={primaryColor}
          onChange={handleColorChange}
          width="100%"
          height={200}
          circleSize={24}
          circleSpacing={10}
        />
      </div>

      {/* 已选颜色 */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {(mode === 'recommended' ? recommendedColors : colors).map((color, index) => (
          <div key={index} className="flex items-center gap-3 group">
            <div className="relative flex-shrink-0">
              <div
                className="w-12 h-12 rounded-xl border-2 hover:border-primary transition-colors cursor-pointer"
                style={{ backgroundColor: color }}
              />
            </div>
            <div className="font-mono text-sm tracking-wider uppercase">
              {color.toUpperCase()}
            </div>
            {mode === 'free' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveColor(color)}
                disabled={colors.length <= 1}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* 模式说明 */}
      <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
        {mode === 'free' ? (
          <p>自由选择模式：点击色轮上的颜色来添加到渐变中，最多可添加8种颜色。</p>
        ) : (
          <p>推荐选择模式：选择一个主颜色，系统会自动生成最佳的颜色组合。</p>
        )}
      </div>
    </div>
  );
}
