import { resolve } from 'path';

export const config = {
  max_file_size: 20 * 1024 * 1024, // 20MB
  upload_path: resolve(__dirname, '../uploads'),
  access_token_expiration: '10s',
  access_token_expiration_ms: 10 * 1000,
  refresh_token_expiration: 7 * 24 * 60 * 60 * 1000,
};
