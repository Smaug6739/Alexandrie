<template>
  <h2>Shortcuts</h2>
  <p>List of snippets you can use in the editor.</p>
  <!--
The snippets:
'!blue': ':::blue\n$0\n:::',
  '!green': ':::green\n$0\n:::',
  '!yellow': ':::yellow\n$0\n:::',
  '!grey': ':::grey\n$0\n:::',
  '!details': ':::details\n$0\n:::',
  '!center': ':::center\n$0\n:::',
  '!m': '\$$0\$',
  '!property': ':::property $0\n\n:::',
  '!warning': ':::warning $0\n\n:::',		
-->
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
</template>

<style scoped lang="scss">
.snippets {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.snippet {
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
  min-width: 35px;
}
</style>
