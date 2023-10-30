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

  // not in the database
  partial?: boolean;
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
