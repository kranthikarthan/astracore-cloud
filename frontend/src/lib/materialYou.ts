/**
 * Material You Utility Functions
 * Helper functions for Material You tokens, elevation, and surface colors
 */

/**
 * Material You color token names
 */
export type MaterialYouColorToken =
  | 'primary'
  | 'onPrimary'
  | 'primaryContainer'
  | 'onPrimaryContainer'
  | 'inversePrimary'
  | 'secondary'
  | 'onSecondary'
  | 'secondaryContainer'
  | 'onSecondaryContainer'
  | 'tertiary'
  | 'onTertiary'
  | 'tertiaryContainer'
  | 'onTertiaryContainer'
  | 'error'
  | 'onError'
  | 'errorContainer'
  | 'onErrorContainer'
  | 'background'
  | 'onBackground'
  | 'surface'
  | 'onSurface'
  | 'surfaceVariant'
  | 'onSurfaceVariant'
  | 'surfaceTint'
  | 'surfaceContainerLowest'
  | 'surfaceContainerLow'
  | 'surfaceContainer'
  | 'surfaceContainerHigh'
  | 'surfaceContainerHighest'
  | 'outline'
  | 'outlineVariant'
  | 'inverseSurface'
  | 'inverseOnSurface'
  | 'shadow'
  | 'scrim';

/**
 * Get Material You color token value from CSS variable
 */
export function getMaterialYouColor(token: MaterialYouColorToken): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return getComputedStyle(document.documentElement).getPropertyValue(
    `--md-sys-color-${token}`
  ).trim();
}

/**
 * Get Material You color token value with fallback
 */
export function getMaterialYouColorWithFallback(
  token: MaterialYouColorToken,
  fallback: string
): string {
  const value = getMaterialYouColor(token);
  return value || fallback;
}

/**
 * Material You elevation levels (0-5)
 */
export type MaterialYouElevation = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Get Material You elevation shadow
 */
export function getElevationShadow(elevation: MaterialYouElevation): string {
  if (typeof window === 'undefined') {
    return 'none';
  }
  return getComputedStyle(document.documentElement).getPropertyValue(
    `--md-sys-elevation-${elevation}`
  ).trim() || 'none';
}

/**
 * Material You shape corner sizes
 */
export type MaterialYouShapeSize =
  | 'none'
  | 'extraSmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'extraLarge'
  | 'full';

/**
 * Get Material You shape corner radius
 */
export function getShapeCorner(size: MaterialYouShapeSize): string {
  if (typeof window === 'undefined') {
    return '0px';
  }
  return getComputedStyle(document.documentElement).getPropertyValue(
    `--md-sys-shape-corner-${size}`
  ).trim() || '0px';
}

/**
 * Get surface container color by elevation level
 * Maps elevation to appropriate surface container
 */
export function getSurfaceContainerByElevation(elevation: MaterialYouElevation): string {
  const mapping: Record<MaterialYouElevation, MaterialYouColorToken> = {
    0: 'surfaceContainerLowest',
    1: 'surfaceContainerLow',
    2: 'surfaceContainer',
    3: 'surfaceContainerHigh',
    4: 'surfaceContainerHighest',
    5: 'surfaceContainerHighest',
  };
  return getMaterialYouColor(mapping[elevation]);
}

/**
 * Get surface color with tint applied
 * Applies surface tint based on elevation
 */
export function getTintedSurface(
  baseColor: string,
  elevation: MaterialYouElevation,
  tintOpacity: number = 0.05
): string {
  const surfaceTint = getMaterialYouColor('surfaceTint');
  // In a real implementation, you'd blend the colors properly
  // This is a simplified version
  return baseColor; // Placeholder - actual tinting would require color blending
}

/**
 * Material You motion duration tokens
 */
export type MaterialYouMotionDuration =
  | 'short1'
  | 'short2'
  | 'short3'
  | 'short4'
  | 'medium1'
  | 'medium2'
  | 'medium3'
  | 'medium4'
  | 'long1'
  | 'long2'
  | 'long3'
  | 'long4'
  | 'extraLong1'
  | 'extraLong2'
  | 'extraLong3'
  | 'extraLong4';

/**
 * Get Material You motion duration
 */
export function getMotionDuration(duration: MaterialYouMotionDuration): string {
  if (typeof window === 'undefined') {
    return '300ms';
  }
  return getComputedStyle(document.documentElement).getPropertyValue(
    `--md-sys-motion-duration-${duration}`
  ).trim() || '300ms';
}

/**
 * Material You easing curves
 */
export type MaterialYouEasing =
  | 'linear'
  | 'standard'
  | 'standard-accelerate'
  | 'standard-decelerate'
  | 'emphasized'
  | 'emphasized-accelerate'
  | 'emphasized-decelerate';

/**
 * Get Material You easing curve
 */
export function getEasingCurve(easing: MaterialYouEasing): string {
  if (typeof window === 'undefined') {
    return 'cubic-bezier(0.2, 0.0, 0, 1.0)';
  }
  return getComputedStyle(document.documentElement).getPropertyValue(
    `--md-sys-motion-easing-${easing}`
  ).trim() || 'cubic-bezier(0.2, 0.0, 0, 1.0)';
}

/**
 * Get transition string with Material You motion tokens
 */
export function getMaterialYouTransition(
  properties: string[],
  duration: MaterialYouMotionDuration = 'medium2',
  easing: MaterialYouEasing = 'standard',
  delay: string = '0ms'
): string {
  const durationValue = getMotionDuration(duration);
  const easingValue = getEasingCurve(easing);
  return properties
    .map((prop) => `${prop} ${durationValue} ${easingValue} ${delay}`)
    .join(', ');
}

/**
 * Check if current theme is dark mode
 */
export function isDarkMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return document.documentElement.classList.contains('dark');
}

/**
 * Get all Material You color tokens as an object
 */
export function getAllMaterialYouColors(): Record<MaterialYouColorToken, string> {
  const tokens: MaterialYouColorToken[] = [
    'primary',
    'onPrimary',
    'primaryContainer',
    'onPrimaryContainer',
    'inversePrimary',
    'secondary',
    'onSecondary',
    'secondaryContainer',
    'onSecondaryContainer',
    'tertiary',
    'onTertiary',
    'tertiaryContainer',
    'onTertiaryContainer',
    'error',
    'onError',
    'errorContainer',
    'onErrorContainer',
    'background',
    'onBackground',
    'surface',
    'onSurface',
    'surfaceVariant',
    'onSurfaceVariant',
    'surfaceTint',
    'surfaceContainerLowest',
    'surfaceContainerLow',
    'surfaceContainer',
    'surfaceContainerHigh',
    'surfaceContainerHighest',
    'outline',
    'outlineVariant',
    'inverseSurface',
    'inverseOnSurface',
    'shadow',
    'scrim',
  ];

  return tokens.reduce((acc, token) => {
    acc[token] = getMaterialYouColor(token);
    return acc;
  }, {} as Record<MaterialYouColorToken, string>);
}

/**
 * Apply Material You elevation to an element style
 */
export function applyElevation(
  elevation: MaterialYouElevation
): { boxShadow: string } {
  return {
    boxShadow: getElevationShadow(elevation),
  };
}

/**
 * Apply Material You surface container background
 */
export function applySurfaceContainer(
  elevation: MaterialYouElevation = 2
): { backgroundColor: string } {
  return {
    backgroundColor: getSurfaceContainerByElevation(elevation),
  };
}

