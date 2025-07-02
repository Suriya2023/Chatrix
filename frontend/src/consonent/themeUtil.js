// src/utils/themeUtils.js

import { THEME_COLORS } from '../consonent/index';

export const applyCustomTheme = (themeName) => {
  const themeVars = THEME_COLORS[themeName];
  if (!themeVars) return;
  const root = document.documentElement;

  Object.entries(themeVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};
