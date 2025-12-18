/**
 * Password field composable
 * Reusable logic for password visibility toggle in forms
 */

export function usePasswordField() {
  const showPassword = ref(false);
  const togglePassword = () => (showPassword.value = !showPassword.value);
  
  return { showPassword, togglePassword };
}
