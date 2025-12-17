import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (config.public.keycloakDisabled === 'true') {
    throw createError({
      statusCode: 400,
      message: 'Keycloak authentication is disabled'
    })
  }

  const keycloakBaseUrl = config.public.keycloakUrl.endsWith('/')
    ? config.public.keycloakUrl
    : `${config.public.keycloakUrl}/`
  const realm = config.public.keycloakRealm
  const clientId = config.public.keycloakClientId
  const redirectUri = `${config.public.baseUrl}api/auth/keycloak/callback`

  // Build auth URL with prompt=none for silent SSO check
  const authUrl = new URL(`${keycloakBaseUrl}realms/${realm}/protocol/openid-connect/auth`)

  authUrl.searchParams.append('client_id', clientId)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('scope', 'openid profile email')
  authUrl.searchParams.append('redirect_uri', redirectUri)
  authUrl.searchParams.append('prompt', 'none') // Silent check - no login screen

  const state = Math.random().toString(36).substring(7)
  authUrl.searchParams.append('state', state)

  return { url: authUrl.toString() }
})
