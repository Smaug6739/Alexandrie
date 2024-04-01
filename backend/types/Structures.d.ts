import type { RowDataPacket } from 'mysql2';

export interface Document {
  id: string;
  name: string;
  description?: string;
  tags?: string;
  category?: string;
  parent_id?: string;
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

export type DocumentDB = RowDataPacket & Document;
export type CategoryDB = RowDataPacket & Category;
export type UserDB = RowDataPacket & User;

// SQL create the documents table (relation between author_id and users.id; relation between category and categories.id)
/* CREATE TABLE documents (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  tags VARCHAR(255),
  category VARCHAR(50),
  accessibility TINYINT(1) NOT NULL,
  content_markdown LONGTEXT,
  content_html LONGTEXT,
  author_id VARCHAR(50) NOT NULL,
  created_timestamp VARCHAR(50) NOT NULL,
  updated_timestamp VARCHAR(50) NOT NULL,
  FOREIGN KEY (author_id) REFERENCES users(id),
  FOREIGN KEY (category) REFERENCES categories(id)
); */

// SQL create the categories table (relation between parent_id and categories.id)
/* CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(255),
  order INT,
  parent_id VARCHAR(50),
  FOREIGN KEY (parent_id) REFERENCES categories(id)
); */
// SQL create the users table
/* CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  avatar VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_timestamp VARCHAR(50) NOT NULL
); */
