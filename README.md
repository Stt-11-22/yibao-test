# Gradient Background Generator

A powerful Next.js application for creating stunning SVG gradient backgrounds with real-time preview and customizable color palettes.

## Features

- **Real-time Preview**: See your gradient backgrounds update instantly as you modify colors
- **Interactive Color Wheel**: Visual color selection with dual-color picker on a color wheel
- **Smart Color Recommendation**: AI-powered color harmony suggestions based on color theory
- **Dual Selection Modes**:
  - **Free Selection Mode**: Manually pick two colors on the color wheel
  - **Recommendation Mode**: System recommends optimal color combinations using color harmony algorithms
- **Custom Color Palettes**: Add up to 8 colors to create unique gradients
- **Preset Templates**: Choose from professionally designed color combinations
- **API Integration**: Generate gradients programmatically via REST API
- **SVG Export**: Download your creations as high-quality SVG files
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Color Theory Algorithms

The application implements professional color theory algorithms for color harmony:

### Available Color Harmonies

| Harmony | Description | Angle |
|---------|-------------|-------|
| **Complementary** | Colors opposite on the color wheel | 180° |
| **Analogous** | Adjacent colors on the color wheel | ±30° |
| **Triadic** | Three colors evenly spaced | 120° |
| **Split Complementary** | Base color + two adjacent to its complement | 150°, 210° |
| **Tetradic** | Two complementary color pairs | 60°, 180°, 240° |
| **Monochromatic** | Same hue with varying lightness | 0° |
| **Square** | Four colors evenly spaced | 90° |

### Color Space

The application uses **HSL color space** (Hue, Saturation, Lightness) for intuitive color manipulation:
- **Hue**: 0-360 degrees representing the color spectrum
- **Saturation**: 0-100% representing color intensity
- **Lightness**: 0-100% representing brightness

## Getting Started

Read the documentation at https://opennext.js.org/cloudflare.

## Develop

Run the Next.js development server:

```bash
npm run dev
# or similar package manager command
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Testing

Run the test suite to verify color algorithm functionality:

```bash
# Start the development server first
npm run dev

# Then visit the test page
open http://localhost:3000/test
```

The test page includes:
- Automated unit tests for color conversion functions
- Visual preview of all color harmony algorithms
- Interactive color testing tools

## Preview

Preview the application locally on the Cloudflare runtime:

```bash
npm run preview
# or similar package manager command
```

## Deploy

Deploy the application to Cloudflare:

```bash
npm run deploy
# or similar package manager command
```

## Custom Domain

The deployed application is available at:

**gbg.nuclearrockstone.xyz**

Configure your DNS and Cloudflare settings accordingly (add the appropriate CNAME/A records and route the domain to your Cloudflare deployment).

## API Usage

Generate gradients programmatically using the REST API:

```
GET https://gbg.nuclearrockstone.xyz/api?colors=hex_FF0000&colors=hex_00FF00&width=800&height=600
```

### Parameters:
- `colors`: Hex colors with `hex_` prefix (e.g., `hex_FF0000` for red)
- `width`: Image width in pixels (100-2000)
- `height`: Image height in pixels (100-2000)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── route.ts          # API endpoint for SVG generation
│   ├── test/
│   │   └── page.tsx          # Test page for color algorithms
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Main application page
├── components/
│   ├── ui/                   # UI components (Button, Card, Input)
│   └── ColorWheel.tsx        # Interactive color wheel component
├── hooks/
│   └── useGradientGenerator.tsx
├── lib/
│   ├── services/
│   │   └── gradientGenerator.ts
│   ├── colorUtils.ts         # Color theory algorithms
│   ├── constants.ts
│   └── utils.ts
```

## Color Wheel Component

The `ColorWheel` component provides an intuitive interface for color selection:

### Features
- **Visual Color Wheel**: Interactive HSL color wheel for precise hue selection
- **Dual Handle System**: Two draggable handles for primary and secondary colors
- **Real-time Preview**: Instant gradient preview of selected colors
- **Mode Switching**: Toggle between free selection and recommendation modes
- **Touch Support**: Works with mouse and touch devices

### Usage

```tsx
import { ColorWheel } from '@/components/ColorWheel';

function MyComponent() {
  const [colors, setColors] = useState(['#5135FF', '#FF5828']);
  
  return (
    <ColorWheel 
      colors={colors} 
      onColorsChange={setColors}
    />
  );
}
```

## Color Utility Functions

The `colorUtils.ts` module provides comprehensive color manipulation functions:

```typescript
// Color conversion
hexToHsl(hex: string): HSLColor
hslToHex(hsl: HSLColor): string

// Color harmony generation
generateComplementary(baseColor: string): ColorHarmony
generateAnalogous(baseColor: string): ColorHarmony
generateTriadic(baseColor: string): ColorHarmony
generateSplitComplementary(baseColor: string): ColorHarmony
generateTetradic(baseColor: string): ColorHarmony
generateMonochromatic(baseColor: string): ColorHarmony
generateSquare(baseColor: string): ColorHarmony

// Utility functions
getAllColorHarmonies(baseColor: string): ColorHarmony[]
generateRecommendedPair(baseColor: string): string[]
areColorsHarmonious(color1: string, color2: string): boolean
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Color Theory References

- [Color Wheel Theory](https://en.wikipedia.org/wiki/Color_wheel)
- [HSL and HSV Color Spaces](https://en.wikipedia.org/wiki/HSL_and_HSV)
- [Color Harmony](https://en.wikipedia.org/wiki/Harmony_(color))
