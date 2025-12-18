<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'authentication'
})

const isLoading = ref(true)
const errorMessage = ref('')

// Auto-redirect to SSO on mount
onMounted(async () => {
  // First check if already authenticated locally
  try {
    const userResponse = await $fetch('/api/auth/user').catch(() => null)
    if (userResponse?.user) {
      navigateTo('/')
      return
    }
  } catch (e) {
    // Not authenticated
  }

  // Redirect to Keycloak SSO
  await redirectToSSO()
})

const redirectToSSO = async () => {
  try {
    const response = await $fetch('/api/login')
    if (response.url) {
      window.location.href = response.url
    }
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Failed to connect to SSO. Please try again.'
    isLoading.value = false
  }
}

const retry = () => {
  isLoading.value = true
  errorMessage.value = ''
  redirectToSSO()
}
</script>

<template>
  <div class="login-container">
    <div class="login-content">
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
          <div class="sso-section">
            <h1 class="title">Login To Maritime Solutions MS</h1>
            <p class="subtitle">Hi, Welcome back to Maritime Solutions Management system.</p>

            <div v-if="isLoading" class="loading-state">
              <div class="loading-spinner-large"></div>
              <p class="loading-text">Redirecting to SSO...</p>
            </div>

            <div v-else-if="errorMessage" class="error-state">
              <div class="error-message">
                {{ errorMessage }}
              </div>
              <button
                type="button"
                class="login-button"
                @click="retry"
              >
                Try Again
              </button>
            </div>

            <p class="version">v0.0.88</p>
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

.sso-section {
  flex: 1;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

.loading-state {
  text-align: center;
  padding: 40px 0;
}

.loading-spinner-large {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(229, 57, 53, 0.3);
  border-top-color: #E53935;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  color: #666;
}

.error-state {
  text-align: center;
  padding: 20px 0;
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
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.version {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 32px;
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

  .sso-section {
    max-width: 100%;
  }

  .illustration-section {
    display: none;
  }
}
</style>
