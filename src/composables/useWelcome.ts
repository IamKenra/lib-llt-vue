import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export function useWelcome() {
  const router = useRouter()
  const progress = ref(0)
  const userName = ref('Mulyoyo Solololo') // TODO: Integrate with auth state

  const startWelcomeSequence = () => {
    // Animate progress bar with smooth increment
    const interval = setInterval(() => {
      progress.value += 2
      
      if (progress.value >= 100) {
        clearInterval(interval)
        // Add small delay before redirect for better UX
        setTimeout(() => {
          redirectToDashboard()
        }, 500)
      }
    }, 80) // Total ~4 seconds animation (50 steps × 80ms)
  }

  const redirectToDashboard = () => {
    router.push({ query: { content: 'dashboard' } })
  }


  onMounted(() => {
    startWelcomeSequence()
  })

  return {
    progress,
    userName,
    startWelcomeSequence,
    redirectToDashboard
  }
}