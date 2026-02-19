<template>
  <div class="modal-content">
    <h2>{{ t('settings.editor.title') }}</h2>
    <form @submit.prevent>
      <label for="category">{{ t('settings.editor.fontFamily') }}</label>
      <AppSelect v-model="store.get('editorFontFamily').value" :items="EDITOR_FONTS" placeholder="Select theme" />
      <label for="category">{{ t('settings.editor.fontSize') }}</label>
      <input v-model="store.get('editorFontSize').value" type="number" min="1" max="100" placeholder="Select font size" />
      <div class="row">
        <label for="category">{{ t('settings.editor.enableSpellCheck') }}</label>
        <AppToggle v-model="store.get('editorSpellCheck').value" />
      </div>
      <tag>{{ t('settings.editor.enableSpellCheckDesc') }}</tag>
      <div class="row">
        <label for="category">{{ t('settings.editor.displayStatsBar') }}</label>
        <AppToggle v-model="store.get('editorDisplayStats').value" />
      </div>
      <div class="row">
        <label for="category">{{ t('settings.editor.enableSnippets') }}</label>
        <AppToggle v-model="store.get('editorSnippetsEnabled').value" />
      </div>
      <div class="row">
        <label for="category">{{ t('settings.editor.simplifiedMobileView') }}</label>
        <AppToggle v-model="store.get('editorSimplifiedViewOnMobile').value" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { EDITOR_FONTS } from '~/helpers/constants';

const { t } = useI18nT();
const store = usePreferencesStore();
</script>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
}

form {
  padding: 0 5px 25px;
  flex: 1;
  overflow-y: auto;
}

label {
  display: flex;
  align-items: center;
}

textarea {
  height: 50px;
  min-height: 50px;
  max-height: 50px;
  font-size: 14px;
  resize: none;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}
</style>
