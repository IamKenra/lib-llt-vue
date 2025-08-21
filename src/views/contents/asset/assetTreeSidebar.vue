<template>
  <div class="bg-white rounded-2xl border shadow-sm !p-4">
    <h2 class="!text-lg text-gray-700 font-semibold !pl-2 !mb-4">Asset Categories</h2>
    <ul class="space-y-2">
      <li
        v-for="item in categories"
        :key="item.id"
        @click="$emit('select-category', item)"
        :class="[
          'flex justify-between items-center px-4 py-2 text-sm cursor-pointer transition',
          selectedCategory?.id === item.id
            ? 'bg-blue-100 rounded-full text-blue-700 font-semibold'
            : 'rounded-full hover:bg-gray-100 text-gray-800',
        ]"
      >
        <span>{{ item.name }}</span>
        <span
          :class="[
            'text-sm font-bold px-3 py-1 rounded-md shadow-sm',
            selectedCategory?.id === item.id ? 'bg-blue-500 text-white' : 'bg-blue-200 text-blue-900',
          ]"
        >
          {{ item.count }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{ selectedCategory: { id: string; name: string } | null }>()

const categories = [
  { id: 'phones', name: 'Phones', count: 3 },
  { id: 'laptops', name: 'Laptops', count: 5 },
  { id: 'servers', name: 'Servers', count: 2 },
  { id: 'printers', name: 'Printers', count: 1 },
  { id: 'network', name: 'Network', count: 0 },
]
</script>
