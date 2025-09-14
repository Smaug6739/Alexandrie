export interface DB_Node {
  id: string;
  user_id: string;
  parent_id?: string;
  name: string;
  description?: string;
  tags?: string;
  role: 1 | 2 | 3 | 4; // 1: Workspace; 2: Category; 3: Document; 4: Ressource
  color?: number; // -1: Default; 0: None; 1-7: App colors
  icon?: string;
  thumbnail?: string;
  theme?: string;
  accessibility?: number; // 1 Visible; 2 Draft; 3 Archived;
  display?: number; // 1 List; 2 Grid;
  order?: number; // -1 for pinned and -2 for bookmark
  content?: string;
  content_compiled?: string;
  size?: number; // in bytes
  metadata?: Record<string, unknown>;
  created_timestamp: number;
  updated_timestamp: number;
}
export interface DB_Node {
  id: string;
  user_id: string;
  parent_id?: string;
  name: string;
  description?: string;
  tags?: string;
  role: 4; // 1: Workspace; 2: Category; 3: Document; 4: Ressource
  color?: number; // -1: Default; 0: None; 1-7: App colors
  icon?: string;
  thumbnail?: string;
  theme?: string;
  accessibility?: number; // 1 Visible; 2 Draft; 3 Archived;
  display?: number; // 1 List; 2 Grid;
  order?: number; // -1 for pinned and -2 for bookmark
  content?: string;
  content_compiled?: string;
  size?: number; // in bytes
  metadata?: {
    filetype?: string;
    original_path?: string;
    transformed_path?: string;
  };
  created_timestamp: string;
  updated_timestamp: string;
}

export interface Node extends DB_Node {
  partial?: boolean;
  shared: boolean;
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
