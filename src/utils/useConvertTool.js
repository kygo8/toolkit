import { ref } from 'vue'

export const useConvertTool = () => {
  const input = ref('')
  const output = ref('')
  const error = ref('')
  const copied = ref(false)

  const run = (fn) => {
    error.value = ''
    if (!String(input.value || '').trim()) {
      output.value = ''
      return
    }

    try {
      output.value = fn(input.value)
    } catch (err) {
      error.value = err?.message || String(err)
      output.value = ''
    }
  }

  const clearAll = () => {
    input.value = ''
    output.value = ''
    error.value = ''
  }

  const swapInputOutput = (afterSwap) => {
    if (!output.value) return
    input.value = output.value
    output.value = ''
    error.value = ''
    afterSwap?.()
  }

  const copyResult = async () => {
    if (!output.value) return
    try {
      await navigator.clipboard.writeText(output.value)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return {
    input,
    output,
    error,
    copied,
    run,
    clearAll,
    swapInputOutput,
    copyResult
  }
}
