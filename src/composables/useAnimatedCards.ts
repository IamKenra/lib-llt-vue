import { ref, onMounted } from 'vue'

interface CardAnimation {
  id: string
  delay: number
  visible: boolean
}

export function useAnimatedCards(cardIds: string[], baseDelay: number = 100) {
  const cards = ref<Map<string, boolean>>(new Map())
  
  // Initialize all cards as hidden
  cardIds.forEach(id => {
    cards.value.set(id, false)
  })

  // Animate cards in sequence
  const animateCards = () => {
    cardIds.forEach((id, index) => {
      setTimeout(() => {
        cards.value.set(id, true)
      }, baseDelay * (index + 1))
    })
  }

  // Reset all cards to hidden
  const resetCards = () => {
    cardIds.forEach(id => {
      cards.value.set(id, false)
    })
  }

  // Show specific card
  const showCard = (id: string) => {
    cards.value.set(id, true)
  }

  // Hide specific card
  const hideCard = (id: string) => {
    cards.value.set(id, false)
  }

  // Check if card is visible
  const isCardVisible = (id: string): boolean => {
    return cards.value.get(id) || false
  }

  // Get staggered delay for card
  const getCardDelay = (id: string): number => {
    const index = cardIds.indexOf(id)
    return index >= 0 ? baseDelay * (index + 1) : 0
  }

  // Auto-start animation on mount
  onMounted(() => {
    animateCards()
  })

  return {
    cards,
    animateCards,
    resetCards,
    showCard,
    hideCard,
    isCardVisible,
    getCardDelay
  }
}

export default useAnimatedCards