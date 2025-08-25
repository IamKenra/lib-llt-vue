<template>
  <div 
    class="animated-card-wrapper"
    :class="cardClasses"
    :style="animationStyle"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface Props {
  delay?: number
  cardClass?: string
  autoAnimate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  cardClass: '',
  autoAnimate: true
})

const isAnimated = ref(false)

const cardClasses = computed(() => {
  return props.cardClass || 'animated-card-default'
})

const animationStyle = computed(() => {
  if (!props.autoAnimate) {
    return {}
  }
  
  return {
    opacity: isAnimated.value ? '1' : '0',
    transform: isAnimated.value 
      ? 'translateY(0) scale(1)' 
      : 'translateY(16px) scale(0.95)',
    transition: 'all 0.5s ease-out'
  }
})

const triggerAnimation = () => {
  if (props.autoAnimate) {
    setTimeout(() => {
      isAnimated.value = true
    }, props.delay || 0)
  } else {
    isAnimated.value = true
  }
}

// Auto-animate on mount
onMounted(() => {
  triggerAnimation()
})

// Expose method for manual triggering
defineExpose({
  show: () => {
    isAnimated.value = true
  },
  hide: () => {
    isAnimated.value = false
  },
  trigger: triggerAnimation
})
</script>

<style scoped>
.animated-card-container {
  width: 100%;
  height: 100%;
}

.animated-card-default {
  /* Default card styling if no custom class provided */
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.animated-card-default:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>