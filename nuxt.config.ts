// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      baseUrl: 'https://keycloak-cake.vercel.app/',
      apiUrl: 'https://sso.transtrack.id/',
      keycloakDisabled: 'false',
      keycloakUrl: 'https://sso.transtrack.id/',
      keycloakRealm: 'external',
      // keycloakClientId: 'order-planning-fe',
      keycloakClientId: 'account-transtrack-staging',
    },
    // Private runtime config
    keycloakClientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
  },
  imports: {
    autoImport: true,
  }
})
