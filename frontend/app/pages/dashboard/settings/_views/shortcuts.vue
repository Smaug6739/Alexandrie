<template>
  <div>
    <h2 class="page-title">Shortcuts</h2>
    <p class="page-subtitle">Here you can see the shortcuts for the different pages of the dashboard.</p>
    <p>{{ t('application.shortcuts.sections.general') }}</p>
    <div class="shortcuts">
      <div class="shortcut">
        <span>{{ t('application.shortcuts.openCmdCenter') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>K</kbd> or <kbd>/</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.openCDN') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>U</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.createDocument') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>C</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.createCategory') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>N</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.reloadPage') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>R</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.savePage') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>S</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.printPage') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>P</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.closeModal') }}</span>
        <span><kbd>Esc</kbd></span>
      </div>
    </div>
    <p>{{ t('application.shortcuts.sections.document') }}</p>
    <div class="shortcuts">
      <div class="shortcut">
        <span>{{ t('application.shortcuts.editDocument') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>E</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.nextDocument') }}</span>
        <span><kbd>ArrowRight</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.prevDocument') }}</span>
        <span><kbd>ArrowLeft</kbd></span>
      </div>
    </div>
    <p>{{ t('application.shortcuts.sections.editor') }}</p>
    <div class="shortcuts">
      <div class="shortcut">
        <span>{{ t('application.shortcuts.savePage') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>S</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.togglePreview') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>P</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.exitPage') }}</span>
        <span><kbd>Esc</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.openFindDialog') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>F</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.undoAction') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>Z</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.redoAction') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>Y</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.copyText') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>C</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.cutText') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>X</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.pasteText') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>V</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.boldText') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>B</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.italicText') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>I</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.underlineText') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>U</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.insertLink') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>L</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.insertImage') }}</span>
        <span><kbd>Ctrl</kbd> <kbd>E</kbd></span>
      </div>
    </div>
    <p>{{ t('application.shortcuts.sections.search') }}</p>
    <div class="shortcuts">
      <div class="shortcut">
        <span>{{ t('application.shortcuts.nextSearchResult') }}</span>
        <span><kbd>Tab</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.prevSearchResult') }}</span>
        <span><kbd>Shift</kbd> <kbd>Tab</kbd></span>
      </div>
      <div class="shortcut">
        <span>{{ t('application.shortcuts.openSelectedSearchResult') }}</span>
        <span><kbd>Enter</kbd></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18nT();
</script>

<style scoped lang="scss">
.shortcuts {
  display: flex;
  border-radius: var(--radius-lg);
  font-size: 16px;
  font-weight: 400;
  background-color: var(--surface-transparent);
  flex-direction: column;
  gap: 8px;
  text-size-adjust: 100%;
}

p {
  font-size: 17px;
}

.shortcut {
  display: flex;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  text-align: left;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;

  &:hover {
    background-color: var(--surface-transparent);
  }
}
</style>
