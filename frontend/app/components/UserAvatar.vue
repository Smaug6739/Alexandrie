<template>
  <img v-if="avatarURL != '/placeholder/avatar.avif'" :src="avatarURL" alt="" :class="['avatar', { square }, display]" />
  <div v-else :class="['placeholder', getAppAccent(avatarHash), display]">
    <span> {{ props.user?.username.slice(0, 2).toUpperCase() }}</span>
  </div>
</template>

<script setup lang="ts">
import type { PublicUser } from '~/stores';

const props = withDefaults(
  defineProps<{
    user?: PublicUser | null;
    display?: 'sm' | 'md' | 'lg';
    square?: boolean;
  }>(),
  {
    user: null,
    display: 'md',
    square: false,
  },
);

const { avatarURL: resolveAvatarURL } = useApi();
const { getAppAccent } = useAppColors();

const avatarURL = computed(() => resolveAvatarURL(props.user));

// Create a hash between 0-9 to generate a background color for the avatar if no avatar is set
const avatarHash = computed(() => {
  const username = props.user?.username ?? 'default';
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash % 10;
});
</script>

<style scoped lang="scss">
.sm {
  width: 22px;
  height: 22px;
  border-radius: 50%;
}
.md {
  width: 25px;
  height: 25px;
  border-radius: 50%;
}
.lg {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.avatar {
  object-fit: cover;
}

.placeholder {
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 12px;
    font-weight: 600;
  }
}

.square {
  border-radius: var(--radius-sm);
}
</style>
