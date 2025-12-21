<template>
  <section class="final-cta">
    <div class="cta-container">
      <!-- Background Effects -->
      <div class="cta-bg">
        <div class="grid-pattern"></div>
        <div class="glow glow-1"></div>
        <div class="glow glow-2"></div>
      </div>

      <!-- Content -->
      <div class="cta-content">
        <div class="cta-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>Free & Open Source Forever</span>
        </div>

        <h2 class="cta-title">
          Ready to transform your
          <span class="gradient-text">documentation?</span>
        </h2>

        <p class="cta-subtitle">Join thousands of developers who've already made the switch. No credit card required.</p>

        <div class="cta-actions">
          <NuxtLink :prefetch="false" to="/dashboard" class="btn-primary">
            <span>Start Writing Now</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </NuxtLink>
          <a href="https://github.com/Smaug6739/Alexandrie" target="_blank" class="btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
            <span>Star on GitHub</span>
          </a>
        </div>

        <div class="cta-features">
          <div class="feature">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Self-hosted</span>
          </div>
          <div class="feature">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>MIT License</span>
          </div>
          <div class="feature">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>No tracking</span>
          </div>
          <div class="feature">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Active community</span>
          </div>
        </div>

        <!-- Discord Banner -->
        <div class="discord-banner">
          <div class="discord-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
              />
            </svg>
          </div>
          <div class="discord-text">
            <span class="discord-title">Join our community</span>
            <span class="discord-desc">Chat with us and other developers</span>
          </div>
          <a href="https://discord.gg/UPsEg6egPj" target="_blank" class="discord-btn">Join Discord</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.final-cta {
  padding: 2rem;
  margin-bottom: 2rem;
}

.cta-container {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 5rem 3rem;
  background: linear-gradient(135deg, var(--primary), #6366f1, #8b5cf6);
  border-radius: 32px;
  overflow: hidden;
}

// Background Effects
.cta-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent);
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.glow-1 {
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.2);
}

.glow-2 {
  bottom: -100px;
  left: -100px;
  width: 300px;
  height: 300px;
  background: rgba(236, 72, 153, 0.3);
}

// Content
.cta-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
}

.cta-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);

  svg {
    color: #fbbf24;
  }
}

.cta-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1rem;

  .gradient-text {
    display: block;
    background: linear-gradient(90deg, #fff, #e0e7ff, #fff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.cta-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  max-width: 500px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 28px;
  background: white;
  color: var(--primary);
  font-weight: 600;
  font-size: 15px;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

    svg {
      transform: translateX(4px);
    }
  }

  svg {
    transition: transform 0.3s ease;
  }
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 28px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: 600;
  font-size: 15px;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-3px);
  }
}

.cta-features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;

  .feature {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    opacity: 0.9;

    svg {
      color: #a5f3fc;
    }
  }
}

// Discord Banner
.discord-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  background: rgba(88, 101, 242, 0.3);
  border: 1px solid rgba(88, 101, 242, 0.5);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.discord-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #5865f2;
  border-radius: 12px;
  flex-shrink: 0;
}

.discord-text {
  flex: 1;
  text-align: left;
}

.discord-title {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
}

.discord-desc {
  font-size: 0.8rem;
  opacity: 0.8;
}

.discord-btn {
  padding: 10px 18px;
  background: white;
  color: #5865f2;
  font-weight: 600;
  font-size: 13px;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
}

@media screen and (max-width: 768px) {
  .final-cta {
    padding: 1rem;
  }

  .cta-container {
    padding: 3rem 1.5rem;
    border-radius: 24px;
  }

  .cta-actions {
    flex-direction: column;
    align-items: center;
  }

  .cta-features {
    gap: 1rem;
  }

  .discord-banner {
    flex-direction: column;
    text-align: center;
  }

  .discord-text {
    text-align: center;
  }
}
</style>
