import type { CookieOptions } from 'express';

/*const COOKIE_CONFIG: CookieOptions = {
  httpOnly: true,
  domain: process.env.FRONT_DOMAIN,
  secure: process.env.NODE_ENV == 'production' ? true : false,
  sameSite: 'lax',
};*/
const COOKIE_CONFIG: CookieOptions = {
  httpOnly: true,
  domain: process.env.NODE_ENV == 'production' ? process.env.FRONT_DOMAIN : undefined,
  secure: process.env.NODE_ENV == 'production' ? true : false,
  sameSite: 'lax',
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

export { MIME_TYPES_IMAGE, OTHER_MIME_TYPES, ACCEPTED_MIME_TYPES, COOKIE_CONFIG };
