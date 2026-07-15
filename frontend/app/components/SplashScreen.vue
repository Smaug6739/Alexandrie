<template>
  <div id="splash-screen">
    <div class="background-glow"></div>

    <div class="splash-content">
      <div class="logo-card">
        <img src="/Logo/Alexandrie-logo-light.png" alt="Alexandrie" class="splash-logo" width="128" height="128" />
      </div>

      <h1 class="splash-title">Alexandrie</h1>
      <p class="splash-subtitle">Your Notes, Beautifully Organized</p>

      <div class="loading-line">
        <div class="loading-highlight"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#splash-screen {
  position: fixed;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Inter;
  background: radial-gradient(circle at top, #f8f9ff 0%, #fff 55%), #fff;
  transition:
    opacity 0.45s ease,
    visibility 0.45s ease;
  inset: 0;
  overflow: hidden;
  user-select: none;
}

.background-glow {
  position: absolute;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgb(57 86 231 / 12%), transparent 70%);
  animation: glow 5s ease-in-out infinite alternate;
  filter: blur(25px);
}

.splash-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: appear 0.8s cubic-bezier(0.22, 0.8, 0.25, 1);
}

.logo-card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 170px;
  height: 170px;
  border: 1px solid rgb(255 255 255 / 75%);
  border-radius: 36px;
  background: rgb(255 255 255 / 75%);
  box-shadow:
    0 20px 60px rgb(20 20 30 / 8%),
    inset 0 1px 1px rgb(255 255 255 / 90%);
  animation: floating 4s ease-in-out infinite;
  backdrop-filter: blur(18px);
}

.splash-logo {
  width: 128px;
  height: 128px;
}

.splash-title {
  margin-top: 34px;
  margin-bottom: 8px;
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.04em;
}

.splash-subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: #8d93a6;
  letter-spacing: 0.02em;
}

#splash-screen.fade-out {
  opacity: 0;
  visibility: hidden;
}

/* Animations */

@keyframes appear {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes floating {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

@keyframes glow {
  from {
    opacity: 0.7;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1.08);
  }
}

.loading-line {
  width: 48px;
  height: 2px;
  margin-top: 28px;
  border-radius: 999px;
  background: rgb(17 24 39 / 8%);
  overflow: hidden;
}

.loading-highlight {
  width: 45%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, transparent, #3956e7, transparent);
  animation: loadingLine 1.4s ease-in-out infinite;
}

@keyframes loadingLine {
  from {
    transform: translateX(-170%);
  }

  to {
    transform: translateX(170%);
  }
}
</style>
