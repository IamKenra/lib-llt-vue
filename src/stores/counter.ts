import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', () => {
  const count = ref<number>(0); // Menentukan tipe data sebagai number
  const doubleCount = computed((): number => count.value * 2); // Menentukan tipe return sebagai number

  function increment(): void { // Menentukan tipe return sebagai void
    count.value++;
  }

  return { count, doubleCount, increment };
});
