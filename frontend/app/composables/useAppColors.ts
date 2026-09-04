import { appColors } from '~/helpers/constants';
import { persistThemeColor, resolveThemeColorValue } from '~/helpers/themeColor';

/** Get theme color name by index (-2 = primary, -1 = none, 0+ = color index) */
function getAppAccent(index: number = 0, defaultPrimary?: boolean): string {
  if ((defaultPrimary && index < 0) || index == -2) return 'primary';
  if (index == -1) return '';
  return appColors[index % appColors.length] || 'primary';
}

/** Apply a theme color to CSS custom properties */
function setAppColor(color: string | number) {
  if (typeof color === 'number') {
    color = getAppAccent(color);
  }
  if (!import.meta.client) return;
  setThemeColor(`--${color}`);
  if (color === 'primary') color = 'accent';
  document.documentElement.style.setProperty('--primary', `var(--${color})`);
  document.documentElement.style.setProperty('--primary-dark', `var(--${color}-dark)`);
  document.documentElement.style.setProperty('--primary-bg', `var(--${color}-bg)`);
  document.documentElement.style.setProperty('--primary-border', `var(--${color}-border)`);

  const colorMode = useColorMode();
  usePreferencesStore().set('darkMode', colorMode.value === 'dark');
  document.body.style.colorScheme = colorMode.preference;
}

function setThemeColor(cssVar: string) {
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  const styles = getComputedStyle(document.documentElement);
  const computedColor = resolveThemeColorValue(styles.getPropertyValue(cssVar).trim(), name => styles.getPropertyValue(name).trim());
  meta.setAttribute('content', computedColor);
  persistThemeColor(computedColor);
}

export const useAppColors = () => {
  return {
    getAppAccent,
    setAppColor,
  };
};
