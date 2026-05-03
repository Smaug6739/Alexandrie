export function rerenderImages(rootElement: HTMLElement) {
  // Re-triggering image loading by resetting the data attribute (add v=timestamp), to bypass potential caching issues after a drawio diagram update
  const obj = rootElement?.querySelectorAll('object');
  obj?.forEach(img => {
    const data = img.getAttribute('data') || '';
    const url = new URL(data);
    url.searchParams.set('v', Date.now().toString());
    if (data) {
      img.setAttribute('data', url.toString());
    }
  });
}
