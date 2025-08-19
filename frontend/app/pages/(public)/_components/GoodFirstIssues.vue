<template>
  <section class="good-first-issues">
    <h2>Good first issues</h2>
    <div class="issues-grid">
      <a v-for="issue in issues" :key="issue.id" :href="issue.html_url" target="_blank" class="issue">
        <div class="top">
          <span class="label" v-for="label in visibleLabels(issue.labels)" :key="label.id">{{ label.name }}</span>
        </div>
        <div class="title">{{ issue.title }}</div>
        <div class="meta">#{{ issue.number }} • {{ new Date(issue.created_at).toLocaleDateString() }}</div>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Label { id: number; name: string }
interface Issue { id: number; number: number; title: string; html_url: string; labels: Label[]; created_at: string }

const owner = 'Smaug6739'
const repo = 'Alexandrie'
const issues = ref<Issue[]>([])

function visibleLabels(labels: any[]): Label[] {
  return (labels || []).filter(l => typeof l?.name === 'string').slice(0, 3)
}

async function fetchIssues() {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?labels=good%20first%20issue&state=open&per_page=6`)
    if (!res.ok) return
    const data = await res.json()
    issues.value = Array.isArray(data) ? data as Issue[] : []
  } catch {}
}

onMounted(fetchIssues)
</script>

<style scoped lang="scss">
.good-first-issues { margin: 4rem auto; text-align: center; max-width: 1100px }
.issues-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-top: 14px }
.issue { display: block; border: 1px solid var(--border-color); border-radius: 12px; padding: 14px; text-decoration: none; color: inherit; background: var(--bg-color); transition: transform .2s ease, box-shadow .2s ease }
.issue:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,.12) }
.top { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 6px }
.label { background: var(--bg-contrast); border: 1px solid var(--border-color); border-radius: 999px; padding: 2px 8px; font-size: 12px }
.title { font-weight: 600; margin-bottom: 6px }
.meta { font-size: 12px; color: var(--text-muted) }
</style>

