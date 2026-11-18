<script setup lang="ts">
import { computed } from 'vue'
import {
  getCategoryMeta,
  type CategoryId,
  type StatusId,
} from '../../../core/generated/tokens'

const props = withDefaults(
  defineProps<{
    category?: CategoryId
    status?: StatusId
    label?: string
    variant?: 'dot' | 'chip' | 'status'
  }>(),
  {
    variant: 'chip',
  },
)

const displayLabel = computed(() => {
  if (props.label) return props.label
  if (props.category) return getCategoryMeta(props.category).label
  return props.status ?? ''
})

const badgeStyle = computed(() => {
  if (props.variant === 'status' && props.status) {
    return {
      color: `var(--status-${props.status}-fg)`,
      backgroundColor: `var(--status-${props.status}-bg)`,
      borderColor: `var(--status-${props.status}-border)`,
    }
  }
  const cat = props.category ?? 'tools'
  if (props.variant === 'dot') {
    return {}
  }
  return {
    color: `var(--cat-${cat})`,
    backgroundColor: `var(--tag-${cat}-bg)`,
  }
})
</script>

<template>
  <span v-if="variant === 'dot'" class="notion-badge-dot">
    <span
      class="notion-badge-dot__circle"
      :style="{ backgroundColor: `var(--cat-${category ?? 'tools'})` }"
    />
    <span>{{ displayLabel }}</span>
  </span>
  <span
    v-else
    class="notion-badge"
    :class="{ 'notion-badge--outlined': variant === 'status' }"
    :style="badgeStyle"
  >
    {{ displayLabel }}
  </span>
</template>

<style scoped>
.notion-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: var(--radius-xs);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
}

.notion-badge--outlined {
  border: 1px solid transparent;
}

.notion-badge-dot {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.notion-badge-dot__circle {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
}
</style>
