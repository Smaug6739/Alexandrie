import { resolve } from 'path';

const maxSize = 20 * 1024 * 1024; // 20MB

const access_token_expiration = '18s';
const refresh_token_expiration = 3600000 * 24 * 1; // 1 day

const COOKIE_CONFIG = {
  domain: process.env.FRONT_DOMAIN,
  httpOnly: true,
  secure: true,
  sameSite: 'none',
};

const MIME_TYPES_IMAGE = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};
const OTHER_MIME_TYPES = {
  'application/pdf': 'pdf',
  // doc, docx, xls, xlsx, ppt, pptx
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  // txt
  'text/plain': 'txt',
  // zip, tar, rar
  'application/zip': 'zip',
  'application/x-tar': 'tar',
  'application/x-rar-compressed': 'rar',
};
const ACCEPTED_MIME_TYPES = {
  ...MIME_TYPES_IMAGE,
  ...OTHER_MIME_TYPES,
};

const UPLOADS_PATH = resolve(__dirname, '../../uploads');

export {
  maxSize,
  MIME_TYPES_IMAGE,
  OTHER_MIME_TYPES,
  ACCEPTED_MIME_TYPES,
  UPLOADS_PATH,
  COOKIE_CONFIG,
  access_token_expiration,
  refresh_token_expiration,
};
