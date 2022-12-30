import type { RowDataPacket } from 'mysql2';

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

export interface Theme extends RowDataPacket {
  id: string;
  name: string;
  description: string;
  order: number;
  path: string;
  icon: string;
}
export interface Category extends RowDataPacket {
  id: string;
  name: string;
  description: string;
  order: number;
  path: string;
  icon: string;
  parent_category: string;
}

export interface User extends RowDataPacket {
  id: string;
  username: string;
  permissions: number;
  banishment: number;
  avatar: string;
  password: string;
  first_name: string;
  last_name: string;
  age: string;
  phone_number: string;
  email: string;
  date_insert: number;
}
