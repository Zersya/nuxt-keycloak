// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      baseUrl: 'https://keycloak-lake.vercel.app/',
      apiUrl: 'https://sso.transtrack.id/',
      keycloakDisabled: 'false',
      keycloakUrl: 'https://sso.transtrack.id/',
      keycloakRealm: 'master',
      keycloakClientId: 'fe-testing',
    },
    // Private runtime config
    keycloakClientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
  },
  imports: {
    autoImport: true,
  }
})
