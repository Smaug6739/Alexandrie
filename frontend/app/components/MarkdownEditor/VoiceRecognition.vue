<template>
  <button :class="{ recording: isRecording }" :title="isRecording ? 'Stop recording' : 'Start voice recognition'" @click="toggleRecording">
    <Icon v-if="!isRecording" name="voice/default" />
    <Icon v-else name="voice/recording" />
  </button>
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
button {
  display: flex;
  width: 28px;
  height: 28px;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  align-items: center;
  cursor: pointer;
  justify-content: center;

  &:hover {
    background-color: var(--bg-contrast-2);
  }

  &.recording {
    animation: pulse 2s infinite;
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
