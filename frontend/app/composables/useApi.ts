import type { PublicUser, User } from '~/stores';

export function useApi() {
  const config = useRuntimeConfig();
  const CDN = config.public.baseCdn;
  const API = `${config.public.baseApi}/api`;

  function avatarURL(user?: User | PublicUser | null): string {
    return user?.avatar ? CDN + '/' + user.id + `/avatar?v=${user.avatar}` : '/default_avatar.avif';
  }

  return { CDN, API, avatarURL };
}
