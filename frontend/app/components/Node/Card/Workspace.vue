<template>
  <div class="workspace-tile" :class="accentColorClass">
    <div class="glow-ambiance" />

    <div class="tile-content">
      <div class="top-row">
        <div :class="['icon-box', getAppAccent(workspace.color, true)]">
          <Icon :name="workspace.icon || 'workspace'" class="ws-icon" />
          <span class="status-dot" />
        </div>

        <div class="doc-badge">
          <span class="count-number">{{ docCount }}</span>
          <span class="count-label">doc{{ docCount > 1 ? 's' : '' }}</span>
        </div>
      </div>

      <div class="meta-zone">
        <h3 class="ws-title">{{ workspace.name }}</h3>
        <p v-if="workspace.description" class="ws-description">
          {{ workspace.description }}
        </p>
      </div>

      <div v-if="categories.length > 0" class="tile-footer">
        <div class="category-pills">
          <span v-for="child in categories.slice(0, 2)" :key="child.id" class="pill">
            {{ child.name }}
          </span>
          <span v-if="categories.length > 2" class="pill-more"> +{{ categories.length - 2 }} autres </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Node } from '~/stores';

const props = defineProps<{ workspace: Node }>();

const nodesStore = useNodesStore();
const { getAppAccent } = useAppColors();

// Mapping pour les classes CSS d'accentuation
const accentColorClass = computed(() => {
  const colors = ['blue', 'red', 'green', 'yellow', 'purple', 'pink', 'teal', 'primary'];
  const colorIndex = props.workspace.color as number;
  return colors[colorIndex] || 'primary';
});

// Récupération indexée O(1) des catégories enfants directes
const categories = computed(() => {
  const childrenIds = nodesStore.getAll.getChildrenIds(props.workspace.id);
  return childrenIds.map(id => nodesStore.getById(id)).filter((n): n is Node => !!n && (n.role === 1 || n.role === 2));
});

// Comptage optimisé via la structure à plat définie précédemment
const docCount = computed(() => {
  return nodesStore
    .getDescendantIds(props.workspace.id)
    .map(id => nodesStore.getById(id))
    .filter(n => n?.role === 3).length;
});
</script>

<style scoped lang="scss">
.workspace-tile {
  --tile-radius: 14px;
  --bg-speed: 0.3s;

  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--tile-radius);
  background: var(--surface-base, #121214);
  overflow: hidden;
  cursor: pointer;
  transition:
    border-color var(--bg-speed) ease,
    transform 0.4s cubic-bezier(0.25, 1, 0.5, 1),
    box-shadow 0.4s ease;

  // Effet de lévitation asymétrique au survol (3D discret)
  &:hover {
    transform: translateY(-6px) scale(1.01);
    border-color: rgba(var(--primary), 0.35);
    box-shadow:
      0 20px 30px -10px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(var(--primary), 0.1);

    .glow-ambiance {
      opacity: 0.12;
      transform: scale(1.2);
    }

    .icon-box {
      .ws-icon {
        transform: scale(1.1);
      }
      .status-dot {
        transform: scale(1.3);
        box-shadow: 0 0 12px var(--primary);
      }
    }
  }
}

// Halo lumineux d'ambiance en arrière-plan (Premium look)
.glow-ambiance {
  position: absolute;
  top: -20%;
  right: -20%;
  width: 70%;
  height: 70%;
  background: radial-gradient(circle, var(--accent-color) 0%, transparent 70%);
  opacity: 0;
  filter: blur(40px);
  pointer-events: none;
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
  z-index: 0;
}

.tile-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

// Ligne du haut unifiée
.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

// Conteneur d'icône minimaliste
.icon-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 10px;

  .ws-icon {
    font-size: 1.4rem;
    transition: transform 0.3s ease;
  }

  .status-dot {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--primary-border);
    border: 1.5px solid var(--surface-base);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }
}

// Badge de documents type "Chiffre brut épuré"
.doc-badge {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
  font-family: monospace; // Style Pro / Code

  .count-number {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text-title, #ffffff);
  }

  .count-label {
    font-size: 0.75rem;
    color: var(--text-muted, #6c6c74);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

// Typographies épurées à fort contraste
.meta-zone {
  margin-bottom: 1.5rem;

  .ws-title {
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text-body, #e3e3e6);
    margin: 0 0 0.4rem 0;
    transition: color 0.2s ease;
  }

  .ws-description {
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--text-secondary, #9a9a9f);
    margin: 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
  }
}

// Section basse : Remplacement des badges pleins par des puces discrètes textuelles
.tile-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.04));
}

.category-pills {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;

  .pill {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-secondary, #9a9a9f);
    position: relative;
    padding-left: 0.6rem;

    // Point minimaliste devant chaque catégorie au lieu d'un badge rectangle lourd
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--border-strong, rgba(255, 255, 255, 0.2));
    }
  }

  .pill-more {
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--text-muted, #6c6c74);
    background: var(--surface-raised, rgba(255, 255, 255, 0.03));
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
  }
}
</style>
