const svg_info = `<svg style="align-self: center;" class="svg-icon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"> <path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm6.5-.25A.75.75 0 017.25 7h1a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2a.75.75 0 010-1.5h.25v-2h-.25a.75.75 0 01-.75-.75zM8 6a1 1 0 100-2 1 1 0 000 2z"></path></svg>`;
const svg_warning = `<svg style="align-self: center;" class="svg-icon" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"> <path fill-rule="evenodd" d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"> </path> </svg>`;

function containerOpen(title: string, logo: string, color: string) {
  return `<div class="markdown-container">
		<span style="display: inline-flex; align-items: baseline;" class="${color}">
			${logo}${title}</span>`;
}

export { svg_info, svg_warning, containerOpen };
