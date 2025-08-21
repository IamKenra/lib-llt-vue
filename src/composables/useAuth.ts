import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import AuthService from '../services/authService';
import { TokenService } from '../services/tokenService';

interface Credentials {
  username: string;
  password: string;
}

export function useAuth() {
  const router = useRouter();
  const toast = useToast();
  const loading: Ref<boolean> = ref(false);

  const login = async (credentials: Credentials, rememberMe: boolean): Promise<void> => {
    loading.value = true;

    try {
      const response = await AuthService.login(credentials, rememberMe);
      console.log('Login response:', response);

      toast.add({
        severity: 'success',
        summary: 'Login Berhasil',
        detail: 'Anda akan diarahkan ke dashboard',
        life: 3000
      });

      router.push('/');
    } catch (error: any) {
      toast.add({
        severity: 'error',
        summary: 'Login Gagal',
        detail: error.message || 'Terjadi kesalahan saat login',
        life: 3000
      });
    } finally {
      loading.value = false;
    }
  };

  const logout = (): void => {
    AuthService.logout();

    toast.add({
      severity: 'success',
      summary: 'Logout Berhasil',
      detail: 'Anda telah berhasil logout',
      life: 3000
    });

    router.push('/login');
  };

  return {
    login,
    logout,
    loading
  };
}
