import { defineEventHandler, getQuery, createError, setCookie, sendRedirect } from 'h3'

interface TokenResponse {
	access_token: string;
	refresh_token: string;
}

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	
	// Check if Keycloak is enabled
	if (config.public.keycloakDisabled === 'true') {
		throw createError({
			statusCode: 400,
			message: 'Keycloak authentication is disabled'
		})
	}

	const query = getQuery(event)
	const { code, state } = query
	
	if (!code) {
		throw createError({
			statusCode: 400,
			message: 'Authorization code is missing'
		})
	}

	// Ensure URLs are properly formatted
	const keycloakBaseUrl = config.public.keycloakUrl.endsWith('/') 
		? config.public.keycloakUrl 
		: `${config.public.keycloakUrl}/`
	
	const realm = config.public.keycloakRealm
	const clientId = config.public.keycloakClientId
	const clientSecret = config.keycloakClientSecret
	const redirectUri = `${config.public.baseUrl}api/auth/keycloak/callback`

	const tokenEndpoint = `${keycloakBaseUrl}realms/${realm}/protocol/openid-connect/token`
	
	try {
		console.log('Token exchange parameters:', {
			endpoint: tokenEndpoint,
			clientId,
			redirectUri,
			realm
		})

		const formData = new URLSearchParams({
			grant_type: 'authorization_code',
			client_id: clientId,
			client_secret: clientSecret,
			code: code.toString(),
			redirect_uri: redirectUri,
		})

		const tokenResponse = await $fetch<TokenResponse>(tokenEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: formData,
		})

		if (!tokenResponse || !tokenResponse.access_token) {
			console.error('Invalid token response:', tokenResponse)
			throw createError({
				statusCode: 401,
				message: 'Invalid token response from Keycloak'
			})
		}

		// Get user info
		const userInfoEndpoint = `${keycloakBaseUrl}realms/${realm}/protocol/openid-connect/userinfo`
		const userInfo = await $fetch(userInfoEndpoint, {
			headers: {
				'Authorization': `Bearer ${tokenResponse.access_token}`,
			},
		})

		// Set cookies with proper security settings
		setCookie(event, 'auth_user', JSON.stringify(userInfo), {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7, // 7 days
			path: '/'
		})

		setCookie(event, 'auth_tokens', JSON.stringify({
			accessToken: tokenResponse.access_token,
			refreshToken: tokenResponse.refresh_token
		}), {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7, // 7 days
			path: '/'
		})

		return sendRedirect(event, '/')
		
	} catch (error: any) {
		console.error('Authentication error:', {
			message: error.message,
			status: error.status,
			response: error.response,
			data: error.data
		})
		
		throw createError({
			statusCode: 401,
			message: `Failed to authenticate with Keycloak: ${error.message}`,
			cause: error
		})
	}
})