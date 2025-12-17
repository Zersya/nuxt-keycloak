import { defineEventHandler, deleteCookie, getCookie, createError } from 'h3'

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
	const redirectUri = `${config.public.baseUrl}`
	
	// Get id_token for proper Keycloak logout (ends SSO session)
	let idToken = ''
	const tokensCookie = getCookie(event, 'auth_tokens')
	if (tokensCookie) {
		try {
			const tokens = JSON.parse(tokensCookie)
			idToken = tokens.idToken || ''
		} catch (e) {
			// Ignore parse errors
		}
	}
	
	// Clear auth cookies
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
	
	const logoutUrl = new URL(`${keycloakBaseUrl}realms/${realm}/protocol/openid-connect/logout`)
	logoutUrl.searchParams.append('client_id', clientId)
	logoutUrl.searchParams.append('post_logout_redirect_uri', redirectUri)
	
	// Include id_token_hint for proper SSO logout
	// This ensures Keycloak ends the SSO session, not just this client's session
	if (idToken) {
		logoutUrl.searchParams.append('id_token_hint', idToken)
	}
	
	console.log('Logout URL generated:', {
		url: logoutUrl.toString(),
		clientId,
		redirectUri,
		realm,
		hasIdToken: !!idToken
	})
	
	return { url: logoutUrl.toString() }
})