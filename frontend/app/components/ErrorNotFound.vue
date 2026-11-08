<template>
  <main class="error-page">
    <!-- 404 PAGE -->
    <section class="not-found">
      <div class="not-found-content">
        <div class="illustration">
          <div class="illustration-glow"></div>

          <span class="floating-symbol symbol-star">✳</span>
          <span class="floating-symbol symbol-plus">+</span>
          <span class="floating-symbol symbol-dot">·</span>

          <div class="book">
            <div class="book-pages">
              <div class="book-page">
                <div class="page-lines">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
            <div class="book-cover">
              <div class="book-cover-content">
                <span class="book-icon">✧</span>
                <span class="book-title">?</span>
              </div>
            </div>
          </div>

          <div class="shadow"></div>

          <div class="floating-page page-one">
            <span>404</span>
          </div>
          <div class="floating-page page-two">
            <span>...</span>
          </div>
        </div>

        <div class="error-code">404</div>

        <h1 class="error-title">
          Looks like this page<br />
          got lost in the library.
        </h1>

        <p class="error-description">
          We searched every shelf, but couldn't find what you're looking for. Maybe this page has been moved or never existed in the first place.
        </p>

        <div class="error-actions">
          <NuxtLink to="/dashboard" class="primary-button">
            <span>Back to Alexandrie</span>
            <span class="button-arrow">→</span>
          </NuxtLink>

          <button class="secondary-button" @click="$router.back()">Go back</button>
        </div>

        <div class="error-footer">
          <span class="footer-decoration">✦</span>
          Every great discovery starts somewhere.
        </div>
      </div>
    </section>

    <!-- OTHER ERRORS -->
  </main>
</template>

<style lang="scss" scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 48px 24px;
  color: var(--text-body);
}

.not-found {
  width: 100%;
  max-width: 580px;
  text-align: center;
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* --------------------------------
   Illustration
-------------------------------- */

.illustration {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 260px;
  height: 220px;
  margin-bottom: 20px;
}

.illustration-glow {
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: var(--primary);
  opacity: 0.07;
  filter: blur(30px);
}

.book {
  position: relative;
  z-index: 2;
  width: 125px;
  height: 155px;
  transform: rotate(-8deg);
  animation: book-float 4s ease-in-out infinite;
}

.book-pages {
  position: absolute;
  top: 5px;
  right: -8px;
  width: 112px;
  height: 145px;
  border-radius: 5px 9px 9px 5px;
  background: #e8e4f4;
  box-shadow: 4px 4px 0 #d3cce6;
  transform: skewY(3deg);
}

.book-page {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px 5px 5px 2px;
  background: #faf9ff;
  inset: 7px 8px 7px 13px;
}

.page-lines {
  display: flex;
  flex-direction: column;
  gap: 9px;
  width: 60%;
}

.page-lines span {
  height: 3px;
  border-radius: 5px;
  background: #ddd8eb;
}

.page-lines span:nth-child(2) {
  width: 75%;
}

.page-lines span:nth-child(4) {
  width: 55%;
}

.book-cover {
  position: absolute;
  border-radius: 5px 9px 9px 5px;
  background: linear-gradient(145deg, var(--primary), var(--primary-dark, #4930a8));
  box-shadow:
    inset 5px 0 rgb(255 255 255 / 16%),
    5px 8px 18px rgb(50 30 100 / 20%);
  inset: 0;
}

.book-cover-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 9px;
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 3px;
  color: white;
}

.book-icon {
  font-size: 25px;
  opacity: 0.85;
}

.book-title {
  font-family: Georgia, serif;
  font-size: 53px;
  font-weight: bold;
  line-height: 1;
}

.shadow {
  position: absolute;
  bottom: 10px;
  width: 125px;
  height: 15px;
  border-radius: 50%;
  background: var(--primary);
  opacity: 0.12;
  filter: blur(12px);
}

.floating-symbol {
  position: absolute;
  z-index: 3;
  color: var(--primary);
  opacity: 0.55;
}

.symbol-star {
  top: 20px;
  right: 37px;
  font-size: 27px;
  animation: symbol-float 3s ease-in-out infinite;
}

.symbol-plus {
  top: 65px;
  left: 28px;
  font-size: 28px;
  animation: symbol-float 4s ease-in-out infinite reverse;
}

.symbol-dot {
  right: 25px;
  bottom: 40px;
  font-size: 45px;
}

.floating-page {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--border, #e5e0ef);
  border-radius: 5px;
  font-family: monospace;
  font-weight: bold;
  color: var(--primary);
  background: var(--surface, #f1eef9);
  box-shadow: 0 5px 15px rgb(0 0 0 / 6%);
}

.page-one {
  top: 40px;
  left: 15px;
  width: 44px;
  height: 54px;
  transform: rotate(-17deg);
  animation: symbol-float 3.5s ease-in-out infinite;
}

.page-two {
  right: 10px;
  bottom: 25px;
  width: 38px;
  height: 46px;
  transform: rotate(14deg);
  animation: symbol-float 4s ease-in-out infinite reverse;
}

@keyframes book-float {
  0%,
  100% {
    transform: translateY(0) rotate(-8deg);
  }

  50% {
    transform: translateY(-10px) rotate(-5deg);
  }
}

@keyframes symbol-float {
  0%,
  100% {
    translate: 0 0;
  }

  50% {
    translate: 0 -7px;
  }
}

/* --------------------------------
   Typography
-------------------------------- */

.error-code {
  margin-bottom: 14px;
  font-size: 14px;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 0.3em;
}

.error-title {
  margin: 0;
  font-size: clamp(27px, 5vw, 38px);
  font-weight: 750;
  line-height: 1.2;
  color: var(--text-primary);
  letter-spacing: -0.04em;
}

.error-description {
  max-width: 420px;
  margin: 18px auto 28px;
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-secondary);
}

/* --------------------------------
   Actions
-------------------------------- */

.error-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.primary-button,
.secondary-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  min-height: 46px;
  padding: 0 21px;
  border-radius: 9px;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.primary-button {
  border: 1px solid transparent;
  color: white;
  background: var(--primary);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--primary) 25%, transparent);
}

.primary-button:hover {
  box-shadow: 0 7px 18px color-mix(in srgb, var(--primary) 35%, transparent);
  transform: translateY(-2px);
}

.button-arrow {
  font-size: 18px;
  transition: transform 0.2s ease;
}

.primary-button:hover .button-arrow {
  transform: translateX(3px);
}

.secondary-button {
  border: 1px solid var(--border, #ddd);
  color: var(--text-primary);
  background: var(--surface, transparent);
}

.secondary-button:hover {
  background: var(--surface-hover, var(--surface, transparent));
  transform: translateY(-2px);
}

/* --------------------------------
   Footer
-------------------------------- */

.error-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 55px;
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.8;
}

.footer-decoration {
  color: var(--primary);
}

/* --------------------------------
   Accessibility & responsive
-------------------------------- */

@media (width <= 480px) {
  .error-page {
    padding: 32px 20px;
  }

  .illustration {
    margin-bottom: 8px;
    transform: scale(0.9);
  }

  .error-description {
    font-size: 14px;
  }

  .error-footer {
    margin-top: 40px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .book,
  .floating-symbol,
  .floating-page {
    animation: none;
  }

  .primary-button,
  .secondary-button {
    transition: none;
  }
}
</style>
