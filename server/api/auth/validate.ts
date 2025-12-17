import { defineEventHandler, getCookie, deleteCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const tokensCookie = getCookie(event, 'auth_tokens')
  
  if (!tokensCookie) {
    throw createError({
      statusCode: 401,
      message: 'No session found'
    })
  }

  try {
    const tokens = JSON.parse(tokensCookie)
    
    if (!tokens.accessToken) {
      throw createError({
        statusCode: 401,
        message: 'Invalid session'
      })
    }

    const keycloakBaseUrl = config.public.keycloakUrl.endsWith('/')
      ? config.public.keycloakUrl
      : `${config.public.keycloakUrl}/`
    const realm = config.public.keycloakRealm

    // Validate token with Keycloak's userinfo endpoint
    // This will fail if the SSO session was terminated
    const userInfoEndpoint = `${keycloakBaseUrl}realms/${realm}/protocol/openid-connect/userinfo`
    
    const userInfo = await $fetch(userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    }).catch((error) => {
      console.log('Token validation failed:', error.status || error.statusCode)
      return null
    })

    if (!userInfo) {
      // Token is invalid or SSO session ended - clear local cookies
      deleteCookie(event, 'auth_user', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      deleteCookie(event, 'auth_tokens', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      
      throw createError({
        statusCode: 401,
        message: 'Session expired or logged out from another device'
      })
    }

    return {
      valid: true,
      user: userInfo
    }
  } catch (error: any) {
    if (error.statusCode === 401) {
      throw error
    }
    
    throw createError({
      statusCode: 401,
      message: 'Session validation failed'
    })
  }
})
