/**
 * String & parsing utilities
 * Contains hash-based color generation and user agent parsing
 */

const colors = ['var(--blue)', 'var(--teal)', 'var(--yellow)', 'var(--red)', 'var(--red)'];

/** Generate a consistent color from a string (useful for avatars, labels) */
export function useColorHash(str: string, list = colors): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return list[Math.abs(hash % list.length)] as string;
}

/** Parse a user agent string to extract OS and browser info */
export function parseUserAgent(uaString?: string) {
  if (!uaString) return { os: 'Unknown OS', browser: 'Unknown Browser' };

  const osList = [
    { name: 'Windows 10', regex: /Windows NT 10.0/ },
    { name: 'Windows 8.1', regex: /Windows NT 6.3/ },
    { name: 'Windows 8', regex: /Windows NT 6.2/ },
    { name: 'Windows 7', regex: /Windows NT 6.1/ },
    { name: 'Windows Vista', regex: /Windows NT 6.0/ },
    { name: 'Windows XP', regex: /Windows NT 5.1/ },
    { name: 'Mac OS X', regex: /Mac OS X ([\d_]+)/ },
    { name: 'iOS', regex: /iPhone|iPad/ },
    { name: 'Android', regex: /Android/ },
    { name: 'Linux', regex: /Linux/ },
  ];

  const browserList = [
    { name: 'Chrome', regex: /Chrome\/([0-9.]+)/ },
    { name: 'Firefox', regex: /Firefox\/([0-9.]+)/ },
    { name: 'Safari', regex: /Safari\/([0-9.]+)/ },
    { name: 'Edge', regex: /Edg\/([0-9.]+)/ },
    { name: 'Opera', regex: /OPR\/([0-9.]+)/ },
    { name: 'Internet Explorer', regex: /MSIE ([0-9.]+);/ },
  ];

  let os = 'Unknown OS';
  for (let i = 0; i < osList.length; i++) {
    if (osList[i]!.regex.test(uaString)) {
      os = osList[i]!.name;
      break;
    }
  }

  let browser = 'Unknown Browser';
  for (let i = 0; i < browserList.length; i++) {
    const match = uaString.match(browserList[i]!.regex);
    if (match) {
      browser = browserList[i]!.name + ' ' + match[1];
      break;
    }
  }

  return { os, browser };
}
