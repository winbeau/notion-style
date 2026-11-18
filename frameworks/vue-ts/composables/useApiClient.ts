import { ref, shallowRef, type Ref } from 'vue'
import { ApiError, request, type RequestOptions } from '../../react-ts/api/client'

export { ApiError, request, type RequestOptions }

/**
 * Vue 3 Async Resource Composable aligned with the Notion-Style Three-State Triad.
 * Pairs directly with `<StateTriad :loading="loading" :error="error" :empty="isEmpty" @retry="execute">`.
 */
export function useNotionQuery<T>(
  fetcher: () => Promise<T>,
  options: { immediate?: boolean; isEmpty?: (data: T | null) => boolean } = {},
) {
  const data = shallowRef<T | null>(null)
  const loading: Ref<boolean> = ref(Boolean(options.immediate ?? true))
  const error: Ref<string | null> = ref(null)

  async function execute(): Promise<T | null> {
    loading.value = true
    error.value = null
    try {
      const result = await fetcher()
      data.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : '请求失败，请稍后重试'
      return null
    } finally {
      loading.value = false
    }
  }

  if (options.immediate ?? true) {
    void execute()
  }

  const checkEmpty = () => {
    if (loading.value || error.value) return false
    if (options.isEmpty) return options.isEmpty(data.value)
    if (Array.isArray(data.value)) return data.value.length === 0
    return data.value === null
  }

  return {
    data,
    loading,
    error,
    checkEmpty,
    execute,
  }
}
