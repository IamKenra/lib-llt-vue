<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- Sidebar Tree -->
    <div class="col-span-12 md:col-span-4 xl:col-span-3">
      <AssetTreeSidebar @select-category="handleSelectCategory" :selectedCategory="selectedCategory" />
    </div>

    <!-- Panel List -->
    <div class="col-span-12 md:col-span-8 xl:col-span-9">
      <AssetListPanel :category="selectedCategory" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AssetTreeSidebar from './assetTreeSidebar.vue'
import AssetListPanel from './assetListPanel.vue'

interface Category {
  id: string
  name: string
  count: number
}

const selectedCategory = ref<Category | null>(null)

function handleSelectCategory(category: Category) {
  selectedCategory.value = category
}
</script>

<style scoped>
</style>
