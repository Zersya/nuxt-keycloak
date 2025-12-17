<script setup lang="ts">
import { onMounted, ref } from 'vue'

definePageMeta({
  layout: 'authentication'
})

const isRedirecting = ref(true)
const error = ref('')

onMounted(async () => {
  // Check if already authenticated locally
  try {
    const userResponse = await $fetch('/api/auth/user').catch(() => null)
    if (userResponse?.user) {
      navigateTo('/')
      return
    }
  } catch (e) {
    // Not authenticated, continue with redirect
  }

  // Redirect to Keycloak login page
  try {
    const response = await $fetch('/api/login')
    if (response.url) {
      window.location.href = response.url
    }
  } catch (e: any) {
    isRedirecting.value = false
    error.value = e.data?.message || 'Failed to initiate SSO login'
  }
})

const retry = () => {
  window.location.reload()
}
</script>

<template>
  <div class="sso-container">
    <div class="sso-content">
      <div v-if="isRedirecting" class="loading-state">
        <div class="spinner"></div>
        <h2>Redirecting to SSO...</h2>
        <p>Please wait while we redirect you to the login page.</p>
        <p class="hint">If you're already logged in elsewhere, you'll be signed in automatically.</p>
      </div>

      <div v-else class="error-state">
        <div class="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2>Unable to Connect</h2>
        <p>{{ error }}</p>
        <button @click="retry" class="retry-button">Try Again</button>
        <NuxtLink to="/login" class="fallback-link">Use manual login instead</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sso-container {
  min-height: 100vh;
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

.sso-content {
  text-align: center;
  color: white;
  max-width: 400px;
}

.loading-state h2,
.error-state h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.loading-state p,
.error-state p {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.hint {
  font-size: 14px;
  opacity: 0.7;
  margin-top: 16px;
}

.spinner {
  width: 56px;
  height: 56px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 24px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-state {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 16px;
}

.error-icon {
  margin-bottom: 16px;
}

.error-icon svg {
  width: 48px;
  height: 48px;
  color: #FCA5A5;
}

.retry-button {
  display: inline-block;
  margin-top: 24px;
  padding: 12px 32px;
  background: white;
  color: #1E6FAF;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.fallback-link {
  display: block;
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  text-decoration: underline;
}

.fallback-link:hover {
  color: white;
}
</style>
