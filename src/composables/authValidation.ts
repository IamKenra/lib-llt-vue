// Definisikan tipe untuk data form login
interface LoginForm {
  username: string;
  password: string;
}

// Definisikan tipe untuk hasil validasi
interface ValidationResult {
  valid: boolean;
  errors: {
    username?: string;
    password?: string;
  };
}

export function validateLoginForm(formData: LoginForm): ValidationResult {
  const errors: ValidationResult['errors'] = {};
  let valid = true;

  if (!formData.username) {
    errors.username = 'Username wajib diisi';
    valid = false;
  }

  if (!formData.password) {
    errors.password = 'Password wajib diisi';
    valid = false;
  } else if (formData.password.length < 6) {
    errors.password = 'Password minimal 6 karakter';
    valid = false;
  }

  return {
    valid,
    errors
  };
}
