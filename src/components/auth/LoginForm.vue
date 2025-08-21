<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
    <div :style="{ width: cardWidth }" class="bg-white rounded-xl shadow-lg border border-gray-100 p-8 max-w-md mx-auto">
      <div class="text-center !mb-3">
        <div class="flex justify-center !mb-4">
          <img src="@/assets/logo.png" alt="Logo" class="h-16 w-auto" />
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Username -->
        <div class="!mb-3">
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <InputText
            id="username"
            v-model="form.username"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            :class="{'border-red-500 focus:ring-red-500': errors.username}"
            placeholder="Masukkan username"
          />
          <p v-if="errors.username" class="text-sm text-red-600 mt-2">{{ errors.username }}</p>
        </div>

        <!-- Password -->
        <div class="!mb-3">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <Password
            id="password"
            v-model="form.password"
            :feedback="false"
            toggleMask
            inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            class="w-full"
            :class="{'border-red-500': errors.password}"
            placeholder="Masukkan password"
          />
          <p v-if="errors.password" class="text-sm text-red-600 mt-2">{{ errors.password }}</p>
        </div>

        <!-- Remember Me and Forgot Password -->
        <div class="flex items-center justify-between !mb-2">
          <div class="flex items-center">
            <Checkbox v-model="rememberMe" inputId="remember" binary class="!mr-3" />
            <label for="remember" class="text-sm text-gray-700 cursor-pointer">Ingat saya</label>
          </div>
          <a href="#" class="text-sm !text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">Lupa password?</a>
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          label="Login"
          :loading="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-300"
        />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, Ref } from 'vue';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import { useAuth } from '../../composables/useAuth';
import { validateLoginForm } from '../../composables/authValidation';

const { login, loading } = useAuth();
const rememberMe = ref(false);

const form = ref({
  username: '',
  password: ''
});

const errors = ref<{ username?: string; password?: string }>({
  username: undefined,
  password: undefined
}) as Ref<{ username?: string; password?: string }>;

const cardWidth = computed(() => {
  if (typeof window === 'undefined') return '28rem';
  
  if (window.innerWidth < 640) {
    return '100%';
  } else if (window.innerWidth < 768) {
    return '32rem';
  } else if (window.innerWidth < 1024) {
    return '36rem';
  } else {
    return '28rem';
  }
});

const handleSubmit = async () => {
  const validationResult = validateLoginForm(form.value);

  if (!validationResult.valid) {
    errors.value = validationResult.errors;
    return;
  }

  errors.value = {};
  await login(form.value, rememberMe.value);
};
</script>
