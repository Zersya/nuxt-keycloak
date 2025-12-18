import { H3Event, getCookie, createError } from 'h3'

interface AuthUser {
  sub: string
  email?: string
  name?: string
  preferred_username?: string
  [key: string]: any
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
  idToken?: string
}

interface AuthSession {
  user: AuthUser
  tokens: AuthTokens
}

/**
 * Get the current auth session from cookies
 * Returns null if not authenticated
 */
export function getAuthSession(event: H3Event): AuthSession | null {
  const userCookie = getCookie(event, 'auth_user')
  const tokensCookie = getCookie(event, 'auth_tokens')

  if (!userCookie || !tokensCookie) {
    return null
  }

  try {
    const user = JSON.parse(userCookie) as AuthUser
    const tokens = JSON.parse(tokensCookie) as AuthTokens
    return { user, tokens }
  } catch {
    return null
  }
}

/**
 * Get access token from the current session
 * Returns null if not authenticated
 */
export function getAccessToken(event: H3Event): string | null {
  const session = getAuthSession(event)
  return session?.tokens.accessToken || null
}

/**
 * Require authentication - throws 401 if not authenticated
 * Use this in protected API routes
 */
export function requireAuth(event: H3Event): AuthSession {
  const session = getAuthSession(event)
  
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }

  return session
}

/**
 * Validate token with Keycloak (for critical operations)
 * This makes a request to Keycloak to verify the token is still valid
 */
export async function validateTokenWithKeycloak(event: H3Event): Promise<AuthUser | null> {
  const session = getAuthSession(event)
  
  if (!session) {
    return null
  }

  const config = useRuntimeConfig()
  const keycloakBaseUrl = config.public.keycloakUrl.endsWith('/')
    ? config.public.keycloakUrl
    : `${config.public.keycloakUrl}/`
  const realm = config.public.keycloakRealm

  try {
    const userInfoEndpoint = `${keycloakBaseUrl}realms/${realm}/protocol/openid-connect/userinfo`
    const userInfo = await $fetch<AuthUser>(userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${session.tokens.accessToken}`
      }
    })
    return userInfo
  } catch {
    return null
  }
}

/**
 * Require valid Keycloak session (validates with Keycloak server)
 * Use this for sensitive operations that need real-time validation
 */
export async function requireValidSession(event: H3Event): Promise<AuthUser> {
  const user = await validateTokenWithKeycloak(event)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Session expired or invalid'
    })
  }

  return user
}
