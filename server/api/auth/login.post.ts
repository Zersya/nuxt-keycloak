import { defineEventHandler, readBody, createError, setCookie } from 'h3'

interface LoginRequest {
  email: string
  password: string
}

interface TokenResponse {
  access_token: string
  refresh_token: string
  id_token: string
  expires_in: number
  refresh_expires_in: number
  token_type: string
  error?: string
  error_description?: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (config.public.keycloakDisabled === 'true') {
    throw createError({
      statusCode: 400,
      message: 'Keycloak authentication is disabled'
    })
  }

  const body = await readBody<LoginRequest>(event)

  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required'
    })
  }

  const keycloakBaseUrl = config.public.keycloakUrl.endsWith('/')
    ? config.public.keycloakUrl
    : `${config.public.keycloakUrl}/`
  const realm = config.public.keycloakRealm
  const clientId = config.public.keycloakClientId
  const clientSecret = config.keycloakClientSecret

  const tokenEndpoint = `${keycloakBaseUrl}realms/${realm}/protocol/openid-connect/token`

  try {
    const formData = new URLSearchParams({
      grant_type: 'password',
      client_id: clientId,
      username: body.email,
      password: body.password,
      scope: 'openid profile email'
    })

    // Only add client_secret if it's configured (for confidential clients)
    if (clientSecret) {
      formData.append('client_secret', clientSecret)
    }

    console.log('Attempting ROPC login to:', tokenEndpoint)

    const tokenResponse = await $fetch<TokenResponse>(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    }).catch((err) => {
      console.error('Token request failed:', err.data || err.message)
      throw err
    })

    if (!tokenResponse || !tokenResponse.access_token) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials'
      })
    }

    // Get user info
    const userInfoEndpoint = `${keycloakBaseUrl}realms/${realm}/protocol/openid-connect/userinfo`
    const userInfo = await $fetch(userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`
      }
    })

    // Set cookies with proper security settings
    setCookie(event, 'auth_user', JSON.stringify(userInfo), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    setCookie(event, 'auth_tokens', JSON.stringify({
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      idToken: tokenResponse.id_token
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    return {
      success: true,
      user: userInfo
    }
  } catch (error: any) {
    console.error('Login error details:', {
      message: error.message,
      data: error.data,
      status: error.status || error.statusCode
    })

    // Check for specific Keycloak errors
    const errorData = error.data || {}
    
    if (errorData.error === 'invalid_grant') {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password'
      })
    }

    if (errorData.error === 'unauthorized_client') {
      throw createError({
        statusCode: 403,
        message: 'Direct Access Grants not enabled. Please use SSO login.'
      })
    }

    if (error.status === 401 || error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password'
      })
    }

    throw createError({
      statusCode: 500,
      message: errorData.error_description || 'Authentication failed. Please try again.'
    })
  }
})
