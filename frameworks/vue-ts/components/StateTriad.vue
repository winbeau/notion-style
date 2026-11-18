<script setup lang="ts">
withDefaults(
  defineProps<{
    loading?: boolean
    error?: string | null
    empty?: boolean
    emptyTitle?: string
    emptyDescription?: string
    skeletonCount?: number
  }>(),
  {
    loading: false,
    error: null,
    empty: false,
    emptyTitle: '暂无内容',
    emptyDescription: '当前筛选条件下尚未创建记录。',
    skeletonCount: 3,
  },
)

const emit = defineEmits<{
  retry: []
  create: []
}>()
</script>

<template>
  <div v-if="loading" role="status" aria-live="polite" class="triad-skeleton-list">
    <div v-for="n in skeletonCount" :key="n" class="triad-skeleton-row">
      <div class="triad-bone triad-bone--avatar" />
      <div class="triad-skeleton-lines">
        <div class="triad-bone triad-bone--w50" />
        <div class="triad-bone triad-bone--w35" />
      </div>
    </div>
  </div>

  <div v-else-if="error" role="alert" class="triad-box triad-box--error">
    <strong class="triad-title">加载异常</strong>
    <p class="triad-desc">{{ error }}</p>
    <button type="button" class="triad-btn" @click="emit('retry')">重试</button>
  </div>

  <div v-else-if="empty" role="status" aria-live="polite" class="triad-box triad-box--empty">
    <strong class="triad-title">{{ emptyTitle }}</strong>
    <p class="triad-desc">{{ emptyDescription }}</p>
    <slot name="empty-action">
      <button type="button" class="triad-btn triad-btn--primary" @click="emit('create')">
        新建条目
      </button>
    </slot>
  </div>

  <slot v-else />
</template>

<style scoped>
.triad-skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.triad-skeleton-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}
.triad-skeleton-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.triad-bone {
  height: 12px;
  border-radius: var(--radius-xs);
  background: var(--bg-hover);
  animation: notion-pulse 1.5s ease-in-out infinite;
}
.triad-bone--avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
}
.triad-bone--w50 { width: 52%; }
.triad-bone--w35 { width: 34%; }

@keyframes notion-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

.triad-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 24px;
  text-align: center;
  border-radius: var(--radius-md);
}
.triad-box--empty {
  border: 1px dashed var(--line-strong);
  background: var(--color-bg-subtle);
}
.triad-box--error {
  border: 1px solid var(--status-danger-border);
  background: var(--status-danger-bg);
}
.triad-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}
.triad-desc {
  margin: 0;
  max-width: 380px;
  font-size: 13px;
  color: var(--color-text-muted);
}
.triad-btn {
  margin-top: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}
.triad-btn--primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-primary-fg);
}
</style>
