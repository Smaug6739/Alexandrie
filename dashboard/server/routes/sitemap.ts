import type { APIResult, Article, Theme } from '@/store';

export default defineEventHandler(async e => {
  const articles = $fetch<APIResult<Article[]>>(
    `https://api.alexandrie-hub.fr/api/v1/articles?fields=path,main_category,sub_category`,
  );
  const catagoies = $fetch<APIResult<Theme[]>>(
    `https://api.alexandrie-hub.fr/api/v1/categories?fields=path,main_category,sub_category`,
  );
  const results = await Promise.all([articles, catagoies]);
  const data: string[] = [];
  for (const theme of results[1].result || []) {
    for (const category of theme.categories) {
      data.push(`https://alexandrie-hub.fr/docs/${theme.path}/${category.path}`);
    }
  }
  for (const article of results[0].result || []) {
    data.push(`https://alexandrie-hub.fr/docs/${article.main_category}/${article.sub_category}/${article.path}`);
  }
  // send text response
  e.node.res.setHeader('Content-Type', 'text/plain');
  return data.join('\n');
});
