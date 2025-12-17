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

  // Check authentication status
  try {
    const response = await $fetch('/api/auth/user')
    if (!response.user) {
      // Redirect to SSO login for automatic cross-client authentication
      return navigateTo('/sso-login')
    }
  } catch (error) {
    // Redirect to SSO login for automatic cross-client authentication
    return navigateTo('/sso-login')
  }
})
  