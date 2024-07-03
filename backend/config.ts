import { resolve } from 'path';

export const config = {
  max_file_size: 20 * 1024 * 1024, // 20MB
  upload_path: resolve(__dirname, '../uploads'),
  access_token_expiration: '5s',
  refresh_token_expiration: 10 * 1000, // 1 days
};
