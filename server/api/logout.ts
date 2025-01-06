import { defineEventHandler, deleteCookie, createError } from 'h3'

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
	
	// Clear auth cookies
	deleteCookie(event, 'auth_user', {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax'
	})
	deleteCookie(event, 'auth_tokens', {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax'
	})
	
	const logoutUrl = new URL(`${keycloakBaseUrl}realms/${realm}/protocol/openid-connect/logout`)
	logoutUrl.searchParams.append('client_id', clientId)
	logoutUrl.searchParams.append('post_logout_redirect_uri', redirectUri)
	
	console.log('Logout URL generated:', {
		url: logoutUrl.toString(),
		clientId,
		redirectUri,
		realm
	})
	
	return { url: logoutUrl.toString() }
})