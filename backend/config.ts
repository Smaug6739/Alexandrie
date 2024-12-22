import { resolve } from 'path';

export const config = {
  max_file_size: 20 * 1024 * 1024, // 20MB
  upload_path: resolve(__dirname, '../uploads'),
  access_token_expiration: '1800s',
  access_token_expiration_ms: 5 * 1000, // 30 minutes
  refresh_token_expiration: 7 * 24 * 60 * 60 * 1000,
  // in octets
  max_user_size: 1000 * 1024 * 1024, // 1GB
};
