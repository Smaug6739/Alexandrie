/* eslint-disable @typescript-eslint/no-explicit-any */
import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import { svg_info, svg_warning, containerOpen } from './constants';

const containerPlugin = container as any;

export const containerSvg = (md: MarkdownIt) => {
  const containers = [
    { name: 'definition', color: 'red', icon: svg_info },
    { name: 'property', color: 'blue', icon: svg_info },
    { name: 'theorem', color: 'teal', icon: svg_info },
    { name: 'warning', color: 'orange', icon: svg_warning },
    { name: 'info-red', color: 'red', icon: svg_info },
    { name: 'info-blue', color: 'blue', icon: svg_info },
    { name: 'info-teal', color: 'teal', icon: svg_info },
  ];

  containers.forEach(({ name, color, icon }) => {
    md.use(containerPlugin, name, {
      validate(params: string) {
        // Autorise le pattern `nom + titre`
        return params.trim().match(new RegExp(`^${name}\\s+(.*)$`));
      },
      render(tokens: any, idx: number) {
        const m = tokens[idx].info.trim().match(new RegExp(`^${name}\\s+(.*)$`));

        if (tokens[idx].nesting === 1) {
          // Opening tag
          return containerOpen(m ? m[1] : '', icon, color);
        } else {
          // Closing tag
          return '</div></div>\n';
        }
      },
    });
  });
};
