<template>
  <div>
    <h1>Shortcuts</h1>
    <p>Here you can see the shortcuts for the different pages of the dashboard.</p>
    <h2>All pages</h2>
    <div class="shortcuts">
      <div class="shortcut">
        <kbd>Ctrl + q</kbd>
        <span>Open quick search</span>
      </div>
      <div class="shortcut">
        <kbd>Ctrl + k</kbd>
        <span>Open command center and navigate</span>
      </div>
      <div class="shortcut">
        <kbd>Ctrl + U</kbd>
        <span>Open CDN uploader</span>
      </div>
      <div class="shortcut">
        <kbd>Ctrl + Alt + N</kbd>
        <span>Create a new category</span>
      </div>
      <div class="shortcut">
        <kbd>Ctrl + r</kbd>
        <span>Reload the page</span>
      </div>
      <div class="shortcut">
        <kbd>Ctrl + s</kbd>
        <span>Save the current page</span>
      </div>
      <div class="shortcut">
        <kbd>Ctrl + p</kbd>
        <span>Print the page</span>
      </div>
    </div>
    <h2>Document page</h2>
    <div class="shortcuts">
      <div class="shortcut">
        <kbd>e</kbd>
        <span>Edit the document</span>
      </div>
      <div class="shortcut">
        <kbd>n</kbd>
        <span>Go to next document</span>
      </div>
      <div class="shortcut">
        <kbd>p</kbd>
        <span>Go to previous document</span>
      </div>
    </div>
    <h2>Editor page</h2>
    <div class="shortcuts">
      <div class="shortcut">
        <kbd>Ctrl + s</kbd>
        <span>Save the document</span>
      </div>
      <div class="shortcut">
        <kbd>Ctrl + p</kbd>
        <span>Toggle preview</span>
      </div>
      <div class="shortcut">
        <kbd>Esc</kbd>
        <span>Exit the page</span>
      </div>
      <div class="shortcut">
        <kbd>Ctrl + z</kbd>
        <span>Undo the last action</span>
      </div>
      <div class="shortcut">
        <kbd>Ctrl + y</kbd>
        <span>Redo the last action</span>
      </div>
      <div class="shortcut">
        <kbd>Ctrl + b</kbd>
        <span>Bold text</span>
      </div>
      <div class="shortcut">
        <kbd>Ctrl + i</kbd>
        <span>Italic text</span>
      </div>
      <div class="shortcut">
        <kbd>Ctrl + u</kbd>
        <span>Underline text</span>
      </div>
      <div class="shortcut">
        <kbd>Ctrl + l</kbd>
        <span>Insert link</span>
      </div>
      <div class="shortcut">
        <kbd>Ctrl + e</kbd>
        <span>Insert image</span>
      </div>
    </div>
    <h2>Search page</h2>
    <div class="shortcuts">
      <div class="shortcut">
        <kbd>Tab</kbd>
        <span>Next search result</span>
      </div>
      <div class="shortcut">
        <kbd>Shift + Tab</kbd>
        <span>Previous search result</span>
      </div>
      <div class="shortcut">
        <kbd>Enter</kbd>
        <span>Open the selected search result</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shortcuts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shortcut {
  display: flex;
  padding: 6px;
  border-radius: 5px;
  text-align: left;
  align-items: center;
  gap: 1rem;
}
</style>
