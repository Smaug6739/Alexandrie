<template>
  <div>
    <h2 class="app-title">Shortcuts</h2>
    <p class="app-subtitle">Here you can see the shortcuts for the different pages of the dashboard.</p>
    <p>General</p>
    <div class="shortcuts">
      <div class="shortcut">
        <span>Open command center and navigate</span>
        <span><kbd>Ctrl</kbd> <kbd>K</kbd> or <kbd>/</kbd></span>
      </div>
      <div class="shortcut">
        <span>Open CDN uploader</span>
        <span><kbd>Ctrl</kbd> <kbd>U</kbd></span>
      </div>
      <div class="shortcut">
        <span>Create a new document</span>
        <span><kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>C</kbd></span>
      </div>
      <div class="shortcut">
        <span>Create a new category</span>
        <span><kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>N</kbd></span>
      </div>
      <div class="shortcut">
        <span>Reload the page</span>
        <span><kbd>Ctrl</kbd> <kbd>R</kbd></span>
      </div>
      <div class="shortcut">
        <span>Save the current page</span>
        <span><kbd>Ctrl</kbd> <kbd>S</kbd></span>
      </div>
      <div class="shortcut">
        <span>Print the page</span>
        <span><kbd>Ctrl</kbd> <kbd>P</kbd></span>
      </div>
      <div class="shortcut">
        <span>Close the current modal</span>
        <span><kbd>Esc</kbd></span>
      </div>
    </div>
    <p>Document page</p>
    <div class="shortcuts">
      <div class="shortcut">
        <span>Edit the document</span>
        <span><kbd>Ctrl</kbd> <kbd>E</kbd></span>
      </div>
      <div class="shortcut">
        <span>Go to next document</span>
        <span><kbd>ArrowRight</kbd></span>
      </div>
      <div class="shortcut">
        <span>Go to previous document</span>
        <span><kbd>ArrowLeft</kbd></span>
      </div>
    </div>
    <p>Editor page</p>
    <div class="shortcuts">
      <div class="shortcut">
        <span>Save the document</span>
        <span><kbd>Ctrl</kbd> <kbd>S</kbd></span>
      </div>
      <div class="shortcut">
        <span>Toggle preview</span>
        <span><kbd>Ctrl</kbd> <kbd>P</kbd></span>
      </div>
      <div class="shortcut">
        <span>Exit the page</span>
        <span><kbd>Esc</kbd></span>
      </div>
      <div class="shortcut">
        <span>Open the find dialog</span>
        <span><kbd>Ctrl</kbd> <kbd>F</kbd></span>
      </div>
      <div class="shortcut">
        <span>Undo the last action</span>
        <span><kbd>Ctrl</kbd> <kbd>Z</kbd></span>
      </div>
      <div class="shortcut">
        <span>Redo the last action</span>
        <span><kbd>Ctrl</kbd> <kbd>Y</kbd></span>
      </div>
      <div class="shortcut">
        <span>Copy the selected text or line if no selection</span>
        <span><kbd>Ctrl</kbd> <kbd>C</kbd></span>
      </div>
      <div class="shortcut">
        <span>Cut the selected text or line if no selection</span>
        <span><kbd>Ctrl</kbd> <kbd>X</kbd></span>
      </div>
      <div class="shortcut">
        <span>Paste from clipboard</span>
        <span><kbd>Ctrl</kbd> <kbd>V</kbd></span>
      </div>
      <div class="shortcut">
        <span>Bold text</span>
        <span><kbd>Ctrl</kbd> <kbd>B</kbd></span>
      </div>
      <div class="shortcut">
        <span>Italic text</span>
        <span><kbd>Ctrl</kbd> <kbd>I</kbd></span>
      </div>
      <div class="shortcut">
        <span>Underline text</span>
        <span><kbd>Ctrl</kbd> <kbd>U</kbd></span>
      </div>
      <div class="shortcut">
        <span>Insert link</span>
        <span><kbd>Ctrl</kbd> <kbd>L</kbd></span>
      </div>
      <div class="shortcut">
        <span>Insert image</span>
        <span><kbd>Ctrl</kbd> <kbd>E</kbd></span>
      </div>
    </div>
    <p>Search page</p>
    <div class="shortcuts">
      <div class="shortcut">
        <span>Next search result</span>
        <span><kbd>Tab</kbd></span>
      </div>
      <div class="shortcut">
        <span>Previous search result</span>
        <span><kbd>Shift</kbd> <kbd>Tab</kbd></span>
      </div>
      <div class="shortcut">
        <span>Open the selected search result</span>
        <span><kbd>Enter</kbd></span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shortcuts {
  display: flex;
  border-radius: 12px;
  font-family: Inter;
  font-size: 16px;
  font-weight: 400;
  background-color: var(--bg-ui);
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
  border-radius: 8px;
  text-align: left;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;

  &:hover {
    background-color: var(--bg-ui);
  }
}
</style>
