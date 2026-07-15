<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Main Footer Content -->
      <div class="footer-main">
        <!-- Brand Column -->
        <div class="footer-brand">
          <div class="brand-logo">
            <IconApp style="width: 40px" />
            <span class="brand-name">Alexandrie</span>
          </div>
          <p class="brand-desc">{{ t('landing.footer.brandDescription') }}</p>
          <div class="social-links">
            <a href="https://github.com/Smaug6739/Alexandrie" target="_blank" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
            </a>
            <a href="https://discord.gg/UPsEg6egPj" target="_blank" aria-label="Discord">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
                />
              </svg>
            </a>
            <a href="mailto:contact@alexandrie-hub.fr" target="_blank" aria-label="Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12.713l-11.99-7.713v13.999h23.98v-13.999l-11.99 7.713zm0-2.427l10.99-7.086h-21.98l10.99 7.086z" />
              </svg>
            </a>
          </div>

          <div class="footer-language-switcher">
            <label class="language-label" for="footer-language-select">{{ t('settings.appearance.setLanguage') }}</label>
            <AppSelect
              class="footer-language-select"
              :items="localeItems"
              :model-value="locale"
              :searchable="false"
              :placeholder="t('settings.appearance.setLanguage')"
              size="min(100%, 260px)"
              @update:model-value="selectLocale"
            />
          </div>
        </div>

        <!-- Links Columns -->
        <div class="footer-links">
          <div class="links-column">
            <h4>{{ t('landing.footer.columns.product') }}</h4>
            <ul>
              <li>
                <NuxtLink :prefetch="false" to="/dashboard">{{ t('landing.footer.links.dashboard') }}</NuxtLink>
              </li>
              <li>
                <NuxtLink :prefetch="false" to="/#features">{{ t('landing.footer.links.features') }}</NuxtLink>
              </li>
              <li>
                <a href="https://github.com/Smaug6739/Alexandrie/releases" target="_blank">{{ t('landing.footer.links.changelog') }}</a>
              </li>
              <li>
                <a href="https://github.com/users/Smaug6739/projects/7" target="_blank">{{ t('landing.footer.links.roadmap') }}</a>
              </li>
            </ul>
          </div>

          <div class="links-column">
            <h4>{{ t('landing.footer.columns.resources') }}</h4>
            <ul>
              <li>
                <NuxtLink to="/reference/documentation" no-prefetch>{{ t('landing.footer.links.documentation') }}</NuxtLink>
              </li>
              <li>
                <a href="https://github.com/Smaug6739/Alexandrie/wiki" target="_blank">{{ t('landing.footer.links.apiReference') }}</a>
              </li>
              <li>
                <NuxtLink to="/about">{{ t('landing.footer.links.about') }}</NuxtLink>
              </li>
            </ul>
          </div>

          <div class="links-column">
            <h4>{{ t('landing.footer.columns.community') }}</h4>
            <ul>
              <li>
                <a href="https://github.com/Smaug6739/Alexandrie" target="_blank">{{ t('landing.footer.links.github') }}</a>
              </li>
              <li>
                <a href="https://discord.gg/UPsEg6egPj" target="_blank">{{ t('landing.footer.links.discord') }}</a>
              </li>
              <li>
                <a href="https://github.com/Smaug6739/Alexandrie/contribute" target="_blank">{{ t('landing.footer.links.contribute') }}</a>
              </li>
              <li>
                <a href="https://github.com/Smaug6739/Alexandrie/issues" target="_blank">{{ t('landing.footer.links.issues') }}</a>
              </li>
            </ul>
          </div>

          <div class="links-column">
            <h4>{{ t('landing.footer.columns.legal') }}</h4>
            <ul>
              <li>
                <NuxtLink to="/reference/privacy">{{ t('landing.footer.links.privacyPolicy') }}</NuxtLink>
              </li>
              <li>
                <a href="#">{{ t('landing.footer.links.terms') }}</a>
              </li>
              <li>
                <a href="https://github.com/Smaug6739/Alexandrie/blob/main/LICENSE" target="_blank">{{ t('landing.footer.links.mitLicense') }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="footer-bottom-left">
          <p>&copy; {{ new Date().getFullYear() }} Alexandrie.</p>
          <span class="separator">•</span>
          <p>
            {{ t('landing.footer.madeWith') }} <span class="heart">❤️</span> {{ t('landing.footer.by') }}
            <a href="https://github.com/Smaug6739" target="_blank">Smaug</a>
          </p>
        </div>
      </div>
    </div>

    <!-- Background Elements -->
    <div class="footer-bg">
      <div class="gradient-blur"></div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t, locale, loadLocaleMessages, setLocale } = useI18nT();

const localeCodes = ['en', 'fr', 'de', 'uk', 'ko', 'it'] as const;
type LocaleCode = (typeof localeCodes)[number];

const isLocaleCode = (value: string): value is LocaleCode => localeCodes.includes(value as LocaleCode);

const localeItems = computed(() => {
  const displayNames = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames([locale.value], { type: 'language' }) : null;

  return localeCodes.map(code => ({
    id: code,
    label: capitalize(displayNames?.of(code) ?? code.toUpperCase()),
  }));
});

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const selectLocale = async (nextLocale: string | number) => {
  const normalizedLocale = String(nextLocale);

  if (!isLocaleCode(normalizedLocale) || normalizedLocale === locale.value) {
    return;
  }

  await loadLocaleMessages(normalizedLocale);
  await setLocale(normalizedLocale);
};
</script>

<style scoped lang="scss">
.footer {
  position: relative;
  margin-top: 4rem;
  padding: 0 2rem;
  overflow: hidden;
}

.footer-container {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
}

.footer-main {
  display: grid;
  grid-template-columns: 1.5fr 2.5fr;
  gap: 4rem;
  padding: 4rem 0;
  border-top: 1px solid var(--border);
}

.footer-brand {
  max-width: 320px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
}

.brand-desc {
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.social-links {
  display: flex;
  gap: 12px;

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    color: var(--text-secondary);
    background: var(--surface-raised);
    transition:
      border-color $transition-medium ease,
      color $transition-medium ease,
      background-color $transition-medium ease,
      transform $transition-medium ease;

    &:hover {
      border-color: var(--primary);
      color: white;
      background: var(--primary);
      transform: translateY(-2px);
    }
  }
}

.footer-language-switcher {
  display: grid;
  gap: 0.55rem;
  margin-top: 0.25rem;
}

.language-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.footer-language-select {
  width: min(100%, 260px);
}

.language-trigger-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
  text-align: left;
}

.language-code {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.language-name {
  font-size: 0.95rem;
  font-weight: 600;
}

.language-trigger-icon {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1;
  transform: translateY(-1px);
  transition: transform $transition-medium ease;
}

.language-trigger-icon.open {
  transform: translateY(1px) rotate(180deg);
}

.language-option-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
}

.language-option-code {
  min-width: 2.4rem;
  padding: 0.35rem 0.45rem;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
  text-align: center;
  background: var(--surface-raised);
}

.language-option-name {
  flex: 1;
  overflow: hidden;
  font-size: 0.92rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.language-option-check {
  color: var(--primary);
  font-weight: 700;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.links-column {
  h4 {
    margin-bottom: 1rem;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--text-body);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      margin-bottom: 0.5rem;
    }

    a {
      display: inline-block;
      font-size: 0.9rem;
      color: var(--text-secondary);
      text-decoration: none;
      transition:
        color $transition-fast ease,
        transform $transition-fast ease;

      &:hover {
        color: var(--primary);
        transform: translateX(3px);
      }
    }
  }
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-top: 1px solid var(--border);
}

.footer-bottom-left {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  color: var(--text-secondary);

  a {
    font-weight: 500;
    color: var(--primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .heart {
    display: inline-block;
  }

  .separator {
    opacity: 0.3;
  }
}

.footer-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.gradient-blur {
  position: absolute;
  bottom: -100px;
  left: 50%;
  width: 800px;
  height: 400px;
  background: radial-gradient(ellipse, rgb(99 102 241 / 10%), transparent 70%);
  transform: translateX(-50%);
  filter: blur(60px);
}

@media screen and (width <= 1024px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .footer-brand {
    max-width: 100%;
  }

  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (width <= 640px) {
  .footer {
    padding: 0 1rem;
  }

  .footer-main {
    padding: 3rem 0;
  }

  .footer-links {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .footer-bottom-left {
    flex-direction: column;
    gap: 4px;

    .separator {
      display: none;
    }
  }

  .footer-language-select {
    width: 100%;
  }
}
</style>
