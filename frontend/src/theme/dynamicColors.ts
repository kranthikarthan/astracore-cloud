/**
 * Dynamic Color Generator for Material You
 * Generates tonal palettes from seed colors in AstraCore style
 */

export interface TonalPalette {
  0: string;
  10: string;
  20: string;
  30: string;
  40: string;
  50: string;
  60: string;
  70: string;
  80: string;
  90: string;
  95: string;
  99: string;
  100: string;
}

export interface MaterialYouColors {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  inversePrimary: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceTint: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  outline: string;
  outlineVariant: string;
  inverseSurface: string;
  inverseOnSurface: string;
  shadow: string;
  scrim: string;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

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
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s, l };
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Generate a tonal palette from a seed color
 * Uses Material You's tonal palette algorithm
 */
export function generateTonalPalette(seedColor: string): TonalPalette {
  const rgb = hexToRgb(seedColor);
  if (!rgb) {
    throw new Error('Invalid hex color');
  }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Material You tonal palette generation
  // This is a simplified version - Material You uses a more complex algorithm
  const tones: number[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];
  const palette: Partial<TonalPalette> = {};

  tones.forEach((tone) => {
    let lightness: number;
    let saturation: number;

    if (tone === 0) {
      lightness = 0;
      saturation = 0;
    } else if (tone === 100) {
      lightness = 1;
      saturation = 0;
    } else if (tone <= 50) {
      // Darker tones: increase saturation, decrease lightness
      saturation = hsl.s + (tone / 50) * (1 - hsl.s) * 0.5;
      lightness = (tone / 50) * hsl.l * 0.5;
    } else {
      // Lighter tones: decrease saturation, increase lightness
      saturation = hsl.s * (1 - (tone - 50) / 50);
      lightness = hsl.l + (1 - hsl.l) * ((tone - 50) / 50);
    }

    const rgbResult = hslToRgb(hsl.h / 360, saturation, lightness);
    palette[tone as keyof TonalPalette] = rgbToHex(rgbResult.r, rgbResult.g, rgbResult.b);
  });

  return palette as TonalPalette;
}

/**
 * Generate Material You colors from seed colors
 */
export function generateMaterialYouColors(
  primarySeed: string,
  secondarySeed: string,
  tertiarySeed: string,
  neutralSeed: string = '#67676A', // Nebula Gray 50
  neutralVariantSeed: string = '#72727D' // Orion Steel 50
): {
  light: MaterialYouColors;
  dark: MaterialYouColors;
} {
  const primaryPalette = generateTonalPalette(primarySeed);
  const secondaryPalette = generateTonalPalette(secondarySeed);
  const tertiaryPalette = generateTonalPalette(tertiarySeed);
  const neutralPalette = generateTonalPalette(neutralSeed);
  const neutralVariantPalette = generateTonalPalette(neutralVariantSeed);

  // Error palette (standard red)
  const errorPalette = generateTonalPalette('#BA1A1A');

  return {
    light: {
      primary: primaryPalette[40],
      onPrimary: primaryPalette[100],
      primaryContainer: primaryPalette[90],
      onPrimaryContainer: primaryPalette[10],
      inversePrimary: primaryPalette[80],
      secondary: secondaryPalette[40],
      onSecondary: secondaryPalette[100],
      secondaryContainer: secondaryPalette[90],
      onSecondaryContainer: secondaryPalette[10],
      tertiary: tertiaryPalette[40],
      onTertiary: tertiaryPalette[100],
      tertiaryContainer: tertiaryPalette[90],
      onTertiaryContainer: tertiaryPalette[10],
      error: errorPalette[40],
      onError: errorPalette[100],
      errorContainer: errorPalette[90],
      onErrorContainer: errorPalette[10],
      background: neutralPalette[99],
      onBackground: neutralPalette[10],
      surface: neutralPalette[99],
      onSurface: neutralPalette[10],
      surfaceVariant: neutralVariantPalette[90],
      onSurfaceVariant: neutralVariantPalette[30],
      surfaceTint: primaryPalette[40],
      surfaceContainerLowest: neutralPalette[100],
      surfaceContainerLow: neutralPalette[95],
      surfaceContainer: neutralPalette[90],
      surfaceContainerHigh: neutralPalette[80],
      surfaceContainerHighest: neutralPalette[70],
      outline: neutralVariantPalette[50],
      outlineVariant: neutralVariantPalette[80],
      inverseSurface: neutralPalette[20],
      inverseOnSurface: neutralPalette[95],
      shadow: 'rgba(0, 0, 0, 0.2)',
      scrim: 'rgba(0, 0, 0, 0.32)',
    },
    dark: {
      primary: primaryPalette[80],
      onPrimary: primaryPalette[20],
      primaryContainer: primaryPalette[30],
      onPrimaryContainer: primaryPalette[90],
      inversePrimary: primaryPalette[40],
      secondary: secondaryPalette[80],
      onSecondary: secondaryPalette[20],
      secondaryContainer: secondaryPalette[30],
      onSecondaryContainer: secondaryPalette[90],
      tertiary: tertiaryPalette[80],
      onTertiary: tertiaryPalette[20],
      tertiaryContainer: tertiaryPalette[30],
      onTertiaryContainer: tertiaryPalette[90],
      error: errorPalette[80],
      onError: errorPalette[20],
      errorContainer: errorPalette[30],
      onErrorContainer: errorPalette[90],
      background: neutralPalette[10],
      onBackground: neutralPalette[90],
      surface: neutralPalette[10],
      onSurface: neutralPalette[90],
      surfaceVariant: neutralVariantPalette[30],
      onSurfaceVariant: neutralVariantPalette[80],
      surfaceTint: primaryPalette[80],
      surfaceContainerLowest: neutralPalette[0],
      surfaceContainerLow: neutralPalette[10],
      surfaceContainer: neutralPalette[20],
      surfaceContainerHigh: neutralPalette[30],
      surfaceContainerHighest: neutralPalette[40],
      outline: neutralVariantPalette[60],
      outlineVariant: neutralVariantPalette[30],
      inverseSurface: neutralPalette[90],
      inverseOnSurface: neutralPalette[20],
      shadow: 'rgba(0, 0, 0, 0.2)',
      scrim: 'rgba(0, 0, 0, 0.32)',
    },
  };
}

/**
 * Generate AstraCore-style colors from seed
 * Uses the default AstraCore color seeds
 */
export function generateAstraCoreColors(seedColor?: string): {
  light: MaterialYouColors;
  dark: MaterialYouColors;
} {
  if (seedColor) {
    // Generate from custom seed
    return generateMaterialYouColors(
      seedColor,
      '#93018F', // Cosmic Magenta
      '#B48B00', // Solar Amber
      '#67676A', // Nebula Gray
      '#72727D' // Orion Steel
    );
  }

  // Use default AstraCore colors
  return generateMaterialYouColors(
    '#00529D', // Celestial Core Blue
    '#93018F', // Cosmic Magenta
    '#B48B00', // Solar Amber
    '#67676A', // Nebula Gray
    '#72727D' // Orion Steel
  );
}

