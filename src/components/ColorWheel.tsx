'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { hexToHsl, hslToHex, getAllColorHarmonies, generateRecommendedPair, ColorHarmony } from '@/lib/colorUtils';
import { Button } from '@/components/ui/button';
import { Sparkles, MousePointer2, Wand2, RefreshCw, Check } from 'lucide-react';

interface ColorWheelProps {
  colors: string[];
  onColorsChange: (colors: string[]) => void;
  className?: string;
}

type SelectionMode = 'free' | 'recommend';

export function ColorWheel({ colors, onColorsChange, className }: ColorWheelProps) {
  const [mode, setMode] = useState<SelectionMode>('free');
  const [primaryColor, setPrimaryColor] = useState(colors[0] || '#5135FF');
  const [secondaryColor, setSecondaryColor] = useState(colors[1] || '#FF5828');
  const [harmonies, setHarmonies] = useState<ColorHarmony[]>([]);
  const [selectedHarmony, setSelectedHarmony] = useState<string>('');
  const [isDragging, setIsDragging] = useState<'primary' | 'secondary' | null>(null);
  const wheelRef = useRef<SVGSVGElement>(null);

  const wheelSize = 280;
  const center = wheelSize / 2;
  const wheelRadius = 110;
  const handleRadius = 12;

  // 当基色改变时更新配色方案
  useEffect(() => {
    const newHarmonies = getAllColorHarmonies(primaryColor);
    setHarmonies(newHarmonies);
  }, [primaryColor]);

  // 同步外部颜色变化
  useEffect(() => {
    if (colors.length >= 2) {
      setPrimaryColor(colors[0]);
      setSecondaryColor(colors[1]);
    }
  }, [colors]);

  // 当颜色改变时通知父组件
  useEffect(() => {
    const newColors = [primaryColor, secondaryColor];
    // 保持原有颜色数量，只更新前两个
    const updatedColors = [...colors];
    updatedColors[0] = primaryColor;
    updatedColors[1] = secondaryColor;
    onColorsChange(updatedColors);
  }, [primaryColor, secondaryColor]);

  // 获取颜色在色轮上的位置
  const getColorPosition = useCallback((color: string) => {
    const hsl = hexToHsl(color);
    const angle = (hsl.h - 90) * (Math.PI / 180); // -90度调整使0度在顶部
    return {
      x: center + wheelRadius * Math.cos(angle),
      y: center + wheelRadius * Math.sin(angle)
    };
  }, [center, wheelRadius]);

  // 从鼠标位置获取颜色
  const getColorFromPosition = useCallback((clientX: number, clientY: number) => {
    if (!wheelRef.current) return null;
    
    const rect = wheelRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const dx = x - center;
    const dy = y - center;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360; // 调整角度使0度在顶部
    
    return hslToHex({ h: Math.round(angle), s: 85, l: 50 });
  }, [center]);

  // 处理鼠标/触摸事件
  const handleStart = (type: 'primary' | 'secondary') => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(type);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const color = getColorFromPosition(clientX, clientY);
      if (color) {
        if (isDragging === 'primary') {
          setPrimaryColor(color);
          // 在推荐模式下，自动更新次要颜色
          if (mode === 'recommend') {
            const recommended = generateRecommendedPair(color);
            setSecondaryColor(recommended[1]);
          }
        } else {
          setSecondaryColor(color);
        }
      }
    };

    const handleEnd = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, getColorFromPosition, mode]);

  // 应用配色方案
  const applyHarmony = (harmony: ColorHarmony) => {
    setSelectedHarmony(harmony.name);
    if (harmony.colors.length >= 2) {
      setPrimaryColor(harmony.colors[0]);
      setSecondaryColor(harmony.colors[1]);
    }
  };

  // 生成色轮渐变
  const generateWheelGradient = () => {
    const segments = 36;
    const gradientStops: string[] = [];
    for (let i = 0; i <= segments; i++) {
      const hue = (i / segments) * 360;
      gradientStops.push(`hsl(${hue}, 85%, 50%) ${(i / segments) * 100}%`);
    }
    return `conic-gradient(from 0deg, ${gradientStops.join(', ')})`;
  };

  const primaryPos = getColorPosition(primaryColor);
  const secondaryPos = getColorPosition(secondaryColor);

  return (
    <div className={cn("space-y-6", className)}>
      {/* 模式选择 */}
      <div className="flex gap-2 p-1 bg-muted rounded-xl">
        <button
          onClick={() => setMode('free')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
            mode === 'free'
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MousePointer2 className="w-4 h-4" />
          自由选择
        </button>
        <button
          onClick={() => {
            setMode('recommend');
            // 切换到推荐模式时，重新生成推荐配色
            const recommended = generateRecommendedPair(primaryColor);
            setSecondaryColor(recommended[1]);
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
            mode === 'recommend'
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Wand2 className="w-4 h-4" />
          推荐配色
        </button>
      </div>

      {/* 色轮区域 */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* 色轮背景 */}
          <div
            className="rounded-full"
            style={{
              width: wheelSize,
              height: wheelSize,
              background: generateWheelGradient(),
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
            }}
          >
            {/* 内部白色遮罩创建圆环效果 */}
            <div
              className="absolute rounded-full bg-background"
              style={{
                width: wheelSize - 40,
                height: wheelSize - 40,
                top: 20,
                left: 20
              }}
            />
          </div>

          {/* SVG 交互层 */}
          <svg
            ref={wheelRef}
            className="absolute inset-0 cursor-crosshair"
            width={wheelSize}
            height={wheelSize}
            style={{ touchAction: 'none' }}
          >
            {/* 主色选择器 */}
            <g
              onMouseDown={handleStart('primary')}
              onTouchStart={handleStart('primary')}
              style={{ cursor: isDragging === 'primary' ? 'grabbing' : 'grab' }}
            >
              <circle
                cx={primaryPos.x}
                cy={primaryPos.y}
                r={handleRadius}
                fill={primaryColor}
                stroke="white"
                strokeWidth={3}
                className="drop-shadow-md"
              />
              <circle
                cx={primaryPos.x}
                cy={primaryPos.y}
                r={handleRadius + 4}
                fill="none"
                stroke="rgba(0,0,0,0.2)"
                strokeWidth={1}
              />
            </g>

            {/* 次要色选择器 */}
            <g
              onMouseDown={handleStart('secondary')}
              onTouchStart={handleStart('secondary')}
              style={{ cursor: isDragging === 'secondary' ? 'grabbing' : 'grab' }}
            >
              <circle
                cx={secondaryPos.x}
                cy={secondaryPos.y}
                r={handleRadius}
                fill={secondaryColor}
                stroke="white"
                strokeWidth={3}
                className="drop-shadow-md"
              />
              <circle
                cx={secondaryPos.x}
                cy={secondaryPos.y}
                r={handleRadius + 4}
                fill="none"
                stroke="rgba(0,0,0,0.2)"
                strokeWidth={1}
                strokeDasharray="4 2"
              />
            </g>

            {/* 连接线 */}
            <line
              x1={primaryPos.x}
              y1={primaryPos.y}
              x2={secondaryPos.x}
              y2={secondaryPos.y}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={1}
              strokeDasharray="4 2"
            />
          </svg>

          {/* 角度指示器 */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
            色相角度: {hexToHsl(primaryColor).h}° / {hexToHsl(secondaryColor).h}°
          </div>
        </div>

        {/* 当前选中的颜色展示 */}
        <div className="flex items-center gap-4 w-full max-w-xs">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg border-2 border-white shadow-md"
                style={{ backgroundColor: primaryColor }}
              />
              <span className="text-xs font-mono text-muted-foreground">主色</span>
            </div>
            <div className="text-sm font-mono">{primaryColor}</div>
          </div>
          <div className="text-muted-foreground">+</div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 justify-end">
              <span className="text-xs font-mono text-muted-foreground">辅色</span>
              <div
                className="w-8 h-8 rounded-lg border-2 border-white shadow-md"
                style={{ backgroundColor: secondaryColor }}
              />
            </div>
            <div className="text-sm font-mono text-right">{secondaryColor}</div>
          </div>
        </div>

        {/* 渐变预览 */}
        <div
          className="w-full h-16 rounded-xl shadow-inner"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
          }}
        />
      </div>

      {/* 推荐配色方案 (仅在推荐模式下显示) */}
      {mode === 'recommend' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>基于色彩理论的推荐方案</span>
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {harmonies.map((harmony) => (
              <button
                key={harmony.name}
                onClick={() => applyHarmony(harmony)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                  selectedHarmony === harmony.name
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <div className="flex -space-x-1">
                  {harmony.colors.slice(0, 4).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{harmony.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {harmony.description}
                  </div>
                </div>
                {selectedHarmony === harmony.name && (
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 随机按钮 */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          const randomHue1 = Math.floor(Math.random() * 360);
          const randomHue2 = (randomHue1 + 180 + Math.floor(Math.random() * 60 - 30)) % 360;
          setPrimaryColor(hslToHex({ h: randomHue1, s: 85, l: 50 }));
          setSecondaryColor(hslToHex({ h: randomHue2, s: 85, l: 50 }));
          setSelectedHarmony('');
        }}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        随机颜色
      </Button>
    </div>
  );
}
