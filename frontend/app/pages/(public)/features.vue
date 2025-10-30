<template>
  <div>
    <main class="features-page">
      <FeaturesTimeline class="reveal" />
      <FeaturesFAQ class="reveal" />

      <AppCTA class="reveal" />
    </main>
  </div>
</template>

<script setup lang="ts">
import FeaturesTimeline from './_components/features/FeaturesTimeline.vue';
import FeaturesFAQ from './_components/features/FeaturesFAQ.vue';
import AppCTA from './_components/AppCTA.vue';
</script>

<style scoped lang="scss">
.features-page {
  overflow-x: hidden;
  padding: 0 2rem;
  margin-top: 1em;
}
</style>
