import { appColors } from '~/helpers/constants';

/** Get theme color name by index (-2 = primary, -1 = none, 0+ = color index) */
function getAppColor(index: number = 0, defaultPrimary?: boolean): string {
  if ((defaultPrimary && index < 0) || index == -2) return 'primary';
  if (index == -1) return '';
  return appColors[index % appColors.length] || 'primary';
}

/** Apply a theme color to CSS custom properties */
function setAppColor(color: string | number) {
  if (typeof color === 'number') {
    color = getAppColor(color);
  }
  if (color === 'primary') color = 'default';
  document.documentElement.style.setProperty('--primary', `var(--${color})`);
  document.documentElement.style.setProperty('--primary-dark', `var(--${color}-dark)`);
  document.documentElement.style.setProperty('--primary-bg', `var(--${color}-bg)`);
  document.documentElement.style.setProperty('--primary-border', `var(--${color}-border)`);

  const colorMode = useColorMode();
  usePreferences().set('darkMode', colorMode.value === 'dark');
  document.body.style.colorScheme = colorMode.preference;
}

export const useAppColors = () => {
  return {
    getAppColor,
    setAppColor,
  };
};
