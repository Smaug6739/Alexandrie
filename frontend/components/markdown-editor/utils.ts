// Get the actual title scroll of markdown content
// Return content of the header who is currently visible
/*const slugify = (s: string) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'));

export function getScrolls(textarea: HTMLTextAreaElement, output: HTMLElement): Scroll[] {
  const headers = textarea.value.match(/^#+.+/gm);
  const actualScroll = textarea.scrollTop;
  // If the actualScroll is at the maximum, the last header is visible
  if (!headers) return [];
  const all = headers.map(header => {
    header = header.replace(/^#+/, '').trim();
    const headerElement = document.getElementById(slugify(header));
    if (!headerElement) return { markdown: -1, html: -1, actual: actualScroll };
    const markdownScroll = headerElement.offsetTop - textarea.offsetTop;
    const htmlScroll = headerElement.offsetTop - output.offsetTop;
    return {
      markdown: markdownScroll,
      html: htmlScroll,
      actual: actualScroll,
      text: header,
    };
  });

  return all;
}
interface Scroll {
  markdown: number;
  html: number;
  actual: number;
}*/
/*
// Function to get the most visible header
export function getMostVisibleHeader(scrolls: Scroll[]): number[] {
  if (!scrolls.length) return [-1, -1];
  const { header } = scrolls.reduce((prev, current) => {
    return Math.abs(current.actual - current.header) < Math.abs(prev.actual - prev.header) ? current : prev;
  });

  const headerIndex = scrolls.findIndex(scroll => scroll.header === header);
  console.log(scrolls[headerIndex]);

  if (headerIndex + 1 < scrolls.length) {
    return [header, scrolls[headerIndex + 1]?.header || -1];
  }

  return [header, -1];
}
// Fluid scroll to the most visible header
// Param 1: textarea
// Param 2: element to scroll
// Param 3: header to scroll to (number)
export function fluidScrollTo(textarea: HTMLTextAreaElement, element: HTMLElement, headers: number[]) {
  const [header, nextHeader] = headers;
  if (!header || !nextHeader) return;
  const actualTextareaScroll = textarea.scrollTop;
  const overflowScroll = actualTextareaScroll - header;
  console.log(overflowScroll);
}
*/
