<template>
  <section class="bento-section">
    <div class="section-header">
      <h2 class="section-title">Everything you need to write better</h2>
      <p class="section-subtitle">Powerful features packed into a beautiful, intuitive interface</p>
    </div>

    <div class="bento-grid">
      <!-- Large Feature Card - Markdown Editor -->
      <div class="bento-card card-large card-editor">
        <div class="card-content">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </div>
          <h3>Powerful Markdown Editor</h3>
          <p>Write with syntax highlighting, live preview, and keyboard shortcuts. Support for tables, code blocks, math equations, and more.</p>
        </div>
        <div class="card-visual">
          <div class="editor-preview">
            <div class="editor-line">
              <span class="syntax-heading"># </span>
              <span class="syntax-text">Welcome to Alexandrie</span>
            </div>
            <div class="editor-line">
              <span class="syntax-text">Write your notes in </span>
              <span class="syntax-bold">**Markdown**</span>
            </div>
            <div class="editor-line">
              <span class="syntax-code">`code`</span>
              <span class="syntax-text"> and </span>
              <span class="syntax-link">[links]()</span>
            </div>
            <div class="editor-line">
              <span class="syntax-list">- </span>
              <span class="syntax-text">Lists are easy</span>
            </div>
            <div class="cursor"></div>
          </div>
        </div>
      </div>

      <!-- Tall Card - Organization -->
      <div class="bento-card card-tall card-organize">
        <div class="card-content">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3>Smart Organization</h3>
          <p>Nested folders, workspaces, tags, and powerful search to keep everything in its place.</p>
        </div>
        <div class="card-visual">
          <div class="folder-tree">
            <div class="folder-item">
              <span class="folder-icon"><Icon name="folder" fill="var(--yellow)" /></span>
              <span>Projects</span>
            </div>
            <div class="folder-item nested">
              <span class="folder-icon"><Icon name="file" fill="var(--primary)" /></span>
              <span>Roadmap.md</span>
            </div>
            <div class="folder-item nested">
              <span class="folder-icon"><Icon name="file" fill="var(--primary)" /></span>
              <span>Ideas.md</span>
            </div>
            <div class="folder-item">
              <span class="folder-icon"><Icon name="folder" fill="var(--yellow)" /></span>
              <span>Knowledge Base</span>
            </div>
            <div class="folder-item nested">
              <span class="folder-icon"><Icon name="folder" fill="var(--yellow)" /></span>
              <span>Development</span>
            </div>
            <div class="folder-item nested-2">
              <span class="folder-icon"><Icon name="file" fill="var(--primary)" /></span>
              <span>React Tips.md</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Medium Card - Real-time Collab -->
      <div class="bento-card card-medium card-collab">
        <div class="card-content">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3>Collaborate and share</h3>
          <p>Work together with your team. Share notes, manage permissions, and more.</p>
        </div>
        <div class="card-visual">
          <div class="collab-avatars">
            <div class="avatar-stack">
              <img src="https://i.pravatar.cc/40?img=1" alt="User 1" />
              <img src="https://i.pravatar.cc/40?img=2" alt="User 2" />
              <img src="https://i.pravatar.cc/40?img=3" alt="User 3" />
              <span class="avatar-more">+2</span>
            </div>
            <span class="editing-text">3 people editing...</span>
          </div>
        </div>
      </div>

      <!-- Small Card - CDN -->
      <div class="bento-card card-small card-cdn">
        <div class="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <h3>Built-in CDN</h3>
        <p>Upload images & files</p>
      </div>

      <!-- Small Card - Themes -->
      <div class="bento-card card-small card-themes">
        <div class="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </div>
        <h3>Dark & Light</h3>
        <p>Themes for every mood</p>
        <p>Also change the colors, document themes, add some custom colors, icons, and more.</p>
      </div>

      <!-- Wide Card - Search -->
      <div class="bento-card card-wide card-search">
        <div class="card-content">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <h3>Lightning Fast Search</h3>
          <p>Full-text search across all your documents. Find anything in milliseconds.</p>
        </div>
        <div class="card-visual">
          <div class="search-demo">
            <div class="search-input">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <span>react hooks...</span>
              <span class="kbd">⌘K</span>
            </div>
            <div class="search-results">
              <div class="search-result">
                <span class="result-icon"><Icon name="file" fill="var(--primary)" /></span>
                <div class="result-content">
                  <span class="result-title">React Hooks Guide</span>
                  <span class="result-path">Knowledge Base / Development</span>
                </div>
              </div>
              <div class="search-result">
                <span class="result-icon"><Icon name="file" fill="var(--primary)" /></span>
                <div class="result-content">
                  <span class="result-title">Custom Hooks</span>
                  <span class="result-path">Projects / Frontend</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Medium Card - Publish -->
      <div class="bento-card card-medium card-publish">
        <div class="card-content">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </div>
          <h3>One-Click Publish</h3>
          <p>Share your work publicly or with specific people. Generate beautiful read-only pages.</p>
        </div>
        <div class="card-visual">
          <div class="publish-preview">
            <div class="url-bar">
              <span class="lock">🔒</span>
              <span>docs.yoursite.com/guide</span>
            </div>
            <div class="status-badge published">
              <span class="dot"></span>
              Live
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.bento-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 6rem 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--font-color-light);
  max-width: 500px;
  margin: 0 auto;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, auto);
  gap: 1.25rem;
}

.bento-card {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 1.5rem;
  overflow: hidden;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
    border-color: var(--primary);
  }

  .card-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-contrast);
    border-radius: 12px;
    margin-bottom: 1rem;
    color: var(--primary);
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.9rem;
    color: var(--font-color-light);
    line-height: 1.6;
  }
}

// Card Sizes
.card-large {
  grid-column: span 2;
  grid-row: span 2;
  display: flex;
  flex-direction: column;
}

.card-tall {
  grid-column: span 1;
  grid-row: span 2;
}

.card-medium {
  grid-column: span 1;
  grid-row: span 1;
}

.card-small {
  grid-column: span 1;
  grid-row: span 1;
  padding: 1.25rem;

  .card-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 0.75rem;
  }

  h3 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.8rem;
  }
}

.card-wide {
  grid-column: span 2;
  grid-row: span 1;
  display: flex;
  align-items: center;
  gap: 2rem;

  .card-content {
    flex: 1;
  }
}

// Editor Card Visual
.card-editor {
  background: linear-gradient(135deg, var(--bg-color), var(--bg-contrast));

  .card-visual {
    flex: 1;
    display: flex;
    align-items: flex-end;
  }

  .editor-preview {
    width: 100%;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 13px;
    line-height: 1.8;
  }

  .editor-line {
    white-space: nowrap;
    overflow: hidden;
  }

  .syntax-heading {
    color: var(--primary);
    font-weight: 700;
  }

  .syntax-text {
    color: var(--font-color);
  }

  .syntax-bold {
    color: var(--purple);
    font-weight: 700;
  }

  .syntax-code {
    color: var(--green);
    background: var(--green-bg);
    padding: 2px 6px;
    border-radius: 4px;
  }

  .syntax-link {
    color: var(--blue);
    text-decoration: underline;
  }

  .syntax-list {
    color: var(--yellow);
  }

  .cursor {
    width: 2px;
    height: 16px;
    background: var(--primary);
    display: inline-block;
    margin-left: 2px;
    vertical-align: text-bottom;
  }
}

// Organization Card Visual
.card-organize {
  .card-visual {
    margin-top: auto;
    padding-top: 1rem;
  }

  .folder-tree {
    font-size: 13px;
  }

  .folder-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-radius: 8px;
    transition: background 0.2s;

    &:hover {
      background: var(--bg-contrast);
    }

    &.nested {
      margin-left: 1.25rem;
    }

    &.nested-2 {
      margin-left: 2.5rem;
    }
  }

  .folder-icon {
    font-size: 16px;
  }
}

// Collab Card Visual
.card-collab {
  .card-visual {
    margin-top: auto;
    padding-top: 1rem;
  }

  .collab-avatars {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .avatar-stack {
    display: flex;

    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid var(--bg-color);
      margin-left: -8px;

      &:first-child {
        margin-left: 0;
      }
    }

    .avatar-more {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      font-size: 11px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: -8px;
      border: 2px solid var(--bg-color);
    }
  }

  .editing-text {
    font-size: 12px;
    color: var(--font-color-light);
  }
}

// Search Card Visual
.card-search {
  .card-visual {
    flex: 1.2;
  }

  .search-demo {
    background: var(--bg-contrast);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    overflow: hidden;
  }

  .search-input {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-bottom: 1px solid var(--border-color);
    font-size: 14px;
    color: var(--font-color-light);

    .kbd {
      margin-left: auto;
      padding: 4px 8px;
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
    }
  }

  .search-results {
    padding: 8px;
  }

  .search-result {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: var(--bg-color);
    }

    .result-icon {
      font-size: 20px;
    }

    .result-content {
      display: flex;
      flex-direction: column;
    }

    .result-title {
      font-weight: 600;
      font-size: 13px;
    }

    .result-path {
      font-size: 11px;
      color: var(--font-color-light);
    }
  }
}

// Publish Card Visual
.card-publish {
  .card-visual {
    margin-top: auto;
    padding-top: 1rem;
  }

  .publish-preview {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    background: var(--bg-contrast);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    font-size: 13px;
  }

  .url-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--font-color-light);
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;

    &.published {
      background: var(--green-bg);
      color: var(--green);

      .dot {
        width: 6px;
        height: 6px;
        background: var(--green);
        border-radius: 50%;
      }
    }
  }
}

// Themes Card
.card-themes {
  background: linear-gradient(135deg, var(--bg-contrast), var(--bg-color));
  .card-icon {
    background: var(--purple-bg);
    color: var(--purple);
  }
}

// CDN Card
.card-cdn {
  background: linear-gradient(135deg, var(--bg-contrast), var(--bg-color));

  .card-icon {
    background: var(--purple-bg);
    color: var(--purple);
  }
}

// Responsive
@media screen and (max-width: 1200px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .card-large {
    grid-column: span 2;
    grid-row: span 1;
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }

  .card-tall {
    grid-column: span 1;
    grid-row: span 1;
  }

  .card-wide {
    grid-column: span 2;
  }
}

@media screen and (max-width: 768px) {
  .bento-section {
    padding: 4rem 1rem;
  }

  .bento-grid {
    grid-template-columns: 1fr;
  }

  .card-large,
  .card-wide {
    grid-column: span 1;
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
