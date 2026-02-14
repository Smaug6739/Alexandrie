<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="50" viewBox="0 0 164.000000 160.000000" preserveAspectRatio="xMidYMid meet">
    <g transform="translate(0.000000,160.000000) scale(0.100000,-0.100000)" :fill="fill || 'var(--text-body)'" stroke="none">
      <path
        d="M688 1190 c-21 -16 -243 -392 -313 -529 -35 -70 15 -151 94 -151 39 0 87 30 236 146 124 97 256 135 352 101 24 -8 41 -12 39 -8 -72 136 -246 427 -264 441 -34 27 -110 27 -144 0z"
      />
      <path
        d="M921 729 c-24 -4 -64 -18 -89 -30 -36 -18 -42 -24 -31 -33 8 -6 51 -38 94 -72 44 -33 90 -66 102 -72 86 -46 189 41 152 129 -23 57 -138 96 -228 78z"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ fill?: string }>();
</script>
