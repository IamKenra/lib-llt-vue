<template>
  <div class="animated-card-examples p-6">
    <h2 class="text-2xl font-bold mb-6">AnimatedCard Examples</h2>
    
    <!-- Basic Usage -->
    <section class="mb-8">
      <h3 class="text-lg font-semibold mb-4">Basic Usage</h3>
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 md:col-span-4">
          <AnimatedCard :delay="0">
            <h4 class="text-lg font-semibold mb-2">Basic Card</h4>
            <p class="text-gray-600">This card appears immediately with default animation.</p>
          </AnimatedCard>
        </div>
      </div>
    </section>

    <!-- Staggered Cards -->
    <section class="mb-8">
      <h3 class="text-lg font-semibold mb-4">Staggered Animation</h3>
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 md:col-span-3" v-for="(card, index) in staggeredCards" :key="index">
          <AnimatedCard :delay="(index + 1) * 100" :card-class="card.class">
            <h4 class="text-lg font-semibold mb-2">{{ card.title }}</h4>
            <p class="text-sm text-gray-600">{{ card.content }}</p>
            <i :class="card.icon" class="text-2xl mt-2 opacity-70"></i>
          </AnimatedCard>
        </div>
      </div>
    </section>

    <!-- Manual Control -->
    <section class="mb-8">
      <h3 class="text-lg font-semibold mb-4">Manual Control</h3>
      <div class="mb-4">
        <button @click="toggleManualCard" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          {{ showManualCard ? 'Hide' : 'Show' }} Card
        </button>
        <button @click="resetStaggered" class="bg-green-500 text-white px-4 py-2 rounded">
          Reset Staggered Cards
        </button>
      </div>
      
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 md:col-span-6">
          <AnimatedCard 
            ref="manualCard" 
            :auto-animate="false" 
            card-class="border-2 border-blue-500 bg-blue-50"
          >
            <h4 class="text-lg font-semibold mb-2 text-blue-800">Manual Card</h4>
            <p class="text-blue-600">This card is controlled manually via buttons.</p>
          </AnimatedCard>
        </div>
      </div>
    </section>

    <!-- Status Cards Example -->
    <section class="mb-8">
      <h3 class="text-lg font-semibold mb-4">Status Cards Example</h3>
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 md:col-span-3">
          <AnimatedCard :delay="100" card-class="stat-card blue-card">
            <div class="stat-number">{{ stats.total }}</div>
            <div class="stat-title">Total Users</div>
            <i class="pi pi-users card-icon"></i>
          </AnimatedCard>
        </div>
        
        <div class="col-span-12 md:col-span-3">
          <AnimatedCard :delay="200" card-class="stat-card green-card">
            <div class="stat-number">{{ stats.active }}</div>
            <div class="stat-title">Active</div>
            <i class="pi pi-check-circle card-icon"></i>
          </AnimatedCard>
        </div>
        
        <div class="col-span-12 md:col-span-3">
          <AnimatedCard :delay="300" card-class="stat-card yellow-card">
            <div class="stat-number">{{ stats.pending }}</div>
            <div class="stat-title">Pending</div>
            <i class="pi pi-clock card-icon"></i>
          </AnimatedCard>
        </div>
        
        <div class="col-span-12 md:col-span-3">
          <AnimatedCard :delay="400" card-class="stat-card red-card">
            <div class="stat-number">{{ stats.inactive }}</div>
            <div class="stat-title">Inactive</div>
            <i class="pi pi-times-circle card-icon"></i>
          </AnimatedCard>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AnimatedCard from '../AnimatedCard.vue'

const showManualCard = ref(false)
const manualCard = ref()

const staggeredCards = [
  { title: 'Card 1', content: 'First card (100ms delay)', class: 'border-l-4 border-blue-500', icon: 'pi pi-star' },
  { title: 'Card 2', content: 'Second card (200ms delay)', class: 'border-l-4 border-green-500', icon: 'pi pi-heart' },
  { title: 'Card 3', content: 'Third card (300ms delay)', class: 'border-l-4 border-yellow-500', icon: 'pi pi-lightning-bolt' },
  { title: 'Card 4', content: 'Fourth card (400ms delay)', class: 'border-l-4 border-red-500', icon: 'pi pi-fire' }
]

const stats = ref({
  total: 1234,
  active: 956,
  pending: 178,
  inactive: 100
})

const toggleManualCard = () => {
  if (showManualCard.value) {
    manualCard.value?.hide()
  } else {
    manualCard.value?.show()
  }
  showManualCard.value = !showManualCard.value
}

const resetStaggered = () => {
  // This would trigger re-animation in a real implementation
  console.log('Reset staggered cards animation')
}
</script>

<style scoped>
.animated-card-examples {
  max-width: 1200px;
  margin: 0 auto;
}

/* Example stat card styles */
.stat-card {
  position: relative;
  background: #ffffff;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 120px;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.stat-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 3rem;
  opacity: 0.7;
}

/* Color variants */
.blue-card { border-left: 4px solid #3b82f6; }
.blue-card .stat-number { color: #1e40af; }
.blue-card .card-icon { color: #3b82f6; }

.green-card { border-left: 4px solid #10b981; }
.green-card .stat-number { color: #047857; }
.green-card .card-icon { color: #10b981; }

.yellow-card { border-left: 4px solid #f59e0b; }
.yellow-card .stat-number { color: #d97706; }
.yellow-card .card-icon { color: #f59e0b; }

.red-card { border-left: 4px solid #ef4444; }
.red-card .stat-number { color: #dc2626; }
.red-card .card-icon { color: #ef4444; }
</style>