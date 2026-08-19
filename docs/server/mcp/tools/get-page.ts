import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: `Retrieves the full content and details of a specific documentation page.

WHEN TO USE: Use this tool when you know the EXACT path to a documentation page. Common use cases:
- User asks for a specific page: "Show me the getting started guide" → /getting-started
- User asks about a known topic with a dedicated page
- You found a relevant path from list-pages and want the full content
- User references a specific section or guide they want to read

WHEN NOT TO USE: If you don't know the exact path and need to search/explore, use list-pages first.

WORKFLOW: This tool returns the complete page content including title, description, and full markdown. Use this when you need to provide detailed answers or code examples from specific documentation pages.`,
  inputSchema: {
    path: z.string().describe('The page path from list-pages or provided by the user (e.g., /getting-started/installation)')
  },
  cache: '1h',
  handler: async ({ path }) => {
    const event = useEvent()
    const url = getRequestURL(event)
    const siteUrl = import.meta.dev ? `${url.protocol}//${url.hostname}:${url.port}` : url.origin

    try {
      const page = await queryCollection(event, 'docs')
        .where('path', '=', path)
        .select('title', 'path', 'description')
        .first()

      if (!page) {
        return {
          content: [{ type: 'text', text: 'Page not found' }],
          isError: true
        }
      }

      const content = await $fetch<string>(`/raw${path}.md`, {
        baseURL: siteUrl
      })

      const result = {
        title: page.title,
        path: page.path,
        description: page.description,
        content,
        url: `${siteUrl}${page.path}`
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      }
    } catch {
      return {
        content: [{ type: 'text', text: 'Failed to get page' }],
        isError: true
      }
    }
  }
})
