/* eslint-disable @typescript-eslint/no-explicit-any */
import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import { svg_info, svg_warning, containerOpen } from './constants';

export const containerSvg = (md: MarkdownIt) => {
  md.use(container, 'definition', {
    validate: function (params: any) {
      return params.trim().match(/^definition\s+(.*)$/);
    },
    render: function (tokens: any, idx: any) {
      const m = tokens[idx].info.trim().match(/^definition\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        // opening tag
        return containerOpen(m[1], svg_info, 'red');
      } else {
        // closing tag
        return '</div></div>\n';
      }
    },
  });
  md.use(container, 'property', {
    validate: function (params: any) {
      return params.trim().match(/^property\s+(.*)$/);
    },
    render: function (tokens: any, idx: any) {
      const m = tokens[idx].info.trim().match(/^property\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        // opening tag
        return containerOpen(m[1], svg_info, 'blue');
      } else {
        // closing tag
        return '</div></div>\n';
      }
    },
  });
  md.use(container, 'theorem', {
    validate: function (params: any) {
      return params.trim().match(/^theorem\s+(.*)$/);
    },
    render: function (tokens: any, idx: any) {
      const m = tokens[idx].info.trim().match(/^theorem\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        // opening tag
        return containerOpen(m[1], svg_info, 'teal');
      } else {
        // closing tag
        return '</div></div>\n';
      }
    },
  });
  md.use(container, 'warning', {
    validate: function (params: any) {
      return params.trim().match(/^warning\s+(.*)$/);
    },
    render: function (tokens: any, idx: any) {
      const m = tokens[idx].info.trim().match(/^warning\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        // opening tag
        return containerOpen(m[1], svg_warning, 'yellow');
      } else {
        // closing tag
        return '</div></div>\n';
      }
    },
  });
};
