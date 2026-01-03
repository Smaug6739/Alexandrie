import type { Node, PublicUser, User } from '~/stores';

export function useApi() {
  const config = useRuntimeConfig();
  const CDN = config.public.baseCdn;
  const API = `${config.public.baseApi}/api`;

  function avatarURL(user?: User | PublicUser | null): string {
    return user?.avatar ? CDN + '/alexandrie/' + user.id + `/avatar?v=${user.avatar}` : '/default_avatar.avif';
  }

  function resourceURL(resource?: Node): string {
    if (!resource) return '';
    return `${CDN}/alexandrie/${resource.user_id}/${resource.metadata?.transformed_path || resource.content}`;
  }

  return { CDN, API, avatarURL, resourceURL };
}
