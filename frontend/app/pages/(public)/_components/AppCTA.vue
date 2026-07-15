<template>
  <section class="final-cta reveal">
    <h2>Ready to Take Better Notes?</h2>
    <p>Join us on this journey to better note-taking.</p>
    <NuxtLink :prefetch="false" to="/dashboard" class="btn primary large" style="display: block;
 width: fit-content; margin: 10px auto 0">Start Now</NuxtLink>
    <p style="margin-top: 20px">
      Want to contribute or discuss? Check out our
      <NuxtLink :prefetch="false" to="https://discord.gg/UPsEg6egPj" target="_blank" style="color: white; text-decoration: underline">Discord server</NuxtLink>!
    </p>
  </section>
</template>

<style scoped>
.final-cta {
  margin-bottom: 3rem;
  padding: 3rem 2rem;
  border-radius: 1rem;
  color: white;
  text-align: center;
  background: var(--primary);
}

.btn {
  margin-top: 10px;
  padding: 0.9rem 1.8rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
}

.btn.primary {
  color: var(--primary);
  background: white;
}

.final-cta .btn {
  color: var(--primary);
  background: white;
}
</style>
