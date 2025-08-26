<template>
  <div>
    <h2>Shortcuts</h2>
    <p>List of snippets you can use in the editor.</p>
    <div class="snippets">
      <div class="snippet">
        <span class="key">!blue</span>
        <span>Blue block</span>
      </div>
      <div class="snippet">
        <span class="key">!green</span>
        <span>Green block</span>
      </div>
      <div class="snippet">
        <span class="key">!yellow</span>
        <span>Yellow block</span>
      </div>
      <div class="snippet">
        <span class="key">!grey</span>
        <span>Grey block</span>
      </div>
      <div class="snippet">
        <span class="key">!details</span>
        <span>Details block</span>
      </div>
      <div class="snippet">
        <span class="key">!center</span>
        <span>Center block</span>
      </div>
      <div class="snippet">
        <span class="key">!m</span>
        <span>Mention block</span>
      </div>
      <div class="snippet">
        <span class="key">!property</span>
        <span>Property block</span>
      </div>
      <div class="snippet">
        <span class="key">!warning</span>
        <span>Warning block</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.snippets {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.snippet {
  display: flex;
  padding: 6px;
  border-radius: 5px;
  text-align: left;
  align-items: center;
  gap: 1rem;
}

.key {
  min-width: 35px;
  padding: 3px;
  border: 1px solid var(--blue-border);
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--blue);
  background-color: var(--blue-bg);
}
</style>
