<!-- This components is a modal for advanced editing document metadata -->
<template>
  <div class="modal-content">
    <h2>Editor preferences</h2>
    <form @submit.prevent>
      <label for="category">Font family</label>
      <AppSelect v-model="store.get('editorFontFamily').value" :items="EDITOR_FONTS" placeholder="Select theme" />
      <label for="category">Font size</label>
      <input v-model="store.get('editorFontSize').value" type="number" min="1" max="100" placeholder="Select font size" />
      <div style="display: flex; align-items: center; gap: 10px; margin-top: 15px">
        <label for="category">Spell check</label>
        <AppToggle v-model="store.get('editorSpellCheck').value" />
      </div>
      <tag>Note: Enabling spell check can take effect after restarting the editor (reload the page)</tag>
    </form>
  </div>
</template>

<script setup lang="ts">
const store = usePreferences();
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
</style>
