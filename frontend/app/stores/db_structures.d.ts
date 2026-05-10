export interface DB_Node {
  id: string;
  user_id: string;
  parent_id?: string;
  name: string;
  description?: string;
  tags?: string;
  role: NodeRole; // 1: Workspace; 2: Category; 3: Document; 4: Resource; -1: Internal (frontend use only)
  color?: number; // -1: Default; 0: None; 1-7: App colors
  icon?: string;
  thumbnail?: string;
  theme?: string;
  accessibility: number; // 1 Visible; 2 Draft; 3 Archived;
  access: number; // 1 Viewer; 2 Editor;
  display?: number; // 1 List; 2 Grid;
  order?: number; // -1 for pinned and -2 for bookmark
  content?: string;
  content_compiled?: string;
  size?: number; // in bytes
  metadata?: {
    filetype?: string;
    original_path?: string;
    transformed_path?: string;
    drawio?: boolean;
  };
  created_timestamp: number;
  updated_timestamp: number;

  permissions?: Permission[];
}

export interface Permission {
  id: string;
  user_id: string;
  node_id: string;
  permission: number; // 1: Read; 2: Write; 3: Admin;
  created_timestamp: number;
}

export interface Node extends DB_Node {
  partial?: boolean;
  shared: boolean;
  permissions: Permission[];

  _children?: Node[];
}

export interface User {
  id: string;
  username: string;
  firstname?: string;
  lastname?: string;
  role: number; // 0: User; 1: Admin;
  avatar?: string;
  password?: string;
  email?: string;
  created_timestamp: number;
  updated_timestamp: number;
}

export interface PublicUser {
  id: string;
  username: string;
  avatar?: string;
  created_timestamp: number;
  updated_timestamp: number;
}

export interface NodeSearchResult {
  id: string;
  user_id: string;
  parent_id?: string;
  name: string;
  description?: string;
  tags?: string;
  role: NodeRole;
  accessibility: number;
  icon?: string;
  relevance: number;
  metadata?: undefined;
  content_snippet?: string;
  created_timestamp: number;
  updated_timestamp: number;
}

// Response from public node endpoint including children
export interface PublicNodeResponse {
  node: DB_Node;
  children: DB_Node[];
}

export interface Session {
  id: string;
  user_id: string;
  //refresh_token: string; // Excluded for security reasons
  expire_token: number;
  last_refresh_timestamp: number;
  active: boolean;
  ip_adress?: string;
  user_agent?: string;
  location?: string;
  type: string;
  login_timestamp: number;
  logout_timestamp?: number;
}

export interface MonthlyCount {
  month: string; // Format: YYYY-MM
  count: number;
}

export interface UserStats {
  total_users: number;
  growth_last_12_months: MonthlyCount[];
}

export interface NodeOwnerStats {
  user_id: string;
  username: string;
  node_count: number;
  total_size: number;
}

export interface NodeStats {
  total_nodes: number;
  total_size: number;
  growth_last_12_months: MonthlyCount[];
  top_users_by_nodes: NodeOwnerStats[];
  top_users_by_size: NodeOwnerStats[];
}

export interface OverviewStats {
  total_users: number;
  total_nodes: number;
  total_size: number;
}

// Internal structures

export interface ImportJob {
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  toCreate: number;
  created: string[];
  toUpdate: number;
  updated: string[];
  failures: number;
  error_message?: string;
}
