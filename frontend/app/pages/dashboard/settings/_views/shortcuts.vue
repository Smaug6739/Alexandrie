<template>
  <h1>Shortcuts</h1>
  <p>Here you can see the shortcuts for the different pages of the dashboard.</p>
  <h2>All pages</h2>
  <div class="shortcuts">
    <div class="shortcut">
      <span class="key">Ctrl + q</span>
      <span>Open quick search</span>
    </div>
    <div class="shortcut">
      <span class="key">Ctrl + r</span>
      <span>Reload the page</span>
    </div>
    <div class="shortcut">
      <span class="key">Ctrl + s</span>
      <span>Save the current page</span>
    </div>
    <div class="shortcut">
      <span class="key">Ctrl + p</span>
      <span>Print the page</span>
    </div>
  </div>
  <h2>Document page</h2>
  <div class="shortcuts">
    <div class="shortcut">
      <span class="key">e</span>
      <span>Edit the document</span>
    </div>
    <div class="shortcut">
      <span class="key">n</span>
      <span>Go to next document</span>
    </div>
    <div class="shortcut">
      <span class="key">p</span>
      <span>Go to previous document</span>
    </div>
  </div>
  <h2>Editor page</h2>
  <div class="shortcuts">
    <div class="shortcut">
      <span class="key">Ctrl + s</span>
      <span>Save the document</span>
    </div>
    <div class="shortcut">
      <span class="key">Ctrl + p</span>
      <span>Toggle preview</span>
    </div>
    <div class="shortcut">
      <span class="key">Esc</span>
      <span>Exit the page</span>
    </div>
    <div class="shortcut">
      <span class="key">Ctrl + z</span>
      <span>Undo the last action</span>
    </div>
    <div class="shortcut">
      <span class="key">Ctrl + y</span>
      <span>Redo the last action</span>
    </div>
    <div class="shortcut">
      <span class="key">Ctrl + b</span>
      <span>Bold text</span>
    </div>
    <div class="shortcut">
      <span class="key">Ctrl + i</span>
      <span>Italic text</span>
    </div>
    <div class="shortcut">
      <span class="key">Ctrl + u</span>
      <span>Underline text</span>
    </div>
    <div class="shortcut">
      <span class="key">Ctrl + l</span>
      <span>Insert link</span>
    </div>
    <div class="shortcut">
      <span class="key">Ctrl + l</span>
      <span>Insert image</span>
    </div>
  </div>
  <h2>Search page</h2>
  <div class="shortcuts">
    <div class="shortcut">
      <span class="key">Tab</span>
      <span>Next search result</span>
    </div>
    <div class="shortcut">
      <span class="key">Shift + Tab</span>
      <span>Previous search result</span>
    </div>
    <div class="shortcut">
      <span class="key">Enter</span>
      <span>Open the selected search result</span>
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
  align-items: center;
  gap: 1rem; // ajuste cet espace selon tes besoins
  padding: 6px;
  border-radius: 5px;
  text-align: left; // s'assure que le texte est bien aligné à gauche
}

.key {
  font-weight: bold;
  font-size: 0.8rem;
  background-color: var(--blue-bg);
  border: 1px solid var(--blue-border);
  color: var(--blue);
  padding: 3px;
  border-radius: 5px;
}
</style>
