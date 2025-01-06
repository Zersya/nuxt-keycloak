<script setup lang="ts">
import { useKeycloak } from '~/composables/useKeycloak';
import { useAuth } from '~/composables/useAuth';

const { login, logout } = useKeycloak();
const { user, isAuthenticated } = useAuth();
</script>

<template>
  <div class="container mx-auto p-4">
    <div v-if="isAuthenticated" class="space-y-4">

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Welcome, {{ user?.name || user?.preferred_username }}</h2>
        <div class="space-y-2">
          <p><strong>Email:</strong> {{ user?.email }}</p>
          <p><strong>ID:</strong> {{ user?.sub }}</p>
        </div>
        <button 
          @click="logout"
          class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
    <div v-else class="text-center">
      <h2 class="text-2xl font-bold mb-4">Please login to continue</h2>
      <button 
        @click="login"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Login with Keycloak
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
}
</style>
