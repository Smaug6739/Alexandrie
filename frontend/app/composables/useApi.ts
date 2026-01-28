import type { Node, PublicUser, User } from '~/stores';

export function useApi() {
  const config = useRuntimeConfig();
  const CDN = config.public.baseCdn;
  const API = `${config.public.baseApi}/api`;
  const cdnEndpoint = config.public.cdnEndpoint || '';

  function avatarURL(user?: User | PublicUser | null): string {
    if (!user?.avatar) return '/default_avatar.avif';
    if (user.avatar.startsWith('http://') || user.avatar.startsWith('https://')) {
      return user.avatar;
    }
    return CDN + cdnEndpoint + user.id + `/avatar?v=${user.avatar}`;
  }

  function resourceURL(resource?: Node, download = false): string {
    if (!resource) return '';
    return `${CDN}${cdnEndpoint}${resource.user_id}/${resource.metadata?.transformed_path || resource.content}${
      download ? '?response-content-disposition=attachment' : ''
    }`;
  }

  return { CDN, API, avatarURL, resourceURL };
}
