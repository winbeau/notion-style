<script setup lang="ts">
withDefaults(
  defineProps<{
    interactive?: boolean
    subtle?: boolean
    compact?: boolean
  }>(),
  {
    interactive: false,
    subtle: false,
    compact: false,
  },
)
</script>

<template>
  <article
    class="notion-card"
    :class="{
      'notion-card--interactive': interactive,
      'notion-card--subtle': subtle,
      'notion-card--compact': compact,
    }"
  >
    <div v-if="$slots.meta" class="notion-card__meta">
      <slot name="meta" />
    </div>
    <h3 v-if="$slots.title" class="notion-card__title">
      <slot name="title" />
    </h3>
    <div class="notion-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="notion-card__footer">
      <slot name="footer" />
    </footer>
  </article>
</template>

<style scoped>
.notion-card {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text);
  box-shadow: var(--shadow-card);
  transition:
    background-color var(--transition),
    border-color var(--transition),
    box-shadow var(--transition),
    transform var(--transition);
}

.notion-card--subtle {
  background: var(--color-bg-subtle);
}

.notion-card--compact {
  padding: 12px 14px;
}

.notion-card--interactive {
  cursor: pointer;
}

.notion-card--interactive:hover {
  border-color: var(--line-strong);
  background: var(--color-bg-subtle);
  box-shadow: var(--shadow-panel);
  transform: translateY(-2px);
}

.notion-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--color-text-faint);
}

.notion-card__title {
  margin: 0 0 6px;
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--color-text);
}

.notion-card__body {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.notion-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  font-size: 12px;
  color: var(--color-text-faint);
}
</style>
