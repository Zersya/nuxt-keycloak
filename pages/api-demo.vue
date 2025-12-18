<script setup lang="ts">
import { ref } from 'vue'

const profileData = ref(null)
const protectedData = ref(null)
const sensitiveResult = ref(null)
const loading = ref({
  profile: false,
  data: false,
  sensitive: false
})
const errors = ref({
  profile: '',
  data: '',
  sensitive: ''
})

const fetchProfile = async () => {
  loading.value.profile = true
  errors.value.profile = ''
  try {
    const response = await $fetch('/api/protected/profile')
    profileData.value = response
  } catch (error: any) {
    errors.value.profile = error.data?.message || 'Failed to fetch profile'
  } finally {
    loading.value.profile = false
  }
}

const fetchData = async () => {
  loading.value.data = true
  errors.value.data = ''
  try {
    const response = await $fetch('/api/protected/data')
    protectedData.value = response
  } catch (error: any) {
    errors.value.data = error.data?.message || 'Failed to fetch data'
  } finally {
    loading.value.data = false
  }
}

const performSensitiveAction = async () => {
  loading.value.sensitive = true
  errors.value.sensitive = ''
  try {
    const response = await $fetch('/api/protected/sensitive', {
      method: 'POST',
      body: {
        action: 'test-sensitive-operation',
        amount: 1000
      }
    })
    sensitiveResult.value = response
  } catch (error: any) {
    errors.value.sensitive = error.data?.message || 'Sensitive operation failed'
  } finally {
    loading.value.sensitive = false
  }
}
</script>

<template>
  <div class="container">
    <h1 class="title">Protected API Demo</h1>
    <p class="subtitle">Examples of calling SSO-protected backend APIs</p>

    <div class="api-grid">
      <!-- Profile API -->
      <div class="api-card">
        <h2 class="card-title">1. GET /api/protected/profile</h2>
        <p class="card-description">
          Simple authentication check. Validates local session cookies.
        </p>
        <button 
          @click="fetchProfile"
          :disabled="loading.profile"
          class="btn btn-primary"
        >
          {{ loading.profile ? 'Loading...' : 'Fetch Profile' }}
        </button>

        <div v-if="errors.profile" class="error-box">
          {{ errors.profile }}
        </div>

        <div v-if="profileData" class="result-box">
          <pre>{{ JSON.stringify(profileData, null, 2) }}</pre>
        </div>
      </div>

      <!-- Protected Data API -->
      <div class="api-card">
        <h2 class="card-title">2. GET /api/protected/data</h2>
        <p class="card-description">
          Fetch protected data. Shows how to use access token for external API calls.
        </p>
        <button 
          @click="fetchData"
          :disabled="loading.data"
          class="btn btn-primary"
        >
          {{ loading.data ? 'Loading...' : 'Fetch Data' }}
        </button>

        <div v-if="errors.data" class="error-box">
          {{ errors.data }}
        </div>

        <div v-if="protectedData" class="result-box">
          <pre>{{ JSON.stringify(protectedData, null, 2) }}</pre>
        </div>
      </div>

      <!-- Sensitive Operation API -->
      <div class="api-card">
        <h2 class="card-title">3. POST /api/protected/sensitive</h2>
        <p class="card-description">
          Sensitive operation that validates session with Keycloak in real-time.
          This ensures user hasn't been logged out from another device.
        </p>
        <button 
          @click="performSensitiveAction"
          :disabled="loading.sensitive"
          class="btn btn-danger"
        >
          {{ loading.sensitive ? 'Processing...' : 'Perform Sensitive Operation' }}
        </button>

        <div v-if="errors.sensitive" class="error-box">
          {{ errors.sensitive }}
        </div>

        <div v-if="sensitiveResult" class="result-box">
          <pre>{{ JSON.stringify(sensitiveResult, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <div class="code-section">
      <h2>Backend Implementation Examples</h2>
      
      <div class="code-example">
        <h3>server/utils/auth.ts - Auth Utilities</h3>
        <pre><code>import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // This throws 401 if not authenticated
  const session = requireAuth(event)
  
  return {
    user: session.user,
    message: 'This is protected data'
  }
})</code></pre>
      </div>

      <div class="code-example">
        <h3>Sensitive Operation with Real-time Validation</h3>
        <pre><code>import { requireValidSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // Validates with Keycloak server
  // Ensures session is still active
  const user = await requireValidSession(event)
  
  // Perform critical operation
  return { success: true }
})</code></pre>
      </div>
    </div>

    <div class="info-section">
      <h3>How It Works</h3>
      <ul>
        <li><strong>requireAuth()</strong> - Fast local validation using cookies</li>
        <li><strong>requireValidSession()</strong> - Real-time validation with Keycloak server</li>
        <li><strong>getAccessToken()</strong> - Get token to call other microservices</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
}

.api-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.api-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.card-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
}

.btn {
  width: 100%;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #F87171 0%, #EF4444 100%);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.error-box {
  margin-top: 16px;
  padding: 12px;
  background: #FEE2E2;
  color: #DC2626;
  border-radius: 8px;
  font-size: 14px;
}

.result-box {
  margin-top: 16px;
  padding: 16px;
  background: #F3F4F6;
  border-radius: 8px;
  overflow-x: auto;
}

.result-box pre {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}

.code-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.code-section h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
}

.code-example {
  margin-bottom: 24px;
}

.code-example h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.code-example pre {
  background: #1F2937;
  color: #F3F4F6;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.5;
}

.code-example code {
  font-family: 'Courier New', monospace;
}

.info-section {
  background: #EFF6FF;
  border-left: 4px solid #3B82F6;
  padding: 24px;
  border-radius: 8px;
}

.info-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1E40AF;
}

.info-section ul {
  margin: 0;
  padding-left: 20px;
}

.info-section li {
  margin-bottom: 8px;
  color: #1E3A8A;
  line-height: 1.6;
}

.info-section strong {
  font-weight: 600;
  color: #1E3A8A;
}

@media (max-width: 768px) {
  .api-grid {
    grid-template-columns: 1fr;
  }
}
</style>
