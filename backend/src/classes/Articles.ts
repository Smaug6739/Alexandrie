const marked = require('marked');
import { Snowflake } from '../utils/Snowflake';
import db from '../models/db';

const idgen = new Snowflake(1661327668261);

marked.setOptions({
  renderer: new marked.Renderer(),
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});

interface Article {
  id: string;
  main_category: string;
  sub_category: string;
  path: string;
  name: string;
  description: string;
  content_html: string;
  content_markdown: string;
  created_timestamp: string;
  updated_timestamp: string;
  author_id: string;
}

export default class Articles {
  public getAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM articles ORDER BY `name`', (err, result) => {
        if (err) return reject(new Error(err.message));
        resolve(result);
      });
    });
  }

  public getAllByCategory(category: string) {
    return new Promise((resolve, reject) => {
      if (!category) return reject(new Error('[MISSING_ARGUMENT] : category must be provided'));
      db.query('SELECT * FROM articles WHERE main_category = ? ORDER BY `name`', [category], (err, result) => {
        if (err) return reject(new Error(err.message));
        resolve(result);
      });
    });
  }
  public add(
    name: string,
    path: string,
    main_category: string,
    sub_category: string,
    description: string,
    content_markdown: string,
    content_html: string,
    author: string,
  ): Promise<Article | Error> {
    return new Promise((resolve, reject) => {
      if (!name) return reject(new Error('[MISSING_ARGUMENT] : name must be provided'));
      if (!main_category) return reject(new Error('[MISSING_ARGUMENT] : main_category must be provided'));
      if (!sub_category) return reject(new Error('[MISSING_ARGUMENT] : sub_category must be provided'));
      if (!description) return reject(new Error('[MISSING_ARGUMENT] : description must be provided'));
      if (!content_markdown) return reject(new Error('[MISSING_ARGUMENT] : content_markdown must be provided'));
      if (!content_html) return reject(new Error('[MISSING_ARGUMENT] : content_html must be provided'));
      if (!author) return reject(new Error('[MISSING_ARGUMENT] : author must be provided'));
      const time = Date.now();
      const id = idgen.generate().toString();
      db.query(
        'INSERT INTO articles (`id`, `name`, `description`, `path`, `main_category`, `sub_category`, `content_html`, `content_markdown`, `created_timestamp`, `updated_timestamp`, `author_id`) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
        [id, name, description, path, main_category, sub_category, content_html, content_markdown, time, time, author],
        err => {
          if (err) return reject(new Error(err.message));
          else
            resolve({
              id,
              path,
              name,
              main_category,
              sub_category,
              description,
              content_html,
              content_markdown,
              created_timestamp: time.toString(),
              updated_timestamp: time.toString(),
              author_id: author.toString(),
            });
        },
      );
    });
  }
  public put(
    id: string,
    name: string,
    description: string,
    path: string,
    main_category: string,
    sub_category: string,
    content_markdown: string,
    content_html: string,
  ) {
    return new Promise((resolve, reject) => {
      if (!id) return reject(new Error('[MISSING_ARGUMENT] : id must be provided'));
      db.query('SELECT * FROM articles WHERE id = ? LIMIT 1', [id], (err, result) => {
        if (err) return reject(new Error(err.message));
        if (!result || !result.length) return reject(new Error('[ERROR] : Invalid id'));
        else {
          if (!name) name = result[0].name;
          if (!description) description = result[0].description;
          if (!path) path = result[0].path;
          if (!main_category) main_category = result[0].main_category;
          if (!sub_category) sub_category = result[0].sub_category;
          if (!content_markdown) content_markdown = result[0].content_markdown;
          if (!content_html) content_html = result[0].content_html;
          db.query(
            'UPDATE articles SET `name` = ?, `description` = ?, `path` = ?, `main_category` = ?, `sub_category` = ?, `content_html` = ?, `content_markdown` = ?, `updated_timestamp` = ? WHERE `id` = ?',
            [name, description, path, main_category, sub_category, content_html, content_markdown, Date.now(), id],
            err => {
              if (err) return reject(new Error(err.message));
              else resolve(true);
            },
          );
        }
      });
    });
  }
  public delete(id: string) {
    return new Promise((resolve, reject) => {
      if (!id) return reject(new Error('[MISSING_ARGUMENT] : id must be provided'));
      db.query('DELETE FROM articles WHERE id = ?', [id], (err, r) => {
        if (err) return reject(new Error(err.message));
        else resolve(true);
      });
    });
  }
}
