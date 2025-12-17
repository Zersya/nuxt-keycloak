export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware on server side
  if (import.meta.server) {
    return
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/sso-login']
  
  if (publicRoutes.includes(to.path)) {
    return
  }

  // Validate session with Keycloak (not just local cookies)
  // This ensures logout from other domains is detected
  try {
    const response = await $fetch('/api/auth/validate')
    if (!response.valid) {
      return navigateTo('/sso-login')
    }
  } catch (error) {
    // Session invalid or expired - redirect to SSO login
    return navigateTo('/sso-login')
  }
})
  