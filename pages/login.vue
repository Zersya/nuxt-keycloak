<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'authentication'
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const isCheckingSSO = ref(true)
const errorMessage = ref('')
const showSSOOption = ref(false)

// Check for existing SSO session on mount
onMounted(async () => {
  await checkExistingSession()
})

const checkExistingSession = async () => {
  try {
    // First check if already authenticated locally
    const userResponse = await $fetch('/api/auth/user').catch(() => null)
    if (userResponse?.user) {
      navigateTo('/')
      return
    }

    // If not authenticated, check for SSO session via iframe/redirect
    // Using prompt=none to silently check
    showSSOOption.value = true
  } catch (error) {
    console.log('No existing session')
  } finally {
    isCheckingSSO.value = false
  }
}

const handleSSOLogin = async () => {
  isLoading.value = true
  try {
    const response = await $fetch('/api/login')
    if (response.url) {
      window.location.href = response.url
    }
  } catch (error: any) {
    errorMessage.value = 'SSO login failed. Please try manual login.'
    isLoading.value = false
  }
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })

    if (response.success) {
      navigateTo('/')
    }
  } catch (error: any) {
    const message = error.data?.message || 'Login failed. Please try again.'
    
    // If Direct Access Grants not enabled, suggest SSO
    if (message.includes('Direct Access Grants')) {
      errorMessage.value = 'Direct login is not enabled. Please use SSO login below.'
      showSSOOption.value = true
    } else {
      errorMessage.value = message
    }
  } finally {
    isLoading.value = false
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="login-container">
    <!-- Loading state while checking SSO -->
    <div v-if="isCheckingSSO" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner-large"></div>
        <p>Checking authentication...</p>
      </div>
    </div>

    <div v-else class="login-content">
      <div class="login-card">
        <div class="card-header">
          <div class="logo">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#E53935" stroke-width="2"/>
              <circle cx="12" cy="12" r="4" fill="#E53935"/>
            </svg>
            <span class="logo-text">Trans<span class="logo-highlight">TRACK</span></span>
          </div>
          <p class="copyright">&copy; 2016 - 2025 PT. Indo Trans Teknologi. All Rights Reserved.</p>
        </div>

        <div class="card-body">
          <div class="form-section">
            <h1 class="title">Login To Maritime Solutions MS</h1>
            <p class="subtitle">Hi, Welcome back to Maritime Solutions Management system.</p>

            <form @submit.prevent="handleLogin" class="login-form">
              <div class="form-group">
                <label for="email" class="form-label">
                  Email <span class="required">*</span>
                </label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="Email Address"
                  class="form-input"
                  :disabled="isLoading"
                />
              </div>

              <div class="form-group">
                <label for="password" class="form-label">
                  Password <span class="required">*</span>
                </label>
                <div class="password-input-wrapper">
                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Password"
                    class="form-input"
                    :disabled="isLoading"
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    @click="togglePassword"
                    :disabled="isLoading"
                  >
                    <svg v-if="showPassword" class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                    <svg v-else class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
              </div>

              <a href="#" class="forgot-password">Forgot password?</a>

              <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
              </div>

              <button
                type="submit"
                class="login-button"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="loading-spinner"></span>
                <span v-else>Login</span>
              </button>

              <p class="version">v0.0.88</p>

              <div v-if="showSSOOption" class="sso-section">
                <div class="divider">
                  <span>or</span>
                </div>
                <button
                  type="button"
                  class="sso-button"
                  @click="handleSSOLogin"
                  :disabled="isLoading"
                >
                  <svg class="sso-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Continue with SSO
                </button>
              </div>
            </form>
          </div>

          <div class="illustration-section">
            <img src="/images/ship-illustration.svg" alt="Maritime ship illustration" class="ship-illustration" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(180deg, 
    #87CEEB 0%, 
    #5DA5D1 20%,
    #3B8DC4 40%,
    #1E6FAF 60%,
    #0A4C8A 80%,
    #002244 100%
  );
}

.loading-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-content p {
  margin-top: 16px;
  font-size: 16px;
}

.loading-spinner-large {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

.login-content {
  width: 100%;
  max-width: 900px;
  z-index: 1;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  border-bottom: 1px solid #f0f0f0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 28px;
  height: 28px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.logo-highlight {
  color: #333;
}

.copyright {
  font-size: 11px;
  color: #999;
}

.card-body {
  display: flex;
  padding: 40px 32px;
  gap: 40px;
}

.form-section {
  flex: 1;
  max-width: 380px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.required {
  color: #E53935;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #E53935;
  box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.form-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #999;
  transition: color 0.2s;
}

.password-toggle:hover {
  color: #666;
}

.password-toggle:disabled {
  cursor: not-allowed;
}

.eye-icon {
  width: 20px;
  height: 20px;
}

.forgot-password {
  font-size: 14px;
  color: #E53935;
  text-decoration: none;
  margin-bottom: 24px;
}

.forgot-password:hover {
  text-decoration: underline;
}

.error-message {
  background: #FEE2E2;
  color: #DC2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
}

.login-button {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #F87171 0%, #EF4444 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.version {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 16px;
}

.sso-section {
  margin-top: 16px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 16px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}

.divider span {
  padding: 0 16px;
  color: #999;
  font-size: 14px;
}

.sso-button {
  width: 100%;
  padding: 14px 24px;
  background: #fff;
  color: #333;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.sso-button:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #ccc;
}

.sso-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.sso-icon {
  width: 20px;
  height: 20px;
}

.illustration-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ship-illustration {
  max-width: 100%;
  height: auto;
  max-height: 300px;
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .card-body {
    flex-direction: column;
    padding: 24px;
  }

  .form-section {
    max-width: 100%;
  }

  .illustration-section {
    display: none;
  }
}
</style>
