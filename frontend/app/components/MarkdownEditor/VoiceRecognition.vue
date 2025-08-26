<template>
  <div class="voice-recognition">
    <button :class="['btn', { recording: isRecording }]" :title="isRecording ? 'Stop recording' : 'Start voice recognition'" @click="toggleRecording">
      <svg
        v-if="!isRecording"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
        <path d="M12 19v3" />
        <path d="M8 22h8" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
        <path d="M12 19v3" />
        <path d="M8 22h8" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: 'transcription', text: string): void }>();

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}

const isRecording = ref(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const recognition = ref<any>();
const lastTranscribedText = ref('');
const transcriptionBuffer = ref<string[]>([]);
const isProcessing = ref(false);
const recordingStartTime = ref(0);

const language = 'fr-FR';

const startRecording = () => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Speech recognition not supported in this browser');
    return;
  }

  lastTranscribedText.value = '';
  transcriptionBuffer.value = [];
  isProcessing.value = false;
  recordingStartTime.value = Date.now();
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition.value = new SpeechRecognition();

  recognition.value.continuous = true;
  recognition.value.interimResults = false;
  recognition.value.maxAlternatives = 1;
  recognition.value.lang = language;

  recognition.value.onstart = () => (isRecording.value = true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.value.onresult = (event: any) => {
    if (isProcessing.value) return;

    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i]?.[0]?.transcript;
      if (event.results[i]?.isFinal) {
        finalTranscript += transcript;
      }
    }

    if (finalTranscript && finalTranscript.trim()) {
      const cleanText = finalTranscript.trim();

      if (cleanText.length > 0 && cleanText !== lastTranscribedText.value) {
        isProcessing.value = true;

        lastTranscribedText.value = cleanText;
        isProcessing.value = false;
        return emit('transcription', cleanText);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.value.onerror = (event: any) => {
    if (event.error === 'no-speech' || event.error === 'audio-capture') return;
    isRecording.value = false;
  };

  recognition.value.onend = () => {
    isRecording.value = false;
  };

  recognition.value.start();
};

const stopRecording = () => {
  if (recognition.value) {
    recognition.value.stop();
    recognition.value = undefined;
  }
  isRecording.value = false;
};

const toggleRecording = () => {
  if (isRecording.value) stopRecording();
  else startRecording();
};

onUnmounted(() => {
  if (recognition.value) recognition.value.stop();
});
</script>

<style scoped lang="scss">
.voice-recognition {
  display: inline-block;
}

.btn {
  display: flex;
  width: 32px;
  height: 32px;
  margin: 0;
  padding: 4px;
  border: none;
  border-radius: 50%;
  background: none;
  transition: all 0.2s;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  transform: none;

  &:hover {
    background-color: var(--primary-bg);
  }

  &.recording {
    animation: pulse 2s infinite;
  }

  svg {
    display: block;
    width: 24px;
    height: 24px;
    fill: none;
    stroke: var(--font-color-dark);
  }

  &.recording svg {
    stroke: var(--font-color);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>
