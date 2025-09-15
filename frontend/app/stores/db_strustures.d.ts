export interface Node {
  id: string;
  parent_id?: string;
  color?: number; // -1: Default; 0: None; 1-7: App colors
  icon?: string;
  user_id: string;
  role: number; // 1: Workspace; 2: Category; 3: Document; 4: Ressource
  created_timestamp: string;
  updated_timestamp: string;
}

export interface DB_Document extends Node {
  name: string;
  description?: string;
  tags?: string;
  pinned: number; // 0: Not pinned; 1: Pinned; 2: Favorite;
  thumbnail?: string;
  theme?: string;
  accessibility: number; // 1 Visible; 2 Draft; 3 Archived;
  content_markdown?: string;
  content_html?: string;
}
export interface Document extends DB_Document {
  partial?: boolean;
  type: 'document';
}
export interface DB_Category extends Node {
  name: string;
  icon?: string;
  order?: number;
  role: number; // 1 Workspace; 2 Category
}
export interface Category extends DB_Category {
  type: 'category';
}

export interface User {
  id: string;
  username: string;
  firstname?: string;
  lastname?: string;
  role: number; // 0: User; 1: Admin;
  avatar?: string;
  password?: string;
  email: string;
  created_timestamp: string;
  updated_timestamp?: string;
}

export interface ConnectionLog {
  id: string;
  user_id: string;
  ip_adress?: string;
  user_agent?: string;
  location?: string;
  type: string;
  timestamp: string; // BIGINT converted to string
}
export interface DB_Ressource extends Node {
  filename: string;
  filesize: number;
  filetype: string;
  original_path: string;
  transformed_path: string;
}

export interface Ressource extends DB_Ressource {
  type: 'ressource';
}
