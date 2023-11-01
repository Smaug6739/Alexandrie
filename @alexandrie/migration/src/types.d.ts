import type { RowDataPacket } from 'mysql2';

export interface Document {
  id: string;
  name: string;
  description?: string;
  tags?: string;
  category?: string;
  accessibility: number; // 0: No; 1: Yes;
  content_markdown?: string;
  content_html?: string;
  author_id: string;
  created_timestamp: string;
  updated_timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  order?: number;
  parent_id?: string;
}

export interface User {
  id: string;
  username: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
  email: string;
  password: string;
  created_timestamp: string;
}
export interface Article extends RowDataPacket {
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
export type DocumentDB = RowDataPacket & Document;
export type CategoryDB = RowDataPacket & Category;
export type UserDB = RowDataPacket & User;
export type ArticleDB = RowDataPacket & Article;
