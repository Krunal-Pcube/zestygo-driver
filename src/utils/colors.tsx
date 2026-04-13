// Re-export from ThemeContext for backwards compatibility
// Use useTheme hook in components for dynamic theme support
export { lightColors as colors, useTheme } from '../context/ThemeContext';
export { lightColors, darkColors } from '../context/ThemeContext';
