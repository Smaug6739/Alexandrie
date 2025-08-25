<template>
  <div class="voice-recognition">
    <div style="font-size: 10px; color: red">Debug: {{ isRecording }} | Icon: {{ isRecording ? 'CLOSED' : 'OPEN' }}</div>
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
const emit = defineEmits<{
  (e: 'transcription', text: string): void;
}>();

const isRecording = ref(false);
const recognition = ref<any>(null);
const lastTranscribedText = ref('');
const transcriptionBuffer = ref<string[]>([]);
const isProcessing = ref(false);
const recordingStartTime = ref(0);

const language = ref('fr-FR');

const startRecording = () => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Speech recognition not supported in this browser');
    return;
  }

  lastTranscribedText.value = '';
  transcriptionBuffer.value = [];
  isProcessing.value = false;
  recordingStartTime.value = Date.now();
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  recognition.value = new SpeechRecognition();

  recognition.value.continuous = true;
  recognition.value.interimResults = false;
  recognition.value.maxAlternatives = 1;
  recognition.value.lang = language.value;

  recognition.value.onstart = () => {
    console.log('Speech recognition started, setting isRecording to true');
    isRecording.value = true;
  };

  recognition.value.onresult = (event: any) => {
    if (isProcessing.value) return;

    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
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

  recognition.value.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);

    if (event.error === 'no-speech' || event.error === 'audio-capture') {
      console.log('No speech detected, continuing recording...');
      return;
    }

    isRecording.value = false;
  };

  recognition.value.onend = () => {
    const recordingDuration = Date.now() - recordingStartTime.value;
    console.log('Speech recognition ended after', recordingDuration, 'ms');

    if (recordingDuration < 1000) {
      console.log('Recording too short, restarting...');
      if (recognition.value) {
        recognition.value.start();
      }
      return;
    }

    isRecording.value = false;
  };

  recognition.value.start();
};

const stopRecording = () => {
  const recordingDuration = Date.now() - recordingStartTime.value;

  if (recordingDuration < 1000) {
    console.log('Recording too short, not stopping yet');
    return;
  }

  if (recognition.value) {
    recognition.value.stop();
    recognition.value = null;
  }
  isRecording.value = false;
  console.log('Recording stopped after', recordingDuration, 'ms');
};

const toggleRecording = () => {
  console.log('Toggle recording called, current state:', isRecording.value);
  if (isRecording.value) {
    console.log('Stopping recording...');
    stopRecording();
  } else {
    console.log('Starting recording...');
    startRecording();
  }
  console.log('New recording state:', isRecording.value);
};

onUnmounted(() => {
  if (recognition.value) {
    recognition.value.stop();
  }
});
</script>

<style scoped lang="scss">
.voice-recognition {
  display: inline-block;
}

.btn {
  display: flex;
  margin: 0;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s;
  align-items: center;
  justify-content: center;
  transform: none;
  border: none;
  background: none;
  cursor: pointer;
  width: 32px;
  height: 32px;

  &:hover {
    background-color: var(--primary-bg);
  }

  &.recording {
    background-color: var(--error-bg);
    animation: pulse 2s infinite;
  }

  svg {
    width: 24px;
    height: 24px;
    stroke: var(--font-color-dark);
    fill: none;
    display: block;
  }

  &.recording svg {
    stroke: var(--error);
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
